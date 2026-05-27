import plateriaConfig from '../demo/plateria-config.json'
import type { Product } from './products'

const bazarcitoNegocioId = process.env.NEXT_PUBLIC_BAZARCITO_NEGOCIO_ID || process.env.BAZARCITO_NEGOCIO_ID || ''
const bazarcitoProductsEndpoint = bazarcitoNegocioId
    ? `/api/products?negocioId=${encodeURIComponent(bazarcitoNegocioId)}`
    : '/api/bazarcito/products'

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
    productsEndpoint: bazarcitoProductsEndpoint,
    productMutationBase: '/api/bazarcito/products',
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
    productsEndpoint: '/api/platerias/products',
    productMutationBase: '/api/platerias/products',
}