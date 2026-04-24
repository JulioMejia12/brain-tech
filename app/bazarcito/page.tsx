'use client'
import ProductsSell from '../components/layout/ProductsSell'
import { bazarcitoProducts } from '../lib/products';
const promociones = [
    'https://betterware.com.mx/cdn/shop/files/banner-cooler-mar26-mobile_900x.png?v=1774614976',
    'https://betterware.com.mx/cdn/shop/files/vitrolux-abril26-mobile_3000x.png?v=1774611821',
];

const primary = '#ff81e3'
const secondary = '#2e1227'
const textColor = '#fff'
const bgColor = '#ffb6ef'
const cell = '5571906152'

const page = () => {
    return (
        <ProductsSell
            title='Bazarcito online'
            secondary={secondary}
            primary={primary}
            textColor={textColor}
            bgColor={bgColor}
            QuienesSomos="En Bazarcito Online, somos un equipo apasionado por conectar a los amantes de las compras con productos únicos y de calidad. Nuestra misión es ofrecer una plataforma fácil de usar donde los vendedores puedan mostrar sus productos y los compradores puedan descubrir tesoros escondidos. Creemos en el poder de la comunidad y en la importancia de apoyar a los pequeños negocios, por eso nos esforzamos por crear un espacio seguro y amigable para todos. ¡Únete a nosotros y descubre el bazarcito online donde cada compra es una experiencia especial!"
            promos={promociones}
            cellPhone={cell}
            heroImage="/bazar4.jpeg"
            products={bazarcitoProducts}
        >
            <section id="vender" className="max-w-4xl mx-auto px-4 lg:px-0 py-6">
                <h2 className="text-2xl font-bold mb-4" style={{ color: secondary }}>¿Quieres vender nuestros productos?</h2>
                <p className="text-gray-700 text-base mb-4">
                    Si estás interesado en convertirte en distribuidor de  Betterware.
                </p>
                <button
                    onClick={() => window.open(`https://wa.me/${cell}?text=Hola,%20estoy%20interesado%20en%20vender%20sus%20productos`, '_blank')}
                    className="px-4 py-2 rounded text-white"
                    style={{ background: primary }}
                >
                    Contáctanos por WhatsApp
                </button>
            </section>
        </ProductsSell>
    )
}

export default page