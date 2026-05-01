import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct as productsDELETE } from '../../../products/handlers/deleteProduct'
import { GET as productsGET } from '../../../products/[id]/route'

export async function GET(req: Request, ctx: { params: { id: string } }) {
    return (await productsGET(req, ctx)) as unknown as NextResponse
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        console.log('DELETE /api/bazarcito/products/[id] called with params:', ctx?.params)
        const resp = await productsDELETE(req, ctx)
        return resp as unknown as NextResponse
    } catch (err) {
        console.error('Delegated DELETE error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error in delegated handler', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
