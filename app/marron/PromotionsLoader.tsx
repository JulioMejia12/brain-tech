"use client"

import React, { useEffect, useState } from 'react'
import PromotionsClient from '../../components/PromotionsClient'

const MARRON_NEGOCIO_ID = process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || '2'

type ItemType = { id?: string | number; image?: string; orientation?: string }
type PromotionApiItem = { id?: string | number; image?: string; src?: string; orientation?: string }

export default function PromotionsLoader() {
    const [items, setItems] = useState<ItemType[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        fetch(`/api/promotions?negocioId=${encodeURIComponent(MARRON_NEGOCIO_ID)}`)
            .then((r) => r.json())
            .then((j) => {
                if (!mounted) return
                const data = Array.isArray(j?.data) ? (j.data as PromotionApiItem[]) : []
                const mapped = data
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
                <div className="animate-spin h-8 w-8 border-4 border-amber-700 rounded-full" />
            </div>
        )
    }

    return <PromotionsClient items={items ?? []} />
}
