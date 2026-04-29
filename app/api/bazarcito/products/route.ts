import type { NextResponse } from 'next/server'
import { POST as productsPOST, GET as productsGET } from '../../products/route'

// Delegate to the generic products handlers so both endpoints work.
export async function POST(req: Request) {
    return (await productsPOST(req)) as unknown as NextResponse
}

export async function GET(req: Request) {
    return (await productsGET(req)) as unknown as NextResponse
}
