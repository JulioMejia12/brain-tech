'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { FiChevronDown, FiSearch, FiX } from 'react-icons/fi'

export type ProductSortValue = 'az' | 'za' | 'price_asc' | 'price_desc'

export type ProductSortOption = {
    value: ProductSortValue
    label: string
}

const defaultSortOptions: ProductSortOption[] = [
    { value: 'az', label: 'A - Z' },
    { value: 'za', label: 'Z - A' },
    { value: 'price_asc', label: 'Menor precio' },
    { value: 'price_desc', label: 'Mayor precio' },
]

type ProductFiltersContextValue = {
    searchValue: string
    onSearchChange: (value: string) => void
    sortValue: ProductSortValue
    onSortChange: (value: ProductSortValue) => void
    sortOptions: ProductSortOption[]
    categories: string[]
    categoryValue: string
    onCategoryChange: (value: string) => void
    primary: string
    textColor?: string
    borderColor: string
}

const ProductFiltersContext = createContext<ProductFiltersContextValue | null>(null)

function useProductFilters() {
    const context = useContext(ProductFiltersContext)

    if (!context) {
        throw new Error('ProductFilters components must be used within ProductFilters.Root')
    }

    return context
}

export type ProductFiltersRootProps = {
    searchValue: string
    onSearchChange: (value: string) => void
    sortValue: ProductSortValue
    onSortChange: (value: ProductSortValue) => void
    sortOptions?: ProductSortOption[]
    categories: string[]
    categoryValue: string
    onCategoryChange: (value: string) => void
    primary?: string
    textColor?: string
    backgroundColor?: string
    borderColor?: string
    className?: string
    children: ReactNode
}

export function ProductFiltersRoot({
    searchValue,
    onSearchChange,
    sortValue,
    onSortChange,
    sortOptions = defaultSortOptions,
    categories,
    categoryValue,
    onCategoryChange,
    primary = 'var(--primary)',
    textColor,
    backgroundColor = 'rgba(255,255,255,0.3)',
    borderColor = 'rgba(209, 213, 219, 0.9)',
    className = '',
    children,
}: ProductFiltersRootProps) {
    return (
        <ProductFiltersContext.Provider
            value={{
                searchValue,
                onSearchChange,
                sortValue,
                onSortChange,
                sortOptions,
                categories,
                categoryValue,
                onCategoryChange,
                primary,
                textColor,
                borderColor,
            }}
        >
            <section className={`mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6 ${className}`}>
                <div
                    className="mb-5 flex flex-col gap-4 rounded-[28px] p-4 shadow-[0_12px_30px_rgba(0,0,0,0.12)] backdrop-blur-sm md:p-5"
                    style={{ backgroundColor }}
                >
                    {children}
                </div>
            </section>
        </ProductFiltersContext.Provider>
    )
}

export type ProductFiltersSearchProps = {
    label?: string
    placeholder?: string
    className?: string
}

export function ProductFiltersSearch({
    label = 'Buscar producto',
    placeholder = 'Buscar productos',
    className = '',
}: ProductFiltersSearchProps) {
    const { searchValue, onSearchChange, textColor } = useProductFilters()

    return (
        <label className={`block ${className}`}>
            <span className="mb-2 block text-sm font-medium" style={textColor ? { color: textColor } : undefined}>
                {label}
            </span>
            <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-gray-400">
                    <FiSearch className="h-5 w-5" />
                </span>
                <input
                    type="text"
                    value={searchValue}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-full border border-white/70 bg-white px-4 py-3 pl-12 pr-12 text-base text-gray-900 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
                />
                {searchValue ? (
                    <span className="absolute inset-y-0 right-4 flex items-center">
                        <button
                            type="button"
                            aria-label="Limpiar búsqueda"
                            onClick={() => onSearchChange('')}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-500 hover:bg-gray-100"
                        >
                            <FiX className="h-4 w-4" />
                        </button>
                    </span>
                ) : null}
            </div>
        </label>
    )
}

export type ProductFiltersSortProps = {
    label?: string
    className?: string
}

export function ProductFiltersSort({ label = 'Ordenar por', className = '' }: ProductFiltersSortProps) {
    const { sortValue, onSortChange, sortOptions, primary, textColor, borderColor } = useProductFilters()

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <span className="text-sm font-medium" style={textColor ? { color: textColor } : undefined}>
                {label}
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {sortOptions.map((option) => {
                    const active = sortValue === option.value

                    return (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => onSortChange(option.value)}
                            className={`min-h-[48px] rounded-2xl px-4 py-2.5 text-sm font-semibold transition ${
                                active
                                    ? 'shadow-[0_8px_20px_rgba(0,0,0,0.2)]'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                            style={
                                active
                                    ? { background: primary, color: textColor ?? '#fff' }
                                    : { border: `1px solid ${borderColor}` }
                            }
                        >
                            {option.label}
                        </button>
                    )
                })}
            </div>
        </div>
    )
}

export type ProductFiltersCategoriesProps = {
    label?: string
    className?: string
}

export function ProductFiltersCategories({ label = 'Categorías', className = '' }: ProductFiltersCategoriesProps) {
    const { categories, categoryValue, onCategoryChange, textColor } = useProductFilters()

    return (
        <div className={`flex flex-col gap-2 ${className}`}>
            <span className="text-sm font-medium" style={textColor ? { color: textColor } : undefined}>
                {label}
            </span>
            <div className="relative">
                <select
                    value={categoryValue}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    className="w-full appearance-none rounded-2xl border border-white/70 bg-white px-4 py-3 pr-12 text-sm font-medium text-gray-800 shadow-sm outline-none transition focus:border-gray-400 focus:ring-4 focus:ring-gray-100"
                >
                    {categories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                    <FiChevronDown className="h-5 w-5" />
                </span>
            </div>
        </div>
    )
}

const ProductFilters = Object.assign(ProductFiltersRoot, {
    Root: ProductFiltersRoot,
    Search: ProductFiltersSearch,
    Sort: ProductFiltersSort,
    Categories: ProductFiltersCategories,
})

export default ProductFilters
