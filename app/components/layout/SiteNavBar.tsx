'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, type ReactNode } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'

export type SiteNavBarLink = {
    label: string
    href: string
    external?: boolean
    active?: boolean
}

export type SiteNavBarAction = {
    label: string
    href: string
    external?: boolean
    variant?: 'primary' | 'secondary' | 'ghost'
    icon?: ReactNode
    showOnMobile?: boolean
}

export type SiteNavBarBrand = {
    name: string
    href?: string
    logo?: string
    initials?: string
    subtitle?: string
}

export type SiteNavBarProps = {
    brand?: SiteNavBarBrand
    links?: SiteNavBarLink[]
    actions?: SiteNavBarAction[]
    variant?: 'light' | 'dark' | 'transparent'
    sticky?: boolean
    textColor?: string
    backgroundColor?: string
    className?: string
    containerClassName?: string
}

const variantStyles = {
    light: {
        header: 'bg-white/95 text-slate-900 shadow-sm backdrop-blur',
        link: 'text-slate-600 hover:text-slate-950',
        activeLink: 'text-slate-950',
        menuButton: 'border-slate-200',
        action: {
            primary: 'bg-slate-900 text-white hover:bg-slate-800',
            secondary: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50',
            ghost: 'text-slate-700 hover:bg-slate-100',
        },
    },
    dark: {
        header: 'bg-slate-950/90 text-white shadow-lg shadow-black/20 backdrop-blur',
        link: 'text-slate-300 hover:text-white',
        activeLink: 'text-white',
        menuButton: 'border-white/20',
        action: {
            primary: 'bg-white text-slate-950 hover:bg-slate-100',
            secondary: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
            ghost: 'text-slate-200 hover:bg-white/10',
        },
    },
    transparent: {
        header: 'bg-transparent text-white',
        link: 'text-white/80 hover:text-white',
        activeLink: 'text-white',
        menuButton: 'border-white/20',
        action: {
            primary: 'bg-[var(--primary)] text-slate-950 hover:opacity-90',
            secondary: 'border border-white/20 bg-white/5 text-white hover:bg-white/10',
            ghost: 'text-white/80 hover:bg-white/10',
        },
    },
} as const

function isExternal(href: string, external?: boolean) {
    return external || /^https?:\/\//.test(href) || href.startsWith('mailto:') || href.startsWith('tel:')
}

function NavLink({ link, className, activeClassName }: { link: SiteNavBarLink; className: string; activeClassName: string }) {
    const pathname = usePathname()
    const active = link.active ?? (link.href.startsWith('/') ? pathname === link.href : false)
    const classes = `${className} ${active ? activeClassName : ''}`

    if (isExternal(link.href, link.external)) {
        return (
            <a href={link.href} target="_blank" rel="noreferrer" className={classes}>
                {link.label}
            </a>
        )
    }

    return (
        <Link href={link.href} className={classes}>
            {link.label}
        </Link>
    )
}

function ActionLink({ action, className }: { action: SiteNavBarAction; className: string }) {
    const content = (
        <>
            {action.icon}
            <span>{action.label}</span>
        </>
    )

    if (isExternal(action.href, action.external)) {
        return (
            <a href={action.href} target="_blank" rel="noreferrer" className={className}>
                {content}
            </a>
        )
    }

    return (
        <Link href={action.href} className={className}>
            {content}
        </Link>
    )
}

export default function SiteNavBar({
    brand,
    links = [],
    actions = [],
    variant = 'light',
    sticky = false,
    textColor,
    backgroundColor,
    className = '',
    containerClassName = '',
}: SiteNavBarProps) {
    const [open, setOpen] = useState(false)
    const styles = variantStyles[variant]
    const mobileActions = actions.filter((action) => action.showOnMobile)

    return (
        <header
            className={`${sticky ? 'sticky top-0 z-50' : ''} ${styles.header} ${className}`}
            style={{ color: textColor, backgroundColor }}
        >
            <div className={`mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8 ${containerClassName}`}>
                <div className="flex items-center gap-3">
                    {brand && (
                        <Link href={brand.href || '/'} className="flex items-center gap-3">
                            {brand.logo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={brand.logo} alt={brand.name} className="h-10 w-10 rounded-xl object-contain" />
                            ) : (
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-black text-slate-950">
                                    {brand.initials || brand.name.slice(0, 1)}
                                </span>
                            )}
                            <span className="flex flex-col leading-tight">
                                <span className="text-sm font-bold">{brand.name}</span>
                                {brand.subtitle && <span className="text-[11px] opacity-70">{brand.subtitle}</span>}
                            </span>
                        </Link>
                    )}
                </div>

                {links.length > 0 && (
                    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
                        {links.map((link) => (
                            <NavLink
                                key={`${link.label}-${link.href}`}
                                link={link}
                                className={styles.link}
                                activeClassName={styles.activeLink}
                            />
                        ))}
                    </nav>
                )}

                <div className="hidden items-center gap-2 md:flex">
                    {actions.map((action) => (
                        <ActionLink
                            key={`${action.label}-${action.href}`}
                            action={action}
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition ${styles.action[action.variant || 'primary']}`}
                        />
                    ))}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    {mobileActions.map((action) => (
                        <ActionLink
                            key={`mobile-${action.label}-${action.href}`}
                            action={action}
                            className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${styles.action[action.variant || 'primary']}`}
                        />
                    ))}
                    {(links.length > 0 || actions.length > 0) && (
                        <button
                            type="button"
                            onClick={() => setOpen((value) => !value)}
                            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
                            className={`inline-flex h-10 w-10 items-center justify-center rounded-full border ${styles.menuButton}`}
                        >
                            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                        </button>
                    )}
                </div>
            </div>

            {open && (
                <div className="border-t border-white/10 px-5 pb-4 pt-2 md:hidden">
                    {links.length > 0 && (
                        <nav className="flex flex-col gap-1">
                            {links.map((link) => (
                                <NavLink
                                    key={`mobile-${link.label}-${link.href}`}
                                    link={link}
                                    className={`rounded-xl px-3 py-2 text-sm font-medium ${styles.link}`}
                                    activeClassName={styles.activeLink}
                                />
                            ))}
                        </nav>
                    )}
                    {actions.length > 0 && (
                        <div className="mt-3 flex flex-col gap-2">
                            {actions.map((action) => (
                                <ActionLink
                                    key={`mobile-all-${action.label}-${action.href}`}
                                    action={action}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${styles.action[action.variant || 'primary']}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </header>
    )
}
