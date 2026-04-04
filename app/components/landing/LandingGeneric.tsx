
import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingGeneric() {
    const whatsappLink = "https://wa.me/5210000000000?text=Hola%2C%20quiero%20mi%20catalogo%20digital";
    const heroMockupSrc = "/eats.jpeg";
    const premiumMedium = "rounded-xl px-7 py-3 text-base font-bold transition hover:opacity-90 bg-[#16A34A] text-white shadow-sm dark:bg-[#F59E0B] dark:text-[#111827]";
    const premiumWide = "rounded-xl px-6 py-3 font-bold transition hover:opacity-90 bg-[#16A34A] text-white shadow-sm dark:bg-[#F59E0B] dark:text-[#111827]";
    const techSmall = "rounded-xl border border-[#16A34A] bg-transparent px-4 py-2 text-sm font-semibold text-[#16A34A] transition hover:bg-[#16A34A]/10 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/15";
    const techWide = "rounded-xl border border-[#16A34A] bg-transparent px-6 py-3 font-bold text-[#16A34A] transition hover:bg-[#16A34A]/10 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/15";

    const industries = [
        "Restaurantes",
        "Tiendas",
        "Spas y Salones",
        "Gimnasios",
        "Hoteles y hospedaje",
        "Eventos y banquetes",
        "Educación y cursos",
        "Salud y bienestar",
        "Automotriz",
    ];

    const problems = [
        { title: "no hay fotos de tus productos", icon: "📸" },
        { title: "Dificultad para actualizar ofertas", icon: "🔧" },
        { title: "Falta de visibilidad online", icon: "🔍" },
    ];

    const benefits = [
        "Negocio profesional.",
        "fotos de tus productos y servicios.",
        "Promociones, reservas y enlaces de pago.",
        "contacto directo con tus clientes.",
        "disponibilidad 24/7.",
    ];

    const process = [
        { step: "1", title: "Envíanos tu catálogo", desc: "Recibimos tu lista de productos/servicios." },
        { step: "2", title: "Personalizamos", desc: "Diseño con colores y estructura de tu marca." },
        { step: "3", title: "Publicamos y entregamos", desc: "QR listo, enlace y material para uso." },
        { step: "4", title: "Soporte continuo", desc: "Cambios fáciles desde tu panel o por WhatsApp." },
    ];

    const faqs = [
        { q: "Esto sirve para mi negocio?", a: "Sí — lo adaptamos a comidas, productos, servicios y reservas." },
        { q: "Se puede incluir en mi suscripción mensual?", a: "Sí — ofrecemos la opción de añadirlo como complemento o incluirlo en planes seleccionados." },
        { q: "Puedo gestionar varios locales?", a: "Sí — soportamos múltiples ubicaciones y variantes por sucursal." },
    ];

    return (
        <div id="inicio" className="min-h-screen bg-[#FFFFFF] text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF]">
            <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-12 lg:px-8">
                <header className="mb-8 flex items-center justify-between">
                    <Image
                        src="/logo.png"
                        alt="Marca"
                        width={110}
                        height={110}
                        className="h-16 w-16 object-contain sm:h-20 sm:w-20"
                    />
                    <div className="flex items-center gap-3">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className={techSmall}
                        >
                            Contactanos
                        </a>
                        <ThemeToggle />
                    </div>
                </header>

                <section className="relative overflow-hidden rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] p-8 text-[#111827] shadow-xl sm:p-10 lg:p-12 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B] dark:text-[#FFFFFF]">
                    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#16A34A]/10 blur-2xl dark:bg-[#F59E0B]/10" />
                    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#16A34A]/10 blur-2xl dark:bg-[#F59E0B]/10" />

                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                        <div>
                            <p className="mb-2 inline-block rounded-full bg-[#16A34A]/20 px-3 py-1 text-xs font-semibold tracking-wide text-[#111827] dark:bg-[#F59E0B]/25 dark:text-[#FFFFFF]">
                                PARA CUALQUIER NEGOCIO QUE QUIERA CRECER
                            </p>
                            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                                Consigue más clientes y vende en internet sin complicarte
                            </h1>
                            <p className="mt-4 text-base text-[#111827] sm:text-lg dark:text-[#FFFFFF]">
                                Ya sea que vendas productos, servicios o experiencias, te ayudamos a conseguir clientes en línea fácilmente.
                            </p>
                            <p className="mt-3 inline-flex items-center rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/20 px-3 py-1 text-xs font-bold tracking-wide text-[#92400E] dark:text-[#FEF3C7] sm:text-sm">
                                Promoción por lanzamiento
                            </p>
                            <div className="mt-7 flex items-center gap-3">
                                <button className={premiumMedium}>
                                    Crear mi negocio online
                                </button>
                                <a href="/demo" className={techWide}>
                                    Ver ejemplo real
                                </a>
                            </div>
                            <div className="mt-6 text-sm text-[#111827] dark:text-[#FFFFFF]">
                                <strong>Ejemplos:</strong> {industries.join(' · ')}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-3 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                            <div className="relative overflow-hidden rounded-xl bg-[#F9FAFB] dark:bg-[#1E293B]">
                                <Image
                                    src={heroMockupSrc}
                                    alt="Mockup"
                                    width={700}
                                    height={500}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                            <p className="mt-3 text-center text-sm font-semibold">Acceso inmediato desde cualquier celular, computadora o tablet</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl bg-[#F9FAFB] px-6 py-10 shadow-sm dark:bg-[#1E293B]">
                    <h2 className="text-center text-3xl font-extrabold">Problemas comunes que resolvemos</h2>
                    <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {problems.map((item) => (
                            <article key={item.title} className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-6 text-center dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/15 text-3xl dark:bg-[#F59E0B]/20">
                                    <span>{item.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="mt-8 rounded-3xl bg-[#F9FAFB] px-6 py-10 dark:bg-[#1E293B]">
                    <h2 className="text-center text-3xl font-extrabold">Beneficios</h2>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2">
                        {benefits.map((b) => (
                            <div key={b} className="rounded-xl border border-[#111827]/10 bg-[#FFFFFF] p-5 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                                <p className="font-semibold">{b}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="planes" className="mt-8 grid gap-6 rounded-3xl bg-[#F9FAFB] p-6 shadow-sm dark:bg-[#1E293B] md:grid-cols-[0.9fr_1.1fr] md:p-8">
                    <div className="md:col-span-2 rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] p-5 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                        <h2 className="text-2xl font-extrabold sm:text-3xl">Cómo se integra a tu suscripción</h2>
                        <p className="mt-4 text-sm text-[#111827] dark:text-[#FFFFFF]">Ofrecemos dos opciones:</p>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>• Añadido como complemento mensual a tu plan actual (gestión continua y soporte).</li>
                            <li>• Integrado en planes superiores sin costo adicional de activación.</li>
                        </ul>
                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            {process.map((p) => (
                                <article key={p.title} className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                                    <div className="flex items-center gap-2">
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A]/12 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">{p.step}</span>
                                        <div>
                                            <p className="text-sm font-semibold">{p.title}</p>
                                            <p className="text-xs text-[#374151] dark:text-[#9CA3AF]">{p.desc}</p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>

                    <article className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-6 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                        <h2 className="text-3xl font-extrabold">Plan Complemento</h2>
                        <p className="mt-3 inline-flex rounded-md bg-[#16A34A]/10 px-3 py-1 text-xs font-semibold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">Ideal para pequeños negocios</p>
                        <ul className="mt-6 space-y-3 text-sm sm:text-base">
                            <li>✔ Catálogo digital personalizado</li>
                            <li>✔ QR y enlace público</li>
                            <li>✔ Soporte y actualizaciones mensuales</li>
                        </ul>
                        <div className="mt-6 border-t border-[#111827]/10 pt-5 dark:border-[#FFFFFF]/15">
                            <p className="text-4xl font-extrabold">$499</p>
                            <p className="text-sm text-[#111827] dark:text-[#FFFFFF]">activación única opcional</p>
                            <p className="mt-1 text-2xl font-bold text-[#16A34A] dark:text-[#F59E0B]">$349 / mes</p>
                        </div>
                        <button className={`mt-6 w-full ${premiumWide}`}>Añadir a mi suscripción</button>
                    </article>
                </section>

                <section className="mt-8 rounded-3xl bg-[#F9FAFB] px-6 py-8 shadow-sm dark:bg-[#1E293B]">
                    <h2 className="text-center text-3xl font-extrabold">Preguntas frecuentes</h2>
                    <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {faqs.map((f) => (
                            <div key={f.q} className="rounded-xl border border-[#111827]/10 bg-[#FFFFFF] p-4 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                                <p className="font-semibold">{f.q}</p>
                                <p className="mt-2 text-sm text-[#374151] dark:text-[#9CA3AF]">{f.a}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <footer className="mt-10 py-4 text-center text-sm text-[#111827] dark:text-[#FFFFFF]">© 2026 Tu Marca. Soluciones digitales para todos los negocios.</footer>
            </div>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 sm:bottom-6"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
                </svg>
                Escríbenos
            </a>
        </div>
    );
}