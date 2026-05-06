'use client'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error'

type ToastMessageProps = {
    message: string
    type: ToastType
    onClose: () => void
    duration?: number
}

export default function ToastMessage({ message, type, onClose, duration = 3000 }: ToastMessageProps) {
    useEffect(() => {
        const timeout = window.setTimeout(onClose, duration)
        return () => window.clearTimeout(timeout)
    }, [duration, onClose])

    return (
        <div className="fixed bottom-6 right-6 z-[70] max-w-sm">
            <div className={`rounded-xl px-4 py-3 shadow-lg ring-1 ${type === 'success' ? 'bg-emerald-50 text-emerald-800 ring-emerald-200' : 'bg-red-50 text-red-800 ring-red-200'}`}>
                <div className="flex items-start gap-3">
                    <div className={`mt-0.5 h-2.5 w-2.5 rounded-full ${type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className="flex-1 text-sm font-medium">{message}</div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-current/70 transition hover:text-current"
                        aria-label="Cerrar notificación"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    )
}
