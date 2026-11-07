import { NextResponse, type NextRequest } from 'next/server'
import cloudinary from 'cloudinary'
import { revalidateProductPaths } from '../../_utils/revalidateProducts'
import { prisma } from '../../../lib/prisma'
import { getNumericRouteParam, type RouteContext } from '../../_utils/route'
import { errorMessage, jsonError, logError, toError } from '../../_utils/http'

type DeleteProductOptions = {
    deleteCloudinaryImage?: boolean
}

function extractCloudinaryPublicId(urlStr: string | null | undefined) {
    if (!urlStr) return null
    try {
        const u = new URL(urlStr)
        const parts = u.pathname.split('/').filter(Boolean)
        const uploadIdx = parts.findIndex((p) => p === 'upload')
        if (uploadIdx === -1) return null

        let rest = parts.slice(uploadIdx + 1)
        const versionIdx = rest.findIndex((p) => /^v\d+$/.test(p))

        if (versionIdx !== -1) {
            rest = rest.slice(versionIdx + 1)
        } else if (rest.length > 1 && /[,:]/.test(rest[0])) {
            rest = rest.slice(1)
        }

        const publicPath = rest.join('/').replace(/\.[^.]+$/, '')
        return publicPath || null
    } catch {
        return null
    }
}

function configureCloudinary() {
    if (process.env.CLOUDINARY_URL) {
        cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
        return true
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) return false

    cloudinary.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
    return true
}

async function maybeDeleteCloudinaryImage(imageUrl: string | null | undefined) {
    if (!imageUrl || !String(imageUrl).includes('res.cloudinary.com')) return
    if (!configureCloudinary()) return

    const publicId = extractCloudinaryPublicId(String(imageUrl))
    if (!publicId) return

    await new Promise<void>((resolve) => {
        cloudinary.v2.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
            if (error) {
                console.warn('Cloudinary delete failed', { publicId, error })
            } else {
                console.info('Cloudinary image deleted', { publicId, result })
            }
            resolve()
        })
    })
}

export async function deleteProduct(req: NextRequest, ctx: RouteContext, options: DeleteProductOptions = {}) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const id = result.value

        const shouldDeleteCloudinaryImage = options.deleteCloudinaryImage ?? true

        let imageUrl: string | null | undefined

        try {
            const product = await prisma.product.findUnique({ where: { id }, select: { image: true } })
            imageUrl = product?.image
        } catch (error) {
            console.warn('Could not load product image before delete:', error)
        }

        try {
            await prisma.product.delete({ where: { id } })
        } catch (error: unknown) {
            const prismaError = toError(error)
            if (prismaError?.code === 'P2025') {
                return jsonError(`Product with id=${id} not found`, 404)
            }
            logError('Prisma delete error:', error)
            return jsonError('Database error', 500, errorMessage(error))
        }

        revalidateProductPaths(id)

        if (shouldDeleteCloudinaryImage) {
            try {
                await maybeDeleteCloudinaryImage(imageUrl)
            } catch (error) {
                console.warn('Could not delete Cloudinary image:', error)
            }
        }

        return new NextResponse(null, { status: 204 })
    } catch (error: unknown) {
        logError('Delete product outer error:', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}
