import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import { prisma } from '../../lib/prisma'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'
import { getPaginationParams } from '../_utils/route'
import { errorMessage, jsonError, logError } from '../_utils/http'

const PRODUCT_DESCRIPTION_MAX_LENGTH = 400

function getErrorCode(error: unknown) {
    if (typeof error === 'object' && error !== null && 'code' in error) {
        return String((error as { code?: unknown }).code || '')
    }

    return ''
}

function parseProductDetails(raw: FormDataEntryValue) {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : JSON.parse(String(raw))
    return Array.isArray(parsed) ? parsed : []
}

type ProductInput = {
    title: string
    price: number
    promotionPrice?: number | string | null
    stock: number
    image: string
    description?: string
    negocioId?: number
    categoryId?: number
    category?: string
    details?: { label: string; value: string }[]
}

function toPromotionPriceDecimal(value: number | string | null | undefined) {
    if (value === undefined) return undefined
    if (value === null || value === '') return null

    const raw = String(value).trim()
    if (raw === '') return null

    return new Prisma.Decimal(raw)
}

export async function POST(req: Request) {
    try {
        let body: Partial<ProductInput> = {}
        let uploadedImageUrl: string | null = null

        const contentType = req.headers.get('content-type') || ''
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            body = {
                title: String(formData.get('title') || ''),
                description: String(formData.get('description') || ''),
                price: Number(formData.get('price')),
                promotionPrice: formData.get('promotionPrice') ? Number(formData.get('promotionPrice')) : undefined,
                stock: Number(formData.get('stock')),
                negocioId: Number(formData.get('negocioId')),
                // category handled below
                category: typeof formData.get('category') === 'string' ? String(formData.get('category')) : undefined,
            }

            const fdDetails = formData.get('details')
            if (fdDetails) {
                try {
                    body.details = parseProductDetails(fdDetails)
                } catch {
                    // ignore parse errors and leave details undefined
                }
            }

            const file = formData.get('imageFile')
            if (file instanceof File && typeof file.arrayBuffer === 'function') {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                if (!process.env.CLOUDINARY_URL) {
                    console.error('CLOUDINARY_URL not set; cannot upload image')
                    return NextResponse.json({ error: 'Server misconfiguration: CLOUDINARY_URL not set' }, { status: 500 })
                }

                try {
                    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                    uploadedImageUrl = await new Promise<string>((resolve, reject) => {
                        const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'bazarcito' }, (error, result) => {
                            if (error) return reject(error)
                            if (!result?.secure_url) return reject(new Error('Cloudinary upload did not return secure_url'))
                            return resolve(result.secure_url)
                        })
                        Readable.from(buffer).pipe(uploadStream)
                    })
                } catch (error: unknown) {
                    console.error('Cloudinary upload error:', error)
                    return NextResponse.json({ error: `Image upload failed: ${errorMessage(error)}` }, { status: 500 })
                }
            }
        } else {
            body = (await req.json()) as Partial<ProductInput>
        }

        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        const { title, price, stock, image, negocioId, categoryId, details } = body
        const description = typeof body.description === 'string' ? body.description : ''

        if (!title || price == null || stock == null || !image || negocioId == null || Number.isNaN(Number(negocioId)) || (categoryId == null && !body.category) || !description) {
            return NextResponse.json({ error: 'Missing required fields: include negocioId, categoryId or category name, and description' }, { status: 400 })
        }

        if (description.length > PRODUCT_DESCRIPTION_MAX_LENGTH) {
            return jsonError(`La descripción es muy larga. Máximo ${PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres.`, 400)
        }

        const negocioIdNum = Number(negocioId)
        const categoryIdNum = categoryId != null ? Number(categoryId) : null
        const categoryName = typeof body.category === 'string' && body.category.trim() !== '' ? body.category.trim() : null

        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        let created = null
        try {
            const negocioExists = await prisma.$queryRaw<Array<{ id: number }>>`
                SELECT id
                FROM Negocio
                WHERE id = ${negocioIdNum}
                LIMIT 1
            `

            if (!negocioExists.length) {
                return jsonError(`Negocio with id=${negocioIdNum} not found`, 400)
            }

            if (categoryName) {
                created = await prisma.product.create({
                    data: {
                        title,
                        price: Number(price),
                        promotionPrice: toPromotionPriceDecimal(body.promotionPrice),
                        stock: Number(stock),
                        image: body.image ?? image,
                        description: description,
                        details: Array.isArray(details) ? details : [],
                        category: {
                            connectOrCreate: {
                                where: { name: categoryName },
                                create: { name: categoryName },
                            },
                        },
                    },
                })
            } else {
                let categoryExists = null
                try {
                    categoryExists = await prisma.category.findUnique({ where: { id: Number(categoryIdNum) } })
                } catch (error: unknown) {
                    logError('Prisma findUnique error:', error)
                    return jsonError('Database error during category lookup', 500, errorMessage(error))
                }

                if (!categoryExists) {
                    return jsonError(`Category with id=${categoryIdNum} not found`, 400)
                }

                created = await prisma.product.create({
                    data: {
                        title,
                        price: Number(price),
                        promotionPrice: toPromotionPriceDecimal(body.promotionPrice),
                        stock: Number(stock),
                        image,
                        description: description,
                        details: Array.isArray(details) ? details : [],
                        category: { connect: { id: Number(categoryIdNum) } },
                    },
                })
            }

            if (created?.id != null) {
                await prisma.$executeRaw`
                    UPDATE Product
                    SET negocioId = ${negocioIdNum}
                    WHERE id = ${created.id}
                `
                created = { ...created, negocioId: negocioIdNum }
            }
        } catch (error: unknown) {
            logError('Prisma create error:', error)
            const msg = errorMessage(error)
            const code = getErrorCode(error)
            if (msg.includes('insecure transport') || msg.includes('Connections using insecure transport')) {
                return jsonError('Database connection rejected insecure transport (SSL required). Update your DATABASE_URL to use TLS/SSL.', 502, msg)
            }
            if (code === 'P2000' || (msg.toLowerCase().includes('too long for column') && msg.toLowerCase().includes('description'))) {
                return jsonError(`La descripción es muy larga. Máximo ${PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres.`, 400)
            }
            return jsonError('Database error during product creation', 500, msg)
        }

        return NextResponse.json(created, { status: 201 })
    } catch (error: unknown) {
        logError('Create product error (outer):', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}

export async function GET(req: Request) {
    try {
        if (!process.env.DATABASE_URL) {
            console.error('GET /api/products - missing DATABASE_URL')
            return NextResponse.json({ error: 'Server misconfiguration: DATABASE_URL not set' }, { status: 500 })
        }

        const url = new URL(req.url)
        const category = url.searchParams.get('category') || undefined
        const negocioIdParam = url.searchParams.get('negocioId')
        const { take, skip } = getPaginationParams(req)

        if (negocioIdParam != null && Number.isNaN(Number(negocioIdParam))) {
            return jsonError('negocioId must be a valid number', 400)
        }

        const negocioId = negocioIdParam != null ? Number(negocioIdParam) : undefined

        const where = category ? { category: { name: category } } : undefined

        if (negocioId != null) {
            const rows = category
                ? await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    LEFT JOIN Category c ON c.id = p.categoryId
                    WHERE p.negocioId = ${negocioId} AND c.name = ${category}
                    ORDER BY p.createdAt DESC
                    LIMIT ${take} OFFSET ${skip}
                `)
                : await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
                    SELECT p.id
                    FROM Product p
                    WHERE p.negocioId = ${negocioId}
                    ORDER BY p.createdAt DESC
                    LIMIT ${take} OFFSET ${skip}
                `)

            if (!rows.length) {
                return NextResponse.json({ data: [] })
            }

            const ids = rows.map((row) => row.id)
            const products = await prisma.product.findMany({
                where: { id: { in: ids } },
                include: { category: true },
                orderBy: { createdAt: 'desc' },
            })

            return NextResponse.json({ data: products })
        }

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        })

        return NextResponse.json({ data: products })
    } catch (error: unknown) {
        const msg = errorMessage(error)
        logError('Get products error:', error)

        if (msg.includes('P1001') || msg.toLowerCase().includes('could not connect') || msg.toLowerCase().includes('connect')) {
            console.warn('Database unreachable, returning empty product list to client:', msg)
            return NextResponse.json({ data: [], warning: 'Database unreachable, returning empty list' }, { status: 200 })
        }

        return jsonError('Failed to fetch products', 500, msg)
    }
}
