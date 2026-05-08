'use client'
import { useState } from 'react'
import ButtonSpinner from './ButtonSpinner'
import { Product } from '@/app/lib/products'

type ProductWithPieces = Product & { pieces?: number | null }

type EditPayload = {
    name: string
    description: string
    pieces?: number | null
}

type Props = {
    isOpen: boolean
    product?: ProductWithPieces | null
    isSaving?: boolean
    onCancel: () => void
    onSave: (payload: EditPayload) => Promise<void> | void
}

export default function EditProductModal({ isOpen, product, isSaving = false, onCancel, onSave }: Props) {
    const [name, setName] = useState(() => product?.name ?? '')
    const [description, setDescription] = useState(() => product?.description ?? '')
    const [pieces, setPieces] = useState<number | ''>(() => product?.pieces ?? '')

    if (!isOpen || !product) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-6 z-10">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Editar producto</h3>
                <div className="space-y-3">
                    <label className="block">
                        <span className="text-sm text-gray-600">Nombre</span>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm text-gray-600">Descripción</span>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                            rows={4}
                        />
                    </label>
                    <label className="block">
                        <span className="text-sm text-gray-600">Piezas</span>
                        <input
                            value={String(pieces)}
                            onChange={(e) => setPieces(e.target.value ? Number(e.target.value) : '')}
                            className="mt-1 w-full border rounded px-3 py-2 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-pink-500"
                        />
                    </label>
                </div>
                <div className="mt-4 flex justify-end gap-2">
                    <button onClick={onCancel} className="px-4 py-2 rounded border bg-white text-gray-700">Cancelar</button>
                    <button
                        onClick={async () => {
                            const payload: EditPayload = { name, description }
                            if (pieces !== '') payload.pieces = pieces
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
