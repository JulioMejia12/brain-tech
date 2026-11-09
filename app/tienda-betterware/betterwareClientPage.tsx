'use client'

import { FaWhatsapp } from 'react-icons/fa'
import type { Product } from '../lib/products'
import Footer from '../components/layout/Footer'
import Card from '../components/ui/Card'
import ProductGridLayout from '../components/catalog/ProductGridLayout'
import ProductWhatsAppButton from '../components/catalog/ProductWhatsAppButton'
import PromotionsSection from '../components/catalog/PromotionsSection'
import BetterwareNavBar from './BetterwareNavBar'

type Props = {
    products: Product[]
    bazarcitoWhatsappNumber: string
}

function hasPromotion(product: Product) {
    return Boolean(product.promotionPrice?.trim())
}

function formatPieces(pieces: number) {
    return `${pieces} ${pieces === 1 ? 'pza' : 'pzas'}`
}

type BetterwareProductCardProps = {
    product: Product
    whatsappDigits: string
}

function BetterwareProductCard({ product, whatsappDigits }: BetterwareProductCardProps) {
    return (
        <Card as="article" interactive className="h-full" backgroundColor='#7F5D99'>
            <Card.Media
                src={product.image}
                alt={product.name.trim()}
                aspect="square"
                fit="contain"
            />
            <Card.Header>
                <Card.Badge tone="info" className="capitalize">
                    {product.category}
                </Card.Badge>
                {product.pieces != null ? (
                    <Card.Badge tone={product.pieces > 0 ? 'success' : 'danger'}>
                        {product.pieces > 0 ? formatPieces(product.pieces) : 'Agotado'}
                    </Card.Badge>
                ) : null}
            </Card.Header>
            <Card.Body>
                <Card.Title className="line-clamp-2">{product.name.trim()}</Card.Title>
                {product.description ? (
                    <Card.Description className="line-clamp-3">
                        {product.description.trim()}
                    </Card.Description>
                ) : null}
            </Card.Body>
            <Card.Footer>
                {hasPromotion(product) ? (
                    <div className="flex flex-col">
                        <span className="text-xs text-[#6b7280] line-through dark:text-white/50">
                            {product.price}
                        </span>
                        <span className="text-lg font-bold text-[var(--primary)]">
                            {product.promotionPrice}
                        </span>
                    </div>
                ) : (
                    <span className="text-lg font-bold text-[#111827] dark:text-white">
                        {product.price}
                    </span>
                )}
                {whatsappDigits ? (
                    <Card.Actions>
                        <ProductWhatsAppButton
                            product={product}
                            whatsappNumber={whatsappDigits}
                            storeBasePath="/tienda-betterware"
                            productPath="store"
                            includePreview={false}
                        />
                    </Card.Actions>
                ) : null}
            </Card.Footer>
        </Card>
    )
}

export default function BetterwareClientPage({ products, bazarcitoWhatsappNumber }: Props) {
    const whatsappDigits = bazarcitoWhatsappNumber.replace(/\D/g, '')
    const whatsappHref = whatsappDigits
        ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hola, me interesan los productos de Tienda Betterware.')}`
        : null

    return (
        <div className="flex min-h-screen flex-col bg-color-red">
            <BetterwareNavBar backgroundColor='purple' textColor='#fff' whatsappHref={whatsappHref} />
            <main className="flex-1" style={{ background: 'purple' }}>
                <PromotionsSection
                    id="promos"
                    title="Promociones"
                    textColor="#fff"
                    backgroundColor="#4C2365"
                    negocioId={1}
                    emptyMessage="No hay promociones disponibles por el momento."
                />

                <ProductGridLayout
                    textColor='#fff'
                    backgroundColor='#4C2365'
                    id="productos"
                    title="Productos"
                    description={
                        products.length > 0
                            ? `${products.length} ${products.length === 1 ? 'producto disponible' : 'productos disponibles'}`
                            : 'Catálogo en actualización'
                    }
                    action={
                        whatsappHref ? (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95"
                            >
                                <FaWhatsapp className="h-4 w-4" />
                                Pedir por WhatsApp
                            </a>
                        ) : null
                    }
                    items={products}
                    getItemKey={(product) => product.id}
                    renderItem={(product) => (
                        <BetterwareProductCard product={product} whatsappDigits={whatsappDigits} />
                    )}
                    emptyMessage="No hay productos disponibles por el momento."
                />
            </main>
            <Footer
                brand={{
                    name: 'Tienda Betterware',
                    href: '/tienda-betterware',
                    initials: 'BW',
                    tagline: 'Productos para tu hogar con atención directa por WhatsApp.',
                }}
                sections={[
                    {
                        title: 'Tienda',
                        links: [
                            { label: 'Catálogo', href: '/tienda-betterware' },
                            { label: 'Inicio', href: '/' },
                        ],
                    },
                ]}
                contact={whatsappDigits ? { whatsapp: bazarcitoWhatsappNumber } : undefined}
                legalLinks={[
                    { label: 'Términos', href: '/terminos' },
                    { label: 'Privacidad', href: '/privacidad' },
                ]}
                variant="light"
            />
        </div>
    )
}
