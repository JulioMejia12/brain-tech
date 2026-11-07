import { NextResponse, type NextRequest } from 'next/server'
import { deleteCloudinaryImageByUrl } from '../../_utils/cloudinary'
import { revalidateProductPaths } from '../../_utils/revalidateProducts'
import { prisma } from '../../../lib/prisma'
import { getNumericRouteParam, type RouteContext } from '../../_utils/route'
import { errorMessage, jsonError, logError, toError } from '../../_utils/http'

type DeleteProductOptions = {
    deleteCloudinaryImage?: boolean
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
                await deleteCloudinaryImageByUrl(imageUrl)
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
