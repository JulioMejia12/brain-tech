"use client"
import React, { useEffect, useState } from 'react'
import PromotionsClient from '../../components/PromotionsClient'
import { cremeriaProductsSellProps } from '../lib/productsSellConfig'

const CREMERIA_NEGOCIO_ID = process.env.NEXT_PUBLIC_CREMERIA_NEGOCIO_ID || process.env.CREMERIA_NEGOCIO_ID || '3'

type ItemType = { id?: string | number; image?: string; orientation?: string }

export default function PromotionsLoader() {
    const [items, setItems] = useState<ItemType[] | undefined>(undefined)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let mounted = true
        const url = `/api/promotions?negocioId=${encodeURIComponent(CREMERIA_NEGOCIO_ID)}`
        fetch(url)
            .then((r) => r.json())
            .then((j) => {
                if (!mounted) return
                const data = j?.data ?? []
                const mapped = (data as any[])
                    .map((p: any) => (p && (p.image || p.src) ? { id: p.id, image: p.image || p.src, orientation: p.orientation || 'HORIZONTAL' } : null))
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
                <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: cremeriaProductsSellProps.primary }} />
            </div>
        )
    }

    return <PromotionsClient items={items ?? []} />
}
