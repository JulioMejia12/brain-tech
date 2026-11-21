'use client'

import { useState, type CSSProperties } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import {
    openProductWhatsAppShare,
    type ProductWhatsAppShareResult,
    type ShareableProduct,
} from '../../lib/productWhatsAppShare'
import ButtonSpinner from '../ui/ButtonSpinner'

export type ProductWhatsAppShareButtonProps = {
    product: ShareableProduct
    storeBasePath?: string
    shareBaseUrl?: string
    productPath?: 'detail' | 'store'
    includePreview?: boolean
    storeName?: string
    label?: string
    showIcon?: boolean
    className?: string
    style?: CSSProperties
    disabled?: boolean
    onShared?: (result: ProductWhatsAppShareResult) => void
}

const defaultClassName =
    'inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-2 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70'

export default function ProductWhatsAppShareButton({
    product,
    storeBasePath,
    shareBaseUrl,
    productPath = 'detail',
    includePreview,
    storeName,
    label = 'Compartir',
    showIcon = true,
    className = defaultClassName,
    style,
    disabled = false,
    onShared,
}: ProductWhatsAppShareButtonProps) {
    const [sharing, setSharing] = useState(false)

    const handleShare = () => {
        if (disabled || sharing) return

        setSharing(true)
        const result = openProductWhatsAppShare({
            product,
            storeBasePath,
            shareBaseUrl,
            productPath,
            includePreview,
            storeName,
        })

        if (result) onShared?.(result)
        window.setTimeout(() => setSharing(false), 400)
    }

    return (
        <button
            type="button"
            onClick={handleShare}
            disabled={disabled || sharing}
            className={className}
            style={style}
            title="Abre WhatsApp para compartir este producto"
            aria-label="Compartir por WhatsApp: abre WhatsApp para compartir"
        >
            {sharing ? (
                <ButtonSpinner className="h-4 w-4 text-current" />
            ) : showIcon ? (
                <FaWhatsapp className="h-4 w-4" />
            ) : null}
            <span>{sharing ? 'Abriendo...' : label}</span>
        </button>
    )
}
