import { NextResponse, type NextRequest } from 'next/server'
import { deleteProduct as productsDELETE } from '../../../products/handlers/deleteProduct'
import { prisma } from '../../../../lib/prisma'

export async function GET(req: NextRequest, ctx: any) {
    try {
        // Extract id from route params when available, otherwise fall back to parsing the URL
        let idParam = ctx?.params?.id
        if (!idParam) {
            try {
                // NextRequest exposes nextUrl in Edge runtime; fallback to req.url for Node
                idParam = req.nextUrl?.pathname?.split('/').pop() || new URL(req.url).pathname.split('/').pop()
            } catch (e) {
                console.warn('Could not parse id from req.url', e)
            }
        }

        console.log('GET /api/bazarcito/products/[id] called with idParam=', idParam)

        if (!idParam) {
            return NextResponse.json({ error: 'Missing product id' }, { status: 400 })
        }

        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) {
            return NextResponse.json({ error: `Invalid product id: ${String(idParam)}` }, { status: 400 })
        }

        const numericId = Number(idParam)
        const product = await prisma.product.findUnique({ where: { id: numericId }, include: { category: true } })
        console.log('Lookup id=', numericId, 'found=', !!product)
        if (!product) return NextResponse.json({ error: `Product with id=${numericId} not found` }, { status: 404 })
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
