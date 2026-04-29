import type { NextResponse } from 'next/server'
import { deleteProduct as productsDELETE } from '../../../products/handlers/deleteProduct'

export async function DELETE(req: Request, ctx: { params: { id: string } }) {
    try {
        console.log('DELETE /api/bazarcito/products/[id] called with params:', ctx?.params)
        const resp = await productsDELETE(req, ctx)
        return resp as unknown as NextResponse
    } catch (err) {
        console.error('Delegated DELETE error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error in delegated handler', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
