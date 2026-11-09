import type { Product } from './products'

const DEFAULT_SHARE_BASE_URL = 'https://brain-tech-kappa.vercel.app'

export type ProductWhatsAppProduct = Pick<
    Product,
    'name' | 'price' | 'description' | 'details' | 'promotionPrice'
>

export type ProductShareUrlOptions = {
    storeBasePath?: string
    shareBaseUrl?: string
    productPath?: 'detail' | 'store'
    includePreview?: boolean
}

export type ProductWhatsAppUrlOptions = {
    product: ProductWhatsAppProduct
    whatsappNumber?: string
    productUrl?: string | null
    mode?: 'request' | 'share'
    storeName?: string
}

export function getWhatsAppDigits(value: string | null | undefined) {
    return String(value ?? '').replace(/\D/g, '')
}

export function buildProductShareUrl(
    product: Pick<Product, 'id'>,
    options: ProductShareUrlOptions = {},
) {
    const browserOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    const isLocalhost = browserOrigin.includes('localhost') || browserOrigin.includes('127.0.0.1')
    const baseUrl =
        !browserOrigin || isLocalhost
            ? options.shareBaseUrl || DEFAULT_SHARE_BASE_URL
            : browserOrigin
    const storeBasePath = options.storeBasePath || '/bazarcito'
    const normalizedStore = storeBasePath.replace(/^\//, '') || 'bazarcito'
    const useStoreDetailRoute = normalizedStore === 'marron' || normalizedStore === 'cremeria'
    const productPath = options.productPath ?? 'detail'
    const path =
        productPath === 'store'
            ? storeBasePath || '/'
            : `${useStoreDetailRoute ? `/${normalizedStore}` : storeBasePath}/product/${product.id}`
    const url = new URL(path, baseUrl)

    url.searchParams.set('utm_source', 'whatsapp')
    url.searchParams.set('utm_medium', 'share')

    if (options.includePreview ?? productPath === 'detail') {
        const nonce = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
        url.searchParams.set('preview', nonce)
        url.searchParams.set('force_preview', '1')
    }

    return url.toString()
}

function getDetailsText(product: Pick<Product, 'details'>) {
    if (!Array.isArray(product.details) || product.details.length === 0) return ''

    return product.details
        .filter(
            (detail) =>
                (detail?.label && String(detail.label).trim() !== '') ||
                (detail?.value && String(detail.value).trim() !== ''),
        )
        .map((detail) => `• ${detail.label}: ${detail.value}`)
        .join('\n')
}

export function buildProductRequestMessage(
    product: Pick<Product, 'name' | 'price' | 'details'>,
    productUrl?: string | null,
) {
    const detailsText = getDetailsText(product)
    const textParts: string[] = []

    if (productUrl) textParts.push(productUrl, '')
    textParts.push(`Hola, quiero realizar el pedido de ${product.name} por ${product.price}.`)
    if (detailsText) textParts.push('', detailsText)
    textParts.push('', 'Por favor me pueden confirmar disponibilidad.')

    return textParts.join('\n')
}

export function buildProductShareMessage(
    product: Pick<
        Product,
        'name' | 'price' | 'description' | 'details' | 'promotionPrice'
    >,
    productUrl?: string | null,
    storeName?: string,
) {
    const promoRaw = product.promotionPrice ?? null
    const hasPromo = promoRaw != null && String(promoRaw).trim() !== ''
    const priceLines = hasPromo
        ? [`Precio: ~${product.price}~`, `Precio promoción: ${String(promoRaw)}`]
        : [`Precio: ${product.price}`]
    const detailsText = getDetailsText(product)
    const textParts: string[] = []

    if (productUrl) textParts.push(productUrl, '')
    textParts.push(
        `Producto: ${product.name}`,
        ...priceLines,
        product.description || `Mira este producto en ${storeName || 'nuestra tienda'}.`,
    )
    if (detailsText) textParts.push('', detailsText)

    return textParts.join('\n')
}

export function buildProductWhatsAppUrl({
    product,
    whatsappNumber,
    productUrl,
    mode = 'request',
    storeName,
}: ProductWhatsAppUrlOptions) {
    if (mode === 'share') {
        const text = buildProductShareMessage(product, productUrl, storeName)
        return `https://wa.me/?text=${encodeURIComponent(text)}`
    }

    const digits = getWhatsAppDigits(whatsappNumber)
    if (!digits) return null

    const text = buildProductRequestMessage(product, productUrl)
    return `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(text)}`
}

export function openProductWhatsApp(options: ProductWhatsAppUrlOptions) {
    if (typeof window === 'undefined') return false

    const url = buildProductWhatsAppUrl(options)
    if (!url) return false

    window.open(url, '_blank')
    return true
}
