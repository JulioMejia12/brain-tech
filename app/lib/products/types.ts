export type Product = {
    id: string
    name: string
    price: string
    image: string
    description: string
    category: string
    negocioId?: number | null
    pieces?: number | null
    details?: { label: string; value: string }[]
}

export type ProductApiItem = {
    id: string | number
    title?: string
    name?: string
    price?: string | number
    image?: string | null
    description?: string | null
    category?: {
        name?: string | null
    } | null
    details?: any
    negocioId?: number | null
    pieces?: number | null
    quantity?: number | null
    stock?: number | null
}
