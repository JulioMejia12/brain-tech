'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAuth } from '@/contexts/AuthContext'

const AUTH_STOREFRONT_KEY = 'authStorefront'

const getStorefront = (pathname: string | null): 'bazarcito' | 'marron' | null => {
    if (!pathname) return null
    if (pathname.startsWith('/bazarcito')) return 'bazarcito'
    if (pathname.startsWith('/marron')) return 'marron'
    return null
}

export default function StorefrontSwitchGuard() {
    const pathname = usePathname()
    const router = useRouter()
    const auth = useAuth()
    const previousStorefrontRef = useRef<string | null>(null)
    const initializedRef = useRef(false)

    useEffect(() => {
        const currentStorefront = getStorefront(pathname)
        const query = typeof window !== 'undefined' ? window.location.search.replace(/^\?/, '') : ''
        const next = `${pathname}${query ? `?${query}` : ''}`

        const getStoredStorefront = () => {
            try {
                return localStorage.getItem(AUTH_STOREFRONT_KEY)
            } catch {
                return null
            }
        }

        if (!initializedRef.current) {
            initializedRef.current = true
            previousStorefrontRef.current = currentStorefront
            const storedStorefront = getStoredStorefront()

            if (auth.user && currentStorefront && storedStorefront !== currentStorefront) {
                auth.logout()
                router.replace(`/auth/login?next=${encodeURIComponent(next)}`)
            }
            return
        }

        const storedStorefront = getStoredStorefront()

        if (auth.user && currentStorefront && storedStorefront && storedStorefront !== currentStorefront) {
            previousStorefrontRef.current = currentStorefront
            auth.logout()
            router.replace(`/auth/login?next=${encodeURIComponent(next)}`)
            return
        }

        const previousStorefront = previousStorefrontRef.current
        previousStorefrontRef.current = currentStorefront

        if (!auth.user || !previousStorefront) return

        if (currentStorefront && currentStorefront !== previousStorefront) {
            auth.logout()
            router.replace(`/auth/login?next=${encodeURIComponent(next)}`)
            return
        }

        if (!currentStorefront) {
            auth.logout()
        }
    }, [auth, pathname, router])

    return null
}