"use client"
import React, { useEffect, useState } from 'react'
import AdsCarousel from './AdsCarousel'

type PromoItem = string | { id?: string | number; image?: string }

export default function PromotionsClient({ initial }: { initial?: PromoItem[] }) {
    const [items, setItems] = useState<PromoItem[]>(initial || [])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        let mounted = true
        setLoading(true)
        fetch('/api/promotions')
            .then((r) => r.json())
            .then((j) => {
                if (!mounted) return
                const data = j && j.data ? (j.data as Array<Record<string, unknown>>) : []
                const mapped = data
                    .map((p) => {
                        const id = (p as any).id as string | number | undefined
                        const image = (p as any).image as string | undefined
                        return image ? { id, image } : null
                    })
                    .filter(Boolean) as { id?: string | number; image?: string }[]
                if (mapped.length) setItems(mapped)
            })
            .catch(() => { })
            .finally(() => { if (mounted) setLoading(false) })
        return () => { mounted = false }
    }, [])

    if ((!items || items.length === 0) && loading) return null

    return (
        <AdsCarousel images={items} />
    )
}
