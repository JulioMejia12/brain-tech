import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { prisma } from '../../../lib/prisma'

export async function GET(req: NextRequest, ctx: any) {
    try {
        let idParam = ctx?.params?.id
        if (!idParam) {
            try {
                idParam = req.nextUrl?.pathname?.split('/').pop() || new URL(req.url).pathname.split('/').pop()
            } catch (e) {
                console.warn('Could not parse id from req.url', e)
            }
        }

        console.log('GET /api/products/[id] called with idParam=', idParam)
        if (!idParam) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) return NextResponse.json({ error: `Invalid product id: ${String(idParam)}` }, { status: 400 })

        const numericId = Number(idParam)
        const product = await prisma.product.findUnique({ where: { id: numericId }, include: { category: true } })
        if (!product) return NextResponse.json({ error: `Product with id=${numericId} not found` }, { status: 404 })
        return NextResponse.json({ data: product })
    } catch (err) {
        console.error('Get product by id error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Failed to fetch product', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}

export { deleteProduct as DELETE }
