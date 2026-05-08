import { Suspense } from 'react'
import ProductsSell from "../components/layout/ProductsSell"
import config from '../demo/plateria-config.json'

export default function PlateriasPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600">Cargando productos...</div>}>
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
                productsEndpoint="/api/bazarcito/products?category=plata"
                productMutationBase="/api/bazarcito/products"
            />
        </Suspense>
    )
}