'use client'
import React, { useState, useEffect } from 'react'
import ButtonSpinner from './ButtonSpinner'
import type { Product } from '@/app/lib/products'

type ProductWithPieces = Product & { pieces?: number | null }

type NegocioOption = {
    id: number
    nombre: string
}

const DEFAULT_NEGOCIO_ID = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || ''

type EditPayload = {
    name?: string
    description?: string
    pieces?: number | null
    price?: number | null
    promotionPrice?: string | null
    stock?: number | null
    negocioId?: number | null
    category?: string
    details?: { label: string; value: string }[]
}

type Props = {
    isOpen: boolean
    product?: ProductWithPieces | null
    isSaving?: boolean
    onCancel: () => void
    onSave: (payload: EditPayload) => Promise<void> | void
}

function parsePrice(raw?: string | number) {
    if (raw === undefined || raw === null || raw === '') return ''
    const cleaned = String(raw).replace(/[^0-9.\-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : ''
}

function parseEditablePromotionPrice(raw?: string | number) {
    if (raw === undefined || raw === null || raw === '') return ''
    return String(raw).replace(/[^0-9.\-]/g, '')
}

export default function EditProductModal({ isOpen, product, isSaving = false, onCancel, onSave }: Props) {
    const [name, setName] = useState(() => product?.name ?? '')
    const [description, setDescription] = useState(() => product?.description ?? '')
    const [pieces, setPieces] = useState<number | ''>(() => product?.pieces ?? '')
    const [price, setPrice] = useState<number | ''>(() => parsePrice(product?.price))
    const [promotionPrice, setPromotionPrice] = useState<string>(() => parseEditablePromotionPrice(product?.promotionPrice))
    const [category, setCategory] = useState<string>(() => product?.category ?? '')
    const [details, setDetails] = useState<{ label: string; value: string }[]>(() => product?.details ?? [{ label: '', value: '' }])

    const previewUrl = product?.image ?? ''
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [localPreview, setLocalPreview] = useState<string | null>(null)
    const [negocioNombre, setNegocioNombre] = useState<string>('')
    const resolvedNegocioId = product?.negocioId ?? (DEFAULT_NEGOCIO_ID ? Number(DEFAULT_NEGOCIO_ID) : null)

    const addDetail = () => setDetails((d) => [...d, { label: '', value: '' }])
    const updateDetail = (idx: number, key: 'label' | 'value', val: string) => setDetails((prev) => {
        const next = prev.slice()
        next[idx] = { ...next[idx], [key]: val }
        return next
    })
    const removeDetail = (idx: number) => setDetails((prev) => prev.filter((_, i) => i !== idx))

    // image upload handled in promotions form only

    useEffect(() => {
        let mounted = true

        async function loadNegocioNombre() {
            if (resolvedNegocioId == null) {
                setNegocioNombre('Sin negocio asignado')
                return
            }

            try {
                const res = await fetch('/api/negocios', { cache: 'no-store' })
                const body = await res.json().catch(() => ({})) as { data?: NegocioOption[] }
                if (!mounted) return

                const negocios = Array.isArray(body?.data) ? body.data : []
                const negocio = negocios.find((item) => item.id === Number(resolvedNegocioId))
                setNegocioNombre(negocio?.nombre || `ID ${resolvedNegocioId}`)
            } catch {
                if (mounted) {
                    setNegocioNombre(`ID ${resolvedNegocioId}`)
                }
            }
        }

        void loadNegocioNombre()

        return () => {
            mounted = false
        }
    }, [resolvedNegocioId])

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-auto p-6 z-10 max-h-[90vh] overflow-y-auto">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Editar producto</h3>

                <div className="space-y-3">
                    <label className="block">
                        <span className="text-sm text-gray-600">Nombre</span>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="block">
                            <span className="text-sm text-gray-600">Precio</span>
                            <input min={0} type="number" step="0.01" value={price === '' ? '' : String(price)} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                        </label>

                        <label className="block">
                            <span className="text-sm text-gray-600">Precio de promoción</span>
                            <input min={0} type="number" step="0.01" value={promotionPrice} onChange={(e) => setPromotionPrice(e.target.value)} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                        </label>

                        {/* stock removed from edit form */}
                    </div>

                    <label className="block">
                        <span className="text-sm text-gray-600">Imagen</span>
                        <div className="mt-1">
                            {(localPreview || previewUrl) && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={localPreview || previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-md border" />
                            )}
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Cambiar imagen</span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
                                try { if (localPreview) URL.revokeObjectURL(localPreview) } catch { }
                                setImageFile(f)
                                if (f) setLocalPreview(URL.createObjectURL(f))
                                else setLocalPreview(null)
                            }}
                            className="mt-1 text-sm text-gray-700"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Descripción</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Negocio detectado</span>
                        <input
                            value={negocioNombre || 'Cargando negocio...'}
                            readOnly
                            disabled
                            className="mt-1 w-full border border-gray-300 bg-gray-50 text-gray-700 rounded px-3 py-2"
                        />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Categoría</span>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ej. cocina" className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <div>
                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-medium text-gray-600">Detalles</span>
                            <span className="text-xs text-gray-400">{details.length} {details.length === 1 ? 'detalle' : 'detalles'}</span>
                        </div>

                        <div className="mt-3 space-y-3">
                            {details.map((d, idx) => (
                                <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 shadow-sm">
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-pink-100 px-2 text-xs font-semibold text-pink-700">
                                            #{idx + 1}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeDetail(idx)}
                                            aria-label={`Eliminar detalle ${idx + 1}`}
                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-600"
                                        >
                                            ✕
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Etiqueta</span>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                                                placeholder="Ej. Material"
                                                value={d.label}
                                                onChange={(e) => updateDetail(idx, 'label', e.target.value)}
                                            />
                                        </label>

                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Valor</span>
                                            <input
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                                                placeholder="Ej. Acero inoxidable"
                                                value={d.value}
                                                onChange={(e) => updateDetail(idx, 'value', e.target.value)}
                                            />
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <button
                                    type="button"
                                    onClick={addDetail}
                                    className="inline-flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700 transition hover:bg-green-100"
                                >
                                    <span className="text-base leading-none">＋</span>
                                    Agregar detalle
                                </button>
                            </div>
                        </div>
                    </div>

                    <label className="block">
                        <span className="text-sm text-gray-600">Piezas</span>
                        <input
                            name="pieces"
                            aria-label="Piezas"
                            inputMode="numeric"
                            value={pieces === '' ? '' : String(pieces)}
                            onChange={(e) => setPieces(e.target.value ? Number(e.target.value) : '')}
                            className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                        />
                    </label>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded border bg-white text-gray-700">Cancelar</button>
                    <button
                        onClick={async () => {
                            const payload: EditPayload = { name, description }
                            if (pieces !== '') {
                                payload.pieces = pieces
                                payload.stock = Number(pieces)
                            }
                            if (price !== '') payload.price = Number(price)
                            if (promotionPrice === '') {
                                payload.promotionPrice = null
                            } else {
                                payload.promotionPrice = promotionPrice
                            }
                            if (resolvedNegocioId != null && !Number.isNaN(Number(resolvedNegocioId))) {
                                payload.negocioId = Number(resolvedNegocioId)
                            }
                            if (category) payload.category = category
                            // image upload disabled here; promotions form handles promotion images
                            const filtered = details.filter(d => (d.label && d.label.trim() !== '') || (d.value && d.value.trim() !== ''))
                            if (filtered.length) payload.details = filtered
                            // attach imageFile if provided so parent can send multipart/form-data
                            if (imageFile) (payload as any).imageFile = imageFile
                            await onSave(payload)
                        }}
                        disabled={isSaving}
                        className="px-4 py-2 rounded bg-pink-600 text-white disabled:opacity-70 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
                    >
                        {isSaving ? (
                            <>
                                <ButtonSpinner className="h-4 w-4 text-white" />
                                <span>Guardando...</span>
                            </>
                        ) : (
                            'Guardar'
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
