"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { FiTrash2 } from 'react-icons/fi'
import ConfirmModal from '../../components/ui/ConfirmModal'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { marronProductsSellProps } from '@/app/lib/productsSellConfig'

const MARRON_NEGOCIO_ID = process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || '2'

export default function PromotionForm() {
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const [orientation, setOrientation] = useState<'HORIZONTAL' | 'VERTICAL'>('HORIZONTAL')
    const [fileError, setFileError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [createdId, setCreatedId] = useState<number | null>(null)
    const { user } = useAuth()
    const router = useRouter()
    const [isConfirmOpen, setIsConfirmOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const primary = marronProductsSellProps.primary || '#895129'

    const MAX_SIZE = 5 * 1024 * 1024

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview])

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
            form.append('imageFile', imageFile)
            form.append('orientation', orientation)
            form.append('negocioId', MARRON_NEGOCIO_ID)
            const res = await fetch('/api/promotions', { method: 'POST', body: form })
            const json = await res.json().catch(() => ({})) as Record<string, unknown>
            if (!res.ok) {
                setMessage(String(json?.error || 'Server error'))
                return
            }

            const data = (json?.data ?? null) as Record<string, unknown> | null
            setMessage('Promoción creada correctamente')
            if (data?.id !== undefined) {
                setCreatedId(Number(data.id))
                if (data?.image) setPreview(String(data.image))
                if (String(data?.orientation || '').toUpperCase() === 'VERTICAL') setOrientation('VERTICAL')
                else setOrientation('HORIZONTAL')
                router.push('/marron')
            }
            setImageFile(null)
            try {
                const fileInput = document.querySelector('input[type=file]') as HTMLInputElement | null
                if (fileInput) fileInput.value = ''
            } catch { }
        } catch (error) {
            console.error(error)
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
            const res = await fetch(`/api/promotions/${createdId}?negocioId=${encodeURIComponent(MARRON_NEGOCIO_ID)}`, { method: 'DELETE' })
            if (res.status === 204) {
                setMessage('Promoción eliminada')
                setCreatedId(null)
                setPreview(null)
            } else {
                const json = await res.json().catch(() => ({})) as Record<string, unknown>
                setMessage(String(json?.error || `HTTP ${res.status}`))
            }
        } catch (error) {
            console.error(error)
            setMessage('Error al eliminar')
        } finally {
            setIsDeleting(false)
            setIsConfirmOpen(false)
            setTimeout(() => setMessage(null), 3000)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-3xl text-gray-900">
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Esta promoción se creará automáticamente para <span className="font-semibold">Marron</span> con <span className="font-semibold">negocioId = {MARRON_NEGOCIO_ID}</span>.
            </div>

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
                                <button type="button" onClick={() => setIsConfirmOpen(true)} className="absolute top-1 right-1 z-10 flex items-center justify-center h-7 w-7 rounded-full text-white" style={{ background: primary }} aria-label="Eliminar promoción">
                                    <FiTrash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                {fileError && <p className="mt-2 text-sm text-red-600">{fileError}</p>}
            </label>

            <div className="mt-3">
                <span className="text-sm font-medium text-gray-900">Orientación</span>
                <div className="mt-2 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name="orientation" value="HORIZONTAL" checked={orientation === 'HORIZONTAL'} onChange={() => setOrientation('HORIZONTAL')} />
                        <span className="text-sm">Horizontal</span>
                    </label>
                    <label className="inline-flex items-center gap-2">
                        <input type="radio" name="orientation" value="VERTICAL" checked={orientation === 'VERTICAL'} onChange={() => setOrientation('VERTICAL')} />
                        <span className="text-sm">Vertical</span>
                    </label>
                </div>
            </div>

            <div className="flex items-center gap-3 mt-4">
                <button type="submit" disabled={saving || Boolean(fileError)} className="rounded bg-amber-700 text-white px-4 py-2 disabled:opacity-60">{saving ? 'Guardando...' : 'Crear promoción'}</button>
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
