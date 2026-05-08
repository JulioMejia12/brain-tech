import { NextResponse } from 'next/server'
import { prisma } from '../../lib/prisma'
import bcrypt from 'bcryptjs'
import { randomUUID } from 'crypto'
import { getPaginationParams } from '../_utils/route'

type UserInput = {
    name?: string
    email?: string
    roleId?: number
    role?: string
}

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as UserInput
        const { name, email, roleId, role } = body

        if (!name || !email) {
            return NextResponse.json({ error: 'Missing required fields: name and email' }, { status: 400 })
        }

        // handle role: allow numeric roleId or role name (connectOrCreate)
        let created
        try {
            // generate a random password and hash it to satisfy schema requirements
            const randomPassword = randomUUID()
            const hashed = bcrypt.hashSync(randomPassword, 10)

            if (role && typeof role === 'string') {
                const roleName = role.trim()
                created = await prisma.user.create({
                    data: {
                        name,
                        email,
                        password: hashed,
                        role: {
                            connectOrCreate: {
                                where: { name: roleName },
                                create: { name: roleName },
                            },
                        },
                    },
                    include: { role: true },
                })
            } else if (roleId != null) {
                // validate role exists
                const r = await prisma.role.findUnique({ where: { id: Number(roleId) } })
                if (!r) return NextResponse.json({ error: `Role with id=${roleId} not found` }, { status: 400 })
                created = await prisma.user.create({ data: { name, email, password: hashed, role: { connect: { id: Number(roleId) } } }, include: { role: true } })
            } else {
                // require role selection
                return NextResponse.json({ error: 'Missing roleId or role name' }, { status: 400 })
            }
        } catch (e: any) {
            console.error('Prisma create user error:', e?.stack || e)
            const msg = String(e?.message || e)
            if (msg.includes('Unique constraint failed') || msg.includes('Unique')) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
            }
            return NextResponse.json({ error: 'Database error', detail: msg }, { status: 500 })
        }

        return NextResponse.json({ data: created }, { status: 201 })
    } catch (err) {
        console.error('Create user error (outer):', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const { take, skip } = getPaginationParams(req)

        const users = await prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' }, take, skip })
        return NextResponse.json({ data: users })
    } catch (err) {
        console.error('Get users error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Failed to fetch users', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
