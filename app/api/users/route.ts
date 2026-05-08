import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import { getPaginationParams } from '../_utils/route'

type UserInput = {
    name?: string
    email?: string
    password?: string
    roleId?: number
    role?: string
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as UserInput
        const email: string | undefined = body?.email?.toLowerCase?.().trim?.() || body?.email
        const password: string | undefined = body?.password
        const name: string | undefined = body?.name

        if (!email || !password) {
            return NextResponse.json({ error: 'Campos requeridos' }, { status: 400 })
        }

        try {
            const existing = await prisma.user.findUnique({ where: { email } })
            if (existing) {
                return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 })
            }
        } catch (e: unknown) {
            const error = e as Error & { stack?: string }
            console.error('Prisma lookup error:', error?.stack || error)
            return NextResponse.json({ error: 'Database error', detail: String(error?.message || error) }, { status: 500 })
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 10)

            const user = await prisma.user.create({
                data: {
                    name: name?.trim() || email.split('@')[0],
                    email,
                    password: hashedPassword,
                    role: {
                        connectOrCreate: {
                            where: { name: 'user' },
                            create: { name: 'user' },
                        },
                    },
                },
            })

            return NextResponse.json({ message: 'Usuario creado', user }, { status: 201 })
        } catch (e: unknown) {
            const error = e as Error & { stack?: string }
            console.error('Prisma create user error:', error?.stack || error)
            const msg = String(error?.message || error)
            if (msg.includes('Unique constraint') || msg.includes('Unique')) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
            }
            return NextResponse.json({ error: 'Error servidor' }, { status: 500 })
        }
    } catch (err: unknown) {
        const error = err as Error & { stack?: string }
        console.error('Create user error (outer):', error?.stack || error)
        return NextResponse.json({ error: 'Error servidor' }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { take, skip } = getPaginationParams(req)

        const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take, skip })
        return NextResponse.json({ data: users })
    } catch (err: unknown) {
        const error = err as Error & { stack?: string }
        console.error('Get users error:', error?.stack || error)
        return NextResponse.json({ error: 'Failed to fetch users', detail: String(error?.message || error) }, { status: 500 })
    }
}
