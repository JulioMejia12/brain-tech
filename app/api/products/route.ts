import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'

type ProductInput = {
    title: string
    price: number
    stock: number
    image: string
    categoryId?: number
    category?: string
}

export async function POST(req: Request) {
    try {
        // Support both JSON (image is a URL) and multipart/form-data (image file upload)
        let body: Partial<ProductInput> = {}
        let uploadedImageUrl: string | null = null

        const contentType = req.headers.get('content-type') || ''
        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            body = {
                title: String(formData.get('title') || ''),
                price: Number(formData.get('price')),
                stock: Number(formData.get('stock')),
                // category handled below
                category: typeof formData.get('category') === 'string' ? String(formData.get('category')) : undefined,
            }

            const file = formData.get('imageFile') as any
            if (file && typeof file.arrayBuffer === 'function') {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)

                // configure cloudinary from env
                try {
                    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                } catch (e) {
                    console.error('Cloudinary config error:', e)
                }

                // upload buffer via upload_stream
                uploadedImageUrl = await new Promise<string>((resolve, reject) => {
                    const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'bazarcito' }, (error: any, result: any) => {
                        if (error) return reject(error)
                        return resolve(result.secure_url)
                    })
                    Readable.from(buffer).pipe(uploadStream)
                })
            }
        } else {
            body = (await req.json()) as Partial<ProductInput>
        }

        // If we uploaded an image from multipart, use that URL before validation
        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        const { title, price, stock, image, categoryId } = body

        if (!title || price == null || stock == null || !image || (categoryId == null && !body.category)) {
            return NextResponse.json({ error: 'Missing required fields: include categoryId or category name' }, { status: 400 })
        }

        // Build category relation: accept numeric id or category name (string)
        const categoryIdNum = categoryId != null ? Number(categoryId) : null
        const categoryName = typeof body.category === 'string' && body.category.trim() !== '' ? body.category.trim() : null

        // If we uploaded an image from multipart, use that URL
        if (uploadedImageUrl) {
            body.image = uploadedImageUrl
        }

        let created = null
        try {
            if (categoryName) {
                // connectOrCreate by category name (creates category if it doesn't exist)
                created = await prisma.product.create({
                    data: {
                        title,
                        price: Number(price),
                        stock: Number(stock),
                        image: body.image ?? image,
                        category: {
                            connectOrCreate: {
                                where: { name: categoryName },
                                create: { name: categoryName },
                            },
                        },
                    },
                })
            } else {
                // numeric id path: validate existence first
                let categoryExists = null
                try {
                    categoryExists = await prisma.category.findUnique({ where: { id: Number(categoryIdNum) } })
                } catch (e: any) {
                    console.error('Prisma findUnique error:', e?.stack || e)
                    return NextResponse.json({ error: 'Database error during category lookup', detail: String(e?.message || e) }, { status: 500 })
                }

                if (!categoryExists) {
                    return NextResponse.json({ error: `Category with id=${categoryIdNum} not found` }, { status: 400 })
                }

                created = await prisma.product.create({
                    data: {
                        title,
                        price: Number(price),
                        stock: Number(stock),
                        image,
                        category: { connect: { id: Number(categoryIdNum) } },
                    },
                })
            }
        } catch (e: any) {
            console.error('Prisma create error:', e?.stack || e)
            const msg = String(e?.message || e)
            if (msg.includes('insecure transport') || msg.includes('Connections using insecure transport')) {
                return NextResponse.json({ error: 'Database connection rejected insecure transport (SSL required). Update your DATABASE_URL to use TLS/SSL.', detail: msg }, { status: 502 })
            }
            return NextResponse.json({ error: 'Database error during product creation', detail: msg }, { status: 500 })
        }

        return NextResponse.json(created, { status: 201 })
    } catch (err) {
        console.error('Create product error (outer):', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
