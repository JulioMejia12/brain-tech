import { NextResponse, type NextRequest } from 'next/server'

export type RequestLike = Request | NextRequest

export type RouteParams = Record<string, string | undefined>

export type RouteContext = {
    params?: Promise<RouteParams> | RouteParams
} | undefined

export async function getRouteParam(ctx: RouteContext, key: string, req: RequestLike) {
    const params = await ctx?.params
    const directValue = params?.[key]

    if (typeof directValue === 'string' && directValue.length > 0) {
        return directValue
    }

    try {
        const pathname = 'nextUrl' in req && req.nextUrl
            ? req.nextUrl.pathname
            : new URL(req.url).pathname

        return pathname.split('/').filter(Boolean).pop()
    } catch (error) {
        console.warn(`Could not parse ${key} from request URL`, error)
        return undefined
    }
}

export async function getNumericRouteParam(
    ctx: RouteContext,
    key: string,
    req: RequestLike,
    label: string
) {
    const rawValue = await getRouteParam(ctx, key, req)

    if (!rawValue) {
        return {
            response: NextResponse.json({ error: `Missing ${label}` }, { status: 400 })
        }
    }

    if (!/^\d+$/.test(String(rawValue))) {
        return {
            response: NextResponse.json({ error: `Invalid ${label}: ${String(rawValue)}` }, { status: 400 })
        }
    }

    return { value: Number(rawValue) }
}

export function getPaginationParams(req: RequestLike, defaultTake = 20, maxTake = 1000) {
    const url = new URL(req.url)
    const limitParam = url.searchParams.get('limit')
    const skipParam = url.searchParams.get('skip')

    return {
        take: limitParam ? Math.min(maxTake, Number(limitParam) || defaultTake) : defaultTake,
        skip: skipParam ? Math.max(0, Number(skipParam) || 0) : 0,
    }
}