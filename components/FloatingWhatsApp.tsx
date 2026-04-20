"use client"

import React from "react"

type Props = {
  whatsappNumber?: string
  message?: string
  className?: string
}

export default function FloatingWhatsApp({ whatsappNumber, message, className }: Props) {
  const digits = (whatsappNumber || "").replace(/[^0-9]/g, "")
  if (!digits) return null

  const openWhatsApp = () => {
    const text = message || "Hola, quiero más información"
    const url = `https://wa.me/${digits}?text=${encodeURIComponent(text)}`
    window.open(url, "_blank")
  }

  const baseClass = "fixed z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-transform duration-200 ease-in-out hover:scale-110 active:scale-95 motion-safe:animate-pulse"

  return (
    <button
      onClick={openWhatsApp}
      aria-label="Contactar por WhatsApp"
      className={`${className ? className : 'right-6 bottom-6 md:right-8 md:bottom-8'} ${baseClass}`}
      title="Contactar por WhatsApp"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M20.52 3.48A11.88 11.88 0 0012 .5C6.21.5 1.5 5.21 1.5 11c0 1.95.5 3.84 1.45 5.5L.5 23.5l6.99-2.01A11.5 11.5 0 0012 22.5c5.79 0 10.5-4.71 10.5-10.5 0-3.02-1.18-5.86-3.98-8.52zM12 20.25c-1.1 0-2.18-.28-3.13-.8l-.22-.13-4.15 1.19 1.17-3.98-.14-.26A8.26 8.26 0 013.75 11c0-4.59 3.71-8.25 8.25-8.25 4.59 0 8.25 3.66 8.25 8.25S16.59 20.25 12 20.25z" />
        <path d="M17.2 14.3c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.95 1.18c-.17.2-.34.22-.63.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.34.45-.51.15-.17.2-.28.3-.47.1-.2.05-.37-.02-.52-.07-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52-.18-.01-.38-.01-.58-.01s-.52.08-.79.37c-.27.29-1.04 1.01-1.04 2.47s1.06 2.86 1.2 3.06c.14.2 2.07 3.15 5.02 4.42 2.95 1.27 2.95.85 3.48.8.53-.06 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.58-.35z" />
      </svg>
    </button>
  )
}
