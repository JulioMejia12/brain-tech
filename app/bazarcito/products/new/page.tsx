"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewBazarcitoProductPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState<number | "">("")
    const [stock, setStock] = useState<number | "">("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [details, setDetails] = useState<{ label: string; value: string }[]>([{ label: "", value: "" }])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            let res: Response
            const filteredDetails = details.filter(d => d.label.trim() !== "" || d.value.trim() !== "")

            if (!imageFile) {
                setError('Debes subir un archivo de imagen')
                setLoading(false)
                return
            }

            const fd = new FormData()
            fd.append('title', title)
            fd.append('description', description)
            fd.append('price', String(price))
            fd.append('stock', String(stock))
            fd.append('category', category.trim())
            fd.append('details', JSON.stringify(filteredDetails))
            fd.append('imageFile', imageFile)

            res = await fetch('/api/bazarcito/products', {
                method: 'POST',
                body: fd,
            })

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.error || res.statusText || "Request failed")
            }

            router.push("/bazarcito")
        } catch (err: any) {
            setError(err?.message || String(err))
        } finally {
            setLoading(false)
        }
    }

    const addDetail = () => setDetails((d) => [...d, { label: "", value: "" }])
    const updateDetail = (idx: number, key: "label" | "value", val: string) => {
        setDetails((prev) => {
            const next = prev.slice()
            next[idx] = { ...next[idx], [key]: val }
            return next
        })
    }
    const removeDetail = (idx: number) => setDetails((prev) => prev.filter((_, i) => i !== idx))

    return (
        <main className="max-w-4xl mx-auto p-6">
            <div className="bg-white/80 dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg p-8">
                <h1 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Nuevo producto — Bazarcito</h1>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Título</label>
                        <input
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-400"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Precio</label>
                        <input
                            type="number"
                            step="0.01"
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                            value={price}
                            onChange={(e) => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Stock</label>
                        <input
                            type="number"
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                            value={stock}
                            onChange={(e) => setStock(e.target.value === "" ? "" : Number(e.target.value))}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Imagen</label>
                        <div className="flex flex-col gap-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null
                                    // revoke previous preview
                                    try { if (previewUrl) URL.revokeObjectURL(previewUrl) } catch (_) { }
                                    setImageFile(f)
                                    if (f) {
                                        const url = URL.createObjectURL(f)
                                        setPreviewUrl(url)
                                    } else {
                                        setPreviewUrl(null)
                                    }
                                }}
                                className="text-sm text-gray-700"
                            />

                            {imageFile && <div className="text-xs text-gray-500">Archivo seleccionado: {imageFile.name}</div>}
                            {previewUrl && (
                                <div className="pt-2">
                                    <img src={previewUrl} alt="Vista previa" className="w-32 h-32 object-cover rounded-md border" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Descripción</label>
                        <textarea
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Breve descripción del producto"
                            rows={4}
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categoría</label>
                        <input
                            className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            placeholder="ej. cocina"
                            required
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Detalles</label>
                        <div className="space-y-2">
                            {details.map((d, idx) => (
                                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                                    <input
                                        className="col-span-5 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                                        placeholder="Etiqueta"
                                        value={d.label}
                                        onChange={(e) => updateDetail(idx, "label", e.target.value)}
                                    />
                                    <input
                                        className="col-span-6 p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-sm text-gray-900 dark:text-gray-100"
                                        placeholder="Valor"
                                        value={d.value}
                                        onChange={(e) => updateDetail(idx, "value", e.target.value)}
                                    />
                                    <button type="button" onClick={() => removeDetail(idx)} className="col-span-1 text-red-500 hover:text-red-600">✕</button>
                                </div>
                            ))}

                            <div>
                                <button type="button" onClick={addDetail} className="inline-flex items-center gap-2 text-sm text-green-600 hover:text-green-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Agregar detalle
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="sm:col-span-2 flex items-center justify-between mt-2">
                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg shadow"
                            >
                                {loading ? "Creando..." : "Crear producto"}
                            </button>
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}
                    </div>
                </form>
            </div>
        </main>
    )
}
