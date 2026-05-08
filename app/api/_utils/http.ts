import { NextResponse } from 'next/server'

type ErrorLike = Error & {
    code?: string
    stack?: string
}

export function toError(error: unknown): ErrorLike {
    if (error instanceof Error) {
        return error as ErrorLike
    }

    return new Error(String(error)) as ErrorLike
}

export function logError(context: string, error: unknown) {
    const normalizedError = toError(error)
    console.error(context, normalizedError?.stack || normalizedError)
}

export function errorMessage(error: unknown) {
    const normalizedError = toError(error)
    return String(normalizedError?.message || normalizedError)
}

export function jsonError(error: string, status = 500, detail?: string) {
    return NextResponse.json(detail ? { error, detail } : { error }, { status })
}
