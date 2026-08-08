/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'
import { PDFDocument } from 'pdf-lib'
import { Readable } from 'stream'
import { prisma } from '@/app/lib/prisma'

const MAX_CATALOG_PART_SIZE = 9 * 1024 * 1024

function bufferLooksLikePdf(buffer: Buffer) {
    try {
        return buffer.subarray(0, 5).toString('utf8') === '%PDF-'
    } catch {
        return false
    }
}

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

async function ensureNegocioExists(negocioId: number) {
    const rows = await prisma.$queryRaw<Array<{ id: number }>>`
        SELECT id
        FROM Negocio
        WHERE id = ${negocioId}
        LIMIT 1
    `

    return rows.length > 0
}

async function buildPdfFromPages(source: PDFDocument, pageIndexes: number[]) {
    const pdf = await PDFDocument.create()
    const pages = await pdf.copyPages(source, pageIndexes)
    pages.forEach((page) => pdf.addPage(page))
    return pdf.save()
}

async function splitPdfIntoParts(buffer: Buffer, maxPartBytes: number) {
    const source = await PDFDocument.load(buffer)
    const totalPages = source.getPageCount()
    const parts: Uint8Array[] = []
    let currentIndexes: number[] = []

    for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
        const nextIndexes = [...currentIndexes, pageIndex]
        const nextBytes = await buildPdfFromPages(source, nextIndexes)

        if (nextBytes.length > maxPartBytes && currentIndexes.length > 0) {
            parts.push(await buildPdfFromPages(source, currentIndexes))
            currentIndexes = [pageIndex]
            continue
        }

        if (nextBytes.length > maxPartBytes) {
            parts.push(nextBytes)
            currentIndexes = []
            continue
        }

        currentIndexes = nextIndexes
    }

    if (currentIndexes.length > 0) {
        parts.push(await buildPdfFromPages(source, currentIndexes))
    }

    return parts.length > 0 ? parts : [buffer]
}

async function uploadCatalogAsset(buffer: Buffer, options: { isPdf: boolean; safeBaseName: string }) {
    if (!process.env.CLOUDINARY_URL) {
        throw new Error('CLOUDINARY_URL no está configurado')
    }

    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })

    const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
            {
                folder: 'catalogos',
                resource_type: options.isPdf ? 'raw' : 'image',
                public_id: options.isPdf ? `${options.safeBaseName}.pdf` : options.safeBaseName,
            },
            (error, result) => {
                if (error) return reject(error)
                if (!result) return reject(new Error('Missing upload result'))
                resolve(result)
            }
        )
        Readable.from(buffer).pipe(uploadStream)
    })

    return {
        image: String(uploadResult.secure_url || ''),
        imagePublicId: String(uploadResult.public_id || '') || null,
    }
}

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const negocioId = parseNegocioId(url.searchParams.get('negocioId'))
        if (negocioId === null) {
            return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })
        }

        const rows = negocioId != null
            ? await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
                SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
                FROM Catalogo
                WHERE negocioId = ${negocioId}
                ORDER BY createdAt DESC
            `
            : await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
                SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
                FROM Catalogo
                ORDER BY createdAt DESC
            `

        return NextResponse.json({ data: rows })
    } catch (error) {
        console.error('GET /api/catalog error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        return NextResponse.json({ error: 'Failed to read catalogs' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || ''
        let name = ''
        let categoria = ''
        let negocioId: number | undefined | null = undefined
        let file: any = null

        if (contentType.includes('application/json')) {
            const body = await req.json().catch(() => ({})) as any
            name = String(body.name || '').trim()
            categoria = String(body.categoria || '').trim()
            negocioId = parseNegocioId(String(body.negocioId || ''))
        } else if (contentType.includes('multipart/form-data')) {
            const form = await req.formData()
            name = String(form.get('name') || '').trim()
            categoria = String(form.get('categoria') || '').trim()
            negocioId = parseNegocioId(String(form.get('negocioId') || ''))
            file = form.get('file')
        } else {
            return NextResponse.json({ error: 'Unsupported Content-Type. Use multipart/form-data or application/json' }, { status: 400 })
        }

        if (!name) {
            return NextResponse.json({ error: 'El nombre del catálogo es requerido' }, { status: 400 })
        }

        if (!categoria) {
            return NextResponse.json({ error: 'La categoría del catálogo es requerida' }, { status: 400 })
        }

        if (negocioId === null) {
            return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })
        }

        if (negocioId == null) {
            return NextResponse.json({ error: 'negocioId es requerido' }, { status: 400 })
        }

        // If no file provided, create catalog entry without an uploaded asset

        if (!(await ensureNegocioExists(negocioId))) {
            return NextResponse.json({ error: `Negocio with id=${negocioId} not found` }, { status: 400 })
        }

        let createdItems: Array<{ id?: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt?: Date }> = []

        if (file && typeof (file as any).arrayBuffer === 'function') {
            const buffer = Buffer.from(await (file as any).arrayBuffer())
            const isPdf = (file as any).type === 'application/pdf'
                || String((file as any).name || '').toLowerCase().endsWith('.pdf')
                || bufferLooksLikePdf(buffer)

            const isImage = String((file as any).type || '').startsWith('image/')
            if (!isPdf && !isImage) {
                return NextResponse.json({
                    error: 'Archivo no soportado. Adjunta una imagen o PDF válido.',
                }, { status: 400 })
            }

            const safeBaseName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 60)}`

            let partBuffers: Array<Uint8Array | Buffer> = [buffer]
            if (isPdf && buffer.length > MAX_CATALOG_PART_SIZE) {
                try {
                    partBuffers = await splitPdfIntoParts(buffer, MAX_CATALOG_PART_SIZE)
                } catch (splitError) {
                    console.warn('POST /api/catalog splitPdfIntoParts failed, uploading original PDF without splitting', splitError)
                    partBuffers = [buffer]
                }
            }

            for (let index = 0; index < partBuffers.length; index += 1) {
                const hasMultipleParts = partBuffers.length > 1
                const partNumber = index + 1
                const partName = hasMultipleParts ? `${name} - Parte ${partNumber}` : name
                const partSafeBaseName = hasMultipleParts ? `${safeBaseName}-parte-${partNumber}` : safeBaseName
                const uploaded = await uploadCatalogAsset(Buffer.from(partBuffers[index]), {
                    isPdf,
                    safeBaseName: partSafeBaseName,
                })

                await prisma.$executeRaw`
                    INSERT INTO Catalogo (name, image, imagePublicId, negocioId, createdAt, categoria)
                    VALUES (${partName}, ${uploaded.image}, ${uploaded.imagePublicId}, ${negocioId}, NOW(), ${categoria})
                `

                const rows = await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
                    SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
                    FROM Catalogo
                    WHERE negocioId = ${negocioId} AND image = ${uploaded.image}
                    ORDER BY id DESC
                    LIMIT 1
                `

                createdItems.push(rows[0] ?? {
                    name: partName,
                    categoria,
                    image: uploaded.image,
                    imagePublicId: uploaded.imagePublicId,
                    negocioId,
                })
            }
        } else {
            // No file uploaded: create a catalog entry without an asset
            await prisma.$executeRaw`
                INSERT INTO Catalogo (name, image, imagePublicId, negocioId, createdAt, categoria)
                VALUES (${name}, '', NULL, ${negocioId}, NOW(), ${categoria})
            `

            const rows = await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
                SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
                FROM Catalogo
                WHERE negocioId = ${negocioId} AND name = ${name}
                ORDER BY id DESC
                LIMIT 1
            `

            const created = rows[0] ?? {
                name,
                categoria,
                image: '',
                imagePublicId: null,
                negocioId,
            }
            createdItems = [created]
        }

        return NextResponse.json({ data: createdItems[0] ?? null, items: createdItems, totalParts: createdItems.length }, { status: 201 })
    } catch (error) {
        console.error('POST /api/catalog error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        const message = error instanceof Error ? error.message : 'Failed to create catalog'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
