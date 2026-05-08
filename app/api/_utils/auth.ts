import { prisma } from '@/app/lib/prisma'

export function normalizeEmail(email?: string | null) {
    return email?.trim().toLowerCase() || undefined
}

export async function findUserByEmail(email?: string | null) {
    const rawEmail = email?.trim()
    const normalizedEmail = normalizeEmail(rawEmail)

    if (!normalizedEmail) {
        return null
    }

    const candidates = rawEmail && rawEmail !== normalizedEmail
        ? [normalizedEmail, rawEmail]
        : [normalizedEmail]

    return prisma.user.findFirst({
        where: {
            OR: candidates.map((candidate) => ({ email: candidate })),
        },
        include: { role: true },
    })
}

export type UserWithRole = NonNullable<Awaited<ReturnType<typeof findUserByEmail>>>

export function toPublicUser(user: UserWithRole) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    }
}

export function getJwtSecret() {
    return process.env.JWT_SECRET || null
}