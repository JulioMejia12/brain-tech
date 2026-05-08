import plateriaConfig from '../demo/plateria-config.json'

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
}

const bazarcitoPromos = [
    'https://res.cloudinary.com/ddfj0omil/image/upload/q_auto/f_auto/v1777400663/banner_r6u0wi.png',
    'https://res.cloudinary.com/ddfj0omil/image/upload/q_auto/f_auto/v1777400530/samples/bike.jpg',
]

export const bazarcitoProductsSellProps: ProductsSellPageConfig = {
    title: 'Bazarcito online',
    secondary: '#2e1227',
    primary: '#ff81e3',
    textColor: '#fff',
    bgColor: '#ffb6ef',
    QuienesSomos: 'En Bazarcito Online, somos un equipo apasionado por conectar a los amantes de las compras con productos únicos y de calidad. Nuestra misión es ofrecer una plataforma fácil de usar donde los vendedores puedan mostrar sus productos y los compradores puedan descubrir tesoros escondidos. Creemos en el poder de la comunidad y en la importancia de apoyar a los pequeños negocios, por eso nos esforzamos por crear un espacio seguro y amigable para todos. ¡Únete a nosotros y descubre el bazarcito online donde cada compra es una experiencia especial!',
    promos: bazarcitoPromos,
    cellPhone: '5571906152',
    heroImage: 'https://res.cloudinary.com/ddfj0omil/image/upload/q_auto/f_auto/v1778198183/laptop-store_tbir4n.png',
    productsEndpoint: '/api/bazarcito/products',
    productMutationBase: '/api/bazarcito/products',
}

export const plateriasProductsSellProps: ProductsSellPageConfig = {
    title: 'Plateria Toñito',
    secondary: plateriaConfig.secondaryColor,
    primary: plateriaConfig.primaryColor,
    textColor: plateriaConfig.textColor,
    bgColor: plateriaConfig.bgColor,
    QuienesSomos: 'En plateria online, somos un equipo apasionado por conectar a los amantes de las compras con productos únicos y de calidad. Nuestra misión es ofrecer una plataforma fácil de usar donde los vendedores puedan mostrar sus productos y los compradores puedan descubrir tesoros escondidos. Creemos en el poder de la comunidad y en la importancia de apoyar a los pequeños negocios, por eso nos esforzamos por crear un espacio seguro y amigable para todos. ¡Únete a nosotros y descubre el bazarcito online donde cada compra es una experiencia especial!',
    promos: plateriaConfig.images,
    cellPhone: plateriaConfig.contact.phone,
    heroImage: plateriaConfig.heroImage,
    productsEndpoint: '/api/bazarcito/products?category=plata',
    productMutationBase: '/api/bazarcito/products',
}