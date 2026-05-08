import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'crypto'

type LoginBody = {
    email?: string
    password?: string
    name?: string
    createIfNotExists?: boolean
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginBody
        const rawEmail = body?.email?.trim()
        const email = rawEmail?.toLowerCase()
        const password = body?.password
        if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

        try {
            // If a password is provided, perform normal email/password login
            if (typeof password === 'string') {
                const user = await prisma.user.findFirst({
                    where: {
                        OR: rawEmail && rawEmail !== email ? [{ email }, { email: rawEmail }] : [{ email }],
                    },
                    include: { role: true },
                })
                if (!user) {
                    return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
                }

                if (!user.password) {
                    return NextResponse.json({ error: 'Usuario no tiene password' }, { status: 400 })
                }

                const validPassword = await bcrypt.compare(password, user.password)
                if (!validPassword) {
                    return NextResponse.json({ error: 'Password incorrecto' }, { status: 401 })
                }

                if (!process.env.JWT_SECRET) {
                    return NextResponse.json({ error: 'JWT_SECRET no configurado' }, { status: 500 })
                }

                const token = jwt.sign(
                    {
                        userId: user.id,
                        role: user.role,
                    },
                    process.env.JWT_SECRET!,
                    { expiresIn: '7d' }
                )

                return NextResponse.json({
                    token,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                })
            }

            // Otherwise keep existing behavior (lookup or createIfNotExists flow)
            const user = await prisma.user.findFirst({
                where: {
                    OR: rawEmail && rawEmail !== email ? [{ email }, { email: rawEmail }] : [{ email }],
                },
                include: { role: true },
            })
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

            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        } catch (e: any) {
            console.error('Login handler DB error:', e?.stack || e)
            return NextResponse.json({ error: 'Database error', detail: String(e?.message || e) }, { status: 500 })
        }
    } catch (err: any) {
        console.error('Login route error:', err?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String(err?.message || err) }, { status: 500 })
    }
}
