import Barberias from "../components/layout/Barberias"
import config from '../demo/barberias-config.json'

const page = () => {
    return (
        <Barberias
            logo={config.logo}
            title={config.name}
            primary={config.primaryColor}
            secondary={config.secondaryColor}
            textColor={config.textColor}
            heroImage={config.heroImage}
            whatsappNumber={config.contact?.phone}
            about={config.about}
            services={config.services}
            background="bg-gradient-to-r from-gray-100 to-gray-200"
        >
            {/* <div>
                <h2 className="text-3xl font-bold text-center mt-12 mb-6">Reseñas de Clientes</h2>
                <div className="max-w-4xl mx-auto space-y-6 px-4 lg:px-0">
                    <div className="bg-white rounded-lg shadow p-6 overflow-hidden">
                        <p className="text-gray-600 mb-4 whitespace-normal break-words">&quot;Me encanta venir aquí, siempre salgo satisfecho con mi corte. El ambiente es genial y los precios son justos.&quot;</p>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold flex-shrink-0" style={{ backgroundColor: '#c18b27', color: '#fff' }}>
                                MG
                            </div>
                            <div>
                                <p className="font-semibold text-lg" style={{ color: '#e5b65d' }}>María Gómez</p>
                                <p className="text-sm text-gray-500">Cliente desde 2021</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            {/* info extra */}
            {/* <div>
                <h2 className="text-3xl font-bold text-center mt-12 mb-6">Nuestros cortes mas pedidos</h2>
                <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-4 lg:px-0">
                    <img src="/image.jpeg" alt="Corte 1" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    <img src="/image2.jpeg" alt="Corte 2" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    <img src="/image3.jpeg" alt="Corte 3" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    <img src="/hero-barber.jpeg" alt="Corte 4" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    <img src="/image2.jpeg" alt="Corte 2" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                    <img src="/image3.jpeg" alt="Corte 3" className="w-full h-40 sm:h-48 md:h-56 object-cover rounded-lg shadow" />
                </div>
            </div> */}
        </Barberias>
    )
}

export default page