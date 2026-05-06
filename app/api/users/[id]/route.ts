import { prisma } from '@/app/lib/prisma'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(req: NextRequest, ctx: any) {
    try {
        let idParam = ctx?.params?.id
        if (!idParam) {
            try {
                idParam = new URL(req.url).pathname.split('/').pop()
            } catch (e) {
                console.warn('Could not parse id from req.url', e)
            }
        }

        if (!idParam) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) return NextResponse.json({ error: `Invalid user id: ${String(idParam)}` }, { status: 400 })

        const numericId = Number(idParam)
        const user = await prisma.user.findUnique({ where: { id: numericId }, include: { role: true } })
        if (!user) return NextResponse.json({ error: `User with id=${numericId} not found` }, { status: 404 })
        return NextResponse.json({ data: user })
    } catch (err) {
        console.error('Get user by id error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Failed to fetch user', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, ctx: any) {
    try {
        let idParam = ctx?.params?.id
        if (!idParam) {
            try { idParam = new URL(req.url).pathname.split('/').pop() } catch (e) { console.warn(e) }
        }
        if (!idParam) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) return NextResponse.json({ error: `Invalid user id: ${String(idParam)}` }, { status: 400 })
        const numericId = Number(idParam)

        const body = await req.json()
        const { name, email, roleId, role } = body as any

        // prepare update data
        const data: any = {}
        if (name) data.name = name
        if (email) data.email = email

        try {
            if (role && typeof role === 'string') {
                const roleName = role.trim()
                data.role = { connectOrCreate: { where: { name: roleName }, create: { name: roleName } } }
            } else if (roleId != null) {
                const r = await prisma.role.findUnique({ where: { id: Number(roleId) } })
                if (!r) return NextResponse.json({ error: `Role with id=${roleId} not found` }, { status: 400 })
                data.role = { connect: { id: Number(roleId) } }
            }

            const updated = await prisma.user.update({ where: { id: numericId }, data, include: { role: true } })
            return NextResponse.json({ data: updated })
        } catch (e: any) {
            console.error('Update user error:', e?.stack || e)
            const msg = String(e?.message || e)
            if (msg.includes('Unique constraint failed') || msg.includes('Unique')) {
                return NextResponse.json({ error: 'Email already in use' }, { status: 409 })
            }
            return NextResponse.json({ error: 'Database error', detail: msg }, { status: 500 })
        }
    } catch (err) {
        console.error('PUT user outer error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        let idParam = ctx?.params?.id
        if (!idParam) {
            try { idParam = new URL(req.url).pathname.split('/').pop() } catch (e) { console.warn(e) }
        }
        if (!idParam) return NextResponse.json({ error: 'Missing user id' }, { status: 400 })
        const isNumeric = /^\d+$/.test(String(idParam))
        if (!isNumeric) return NextResponse.json({ error: `Invalid user id: ${String(idParam)}` }, { status: 400 })
        const numericId = Number(idParam)

        try {
            await prisma.user.delete({ where: { id: numericId } })
            return NextResponse.json({ success: true })
        } catch (e: any) {
            console.error('Delete user error:', e?.stack || e)
            const msg = String(e?.message || e)
            if (msg.includes('Record to delete does not exist')) {
                return NextResponse.json({ error: `User with id=${numericId} not found` }, { status: 404 })
            }
            return NextResponse.json({ error: 'Database error', detail: msg }, { status: 500 })
        }
    } catch (err) {
        console.error('DELETE user outer error:', (err as any)?.stack || err)
        return NextResponse.json({ error: 'Server error', detail: String((err as any)?.message || err) }, { status: 500 })
    }
}
