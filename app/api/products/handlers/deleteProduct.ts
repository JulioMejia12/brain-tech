import { NextResponse, type NextRequest } from 'next/server'
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
        const parts = u.pathname.split('/')
        const uploadIdx = parts.findIndex((p) => p === 'upload')
        if (uploadIdx === -1) return null
        let publicPath = parts.slice(uploadIdx + 1).join('/')
        publicPath = publicPath.replace(/^v\d+\//, '')
        publicPath = publicPath.replace(/\.[^.]+$/, '')
        return publicPath || null
    } catch {
        return null
    }
}

async function maybeDeleteCloudinaryImage(imageUrl: string | null | undefined) {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!imageUrl || !cloudName || !apiKey || !apiSecret || !String(imageUrl).includes('res.cloudinary.com')) {
        return
    }

    const publicId = extractCloudinaryPublicId(String(imageUrl))
    if (!publicId) return

    const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload`
    const response = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_ids: [publicId] }),
    })

    if (!response.ok) {
        const text = await response.text().catch(() => '')
        console.warn('Cloudinary delete non-ok', response.status, text)
    }
}

export async function deleteProduct(req: NextRequest, ctx: RouteContext, options: DeleteProductOptions = {}) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'product id')
        if ('response' in result) {
            return result.response
        }

        const id = result.value

        if (options.deleteCloudinaryImage) {
            try {
                const product = await prisma.product.findUnique({ where: { id } })
                await maybeDeleteCloudinaryImage(product?.image)
            } catch (error) {
                console.warn('Could not attempt Cloudinary delete:', error)
            }
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

        return new NextResponse(null, { status: 204 })
    } catch (error: unknown) {
        logError('Delete product outer error:', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}
