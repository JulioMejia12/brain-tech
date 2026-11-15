'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import NavBar from '../components/layout/NavBar'

export type BetterwareNavBarProps = {
    textColor?: string
    backgroundColor?: string
    title?: string
    logo?: string
    hideOnMobile?: boolean
}

export default function BetterwareNavBar({
    textColor = '#fff',
    backgroundColor = '#4C2365',
    title = 'Tienda Betterware',
    logo,
    hideOnMobile = false,
}: BetterwareNavBarProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const query = searchParams.get('q') || ''

    const handleQueryChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value.trim()) {
            params.set('q', value)
        } else {
            params.delete('q')
        }

        const newPath = `${pathname}${params.toString() ? `?${params.toString()}` : ''}`
        router.replace(newPath, { scroll: false })
    }

    return (
        <NavBar
            primary={backgroundColor}
            textColor={textColor}
            textColorLogo={textColor}
            title={title}
            logo={logo}
            query={query}
            onQueryChange={handleQueryChange}
            hideOnMobile={hideOnMobile}
        />
    )
}
