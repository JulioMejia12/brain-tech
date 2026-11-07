import type { Metadata } from "next";
import LandingGeneric from "./components/landing/LandingGeneric";

export const metadata: Metadata = {
  title: "LocalHub — Tu negocio en internet en 7 días",
  description:
    "Creamos la página profesional de tu negocio con catálogo y pedidos directos por WhatsApp. Primer mes $500 y luego $110/mes.",
  openGraph: {
    title: "LocalHub — Tu negocio en internet en 7 días",
    description:
      "Catálogo digital y pedidos por WhatsApp para negocios locales. Empieza a recibir clientes desde el primer día.",
    type: "website",
    locale: "es_MX",
  },
  twitter: {
    card: "summary_large_image",
    title: "LocalHub — Tu negocio en internet en 7 días",
    description:
      "Catálogo digital y pedidos por WhatsApp para negocios locales.",
  },
};

export default function Home() {
  return <LandingGeneric />;
}
