import { NextResponse } from 'next/server'
import type { Prisma } from '@prisma/client'
import { prisma } from '@/app/lib/prisma'
import { fromPlateriasCategoryName, plateriasWhereClause, toPlateriasCategoryName } from '@/app/api/_utils/catalog'
import { errorMessage, jsonError, logError } from '@/app/api/_utils/http'
import { getPaginationParams } from '@/app/api/_utils/route'

function serializePlateriasProduct(product: {
    id: number
    title: string
    price: number
    stock: number
    image: string
    description: string
    category: { name: string }
}) {
    return {
        ...product,
        category: {
            name: fromPlateriasCategoryName(product.category.name),
        },
    }
}

type PlateriaDetailInput = {
    label?: string
    value?: string
}

export async function GET(req: Request) {
    try {
        const { take, skip } = getPaginationParams(req)
        const url = new URL(req.url)
        const category = url.searchParams.get('category')

        const where = category
            ? {
                AND: [
                    plateriasWhereClause(),
                    {
                        category: {
                            name: toPlateriasCategoryName(category),
                        },
                    },
                ],
            }
            : plateriasWhereClause()

        const products = await prisma.product.findMany({
            where,
            include: { category: true },
            orderBy: { createdAt: 'desc' },
            take,
            skip,
        })

        return NextResponse.json({ data: products.map(serializePlateriasProduct) })
    } catch (error: unknown) {
        logError('Get platerias products error:', error)
        return jsonError('Failed to fetch platerias products', 500, errorMessage(error))
    }
}

export async function POST(req: Request) {
    try {
        const body = (await req.json().catch(() => null)) as {
            name?: string
            title?: string
            price?: string | number
            image?: string
            description?: string
            category?: string
            pieces?: number | string | null
            stock?: number | string | null
            details?: PlateriaDetailInput[] | null
        } | null

        const title = body?.name?.trim() || body?.title?.trim()
        const price = Number(body?.price)
        const stockSource = body?.pieces ?? body?.stock ?? 0
        const stock = Number(stockSource)
        const image = body?.image?.trim() || '/joya.jpeg'
        const description = body?.description?.trim() || ''
        const categoryName = toPlateriasCategoryName(body?.category)
        const details: Prisma.InputJsonValue = Array.isArray(body?.details)
            ? body.details.map((detail) => ({
                label: String(detail?.label ?? ''),
                value: String(detail?.value ?? ''),
            }))
            : []

        if (!title || Number.isNaN(price)) {
            return jsonError('Nombre y precio son requeridos', 400)
        }

        const createData = {
            title,
            price,
            stock: Number.isNaN(stock) ? 0 : stock,
            image,
            description,
            details,
            category: {
                connectOrCreate: {
                    where: { name: categoryName },
                    create: { name: categoryName },
                },
            },
        } as unknown as Prisma.ProductCreateInput

        const createdProduct = await prisma.product.create({
            data: createData,
        })

        const createdProductWithCategory = await prisma.product.findUnique({
            where: { id: createdProduct.id },
            include: { category: true },
        })

        if (!createdProductWithCategory) {
            return jsonError('Failed to load created platerias product', 500)
        }

        return NextResponse.json({ data: serializePlateriasProduct(createdProductWithCategory) }, { status: 201 })
    } catch (error: unknown) {
        logError('Create platerias product error:', error)
        return jsonError('Failed to create platerias product', 500, errorMessage(error))
    }
}
