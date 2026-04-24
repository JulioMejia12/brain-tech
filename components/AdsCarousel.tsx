import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface AdsCarouselProps {
    images?: string[]
    interval?: number
    className?: string
    showDots?: boolean
    showArrows?: boolean
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({ images, interval = 4000, className = '', showDots = true, showArrows = true }) => {
    const [index, setIndex] = useState(0)
    const timerRef = useRef<number | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const length = images?.length || 0

    const next = () => setIndex((i) => (i + 1) % Math.max(1, length))
    const prev = () => setIndex((i) => (i - 1 + length) % Math.max(1, length))

    useEffect(() => {
        if (length <= 1) return
        const start = () => {
            stop()
            timerRef.current = window.setInterval(() => {
                setIndex((i) => (i + 1) % length)
            }, interval)
        }
        const stop = () => {
            if (timerRef.current) {
                window.clearInterval(timerRef.current)
                timerRef.current = null
            }
        }

        start()
        return () => stop()
    }, [length, interval])

    // pause on hover
    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onEnter = () => { if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null } }
        const onLeave = () => {
            if (length <= 1) return
            if (!timerRef.current) timerRef.current = window.setInterval(() => setIndex((i) => (i + 1) % length), interval)
        }
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
        return () => {
            el.removeEventListener('mouseenter', onEnter)
            el.removeEventListener('mouseleave', onLeave)
        }
    }, [length, interval])

    if (!images || images.length === 0) return null

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-lg ${className}`}>
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
                {images.map((src, i) => (
                    <div key={i} className="w-full flex-shrink-0 relative h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
                        <Image src={src} alt={`Ad ${i + 1}`} fill style={{ objectFit: 'cover', objectPosition: 'center' }} />
                    </div>
                ))}
            </div>

            {showArrows && length > 1 && (
                <>
                    <button aria-label="Anterior" onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
                        ‹
                    </button>
                    <button aria-label="Siguiente" onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60">
                        ›
                    </button>
                </>
            )}

            {showDots && length > 1 && (
                <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-2">
                    {images.map((_, i) => (
                        <button key={i} aria-label={`Ir a ${i + 1}`} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default AdsCarousel
