"use client"
import { useState } from 'react'
import Image from 'next/image'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function PromotionForm() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileError, setFileError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<number | null>(null)
    const { user } = useAuth()
    const router = useRouter()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

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
        if (!imageFile) {
            setMessage('Selecciona una imagen')
            return
        }
        setSaving(true)
        setMessage(null)
        try {
            const form = new FormData()
            // only send the image file; server will accept missing textual fields
            if (imageFile) form.append('imageFile', imageFile)

            const res = await fetch('/api/promotions', { method: 'POST', body: form })
            const json = await res.json().catch(() => ({})) as unknown
            if (!res.ok) {
                const parsed = (json && typeof json === 'object') ? (json as Record<string, unknown>) : {}
                const err = parsed && 'error' in parsed ? String(parsed['error']) : 'Server error'
                setMessage(err)
                return
            }
            const parsed = (json && typeof json === 'object') ? (json as Record<string, unknown>) : {}
            const data = parsed.data as Record<string, unknown> | undefined
            setMessage('Promoción creada correctamente')
            // set created id so user can delete it
            if (data && (data.id !== undefined)) {
                setCreatedId(Number((data as Record<string, unknown>)['id']))
                if ((data as Record<string, unknown>)['image']) setPreview(String((data as Record<string, unknown>)['image']))
                // redirect to bazarcito main page after successful creation
                try {
                    router.push('/bazarcito')
                } catch (e) {
                    console.warn('Redirect failed', e)
                }
            }
            // reset selected file
            setImageFile(null)
            // clear file input if present
            try {
                const fileInput = document.querySelector('input[type=file]') as HTMLInputElement | null
                if (fileInput) fileInput.value = ''
            } catch { }
        } catch (err) {
            console.error(err)
            setMessage('No se pudo crear la promoción')
        } finally {
            setSaving(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    async function confirmDelete() {
        if (createdId == null) return
        setIsDeleting(true)
        try {
            if (!user || user.role?.name !== 'admin') {
                setMessage('No autorizado')
                return
            }
            const res = await fetch(`/api/promotions/${createdId}`, { method: 'DELETE' })
            if (res.status === 204) {
                setMessage('Promoción eliminada')
                setCreatedId(null)
                setPreview(null)
            } else {
                const json = await res.json().catch(() => ({})) as Record<string, unknown>
                const err = String(json?.error || `HTTP ${res.status}`)
                setMessage(err)
            }
        } catch (e) {
            console.error(e)
            setMessage('Error al eliminar')
        } finally {
            setIsDeleting(false)
            setIsConfirmOpen(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }


    return (
        <form onSubmit={handleSubmit} className="max-w-3xl text-gray-900">
            <label className="block">
                <span className="text-sm font-medium text-gray-900">Imagen</span>
                <div className="mt-1 flex items-center gap-3">
                    <label className="inline-block bg-white text-gray-800 border border-gray-300 rounded px-3 py-2 cursor-pointer">
                        Elegir archivo
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => onChooseFile(e.target.files?.[0] ?? null)} />
                    </label>
                    {preview && (
                        <div className="w-28 h-20 relative rounded overflow-hidden">
                            <Image src={preview} alt="preview" fill className="object-cover" />
                            {createdId != null && (
                                <button
                                    type="button"
                                    onClick={() => setIsConfirmOpen(true)}
                                    className="absolute top-1 right-1 z-10 flex items-center justify-center h-7 w-7 rounded-full bg-black/60 text-white hover:bg-black/70"
                                    aria-label="Eliminar promoción"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 6h18M8 6v14a2 2 0 002 2h4a2 2 0 002-2V6M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
            </label>

            <div className="flex items-center gap-3 mt-4">
                <button type="submit" disabled={saving || Boolean(fileError)} className="rounded bg-pink-600 text-white px-4 py-2 disabled:opacity-60">{saving ? 'Guardando...' : 'Crear promoción'}</button>
                {createdId != null && (
                    <button type="button" onClick={() => setIsConfirmOpen(true)} disabled={saving} className="rounded bg-red-600 text-white px-3 py-2 disabled:opacity-60">Eliminar</button>
                )}
                {message && <div className="text-sm text-gray-700">{message}</div>}
            </div>
            <ConfirmModal
                isOpen={isConfirmOpen}
                title="Eliminar promoción"
                description={user && user.role?.name === 'admin'
                    ? '¿Seguro que deseas eliminar esta promoción? Esta acción no se puede deshacer.'
                    : 'No tienes permisos para eliminar promociones.'}
                confirmText={user && user.role?.name === 'admin' ? 'Eliminar' : 'Cerrar'}
                isLoading={isDeleting}
                onConfirm={confirmDelete}
                onCancel={() => setIsConfirmOpen(false)}
            />
        </form>
    )
}
