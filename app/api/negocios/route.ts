import { NextResponse } from 'next/server'
import { prisma } from '@/app/lib/prisma'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'

export async function GET() {
    try {
        const negocios = await prisma.negocio.findMany({
            select: {
                id: true,
                nombre: true,
                slug: true,
            },
            orderBy: { nombre: 'asc' },
        })

        return NextResponse.json({ data: negocios })
    } catch (error: unknown) {
        logError('Get negocios error:', error)
        return jsonError('Failed to fetch negocios', 500, errorMessage(error))
    }
}