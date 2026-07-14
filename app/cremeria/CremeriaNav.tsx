'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import NavBar from '../components/layout/NavBar'

export default function CremeriaNav() {
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
            primary="#0ea5a4"
            textColor="#042024"
            textColorLogo="#042024"
            title="Cremería online"
            query={query}
            logo={'https://res.cloudinary.com/ddfj0omil/image/upload/cremeria_tse1ps'}
            onQueryChange={handleQueryChange}
            hideOnMobile
        />
    )
}
