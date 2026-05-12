import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { isPlateriasCategoryName } from '@/app/api/_utils/catalog'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'
// use a loose context type for Next.js route handlers to avoid mismatches
import { getNumericRouteParam } from '../../../_utils/route'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'

export async function GET(req: NextRequest, ctx: any) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        return NextResponse.json({ data: product })
    } catch (error: unknown) {
        logError('Get bazarcito product by id error:', error)
        return jsonError('Failed to fetch bazarcito product', 500, errorMessage(error))
    }
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        await prisma.product.delete({ where: { id: result.value } })
        return new NextResponse(null, { status: 204 })
    } catch (error: unknown) {
        logError('Delete bazarcito product error:', error)
        return jsonError('Failed to delete bazarcito product', 500, errorMessage(error))
    }
}

export async function PUT(req: NextRequest, ctx: any) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const product = await prisma.product.findUnique({ where: { id: result.value }, include: { category: true } })
        if (!product || isPlateriasCategoryName(product.category?.name)) {
            return jsonError(`Product with id=${result.value} not found`, 404)
        }

        // Parse body depending on content type. Don't call req.json() before formData.
        const contentType = req.headers.get('content-type') || ''
        let uploadedImageUrl: string | null = null
        const body = {} as {
            name?: string
            title?: string
            price?: number | string
            pieces?: number | string
            stock?: number | string
            description?: string
            category?: string | number
            categoryId?: number
            details?: any
        }

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            const fdTitle = formData.get('title') || formData.get('name')
            const fdDescription = formData.get('description')
            const fdPrice = formData.get('price')
            const fdStock = formData.get('stock')
            const fdPieces = formData.get('pieces')
            const fdCategory = formData.get('category')
            const fdDetails = formData.get('details')

            if (fdTitle) body.title = String(fdTitle)
            if (fdPrice) body.price = String(fdPrice as any)
            if (fdStock) body.stock = String(fdStock as any)
            if (fdPieces) body.pieces = String(fdPieces as any)
            if (fdDescription) body.description = String(fdDescription)
            if (typeof fdCategory === 'string') body.category = fdCategory
            if (fdDetails) {
                try {
                    const parsed = typeof fdDetails === 'string' ? JSON.parse(fdDetails) : JSON.parse(String(fdDetails))
                        ; (body as any).details = parsed
                } catch (e) {
                    // ignore parse errors
                }
            }

            const file = formData.get('imageFile')
            if (file instanceof File && typeof file.arrayBuffer === 'function') {
                const arrayBuffer = await file.arrayBuffer()
                const buffer = Buffer.from(arrayBuffer)
                if (!process.env.CLOUDINARY_URL) {
                    console.error('CLOUDINARY_URL not set; cannot upload image')
                    return jsonError('Server misconfiguration: CLOUDINARY_URL not set', 500, 'CLOUDINARY_URL not configured')
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
                    return jsonError('Image upload failed', 500, String(e?.message || e))
                }
            }
        } else {
            // non-multipart: parse JSON body
            const parsed = (await req.json().catch(() => ({}))) as any
            Object.assign(body, parsed)
        }

        const data: { title?: string; price?: number; stock?: number; description?: string; image?: string; category?: any; details?: { label: string; value: string }[] } = {}
        if (body.name || body.title) data.title = String(body.name || body.title)
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }

        const stockSource = body.pieces ?? body.stock
        if (stockSource !== undefined) {
            const parsed = Number(stockSource)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }

        if (uploadedImageUrl) data.image = uploadedImageUrl

        if (body.description !== undefined) data.description = String(body.description)
        if ((body as any).details !== undefined) {
            try {
                const detailsRaw = (body as any).details
                data['details'] = Array.isArray(detailsRaw) ? detailsRaw.map((d: any) => ({ label: String(d?.label ?? ''), value: String(d?.value ?? '') })) : undefined
            } catch (e) {
                // ignore invalid details
            }
        }

        // category handling: support category name or categoryId
        const url = new URL(req.url)
        const fdCategoryQuery = url.searchParams.get('category') || undefined
        const categoryName = fdCategoryQuery ?? (body as any).category ?? undefined
        const categoryId = (body as any).categoryId ?? undefined
        if (typeof categoryName === 'string' && categoryName.trim() !== '') {
            data.category = {
                connectOrCreate: {
                    where: { name: categoryName.trim() },
                    create: { name: categoryName.trim() },
                },
            }
        } else if (categoryId !== undefined && categoryId !== null) {
            data.category = { connect: { id: Number(categoryId) } }
        }

        if (Object.keys(data).length === 0) {
            return jsonError('No valid fields to update', 400)
        }

        const updated = await prisma.product.update({ where: { id: result.value }, data, include: { category: true } })
        return NextResponse.json({ data: updated })
    } catch (error: unknown) {
        logError('Update bazarcito product error:', error)
        return jsonError('Failed to update bazarcito product', 500, errorMessage(error))
    }
}
