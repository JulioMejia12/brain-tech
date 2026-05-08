import type { NextRequest, NextResponse } from 'next/server'
import { GET as productsGET, PUT as productsPUT } from '../../../products/[id]/route'
import { deleteProduct } from '../../../products/handlers/deleteProduct'
import type { RouteContext } from '../../../_utils/route'

export async function GET(req: NextRequest, ctx: RouteContext) {
    return (await productsGET(req, ctx)) as unknown as NextResponse
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
    return deleteProduct(req, ctx, { deleteCloudinaryImage: true })
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    return (await productsPUT(req, ctx)) as unknown as NextResponse
}
