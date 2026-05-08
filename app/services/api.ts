type ApiFetchOptions = RequestInit & {
    requireAuth?: boolean
}

export async function apiFetch(input: string, options: ApiFetchOptions = {}) {
    const { requireAuth = false, headers, ...rest } = options
    const requestHeaders = new Headers(headers || {})

    if (requireAuth && typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (token) {
            requestHeaders.set('Authorization', `Bearer ${token}`)
        }
    }

    return fetch(input, {
        ...rest,
        headers: requestHeaders,
    })
}

export default apiFetch
