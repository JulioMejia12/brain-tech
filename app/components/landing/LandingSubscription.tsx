import Image from "next/image";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function LandingSubscription() {
    const whatsappLink = "https://wa.me/5210000000000?text=Hola%2C%20quiero%20mi%20menu%20digital";
    const heroMockupSrc = "/markus-winkler-Q6uqw_Hjye8-unsplash.jpg";
    const premiumMedium = "rounded-xl px-7 py-3 text-base font-bold transition hover:opacity-90 bg-[#16A34A] text-white shadow-sm dark:bg-[#F59E0B] dark:text-[#111827]";
    const premiumWide = "rounded-xl px-6 py-3 font-bold transition hover:opacity-90 bg-[#16A34A] text-white shadow-sm dark:bg-[#F59E0B] dark:text-[#111827]";
    const techSmall = "rounded-xl border border-[#16A34A] bg-transparent px-4 py-2 text-sm font-semibold text-[#16A34A] transition hover:bg-[#16A34A]/10 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/15";
    const techWide = "rounded-xl border border-[#16A34A] bg-transparent px-6 py-3 font-bold text-[#16A34A] transition hover:bg-[#16A34A]/10 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/15";

    const stats = [
        { label: "Restaurantes activos", value: "+120" },
        { label: "Tiempo promedio de entrega", value: "24 h" },
        { label: "Soporte por WhatsApp", value: "7 dias" },
    ];

    const problems = [
        { title: "Cartas sucias y viejas", icon: "🍽" },
        { title: "Difícil cambiar precios", icon: "💲" },
        { title: "Clientes preguntan todo", icon: "💬" },
    ];

    const solution = [
        { title: "Código QR en la mesa", desc: "Cada mesa con su acceso instantáneo al menú.", image: "/solution-1.jpg" },
        { title: "Tus clientes escanean", desc: "Sin apps ni descargas. Solo cámara y listo.", image: "/solution-2.jpg" },
        { title: "Menú siempre actualizado", desc: "Cambia precios y platillos cuando quieras.", image: "/solution-3.jpg" },
    ];

    const benefits = [
        "Edita precios en minutos sin reimprimir.",
        "Incluye fotos, promociones y sugerencias del chef.",
        "Menú optimizado para celular con carga rapida.",
        "Panel simple para actualizar categorias y productos.",
    ];

    const process = [
        { step: "1", title: "Diagnostico rapido", desc: "Recibimos tu menu actual y estructura del restaurante." },
        { step: "2", title: "Diseño y configuracion", desc: "Personalizamos el menu digital con tu marca y categorias." },
        { step: "3", title: "Entrega y activacion", desc: "Te compartimos QR listo para imprimir y usar en mesas." },
        { step: "4", title: "Acompanamiento", desc: "Soporte para cambios, promociones y nuevas secciones." },
    ];

    const faqs = [
        {
            q: "Cuanto tarda en quedar funcionando?",
            a: "Normalmente entre 24 y 48 horas dependiendo del volumen del menu.",
        },
        {
            q: "Necesito una app para mis clientes?",
            a: "No. Ellos solo escanean el QR con la camara del celular.",
        },
        {
            q: "Puedo cambiar precios o productos despues?",
            a: "Si. Incluye soporte para actualizaciones y ajustes frecuentes.",
        },
    ];

    return (
        <div id="inicio" className="min-h-screen bg-[#FFFFFF] text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF]">
            <div className="mx-auto max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-12 lg:px-8">
                <header className="mb-8 flex items-center justify-between">
                    <Image
                        src="/logo.png"
                        alt="Brain Tech"
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

                <div className="mb-4 sm:hidden">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 bg-[#16A34A]/10 px-3 py-1.5 text-xs font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                        <span className="h-2 w-2 rounded-full bg-[#16A34A] dark:bg-[#F59E0B]" />
                        Abierto ahora · 1:00 PM - 11:00 PM
                    </span>
                </div>

                <section className="relative overflow-hidden rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] p-8 text-[#111827] shadow-xl sm:p-10 lg:p-12 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B] dark:text-[#FFFFFF]">
                    <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-[#16A34A]/10 blur-2xl dark:bg-[#F59E0B]/10" />
                    <div className="absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-[#16A34A]/10 blur-2xl dark:bg-[#F59E0B]/10" />

                    <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                        <div>
                            <p className="mb-2 inline-block rounded-full bg-[#16A34A]/20 px-3 py-1 text-xs font-semibold tracking-wide text-[#111827] dark:bg-[#F59E0B]/25 dark:text-[#FFFFFF]">
                                PARA RESTAURANTES
                            </p>
                            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
                                Digitaliza tu menú en 24 horas
                            </h1>
                            <p className="mt-4 text-base text-[#111827] sm:text-lg dark:text-[#FFFFFF]">
                                Sin apps · Sin contacto · Fácil de actualizar
                            </p>
                            <p className="mt-3 inline-flex items-center rounded-full border border-[#F59E0B]/35 bg-[#F59E0B]/20 px-3 py-1 text-xs font-bold tracking-wide text-[#92400E] dark:text-[#FEF3C7] sm:text-sm">
                                Precio especial por lanzamiento
                            </p>
                            <div className="mt-7 flex items-center gap-3">
                                <button className={premiumMedium}>
                                    Empezar hoy
                                </button>
                                <a href="/demo" className={techWide}>
                                    Ver demo
                                </a>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-3 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                            <div className="relative overflow-hidden rounded-xl bg-[#F9FAFB] dark:bg-[#1E293B]">
                                <Image
                                    src={heroMockupSrc}
                                    alt="Mockup de telefono con menu QR"
                                    width={700}
                                    height={500}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                            <p className="mt-3 text-center text-sm font-semibold">Escanea tu menu y visualiza al instante</p>
                        </div>
                    </div>
                </section>

                <section className="mt-8 rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] px-6 py-6 shadow-sm dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <article className="rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                            <p className="text-sm font-bold sm:text-base">+15 menús creados</p>
                        </article>
                        <article className="rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                            <p className="text-sm font-bold sm:text-base">Restaurantes en CDMX ya lo usan</p>
                        </article>
                    </div>
                </section>

                <section id="problemas" className="mt-10 rounded-3xl bg-[#F9FAFB] px-6 py-10 shadow-sm dark:bg-[#1E293B]">
                    <h2 className="text-center text-3xl font-extrabold">
                        Los Problemas del Menú Físico
                    </h2>
                    <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {problems.map((item) => (
                            <article
                                key={item.title}
                                className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-6 text-center dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]"
                            >
                                <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#16A34A]/15 text-3xl dark:bg-[#F59E0B]/20">
                                    <span>{item.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                            </article>
                        ))}
                    </div>
                </section>

                <section id="solucion" className="mt-8 rounded-3xl bg-[#F9FAFB] px-6 py-10 dark:bg-[#1E293B]">
                    <h2 className="text-center text-3xl font-extrabold">
                        Nuestra Solución
                    </h2>
                    <div className="mt-8 grid gap-5 sm:grid-cols-3">
                        {solution.map((item, index) => (
                            <article
                                key={item.title}
                                className="rounded-2xl bg-[#F9FAFB] p-5 shadow-sm dark:bg-[#1E293B]"
                            >
                                <div className="relative mb-4 aspect-square w-full overflow-hidden rounded-xl">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <h3 className="text-lg font-semibold">{item.title}</h3>
                                <p className="mt-2 text-sm text-[#111827] dark:text-[#FFFFFF]">{item.desc}</p>
                                <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#16A34A] dark:text-[#F59E0B]">
                                    Paso {index + 1}
                                </p>
                            </article>
                        ))}
                    </div>
                    <div className="mt-8 rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] p-5 text-center dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                        <p className="text-base font-semibold sm:text-lg">Mira cómo se ve un menú real</p>
                        <a href="/demo" className={`mt-4 inline-flex ${premiumWide}`}>
                            Ver demo en vivo
                        </a>
                    </div>
                </section>

                <section id="planes" className="mt-8 grid gap-6 rounded-3xl bg-[#F9FAFB] p-6 shadow-sm dark:bg-[#1E293B] md:grid-cols-[0.9fr_1.1fr] md:p-8">
                    <div className="md:col-span-2 rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] p-5 dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                        <h2 className="text-2xl font-extrabold sm:text-3xl">¿Cómo funciona?</h2>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A]/12 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                            <path d="M4 12h16" />
                                            <path d="M4 7h16" />
                                            <path d="M4 17h10" />
                                        </svg>
                                    </span>
                                    <p className="text-sm font-semibold sm:text-base">Nos mandas tu menú</p>
                                </div>
                            </article>
                            <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A]/12 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                            <path d="M5 12h14" />
                                            <path d="M12 5v14" />
                                        </svg>
                                    </span>
                                    <p className="text-sm font-semibold sm:text-base">Lo digitalizamos</p>
                                </div>
                            </article>
                            <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-4 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                                <div className="flex items-center gap-2">
                                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16A34A]/12 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-4 w-4">
                                            <rect x="4" y="4" width="6" height="6" />
                                            <rect x="14" y="4" width="6" height="6" />
                                            <rect x="4" y="14" width="6" height="6" />
                                            <path d="M14 14h2v2h-2zM18 14h2v2h-2zM14 18h6" />
                                        </svg>
                                    </span>
                                    <p className="text-sm font-semibold sm:text-base">Te entregamos tu QR listo</p>
                                </div>
                            </article>
                        </div>
                    </div>

                    <div className="md:col-span-2 rounded-2xl border border-[#111827]/10 bg-[#FFFFFF] p-5 text-center dark:border-[#FFFFFF]/15 dark:bg-[#0F172A]">
                        <p className="text-base font-semibold sm:text-lg">Así lo verán tus clientes desde su celular</p>
                        <a href="/demo" className={`mt-4 inline-flex ${techWide}`}>
                            Ver demo
                        </a>
                    </div>

                    <article className="rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-6 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                        <h2 className="text-3xl font-extrabold">Plan Básico</h2>
                        <p className="mt-3 inline-flex rounded-md bg-[#16A34A]/10 px-3 py-1 text-xs font-semibold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                            Precio especial por lanzamiento
                        </p>
                        <ul className="mt-6 space-y-3 text-sm sm:text-base">
                            <li>✔ Menú digital QR</li>
                            <li>✔ Código QR personalizado</li>
                            <li>✔ Soporte incluido</li>
                        </ul>
                        <div className="mt-6 border-t border-[#111827]/10 pt-5 dark:border-[#FFFFFF]/15">
                            <p className="text-4xl font-extrabold">$499</p>
                            <p className="text-sm text-[#111827] dark:text-[#FFFFFF]">instalación única</p>
                            <p className="mt-1 text-2xl font-bold text-[#16A34A] dark:text-[#F59E0B]">$99 / mes</p>
                        </div>
                        <button className={`mt-6 w-full ${premiumWide}`}>
                            Empezar Ahora
                        </button>
                    </article>

                    <article className="flex flex-col justify-center rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-6 dark:border-[#FFFFFF]/15 dark:bg-[#1E293B]">
                        <h2 className="text-3xl font-extrabold">Listo para digitalizar tu restaurante?</h2>
                        <p className="mt-3 text-[#111827] dark:text-[#FFFFFF]">Empieza hoy, sin complicaciones.</p>
                        <button className={`mt-6 sm:w-fit ${techWide}`}>
                            Pedir mi menú digital
                        </button>
                        <p className="mt-6 text-sm font-medium text-[#111827] dark:text-[#FFFFFF]">
                            WhatsApp: respuesta rápida para resolver tus dudas.
                        </p>
                    </article>
                </section>

                <footer className="mt-10 py-4 text-center text-sm text-[#111827] dark:text-[#FFFFFF]">
                    © 2026 Brain Tech. El arte de conectarnos.
                </footer>
            </div>

            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#111827]/10 bg-[#F9FAFB]/95 px-2 py-2 backdrop-blur dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]/95 sm:hidden">
                <div className="grid grid-cols-4 gap-1">
                    <a href="#inicio" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
                        Inicio
                    </a>
                    <a href="#problemas" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
                        Problemas
                    </a>
                    <a href="#solucion" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
                        Solucion
                    </a>
                    <a href="#planes" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
                        Planes
                    </a>
                </div>
            </nav>

            <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 sm:bottom-6"
            >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
                </svg>
                ¿Dudas? Escríbenos
            </a>
        </div>
    );
}