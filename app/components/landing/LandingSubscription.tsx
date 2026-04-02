import Image from "next/image";

export default function LandingSubscription() {
    return (
        <div className="relative min-h-screen bg-gray-950 text-white pt-24 md:pt-0">
            {/* LOGO */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 md:left-6 md:translate-x-0 z-50">
                <div className="w-24 h-24 md:w-28 md:h-28 lg:w-[150px] lg:h-[150px] relative">
                    <Image
                        src="/logo.png"
                        alt="Intelligence logo"
                        width={100}
                        height={100}
                        className="object-contain w-full h-full block"
                    />
                </div>
            </div>
            {/* HERO */}
            <section className="text-center py-20 px-6 md:pl-28 lg:pl-6">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                    Impulsa tu negocio con diseño y tecnología
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                    Accede a diseño profesional y soluciones digitales sin gastar de más.
                </p>
                <div className="mb-6">
                    <p className="text-2xl font-semibold text-purple-400">
                        Primer mes: $999 MXN
                    </p>
                    <p className="text-gray-400">
                        Después $150 MXN / mes
                    </p>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold transition w-full md:w-auto">
                    Comenzar ahora
                </button>
            </section>

            {/* SERVICIOS */}
            <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 md:px-8 py-8 max-w-6xl mx-auto">
                {[
                    "Tu negocio en línea",
                    "Posts para redes sociales",
                    "Landing pages",
                    "Diseño de logotipos",
                    "Soporte y ajustes",
                    "Entrega rápida"
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-gray-900 p-6 rounded-2xl shadow-md hover:scale-105 transition"
                    >
                        <p className="text-lg">{item}</p>
                    </div>
                ))}
            </section>

            {/* BENEFICIOS */}
            <section className="text-center py-16 px-6">
                <h2 className="text-3xl font-bold mb-6">¿Por qué elegirnos?</h2>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    <p>💰 Ahorra dinero en diseño</p>
                    <p>⚡ Entrega rápida</p>
                    <p>📈 Mejora tu imagen profesional</p>
                </div>
            </section>

            {/* PRECIO */}
            <section className="text-center py-16 bg-gray-900 px-6">
                <h2 className="text-3xl font-bold mb-6">Plan mensual</h2>

                <div className="bg-gray-950 p-8 rounded-2xl w-full md:inline-block mx-auto md:max-w-md">
                    <p className="text-2xl text-purple-400 mb-2">
                        $999 primer mes
                    </p>
                    <p className="text-gray-400 mb-4">
                        Luego $150 / mes
                    </p>

                    <ul className="text-left mb-6 space-y-2">
                        <li>✔ Sin contratos</li>
                        <li>✔ Cancela cuando quieras</li>
                        <li>✔ Soporte incluido</li>
                    </ul>

                    <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold transition w-full md:w-auto">
                        Suscribirme ahora
                    </button>
                </div>
            </section>

            {/* CTA FINAL */}
            <section className="text-center py-20 px-6 md:px-8">
                <h2 className="text-3xl font-bold mb-4">
                    Empieza hoy mismo 🚀
                </h2>

                <p className="text-gray-400 mb-6">
                    Mejora la imagen de tu negocio desde hoy
                </p>

                <button className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-xl font-semibold transition w-full md:w-auto">
                    Quiero mi suscripción
                </button>
            </section>

            {/* FOOTER */}
            <footer className="text-center py-6 text-gray-500 text-sm">
                © 2026 Tu Marca - Todos los derechos reservados
            </footer>
        </div>
    );
}