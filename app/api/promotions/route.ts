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

export async function GET(req: Request) {
    try {
        const url = new URL(req.url)
        const negocioId = parseNegocioId(url.searchParams.get('negocioId'))
        if (negocioId === null) {
            return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })
        }

        const prismaAny = prisma as any
        try {
            if (negocioId != null) {
                const ids = await prisma.$queryRaw<Array<{ id: number }>>`
                    SELECT id
                    FROM Promotion
                    WHERE negocioId = ${negocioId}
                    ORDER BY createdAt DESC
                `

                if (!ids.length) {
                    return NextResponse.json({ data: [] })
                }

                const items = await prismaAny.promotion.findMany({
                    where: { id: { in: ids.map((row) => row.id) } },
                    orderBy: { createdAt: 'desc' },
                })
                return NextResponse.json({ data: items })
            }

            const items = await prismaAny.promotion.findMany({ orderBy: { createdAt: 'desc' } })
            return NextResponse.json({ data: items })
        } catch (err: any) {
            const msg = String(err?.message || '')
            if (err?.code === 'P2022' || msg.includes('promotion.orientation') || msg.includes('orientation')) {
                console.warn('Prisma findMany failed due to missing orientation column; retrying without selecting orientation')
                let items: any[]
                if (negocioId != null) {
                    const ids = await prisma.$queryRaw<Array<{ id: number }>>`
                        SELECT id
                        FROM Promotion
                        WHERE negocioId = ${negocioId}
                        ORDER BY createdAt DESC
                    `

                    if (!ids.length) {
                        return NextResponse.json({ data: [] })
                    }

                    items = await prismaAny.promotion.findMany({
                        where: { id: { in: ids.map((row) => row.id) } },
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            specialPrice: true,
                            image: true,
                            imagePublicId: true,
                            createdAt: true,
                        },
                    })
                } else {
                    items = await prismaAny.promotion.findMany({
                        orderBy: { createdAt: 'desc' },
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            specialPrice: true,
                            image: true,
                            imagePublicId: true,
                            createdAt: true,
                        },
                    })
                }
                const mapped = items.map((it: any) => ({ ...it, orientation: 'HORIZONTAL' }))
                return NextResponse.json({ data: mapped })
            }
            throw err
        }
    } catch (e) {
        console.error('GET /api/promotions error', e)
        return NextResponse.json({ error: 'Failed to read promotions' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const contentType = req.headers.get('content-type') || ''
        let body: any = {}
        let uploadedImageUrl: string | null = null
        let uploadedImagePublicId: string | null = null

        if (contentType.includes('multipart/form-data')) {
            const form = await req.formData()
            body.name = String(form.get('name') || '').trim()
            body.description = String(form.get('description') || '').trim()
            body.specialPrice = String(form.get('specialPrice') || '').trim()
            body.orientation = String(form.get('orientation') || 'HORIZONTAL').trim()
            body.negocioId = parseNegocioId(String(form.get('negocioId') || ''))

            // Ensure only one image is provided
            const imageFiles = form.getAll('imageFile') || []
            if (imageFiles.length > 1) {
                return NextResponse.json({ error: 'Solo se permite una imagen' }, { status: 400 })
            }
            const file = form.get('imageFile')
            if (file instanceof File && typeof file.arrayBuffer === 'function') {
                const buffer = Buffer.from(await file.arrayBuffer())
                if (process.env.CLOUDINARY_URL) {
                    try {
                        cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                        const uploadResult = await new Promise<any>((resolve, reject) => {
                            const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'promotions' }, (error, result) => {
                                if (error) return reject(error)
                                if (!result) return reject(new Error('Missing upload result'))
                                resolve(result)
                            })
                            Readable.from(buffer).pipe(uploadStream)
                        })
                        uploadedImageUrl = uploadResult.secure_url
                        uploadedImagePublicId = uploadResult.public_id
                    } catch (e) {
                        console.error('Cloudinary upload failed', e)
                    }
                }
            }
        } else {
            body = await req.json().catch(() => ({}))
            body.negocioId = parseNegocioId(body?.negocioId != null ? String(body.negocioId) : null)
        }

        if (body.negocioId === null) {
            return NextResponse.json({ error: 'negocioId must be a valid number' }, { status: 400 })
        }

        if (body.negocioId == null) {
            return NextResponse.json({ error: 'negocioId es requerido' }, { status: 400 })
        }

        // Allow promotions created with only an image; textual fields default to empty strings
        const name = String(body.name || '').trim()
        const specialPrice = String(body.specialPrice || '').trim()
        const negocioId = body.negocioId != null ? Number(body.negocioId) : undefined

        const negocioRows = await prisma.$queryRaw<Array<{ id: number }>>`
            SELECT id
            FROM Negocio
            WHERE id = ${negocioId}
            LIMIT 1
        `

        if (!negocioRows.length) {
            return NextResponse.json({ error: `Negocio with id=${negocioId} not found` }, { status: 400 })
        }

        const prismaAny = prisma as any
        const createData = {
            name: name,
            description: String(body.description || '').trim(),
            specialPrice: specialPrice,
            image: uploadedImageUrl || (body.image ? String(body.image).trim() : ''),
            orientation: (body.orientation ? String(body.orientation).toUpperCase() : 'HORIZONTAL'),
            imagePublicId: uploadedImagePublicId || null,
        }

        console.debug('Creating promotion with data:', createData)

        let item: any
        try {
            item = await prismaAny.promotion.create({ data: createData })
        } catch (err: any) {
            const msg = String(err?.message || '')
            const code = String(err?.code || '')
            if (code === 'P2022' || msg.includes('orientation') || msg.includes('The column') || msg.includes("Unknown argument `orientation`")) {
                // Prisma schema not migrated yet or DB column missing: retry without orientation
                console.warn('Prisma create failed referencing orientation; retrying without orientation', { code, msg })
                const { orientation: _orientation, ...fallbackData } = createData as any
                item = await prismaAny.promotion.create({ data: fallbackData })
            } else {
                throw err
            }
        }

        if (item?.id != null) {
            await prisma.$executeRaw`
                UPDATE Promotion
                SET negocioId = ${negocioId}
                WHERE id = ${item.id}
            `
            item = { ...item, negocioId }
        }

        return NextResponse.json({ data: item }, { status: 201 })
    } catch (error) {
        console.error('POST /api/promotions error', error)
        const msg = error instanceof Error ? error.message : String(error)
        if (process.env.NODE_ENV !== 'production') {
            return NextResponse.json({ error: msg }, { status: 500 })
        }
        return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
    }
}
