import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { prisma } from '../../../lib/prisma'

async function getIdParam(ctx: any, req: NextRequest) {
    const params = await ctx?.params
    let idParam = params?.id

    if (!idParam) {
        try {
            idParam = req.nextUrl?.pathname?.split('/').pop() || new URL(req.url).pathname.split('/').pop()
        } catch (e) {
            console.warn('Could not parse id from req.url', e)
        }
    }

    return idParam
}

export async function GET(req: NextRequest, ctx: any) {
    try {
        const idParam = await getIdParam(ctx, req)

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

export async function PUT(req: NextRequest, ctx: any) {
    try {
        const idParam = await getIdParam(ctx, req)

        if (!idParam) return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) return NextResponse.json({ error: `Invalid product id: ${String(idParam)}` }, { status: 400 })

        const numericId = Number(idParam)
        const body = await req.json().catch(() => ({})) as Record<string, unknown>

        const data: any = {}
        if (body.name) data.title = String(body.name)
        if (body.price !== undefined) {
            const parsed = Number(body.price)
            if (!Number.isNaN(parsed)) data.price = parsed
        }
        if (body.pieces !== undefined) {
            const parsed = Number(body.pieces as any)
            if (!Number.isNaN(parsed)) data.stock = parsed
        }

        if (Object.keys(data).length === 0) return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })

        const updated = await prisma.product.update({ where: { id: numericId }, data })
        return NextResponse.json({ data: updated })
    } catch (err) {
        console.error('Update product error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Failed to update product', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
