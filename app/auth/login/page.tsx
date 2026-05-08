"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { apiFetch } from '@/app/services/api'

type AuthResponse = {
    error?: string
    token?: string
    user?: {
        id: number
        name?: string
        email: string
        role?: { id: number; name: string }
    }
    data?: {
        id: number
        name?: string
        email: string
        role?: { id: number; name: string }
    }
}

export default function LoginPage() {
    const router = useRouter()
    const auth = useAuth()
    // read `next` from the browser URL at submit time to avoid using useSearchParams
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [createIfNotExists, setCreateIfNotExists] = useState(true)
    const [isRegister, setIsRegister] = useState(false)
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const getNextPath = () => {
        if (typeof window === 'undefined') return '/profile'
        return new URLSearchParams(window.location.search).get('next') || '/profile'
    }

    const persistToken = (token?: string) => {
        if (!token) return false

        try {
            localStorage.setItem('token', token)
            return true
        } catch (error) {
            console.warn('Failed to save token to localStorage', error)
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setMessage(null)
        if (!email) return setMessage('Introduce un email válido')
        if (!password) return setMessage('Introduce una contraseña')
        setLoading(true)
        try {
            let res
            if (isRegister) {
                res = await apiFetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, role: 'user', password }),
                })
            } else {
                res = await apiFetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, name, createIfNotExists, password }),
                })
            }

            const body = (await res.json()) as AuthResponse
            if (!res.ok) {
                setMessage(body?.error || 'Error en el servidor')
                setLoading(false)
                return
            }

            const user = body?.user ?? body?.data
            if (user) {
                try { auth.login(user) } catch (e) { console.warn(e) }
            }

            if (!isRegister && !persistToken(body?.token)) {
                setMessage('Login exitoso pero no se recibió token')
                setLoading(false)
                return
            }

            setMessage(isRegister ? 'Registro completado' : 'Entrada exitosa')
            router.push(getNextPath())
        } catch (err: unknown) {
            let msg = 'Error desconocido'
            try {
                if (err && typeof err === 'object' && 'message' in err) msg = String((err as { message?: unknown }).message ?? '')
                else msg = String(err)
            } catch (e) {
                msg = String(e)
            }
            setMessage(msg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#fff4fb] py-10">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-gray-900">{isRegister ? 'Registro' : 'Iniciar sesión'}</h1>
                    <div className="text-sm">
                        <button type="button" onClick={() => setIsRegister(false)} className={`px-3 py-1 ${!isRegister ? 'font-semibold text-pink-600' : 'text-gray-500'}`}>Iniciar</button>
                        <button type="button" onClick={() => setIsRegister(true)} className={`px-3 py-1 ${isRegister ? 'font-semibold text-pink-600' : 'text-gray-500'}`}>Registrarse</button>
                    </div>
                </div>
                <p className="text-sm text-gray-600 mb-6">{isRegister ? 'Crea una cuenta rápida con tu correo.' : 'Ingresa tu correo para iniciar sesión o crear una cuenta rápida.'}</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <label className="block">
                        <span className="text-sm text-gray-700">Email</span>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-pink-200"
                            placeholder="usuario@ejemplo.com"
                            required
                        />
                    </label>

                    {isRegister && (
                        <label className="block">
                            <span className="text-sm text-gray-700">Nombre</span>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-pink-200"
                                placeholder="Tu nombre"
                                required
                            />
                        </label>
                    )}

                    <label className="block">
                        <span className="text-sm text-gray-700">Contraseña</span>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:ring-2 focus:ring-pink-200"
                            placeholder="Contraseña"
                            required
                        />
                    </label>

                    {!isRegister && (
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={createIfNotExists} onChange={(e) => setCreateIfNotExists(e.target.checked)} />
                            <span className="text-gray-600">Crear cuenta si no existe</span>
                        </label>
                    )}

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 rounded-lg bg-pink-600 text-white font-semibold hover:bg-pink-700 disabled:opacity-60">
                            {loading ? 'Procesando...' : (isRegister ? 'Registrarse' : 'Iniciar sesión')}
                        </button>
                    </div>
                </form>

                {message && <div className="mt-4 text-sm text-center text-gray-700">{message}</div>}
            </div>
        </div>
    )
}
