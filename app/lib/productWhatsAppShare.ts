import type { Product } from './products'

const DEFAULT_SHARE_BASE_URL = 'https://brain-tech-kappa.vercel.app'

export type ShareableProduct = Pick<
    Product,
    'id' | 'name' | 'price' | 'description'
> & {
    details?: Product['details']
    promotionPrice?: string | null
    promotion_price?: string | null
    promoPrice?: string | null
}

export type ProductShareLinkOptions = {
    storeBasePath?: string
    shareBaseUrl?: string
    productPath?: 'detail' | 'store'
    includePreview?: boolean
}

export type ProductWhatsAppShareOptions = ProductShareLinkOptions & {
    product: ShareableProduct
    storeName?: string
    productUrl?: string | null
}

export type ProductWhatsAppShareResult = {
    whatsappUrl: string
    productUrl: string
    message: string
}

function resolveBaseUrl(shareBaseUrl?: string) {
    const browserOrigin = typeof window !== 'undefined' ? window.location.origin : ''
    const isLocalhost = browserOrigin.includes('localhost') || browserOrigin.includes('127.0.0.1')

    if (browserOrigin && !isLocalhost) return browserOrigin

    return shareBaseUrl || process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SHARE_BASE_URL
}

export function buildProductShareLink(
    product: Pick<ShareableProduct, 'id'>,
    options: ProductShareLinkOptions = {},
) {
    const storeBasePath = (options.storeBasePath || '/').replace(/\/+$/, '') || '/'
    const productPath = options.productPath ?? 'detail'
    const path =
        productPath === 'store'
            ? storeBasePath
            : `${storeBasePath === '/' ? '' : storeBasePath}/product/${encodeURIComponent(product.id)}`
    const url = new URL(path || '/', resolveBaseUrl(options.shareBaseUrl))

    url.searchParams.set('utm_source', 'whatsapp')
    url.searchParams.set('utm_medium', 'share')

    if (options.includePreview ?? productPath === 'detail') {
        const nonce = `${Date.now()}-${Math.floor(Math.random() * 100000)}`
        url.searchParams.set('preview', nonce)
        url.searchParams.set('force_preview', '1')
    }

    return url.toString()
}

function getDetailsText(product: Pick<ShareableProduct, 'details'>) {
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

function getPromotionPrice(product: ShareableProduct) {
    const value =
        product.promotionPrice ?? product.promotion_price ?? product.promoPrice ?? null

    return value != null && String(value).trim() !== '' ? String(value) : null
}

export function buildProductShareMessage(
    product: ShareableProduct,
    productUrl?: string | null,
    storeName?: string,
) {
    const promotionPrice = getPromotionPrice(product)
    const priceLines = promotionPrice
        ? [`Precio: ~${product.price}~`, `Precio promoción: ${promotionPrice}`]
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

export function buildProductWhatsAppShare(
    options: ProductWhatsAppShareOptions,
): ProductWhatsAppShareResult {
    const productUrl =
        options.productUrl ?? buildProductShareLink(options.product, options)
    const message = buildProductShareMessage(
        options.product,
        productUrl,
        options.storeName,
    )

    return {
        productUrl,
        message,
        whatsappUrl: `https://wa.me/?text=${encodeURIComponent(message)}`,
    }
}

export function buildProductWhatsAppShareUrl(options: ProductWhatsAppShareOptions) {
    return buildProductWhatsAppShare(options).whatsappUrl
}

export function openProductWhatsAppShare(
    options: ProductWhatsAppShareOptions,
): ProductWhatsAppShareResult | null {
    if (typeof window === 'undefined') return null

    const result = buildProductWhatsAppShare(options)
    window.open(result.whatsappUrl, '_blank', 'noopener,noreferrer')
    return result
}

export function shareProductViaWhatsApp(options: ProductWhatsAppShareOptions) {
    return openProductWhatsAppShare(options)
}
