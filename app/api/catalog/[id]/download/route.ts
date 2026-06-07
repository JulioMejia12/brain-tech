import cloudinary from 'cloudinary'
import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'

function parseNegocioId(value: string | null) {
    if (value == null || value.trim() === '') {
        return undefined
    }

    const parsed = Number(value)
    return Number.isNaN(parsed) ? null : parsed
}

function isMissingCatalogTableError(error: unknown) {
    const message = String((error as { message?: string })?.message || '')
    return message.includes('Catalogo') && (message.includes("doesn't exist") || message.includes('does not exist') || message.includes('1146'))
}

function safeFileName(name: string, contentType: string | null) {
    const sanitized = name.trim().replace(/[^a-zA-Z0-9-_\.]+/g, '-') || 'catalogo'
    if (/\.[a-z0-9]+$/i.test(sanitized)) return sanitized
    if (contentType?.includes('pdf')) return `${sanitized}.pdf`
    if (contentType?.includes('png')) return `${sanitized}.png`
    if (contentType?.includes('jpeg')) return `${sanitized}.jpg`
    if (contentType?.includes('webp')) return `${sanitized}.webp`
    return sanitized
}

function fileNameFromDisposition(value: string | null) {
    if (!value) return null

    const utf8Match = value.match(/filename\*=UTF-8''([^;]+)/i)
    if (utf8Match?.[1]) {
        try {
            return decodeURIComponent(utf8Match[1])
        } catch {
            return utf8Match[1]
        }
    }

    const basicMatch = value.match(/filename="?([^";]+)"?/i)
    return basicMatch?.[1] || null
}

function extensionFromUrl(value: string) {
    try {
        const url = new URL(value)
        const pathname = url.pathname.toLowerCase()
        const match = pathname.match(/\.([a-z0-9]{2,8})(?:$|\?)/i)
        return match?.[1] || null
    } catch {
        const match = value.toLowerCase().match(/\.([a-z0-9]{2,8})(?:$|\?)/i)
        return match?.[1] || null
    }
}

function safeDownloadName(baseName: string, contentType: string | null, sourceUrl: string, upstreamDisposition: string | null) {
    const upstreamFileName = fileNameFromDisposition(upstreamDisposition)
    if (upstreamFileName) return upstreamFileName

    const extension = contentType?.includes('pdf')
        ? 'pdf'
        : contentType?.includes('png')
            ? 'png'
            : contentType?.includes('jpeg')
                ? 'jpg'
                : contentType?.includes('webp')
                    ? 'webp'
                    : extensionFromUrl(sourceUrl)

    const normalized = safeFileName(baseName, contentType)
    if (/\.[a-z0-9]+$/i.test(normalized) || !extension) return normalized
    return `${normalized}.${extension}`
}

function getCloudinaryAssetParts(publicId: string | null | undefined) {
    const normalized = String(publicId || '').trim()
    if (!normalized) return null

    const match = normalized.match(/^(.*)\.([a-z0-9]{2,8})$/i)
    if (!match) {
        return { publicId: normalized, format: undefined }
    }

    return {
        publicId: match[1],
        format: match[2].toLowerCase(),
    }
}

function isPdfAsset(name: string, image: string, publicId?: string | null) {
    return /\.pdf($|\?)/i.test(name) || /\.pdf($|\?)/i.test(image) || /\.pdf$/i.test(String(publicId || ''))
}

function buildSignedDownloadUrls(publicId: string) {
    if (!process.env.CLOUDINARY_URL) {
        return [] as string[]
    }

    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })

    const exactPublicId = String(publicId || '').trim()
    const parsed = getCloudinaryAssetParts(exactPublicId)
    const candidates = new Set<string>()
    const privateDownloadUrl = cloudinary.v2.utils.private_download_url as unknown as (
        publicId: string,
        format?: string,
        options?: Record<string, unknown>
    ) => string
    const build = (candidatePublicId: string, format?: string, resourceType: 'raw' | 'image' = 'raw') => {
        try {
            const url = privateDownloadUrl(candidatePublicId, format, {
                resource_type: resourceType,
                type: 'upload',
                attachment: true,
                expires_at: Math.floor(Date.now() / 1000) + 60,
            })
            if (url) candidates.add(String(url))
        } catch {
            // ignore invalid candidate
        }
    }

    if (exactPublicId) {
        build(exactPublicId, undefined, 'raw')
        build(exactPublicId, undefined, 'image')
    }

    if (parsed?.publicId && parsed?.format) {
        build(parsed.publicId, parsed.format, 'raw')
        build(parsed.publicId, parsed.format, 'image')
    }

    return Array.from(candidates)
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const requestUrl = new URL(req.url)
        const negocioId = parseNegocioId(requestUrl.searchParams.get('negocioId'))
        const dispositionMode = requestUrl.searchParams.get('disposition') === 'inline' ? 'inline' : 'attachment'
        if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        if (negocioId === null) return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })

        const rows = negocioId != null
            ? await prisma.$queryRaw<Array<{ name: string; image: string; imagePublicId: string | null }>>`
                SELECT name, image, imagePublicId
                FROM Catalogo
                WHERE id = ${id} AND negocioId = ${negocioId}
                LIMIT 1
            `
            : await prisma.$queryRaw<Array<{ name: string; image: string; imagePublicId: string | null }>>`
                SELECT name, image, imagePublicId
                FROM Catalogo
                WHERE id = ${id}
                LIMIT 1
            `

        const item = rows[0]
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const shouldUseSignedPdfDownload = dispositionMode === 'attachment' && isPdfAsset(item.name, item.image, item.imagePublicId)

        if (shouldUseSignedPdfDownload && item.imagePublicId) {
            const signedUrls = buildSignedDownloadUrls(item.imagePublicId)
            for (const signedUrl of signedUrls) {
                const signedResponse = await fetch(signedUrl, { redirect: 'follow' })
                if (!signedResponse.ok || !signedResponse.body) {
                    continue
                }

                const signedType = signedResponse.headers.get('content-type') || 'application/pdf'
                const signedLength = signedResponse.headers.get('content-length')
                const fileName = safeDownloadName(item.name, signedType, signedResponse.url || item.image, signedResponse.headers.get('content-disposition'))

                return new Response(signedResponse.body, {
                    status: 200,
                    headers: {
                        'Content-Type': signedType,
                        'Content-Disposition': `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                        'Cache-Control': 'no-store',
                        ...(signedLength ? { 'Content-Length': signedLength } : {}),
                    },
                })
            }
        }

        const upstream = await fetch(item.image, { redirect: 'follow' })
        if (!upstream.ok) {
            return NextResponse.redirect(item.image)
        }

        const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
        const upstreamDisposition = upstream.headers.get('content-disposition')
        const fileName = safeDownloadName(item.name, contentType, upstream.url || item.image, upstreamDisposition)
        const contentLength = upstream.headers.get('content-length')

        if (!upstream.body) {
            return NextResponse.redirect(item.image)
        }

        return new Response(upstream.body, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `${dispositionMode}; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
                'Cache-Control': 'no-store',
                ...(contentLength ? { 'Content-Length': contentLength } : {}),
            },
        })
    } catch (error) {
        console.error('GET /api/catalog/[id]/download error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        return NextResponse.json({ error: 'Failed to download catalog' }, { status: 500 })
    }
}
