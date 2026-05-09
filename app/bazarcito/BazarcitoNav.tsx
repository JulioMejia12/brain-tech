'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import NavBar from '../components/layout/NavBar'

export default function BazarcitoNav() {
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
            primary="#ff81e3"
            textColor="#fff"
            textColorLogo="#fff"
            title="Bazarcito online"
            query={query}
            logo={'/logoBazar.png'}
            onQueryChange={handleQueryChange}
        />
    )
}