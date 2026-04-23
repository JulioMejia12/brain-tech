import React from 'react'

type Props = {
    logo?: string
    title?: string
    primary: string
    textColor: string
    textColorLogo?: string
    query?: string
    onQueryChange?: (value: string) => void
}
const NavBar = ({ logo, title, primary, textColor, textColorLogo, query = '', onQueryChange }: Props) => {
    const handleQueryChange = (value: string) => {
        if (onQueryChange) onQueryChange(value)
    }

    return (
        <header className="shadow" style={{ background: primary }}>
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 10.5a7.5 7.5 0 0013.15 6.15z" />
                                </svg>
                            </span>

                            <input
                                type="text"
                                value={query}
                                placeholder="Buscar productos por nombre"
                                onChange={(e) => handleQueryChange(e.target.value)}
                                className="pl-10 pr-10 py-2 rounded-full text-sm w-72 transition-shadow duration-200 focus:shadow-xl"
                                style={{ color: textColor, background: 'rgba(255,255,255,0.95)', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}
                                aria-label="Buscar productos"
                            />

                            {query && (
                                <button onClick={() => handleQueryChange('')} aria-label="Limpiar búsqueda" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                </div>
            </div>
        </header>
    )
}

export default NavBar