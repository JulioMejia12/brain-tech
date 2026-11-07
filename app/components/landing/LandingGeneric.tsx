import Image from "next/image";
import Link from "next/link";

const rawWhatsapp =
    process.env.NEXT_PUBLIC_LANDING_WHATSAPP ||
    process.env.NUMBER_BAZARCITO ||
    "";
const whatsappDigits = rawWhatsapp.replace(/\D/g, "");
const whatsappLink = whatsappDigits
    ? `https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hola, quiero información para digitalizar mi negocio.")}`
    : "#planes";

const demoLinks = [
    {
        name: "Bazarcito",
        category: "Tienda",
        description: "Productos, fotos y venta directa desde el celular.",
        href: "/bazarcito",
        image: "/1.jpeg",
    },
    {
        name: "Cremería",
        category: "Abarrotes",
        description: "Catálogo de productos lácteos, abarrotes y más.",
        href: "/cremeria",
        image: "/3.jpeg",
    },
    {
        name: "Marrón",
        category: "Hogar",
        description: "Productos para el hogar y novedades cada día.",
        href: "/marron",
        image: "/2.jpeg",
    },
];

const problems = [
    {
        title: "Solo vives en redes sociales",
        description: "Tus publicaciones se pierden y no tienes un lugar propio para mostrar lo que vendes.",
    },
    {
        title: "Te preguntan lo mismo todo el día",
        description: "Precios, horarios y disponibilidad. Sin un catálogo claro, respondes una y otra vez.",
    },
    {
        title: "No apareces en Google",
        description: "Tus clientes buscan tu negocio en internet y terminan encontrando a la competencia.",
    },
    {
        title: "Dependes de terceros",
        description: "Comisiones, algoritmos y reglas que cambian sin avisar. Tu negocio merece su propio espacio.",
    },
];

const features = [
    {
        title: "Catálogo digital",
        description: "Productos, precios, fotos y promociones en una página rápida, clara y fácil de navegar.",
        icon: "M4 6h16M4 12h16M4 18h10",
    },
    {
        title: "Pedidos por WhatsApp",
        description: "Tus clientes eligen y te escriben con el pedido listo. Sin comisiones ni intermediarios.",
        icon: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    },
    {
        title: "Panel de administración",
        description: "Actualiza precios, stock y fotos cuando quieras, sin depender de nadie.",
        icon: "M4 5h16v14H4zM4 10h16M10 10v9",
    },
];

const steps = [
    {
        number: "01",
        title: "Platícanos de tu negocio",
        description: "Nos dices qué vendes, cómo quieres verte y qué necesitas mostrar.",
    },
    {
        number: "02",
        title: "Creamos tu página",
        description: "Configuramos tu catálogo, tus colores, tus productos y tu página.",
    },
    {
        number: "03",
        title: "Empieza a recibir clientes",
        description: "Comparte tu enlace y recibe pedidos por WhatsApp desde el primer día.",
    },
];

const included = [
    "Página profesional para tu negocio",
    "Catálogo de productos o servicios",
    "Enlace listo para compartir",
    "Pedidos directos por WhatsApp",
    "Panel para actualizar tu contenido",
    "Soporte para dudas y cambios",
];

const faqs = [
    {
        question: "¿Necesito saber de tecnología?",
        answer: "No. Nosotros configuramos todo por ti. Tú solo nos compartes la información de tu negocio y nosotros dejamos tu página lista para usar.",
    },
    {
        question: "¿Cuánto tarda en estar lista?",
        answer: "Normalmente tu perfil queda listo en aproximadamente 7 días, dependiendo de la información y las fotos que nos compartas.",
    },
    {
        question: "¿Funciona para mi tipo de negocio?",
        answer: "Sí. Funciona para restaurantes, tiendas, barberías, estéticas, servicios profesionales y cualquier negocio local que quiera mostrar su catálogo.",
    },
    {
        question: "¿Puedo actualizar precios y productos?",
        answer: "Sí. Tendrás acceso a un panel sencillo para cambiar precios, fotos, productos y disponibilidad cuando lo necesites.",
    },
    {
        question: "¿Hay algún contrato forzoso?",
        answer: "No. Puedes cancelar cuando quieras. Queremos que tu negocio crezca porque el servicio funciona, no porque estés atado a un contrato.",
    },
    {
        question: "¿Cómo recibo los pedidos?",
        answer: "Tus clientes te escriben directamente por WhatsApp con el pedido listo. Sin comisiones y sin intermediarios.",
    },
];

function ArrowIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function CheckIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4" aria-hidden="true">
            <path d="m5 12 4 4L19 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function WhatsAppIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
        </svg>
    );
}

export default function LandingGeneric() {
    return (
        <main id="inicio" className="min-h-screen overflow-x-hidden bg-[#060a08] text-white selection:bg-[var(--primary)] selection:text-black">
            <header className="sticky top-0 z-50 border-b border-white/10 bg-[#060a08]/85 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
                    <Link href="#inicio" className="flex items-center gap-2.5" aria-label="LocalHub, ir al inicio">
                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--primary)] text-sm font-black text-black shadow-lg shadow-[var(--primary)]/20">
                            L
                        </span>
                        <span className="text-base font-bold tracking-tight">LocalHub</span>
                    </Link>

                    <nav className="hidden items-center gap-7 text-sm text-white/55 md:flex" aria-label="Navegación principal">
                        <Link href="#solucion" className="transition hover:text-white">Solución</Link>
                        <Link href="#demos" className="transition hover:text-white">Ejemplos</Link>
                        <Link href="#planes" className="transition hover:text-white">Precio</Link>
                        <Link href="#faq" className="transition hover:text-white">Preguntas</Link>
                    </nav>

                    <div className="flex items-center gap-2 sm:gap-3">
                        <Link
                            href="#demos"
                            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:text-white sm:inline-flex"
                        >
                            Ver demos
                        </Link>
                        <a
                            href={whatsappLink}
                            target={whatsappDigits ? "_blank" : undefined}
                            rel={whatsappDigits ? "noreferrer" : undefined}
                            className="inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-110"
                        >
                            Empezar ahora
                            <ArrowIcon />
                        </a>
                    </div>
                </div>
            </header>

            <section className="relative overflow-hidden">
                <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[var(--primary)]/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--primary)]/60 to-transparent" />

                <div className="relative mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-14 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-8 lg:pb-28 lg:pt-24">
                    <div>
                        <span className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/25 bg-[var(--primary)]/10 px-3 py-1.5 text-xs font-semibold text-[var(--primary)]">
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--primary)]" />
                            Para negocios que quieren crecer
                        </span>

                        <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-balance sm:text-5xl lg:text-6xl">
                            Tu negocio en internet, <span className="text-[var(--primary)]">sin complicaciones</span>
                        </h1>

                        <p className="mt-6 max-w-xl text-base leading-8 text-white/65 sm:text-lg">
                            Creamos tu página profesional con catálogo, pedidos por WhatsApp y un enlace listo para compartir. Empieza a recibir clientes desde el primer día, sin conocimientos técnicos.
                        </p>

                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <a
                                href={whatsappLink}
                                target={whatsappDigits ? "_blank" : undefined}
                                rel={whatsappDigits ? "noreferrer" : undefined}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-[var(--primary)]/20 transition hover:-translate-y-0.5 hover:brightness-110"
                            >
                                Quiero mi negocio online
                                <ArrowIcon />
                            </a>
                            <Link
                                href="#demos"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/85 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                            >
                                Ver ejemplos reales
                            </Link>
                        </div>

                        <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-6">
                            <div>
                                <dt className="text-xs font-medium text-white/45">Listo en</dt>
                                <dd className="mt-1 text-xl font-black text-white">7 días</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-white/45">Disponible</dt>
                                <dd className="mt-1 text-xl font-black text-white">24/7</dd>
                            </div>
                            <div>
                                <dt className="text-xs font-medium text-white/45">Sin apps</dt>
                                <dd className="mt-1 text-xl font-black text-white">Solo link</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="relative mx-auto w-full max-w-[430px] lg:mr-2">
                        <div className="absolute inset-8 rounded-full bg-[var(--primary)]/20 blur-3xl" />
                        <div className="relative mx-auto w-[78%] rounded-[2.7rem] border border-white/15 bg-[#0b120f] p-2 shadow-2xl shadow-black/70">
                            <div className="relative aspect-[9/18] overflow-hidden rounded-[2.2rem] border border-white/10 bg-white">
                                <Image
                                    src="/1.jpeg"
                                    alt="Catálogo digital de un negocio en el celular"
                                    fill
                                    priority
                                    sizes="(max-width: 640px) 70vw, (max-width: 1024px) 40vw, 330px"
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-black/25" />
                                <div className="absolute inset-x-4 top-4 flex items-center justify-between text-[10px] font-semibold uppercase tracking-widest text-white">
                                    <span>LocalHub</span>
                                    <span className="rounded-full bg-[var(--primary)] px-2 py-1 text-black">En línea</span>
                                </div>
                                <div className="absolute inset-x-4 bottom-4 rounded-2xl border border-white/15 bg-black/55 p-4 backdrop-blur">
                                    <p className="text-sm font-semibold text-white">Mira. Elige. Compra.</p>
                                    <p className="mt-1 text-xs leading-5 text-white/60">
                                        Tus clientes ven productos, precios y pedidos desde el celular.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="absolute -left-1 top-16 rounded-2xl border border-white/15 bg-[#0d1411]/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:-left-4">
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-white/45">Más clientes</p>
                            <p className="mt-0.5 text-sm font-bold text-white">Online 24/7</p>
                        </div>

                        <div className="absolute -right-1 bottom-24 rounded-2xl border border-[var(--primary)]/30 bg-[#0d1411]/90 px-3.5 py-2.5 shadow-xl backdrop-blur sm:-right-4">
                            <p className="flex items-center gap-2 text-sm font-bold text-white">
                                <span className="grid h-7 w-7 place-items-center rounded-full bg-[#25D366] text-white">
                                    <WhatsAppIcon />
                                </span>
                                Pedidos directos
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-y border-white/10 bg-white/[0.02]">
                <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                    <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-white/35">
                        Negocios que ya están en línea
                    </p>
                    <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-white/50">
                        <span>Bazarcito</span>
                        <span>Marrón</span>
                        <span>Cremería</span>
                        <span>Barbería</span>
                        <span>Taquería</span>
                    </div>
                </div>
            </section>

            <section id="problema" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
                <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">El problema</span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            Si no estás en internet, tus clientes te buscan y no te encuentran.
                        </h2>
                        <p className="mt-5 max-w-xl text-base leading-8 text-white/60">
                            Tener redes sociales ya no es suficiente. Un negocio local necesita un lugar propio, profesional y fácil de compartir donde sus clientes puedan ver todo lo que ofrece.
                        </p>
                        <a
                            href={whatsappLink}
                            target={whatsappDigits ? "_blank" : undefined}
                            rel={whatsappDigits ? "noreferrer" : undefined}
                            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[var(--primary)]/40 bg-[var(--primary)]/10 px-5 py-3 text-sm font-bold text-[var(--primary)] transition hover:bg-[var(--primary)]/15"
                        >
                            Quiero cambiar eso
                            <ArrowIcon />
                        </a>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {problems.map((problem) => (
                            <article
                                key={problem.title}
                                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                            >
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-400/10 text-red-300">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
                                        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
                                    </svg>
                                </span>
                                <h3 className="mt-4 text-base font-bold">{problem.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-white/55">{problem.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="solucion" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] py-20 lg:py-28">
                <div className="mx-auto max-w-7xl px-5 sm:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">La solución</span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            Todo lo que tu negocio necesita para vender en línea
                        </h2>
                        <p className="mt-4 text-base leading-7 text-white/60">
                            Una página simple, rápida y pensada para que tus clientes encuentren lo que buscan y te contacten sin fricción.
                        </p>
                    </div>

                    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <article
                                key={feature.title}
                                className="rounded-2xl border border-white/10 bg-[#080d0b] p-5 transition hover:-translate-y-1 hover:border-[var(--primary)]/30"
                            >
                                <span className="grid h-11 w-11 place-items-center rounded-xl bg-[var(--primary)]/10 text-[var(--primary)]">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                                        <path d={feature.icon} strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <h3 className="mt-4 text-base font-bold">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-white/55">{feature.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="demos" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">Ejemplos reales</span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl">
                            Así se ve tu negocio en línea
                        </h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-white/55">
                        Explora demos reales y descubre cómo se adapta la página a diferentes tipos de negocio.
                    </p>
                </div>

                <div className="mt-10 grid gap-5 md:grid-cols-3">
                    {demoLinks.map((demo) => (
                        <Link
                            key={demo.name}
                            href={demo.href}
                            className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-[var(--primary)]/35"
                        >
                            <div className="relative h-56 overflow-hidden sm:h-60">
                                <Image
                                    src={demo.image}
                                    alt={`Demo de ${demo.name}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                    className="object-cover transition duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#060a08] via-black/20 to-transparent" />
                                <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/80 backdrop-blur">
                                    {demo.category}
                                </span>
                            </div>
                            <div className="flex items-end justify-between gap-4 p-5">
                                <div>
                                    <h3 className="text-lg font-bold">{demo.name}</h3>
                                    <p className="mt-1 text-sm text-white/50">{demo.description}</p>
                                </div>
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white/70 transition group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-black">
                                    <ArrowIcon />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

            </section>

            <section id="beneficios" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] py-20 lg:py-28">
                <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">Lo que ganas</span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            Menos fricción. Más clientes. Mejor presencia.
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-8 text-white/60">
                            Tu página trabaja por ti todo el día: muestra tu catálogo, responde las dudas básicas y lleva a tus clientes directo a WhatsApp.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                        {[
                            {
                                title: "Más visibilidad",
                                description: "Tu negocio disponible 24/7, no solo cuando publicas en redes.",
                            },
                            {
                                title: "Menos preguntas",
                                description: "Precios, fotos y disponibilidad claros desde el primer vistazo.",
                            },
                            {
                                title: "Más ventas",
                                description: "Un camino directo del interés al pedido por WhatsApp.",
                            },
                        ].map((benefit, index) => (
                            <article key={benefit.title} className="rounded-2xl border border-white/10 bg-[#080d0b] p-5">
                                <span className="text-3xl font-black text-[var(--primary)]/30">0{index + 1}</span>
                                <h3 className="mt-3 text-base font-bold">{benefit.title}</h3>
                                <p className="mt-2 text-sm leading-6 text-white/55">{benefit.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
                <div className="mx-auto max-w-2xl text-center">
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">Cómo funciona</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                        Empieza en 3 pasos
                    </h2>
                    <p className="mt-4 text-base leading-7 text-white/60">
                        Sin trámites complicados. Nosotros hacemos el trabajo pesado y tú te enfocas en tu negocio.
                    </p>
                </div>

                <div className="relative mt-12 grid gap-5 md:grid-cols-3">
                    <div className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent md:block" />
                    {steps.map((step) => (
                        <article key={step.number} className="relative rounded-2xl border border-white/10 bg-[#080d0b] p-6">
                            <span className="relative z-10 grid h-12 w-12 place-items-center rounded-full border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-sm font-black text-[var(--primary)]">
                                {step.number}
                            </span>
                            <h3 className="mt-5 text-lg font-bold">{step.title}</h3>
                            <p className="mt-2 text-sm leading-6 text-white/55">{step.description}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section id="planes" className="scroll-mt-24 border-y border-white/10 bg-white/[0.02] py-20 lg:py-28">
                <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">Precio de lanzamiento</span>
                        <h2 className="mt-4 text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            Un precio claro, sin sorpresas
                        </h2>
                        <p className="mt-5 max-w-lg text-base leading-8 text-white/60">
                            Todo lo necesario para que tu negocio tenga presencia profesional en internet. Sin costos escondidos ni contratos forzosos.
                        </p>

                        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                            {included.map((item) => (
                                <li key={item} className="flex items-start gap-2.5 text-sm text-white/65">
                                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--primary)]/15 text-[var(--primary)]">
                                        <CheckIcon />
                                    </span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative rounded-3xl border border-[var(--primary)]/30 bg-[#080d0b] p-6 shadow-2xl shadow-[var(--primary)]/5 sm:p-8">
                        <div className="absolute -top-3 left-6 rounded-full bg-[var(--primary)] px-3 py-1 text-[10px] font-black uppercase tracking-wider text-black">
                            Primeros 10 negocios
                        </div>

                        <p className="mt-2 text-sm font-semibold text-white/60">Plan de lanzamiento</p>
                        <div className="mt-3 flex items-end gap-2">
                            <span className="text-5xl font-black tracking-tight">$500</span>
                            <span className="pb-1 text-sm text-white/50">primer mes</span>
                        </div>
                        <p className="mt-1 text-base font-semibold text-white/70">
                            Después <span className="text-[var(--primary)]">$110/mes</span>
                        </p>

                        <div className="my-6 h-px bg-white/10" />

                        <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary)]/[0.06] p-4">
                            <p className="text-sm font-bold text-[var(--primary)]">Bonos de lanzamiento</p>
                            <ul className="mt-3 space-y-2 text-sm text-white/60">
                                <li className="flex items-center gap-2">
                                    <CheckIcon />
                                    Diseño de logotipo
                                </li>
                                <li className="flex items-center gap-2">
                                    <CheckIcon />
                                    Diseño de tarjeta de presentación
                                </li>
                            </ul>
                        </div>

                        <a
                            href={whatsappLink}
                            target={whatsappDigits ? "_blank" : undefined}
                            rel={whatsappDigits ? "noreferrer" : undefined}
                            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3.5 text-sm font-bold text-black transition hover:brightness-110"
                        >
                            Empezar ahora
                            <ArrowIcon />
                        </a>

                        <p className="mt-4 text-center text-xs leading-5 text-white/40">
                            Cancela cuando quieras. Sin contratos forzosos.
                        </p>
                    </div>
                </div>
            </section>

            <section id="faq" className="mx-auto max-w-4xl scroll-mt-24 px-5 py-20 sm:px-8 lg:py-28">
                <div className="text-center">
                    <span className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--primary)]">Preguntas frecuentes</span>
                    <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
                        Resolvemos tus dudas
                    </h2>
                </div>

                <div className="mt-10 space-y-3">
                    {faqs.map((faq) => (
                        <details
                            key={faq.question}
                            className="group rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 transition open:border-[var(--primary)]/30 open:bg-white/[0.05]"
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-sm font-bold text-white/85 sm:text-base [&::-webkit-details-marker]:hidden">
                                {faq.question}
                                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/15 text-lg font-normal text-white/60 transition group-open:rotate-45 group-open:border-[var(--primary)]/40 group-open:text-[var(--primary)]">
                                    +
                                </span>
                            </summary>
                            <p className="pt-3 text-sm leading-7 text-white/55">{faq.answer}</p>
                        </details>
                    ))}
                </div>
            </section>

            <section id="contacto" className="scroll-mt-24 px-5 pb-20 sm:px-8 lg:pb-28">
                <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-[var(--primary)]/25 bg-gradient-to-br from-[var(--primary)]/15 via-[#0a100d] to-[#0a100d] px-6 py-14 text-center sm:px-10 lg:py-20">
                    <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[var(--primary)]/20 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />
                    <div className="relative">
                        <h2 className="mx-auto max-w-2xl text-3xl font-black tracking-tight text-balance sm:text-4xl lg:text-5xl">
                            Tu negocio puede estar en línea esta semana
                        </h2>
                        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/60">
                            Escríbenos, cuéntanos qué vendes y te ayudamos a dar el siguiente paso. Respondemos por WhatsApp.
                        </p>
                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <a
                                href={whatsappLink}
                                target={whatsappDigits ? "_blank" : undefined}
                                rel={whatsappDigits ? "noreferrer" : undefined}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3.5 text-sm font-bold text-black shadow-lg shadow-[var(--primary)]/20 transition hover:-translate-y-0.5 hover:brightness-110"
                            >
                                <WhatsAppIcon />
                                Quiero mi negocio online
                            </a>
                            <Link
                                href="#demos"
                                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 text-sm font-semibold text-white/80 transition hover:border-white/30 hover:bg-white/[0.06] hover:text-white"
                            >
                                Ver demos
                            </Link>
                        </div>
                        <p className="mt-5 text-xs text-white/35">
                            Ideal para restaurantes, tiendas, barberías, estéticas y servicios profesionales.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="border-t border-white/10">
                <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[var(--primary)] text-xs font-black text-black">
                            L
                        </span>
                        <span className="text-sm font-bold">LocalHub</span>
                    </div>
                    <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-white/45" aria-label="Navegación del pie de página">
                        <Link href="#solucion" className="transition hover:text-white">Solución</Link>
                        <Link href="#demos" className="transition hover:text-white">Ejemplos</Link>
                        <Link href="#planes" className="transition hover:text-white">Precio</Link>
                        <Link href="#faq" className="transition hover:text-white">Preguntas</Link>
                    </nav>
                    <p className="text-xs text-white/35">
                        © {new Date().getFullYear()} LocalHub. Hecho para negocios locales.
                    </p>
                </div>
            </footer>

            <a
                href={whatsappLink}
                target={whatsappDigits ? "_blank" : undefined}
                rel={whatsappDigits ? "noreferrer" : undefined}
                aria-label="Escríbenos por WhatsApp"
                className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-bold text-white shadow-xl shadow-black/30 transition hover:-translate-y-0.5 sm:bottom-6 sm:right-6"
            >
                <WhatsAppIcon />
                <span className="hidden sm:inline">Escríbenos</span>
            </a>
        </main>
    );
}
