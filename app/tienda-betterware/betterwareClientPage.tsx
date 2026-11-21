'use client'

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { FaWhatsapp } from 'react-icons/fa'
import { FiHome, FiMenu, FiPhone, FiStar } from 'react-icons/fi'
import type { Product } from '../lib/products'
import Card from '../components/ui/Card'
import ProductGridLayout from '../components/catalog/ProductGridLayout'
import ProductFilters, { type ProductSortValue } from '../components/catalog/ProductFilters'
import ProductWhatsAppButton from '../components/catalog/ProductWhatsAppButton'
import ProductWhatsAppShareButton from '../components/catalog/ProductWhatsAppShareButton'
import PromotionsSection from '../components/catalog/PromotionsSection'
import BetterwareNavBar from './BetterwareNavBar'
import BetterwareFooter from './BetterwareFooter'
import MobileMenu from '../components/layout/MobileMenu'
import { betterwareTheme, type StoreTheme } from '../lib/storeTheme'

type Props = {
    products: Product[]
    bazarcitoWhatsappNumber: string
    theme?: StoreTheme
}

function hasPromotion(product: Product) {
    return Boolean(product.promotionPrice?.trim())
}

function formatPieces(pieces: number) {
    return `${pieces} ${pieces === 1 ? 'pza' : 'pzas'}`
}

function parsePrice(value: string) {
    const parsed = Number(value.replace(/[^0-9.-]/g, ''))
    return Number.isNaN(parsed) ? 0 : parsed
}

type BetterwareProductCardProps = {
    product: Product
    whatsappDigits: string
    theme: StoreTheme
}

function BetterwareProductCard({ product, whatsappDigits, theme }: BetterwareProductCardProps) {
    return (
        <Card
            as="article"
            interactive
            className="h-full"
            backgroundColor={theme.primary}
            style={{ color: theme.text, borderColor: theme.border }}
        >
            <Card.Media
                src={product.image}
                alt={product.name.trim()}
                aspect="square"
                fit="contain"
            />
            <Card.Header>
                <Card.Title className="min-w-0 flex-1 line-clamp-2" style={{ color: theme.text }}>
                    {product.name.trim()}
                </Card.Title>
                {product.pieces != null ? (
                    <Card.Badge
                        tone={product.pieces > 0 ? 'success' : 'danger'}
                        className="shrink-0 font-bold"
                        style={{
                            backgroundColor: product.pieces > 0 ? '#00E5FF' : '#FF2E88',
                            color: '#000000',
                        }}
                    >
                        {product.pieces > 0 ? formatPieces(product.pieces) : 'Agotado'}
                    </Card.Badge>
                ) : null}
            </Card.Header>
            <Card.Body>
                {product.description ? (
                    <Card.Description className="line-clamp-3" style={{ color: theme.mutedText }}>
                        {product.description.trim()}
                    </Card.Description>
                ) : null}
                {product.details && product.details.length > 0 ? (
                    <div className="mt-1">
                        <ul className="mt-1 space-y-1 text-xs leading-5" style={{ color: theme.mutedText }}>
                            {product.details.slice(0, 4).map((detail, index) => (
                                <li key={`${detail.label}-${detail.value}-${index}`}>
                                    <span className="font-semibold" style={{ color: theme.text }}>
                                        {detail.label}:
                                    </span>{' '}
                                    {detail.value}
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : null}
            </Card.Body>
            <Card.Footer style={{ borderColor: theme.border }}>
                {hasPromotion(product) ? (
                    <div className="flex flex-col">
                        <span className="text-xs line-through" style={{ color: theme.mutedText }}>
                            {product.price}
                        </span>
                        <span className="text-lg font-bold" style={{ color: theme.text }}>
                            {product.promotionPrice}
                        </span>
                    </div>
                ) : (
                    <span className="text-lg font-bold" style={{ color: theme.text }}>
                        {product.price}
                    </span>
                )}
                <Card.Actions>
                    <ProductWhatsAppShareButton
                        product={product}
                        label="Compartir"
                        storeBasePath="/tienda-betterware"
                        productPath="detail"
                        storeName="Tienda Betterware"
                        className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                        style={{ color: theme.background, borderColor: theme.background }}
                    />
                    {whatsappDigits ? (
                        <ProductWhatsAppButton
                            product={product}
                            whatsappNumber={whatsappDigits}
                            storeBasePath="/tienda-betterware"
                            productPath="detail"
                            label="Pedir"
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--background)] px-3 py-2 text-sm font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                    ) : null}
                </Card.Actions>
            </Card.Footer>
        </Card>
    )
}

export default function BetterwareClientPage({ products, bazarcitoWhatsappNumber, theme = betterwareTheme }: Props) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const rawSearchQuery = searchParams.get('q')?.trim() ?? ''
    const searchQuery = rawSearchQuery.toLowerCase()
    const [searchInput, setSearchInput] = useState(rawSearchQuery)
    const [sortOrder, setSortOrder] = useState<ProductSortValue>('az')
    const [selectedCategory, setSelectedCategory] = useState('Todos')
    const searchDebounceRef = useRef<number | null>(null)

    useEffect(() => {
        setSearchInput(rawSearchQuery)
    }, [rawSearchQuery])

    useEffect(() => {
        return () => {
            if (searchDebounceRef.current) {
                clearTimeout(searchDebounceRef.current)
            }
        }
    }, [])

    const handleSearchChange = (value: string) => {
        setSearchInput(value)

        if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current)
        }

        searchDebounceRef.current = window.setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString())

            if (value.trim()) {
                params.set('q', value)
            } else {
                params.delete('q')
            }

            router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false })
        }, 300)
    }

    const categories = useMemo(() => {
        const set = new Set(products.map((product) => product.category || 'Otros'))
        return ['Todos', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'es'))]
    }, [products])

    const filteredProducts = useMemo(() => {
        const filtered = products.filter((product) => {
            const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory
            const matchesSearch = !searchQuery || [product.name, product.description, product.category]
                .some((value) => value.toLowerCase().includes(searchQuery))

            return matchesCategory && matchesSearch
        })

        return [...filtered].sort((a, b) => {
            switch (sortOrder) {
                case 'az':
                    return a.name.localeCompare(b.name, 'es')
                case 'za':
                    return b.name.localeCompare(a.name, 'es')
                case 'price_asc':
                    return parsePrice(a.price) - parsePrice(b.price)
                case 'price_desc':
                    return parsePrice(b.price) - parsePrice(a.price)
                default:
                    return 0
            }
        })
    }, [products, searchQuery, selectedCategory, sortOrder])

    const whatsappDigits = bazarcitoWhatsappNumber.replace(/\D/g, '')
    const whatsappHref = whatsappDigits
        ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent('Hola, me interesan los productos de Tienda Betterware.')}`
        : null
    const themeStyle = {
        backgroundColor: theme.background,
        color: theme.text,
        '--primary': theme.primary,
        '--secondary': theme.secondary,
        '--background': theme.background,
    } as CSSProperties

    return (
        <div className="flex min-h-screen flex-col" style={themeStyle}>
            <BetterwareNavBar backgroundColor={theme.background} textColor={theme.text} />
            <main
                className="flex-1 pb-24 sm:pb-0"
                style={{ backgroundColor: theme.background, color: theme.text }}
            >
                <PromotionsSection
                    id="promos"
                    title="Promociones"
                    textColor={theme.text}
                    mutedTextColor={theme.mutedText}
                    backgroundColor={theme.secondary}
                    accentColor={theme.primary}
                    negocioId={1}
                    emptyMessage="No hay promociones disponibles por el momento."
                />

                <ProductFilters.Root
                    searchValue={searchInput}
                    onSearchChange={handleSearchChange}
                    sortValue={sortOrder}
                    onSortChange={setSortOrder}
                    categories={categories}
                    categoryValue={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    primary={theme.primary}
                    textColor={theme.text}
                    backgroundColor={theme.surface}
                    borderColor={theme.border}
                >
                    <ProductFilters.Search />
                    <ProductFilters.Sort />
                    <ProductFilters.Categories />
                </ProductFilters.Root>

                <ProductGridLayout
                    textColor={theme.text}
                    mutedTextColor={theme.mutedText}
                    backgroundColor={theme.secondary}
                    borderColor={theme.border}
                    id="productos"
                    title="Productos"
                    description={
                        filteredProducts.length > 0
                            ? `${filteredProducts.length} ${filteredProducts.length === 1 ? 'producto disponible' : 'productos disponibles'}`
                            : rawSearchQuery
                                ? `Sin resultados para "${rawSearchQuery}"`
                                : 'Catálogo en actualización'
                    }
                    action={
                        whatsappHref ? (
                            <a
                                href={whatsappHref}
                                target="_blank"
                                rel="noreferrer noopener"
                                className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition hover:brightness-95"
                                style={{ backgroundColor: theme.primary, color: theme.text }}
                                title="Abre el chat de WhatsApp para pedir"
                                aria-label="Pedir por WhatsApp: abre el chat de WhatsApp"
                            >
                                <FaWhatsapp className="h-4 w-4" />
                                Pedir por WhatsApp
                            </a>
                        ) : null
                    }
                    items={filteredProducts}
                    getItemKey={(product) => product.id}
                    renderItem={(product) => (
                        <BetterwareProductCard
                            product={product}
                            whatsappDigits={whatsappDigits}
                            theme={theme}
                        />
                    )}
                    emptyMessage={
                        rawSearchQuery
                            ? `No se encontraron productos para "${rawSearchQuery}".`
                            : 'No hay productos disponibles por el momento.'
                    }
                />

                <section id="info" className="mx-auto max-w-7xl px-5 pb-14 sm:px-8">
                    <div
                        className="rounded-3xl border p-6 sm:p-8"
                        style={{
                            backgroundColor: theme.secondary,
                            borderColor: theme.border,
                            color: theme.text,
                        }}
                    >
                        <h2 className="text-2xl font-bold" style={{ color: theme.text }}>
                            Nosotros
                        </h2>
                        <p className="mt-3 max-w-3xl text-sm leading-6" style={{ color: theme.mutedText }}>
                            En Tienda Betterware encontrarás productos prácticos para tu hogar, con atención directa por WhatsApp y un catálogo pensado para facilitar tus compras.
                        </p>
                    </div>
                </section>
            </main>
            <BetterwareFooter
                backgroundColor={theme.secondary}
                textColor={theme.text}
                mutedTextColor={theme.mutedText}
                borderColor={theme.border}
            />
            <MobileMenu.Root
                primary={theme.primary}
                backgroundColor={theme.secondary}
                textColor={theme.text}
                inactiveTextColor={theme.mutedText}
                activeTextColor={theme.text}
            >
                <MobileMenu.Item
                    id="productos"
                    label="Productos"
                    icon={<FiHome className="h-6 w-6" />}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />
                <MobileMenu.Item
                    id="nosotros"
                    label="Nosotros"
                    icon={<FiMenu className="h-6 w-6" />}
                    targetId="info"
                />
                <MobileMenu.Item
                    id="promos"
                    label="Promos"
                    icon={<FiStar className="h-6 w-6" />}
                    targetId="promos"
                />
                <MobileMenu.Item
                    id="contacto"
                    label="Contáctanos"
                    icon={
                        <span className="rounded-full bg-[#25D366] p-1 text-white">
                            <FiPhone className="h-4 w-4" />
                        </span>
                    }
                    href={whatsappHref ?? undefined}
                    external
                />
            </MobileMenu.Root>
        </div>
    )
}
