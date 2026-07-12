"use client"
import React, { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { FiPlus, FiX } from 'react-icons/fi'
import { cremeriaProductsSellProps } from '@/app/lib/productsSellConfig'
import type { Product } from '@/app/lib/products'

const PRODUCT_DESCRIPTION_MAX_LENGTH = 400

export default function EditCremeriaProductPage() {
    const router = useRouter()
    const params = useParams() as { id?: string }
    const id = params?.id
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [product, setProduct] = useState<Product | null>(null)
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState<number | ''>('')
    const [promotionPrice, setPromotionPrice] = useState<string>('')
    const [stock, setStock] = useState<number | ''>('')
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [details, setDetails] = useState<{ label: string; value: string }[]>([{ label: '', value: '' }])
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    useEffect(() => {
        let mounted = true
        async function load() {
            if (!id) return
            try {
                const res = await fetch(`/api/cremeria/products/${encodeURIComponent(id)}`)
                if (!res.ok) throw new Error('No se encontró el producto')
                const body = await res.json().catch(() => ({}))
                const p = body?.data || null
                if (!mounted) return
                setProduct(p)
                if (p) {
                    setTitle(p.name || '')
                    setPrice(p.price ? Number(String(p.price).replace(/[^0-9.-]/g, '')) : '')
                    setPromotionPrice(p.promotionPrice ? String(p.promotionPrice) : '')
                    setStock(p.pieces ?? p.stock ?? '')
                    setCategory(p.category || '')
                    setDescription(p.description || '')
                    setDetails(p.details?.length ? p.details : [{ label: '', value: '' }])
                    setPreviewUrl(p.image || null)
                }
            } catch (e) {
                setError(String(e))
            } finally {
                if (mounted) setLoading(false)
            }
        }
        void load()
        return () => { mounted = false }
    }, [id])

    const addDetail = () => setDetails((d) => [...d, { label: '', value: '' }])
    const updateDetail = (idx: number, key: 'label' | 'value', val: string) => setDetails((prev) => {
        const next = prev.slice(); next[idx] = { ...next[idx], [key]: val }; return next
    })
    const removeDetail = (idx: number) => setDetails((prev) => prev.filter((_, i) => i !== idx))

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        setError(null)
        try {
            if (!id) throw new Error('Missing id')

            const filteredDetails = details.filter(d => d.label.trim() !== '' || d.value.trim() !== '')
            if (description.length > PRODUCT_DESCRIPTION_MAX_LENGTH) throw new Error('Descripción demasiado larga')

            const fd = new FormData()
            fd.append('title', title)
            fd.append('description', description)
            if (price !== '') fd.append('price', String(price))
            fd.append('stock', String(stock))
            if (promotionPrice !== '') fd.append('promotionPrice', promotionPrice)
            fd.append('category', category)
            fd.append('details', JSON.stringify(filteredDetails))
            if (imageFile) fd.append('imageFile', imageFile)

            const res = await fetch(`/api/cremeria/products/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: fd,
            })

            if (!res.ok) {
                const b = await res.json().catch(() => ({}))
                throw new Error(b?.error || res.statusText || 'Request failed')
            }

            router.push('/cremeria')
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : String(e))
        } finally {
            setSaving(false)
        }
    }

    const bg = cremeriaProductsSellProps.bgColor || '#e6fbfb'
    const primary = cremeriaProductsSellProps.primary || '#0ea5a4'
    const secondary = cremeriaProductsSellProps.secondary || '#1f4756'

    if (loading) return <div className="p-6">Cargando...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
        <div style={{ background: bg }} className="min-h-screen">
            <main className="max-w-4xl mx-auto p-6">
                <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-semibold mb-6" style={{ color: secondary }}>Editar producto — Cremería</h1>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Título</label>
                            <input className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio</label>
                            <input type="number" step="0.01" className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={price as any} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Precio de promoción</label>
                            <input type="number" step="0.01" className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={promotionPrice} onChange={(e) => setPromotionPrice(e.target.value)} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                            <input type="number" className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={stock as any} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} />
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen</label>
                            <div className="flex flex-col gap-2">
                                <input type="file" accept="image/*" onChange={(e) => {
                                    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
                                    try { if (previewUrl) URL.revokeObjectURL(previewUrl) } catch { }
                                    setImageFile(f)
                                    if (f) setPreviewUrl(URL.createObjectURL(f))
                                }} className="text-sm text-gray-700" />

                                {previewUrl && (
                                    <div className="pt-2">
                                        <div className="relative w-32 h-32 overflow-hidden rounded-md border">
                                            <Image src={previewUrl} alt="Vista previa" fill unoptimized className="object-cover" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                            <textarea className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH} />
                            <p className="mt-1 text-xs text-gray-500">{description.length}/{PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres</p>
                        </div>

                        <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                            <input className="w-full p-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-900" value={category} onChange={(e) => setCategory(e.target.value)} />
                        </div>

                        <div className="sm:col-span-2">
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <label className="block text-sm font-medium text-gray-700">Detalles</label>
                                <span className="text-xs text-gray-500">{details.length} {details.length === 1 ? 'detalle' : 'detalles'}</span>
                            </div>

                            <div className="space-y-3">
                                {details.map((d, idx) => (
                                    <div key={idx} className="rounded-xl border border-gray-200 bg-gray-50/80 p-3 shadow-sm">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold" style={{ background: primary + '22', color: secondary }}>#{idx + 1}</div>
                                            <button type="button" onClick={() => removeDetail(idx)} aria-label={`Eliminar detalle ${idx + 1}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-600"><FiX className="h-5 w-5" /></button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                            <label className="block">
                                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Etiqueta</span>
                                                <input className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" placeholder="Ej. Origen" value={d.label} onChange={(e) => updateDetail(idx, 'label', e.target.value)} />
                                            </label>

                                            <label className="block">
                                                <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500">Valor</span>
                                                <input className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900" placeholder="Ej. Granja local" value={d.value} onChange={(e) => updateDetail(idx, 'value', e.target.value)} />
                                            </label>
                                        </div>
                                    </div>
                                ))}

                                <div>
                                    <button type="button" onClick={addDetail} className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition" style={{ borderColor: primary, background: primary + '15', color: secondary }}>
                                        <FiPlus className="h-4 w-4" /> Agregar detalle
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between mt-2">
                            <div>
                                <button type="submit" disabled={saving} className="inline-flex items-center gap-2 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg shadow" style={{ background: primary }}>
                                    {saving ? 'Guardando...' : 'Guardar cambios'}
                                </button>
                            </div>

                            {error && <p className="text-sm text-red-500">{error}</p>}
                        </div>
                    </form>
                </div>
            </main>
        </div>
    )
}
