import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { Prisma } from '@prisma/client'
import { prisma } from '../../../lib/prisma'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'
import { getNumericRouteParam, type RouteContext } from '../../_utils/route'
import { errorMessage, jsonError, logError } from '../../_utils/http'

type UpdateProductBody = {
    name?: string
    title?: string
    price?: number | string
    promotionPrice?: number | string | null
    pieces?: number | string
    stock?: number | string
}

function toPromotionPriceDecimal(value: number | string | null | undefined) {
    if (value === undefined) return undefined
    if (value === null || value === '') return null

    const raw = String(value).trim()
    if (raw === '') return null

    return new Prisma.Decimal(raw)
}

export async function GET(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value
        const product = await prisma.product.findUnique({ where: { id: numericId }, include: { category: true } })
        if (!product) return jsonError(`Product with id=${numericId} not found`, 404)
        return NextResponse.json({ data: product })
    } catch (error: unknown) {
        logError('Get product by id error:', error)
        return jsonError('Failed to fetch product', 500, errorMessage(error))
    }
}

export { deleteProduct as DELETE }

export async function PUT(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }
        const numericId = result.value

        // load product to ensure it exists
        const product = await prisma.product.findUnique({ where: { id: numericId }, include: { category: true } })
        if (!product) return jsonError(`Product with id=${numericId} not found`, 404)

        const contentType = req.headers.get('content-type') || ''
        let uploadedImageUrl: string | null = null
        const body: UpdateProductBody & { description?: string; promotionPrice?: any; negocioId?: any; category?: any; categoryId?: any; details?: any } = {}

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData()
            const fdTitle = formData.get('title') || formData.get('name')
            const fdPrice = formData.get('price')
            const fdPromotionPrice = formData.get('promotionPrice')
            const fdStock = formData.get('stock')
            const fdPieces = formData.get('pieces')
            const fdDescription = formData.get('description')
            const fdNegocioId = formData.get('negocioId')
            const fdCategory = formData.get('category')
            const fdCategoryId = formData.get('categoryId')
            const fdDetails = formData.get('details')

            if (fdTitle) body.title = String(fdTitle)
            if (fdPrice) body.price = String(fdPrice)
            if (formData.has('promotionPrice')) {
                const raw = fdPromotionPrice === null ? '' : String(fdPromotionPrice)
                if (raw === '' || raw === 'null') body.promotionPrice = null
                else body.promotionPrice = raw
            }
            if (fdStock) body.stock = String(fdStock)
            if (fdPieces) body.pieces = String(fdPieces)
            if (fdDescription) body.description = String(fdDescription)
            if (fdNegocioId) body.negocioId = String(fdNegocioId)
            if (typeof fdCategory === 'string') body.category = fdCategory
            if (fdCategoryId) body.categoryId = Number(String(fdCategoryId))
            if (fdDetails) {
                try { body.details = typeof fdDetails === 'string' ? JSON.parse(fdDetails) : JSON.parse(String(fdDetails)) } catch { }
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
            Object.assign(body, await req.json().catch(() => ({})))
        }

        const data: any = {}
        if (body.name || body.title) data.title = String(body.name || body.title)
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }
        if (body.promotionPrice !== undefined) {
            const promotionPrice = toPromotionPriceDecimal(body.promotionPrice)
            if (promotionPrice !== undefined) data.promotionPrice = promotionPrice
        }
        const stockSource = body.pieces ?? body.stock
        if (stockSource !== undefined) {
            const parsed = Number(stockSource)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }
        if (uploadedImageUrl) data.image = uploadedImageUrl
        if (body.description !== undefined) data.description = String(body.description)
        if (body.details !== undefined) {
            try {
                const detailsRaw = body.details
                data.details = Array.isArray(detailsRaw) ? detailsRaw.map((d) => ({ label: String(d?.label ?? ''), value: String(d?.value ?? '') })) : undefined
            } catch { }
        }

        const url = new URL(req.url)
        const fdCategoryQuery = url.searchParams.get('category') || undefined
        const categoryName = fdCategoryQuery ?? body.category ?? undefined
        const categoryId = body.categoryId ?? undefined
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

        if (Object.keys(data).length === 0) return jsonError('No valid fields to update', 400)

        try {
            let updated = await prisma.product.update({ where: { id: numericId }, data, include: { category: true } })

            if (body.negocioId !== undefined) {
                const nextNegocioId = Number(body.negocioId)
                await prisma.$executeRaw`
                    UPDATE Product
                    SET negocioId = ${nextNegocioId}
                    WHERE id = ${numericId}
                `
                updated = { ...updated, negocioId: nextNegocioId }
            }

            return NextResponse.json({ data: updated })
        } catch (error: unknown) {
            logError('Update product error:', error)
            return jsonError('Failed to update product', 500, errorMessage(error))
        }
    } catch (error: unknown) {
        logError('Update product error:', error)
        return jsonError('Failed to update product', 500, errorMessage(error))
    }
}
