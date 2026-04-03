'use client';

import Image from "next/image";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import restaurantConfig from "./restaurant-config.json";

type MenuItem = {
  id: number;
  name: string;
  desc: string;
  price: string;
  image: string;
  category: string;
};

type PromotionItem = {
  id: number;
  name: string;
  description: string;
  specialPrice?: string;
};

const PROMOTIONS_STORAGE_KEY = "braintech-promotions";

export default function Page() {
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastData, setToastData] = useState<{ name: string; count: number } | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [activeBottomTab, setActiveBottomTab] = useState<"Inicio" | "Menu" | "Promos" | "Contacto">("Menu");
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);
  
  const categories = ["Entradas", "Tacos", "Bebidas", "Postres"];
  const restaurantName = restaurantConfig.name;
  const restaurantLogo = restaurantConfig.logo;
  const floatingCtaHref = "https://wa.me/5210000000000?text=Hola%2C%20quiero%20mi%20menu%20digital";
  const menu: MenuItem[] = [
    {
      id: 1,
      name: "Tacos al Pastor",
      desc: "Tres tacos de cerdo adobado con pina",
      price: "$85",
      image: "/solution-1.jpg",
      category: "Tacos",
    },
    {
      id: 2,
      name: "Enchiladas Verdes",
      desc: "Rellenas de pollo banadas en salsa verde",
      price: "$129",
      image: "/solution-2.jpg",
      category: "Entradas",
    },
    {
      id: 3,
      name: "Pechuga Empanizada",
      desc: "Acompanada de papas fritas y ensalada",
      price: "$149",
      image: "/solution-3.jpg",
      category: "Entradas",
    },
  ];

  const getPriceValue = (price: string) => parseFloat(price.replace("$", ""));
  const cartItems = menu.filter((item) => (cartQuantities[item.id] ?? 0) > 0);
  const cartCount = Object.values(cartQuantities).reduce((sum, qty) => sum + qty, 0);
  const total = cartItems.reduce((sum, item) => {
    const quantity = cartQuantities[item.id] ?? 0;
    return sum + getPriceValue(item.price) * quantity;
  }, 0);
  const bottomNavItems = ["Inicio", "Menu", "Promos", "Contacto"] as const;

  useEffect(() => {
    const loadPromotions = () => {
      try {
        const rawPromotions = localStorage.getItem(PROMOTIONS_STORAGE_KEY);
        if (!rawPromotions) {
          setPromotions([]);
          return;
        }

        const parsedPromotions = JSON.parse(rawPromotions) as PromotionItem[];
        if (Array.isArray(parsedPromotions)) {
          setPromotions(parsedPromotions);
        }
      } catch {
        setPromotions([]);
      }
    };

    loadPromotions();
    window.addEventListener("storage", loadPromotions);

    return () => {
      window.removeEventListener("storage", loadPromotions);
    };
  }, []);

  const scrollToSection = (sectionId: string, tab: "Inicio" | "Menu" | "Promos" | "Contacto") => {
    const element = document.getElementById(sectionId);
    if (!element) return;
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveBottomTab(tab);
  };

  return (
    <main className="min-h-screen w-full overflow-x-clip bg-[#FFFFFF] text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF]">
      <div className="sticky top-0 z-40 overflow-x-hidden border-b border-[#111827]/10 bg-[#F9FAFB] dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#111827]/10 bg-white dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
              <Image
                src={restaurantLogo}
                alt={restaurantName}
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0">
            <h1 className="truncate text-xl font-bold sm:text-3xl">{restaurantName}</h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-semibold sm:text-xs">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#16A34A]/25 bg-[#16A34A]/12 px-2 py-0.5 text-[#166534] dark:border-[#F59E0B]/35 dark:bg-[#F59E0B]/16 dark:text-[#FCD34D]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#16A34A] dark:bg-[#FCD34D]" />
                Abierto ahora
              </span>
              <span className="text-[#4B5563] dark:text-[#CBD5E1]">Hoy: 10:00 AM - 11:00 PM</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#3B82F6]/25 bg-[#3B82F6]/12 px-2 py-0.5 text-[#1E40AF] dark:border-[#60A5FA]/30 dark:bg-[#3B82F6]/20 dark:text-[#93C5FD]">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
                2 clientes viendo el menu
              </span>
            </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => (window.location.href = '/business-panel')}
              className="flex sm:hidden h-10 w-10 items-center justify-center rounded-full bg-[#4F46E5] text-lg font-bold text-white shadow-md transition hover:opacity-90 dark:bg-[#6366F1]"
              title="Panel del negocio"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19h16" />
                <rect x="6" y="10" width="3" height="6" rx="1" />
                <rect x="11" y="7" width="3" height="9" rx="1" />
                <rect x="16" y="4" width="3" height="12" rx="1" />
              </svg>
            </button>
            <a
              href="https://wa.me/5210000000000?text=Hola%2C%20quiero%20hacer%20un%20pedido"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
              </svg>
              Pedir por WhatsApp
            </a>
            <button
              onClick={() => (window.location.href = '/business-panel')}
              className="hidden sm:flex items-center gap-2 rounded-full bg-[#4F46E5] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 shadow-sm dark:bg-[#6366F1]"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 19h16" />
                <rect x="6" y="10" width="3" height="6" rx="1" />
                <rect x="11" y="7" width="3" height="9" rx="1" />
                <rect x="16" y="4" width="3" height="12" rx="1" />
              </svg>
              Ver panel del negocio
            </button>
            <ThemeToggle />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-4 sm:px-6 lg:px-8 lg:py-6 2xl:max-w-[1700px]">
        <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
          <aside className="hidden xl:block">
            <div className="sticky top-6 space-y-4">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#16A34A]/20 bg-[#16A34A]/10 px-4 py-2 text-sm font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
                  <circle cx="6" cy="6" r="5" />
                </svg>
                <span>Abierto ahora</span>
              </div>

              <section className="rounded-[1.75rem] border border-[#111827]/10 bg-[#F9FAFB] p-4 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#16A34A] dark:text-[#F59E0B]">
                  Categorias
                </h3>
                <div className="mt-4 space-y-2">
                  {categories.map((category, index) => (
                    <button
                      key={category}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                        index === 0
                          ? "bg-[#16A34A] text-white dark:bg-[#F59E0B] dark:text-[#111827]"
                          : "bg-[#FFFFFF] text-[#111827] dark:bg-[#0F172A] dark:text-[#FFFFFF]"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </aside>

          <section className="space-y-6">
            <article className="overflow-hidden rounded-[2rem] border border-[#111827]/10 bg-[#F9FAFB] shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
              <div className="relative h-56 sm:h-72 lg:h-80 xl:h-96 2xl:h-[28rem]">
                <Image
                  src="/markus-winkler-Q6uqw_Hjye8-unsplash.jpg"
                  alt="Interior de restaurante"
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-[#111827]/25 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6 lg:p-8 2xl:p-10">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/80">Bienvenidos</p>
                  <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl 2xl:text-6xl">
                    {restaurantName}
                  </h2>
                  <div className="mt-3 inline-flex max-w-3xl items-center gap-2 text-sm font-semibold text-white sm:text-base 2xl:text-lg">
                    <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="7" y="2" width="10" height="20" rx="2" />
                      <path d="M11 18h2" />
                    </svg>
                    <span>Escanea y ordena sin contacto</span>
                  </div>
                  <p className="mt-1 max-w-3xl text-sm text-white/90 sm:text-base 2xl:text-lg">
                    Menú digital con QR · Sin apps · Sin descargas
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-white/95 2xl:text-base">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-semibold">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="m12 3.2 2.6 5.2 5.8.8-4.2 4.1 1 5.8L12 16.4 6.8 19l1-5.8-4.2-4.1 5.8-.8L12 3.2Z" />
                      </svg>
                      <span>4.8 (350 reseñas)</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 font-semibold">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>2,300 visitas este mes</span>
                    </span>
                  </div>
                </div>
              </div>
            </article>

            <section id="promos-section" className="rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] p-4 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-[#16A34A] dark:text-[#F59E0B]">Promociones de hoy</h3>
                <span className="text-xs font-semibold text-[#111827]/60 dark:text-[#FFFFFF]/60">Validas por tiempo limitado</span>
              </div>
              {promotions.length > 0 ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="rounded-2xl border border-[#16A34A]/20 bg-[#16A34A]/8 px-3 py-2 text-sm font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/15 dark:text-[#FCD34D]">
                      <p className="font-bold">{promotion.name}</p>
                      <p className="mt-1 text-xs font-medium text-[#111827]/80 dark:text-[#FFFFFF]/80">{promotion.description}</p>
                      {promotion.specialPrice && (
                        <p className="mt-1 text-xs font-bold text-[#166534] dark:text-[#FCD34D]">Precio especial: {promotion.specialPrice}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#16A34A]/20 bg-[#16A34A]/8 px-3 py-2 text-sm font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/15 dark:text-[#FCD34D]">
                    2x1 en bebidas de 4:00 PM a 6:00 PM
                  </div>
                  <div className="rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/10 px-3 py-2 text-sm font-semibold text-[#1E40AF] dark:border-[#60A5FA]/30 dark:bg-[#3B82F6]/20 dark:text-[#93C5FD]">
                    Combo tacos + refresco desde $119
                  </div>
                </div>
              )}
            </section>

            <div className="xl:hidden">
              <div className="flex flex-wrap gap-2 rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-2 dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
                {categories.map((category, index) => (
                  <button
                    key={category}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold ${
                      index === 0
                        ? "bg-[#16A34A] text-white dark:bg-[#F59E0B] dark:text-[#111827]"
                        : "bg-[#FFFFFF] text-[#111827] dark:bg-[#0F172A] dark:text-[#FFFFFF]"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div id="menu-section" className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {menu.map((item) => (
                <article
                  key={item.id}
                  className="flex h-full flex-col overflow-hidden rounded-[1.6rem] border border-[#111827]/10 bg-[#F9FAFB] shadow-sm transition hover:shadow-lg dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]"
                >
                  <div className="relative h-48 sm:h-52 2xl:h-56">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-4 sm:p-5 2xl:p-6">
                    <div className="mb-3 grid min-h-[104px] grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-h-[104px] min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16A34A] dark:text-[#F59E0B]">
                          {item.category}
                        </p>
                        <h3 className="mt-1 text-xl font-bold sm:text-2xl 2xl:text-[1.75rem]">
                          {item.name}
                        </h3>
                      </div>
                      <span className="whitespace-nowrap pl-2 text-right text-2xl font-extrabold text-[#16A34A] dark:text-[#F59E0B] 2xl:text-3xl">
                        {item.price}
                      </span>
                    </div>

                    <p className="min-h-[72px] text-sm leading-6 text-[#111827]/78 dark:text-[#FFFFFF]/78 sm:text-base 2xl:min-h-[84px] 2xl:text-[1.05rem]">
                      {item.desc}
                    </p>

                    <div className="mt-auto grid grid-cols-2 gap-3 pt-5">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setDetailQty(Math.max(1, cartQuantities[item.id] ?? 1));
                        }}
                        className="flex h-14 items-center justify-center gap-1.5 rounded-xl border-2 border-[#111827]/20 bg-transparent px-4 text-center text-sm font-semibold text-[#111827]/70 transition hover:border-[#111827]/40 hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF]/70 dark:hover:border-[#FFFFFF]/40 dark:hover:bg-[#FFFFFF]/5 2xl:px-5 2xl:text-base"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                        Ver
                      </button>
                      <button
                        onClick={() => {
                          setCartQuantities((prev) => {
                            const next = { ...prev };
                            const wasAdded = (next[item.id] ?? 0) > 0;

                            if (wasAdded) {
                              delete next[item.id];
                            } else {
                              next[item.id] = 1;
                              setToastData({ name: item.name, count: Object.keys(next).length });
                              setShowToast(true);
                              setTimeout(() => setShowToast(false), 2000);
                            }

                            return next;
                          });
                        }}
                        className={`flex h-14 items-center justify-center gap-1.5 rounded-xl transition 2xl:px-5 2xl:text-base ${
                          (cartQuantities[item.id] ?? 0) > 0
                            ? "border border-[#16A34A] bg-[#16A34A]/10 px-4 text-center text-sm font-semibold text-[#166534] animate-pulse dark:border-[#F59E0B] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]"
                            : "border border-[#16A34A] bg-[#16A34A] px-4 text-center text-sm font-semibold text-white hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
                        }`}
                      >
                        {(cartQuantities[item.id] ?? 0) > 0 ? (
                          <>
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="m20 6-11 11-5-5" />
                            </svg>
                            Agregado
                          </>
                        ) : (
                          "Agregar"
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>

        </div>
      </div>

      {selectedItem && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#111827]/45 backdrop-blur-sm"
            onClick={() => setSelectedItem(null)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] shadow-2xl dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
            <div className="relative h-56 sm:h-64">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111827]/55 text-white transition hover:bg-[#111827]/75"
                aria-label="Cerrar detalle"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4 p-5 sm:p-6">
              <div className="space-y-1">
                <h3 className="text-2xl font-extrabold">{selectedItem.name}</h3>
                <p className="text-xl font-bold text-[#16A34A] dark:text-[#F59E0B]">{selectedItem.price}</p>
              </div>

              <p className="text-sm leading-6 text-[#111827]/78 dark:text-[#FFFFFF]/78 sm:text-base">
                {selectedItem.desc}
              </p>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setDetailQty((qty) => Math.max(1, qty - 1))}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#111827]/20 text-lg font-bold text-[#111827] transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5"
                >
                  -
                </button>
                <span className="min-w-10 text-center text-lg font-bold">{detailQty}</span>
                <button
                  onClick={() => setDetailQty((qty) => qty + 1)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#111827]/20 text-lg font-bold text-[#111827] transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => {
                  setCartQuantities((prev) => {
                    const next = { ...prev };
                    next[selectedItem.id] = (next[selectedItem.id] ?? 0) + detailQty;
                    setToastData({ name: selectedItem.name, count: Object.keys(next).length });
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 2000);
                    return next;
                  });
                  setSelectedItem(null);
                }}
                className="w-full rounded-xl bg-[#16A34A] px-6 py-3 text-base font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
              >
                Agregar al pedido
              </button>
            </div>
          </div>
        </>
      )}

      <nav className="sticky bottom-0 z-20 border-t border-[#111827]/10 bg-[#F9FAFB]/95 px-3 py-2 backdrop-blur xl:hidden dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]/95">
        <div className="mx-auto grid max-w-xl grid-cols-4 gap-2 text-center text-xs font-medium sm:text-sm">
          {bottomNavItems.map((label) => (
            <button
              key={String(label)}
              onClick={() => {
                if (label === "Inicio") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                  setActiveBottomTab("Inicio");
                }

                if (label === "Menu") {
                  scrollToSection("menu-section", "Menu");
                }

                if (label === "Promos") {
                  scrollToSection("promos-section", "Promos");
                }

                if (label === "Contacto") {
                  setActiveBottomTab("Contacto");
                  window.open("https://wa.me/5210000000000?text=Hola%2C%20quiero%20hacer%20un%20pedido", "_blank", "noopener,noreferrer");
                }
              }}
              className={`rounded-xl px-2 py-2.5 ${
                activeBottomTab === label
                  ? "bg-[#16A34A]/12 text-[#16A34A] dark:bg-[#F59E0B]/18 dark:text-[#F59E0B]"
                  : "text-[#111827] dark:text-[#FFFFFF]"
              }`}
            >
              <div className="flex justify-center">
                {label === "Inicio" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 10.5 12 3l9 7.5" />
                    <path d="M5 9.5V21h14V9.5" />
                  </svg>
                )}
                {label === "Menu" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M4 6h16" />
                    <path d="M4 12h16" />
                    <path d="M4 18h16" />
                  </svg>
                )}
                {label === "Promos" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20.6 13.4 12 22l-8.6-8.6a5 5 0 1 1 7.1-7.1L12 7.8l1.5-1.5a5 5 0 1 1 7.1 7.1Z" />
                  </svg>
                )}
                {label === "Contacto" && (
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M22 16.92V19a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 3.2 2 2 0 0 1 4.1 1h2.1a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L7.2 8.63a16 16 0 0 0 8.17 8.17l1.17-1.17a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z" />
                  </svg>
                )}
              </div>
              <div className="mt-1">{label}</div>
            </button>
          ))}
        </div>
      </nav>

      {showToast && toastData && (
        <div className="fixed bottom-40 right-4 z-40 sm:bottom-32 sm:right-6 transform transition-all duration-300 ease-out">
          <div className="flex items-center gap-2 rounded-full border border-[#16A34A]/40 bg-white/95 px-4 py-2 text-xs font-semibold text-[#166534] shadow-sm backdrop-blur dark:border-[#F59E0B]/40 dark:bg-[#1E293B]/95 dark:text-[#FCD34D]">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <path d="m8 12 2.5 2.5L16 9" />
            </svg>
            <span>{toastData.name} agregado</span>
          </div>
        </div>
      )}

      {cartCount > 0 && (
        <button
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-32 right-4 z-30 flex items-center gap-2 rounded-full bg-[#16A34A] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_30px_rgba(22,163,74,0.35)] transition hover:opacity-90 animate-bounce sm:bottom-24 sm:right-6 dark:bg-[#F59E0B] dark:text-[#111827] dark:shadow-[0_12px_30px_rgba(245,158,11,0.35)]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1" />
            <circle cx="18" cy="20" r="1" />
            <path d="M2 3h2l2.4 11.2a2 2 0 0 0 2 1.6h8.9a2 2 0 0 0 2-1.6L21 7H6" />
          </svg>
          <span>Pedido ({cartCount})</span>
        </button>
      )}

      <a
        href={floatingCtaHref}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-20 right-4 z-40 inline-flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 sm:bottom-6 xl:hidden"
      >
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
        </svg>
        Pedir por WhatsApp
      </a>

      {isCartOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#111827]/40 backdrop-blur-sm dark:bg-[#111827]/60"
            onClick={() => setIsCartOpen(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-[2rem] border-t border-[#111827]/10 bg-[#F9FAFB] shadow-2xl dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
            <div className="mx-auto max-w-2xl p-6 sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Tu pedido</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827]/60 transition hover:bg-[#111827]/8 hover:text-[#111827] dark:text-[#FFFFFF]/60 dark:hover:bg-[#FFFFFF]/10 dark:hover:text-[#FFFFFF]"
                  aria-label="Cerrar carrito"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4 border-b border-[#111827]/10 pb-6 dark:border-[#FFFFFF]/10">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-[#111827]/10 bg-white p-4 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-[#111827]/60 dark:text-[#FFFFFF]/60">
                          {item.price} x {cartQuantities[item.id] ?? 0}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex rounded-full bg-[#16A34A]/12 px-3 py-1 text-sm font-bold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                      x{cartQuantities[item.id] ?? 0}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total estimado:</span>
                  <span className="text-2xl font-extrabold text-[#16A34A] dark:text-[#F59E0B]">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowConfirmation(true);
                      setIsCartOpen(false);
                      setTimeout(() => {
                        window.location.href = floatingCtaHref;
                      }, 3000);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 text-base font-extrabold text-white shadow-lg shadow-[#25D366]/40 transition hover:opacity-90 active:scale-95"
                  >
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
                    </svg>
                    Enviar pedido por WhatsApp
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full rounded-xl border-2 border-[#16A34A] bg-transparent px-6 py-3 text-center text-sm font-bold text-[#16A34A] transition hover:bg-[#16A34A]/5 dark:border-[#F59E0B] dark:text-[#F59E0B] dark:hover:bg-[#F59E0B]/5"
                  >
                    Seguir comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {showConfirmation && (
        <>
          <div
            className="fixed inset-0 z-40 bg-[#111827]/50 backdrop-blur-sm dark:bg-[#111827]/70"
            onClick={() => setShowConfirmation(false)}
          />
          <div className="fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-[#111827]/10 bg-[#F9FAFB] p-8 shadow-2xl dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#16A34A]/12 dark:bg-[#F59E0B]/20">
                <svg className="h-8 w-8 text-[#16A34A] dark:text-[#F59E0B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m8 12 2.5 2.5L16 9" />
                </svg>
              </div>
              <h2 className="mb-3 text-2xl font-extrabold">¡Perfecto!</h2>
              <p className="mb-6 text-lg font-semibold text-[#111827]/70 dark:text-[#FFFFFF]/70">
                Este pedido llegó al panel del restaurante
              </p>
              <div className="mb-6 w-full rounded-xl border-2 border-[#16A34A] bg-[#16A34A]/5 p-4 dark:border-[#F59E0B] dark:bg-[#F59E0B]/10">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#111827]/60 dark:text-[#FFFFFF]/60 mb-2">
                  Resumen del pedido
                </p>
                <div className="space-y-1">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="font-medium">
                        {item.name} x{cartQuantities[item.id] ?? 0}
                      </span>
                      <span className="font-bold text-[#16A34A] dark:text-[#F59E0B]">
                        ${(getPriceValue(item.price) * (cartQuantities[item.id] ?? 0)).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 border-t border-[#16A34A]/20 pt-3 dark:border-[#F59E0B]/20">
                  <div className="flex items-center justify-between font-bold">
                    <span>Total:</span>
                    <span className="text-lg text-[#16A34A] dark:text-[#F59E0B]">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <p className="mb-6 text-sm text-[#111827]/60 dark:text-[#FFFFFF]/60">
                Abriendo WhatsApp en 3 segundos...
              </p>
              <button
                onClick={() => {
                  window.location.href = floatingCtaHref;
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-base font-bold text-white transition hover:opacity-90"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004c-3.582 0-6.917-2.607-6.917-5.96 0-3.353 3.335-5.96 6.917-5.96s6.917 2.607 6.917 5.96c0 3.353-3.335 5.96-6.917 5.96Z" />
                </svg>
                Abrir WhatsApp ahora
              </button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}