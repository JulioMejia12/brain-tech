import { prisma } from '@/app/lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'

type LoginBody = {
    email?: string
    name?: string
    createIfNotExists?: boolean
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as LoginBody
        const email = body?.email?.toLowerCase()?.trim()
        if (!email) return NextResponse.json({ error: 'Missing email' }, { status: 400 })

        try {
            const user = await prisma.user.findUnique({ where: { email }, include: { role: true } })
            if (user) return NextResponse.json({ data: user })

            if (body.createIfNotExists) {
                const name = body.name?.trim() || email.split('@')[0]
                // Create a random password for users created via this endpoint (not used for OAuth flows).
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
