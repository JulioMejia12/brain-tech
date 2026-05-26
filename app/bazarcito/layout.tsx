import type { Metadata } from 'next'
import { Suspense } from 'react'
import BazarcitoNav from './BazarcitoNav'
import Footer from '../components/layout/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.localhub.online'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Bazarcito online',
    description: 'Compra productos para el hogar y recibe atención directa por WhatsApp en Bazarcito online.',
    openGraph: {
        title: 'Bazarcito online',
        description: 'Compra productos para el hogar y recibe atención directa por WhatsApp en Bazarcito online.',
        url: `${siteUrl}/bazarcito`,
        siteName: 'LocalHub',
        type: 'website',
    },
}

export default function BazarcitoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
                <BazarcitoNav />
            </Suspense>
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}
