"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'

type CatalogItem = {
    id: number
    name: string
    categoria?: string | null
    image: string
    imagePublicId?: string | null
    negocioId?: number | null
    createdAt?: string | Date
}

type Props = {
    negocioId: string
    storefrontName: string
    accentClassName: string
}

const MAX_SIZE = 10 * 1024 * 1024

function isPdf(value?: string | null) {
    const normalized = String(value || '').toLowerCase()
    return normalized.endsWith('.pdf') || normalized.includes('/pdf') || normalized.includes('raw/upload')
}

function formatDate(value?: string | Date) {
    if (!value) return ''
    const date = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(date.getTime())) return ''
    return new Intl.DateTimeFormat('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(date)
}

export default function CatalogManager({ negocioId, storefrontName, accentClassName }: Props) {
    const { user } = useAuth()
    const isAdmin = useMemo(() => String(user?.role?.name || '').toLowerCase() === 'admin', [user])

    const [items, setItems] = useState<CatalogItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [deletingId, setDeletingId] = useState<number | null>(null)
    const [message, setMessage] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [name, setName] = useState('')
    const [categoria, setCategoria] = useState('')
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const loadCatalogs = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/catalog?negocioId=${encodeURIComponent(negocioId)}`, { cache: 'no-store' })
            const json = await res.json().catch(() => ({})) as { data?: CatalogItem[]; error?: string }
            if (!res.ok) {
                throw new Error(json?.error || 'No se pudo cargar el catálogo')
            }
            setItems(Array.isArray(json?.data) ? json.data : [])
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo cargar el catálogo')
        } finally {
            setLoading(false)
        }
    }, [negocioId])

    useEffect(() => {
        void loadCatalogs()
    }, [loadCatalogs])

    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    function onChooseFile(nextFile?: File | null) {
        setError(null)
        setMessage(null)

        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl)
        }

        if (!nextFile) {
            setFile(null)
            setPreviewUrl(null)
            return
        }

        if (nextFile.size > MAX_SIZE) {
            setFile(null)
            setPreviewUrl(null)
            setError('El archivo excede el máximo permitido de 10MB')
            return
        }

        const allowed = nextFile.type.startsWith('image/') || nextFile.type === 'application/pdf'
        if (!allowed) {
            setFile(null)
            setPreviewUrl(null)
            setError('Solo se permiten imágenes o archivos PDF')
            return
        }

        setFile(nextFile)
        if (nextFile.type.startsWith('image/')) {
            setPreviewUrl(URL.createObjectURL(nextFile))
        } else {
            setPreviewUrl(null)
        }
        if (!name.trim()) {
            setName(nextFile.name.replace(/\.[^.]+$/, ''))
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!isAdmin) {
            setError('Solo un administrador puede subir catálogos')
            return
        }
        if (!name.trim()) {
            setError('Ingresa un nombre para el catálogo')
            return
        }
        if (!categoria.trim()) {
            setError('Ingresa una categoría para el catálogo')
            return
        }
        if (!file) {
            setError('Selecciona una imagen o PDF')
            return
        }

        setSaving(true)
        setError(null)
        setMessage(null)
        try {
            const form = new FormData()
            form.append('name', name.trim())
            form.append('categoria', categoria.trim())
            form.append('negocioId', negocioId)
            form.append('file', file)

            const res = await fetch('/api/catalog', { method: 'POST', body: form })
            const json = await res.json().catch(() => ({})) as { error?: string }
            if (!res.ok) {
                throw new Error(json?.error || 'No se pudo subir el catálogo')
            }

            setMessage('Catálogo subido correctamente')
            setName('')
            setCategoria('')
            setFile(null)
            setPreviewUrl(null)
            try {
                const input = document.querySelector('input[type=file][data-catalog-input="true"]') as HTMLInputElement | null
                if (input) input.value = ''
            } catch { }
            await loadCatalogs()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo subir el catálogo')
        } finally {
            setSaving(false)
        }
    }

    async function handleDelete(id: number) {
        if (!isAdmin) return
        setDeletingId(id)
        setError(null)
        setMessage(null)
        try {
            const res = await fetch(`/api/catalog/${id}?negocioId=${encodeURIComponent(negocioId)}`, { method: 'DELETE' })
            if (!res.ok) {
                const json = await res.json().catch(() => ({})) as { error?: string }
                throw new Error(json?.error || 'No se pudo eliminar el catálogo')
            }
            setMessage('Catálogo eliminado')
            await loadCatalogs()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'No se pudo eliminar el catálogo')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="space-y-8">
            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className={`mb-4 rounded-xl border px-4 py-3 text-sm ${accentClassName}`}>
                    Los archivos que subas aquí quedarán vinculados a <span className="font-semibold">{storefrontName}</span> con <span className="font-semibold">negocioId = {negocioId}</span>.
                </div>

                {isAdmin ? (
                    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-medium text-gray-900">Nombre del catálogo</span>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400"
                                placeholder="Ej. Catálogo junio 2026"
                                required
                            />
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-medium text-gray-900">Categoría</span>
                            <input
                                value={categoria}
                                onChange={(e) => setCategoria(e.target.value)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none focus:border-pink-400"
                                placeholder="Ej. Junio, Hogar, Cocina, Promociones"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-500">Usa una categoría para distinguir varios catálogos del mismo negocio.</p>
                        </label>

                        <label className="block md:col-span-2">
                            <span className="mb-2 block text-sm font-medium text-gray-900">Archivo</span>
                            <input
                                type="file"
                                accept="image/*,application/pdf"
                                data-catalog-input="true"
                                onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)}
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-900 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:text-pink-700"
                                required
                            />
                            <p className="mt-2 text-xs text-gray-500">Acepta imágenes o PDF. Tamaño máximo: 10MB.</p>
                        </label>

                        {file && (
                            <div className="md:col-span-2 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                                <div className="text-sm font-medium text-gray-900">Vista previa</div>
                                <div className="mt-3 flex items-center gap-4">
                                    {previewUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={previewUrl} alt="Vista previa del catálogo" className="h-28 w-28 rounded-lg object-cover border border-gray-200" />
                                    ) : (
                                        <div className="flex h-28 w-28 items-center justify-center rounded-lg border border-gray-200 bg-white text-center text-xs font-semibold text-gray-500">
                                            PDF listo para subir
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-500">{Math.round(file.size / 1024)} KB</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="md:col-span-2 flex items-center gap-3">
                            <button
                                type="submit"
                                disabled={saving}
                                className="rounded-xl bg-pink-600 px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
                            >
                                {saving ? 'Subiendo...' : 'Subir catálogo'}
                            </button>
                            {message && <p className="text-sm text-green-700">{message}</p>}
                            {error && <p className="text-sm text-red-600">{error}</p>}
                        </div>
                    </form>
                ) : (
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900">
                        Puedes descargar los catálogos disponibles. Solo los administradores pueden subir nuevos archivos.
                    </div>
                )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Catálogos disponibles</h2>
                        <p className="text-sm text-gray-500">Descarga imágenes o PDFs del negocio.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => void loadCatalogs()}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                        Recargar
                    </button>
                </div>

                {loading ? (
                    <div className="flex h-40 items-center justify-center text-sm text-gray-500">Cargando catálogos...</div>
                ) : items.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-300 px-4 py-10 text-center text-sm text-gray-500">
                        Aún no hay catálogos cargados para {storefrontName}.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => {
                            const pdf = isPdf(item.image) || isPdf(item.name)
                            return (
                                <article key={item.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                                    <div className="flex h-48 items-center justify-center bg-gray-100">
                                        {pdf ? (
                                            <div className="flex flex-col items-center gap-3 px-4 text-center">
                                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-2xl text-red-600">PDF</div>
                                                <p className="line-clamp-2 text-sm font-medium text-gray-700">Documento listo para descargar</p>
                                            </div>
                                        ) : (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                        )}
                                    </div>
                                    <div className="space-y-3 p-4">
                                        <div>
                                            {item.categoria && (
                                                <span className="mb-2 inline-flex rounded-full bg-pink-100 px-2.5 py-1 text-xs font-semibold text-pink-700">
                                                    {item.categoria}
                                                </span>
                                            )}
                                            <h3 className="text-base font-semibold text-gray-900">{item.name}</h3>
                                            <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <a
                                                href={`/api/catalog/${item.id}/download?negocioId=${encodeURIComponent(negocioId)}`}
                                                className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-black"
                                            >
                                                Descargar
                                            </a>
                                            <a
                                                href={pdf
                                                    ? `/api/catalog/${item.id}/download?negocioId=${encodeURIComponent(negocioId)}&disposition=inline`
                                                    : item.image}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            >
                                                Ver archivo
                                            </a>
                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    onClick={() => void handleDelete(item.id)}
                                                    disabled={deletingId === item.id}
                                                    className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 disabled:opacity-60"
                                                >
                                                    {deletingId === item.id ? 'Eliminando...' : 'Eliminar'}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}

                {!loading && error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            </section>
        </div>
    )
}
