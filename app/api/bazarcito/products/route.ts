import type { NextResponse } from 'next/server'
import { POST as productsPOST } from '../../products/route'

// Delegate to the generic products POST handler so both endpoints work.
export async function POST(req: Request) {
    return (await productsPOST(req)) as unknown as NextResponse
}
