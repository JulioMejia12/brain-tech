import { Suspense } from 'react'
import BazarcitoNav from './BazarcitoNav'
import Footer from '../components/layout/Footer'

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
