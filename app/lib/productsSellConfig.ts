import plateriaConfig from '../demo/plateria-config.json'
import type { Product } from './products'
import type { MobileStoreHeaderProps } from '../components/layout/MobileStoreHeader'

const bazarcitoNegocioId = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || process.env.BAZARCITO_NEGOCIO_ID || '1'
const bazarcitoProductsEndpoint = `/api/products?negocioId=${encodeURIComponent(bazarcitoNegocioId)}&limit=100`
const marronNegocioId = process.env.NEXT_PUBLIC_MARRON_NEGOCIO_ID || process.env.MARRON_NEGOCIO_ID || '2'
const marronProductsEndpoint = `/api/products?negocioId=${encodeURIComponent(marronNegocioId)}`

export type ProductsSellPageConfig = {
    title: string
    secondary: string
    primary: string
    textColor: string
    bgColor: string
    QuienesSomos: string
    promos: string[]
    cellPhone: string
    heroImage: string
    mobileHero?: MobileStoreHeaderProps
    mobileHeroVariant?: 'default' | 'compact-card'
    mobileHeroSubtitle?: string
    productsEndpoint: string
    productMutationBase: string
    products?: Product[]
}

export const bazarcitoProductsSellProps: ProductsSellPageConfig = {
    title: 'Bazarcito online',
    secondary: '#2e1227',
    primary: '#ff81e3',
    textColor: '#fff',
    bgColor: '#ffb6ef',
    QuienesSomos: 'Somos una tienda en línea enfocada en ofrecer productos útiles, prácticos y accesibles para tu hogar. Aquí encontrarás artículos de organización, cocina, limpieza, almacenamiento y mucho más. En Mi tienda online buscamos hacer tus compras más fáciles mediante atención rápida por WhatsApp y un catálogo pensado para ayudarte en tu día a día. ✨ Calidad, atención y practicidad en un solo lugar.',
    promos: [],
    cellPhone: process.env.NUMBER_BAZARCITO || '',
    heroImage: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1778286297/bazarcito_ftyipo.png',
    mobileHero: {
        title: 'Bazarcito online',
        logoSrc: '/logoBazar.png',
        logoAlt: 'Logo Bazarcito online',
        eyebrow: 'Catálogo online',
        heading: 'Descubre Bazarcito',
        description: 'Productos útiles y prácticos para tu hogar.',
        imageSrc: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1778286297/bazarcito_ftyipo.png',
        imageAlt: 'Catálogo destacado de Bazarcito online',
        backgroundTo: '#ff81e3',
    },
    productsEndpoint: bazarcitoProductsEndpoint,
    productMutationBase: '/api/bazarcito/products',
}

export const marronProductsSellProps: ProductsSellPageConfig = {
    title: 'Marron',
    secondary: '#2e1227',
    primary: '#895129',
    textColor: '#fff',
    bgColor: '#e8dbd2',
    QuienesSomos: 'Somos una tienda en línea enfocada en ofrecer productos útiles, prácticos y accesibles para tu hogar. Aquí encontrarás artículos de organización, cocina, limpieza, almacenamiento y mucho más. En Marrón buscamos hacer tus compras más fáciles mediante atención rápida por WhatsApp y un catálogo pensado para ayudarte en tu día a día. ✨ Calidad, atención y practicidad en un solo lugar.',
    promos: [],
    cellPhone: process.env.NUMBER_MARRON || '',
    heroImage: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779923687/WhatsApp_Image_2026-05-20_at_10.56.58_PM_xxualo.jpg',
    mobileHero: {
        title: 'Marrón',
        logoSrc: '',
        logoAlt: 'Logo Marrón',
        eyebrow: 'Tendencias & Hogar',
        heading: '¡Explora Marrón!',
        description: 'Prácticas novedades para tu hogar. ¡Nuevos productos cada día!',
        imageSrc: 'https://res.cloudinary.com/ddfj0omil/image/upload/v1779923687/WhatsApp_Image_2026-05-20_at_10.56.58_PM_xxualo.jpg',
        imageAlt: 'Producto destacado Marrón',
        priceTag: '$1,299',
        backgroundFrom: '#b46535',
        backgroundTo: '#8f4d28',
        glowColor: 'rgba(255, 223, 201, 0.44)',
    },
    productsEndpoint: marronProductsEndpoint,
    productMutationBase: '/api/products',
}

export const plateriasProductsSellProps: ProductsSellPageConfig = {
    title: 'Plateria Toñito',
    secondary: plateriaConfig.secondaryColor,
    primary: plateriaConfig.primaryColor,
    textColor: plateriaConfig.textColor,
    bgColor: plateriaConfig.bgColor,
    QuienesSomos: 'En plateria online, somos un equipo apasionado por conectar a los amantes de las compras con productos únicos y de calidad. Nuestra misión es ofrecer una plataforma fácil de usar donde los vendedores puedan mostrar sus productos y los compradores puedan descubrir tesoros escondidos. Creemos en el poder de la comunidad y en la importancia de apoyar a los pequeños negocios, por eso nos esforzamos por crear un espacio seguro y amigable para todos. ¡Únete a nosotros y descubre el bazarcito online donde cada compra es una experiencia especial!',
    promos: [],
    cellPhone: plateriaConfig.contact.phone,
    heroImage: plateriaConfig.heroImage,
    mobileHeroVariant: 'default',
    productsEndpoint: '/api/platerias/products',
    productMutationBase: '/api/platerias/products',
}