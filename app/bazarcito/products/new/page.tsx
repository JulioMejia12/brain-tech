"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewBazarcitoProductPage() {
    const router = useRouter()
    const [title, setTitle] = useState("")
    const [price, setPrice] = useState<number | "">("")
    const [stock, setStock] = useState<number | "">("")
    const [image, setImage] = useState("")
    const [category, setCategory] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            let res: Response
            if (imageFile) {
                const form = new FormData()
                form.append('title', title)
                form.append('price', String(price))
                form.append('stock', String(stock))
                form.append('category', category.trim())
                form.append('imageFile', imageFile)

                res = await fetch('/api/bazarcito/products', {
                    method: 'POST',
                    body: form,
                })
            } else {
                const payload = {
                    title,
                    price: Number(price),
                    stock: Number(stock),
                    image,
                    category: category.trim(),
                }

                res = await fetch('/api/bazarcito/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                })
            }

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body?.error || res.statusText || "Request failed")
            }

            router.push("/bazarcito/products")
        } catch (err: any) {
            setError(err?.message || String(err))
        } finally {
            setLoading(false)
        }
    }

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
                        <input
                            type="file"
                            accept="image/*"
                            capture="environment"
                            className="w-full"
                            onChange={(e) => {
                                const f = e.target.files && e.target.files[0]
                                if (!f) {
                                    setImageFile(null)
                                    setImage("")
                                    return
                                }
                                // validate size <= 5MB
                                const max = 5 * 1024 * 1024
                                if (f.size > max) {
                                    setError('Imagen demasiado grande. Máx 5 MB.')
                                    setImageFile(null)
                                    setImage("")
                                    return
                                }

                                setError(null)
                                setImageFile(f)
                                setImage(URL.createObjectURL(f))
                            }}
                        />

                        {imageFile && (
                            <div className="mt-3 flex items-center gap-3">
                                <img src={image} alt="preview" className="w-32 h-32 object-cover rounded-md" />
                                <div>
                                    <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{imageFile.name}</div>
                                    <div className="text-xs text-gray-500">{Math.round(imageFile.size / 1024)} KB</div>
                                    <button type="button" className="mt-2 text-sm text-red-500" onClick={() => { setImageFile(null); setImage("") }}>Quitar imagen</button>
                                </div>
                            </div>
                        )}
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
