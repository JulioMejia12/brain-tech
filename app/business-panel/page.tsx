'use client';

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import restaurantConfig from "../demo/restaurant-config.json";

type IconName =
  | "users"
  | "summary"
  | "home"
  | "receipt"
  | "back"
  | "camera"
  | "settings"
  | "fire"
  | "eye"
  | "money"
  | "star"
  | "check"
  | "clock"
  | "bag"
  | "scan"
  | "phone"
  | "chat"
  | "trophy";

function Icon({ name, className }: { name: IconName; className?: string }) {
  switch (name) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="m3 10 9-7 9 7" />
          <path d="M5 9.5V20h14V9.5" />
          <path d="M10 20v-6h4v6" />
        </svg>
      );
    case "receipt":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21V3Z" />
          <path d="M9 8h6" />
          <path d="M9 12h6" />
        </svg>
      );
    case "summary":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M4 20V10" />
          <path d="M10 20V4" />
          <path d="M16 20v-7" />
          <path d="M22 20v-4" />
        </svg>
      );
    case "back":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <path d="m15 18-6-6 6-6" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M4 7h4l1.4-2h5.2L16 7h4v12H4z" />
          <circle cx="12" cy="13" r="3" />
        </svg>
      );
    case "settings":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .2 1.7 1.7 0 0 0-.8 1.47V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-.8-1.47 1.7 1.7 0 0 0-1-.2 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.2-1 1.7 1.7 0 0 0-1.47-.8H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.47-.8 1.7 1.7 0 0 0 .2-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.2 1.7 1.7 0 0 0 .8-1.47V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 .8 1.47 1.7 1.7 0 0 0 1 .2 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 .2 1 1.7 1.7 0 0 0 1.47.8H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.47.8z" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "fire":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M8.5 14.5A3.5 3.5 0 1 0 12 18a3 3 0 0 1 3-3c.5 0 1 .1 1.4.3A6.5 6.5 0 1 0 7 9c0 1.5.5 3 1.5 4.1" />
          <path d="M12 2s2 2 2 5-2 4-2 4-2-1-2-4 2-5 2-5Z" />
        </svg>
      );
    case "eye":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
    case "money":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M12 9v6" />
          <path d="M15 11.5c0-1.1-1.3-2-3-2s-3 .9-3 2 1.3 2 3 2 3 .9 3 2-1.3 2-3 2-3-.9-3-2" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
          <path d="m12 2.5 2.9 5.9 6.6 1-4.8 4.7 1.1 6.6L12 17.6 6.2 20.7l1.1-6.6L2.5 9.4l6.6-1L12 2.5Z" />
        </svg>
      );
    case "check":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8 12 2.5 2.5L16 9" />
        </svg>
      );
    case "clock":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 7v5l3 2" />
        </svg>
      );
    case "bag":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M6 8h12l-1 12H7L6 8Z" />
          <path d="M9 8a3 3 0 0 1 6 0" />
        </svg>
      );
    case "scan":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M4 7V4h3" />
          <path d="M20 7V4h-3" />
          <path d="M4 17v3h3" />
          <path d="M20 17v3h-3" />
          <path d="M7 12h10" />
        </svg>
      );
    case "phone":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <rect x="7" y="2.5" width="10" height="19" rx="2" />
          <path d="M11 18.5h2" />
        </svg>
      );
    case "chat":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M21 14a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z" />
          <path d="M8 10h8" />
        </svg>
      );
    case "trophy":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className}>
          <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
          <path d="M9 14h6" />
          <path d="M10 14v3h4v-3" />
          <path d="M7 20h10" />
          <path d="M5 6h3v1a3 3 0 0 1-3 3V6Zm14 0h-3v1a3 3 0 0 0 3 3V6Z" />
        </svg>
      );
    default:
      return null;
  }
}

type ProductItem = {
  id: number;
  name: string;
  price: string;
  description: string;
  imageUrl?: string;
  ordersLabel: string;
};

type PromotionItem = {
  id: number;
  name: string;
  description: string;
  specialPrice?: string;
};

const PROMOTIONS_STORAGE_KEY = "braintech-promotions";

export default function BusinessPanel() {
  const restaurantName = restaurantConfig.name;
  const restaurantLogo = restaurantConfig.logo;
  const [secondsAgo, setSecondsAgo] = useState(5);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productFormError, setProductFormError] = useState("");
  const [productFormSuccess, setProductFormSuccess] = useState("");
  const [isPromotionFormOpen, setIsPromotionFormOpen] = useState(false);
  const [promotionFormError, setPromotionFormError] = useState("");
  const [promotionFormSuccess, setPromotionFormSuccess] = useState("");
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
    imageUrl: "",
  });
  const [newPromotion, setNewPromotion] = useState({
    name: "",
    description: "",
    specialPrice: "",
  });
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 1,
      name: "Tacos al Pastor",
      price: "$85",
      description: "Tortilla de maiz con carne al pastor y cebolla.",
      imageUrl: "",
      ordersLabel: "8 pedidos",
    },
    {
      id: 2,
      name: "Enchiladas Verdes",
      price: "$129",
      description: "Rellenas de pollo banadas en salsa verde.",
      imageUrl: "",
      ordersLabel: "5 pedidos",
    },
    {
      id: 3,
      name: "Agua fresca",
      price: "$45",
      description: "Bebida natural del dia.",
      imageUrl: "",
      ordersLabel: "4 pedidos",
    },
  ]);
  const [promotions, setPromotions] = useState<PromotionItem[]>([]);

  useEffect(() => {
    const ticker = setInterval(() => {
      setSecondsAgo((prev) => prev + 1);
    }, 1000);

    const refreshCycle = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        setIsUpdating(false);
        setSecondsAgo(0);
      }, 1600);
    }, 9000);

    return () => {
      clearInterval(ticker);
      clearInterval(refreshCycle);
    };
  }, []);

  useEffect(() => {
    try {
      const rawPromotions = localStorage.getItem(PROMOTIONS_STORAGE_KEY);
      if (!rawPromotions) return;
      const parsedPromotions = JSON.parse(rawPromotions) as PromotionItem[];
      if (Array.isArray(parsedPromotions)) {
        setPromotions(parsedPromotions);
      }
    } catch {
      // Keep default empty state if localStorage is not available or malformed.
    }
  }, []);

  const summaryCards = [
    { icon: "fire" as const, title: "Pedidos hoy", value: "12", suffix: "pedidos", valueColor: "text-[#166534] dark:text-[#F59E0B]" },
    { icon: "eye" as const, title: "Visitas al menú", value: "86", suffix: "visitas", valueColor: "text-[#166534] dark:text-[#F59E0B]" },
    { icon: "money" as const, title: "Ventas potenciales", value: "$3,420", suffix: "", valueColor: "text-[#166534] dark:text-[#F59E0B]" },
    { icon: "star" as const, title: "Plato más pedido", value: "Tacos al Pastor", suffix: "", valueColor: "text-[#111827] dark:text-[#FFFFFF]" },
  ];

  const orderCards = [
    { label: "Mesa 4", status: "Confirmado", statusIcon: "check" as const, detail: "2 Tacos", subDetail: "", statusClasses: "bg-[#16A34A]/12 text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]", isLive: false },
    { label: "Mesa 2", status: "Preparando", statusIcon: "fire" as const, detail: "1 Enchilada", subDetail: "", statusClasses: "bg-[#6B7280]/15 text-[#4B5563] dark:bg-[#9CA3AF]/20 dark:text-[#D1D5DB]", isLive: false },
    { label: "Para llevar", status: "", statusIcon: undefined, detail: "3 Bebidas", subDetail: "", statusClasses: "", isLive: false },
    { label: "NUEVO PEDIDO", status: "", statusIcon: "clock" as const, detail: "3 Bebidas", subDetail: "Mesa 5", statusClasses: "", isLive: true },
  ];

  const handleSaveProduct = () => {
    const name = newProduct.name.trim();
    const price = newProduct.price.trim();
    const description = newProduct.description.trim();
    const imageUrl = newProduct.imageUrl.trim();

    if (!name || !price || !description) {
      setProductFormError("Completa nombre, precio y descripcion.");
      return;
    }

    const normalizedPrice = price.startsWith("$") ? price : `$${price}`;

    setProducts((prev) => [
      {
        id: Date.now(),
        name,
        price: normalizedPrice,
        description,
        imageUrl: imageUrl || undefined,
        ordersLabel: "Nuevo",
      },
      ...prev,
    ]);

    setProductFormError("");
    setNewProduct({ name: "", price: "", description: "", imageUrl: "" });
    setIsProductFormOpen(false);
    setProductFormSuccess("Producto guardado correctamente.");
    setTimeout(() => setProductFormSuccess(""), 2600);

    // Lleva al usuario a la seccion donde se ve el nuevo producto.
    setTimeout(() => {
      const section = document.getElementById("productos");
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 80);
  };

  const handleSavePromotion = () => {
    const name = newPromotion.name.trim();
    const description = newPromotion.description.trim();
    const specialPrice = newPromotion.specialPrice.trim();

    if (!name || !description) {
      setPromotionFormError("Completa nombre y descripcion.");
      return;
    }

    const normalizedSpecialPrice = specialPrice
      ? specialPrice.startsWith("$")
        ? specialPrice
        : `$${specialPrice}`
      : "";

    const savedPromotion: PromotionItem = {
      id: Date.now(),
      name,
      description,
      specialPrice: normalizedSpecialPrice || undefined,
    };

    setPromotions((prev) => {
      const updatedPromotions = [savedPromotion, ...prev];
      try {
        localStorage.setItem(PROMOTIONS_STORAGE_KEY, JSON.stringify(updatedPromotions));
      } catch {
        // Do not block UX if storage fails.
      }
      return updatedPromotions;
    });

    setPromotionFormError("");
    setNewPromotion({ name: "", description: "", specialPrice: "" });
    setIsPromotionFormOpen(false);
    setPromotionFormSuccess("Promocion guardada correctamente.");
    setTimeout(() => setPromotionFormSuccess(""), 2600);
  };

  return (
    <main id="top" className="min-h-screen overflow-x-hidden bg-[#FFFFFF] pb-24 text-[#111827] transition-colors duration-300 dark:bg-[#0F172A] dark:text-[#FFFFFF] sm:pb-0">
      <div className="sticky top-0 z-40 border-b border-[#111827]/10 bg-[#F9FAFB] dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
        <div className="sm:hidden flex items-center justify-between px-3 py-3">
          <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827] dark:text-[#FFFFFF]">
            <Icon name="back" className="h-5 w-5" />
          </button>
          <div className="inline-flex min-w-0 flex-1 items-center justify-center gap-2 px-2">
            <div className="relative h-7 w-7 overflow-hidden rounded-full border border-[#111827]/10 bg-white dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
              <Image src={restaurantLogo} alt={restaurantName} fill className="object-contain p-0.5" />
            </div>
            <h1 className="truncate text-lg font-bold leading-none">Panel del Restaurante</h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827] dark:text-[#FFFFFF]">
              <Icon name="camera" className="h-5 w-5" />
            </button>
            <button className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#111827] dark:text-[#FFFFFF]">
              <Icon name="settings" className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mx-auto hidden max-w-7xl items-center justify-between px-3 py-3 sm:flex sm:px-6 sm:py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[#111827]/10 bg-white dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
              <Image
                src={restaurantLogo}
                alt={restaurantName}
                fill
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold sm:text-3xl">{restaurantName}</h1>
              <p className="text-xs font-semibold text-[#111827]/60 dark:text-[#FFFFFF]/60">
                Panel del Restaurante
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-4">
            <a
              href="/demo"
              className="hidden sm:flex items-center gap-2 rounded-full border border-[#111827]/20 px-5 py-2.5 text-sm font-bold text-[#111827] transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5"
            >
              <Icon name="users" className="h-4 w-4" />
              Ver como cliente
            </a>
            <div className="max-[375px]:hidden">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-10 lg:px-8 lg:py-12 2xl:max-w-[1700px]">
        <div className="mb-8 flex items-start justify-between gap-4 sm:mb-10 sm:gap-6">
          <div>
            <h2 className="text-4xl font-extrabold leading-[0.95] text-[#111827]/90 dark:text-[#FFFFFF] sm:text-[3rem]">Bella Vista</h2>
            <p className="mt-2 text-sm font-medium text-[#111827]/70 dark:text-[#FFFFFF]/70">Hoy: 12 Abril 2028</p>
            <p className="mt-2 text-xs text-[#111827]/55 dark:text-[#FFFFFF]/55">Datos simulados para demostración</p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#16A34A]/25 bg-[#16A34A]/10 px-3 py-1.5 text-xs font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
              <span className={`h-2.5 w-2.5 rounded-full ${isUpdating ? "animate-pulse bg-[#16A34A] dark:bg-[#F59E0B]" : "bg-[#16A34A] dark:bg-[#F59E0B]"}`} />
              {isUpdating ? "Actualizando..." : `Actualizado hace ${secondsAgo} segundos`}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Link
              href="/business-panel/resumen"
              className="hidden items-center gap-1.5 rounded-md border border-[#111827]/15 bg-[#F9FAFB] px-2.5 py-1.5 text-xs font-semibold text-[#111827] shadow-sm transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:bg-[#1E293B] dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5 sm:inline-flex sm:px-3 sm:text-sm"
            >
              <Icon name="summary" className="h-4 w-4" />
              Resumen
            </Link>
            <span className="inline-flex items-center gap-2 rounded-2xl border border-[#16A34A]/25 bg-[#16A34A]/10 px-3 py-2 text-xs font-semibold text-[#166534] dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/20 dark:text-[#FCD34D] sm:px-4 sm:text-sm">
              <span className="h-2.5 w-2.5 rounded-full bg-[#16A34A] dark:bg-[#F59E0B]" />
              Sistema activo
            </span>
          </div>
        </div>

        <section className="mb-6 rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] px-4 py-4 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:mb-8 sm:px-5 sm:py-5">
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/10 px-3 py-2 dark:border-[#F59E0B]/30 dark:bg-[#F59E0B]/18">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold text-[#166534] dark:text-[#FCD34D] sm:text-sm">
              <Icon name="fire" className="h-4 w-4" />
              2 pedidos nuevos
            </p>
            <Link
              href="/business-panel/pedidos"
              className="rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
            >
              Ver pedidos
            </Link>
          </div>

          <p className="inline-flex items-center gap-2 text-sm font-extrabold text-[#111827]/90 dark:text-[#FFFFFF] sm:text-base">
            <Icon name="summary" className="h-4 w-4 sm:h-5 sm:w-5" />
            Resumen rapido
          </p>
          <ul className="mt-2 space-y-1 text-sm font-semibold text-[#111827]/80 dark:text-[#FFFFFF]/80 sm:text-base">
            <li>- 12 pedidos hoy</li>
            <li>- 86 visitas</li>
          </ul>
          <Link
            href="/business-panel/resumen"
            className="mt-3 inline-flex rounded-lg bg-[#16A34A] px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827] sm:text-sm"
          >
            Ver detalles
          </Link>
        </section>

        <div className="mb-12 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <article
              key={card.title}
              className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-[10px] shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] min-[376px]:px-5 min-[376px]:py-4 sm:px-6 sm:py-5"
            >
              <div className="mb-3 flex items-center gap-2 text-base sm:text-xl">
                <Icon name={card.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                <p className="text-sm font-bold leading-none text-[#111827]/90 dark:text-[#FFFFFF] max-[375px]:text-[12px] sm:text-lg">{card.title}</p>
              </div>
              <div className="flex items-baseline gap-2">
                <span
                  className={`font-extrabold leading-tight break-words ${/^[\d$,.]+$/.test(card.value) ? "text-[20px]" : "text-sm sm:text-lg"} ${card.valueColor}`}
                >
                  {card.value}
                </span>
                {card.suffix && (
                  <span className="text-xs font-medium text-[#111827]/70 dark:text-[#FFFFFF]/70 sm:text-sm">
                    {card.suffix}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>

        <section id="pedidos" className="mb-12">
          <h3 className="mb-5 text-2xl font-bold tracking-tight text-[#111827]/90 dark:text-[#FFFFFF] sm:mb-6 sm:text-3xl">Pedidos recientes</h3>
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {orderCards.map((order) => (
              <article
                key={order.label}
                className="relative rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-[10px] shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] min-[376px]:px-5 min-[376px]:py-4 sm:px-6 sm:py-5"
              >
                <div className="flex items-start">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <p className="text-base font-semibold leading-tight text-[#111827]/90 dark:text-[#FFFFFF] sm:text-2xl">
                      {order.statusIcon === "clock" ? (
                        <span className="inline-flex items-center gap-2 text-[12px]">
                          <Icon name="clock" className="h-5 w-5 sm:h-6 sm:w-6" />
                          {order.label}
                        </span>
                      ) : (
                        order.label
                      )}
                    </p>
                    {order.status && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold sm:px-2 sm:text-xs ${order.statusClasses}`}>
                        <span className="inline-flex items-center gap-1">
                          {/* {order.statusIcon && <Icon name={order.statusIcon} className="h-3.5 w-3.5" />} */}
                          {order.status}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-3 text-lg font-medium leading-tight text-[#111827]/85 dark:text-[#FFFFFF]/85 sm:mt-4 sm:text-2xl">
                  {order.detail}
                </p>
                {order.subDetail && (
                  <p className="mt-1.5 text-[11px] font-semibold text-[#16A34A] dark:text-[#F59E0B] sm:text-base">
                    {order.subDetail}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>

        <section id="productos" className="mb-12">
          <h3 className="mb-6 text-3xl font-bold tracking-tight text-[#111827]/90 dark:text-[#FFFFFF] sm:text-4xl">Top productos hoy</h3>
          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-6 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-7">
            <ul className="space-y-4 text-base leading-tight sm:text-lg">
              {products.map((product, index) => (
                <li key={product.id} className="rounded-lg border border-[#111827]/10 bg-white p-3 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
                  <div className="flex items-start gap-3">
                    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#16A34A]/15 text-sm font-bold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-bold">
                        {product.name} · <span className="text-[#166534] dark:text-[#F59E0B]">{product.price}</span>
                      </p>
                      <p className="mt-1 text-sm text-[#111827]/70 dark:text-[#FFFFFF]/70">{product.description}</p>
                      <p className="mt-1 text-xs font-semibold text-[#111827]/60 dark:text-[#FFFFFF]/60">{product.ordersLabel}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section>
          <h3 className="mb-6 text-3xl font-bold tracking-tight text-[#111827]/90 dark:text-[#FFFFFF] sm:text-4xl">Actividad del menú QR</h3>
          <article className="rounded-xl border border-[#111827]/10 bg-[#F9FAFB] p-6 shadow-sm dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-7">
            <ul className="space-y-4 text-lg leading-tight sm:text-2xl">
              <li><span className="mr-3 inline-flex align-middle"><Icon name="scan" className="h-6 w-6" /></span><strong>86</strong> clientes escanearon hoy</li>
              <li><span className="mr-3 inline-flex align-middle"><Icon name="phone" className="h-6 w-6" /></span><strong>23</strong> pedidos iniciados</li>
              <li><span className="mr-3 inline-flex align-middle"><Icon name="chat" className="h-6 w-6" /></span><strong>9</strong> pedidos enviados por WhatsApp</li>
            </ul>
            <div className="mt-8 space-y-4">
              <Link
                href="/business-panel/pedidos"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#16A34A] px-5 py-3.5 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(22,163,74,0.32)] transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827] dark:shadow-[0_10px_24px_rgba(245,158,11,0.32)] sm:text-lg"
              >
                <Icon name="receipt" className="h-5 w-5" />
                Ir a pedidos
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setProductFormError("");
                    setIsProductFormOpen(true);
                  }}
                  className="rounded-2xl border border-[#16A34A]/35 bg-[#16A34A]/10 px-4 py-3 text-base font-bold text-[#166534] transition hover:bg-[#16A34A]/15 dark:border-[#F59E0B]/35 dark:bg-[#F59E0B]/15 dark:text-[#FCD34D] sm:text-lg"
                >
                  + Agregar producto
                </button>
                <button
                  onClick={() => {
                    setPromotionFormError("");
                    setIsPromotionFormOpen(true);
                  }}
                  className="rounded-2xl border border-[#16A34A]/35 bg-[#16A34A]/10 px-4 py-3 text-base font-bold text-[#166534] transition hover:bg-[#16A34A]/15 dark:border-[#F59E0B]/35 dark:bg-[#F59E0B]/15 dark:text-[#FCD34D] sm:text-lg"
                >
                  Crear promoción
                </button>
              </div>

              {promotions.length > 0 && (
                <div className="rounded-xl border border-[#111827]/10 bg-white p-3 dark:border-[#FFFFFF]/10 dark:bg-[#0F172A]">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#111827]/65 dark:text-[#FFFFFF]/65">Promociones activas</p>
                  <ul className="mt-2 space-y-2">
                    {promotions.map((promo) => (
                      <li key={promo.id} className="rounded-lg border border-[#111827]/10 bg-[#F9FAFB] p-2 dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]">
                        <p className="text-sm font-bold text-[#111827]/90 dark:text-[#FFFFFF]">{promo.name}</p>
                        <p className="text-xs text-[#111827]/70 dark:text-[#FFFFFF]/70">{promo.description}</p>
                        {promo.specialPrice && (
                          <p className="mt-1 text-xs font-semibold text-[#166534] dark:text-[#FCD34D]">Precio especial: {promo.specialPrice}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>
        </section>

      </div>

      {isProductFormOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-[#111827]/45 backdrop-blur-sm" onClick={() => setIsProductFormOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-2xl dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <h3 className="text-xl font-extrabold text-[#111827]/90 dark:text-[#FFFFFF]">Agregar producto</h3>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Nombre del producto</span>
                <input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="Ej. Tacos campechanos"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Precio</span>
                <input
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="Ej. 95"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Descripcion</span>
                <textarea
                  value={newProduct.description}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[86px] w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="Descripcion del producto"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Imagen (opcional)</span>
                <input
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, imageUrl: e.target.value }))}
                  className="w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="URL de imagen"
                />
              </label>
            </div>

            {productFormError && (
              <p className="mt-3 text-sm font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">{productFormError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setProductFormError("");
                  setIsProductFormOpen(false);
                }}
                className="w-full rounded-xl border border-[#111827]/20 px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveProduct}
                className="w-full rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
              >
                Guardar
              </button>
            </div>
          </div>
        </>
      )}

      {isPromotionFormOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-[#111827]/45 backdrop-blur-sm" onClick={() => setIsPromotionFormOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-[92%] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#111827]/10 bg-[#F9FAFB] p-5 shadow-2xl dark:border-[#FFFFFF]/10 dark:bg-[#1E293B] sm:p-6">
            <h3 className="text-xl font-extrabold text-[#111827]/90 dark:text-[#FFFFFF]">Crear promoción</h3>

            <div className="mt-4 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Nombre</span>
                <input
                  value={newPromotion.name}
                  onChange={(e) => setNewPromotion((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="2x1 Tacos"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Descripción</span>
                <textarea
                  value={newPromotion.description}
                  onChange={(e) => setNewPromotion((prev) => ({ ...prev, description: e.target.value }))}
                  className="min-h-[86px] w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="Llevate 2 por el precio de 1"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-[#111827]/75 dark:text-[#FFFFFF]/75">Precio especial (opcional)</span>
                <input
                  value={newPromotion.specialPrice}
                  onChange={(e) => setNewPromotion((prev) => ({ ...prev, specialPrice: e.target.value }))}
                  className="w-full rounded-xl border border-[#111827]/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-[#16A34A] dark:border-[#FFFFFF]/20 dark:bg-[#0F172A] dark:focus:border-[#F59E0B]"
                  placeholder="Ej. 99"
                />
              </label>
            </div>

            {promotionFormError && (
              <p className="mt-3 text-sm font-semibold text-[#B91C1C] dark:text-[#FCA5A5]">{promotionFormError}</p>
            )}

            <div className="mt-5 flex gap-3">
              <button
                onClick={() => {
                  setPromotionFormError("");
                  setIsPromotionFormOpen(false);
                }}
                className="w-full rounded-xl border border-[#111827]/20 px-4 py-2.5 text-sm font-semibold text-[#111827] transition hover:bg-[#111827]/5 dark:border-[#FFFFFF]/20 dark:text-[#FFFFFF] dark:hover:bg-[#FFFFFF]/5"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePromotion}
                className="w-full rounded-xl bg-[#16A34A] px-4 py-2.5 text-sm font-bold text-white transition hover:opacity-90 dark:bg-[#F59E0B] dark:text-[#111827]"
              >
                Guardar
              </button>
            </div>
          </div>
        </>
      )}

      {productFormSuccess && (
        <div className="fixed bottom-20 right-4 z-[60] rounded-xl border border-[#16A34A]/60 bg-[#166534] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,101,52,0.45)] dark:border-[#F59E0B]/60 dark:bg-[#F59E0B] dark:text-[#111827] dark:shadow-[0_10px_24px_rgba(245,158,11,0.35)] sm:bottom-6 sm:right-6">
          {productFormSuccess}
        </div>
      )}

      {promotionFormSuccess && (
        <div className="fixed bottom-20 right-4 z-[60] rounded-xl border border-[#16A34A]/60 bg-[#166534] px-4 py-2 text-sm font-bold text-white shadow-[0_10px_24px_rgba(22,101,52,0.45)] dark:border-[#F59E0B]/60 dark:bg-[#F59E0B] dark:text-[#111827] dark:shadow-[0_10px_24px_rgba(245,158,11,0.35)] sm:bottom-6 sm:right-6">
          {promotionFormSuccess}
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#111827]/10 bg-[#F9FAFB]/95 px-2 py-2 backdrop-blur dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]/95 sm:hidden">
        <div className="grid grid-cols-5 gap-1">
          <Link href="/" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
            <Icon name="home" className="h-4 w-4" />
            Inicio
          </Link>
          <a href="#top" className="relative flex flex-col items-center justify-center rounded-md bg-[#16A34A]/10 px-1 py-1.5 text-[10px] font-semibold text-[#166534] dark:bg-[#F59E0B]/20 dark:text-[#FCD34D]">
            <Icon name="summary" className="h-4 w-4" />
            Resumen
          </a>
          <a href="#productos" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
            <Icon name="bag" className="h-4 w-4" />
            Productos
          </a>
          <a href="#pedidos" className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]">
            <Icon name="receipt" className="h-4 w-4" />
            Pedidos
          </a>
          <button className="flex flex-col items-center justify-center rounded-md px-1 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#FFFFFF]" type="button">
            <Icon name="settings" className="h-4 w-4" />
            Ajustes
          </button>
        </div>
      </nav>

      <nav className="hidden border-t border-[#111827]/10 bg-[#F9FAFB]/95 px-4 py-6 backdrop-blur dark:border-[#FFFFFF]/10 dark:bg-[#1E293B]/95 sm:block">
        <div className="mx-auto max-w-7xl">
          <p className="text-center text-xs text-[#111827]/60 dark:text-[#FFFFFF]/60">
            Panel actualizado en tiempo real • Datos simulados para demostración
          </p>
        </div>
      </nav>
    </main>
  );
}
