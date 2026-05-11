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
    imageFile?: File | null
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
    const [stock, setStock] = useState<number | ''>(() => product?.pieces ?? '')
    const [category, setCategory] = useState<string>(() => product?.category ?? '')

    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(() => product?.image ?? '')
    const [fileError, setFileError] = useState<string | null>(null)

    const MAX_SIZE = 5 * 1024 * 1024

    useEffect(() => {
        // reset internal state when opening a different product
        setName(product?.name ?? '')
        setDescription(product?.description ?? '')
        setPieces(product?.pieces ?? '')
        setPrice(parsePrice(product?.price))
        setStock(product?.pieces ?? '')
        setCategory(product?.category ?? '')
        setImageFile(null)
        setPreviewUrl(product?.image ?? '')
        setFileError(null)
    }, [product, isOpen])

    const onChooseFile = (file?: File | null) => {
        if (!file) {
            setImageFile(null)
            setPreviewUrl(product?.image ?? '')
            setFileError(null)
            return
        }

        if (file.size > MAX_SIZE) {
            setImageFile(null)
            setPreviewUrl(product?.image ?? '')
            setFileError('Imagen demasiado grande. Máx 5 MB.')
            return
        }

        setFileError(null)
        setImageFile(file)
        try {
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        } catch {
            setPreviewUrl(product?.image ?? '')
        }
    }

    const removeImage = () => {
        setImageFile(null)
        setPreviewUrl(product?.image ?? '')
        setFileError(null)
    }

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 z-10">
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

                        <label className="block">
                            <span className="text-sm text-gray-600">Stock</span>
                            <input type="number" value={stock === '' ? '' : String(stock)} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                        </label>
                    </div>

                    <label className="block">
                        <span className="text-sm text-gray-600">Imagen</span>
                        <div className="mt-1 flex items-center gap-3">
                            <label className="inline-block bg-white text-gray-800 border rounded px-3 py-2 cursor-pointer text-sm">
                                Choose File
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)} />
                            </label>
                            {previewUrl && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={previewUrl} alt="preview" className="w-20 h-20 object-cover rounded-md border" />
                            )}
                            {imageFile && (
                                <button type="button" onClick={removeImage} className="text-sm text-red-600">Quitar imagen</button>
                            )}
                        </div>
                        {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Descripción</span>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

                    <label className="block">
                        <span className="text-sm text-gray-600">Categoría</span>
                        <input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ej. cocina" className="mt-1 w-full border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500" />
                    </label>

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
                            if (stock !== '') payload.stock = Number(stock)
                            if (category) payload.category = category
                            if (imageFile) payload.imageFile = imageFile
                            await onSave(payload)
                        }}
                        disabled={isSaving || Boolean(fileError)}
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
