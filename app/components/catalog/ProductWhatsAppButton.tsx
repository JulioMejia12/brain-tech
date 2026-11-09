'use client'

import { useState } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import type { Product } from '../../lib/products'
import {
    buildProductShareUrl,
    getWhatsAppDigits,
    openProductWhatsApp,
} from '../../lib/productWhatsApp'
import ButtonSpinner from '../ui/ButtonSpinner'

export type ProductWhatsAppButtonProps = {
    product: Product
    whatsappNumber: string
    storeBasePath?: string
    shareBaseUrl?: string
    productPath?: 'detail' | 'store'
    includePreview?: boolean
    label?: string
    showIcon?: boolean
    className?: string
}

const defaultClassName =
    'inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70'

export default function ProductWhatsAppButton({
    product,
    whatsappNumber,
    storeBasePath = '/bazarcito',
    shareBaseUrl,
    productPath = 'detail',
    includePreview,
    label = 'Pedir',
    showIcon = true,
    className = defaultClassName,
}: ProductWhatsAppButtonProps) {
    const [requesting, setRequesting] = useState(false)
    const hasWhatsApp = Boolean(getWhatsAppDigits(whatsappNumber))

    const handleRequest = () => {
        if (!hasWhatsApp || requesting) return

        setRequesting(true)
        const productUrl = buildProductShareUrl(product, {
            storeBasePath,
            shareBaseUrl,
            productPath,
            includePreview,
        })

        openProductWhatsApp({
            product,
            whatsappNumber,
            productUrl,
        })

        window.setTimeout(() => setRequesting(false), 400)
    }

    return (
        <button
            type="button"
            onClick={handleRequest}
            disabled={!hasWhatsApp || requesting}
            className={className}
        >
            {requesting ? (
                <ButtonSpinner className="h-4 w-4 text-current" />
            ) : showIcon ? (
                <FaWhatsapp className="h-4 w-4" />
            ) : null}
            <span>{requesting ? 'Abriendo...' : label}</span>
        </button>
    )
}
