import type { Metadata } from 'next'
import { Suspense } from 'react'
import MarronNav from './MarronNav'
import Footer from '../components/layout/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.localhub.online'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Marron',
    description: 'Compra productos de Marron y recibe atención directa por WhatsApp.',
    openGraph: {
        title: 'Marron',
        description: 'Compra productos de Marron y recibe atención directa por WhatsApp.',
        url: `${siteUrl}/marron`,
        siteName: 'LocalHub',
        type: 'website',
    },
}

export default function MarronLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
                <MarronNav />
            </Suspense>
            <div className="flex-1">{children}</div>
            <Footer />
        </div>
    )
}
