import type { Metadata } from 'next'
import { Suspense } from 'react'
import CremeriaNav from './CremeriaNav'
import Footer from '../components/layout/Footer'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.localhub.online'

export const metadata: Metadata = {
    metadataBase: new URL(siteUrl),
    title: 'Cremería online',
    description: 'Compra productos de la cremería y recibe atención directa por WhatsApp en Cremería online.',
    openGraph: {
        title: 'Cremería online',
        description: 'Compra productos de la cremería y recibe atención directa por WhatsApp en Cremería online.',
        url: `${siteUrl}/cremeria`,
        siteName: 'LocalHub',
        type: 'website',
    },
}

export default function CremeriaLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Suspense fallback={null}>
                <CremeriaNav />
            </Suspense>
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}
