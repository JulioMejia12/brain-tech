"use client"

import React from "react"

type Props = {
    lat?: number
    lng?: number
    query?: string
    zoom?: number
    height?: string
}

export default function Map({ lat, lng, query, zoom = 15, height = '420px' }: Props) {
    const src = query
        ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=${zoom}&output=embed`
        : typeof lat === 'number' && typeof lng === 'number'
            ? `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`
            : ''

    if (!src) return null

    return (
        <div className="max-w-4xl mx-auto w-full my-8">
            <div className="w-full rounded-lg overflow-hidden shadow" style={{ height }}>
                <iframe
                    src={src}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Mapa"
                    className="border-0"
                    allowFullScreen
                />
            </div>
        </div>
    )
}
