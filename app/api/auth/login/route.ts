import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'
import { findUserByEmail, getJwtSecret, normalizeEmail, toPublicUser } from '../../_utils/auth'
import { errorMessage, jsonError, logError } from '../../_utils/http'

type LoginBody = {
    email?: string
    password?: string
    name?: string
    createIfNotExists?: boolean
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginBody
        const email = normalizeEmail(body?.email)
        const password = body?.password
        if (!email) return jsonError('Missing email', 400)

        try {
            if (typeof password === 'string') {
                const user = await findUserByEmail(email)
                if (!user) {
                    return jsonError('Usuario no encontrado', 404)
                }

                if (!user.password) {
                    return jsonError('Usuario no tiene password', 400)
                }

                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) {
                    return jsonError('Password incorrecto', 401)
                }

                const jwtSecret = getJwtSecret()
                if (!jwtSecret) {
                    return jsonError('JWT_SECRET no configurado', 500)
                }

                const token = jwt.sign(
                    {
                        userId: user.id,
                        role: user.role,
                    },
                    jwtSecret,
                    { expiresIn: '7d' }
                )

                return NextResponse.json({
                    token,
                    user: toPublicUser(user),
                })
            }

            const user = await findUserByEmail(email)
            if (user) return NextResponse.json({ data: user })

            if (body.createIfNotExists) {
                const name = body.name?.trim() || email.split('@')[0]
                const randomPassword = randomUUID()
                const hashed = bcrypt.hashSync(randomPassword, 10)

                const created = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashed,
                        role: {
                            connectOrCreate: {
                                where: { name: 'user' },
                                create: { name: 'user' },
                            },
                        },
                    },
                    include: { role: true },
                })
                return NextResponse.json({ data: created }, { status: 201 })
            }

            return jsonError('User not found', 404)
        } catch (error: unknown) {
            logError('Login handler DB error:', error)
            return jsonError('Database error', 500, errorMessage(error))
        }
    } catch (error: unknown) {
        logError('Login route error:', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}
