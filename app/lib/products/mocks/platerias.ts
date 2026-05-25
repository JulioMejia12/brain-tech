import type { Product } from '../types'

export const plateriasMockProducts: Product[] = [
    {
        id: 'pl-1',
        name: 'Collar Artesanal de Plata',
        price: '$1,250.00',
        image: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779750696/pexels-karola-g-4471307_dkoom6.jpg',
        description: 'Collar en plata ley 925 con detalle grabado a mano.',
        category: 'Joyería',
        details: [
            { label: 'Material', value: 'Plata 925' },
            { label: 'Tamaño', value: '45 cm' },
        ],
    },
    // {
    //     id: 'pl-2',
    //     name: 'Anillo Clásico',
    //     price: '$850.00',
    //     image: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779000000/plateria/anillo.jpg',
    //     description: 'Anillo simple en plata con acabado pulido.',
    //     category: 'Joyería',
    //     details: [{ label: 'Medidas', value: 'Disponible en tallas 6-12' }],
    // },
    // {
    //     id: 'pl-3',
    //     name: 'Pulsera Trenzada',
    //     price: '$520.00',
    //     image: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779000000/plateria/pulsera.jpg',
    //     description: 'Pulsera trenzada en plata con cierre de seguridad.',
    //     category: 'Accesorios',
    // },
    // {
    //     id: 'pl-4',
    //     name: 'Juego de Aretes',
    //     price: '$680.00',
    //     image: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779000000/plateria/aretes.jpg',
    //     description: 'Set de dos pares de aretes en plata fina.',
    //     category: 'Joyería',
    // },
]

export default plateriasMockProducts
