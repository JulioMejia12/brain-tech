import ProductsSell from "../components/layout/ProductsSell"
import config from '../demo/plateria-config.json'

async function fetchProductsForPlateria() {
    const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    const url = new URL('/api/bazarcito/products?category=plata', base).toString()
    const res = await fetch(url)
    if (!res.ok) return []
    const body = await res.json()
    return (body.data || []).map((it: any) => ({
        id: String(it.id),
        name: it.title || it.name || '',
        price: typeof it.price === 'number' ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(it.price) : String(it.price || ''),
        image: it.image || '/placeholder.png',
        description: it.description || '',
        category: it.category?.name || 'Otros',
    }))
}

const page = () => {
    return (
        <ProductsSell
            title='Plateria Toñito'
            secondary={config.secondaryColor}
            primary={config.primaryColor}
            textColor={config.textColor}
            bgColor={config.bgColor}
            QuienesSomos="En plateria online, somos un equipo apasionado por conectar a los amantes de las compras con productos únicos y de calidad. Nuestra misión es ofrecer una plataforma fácil de usar donde los vendedores puedan mostrar sus productos y los compradores puedan descubrir tesoros escondidos. Creemos en el poder de la comunidad y en la importancia de apoyar a los pequeños negocios, por eso nos esforzamos por crear un espacio seguro y amigable para todos. ¡Únete a nosotros y descubre el bazarcito online donde cada compra es una experiencia especial!"
            promos={config.images}
            cellPhone={config.contact.phone}
            heroImage={config.heroImage}
        />
    )
}

export default page