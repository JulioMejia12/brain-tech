export type Product = {
    id: string
    name: string
    price: string
    image: string
    description: string
    category: string
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
}
