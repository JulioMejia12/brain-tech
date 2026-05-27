"use client"
import React, { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { FiEdit2, FiTrash2, FiSave, FiX } from 'react-icons/fi'
import ConfirmModal from '@/app/components/ui/ConfirmModal'
import ToastMessage, { type ToastType } from '@/app/components/ui/ToastMessage'
import ButtonSpinner from '@/app/components/ui/ButtonSpinner'

type Promotion = {
    id: number | string
    name?: string
    description?: string
    specialPrice?: string
    image?: string
    orientation?: string
    negocioId?: number | string | null
}

type NegocioOption = {
    id: number
    nombre: string
    slug: string
}

export default function PromotionsAdmin({ className = '' }: { className?: string }) {
    const auth = useAuth()
    const isAdmin = Boolean(auth.user?.role?.name && String(auth.user.role.name).toLowerCase() === 'admin')

    const [items, setItems] = useState<Promotion[]>([])
    const [negocios, setNegocios] = useState<NegocioOption[]>([])
    const [loading, setLoading] = useState(false)
    const [loadingNegocios, setLoadingNegocios] = useState(false)
    const [editing, setEditing] = useState<Promotion | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        if (!isAdmin) return
        load()
        loadNegocios()
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

    async function loadNegocios() {
        setLoadingNegocios(true)
        try {
            const res = await fetch('/api/negocios')
            const body = await res.json().catch(() => ({}))
            const list = Array.isArray(body?.data) ? body.data : []
            setNegocios(list)
        } catch (e) {
            console.error('Failed to load negocios', e)
        } finally {
            setLoadingNegocios(false)
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
            form.append('orientation', String(editing.orientation || 'HORIZONTAL'))
            if (editing.negocioId != null && String(editing.negocioId) !== '') {
                form.append('negocioId', String(editing.negocioId))
            }
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
        // kept for compatibility but not used; deletion handled via ConfirmModal
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

    const [confirmOpen, setConfirmOpen] = useState(false)
    const [confirmId, setConfirmId] = useState<string | number | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

    function openConfirm(id: number | string) {
        setConfirmId(id)
        setConfirmOpen(true)
    }

    async function performDelete() {
        if (!confirmId) return
        setDeleting(true)
        try {
            const res = await fetch(`/api/promotions/${confirmId}`, { method: 'DELETE' })
            if (res.ok || res.status === 204) {
                setItems((prev) => prev.filter((p) => String(p.id) !== String(confirmId)))
                setToast({ message: 'Promoción eliminada', type: 'success' })
            } else {
                const txt = await res.text().catch(() => '')
                setToast({ message: `Error al eliminar: ${res.status} ${txt}`, type: 'error' })
                console.error('Delete failed', txt)
            }
        } catch (e) {
            console.error('Delete error', e)
            setToast({ message: 'Error al eliminar', type: 'error' })
        } finally {
            setDeleting(false)
            setConfirmOpen(false)
            setConfirmId(null)
        }
    }

    if (!isAdmin) return null

    return (
        <div className={className}>
            <h3 className="text-lg font-medium mb-3">Administrar Promociones</h3>
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <ButtonSpinner className="h-8 w-8 text-pink-600" />
                </div>
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
                                <button onClick={() => openConfirm(it.id)} className="p-2 rounded bg-red-100 hover:bg-red-200">
                                    <FiTrash2 />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={confirmOpen}
                title="Eliminar promoción"
                description="¿Eliminar esta promoción? Esta acción no se puede deshacer."
                confirmText="Eliminar"
                isLoading={deleting}
                onConfirm={performDelete}
                onCancel={() => { setConfirmOpen(false); setConfirmId(null) }}
            />

            {editing && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg max-w-xl w-full">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold">Editar promoción</h4>
                            <button onClick={() => setEditing(null)} className="p-2"><FiX /></button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                            <label className="block">
                                <span className="text-sm">Negocio</span>
                                <select
                                    value={editing.negocioId == null ? '' : String(editing.negocioId)}
                                    onChange={(e) => setEditing({ ...editing, negocioId: e.target.value ? Number(e.target.value) : null })}
                                    disabled={loadingNegocios}
                                    className="w-full border rounded px-2 py-1"
                                >
                                    <option value="">Selecciona un negocio</option>
                                    {negocios.map((negocio) => (
                                        <option key={negocio.id} value={negocio.id}>
                                            {negocio.nombre}
                                        </option>
                                    ))}
                                </select>
                            </label>
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
                            <label className="block">
                                <span className="text-sm">Orientación</span>
                                <div className="mt-2 flex items-center gap-4">
                                    <label className="inline-flex items-center gap-2">
                                        <input type="radio" name="orientation_edit" value="HORIZONTAL" checked={(editing.orientation || 'HORIZONTAL') === 'HORIZONTAL'} onChange={() => setEditing({ ...editing, orientation: 'HORIZONTAL' })} />
                                        <span className="text-sm">Horizontal</span>
                                    </label>
                                    <label className="inline-flex items-center gap-2">
                                        <input type="radio" name="orientation_edit" value="VERTICAL" checked={(editing.orientation || 'HORIZONTAL') === 'VERTICAL'} onChange={() => setEditing({ ...editing, orientation: 'VERTICAL' })} />
                                        <span className="text-sm">Vertical</span>
                                    </label>
                                </div>
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
            {toast && (
                <ToastMessage message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    )
}
