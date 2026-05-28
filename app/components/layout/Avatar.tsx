"use client"
import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

type MenuItem = {
    label: string
    href?: string
    onClick?: () => void
}

type Props = {
    src?: string
    name?: string
    items?: MenuItem[]
}

export default function Avatar({ src, name = 'Cuenta', items }: Props) {
    const [open, setOpen] = useState(false)
    const ref = useRef<HTMLDivElement | null>(null)
    const auth = useAuth()
    const router = useRouter()
    const [currentPath, setCurrentPath] = useState('/')

    useEffect(() => {
        try {
            const p = window.location.pathname || '/'
            const s = window.location.search || ''
            setCurrentPath(p + s)
        } catch (e) {
            setCurrentPath('/')
        }
    }, [])

    useEffect(() => {
        function onDoc(e: MouseEvent) {
            if (!ref.current) return
            if (!ref.current.contains(e.target as Node)) setOpen(false)
        }
        document.addEventListener('click', onDoc)
        return () => document.removeEventListener('click', onDoc)
    }, [])

    // `currentPath` is populated on the client to avoid using next/navigation hooks
    // during prerender which can cause build-time errors.
    let defaultItems: MenuItem[] = []
    if (auth?.user) {
        // show admin-only actions
        const isAdmin = String(auth.user?.role?.name || '').toLowerCase() === 'admin'
        const isMarronPath = currentPath.startsWith('/marron')
        const adminBasePath = isMarronPath ? '/marron' : '/bazarcito'
        if (isAdmin) defaultItems.push({ label: 'Agregar productos', href: `${adminBasePath}/products/new` })
        if (isAdmin) defaultItems.push({ label: 'Crear promociones', href: `${adminBasePath}/promotions/new` })
        defaultItems.push({ label: 'Cerrar sesión', href: '/logout' })
    } else {
        defaultItems = [{ label: 'Iniciar sesión', href: `/auth/login?next=${encodeURIComponent(currentPath)}` }]
    }

    const menu = items && items.length ? items : defaultItems
    const user = auth?.user
    const displayName = user?.name ?? name
    const displayEmail = user?.email ?? ''

    const getInitials = (full?: string, email?: string) => {
        const source = (full || email || '').trim()
        if (!source) return ''
        const words = source.split(/\s+/).filter(Boolean)
        if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase()
        const first = words[0]
        if (first.includes('@')) {
            const local = first.split('@')[0]
            return (local.slice(0, 2)).toUpperCase()
        }
        return (first.slice(0, 2)).toUpperCase()
    }
    const initials = user ? getInitials(user?.name, user?.email) : ''

    return (
        <div className="relative" ref={ref}>
            <button
                aria-haspopup="true"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 p-1"
                title={displayName}
            >
                {user ? (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-pink-600 text-white">
                        <span className="text-sm">{initials}</span>
                    </div>
                ) : (
                    <div className="w-10 h-10 flex items-center justify-center text-gray-700 transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <circle cx="12" cy="5" r="1.6" fill="currentColor" />
                            <circle cx="12" cy="12" r="1.6" fill="currentColor" />
                            <circle cx="12" cy="19" r="1.6" fill="currentColor" />
                        </svg>
                    </div>
                )}
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl ring-opacity-5 z-50 origin-top-right transform transition ease-out duration-150">
                    {user && (
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-pink-600 text-white">
                                    <span className="text-sm">{initials}</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-900">{displayName}</div>
                                    <div className="text-xs text-gray-500">{displayEmail || 'Cuenta'}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="py-1">
                        {menu.map((it, i) => {
                            const label = String(it.label)
                            const isLogout = label.toLowerCase().includes('cerrar') || label.toLowerCase().includes('salir')
                            const baseClass = 'flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full'
                            const extra = isLogout && i > 0 ? 'border-t border-gray-100 mt-1 pt-2' : ''
                            if (isLogout) {
                                return (
                                    <button key={i} onClick={() => { auth.logout(); setOpen(false); router.push('/') }} className={`${baseClass} ${extra}`} role="menuitem">
                                        <span className="flex-1">{it.label}</span>
                                    </button>
                                )
                            }
                            return it.href ? (
                                <Link key={i} href={it.href} className={`${baseClass} ${extra}`} onClick={() => setOpen(false)} role="menuitem">
                                    <span className="flex-1">{it.label}</span>
                                </Link>
                            ) : (
                                <button key={i} onClick={() => { it.onClick?.(); setOpen(false) }} className={`${baseClass} ${extra}`} role="menuitem">
                                    <span className="flex-1">{it.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}
