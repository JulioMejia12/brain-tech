"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
    id: number
    name?: string
    email: string
    role?: { id: number; name: string }
}

type AuthContextValue = {
    user: User | null
    setUser: (u: User | null) => void
    login: (user: User, storefront?: string | null) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)
const AUTH_USER_KEY = 'authUser'
const AUTH_STOREFRONT_KEY = 'authStorefront'

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null)

    useEffect(() => {
        try {
            const raw = localStorage.getItem(AUTH_USER_KEY)
            if (raw) {
                setUserState(JSON.parse(raw))
            }
        } catch (e) {
            console.warn('Failed to read authUser from localStorage', e)
        }
    }, [])

    useEffect(() => {
        try {
            if (user) localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
            else localStorage.removeItem(AUTH_USER_KEY)
        } catch (e) {
            console.warn('Failed to write authUser to localStorage', e)
        }
    }, [user])

    const setUser = (u: User | null) => setUserState(u)
    const login = (u: User, storefront?: string | null) => {
        setUserState(u)
        try {
            if (storefront) localStorage.setItem(AUTH_STOREFRONT_KEY, storefront)
            else localStorage.removeItem(AUTH_STOREFRONT_KEY)
        } catch (e) {
            console.warn('Failed to write authStorefront to localStorage', e)
        }
    }
    const logout = () => {
        setUserState(null)
        try {
            localStorage.removeItem('token')
            localStorage.removeItem(AUTH_USER_KEY)
            localStorage.removeItem(AUTH_STOREFRONT_KEY)
        } catch (e) {
            console.warn('Failed to remove token from localStorage', e)
        }
    }

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export default AuthContext
