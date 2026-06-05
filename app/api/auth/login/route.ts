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
    siteContext?: string
}

function getAllowedNegocioFromContext(siteContext?: string) {
    if (siteContext === 'bazarcito') {
        return process.env.BAZARCITO_NEGOCIO_ID || process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || undefined
    }

    if (siteContext === 'marron') {
        return process.env.MARRON_NEGOCIO_ID || process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || undefined
    }

    return undefined
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginBody
        // Determine allowed negocio from explicit siteContext, falling back to the Referer header
        let allowedNegocioEnv = getAllowedNegocioFromContext(body?.siteContext)
        if (!allowedNegocioEnv) {
            const referer = req.headers.get('referer')
            if (referer) {
                try {
                    const url = new URL(referer)
                    const parts = url.pathname.split('/').filter(Boolean)
                    const ctx = parts[0]
                    const envFromReferer = getAllowedNegocioFromContext(ctx)
                    if (envFromReferer) allowedNegocioEnv = envFromReferer
                } catch (e) {
                    /* ignore URL parse errors */
                }
            }
        }
        const allowedNegocio = allowedNegocioEnv ? Number(allowedNegocioEnv) : undefined
        const email = normalizeEmail(body?.email)
        const password = body?.password
        if (!email) return jsonError('Missing email', 400)

        try {
            // Login with password
            if (typeof password === 'string') {
                const user = await findUserByEmail(email)
                if (!user) return jsonError('Usuario no encontrado', 404)
                if (!user.password) return jsonError('Usuario no tiene password', 400)

                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) return jsonError('Password incorrecto', 401)

                // Enforce negocio restriction if present
                if (allowedNegocio != null && user.negocioId !== allowedNegocio) {
                    return jsonError('Usuario no autorizado para este sitio', 403)
                }

                const jwtSecret = getJwtSecret()
                if (!jwtSecret) return jsonError('JWT_SECRET no configurado', 500)

                const token = jwt.sign(
                    { userId: user.id, role: user.role, negocioId: user.negocioId ?? null },
                    jwtSecret,
                    { expiresIn: '7d' }
                )

                return NextResponse.json({ token, user: toPublicUser(user) })
            }

            // No password supplied: do not allow login without password.
            // Only allow account creation when `createIfNotExists` is true.
            const user = await findUserByEmail(email)

            if (user) {
                // For safety, never return user data on a login attempt without password.
                return jsonError('Password required', 400)
            }

            if (body.createIfNotExists) {
                const name = body.name?.trim() || email.split('@')[0]
                const randomPassword = randomUUID()
                const hashed = bcrypt.hashSync(randomPassword, 10)

                const createData: any = {
                    name,
                    email,
                    password: hashed,
                    role: {
                        connectOrCreate: { where: { name: 'user' }, create: { name: 'user' } },
                    },
                }
                if (allowedNegocio != null) createData.negocioId = allowedNegocio

                const created = await prisma.user.create({ data: createData, include: { role: true } })
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
