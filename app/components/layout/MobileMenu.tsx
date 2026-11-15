'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'
import { FiHome, FiMenu, FiPhone, FiStar } from 'react-icons/fi'

type MobileMenuContextValue = {
    primary: string
    textColor?: string
    inactiveTextColor?: string
    activeTextColor?: string
    activeId: string
    setActiveId: (id: string) => void
}

const MobileMenuContext = createContext<MobileMenuContextValue | null>(null)

function useMobileMenu() {
    const context = useContext(MobileMenuContext)

    if (!context) {
        throw new Error('MobileMenu.Item must be used within MobileMenu.Root')
    }

    return context
}

export type MobileMenuItemProps = {
    id: string
    label: string
    icon: ReactNode
    targetId?: string
    href?: string
    external?: boolean
    onClick?: () => void
    className?: string
}

export function MobileMenuItem({
    id,
    label,
    icon,
    targetId,
    href,
    external = false,
    onClick,
    className = '',
}: MobileMenuItemProps) {
    const { primary, textColor, inactiveTextColor, activeTextColor, activeId, setActiveId } = useMobileMenu()
    const active = activeId === id

    const handleClick = () => {
        setActiveId(id)
        onClick?.()

        if (targetId) {
            const element = document.getElementById(targetId)

            if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
                return
            }
        }

        if (href) {
            if (external) {
                window.open(href, '_blank', 'noopener,noreferrer')
            } else {
                window.location.href = href
            }
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className={`flex flex-col items-center rounded px-2 py-1 text-sm transition ${className}`}
            style={
                active
                    ? { backgroundColor: primary, color: activeTextColor ?? textColor ?? '#fff' }
                    : { color: inactiveTextColor ?? '#374151' }
            }
        >
            <span className="mb-1 flex h-6 w-6 items-center justify-center text-current">{icon}</span>
            <span>{label}</span>
        </button>
    )
}

export type MobileMenuRootProps = {
    primary: string
    textColor?: string
    inactiveTextColor?: string
    activeTextColor?: string
    backgroundColor?: string
    whatsappNumber?: string
    children?: ReactNode
    className?: string
    defaultActiveId?: string
}

function DefaultMobileMenuItems({ whatsappNumber }: { whatsappNumber?: string }) {
    const digits = (whatsappNumber || '').replace(/[^0-9]/g, '')
    const whatsappHref = digits
        ? `https://wa.me/${digits}?text=${encodeURIComponent('Hola, me interesa comprar productos. ¿Me pueden ayudar con más información?')}`
        : undefined

    return (
        <>
            <MobileMenuItem
                id="productos"
                label="Productos"
                icon={<FiHome className="h-6 w-6" />}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
            <MobileMenuItem
                id="nosotros"
                label="Nosotros"
                icon={<FiMenu className="h-6 w-6" />}
                targetId="info"
            />
            <MobileMenuItem
                id="promos"
                label="Promos"
                icon={<FiStar className="h-6 w-6" />}
                targetId="promos"
            />
            <MobileMenuItem
                id="contacto"
                label="Contáctanos"
                icon={
                    <span className="rounded-full bg-[#25D366] p-1 text-white">
                        <FiPhone className="h-4 w-4" />
                    </span>
                }
                href={whatsappHref}
                external
            />
        </>
    )
}

export function MobileMenuRoot({
    primary,
    textColor,
    inactiveTextColor,
    activeTextColor,
    backgroundColor,
    whatsappNumber,
    children,
    className = '',
    defaultActiveId = 'productos',
}: MobileMenuRootProps) {
    const [activeId, setActiveId] = useState(defaultActiveId)

    return (
        <MobileMenuContext.Provider
            value={{ primary, textColor, inactiveTextColor, activeTextColor, activeId, setActiveId }}
        >
            <nav
                aria-label="Mobile navigation"
                className={`fixed bottom-0 left-1/2 z-50 w-[94%] max-w-3xl -translate-x-1/2 rounded-xl px-3 py-2 shadow-lg backdrop-blur sm:hidden ${
                    backgroundColor ? '' : 'bg-white/95'
                } ${className}`}
                style={{
                    ...(backgroundColor ? { backgroundColor } : {}),
                    ...(textColor ? { color: textColor } : {}),
                }}
            >
                <div className="flex items-center justify-between">
                    {children ?? <DefaultMobileMenuItems whatsappNumber={whatsappNumber} />}
                </div>
            </nav>
        </MobileMenuContext.Provider>
    )
}

const MobileMenu = Object.assign(MobileMenuRoot, {
    Root: MobileMenuRoot,
    Item: MobileMenuItem,
})

export default MobileMenu
