"use client"
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import ConfirmModal from '../app/components/ui/ConfirmModal'
import { useAuth } from '@/contexts/AuthContext'
import { FiTrash2 } from 'react-icons/fi'

interface AdsCarouselProps {
    images?: Array<string | { id?: string | number; image?: string; orientation?: string }>
    interval?: number
    className?: string
    showDots?: boolean
    showArrows?: boolean
}

const AdsCarousel: React.FC<AdsCarouselProps> = ({ images, interval = 4000, className = '', showDots = true, showArrows = true }) => {
    const [index, setIndex] = useState(0)
    const timerRef = useRef<number | null>(null)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const auth = useAuth()
    const isAdmin = Boolean(auth.user?.role?.name && String(auth.user.role.name).toLowerCase() === 'admin')

    const [removedIds, setRemovedIds] = useState<string[]>([])
    const items = useMemo(() => {
        return (images || [])
            .map((it) => (typeof it === 'string'
                ? { id: undefined as string | undefined, src: it, orientation: 'HORIZONTAL' }
                : { id: (it as any).id, src: (it as any).image, orientation: ((it as any).orientation || 'HORIZONTAL') }))
            .filter((it) => (it.id == null ? true : !removedIds.includes(String(it.id))))
    }, [images, removedIds])
    const length = items.length
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmId, setConfirmId] = useState<string | number | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

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

    useEffect(() => {
        setRemovedIds([])
    }, [images])

    useEffect(() => {
        if (index <= Math.max(length - 1, 0)) return
        setIndex(0)
    }, [index, length])

    if (!items || items.length === 0) return null

    return (
        <div ref={containerRef} className={`relative overflow-hidden rounded-lg ${className}`}>
            <div className="flex transition-transform duration-500" style={{ transform: `translateX(-${index * 100}%)` }}>
                {items.map((it, i) => {
                    const itemKey = String(it.id ?? it.src ?? i)
                    return (
                        <div key={itemKey} className={`w-full flex-shrink-0 relative ${String(it.orientation).toUpperCase() === 'VERTICAL' ? 'h-80 sm:h-96 md:h-[28rem]' : 'h-48 sm:h-56 md:h-64'} bg-gray-100 overflow-hidden`}>
                            <Image src={it.src} alt={`Ad ${i + 1}`} fill style={{ objectFit: 'contain', objectPosition: 'center' }} />
                            {isAdmin && it.id != null && (
                                <button
                                    type="button"
                                    onClick={() => { setConfirmId(it.id as string | number); setConfirmOpen(true) }}
                                    className="absolute top-2 right-2 z-20 flex items-center justify-center h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/75"
                                    aria-label="Eliminar promoción"
                                >
                                    <FiTrash2 />
                                </button>
                            )}
                        </div>
                    )
                })}
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
                    {items.map((it, i) => {
                        const itemKey = String(it.id ?? it.src ?? i)
                        return <button key={itemKey} aria-label={`Ir a ${i + 1}`} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i === index ? 'bg-white' : 'bg-white/50'}`} />
                    })}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Eliminar promoción"
                description={isAdmin ? '¿Deseas eliminar esta promoción? Esta acción es irreversible.' : 'No tienes permisos para eliminar promociones.'}
                confirmText={isAdmin ? 'Eliminar' : 'Cerrar'}
                isLoading={deleting}
                onCancel={() => { setConfirmOpen(false); setConfirmId(null) }}
                onConfirm={async () => {
                    if (!confirmId) return
                    setDeleting(true)
                    try {
                        if (!isAdmin) {
                            setMessage('No autorizado')
                            return
                        }
                        const res = await fetch(`/api/promotions/${confirmId}`, { method: 'DELETE' })
                        if (res.ok || res.status === 204) {
                            setRemovedIds((prev) => [...prev, String(confirmId)])
                            setMessage('Promoción eliminada')
                        } else {
                            const txt = await res.text().catch(() => '')
                            setMessage(`Error: ${res.status} ${txt}`)
                        }
                    } catch (e) {
                        console.error(e)
                        setMessage('Error al eliminar')
                    } finally {
                        setDeleting(false)
                        setConfirmOpen(false)
                        setConfirmId(null)
                        setTimeout(() => setMessage(null), 3000)
                    }
                }}
            />
            {message && (
                <div className="absolute left-1/2 -translate-x-1/2 top-3 z-30 bg-black/60 text-white px-3 py-1 rounded">{message}</div>
            )}
        </div>
    )
}

export default AdsCarousel
