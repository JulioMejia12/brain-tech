import { prisma } from '@/app/lib/prisma'
import { NextResponse, type NextRequest } from 'next/server'
import { getNumericRouteParam, type RouteContext } from '../../_utils/route'
import { errorMessage, jsonError, logError } from '../../_utils/http'
import { normalizeEmail, toPublicUser } from '../../_utils/auth'

type UpdateUserBody = {
    name?: string
    email?: string
    roleId?: number
    role?: string
}

export async function GET(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'user id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value
        const user = await prisma.user.findUnique({ where: { id: numericId }, include: { role: true } })
        if (!user) return jsonError(`User with id=${numericId} not found`, 404)
        return NextResponse.json({ data: toPublicUser(user) })
    } catch (error: unknown) {
        logError('Get user by id error:', error)
        return jsonError('Failed to fetch user', 500, errorMessage(error))
    }
}

export async function PUT(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'user id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value

        const body = (await req.json()) as UpdateUserBody
        const { name, email, roleId, role } = body

        const data: {
            name?: string
            email?: string
            role?: {
                connect?: { id: number }
                connectOrCreate?: {
                    where: { name: string }
                    create: { name: string }
                }
            }
        } = {}

        if (name) data.name = name
        if (email) data.email = normalizeEmail(email)

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
            return NextResponse.json({ data: toPublicUser(updated) })
        } catch (error: unknown) {
            logError('Update user error:', error)
            const msg = errorMessage(error)
            if (msg.includes('Unique constraint failed') || msg.includes('Unique')) {
                return jsonError('Email already in use', 409)
            }
            return jsonError('Database error', 500, msg)
        }
    } catch (error: unknown) {
        logError('PUT user outer error:', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}

export async function DELETE(req: NextRequest, ctx: RouteContext) {
    try {
        const result = await getNumericRouteParam(ctx, 'id', req, 'user id')
        if ('response' in result) {
            return result.response
        }

        const numericId = result.value

        try {
            await prisma.user.delete({ where: { id: numericId } })
            return NextResponse.json({ success: true })
        } catch (error: unknown) {
            logError('Delete user error:', error)
            const msg = errorMessage(error)
            if (msg.includes('Record to delete does not exist')) {
                return jsonError(`User with id=${numericId} not found`, 404)
            }
            return jsonError('Database error', 500, msg)
        }
    } catch (error: unknown) {
        logError('DELETE user outer error:', error)
        return jsonError('Server error', 500, errorMessage(error))
    }
}
