'use client'
import React, { useState, useEffect } from 'react'
import ButtonSpinner from './ButtonSpinner'
import type { Product } from '@/app/lib/products'

type ProductWithPieces = Product & { pieces?: number | null }

type EditPayload = {
    name?: string
    description?: string
    pieces?: number | null
    price?: number | null
    stock?: number | null
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

function parsePrice(raw?: string) {
    if (!raw) return ''
    const cleaned = String(raw).replace(/[^0-9.\-]/g, '')
    const n = Number(cleaned)
    return Number.isFinite(n) ? n : ''
}

export default function EditProductModal({ isOpen, product, isSaving = false, onCancel, onSave }: Props) {
    const [name, setName] = useState(() => product?.name ?? '')
    const [description, setDescription] = useState(() => product?.description ?? '')
    const [pieces, setPieces] = useState<number | ''>(() => product?.pieces ?? '')
    const [price, setPrice] = useState<number | ''>(() => parsePrice(product?.price))
    const [category, setCategory] = useState<string>(() => product?.category ?? '')
    const [details, setDetails] = useState<{ label: string; value: string }[]>(() => product?.details ?? [{ label: '', value: '' }])

    const [previewUrl, setPreviewUrl] = useState<string>(() => product?.image ?? '')

    useEffect(() => {
        // reset internal state when opening a different product
        setName(product?.name ?? '')
        setDescription(product?.description ?? '')
        setPieces(product?.pieces ?? '')
        setPrice(parsePrice(product?.price))
        setCategory(product?.category ?? '')
        setDetails(product?.details ?? [{ label: '', value: '' }])
        setPreviewUrl(product?.image ?? '')
    }, [product, isOpen])

    const addDetail = () => setDetails((d) => [...d, { label: '', value: '' }])
    const updateDetail = (idx: number, key: 'label' | 'value', val: string) => setDetails((prev) => {
        const next = prev.slice()
        next[idx] = { ...next[idx], [key]: val }
        return next
    })
    const removeDetail = (idx: number) => setDetails((prev) => prev.filter((_, i) => i !== idx))

    // image upload handled in promotions form only

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
                            <input type="number" step="0.01" value={price === '' ? '' : String(price)} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                        </label>

                        {/* stock removed from edit form */}
                    </div>

                    <label className="block">
                        <span className="text-sm text-gray-600">Imagen</span>
                        <div className="mt-1">
                            {previewUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-md border" />
                            )}
                        </div>
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Descripción</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Categoría</span>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ej. cocina" className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <div>
                        <span className="text-sm text-gray-600">Detalles</span>
                        <div className="mt-2 space-y-2">
                            {details.map((d, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <input
                                        className="col-span-11 sm:col-span-5 mt-1 w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                                        placeholder="Etiqueta"
                                        value={d.label}
                                        onChange={(e) => updateDetail(idx, 'label', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeDetail(idx)}
                                        aria-label={`Eliminar detalle ${idx + 1}`}
                                        className="col-span-1 sm:col-span-1 text-red-500 flex items-center justify-center"
                                    >
                                        ✕
                                    </button>
                                    <input
                                        className="col-span-12 sm:col-span-6 mt-1 w-full border border-gray-300 rounded px-2 py-2 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                                        placeholder="Valor"
                                        value={d.value}
                                        onChange={(e) => updateDetail(idx, 'value', e.target.value)}
                                    />
                                </div>
                            ))}
                            <div>
                                <button type="button" onClick={addDetail} className="text-sm text-green-600">Agregar detalle</button>
                            </div>
                        </div>
                    </div>

                    <label className="block">
                        <span className="text-sm text-gray-600">Piezas</span>
                        <input value={String(pieces)} onChange={(e) => setPieces(e.target.value ? Number(e.target.value) : '')} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>
                </div>

                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded border bg-white text-gray-700">Cancelar</button>
                    <button
                        onClick={async () => {
                            const payload: EditPayload = { name, description }
                            if (pieces !== '') payload.pieces = pieces
                            if (price !== '') payload.price = Number(price)
                            if (category) payload.category = category
                            // image upload disabled here; promotions form handles promotion images
                            const filtered = details.filter(d => (d.label && d.label.trim() !== '') || (d.value && d.value.trim() !== ''))
                            if (filtered.length) payload.details = filtered
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
