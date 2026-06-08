"use client"

import React, { useState, useEffect } from 'react'
import { marronProductsSellProps } from '@/app/lib/productsSellConfig'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const PRODUCT_DESCRIPTION_MAX_LENGTH = 400
const MARRON_NEGOCIO_ID = process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || '2'

export default function NewMarronProductPage() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState<number | ''>('')
    const [stock, setStock] = useState<number | ''>('')
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [category, setCategory] = useState('')
    const [description, setDescription] = useState('')
    const [details, setDetails] = useState<{ label: string; value: string }[]>([{ label: '', value: '' }])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            if (!imageFile) {
                setError('Debes subir un archivo de imagen')
                setLoading(false)
                return
            }

            if (description.length > PRODUCT_DESCRIPTION_MAX_LENGTH) {
                setError(`La descripción es muy larga. Máximo ${PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres.`)
                setLoading(false)
                return
            }

            const filteredDetails = details.filter((d) => d.label.trim() !== '' || d.value.trim() !== '')
            const fd = new FormData()
            fd.append('title', title)
            fd.append('description', description)
            fd.append('price', String(price))
            fd.append('stock', String(stock))
            fd.append('negocioId', MARRON_NEGOCIO_ID)
            fd.append('category', category.trim())
            fd.append('details', JSON.stringify(filteredDetails))
            fd.append('imageFile', imageFile)

            const res = await fetch('/api/products', {
                method: 'POST',
                body: fd,
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.error || res.statusText || 'Request failed')
            }

            router.push('/marron')
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : String(err))
        } finally {
            setLoading(false)
        }
    }

    const addDetail = () => setDetails((d) => [...d, { label: '', value: '' }])
    const updateDetail = (idx: number, key: 'label' | 'value', val: string) => {
        setDetails((prev) => {
            const next = prev.slice()
            next[idx] = { ...next[idx], [key]: val }
            return next
        })
    }
    const removeDetail = (idx: number) => setDetails((prev) => prev.filter((_, i) => i !== idx))

    const bg = marronProductsSellProps.bgColor || '#fff'
    const headingColor = marronProductsSellProps.secondary || '#111'
    const primary = marronProductsSellProps.primary || '#895129'

    useEffect(() => {
        try {
            const root = document.documentElement
            const prev = {
                background: getComputedStyle(root).getPropertyValue('--background') || '',
                primary: getComputedStyle(root).getPropertyValue('--primary') || '',
                secondary: getComputedStyle(root).getPropertyValue('--secondary') || '',
                foreground: getComputedStyle(root).getPropertyValue('--foreground') || '',
            }

            if (bg) root.style.setProperty('--background', bg)
            if (primary) root.style.setProperty('--primary', primary)
            if (headingColor) root.style.setProperty('--secondary', headingColor)
            // force readable foreground using the heading/secondary color
            if (headingColor) root.style.setProperty('--foreground', headingColor)

            return () => {
                try {
                    if (prev.background) root.style.setProperty('--background', prev.background)
                    if (prev.primary) root.style.setProperty('--primary', prev.primary)
                    if (prev.secondary) root.style.setProperty('--secondary', prev.secondary)
                    if (prev.foreground) root.style.setProperty('--foreground', prev.foreground)
                } catch (e) {
                    // ignore
                }
            }
        } catch (e) {
            // ignore in non-browser
        }
    }, [bg, primary, headingColor])

    return (
        <main style={{ background: bg }} className="marron-theme max-w-4xl mx-auto p-6">
            <div className="border rounded-2xl shadow-lg p-8" style={{ background: 'var(--card-background, rgba(255,255,255,0.98))', borderColor: 'var(--card-border, rgba(0,0,0,0.06))' }}>
                <h1 className="text-2xl font-semibold mb-6" style={{ color: headingColor }}>Nuevo producto — Marron</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2 rounded-xl px-4 py-3 text-sm" style={{ borderColor: '#e9dfd6', background: bg, color: headingColor }}>
                        Este formulario crea productos vinculados automáticamente a <span className="font-semibold">Marron</span> con <span className="font-semibold">negocioId = {MARRON_NEGOCIO_ID}</span>.
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                        <input className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-amber-400" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio</label>
                        <input type="number" step="0.01" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100" value={price} onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))} required />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                        <input type="number" className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100" value={stock} onChange={(e) => setStock(e.target.value === '' ? '' : Number(e.target.value))} required />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
                                    try { if (previewUrl) URL.revokeObjectURL(previewUrl) } catch { }
                                    setImageFile(f)
                                    setPreviewUrl(f ? URL.createObjectURL(f) : null)
                                }}
                                className="text-sm text-gray-700"
                            />
                            {imageFile && <div className="text-xs text-gray-500">Archivo seleccionado: {imageFile.name}</div>}
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
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                        <textarea className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Breve descripción del producto" rows={4} maxLength={PRODUCT_DESCRIPTION_MAX_LENGTH} required />
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description.length}/{PRODUCT_DESCRIPTION_MAX_LENGTH} caracteres</p>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                        <input className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="ej. cocina" required />
                    </div>

                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between gap-3 mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Detalles</label>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{details.length} {details.length === 1 ? 'detalle' : 'detalles'}</span>
                        </div>

                        <div className="space-y-3">
                            {details.map((d, idx) => (
                                <div key={idx} className="rounded-xl border p-3 shadow-sm" style={{ background: 'var(--card-background, transparent)', borderColor: 'var(--card-border, rgba(0,0,0,0.06))' }}>
                                    <div className="mb-3 flex items-center justify-between">
                                        <div className="inline-flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold" style={{ background: primary + '22', color: primary }}>#{idx + 1}</div>
                                        <button type="button" onClick={() => removeDetail(idx)} aria-label={`Eliminar detalle ${idx + 1}`} className="inline-flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10">✕</button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Etiqueta</span>
                                            <input className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none" placeholder="Ej. Material" value={d.label} onChange={(e) => updateDetail(idx, 'label', e.target.value)} />
                                        </label>

                                        <label className="block">
                                            <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">Valor</span>
                                            <input className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-sm text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none" placeholder="Ej. Acero inoxidable" value={d.value} onChange={(e) => updateDetail(idx, 'value', e.target.value)} />
                                        </label>
                                    </div>
                                </div>
                            ))}

                            <div>
                                <button type="button" onClick={addDetail} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition" style={{ borderColor: primary, background: primary + '15', color: primary }}>
                                    <span className="text-base leading-none">＋</span>
                                    Agregar detalle
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between mt-2">
                        <div>
                            <button type="submit" disabled={loading} className="inline-flex items-center gap-2 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg shadow" style={{ background: primary }}>
                                {loading ? 'Creando...' : 'Crear producto'}
                            </button>
                        </div>

                        {error && <p className="text-sm text-red-500">{error}</p>}
                    </div>
                </form>
            </div>
        </main>
    )
}
