/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'
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

async function ensureNegocioExists(negocioId: number) {
    const rows = await prisma.$queryRaw<Array<{ id: number }>>`
        SELECT id
        FROM Negocio
        WHERE id = ${negocioId}
        LIMIT 1
    `

    return rows.length > 0
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
        if (!contentType.includes('multipart/form-data')) {
            return NextResponse.json({ error: 'Content-Type must be multipart/form-data' }, { status: 400 })
        }

        const form = await req.formData()
        const name = String(form.get('name') || '').trim()
        const categoria = String(form.get('categoria') || '').trim()
        const negocioId = parseNegocioId(String(form.get('negocioId') || ''))
        const file = form.get('file')

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

        if (!(file instanceof File) || typeof file.arrayBuffer !== 'function') {
            return NextResponse.json({ error: 'Debes adjuntar un archivo válido' }, { status: 400 })
        }

        if (!(await ensureNegocioExists(negocioId))) {
            return NextResponse.json({ error: `Negocio with id=${negocioId} not found` }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        let uploadedUrl = ''
        let uploadedPublicId: string | null = null
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
        const safeBaseName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9-_]+/g, '-').slice(0, 60)}`

        if (process.env.CLOUDINARY_URL) {
            cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
            const uploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.v2.uploader.upload_stream(
                    {
                        folder: 'catalogos',
                        resource_type: isPdf ? 'raw' : 'image',
                        public_id: isPdf ? `${safeBaseName}.pdf` : safeBaseName,
                    },
                    (error, result) => {
                        if (error) return reject(error)
                        if (!result) return reject(new Error('Missing upload result'))
                        resolve(result)
                    }
                )
                Readable.from(buffer).pipe(uploadStream)
            })

            uploadedUrl = String(uploadResult.secure_url || '')
            uploadedPublicId = String(uploadResult.public_id || '') || null
        } else {
            return NextResponse.json({ error: 'CLOUDINARY_URL no está configurado' }, { status: 500 })
        }

        await prisma.$executeRaw`
            INSERT INTO Catalogo (name, image, imagePublicId, negocioId, createdAt, categoria)
            VALUES (${name}, ${uploadedUrl}, ${uploadedPublicId}, ${negocioId}, NOW(), ${categoria})
        `

        const rows = await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
            SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
            FROM Catalogo
            WHERE negocioId = ${negocioId} AND image = ${uploadedUrl}
            ORDER BY id DESC
            LIMIT 1
        `

        return NextResponse.json({ data: rows[0] ?? { name, categoria, image: uploadedUrl, imagePublicId: uploadedPublicId, negocioId } }, { status: 201 })
    } catch (error) {
        console.error('POST /api/catalog error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        const message = error instanceof Error ? error.message : 'Failed to create catalog'
        return NextResponse.json({ error: message }, { status: 500 })
    }
}
