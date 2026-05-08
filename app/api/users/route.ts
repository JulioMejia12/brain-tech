import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import { getPaginationParams } from '../_utils/route'
import { findUserByEmail, normalizeEmail, toPublicUser } from '../_utils/auth'
import { errorMessage, jsonError, logError } from '../_utils/http'

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
        const email = normalizeEmail(body?.email)
        const password: string | undefined = body?.password
        const name: string | undefined = body?.name

        if (!email || !password) {
            return jsonError('Campos requeridos', 400)
        }

        try {
            const existing = await findUserByEmail(email)
            if (existing) {
                return jsonError('Usuario ya existe', 400)
            }
        } catch (e: unknown) {
            logError('Prisma lookup error:', e)
            return jsonError('Database error', 500, errorMessage(e))
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
                include: { role: true },
            })

            return NextResponse.json({ message: 'Usuario creado', user: toPublicUser(user) }, { status: 201 })
        } catch (e: unknown) {
            logError('Prisma create user error:', e)
            const msg = errorMessage(e)
            if (msg.includes('Unique constraint') || msg.includes('Unique')) {
                return jsonError('Email already in use', 409)
            }
            return jsonError('Error servidor', 500)
        }
    } catch (error: unknown) {
        logError('Create user error (outer):', error)
        return jsonError('Error servidor', 500)
    }
}

export async function GET(req: Request) {
    try {
        const { take, skip } = getPaginationParams(req)

        const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take, skip })
        return NextResponse.json({ data: users.map(toPublicUser) })
    } catch (error: unknown) {
        logError('Get users error:', error)
        return jsonError('Failed to fetch users', 500, errorMessage(error))
    }
}
