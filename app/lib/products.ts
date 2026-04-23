export type Product = {
    id: string
    name: string
    price: string
    image: string
    description: string
    category: string
}

export const bazarcitoProducts: Product[] = [
    {
        id: 'p1',
        name: 'Vitro Bambú',
        price: '$299.00',
        image: 'https://betterware.com.mx/cdn/shop/files/26522-1-Vitro-Bambu-Betterware_1680x.jpg',
        description: 'Sirve y disfruta de bebidas con la Maxi Vitro Bambú Betterware.',
        category: 'Cocina',
    },
    {
        id: 'p2',
        name: 'Set Dispensa Vitrolux',
        price: '$1,300.00',
        image: 'https://betterware.com.mx/cdn/shop/files/26021-1-Set-Dispensa-Vitrolux-Betterware_1680x.jpg',
        description: 'Organiza y protege hasta 20 pares de zapatos con la Modu Zapatera Moka Betterware.',
        category: 'Cocina',
    },
    {
        id: 'p3',
        name: 'Modu Zapatera Moka',
        price: '$1,200.00',
        image: 'https://betterware.com.mx/cdn/shop/files/26301-1-Modu-Zapatera-Moka-Betterware_1680x.jpg',
        description: 'Hidratación y fragancia suave.',
        category: 'Recamara',
    },
    {
        id: 'p4',
        name: 'Mesa Lateral Harmony ( 2 Pzs)',
        price: '$1,200.00',
        image: 'https://betterware.com.mx/cdn/shop/files/25815-1-Mesa-Lateral-Harmony-Betterware_6fc9d19a-aeb3-473d-a064-4dd2cdd1189e_1680x.jpg',
        description: 'Fijación media, acabado natural.',
        category: 'Hogar',
    },
]

export const getBazarcitoProductById = (id: string) => bazarcitoProducts.find((product) => product.id === id)
