import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct as productsDELETE } from '../../../products/handlers/deleteProduct'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: NextRequest, ctx: any) {
    try {
        const idParam = ctx?.params?.id
        const isNumeric = /^\d+$/.test(String(idParam))
        const where = isNumeric ? { id: Number(idParam) } : { id: String(idParam) }

        const product = await prisma.product.findUnique({ where: where as any, include: { category: true } })
        if (!product) return NextResponse.json({ error: `Product with id=${idParam} not found` }, { status: 404 })
        return NextResponse.json({ data: product })
    } catch (err) {
        console.error('GET /api/bazarcito/products/[id] error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
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
