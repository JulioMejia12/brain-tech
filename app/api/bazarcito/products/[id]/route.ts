import type { NextRequest, NextResponse } from 'next/server'
import { GET as productsGET, PUT as productsPUT } from '../../../products/[id]/route'
import { deleteProduct } from '../../../products/handlers/deleteProduct'

export async function GET(req: NextRequest, ctx: any) {
    return (await productsGET(req, ctx)) as unknown as NextResponse
}

export async function DELETE(req: NextRequest, ctx: any) {
    return deleteProduct(req, ctx, { deleteCloudinaryImage: true })
}

export async function PUT(req: NextRequest, ctx: any) {
    return (await productsPUT(req, ctx)) as unknown as NextResponse
}
