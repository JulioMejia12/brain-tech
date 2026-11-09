'use client'

import { FaWhatsapp } from 'react-icons/fa'
import NavBar from '../components/layout/NavBar'

export type BetterwareNavBarProps = {
    whatsappHref?: string | null
    textColor?: string
    backgroundColor?: string
    variant?: 'light' | 'dark' | 'transparent'
    sticky?: boolean
    className?: string
    containerClassName?: string
}

export default function BetterwareNavBar({
    whatsappHref,
    textColor = '#fff',
    backgroundColor = '#4C2365',
    variant = 'light',
    sticky = true,
    className,
    containerClassName,
}: BetterwareNavBarProps) {
    return (
        <NavBar
            textColor={textColor}
            backgroundColor={backgroundColor}
            brand={{
                name: 'Tienda Betterware',
                href: '/tienda-betterware',
                initials: 'BW',
                subtitle: 'Catálogo online',
            }}
            actions={
                whatsappHref
                    ? [
                        {
                            label: 'WhatsApp',
                            href: whatsappHref,
                            external: true,
                            icon: <FaWhatsapp className="h-4 w-4" />,
                            showOnMobile: true,
                        },
                    ]
                    : []
            }
            variant={variant}
            sticky={sticky}
            className={className}
            containerClassName={containerClassName}
        />
    )
}
