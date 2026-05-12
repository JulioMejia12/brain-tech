import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'
import { getPaginationParams } from '../_utils/route'
import { errorMessage, jsonError, logError } from '../_utils/http'

type ProductInput = {
    title: string
    price: number
    stock: number
    image: string
    description?: string
    categoryId?: number
    category?: string
    details?: { label: string; value: string }[]
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
                stock: Number(formData.get('stock')),
                // category handled below
                category: typeof formData.get('category') === 'string' ? String(formData.get('category')) : undefined,
            }

            const fdDetails = formData.get('details')
            if (fdDetails) {
                try {
                    const parsed = typeof fdDetails === 'string' ? JSON.parse(fdDetails) : JSON.parse(String(fdDetails))
                        ; (body as any).details = Array.isArray(parsed) ? parsed : []
                } catch (e) {
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
                } catch (e: any) {
                    console.error('Cloudinary upload error:', e)
                    return NextResponse.json({ error: `Image upload failed: ${String(e?.message || e)}` }, { status: 500 })
                }
            }
        } else {
            body = (await req.json()) as Partial<ProductInput>
        }

        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        const { title, price, stock, image, categoryId, details } = body
        const description = typeof body.description === 'string' ? body.description : ''

        if (!title || price == null || stock == null || !image || (categoryId == null && !body.category) || !description) {
            return NextResponse.json({ error: 'Missing required fields: include categoryId or category name and description' }, { status: 400 })
        }

        const categoryIdNum = categoryId != null ? Number(categoryId) : null
        const categoryName = typeof body.category === 'string' && body.category.trim() !== '' ? body.category.trim() : null

        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        let created = null
        try {
            if (categoryName) {
                created = await prisma.product.create({
                    data: {
                        title,
                        price: Number(price),
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
                        stock: Number(stock),
                        image,
                        description: description,
                        details: Array.isArray(details) ? details : [],
                        category: { connect: { id: Number(categoryIdNum) } },
                    },
                })
            }
        } catch (error: unknown) {
            logError('Prisma create error:', error)
            const msg = errorMessage(error)
            if (msg.includes('insecure transport') || msg.includes('Connections using insecure transport')) {
                return jsonError('Database connection rejected insecure transport (SSL required). Update your DATABASE_URL to use TLS/SSL.', 502, msg)
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
        const { take, skip } = getPaginationParams(req)

        const where = category ? { category: { name: category } } : undefined

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
