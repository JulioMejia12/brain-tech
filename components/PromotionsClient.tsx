"use client"
import React, { useEffect, useState } from 'react'
import AdsCarousel from './AdsCarousel'
import ButtonSpinner from '@/app/components/ui/ButtonSpinner'

type PromoItem = string | { id?: string | number; image?: string; orientation?: string }

type Props = {
    items?: PromoItem[]
    initial?: PromoItem[]
}

export default function PromotionsClient({ items: propItems, initial }: Props) {
    const [items, setItems] = useState<PromoItem[] | null>(propItems ?? (initial ?? null))
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // If items are provided via prop (even an empty array), don't fetch — caller controls data
        if (propItems !== undefined) return
        if (initial && initial.length > 0) return

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
                        const orientation = ((p as any).orientation as string | undefined) || undefined
                        return image ? { id, image, orientation } : null
                    })
                    .filter(Boolean) as { id?: string | number; image?: string; orientation?: string }[]
                if (mapped.length) setItems(mapped)
                else setItems([])
            })
            .catch(() => { if (mounted) setItems([]) })
            .finally(() => { if (mounted) setLoading(false) })
        return () => { mounted = false }
    }, [propItems, initial])

    const resolved = propItems ?? items ?? []

    if (loading && resolved.length === 0) {
        return (
            <div className="flex items-center justify-center h-48">
                <ButtonSpinner className="h-8 w-8 text-pink-600" />
            </div>
        )
    }

    if (!resolved || resolved.length === 0) return null

    return <AdsCarousel images={resolved} />
}
