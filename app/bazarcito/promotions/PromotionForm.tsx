'use client'
import { useState } from 'react'

export default function PromotionForm() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [specialPrice, setSpecialPrice] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)

    const MAX_SIZE = 5 * 1024 * 1024

    function onChooseFile(file?: File | null) {
        if (!file) {
            setImageFile(null)
            setPreview(null)
            setFileError(null)
            return
        }
        if (file.size > MAX_SIZE) {
            setFileError('Imagen demasiado grande (máx 5MB)')
            setImageFile(null)
            setPreview(null)
            return
        }
        setFileError(null)
        setImageFile(file)
        try {
            setPreview(URL.createObjectURL(file))
        } catch {
            setPreview(null)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!name.trim() || !description.trim()) {
            setMessage('Completa nombre y descripción')
            return
        }
        setSaving(true)
        setMessage(null)
        try {
            const form = new FormData()
            form.append('name', name.trim())
            form.append('description', description.trim())
            if (specialPrice.trim()) form.append('specialPrice', specialPrice.trim())
            if (imageFile) form.append('imageFile', imageFile)

            const res = await fetch('/api/promotions', { method: 'POST', body: form })
            if (!res.ok) throw new Error('Server error')
            const body = await res.json()
            setMessage('Promoción creada correctamente')
            setName('')
            setDescription('')
            setSpecialPrice('')
            setImageFile(null)
            setPreview(null)
        } catch (err) {
            console.error(err)
            setMessage('No se pudo crear la promoción')
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl">
            <label className="block mb-3">
                <span className="text-sm font-medium">Nombre</span>
                <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900" placeholder="Ej. Cyber Week" />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <label className="block">
                    <span className="text-sm font-medium">Precio especial</span>
                    <input value={specialPrice} onChange={(e) => setSpecialPrice(e.target.value)} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900" placeholder="Ej. 99" />
                </label>
                <label className="block">
                    <span className="text-sm font-medium">Imagen (opcional)</span>
                    <div className="mt-1 flex items-center gap-3">
                        <label className="inline-block bg-white border border-gray-300 rounded px-3 py-2 cursor-pointer">
                            Elegir archivo
                            <input type="file" accept="image/*" className="hidden" onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)} />
                        </label>
                        {preview && <img src={preview} alt="preview" className="w-28 h-20 object-cover rounded" />}
                    </div>
                    {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
                </label>
            </div>

            <label className="block mb-3">
                <span className="text-sm font-medium">Descripción</span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1 w-full rounded border border-gray-300 px-3 py-2 bg-white text-gray-900" />
            </label>

            <div className="flex items-center gap-3">
                <button type="submit" disabled={saving || Boolean(fileError)} className="rounded bg-pink-600 text-white px-4 py-2 disabled:opacity-60">{saving ? 'Guardando...' : 'Crear promoción'}</button>
                {message && <div className="text-sm text-gray-700">{message}</div>}
            </div>
        </form>
    )
}
