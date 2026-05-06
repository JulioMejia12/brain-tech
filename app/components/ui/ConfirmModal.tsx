'use client'
import { ReactNode } from 'react'
import ButtonSpinner from './ButtonSpinner'

type ConfirmModalProps = {
    isOpen: boolean
    title: string
    description: ReactNode
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    variant?: 'danger' | 'primary'
    onConfirm: () => void | Promise<void>
    onCancel: () => void
    confirmIcon?: ReactNode
}

export default function ConfirmModal({
    isOpen,
    title,
    description,
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    isLoading = false,
    variant = 'danger',
    onConfirm,
    onCancel,
    confirmIcon,
}: ConfirmModalProps) {
    if (!isOpen) return null

    const confirmClasses = variant === 'danger'
        ? 'bg-red-600 hover:bg-red-700'
        : 'bg-pink-600 hover:bg-pink-700'

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
            <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
            <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                    <div className="mt-2 text-sm text-gray-600">{description}</div>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:pointer-events-none disabled:opacity-70"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:pointer-events-none disabled:opacity-70 ${confirmClasses}`}
                    >
                        {isLoading ? (
                            <>
                                <ButtonSpinner className="h-4 w-4 text-white" />
                                <span>{confirmText}...</span>
                            </>
                        ) : (
                            <>
                                {confirmIcon}
                                <span>{confirmText}</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
