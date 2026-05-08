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
    login: (user: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUserState] = useState<User | null>(null)

    useEffect(() => {
        try {
            const raw = localStorage.getItem('authUser')
            if (raw) {
                setUserState(JSON.parse(raw))
            }
        } catch (e) {
            console.warn('Failed to read authUser from localStorage', e)
        }
    }, [])

    useEffect(() => {
        try {
            if (user) localStorage.setItem('authUser', JSON.stringify(user))
            else localStorage.removeItem('authUser')
        } catch (e) {
            console.warn('Failed to write authUser to localStorage', e)
        }
    }, [user])

    const setUser = (u: User | null) => setUserState(u)
    const login = (u: User) => setUserState(u)
    const logout = () => {
        setUserState(null)
        try {
            localStorage.removeItem('token')
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
