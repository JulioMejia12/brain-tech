import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct } from '../handlers/deleteProduct'
import { prisma } from '../../../lib/prisma'

export async function GET(_req: NextRequest, ctx: any) {
    try {
        const idParam = ctx?.params?.id
        const isNumeric = /^\d+$/.test(String(idParam))
        const id = isNumeric ? Number(idParam) : NaN

        if (isNumeric === false) {
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
