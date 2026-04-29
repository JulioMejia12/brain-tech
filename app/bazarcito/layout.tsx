'use client'
import React from 'react'
import NavBar from '../components/layout/NavBar'
import Footer from '../components/layout/Footer'

export default function BazarcitoLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar primary="#111827" textColor="#fff" textColorLogo="#fff" title="Bazarcito" />
            <div className="flex-1">
                {children}
            </div>
            <Footer />
        </div>
    )
}
