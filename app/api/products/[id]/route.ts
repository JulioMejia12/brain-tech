import { NextResponse } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { prisma } from '../../../lib/prisma'

export async function GET(_req: Request, ctx: { params: { id: string } }) {
    try {
        const idParam = ctx?.params?.id
        const id = Number(idParam)

        if (Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }

        const product = await prisma.product.findUnique({
            where: { id },
            include: { category: true },
        })

        if (!product) {
            return NextResponse.json({ error: `Product with id=${id} not found` }, { status: 404 })
        }

        return NextResponse.json({ data: product })
    } catch (err) {
        console.error('Get product by id error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Failed to fetch product', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}

export { deleteProduct as DELETE }
