'use client'

import Image from 'next/image'
import type { ReactNode } from 'react'
import { FiTrash2 } from 'react-icons/fi'
import type { Product } from '@/app/lib/products'
import ButtonSpinner from '@/app/components/ui/ButtonSpinner'
import { ProductCardContext, useProductCard } from './product-card-context'

type ProductWithStock = Product & {
    stock?: number | null
    quantity?: number | null
}

function cx(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ')
}

function parseCurrency(value?: string | number | null) {
    if (value == null) return NaN
    const parsed = Number(String(value).replace(/[^0-9.-]/g, ''))
    return Number.isNaN(parsed) ? NaN : parsed
}

type ProductCardProps = {
    product: Product
    primary: string
    className?: string
    children: ReactNode
}

function ProductCardRoot({ product, primary, className, children }: ProductCardProps) {
    return (
        <ProductCardContext.Provider value={{ product, primary }}>
            <article className={cx('relative overflow-hidden rounded-lg bg-white shadow', className)}>{children}</article>
        </ProductCardContext.Provider>
    )
}

function ImageBlock({ className }: { className?: string }) {
    const { product } = useProductCard()

    return (
        <div className={cx('w-full bg-gray-50', className)}>
            <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={600}
                style={{ width: '100%', height: 'auto', objectFit: 'contain', objectPosition: 'center' }}
            />
        </div>
    )
}

function AdminActions({ isAdmin, children, className }: { isAdmin?: boolean; children: ReactNode; className?: string }) {
    if (!isAdmin) return null
    return <div className={cx('absolute right-3 top-3 flex items-center gap-2', className)}>{children}</div>
}

type IconActionProps = {
    onClick?: () => void
    loading?: boolean
    disabled?: boolean
    className?: string
    label?: string
}

function EditButton({ onClick, loading, disabled, className, label }: IconActionProps) {
    const { product } = useProductCard()
    const isDisabled = Boolean(loading || disabled)

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label ?? `Editar ${product.name}`}
            disabled={isDisabled}
            className={cx(
                'inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 transition hover:bg-pink-700 disabled:pointer-events-none disabled:opacity-60',
                className,
            )}
        >
            {loading ? (
                <ButtonSpinner className="h-5 w-5 text-white" />
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-white">
                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                    <path d="M3 17a1 1 0 001 1h12a1 1 0 100-2H4a1 1 0 00-1 1z" />
                </svg>
            )}
        </button>
    )
}

function DeleteButton({ onClick, loading, disabled, className, label }: IconActionProps) {
    const { product } = useProductCard()
    const isDisabled = Boolean(loading || disabled)

    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label ?? `Eliminar ${product.name}`}
            disabled={isDisabled}
            className={cx(
                'inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 transition hover:bg-red-700 disabled:pointer-events-none disabled:opacity-60',
                className,
            )}
        >
            {loading ? <ButtonSpinner className="h-5 w-5 text-white" /> : <FiTrash2 className="h-5 w-5 text-white" />}
        </button>
    )
}

function Body({ children, className }: { children: ReactNode; className?: string }) {
    return <div className={cx('p-4', className)}>{children}</div>
}

function Title({ className }: { className?: string }) {
    const { product } = useProductCard()
    return <h3 className={cx('font-semibold text-gray-900', className)}>{product.name}</h3>
}

function Description({ className }: { className?: string }) {
    const { product } = useProductCard()
    return <p className={cx('mt-1 text-sm text-gray-600', className)}>{product.description}</p>
}

function Details({ limit = 3, className }: { limit?: number; className?: string }) {
    const { product } = useProductCard()
    if (!product.details || product.details.length === 0) return null

    return (
        <ul className={cx('mt-2 space-y-1 text-xs text-gray-500', className)}>
            {product.details.slice(0, limit).map((detail) => (
                <li key={`${detail.label}-${detail.value}`}>
                    <span className="font-semibold">{detail.label}:</span> {detail.value}
                </li>
            ))}
        </ul>
    )
}

function Price({ className }: { className?: string }) {
    const { product, primary } = useProductCard()
    const promoRaw = product.promotionPrice
    const promoValue = parseCurrency(promoRaw)

    if (promoRaw == null || String(promoRaw).trim() === '' || Number.isNaN(promoValue) || promoValue <= 0) {
        return <div className={cx('text-lg font-bold text-gray-900', className)}>{product.price}</div>
    }

    return (
        <div className={cx('flex flex-col', className)}>
            <div className="text-sm text-gray-500 line-through">{product.price}</div>
            <div className="text-lg font-bold" style={{ color: primary }}>
                {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(promoValue)}
            </div>
        </div>
    )
}

function Stock({ className }: { className?: string }) {
    const { product } = useProductCard()
    const source = product as ProductWithStock
    const raw = source.pieces ?? source.stock ?? source.quantity ?? null
    const display = raw == null ? null : Number(raw)

    return <div className={cx('text-sm text-gray-500', className)}>Piezas: {display == null ? '—' : String(display)}</div>
}

function Actions({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cx('mt-3', className)}>
            <div className="flex min-w-0 flex-col gap-3">{children}</div>
        </div>
    )
}

type ActionButtonProps = {
    onClick?: () => void
    loading?: boolean
    disabled?: boolean
    label?: string
    className?: string
}

function RequestButton({ onClick, loading, disabled, label = 'Pedir por WhatsApp', className }: ActionButtonProps) {
    const { primary } = useProductCard()
    const isDisabled = Boolean(loading || disabled)

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={cx(
                'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded px-4 py-2 text-sm text-white transition disabled:cursor-not-allowed disabled:opacity-70 md:text-base',
                className,
            )}
            style={{ background: primary }}
        >
            {loading ? (
                <>
                    <ButtonSpinner className="h-4 w-4 text-white" />
                    <span>Abriendo...</span>
                </>
            ) : (
                label
            )}
        </button>
    )
}

function ShareButton({ onClick, loading, disabled, label = 'Compartir por WhatsApp', className }: ActionButtonProps) {
    const isDisabled = Boolean(loading || disabled)

    return (
        <button
            type="button"
            onClick={onClick}
            disabled={isDisabled}
            className={cx(
                'inline-flex w-full items-center justify-center gap-2 whitespace-nowrap rounded border border-gray-300 px-4 py-2 text-sm text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70 md:text-base',
                className,
            )}
        >
            {loading ? (
                <>
                    <ButtonSpinner className="h-4 w-4 text-gray-800" />
                    <span>Abriendo...</span>
                </>
            ) : (
                label
            )}
        </button>
    )
}

export const ProductCard = Object.assign(ProductCardRoot, {
    Image: ImageBlock,
    AdminActions,
    EditButton,
    DeleteButton,
    Body,
    Title,
    Description,
    Details,
    Price,
    Stock,
    Actions,
    RequestButton,
    ShareButton,
})

export type { ProductCardProps, IconActionProps, ActionButtonProps }
