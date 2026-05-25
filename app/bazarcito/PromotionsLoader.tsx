"use client"
import React, { useEffect, useState } from 'react'
import PromotionsClient from '../../components/PromotionsClient'

type ItemType = { id?: string | number; image?: string; orientation?: string }

export default function PromotionsLoader() {
    const [items, setItems] = useState<ItemType[] | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        fetch('/api/promotions')
            .then((r) => r.json())
            .then((j) => {
                if (!mounted) return
                const data = j?.data ?? []
                const mapped = (data as any[])
                    .map((p) => (p && (p.image || p.src) ? { id: p.id, image: p.image || p.src, orientation: p.orientation || 'HORIZONTAL' } : null))
                    .filter(Boolean)
                setItems(mapped as ItemType[])
            })
            .catch(() => { if (mounted) setItems([]) })
            .finally(() => { if (mounted) setLoading(false) })

        return () => { mounted = false }
    }, [])

    if (loading && !items) {
        return (
            <div className="flex items-center justify-center h-48">
                <div className="animate-spin h-8 w-8 border-4 border-pink-600 rounded-full" />
            </div>
        )
    }

    return <PromotionsClient items={items ?? []} />
}
