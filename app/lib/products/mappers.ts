import type { Product, ProductApiItem } from './types'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://brain-tech-kappa.vercel.app'

export function toAbsoluteImage(img: unknown) {
    if (!img) return `${SITE_URL}/image.jpeg`
    const value = String(img)
    if (value.startsWith('http://') || value.startsWith('https://')) return value
    return value.startsWith('/') ? `${SITE_URL}${value}` : `${SITE_URL}/${value}`
}

export function formatProductPrice(price: string | number | undefined | null) {
    if (typeof price === 'number') {
        return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(price)
    }

    return String(price || '')
}

export function mapItemToProduct(item: ProductApiItem): Product {
    const rawPieces = (item as any).pieces ?? (item as any).quantity ?? (item as any).stock ?? null
    const pieces = rawPieces != null && rawPieces !== '' ? Number(rawPieces) : null
    const negocioIdRaw = item.negocioId
    const negocioId = negocioIdRaw == null ? null : (String(negocioIdRaw).trim() === '' ? null : Number(negocioIdRaw))

    return {
        id: String(item.id),
        name: item.title || item.name || '',
        price: formatProductPrice(item.price),
        image: toAbsoluteImage(item.image),
        description: item.description || '',
        category: item.category?.name || 'Otros',
        negocioId: negocioId,
        details: Array.isArray((item as any).details) ? (item as any).details.map((d: any) => ({ label: String(d?.label ?? ''), value: String(d?.value ?? '') })) : undefined,
        pieces,
    }
}
