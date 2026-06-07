/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, type NextRequest } from 'next/server'
import cloudinary from 'cloudinary'
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

async function findCatalog(id: number, negocioId?: number) {
    const rows = negocioId != null
        ? await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
            SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
            FROM Catalogo
            WHERE id = ${id} AND negocioId = ${negocioId}
            LIMIT 1
        `
        : await prisma.$queryRaw<Array<{ id: number; name: string; categoria: string | null; image: string; imagePublicId: string | null; negocioId: number | null; createdAt: Date }>>`
            SELECT id, name, categoria, image, imagePublicId, negocioId, createdAt
            FROM Catalogo
            WHERE id = ${id}
            LIMIT 1
        `

    return rows[0] ?? null
}

async function deleteCloudinaryAsset(publicId: string) {
    if (!process.env.CLOUDINARY_URL) return
    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })

    const destroy = (resourceType?: 'image' | 'raw') => new Promise<void>((resolve) => {
        cloudinary.v2.uploader.destroy(publicId, resourceType ? { resource_type: resourceType } : undefined, () => resolve())
    })

    await destroy()
    await destroy('raw')
}

export async function GET(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const negocioId = parseNegocioId(new URL(req.url).searchParams.get('negocioId'))
        if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        if (negocioId === null) return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })

        const item = await findCatalog(id, negocioId ?? undefined)
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ data: item })
    } catch (error) {
        console.error('GET /api/catalog/[id] error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        return NextResponse.json({ error: 'Failed to read catalog' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const negocioId = parseNegocioId(new URL(req.url).searchParams.get('negocioId'))
        if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        if (negocioId === null) return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })

        const item = await findCatalog(id, negocioId ?? undefined)
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        if (item.imagePublicId) {
            try {
                await deleteCloudinaryAsset(item.imagePublicId)
            } catch (error) {
                console.warn('Failed to remove catalog asset from Cloudinary', error)
            }
        }

        await prisma.$executeRaw`
            DELETE FROM Catalogo
            WHERE id = ${id}
        `

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('DELETE /api/catalog/[id] error', error)
        if (isMissingCatalogTableError(error)) {
            return NextResponse.json({ error: 'La tabla Catalogo aún no existe en la base de datos. Aplica la migración antes de usar esta vista.' }, { status: 503 })
        }
        return NextResponse.json({ error: 'Failed to delete catalog' }, { status: 500 })
    }
}
