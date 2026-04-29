import { NextResponse, type NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'

export async function deleteProduct(req: NextRequest, ctx: any) {
    try {
        const idParam = ctx?.params?.id
        const id = Number(idParam)
        if (Number.isNaN(id)) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
        }

        try {
            await prisma.product.delete({ where: { id } })
        } catch (e: any) {
            if (e?.code === 'P2025') {
                return NextResponse.json({ error: `Product with id=${id} not found` }, { status: 404 })
            }
            console.error('Prisma delete error:', e?.stack || e)
            return NextResponse.json({ error: 'Database error', detail: String(e?.message || e) }, { status: 500 })
        }

        return new NextResponse(null, { status: 204 })
    } catch (err) {
        console.error('Delete product outer error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
