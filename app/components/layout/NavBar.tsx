"use client"
import React, { useState, useEffect } from 'react'
import { FiSearch, FiX } from 'react-icons/fi'
import Avatar from './Avatar'
type Props = {
    logo?: string
    title?: string
    primary: string
    textColor: string
    textColorLogo?: string
    query?: string
    onQueryChange?: (value: string) => void
    hideOnMobile?: boolean
}
const NavBar = ({ logo, title, primary, textColor, textColorLogo, query = '', onQueryChange, hideOnMobile = false }: Props) => {
    const handleQueryChange = (value: string) => {
        if (onQueryChange) onQueryChange(value)
    }
    const [localQuery, setLocalQuery] = useState<string>(query)

    useEffect(() => {
        setLocalQuery(query)
    }, [query])
    const normalized = String(textColor || '').trim().toLowerCase()
    const inputColor = (normalized === '#fff' || normalized === 'white' || normalized === 'rgb(255,255,255)') ? '#111' : (textColor || '#111')

    return (
        <header className={`shadow ${hideOnMobile ? 'hidden sm:block' : ''}`} style={{ background: primary }}>
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={logo} alt={title} className="w-14 h-14 md:w-16 md:h-16 object-contain rounded-full" />
                    ) : (
                        <div className="text-2xl font-bold" style={{ color: textColorLogo }}>{title}</div>
                    )}

                    <nav className="hidden sm:flex gap-4 text-md" style={{ color: textColor }}>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                <FiSearch className="h-4 w-4" />
                            </span>

                            <input
                                type="text"
                                value={localQuery}
                                placeholder="Buscar productos por nombre"
                                onChange={(e) => { setLocalQuery(e.target.value); handleQueryChange(e.target.value) }}
                                className="pl-10 pr-10 py-2 rounded-full text-sm w-72 transition-shadow duration-200 focus:shadow-xl placeholder-gray-500"
                                style={{ color: inputColor, background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                                aria-label="Buscar productos"
                            />

                            {localQuery && (
                                <button onClick={() => { setLocalQuery(''); handleQueryChange('') }} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                    <FiX className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    {/* Avatar / account menu */}
                    <Avatar src="/logo.png" name="Cuenta" />
                </div>
            </div>
        </header>
    )
}

export default NavBar