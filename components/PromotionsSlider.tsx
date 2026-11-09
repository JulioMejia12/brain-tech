'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi'
import ConfirmModal from '../app/components/ui/ConfirmModal'
import ButtonSpinner from '../app/components/ui/ButtonSpinner'
import { useAuth } from '@/contexts/AuthContext'

export type PromotionSlide =
    | string
    | {
        id?: string | number
        image?: string
        src?: string
        orientation?: string
        title?: string
        name?: string
        description?: string
        price?: string
        specialPrice?: string
        href?: string
        external?: boolean
    }

export type NormalizedPromotionSlide = {
    id?: string | number
    src: string
    orientation: string
    title?: string
    description?: string
    price?: string
    href?: string
    external?: boolean
}

export type PromotionsSliderProps = {
    items?: PromotionSlide[]
    negocioId?: string | number
    interval?: number
    className?: string
    showDots?: boolean
    showArrows?: boolean
    autoPlay?: boolean
    allowAdminDelete?: boolean
    emptyMessage?: ReactNode
    ariaLabel?: string
    textColor?: string
    backgroundColor?: string
    onSlideClick?: (slide: NormalizedPromotionSlide, index: number) => void
}

function joinClasses(...classes: Array<string | false | null | undefined>) {
    return classes.filter(Boolean).join(' ')
}

export default function PromotionsSlider({
    items,
    negocioId = 1,
    interval = 4000,
    className,
    showDots = true,
    showArrows = true,
    autoPlay = true,
    allowAdminDelete = true,
    emptyMessage,
    ariaLabel = 'Promociones',
    textColor,
    backgroundColor,
    onSlideClick,
}: PromotionsSliderProps) {
    const customColorsStyle = {
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(textColor ? { color: textColor } : {}),
    }
    const [fetchedItems, setFetchedItems] = useState<PromotionSlide[] | null>(null)
    const [index, setIndex] = useState(0)
    const [paused, setPaused] = useState(false)
    const [removedIds, setRemovedIds] = useState<string[]>([])
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmId, setConfirmId] = useState<string | number | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const touchStartX = useRef<number | null>(null)
    const auth = useAuth()
    const isAdmin = Boolean(auth.user?.role?.name && String(auth.user.role.name).toLowerCase() === 'admin')
    const canDelete = allowAdminDelete && isAdmin

    const shouldFetch = items === undefined

    useEffect(() => {
        if (!shouldFetch) return

        let mounted = true
        const url = `/api/promotions?negocioId=${encodeURIComponent(String(negocioId))}`

        fetch(url)
            .then((response) => response.json())
            .then((json) => {
                if (!mounted) return
                setFetchedItems(Array.isArray(json?.data) ? (json.data as PromotionSlide[]) : [])
            })
            .catch(() => {
                if (mounted) setFetchedItems([])
            })

        return () => {
            mounted = false
        }
    }, [shouldFetch, negocioId])

    const source = items ?? fetchedItems
    const [lastSource, setLastSource] = useState(source)

    if (lastSource !== source) {
        setLastSource(source)
        setRemovedIds([])
    }

    const normalizedSlides = useMemo<NormalizedPromotionSlide[]>(() => {
        const raw = items ?? fetchedItems ?? []

        return raw
            .map((item): NormalizedPromotionSlide | null => {
                if (typeof item === 'string') {
                    return { src: item, orientation: 'HORIZONTAL' }
                }

                const src = item.image || item.src || ''
                if (!src) return null

                return {
                    id: item.id,
                    src,
                    orientation: item.orientation || 'HORIZONTAL',
                    title: item.title || item.name,
                    description: item.description,
                    price: item.price || item.specialPrice,
                    href: item.href,
                    external: item.external,
                }
            })
            .filter((item): item is NormalizedPromotionSlide => Boolean(item))
    }, [items, fetchedItems])

    const slides = useMemo(
        () => normalizedSlides.filter((slide) => slide.id == null || !removedIds.includes(String(slide.id))),
        [normalizedSlides, removedIds]
    )

    const length = slides.length
    const safeIndex = length > 0 ? Math.min(index, length - 1) : 0
    const isLoading = shouldFetch && fetchedItems === null

    const next = () => setIndex((current) => (current + 1) % Math.max(1, length))
    const prev = () => setIndex((current) => (current - 1 + Math.max(1, length)) % Math.max(1, length))

    useEffect(() => {
        if (!autoPlay || paused || length <= 1) return

        const timer = window.setInterval(() => {
            setIndex((current) => (current + 1) % length)
        }, interval)

        return () => window.clearInterval(timer)
    }, [autoPlay, paused, interval, length])

    const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
        touchStartX.current = event.touches[0]?.clientX ?? null
    }

    const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
        const start = touchStartX.current
        touchStartX.current = null
        if (start == null) return

        const end = event.changedTouches[0]?.clientX
        if (end == null) return

        const delta = end - start
        if (Math.abs(delta) < 40) return

        if (delta < 0) next()
        else prev()
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'ArrowLeft') {
            event.preventDefault()
            prev()
        } else if (event.key === 'ArrowRight') {
            event.preventDefault()
            next()
        }
    }

    const handleDelete = async () => {
        if (!confirmId) return

        setDeleting(true)
        try {
            const response = await fetch(`/api/promotions/${confirmId}`, { method: 'DELETE' })

            if (response.ok || response.status === 204) {
                setRemovedIds((current) => [...current, String(confirmId)])
                setMessage('Promoción eliminada')
            } else {
                const text = await response.text().catch(() => '')
                setMessage(`Error: ${response.status} ${text}`)
            }
        } catch {
            setMessage('Error al eliminar')
        } finally {
            setDeleting(false)
            setConfirmOpen(false)
            setConfirmId(null)
            window.setTimeout(() => setMessage(null), 3000)
        }
    }

    if (isLoading) {
        return (
            <div
                style={customColorsStyle}
                className={joinClasses('flex h-48 items-center justify-center', className)}
            >
                <ButtonSpinner className="h-8 w-8 text-[var(--primary)]" />
            </div>
        )
    }

    if (length === 0) {
        if (!emptyMessage) return null

        return (
            <div
                style={customColorsStyle}
                className={joinClasses(
                    'flex h-40 items-center justify-center rounded-2xl border border-dashed border-[#111827]/15 bg-[#111827]/5 px-4 text-center text-sm text-[#111827]/60 dark:border-white/15 dark:bg-white/5 dark:text-white/60',
                    className
                )}
            >
                {emptyMessage}
            </div>
        )
    }

    return (
        <div className={className} style={customColorsStyle}>
            <div
                style={customColorsStyle}
                className="relative overflow-hidden rounded-2xl bg-gray-100 dark:bg-slate-800"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                role="region"
                aria-roledescription="carrusel"
                aria-label={ariaLabel}
            >
                <div
                    className="flex transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${safeIndex * 100}%)` }}
                >
                    {slides.map((slide, slideIndex) => {
                        const key = String(slide.id ?? slide.src ?? slideIndex)
                        const isVertical = String(slide.orientation).toUpperCase() === 'VERTICAL'
                        const heightClassName = isVertical
                            ? 'h-80 sm:h-96 md:h-[28rem]'
                            : 'h-48 sm:h-56 md:h-64'

                        const slideImage = (
                            <>
                                <Image
                                    src={slide.src}
                                    alt={slide.title || `Promoción ${slideIndex + 1}`}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"
                                    className="object-contain"
                                    priority={slideIndex === 0}
                                />
                                {(slide.title || slide.description || slide.price) && (
                                    <div
                                        className={joinClasses(
                                            'absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent p-4 pt-14',
                                            !textColor && 'text-white',
                                        )}
                                    >
                                        {slide.title && (
                                            <p className="text-base font-bold sm:text-lg">{slide.title}</p>
                                        )}
                                        {slide.description && (
                                            <p
                                                className={joinClasses(
                                                    'mt-1 line-clamp-2 text-xs sm:text-sm',
                                                    textColor ? 'opacity-80' : 'text-white/80',
                                                )}
                                            >
                                                {slide.description}
                                            </p>
                                        )}
                                        {slide.price && (
                                            <p
                                                className={joinClasses(
                                                    'mt-1 text-sm font-bold',
                                                    !textColor && 'text-[var(--primary)]',
                                                )}
                                            >
                                                {slide.price}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </>
                        )

                        const handleSlideClick = () => onSlideClick?.(slide, slideIndex)

                        let slideContent: ReactNode = slideImage
                        if (slide.href) {
                            const external = slide.external ?? /^https?:\/\//i.test(slide.href)
                            slideContent = (
                                <a
                                    href={slide.href}
                                    target={external ? '_blank' : undefined}
                                    rel={external ? 'noreferrer' : undefined}
                                    onClick={handleSlideClick}
                                    className="block h-full w-full"
                                >
                                    {slideImage}
                                </a>
                            )
                        } else if (onSlideClick) {
                            slideContent = (
                                <button
                                    type="button"
                                    onClick={handleSlideClick}
                                    className="block h-full w-full text-left"
                                >
                                    {slideImage}
                                </button>
                            )
                        }

                        return (
                            <div
                                key={key}
                                className={joinClasses(
                                    'relative w-full flex-shrink-0 overflow-hidden',
                                    heightClassName
                                )}
                            >
                                {slideContent}

                                {canDelete && slide.id != null && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setConfirmId(slide.id as string | number)
                                            setConfirmOpen(true)
                                        }}
                                        className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/75"
                                        aria-label="Eliminar promoción"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </div>

                {showArrows && length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={prev}
                            aria-label="Promoción anterior"
                            className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        >
                            <FiChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={next}
                            aria-label="Siguiente promoción"
                            className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                        >
                            <FiChevronRight className="h-5 w-5" />
                        </button>
                    </>
                )}

                {message && (
                    <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-sm text-white">
                        {message}
                    </div>
                )}
            </div>

            {showDots && length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-2">
                    {slides.map((slide, slideIndex) => (
                        <button
                            key={String(slide.id ?? slide.src ?? slideIndex)}
                            type="button"
                            onClick={() => setIndex(slideIndex)}
                            aria-label={`Ir a la promoción ${slideIndex + 1}`}
                            aria-current={slideIndex === safeIndex ? 'true' : undefined}
                            className={joinClasses(
                                'h-2 rounded-full transition-all',
                                slideIndex === safeIndex
                                    ? 'w-6 bg-[var(--primary)]'
                                    : 'w-2 bg-[#111827]/20 hover:bg-[#111827]/40 dark:bg-white/25 dark:hover:bg-white/45'
                            )}
                        />
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Eliminar promoción"
                description={
                    isAdmin
                        ? '¿Deseas eliminar esta promoción? Esta acción es irreversible.'
                        : 'No tienes permisos para eliminar promociones.'
                }
                confirmText={isAdmin ? 'Eliminar' : 'Cerrar'}
                isLoading={deleting}
                onCancel={() => {
                    setConfirmOpen(false)
                    setConfirmId(null)
                }}
                onConfirm={handleDelete}
            />
        </div>
    )
}
