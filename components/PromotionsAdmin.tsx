"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'

type Promotion = {
    id: number | string
    name?: string
    description?: string
    specialPrice?: string
    image?: string
}

export default function PromotionsAdmin({ className = '' }: { className?: string }) {
    const auth = useAuth()
    const isAdmin = Boolean(auth.user?.role?.name && String(auth.user.role.name).toLowerCase() === 'admin')

    const [items, setItems] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(false)
    const [editing, setEditing] = useState<Promotion | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isAdmin) return
        load()
    }, [isAdmin])

    async function load() {
        setLoading(true)
        try {
            const res = await fetch('/api/promotions')
            const body = await res.json().catch(() => ({}))
            const list = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : []
            setItems(list)
        } catch (e) {
            console.error('Failed to load promotions', e)
        } finally {
            setLoading(false)
        }
    }

    function openEdit(item: Promotion) {
        setEditing(item)
        setImageFile(null)
    }

    function onFile(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0] ?? null
        setImageFile(f)
    }

    async function save() {
        if (!editing) return
        setSaving(true)
        try {
            const form = new FormData()
            form.append('name', editing.name || '')
            form.append('description', editing.description || '')
            form.append('specialPrice', editing.specialPrice || '')
            if (imageFile) form.append('imageFile', imageFile)

            const res = await fetch(`/api/promotions/${editing.id}`, { method: 'PUT', body: form })
            if (res.ok) {
                const body = await res.json().catch(() => ({}))
                const updated = body.data || null
                if (updated) {
                    setItems((prev) => prev.map((it) => (String(it.id) === String(updated.id) ? updated : it)))
                }
                setEditing(null)
            } else {
                console.error('Save failed', await res.text())
            }
        } catch (e) {
            console.error('Save error', e)
        } finally {
            setSaving(false)
        }
    }

    async function remove(id: number | string) {
        if (!confirm('¿Eliminar promoción?')) return
        try {
            const res = await fetch(`/api/promotions/${id}`, { method: 'DELETE' })
            if (res.ok || res.status === 204) {
                setItems((prev) => prev.filter((p) => String(p.id) !== String(id)))
            } else {
                console.error('Delete failed', await res.text())
            }
        } catch (e) {
            console.error('Delete error', e)
        }
    }

    if (!isAdmin) return null

    return (
        <div className={className}>
            <h3 className="text-lg font-medium mb-3">Administrar Promociones</h3>
            {loading ? (
                <div>Cargando promociones...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {items.map((it) => (
                        <div key={String(it.id)} className="flex items-center gap-3 p-2 bg-white rounded shadow">
                            <div className="w-28 h-16 relative rounded overflow-hidden bg-gray-100">
                                {it.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={it.image} alt={it.name || ''} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-400">Sin imagen</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="font-semibold">{it.name}</div>
                                <div className="text-xs text-gray-600">{it.specialPrice ? `Precio: ${it.specialPrice}` : ''}</div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => openEdit(it)} className="p-2 rounded bg-yellow-200 hover:bg-yellow-300">
                                    <FiEdit2 />
                                </button>
                                <button onClick={() => remove(it.id)} className="p-2 rounded bg-red-100 hover:bg-red-200">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {editing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-xl w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">Editar promoción</h4>
                            <button onClick={() => setEditing(null)} className="p-2"><FiX /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="block">
                                <span className="text-sm">Nombre</span>
                                <input type="text" value={editing.name || ''} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="w-full border rounded px-2 py-1" />
                            </label>
                            <label className="block">
                                <span className="text-sm">Descripción</span>
                                <textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className="w-full border rounded px-2 py-1" />
                            </label>
                            <label className="block">
                                <span className="text-sm">Precio especial</span>
                                <input type="text" value={editing.specialPrice || ''} onChange={(e) => setEditing({ ...editing, specialPrice: e.target.value })} className="w-full border rounded px-2 py-1" />
                            </label>
                            <label className="block">
                                <span className="text-sm">Imagen</span>
                                <input type="file" accept="image/*" onChange={onFile} />
                            </label>
                            <div className="flex gap-2 justify-end">
                                <button onClick={() => setEditing(null)} className="px-3 py-2 rounded border">Cancelar</button>
                                <button onClick={save} disabled={saving} className="px-3 py-2 rounded bg-pink-600 text-white inline-flex items-center gap-2">
                                    {saving ? 'Guardando...' : (<><FiSave /> Guardar</>)}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
