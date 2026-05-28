'use client'

import Image from 'next/image'
import Avatar from './Avatar'

export type MobileStoreHeaderProps = {
    eyebrow?: string
    heading: string
    description?: string
    imageSrc: string
    imageAlt?: string
    priceTag?: string
    title?: string
    logoSrc?: string
    logoAlt?: string
    backgroundFrom?: string
    backgroundTo?: string
    glowColor?: string
    textColor?: string
    mutedTextColor?: string
    imageObjectFit?: 'contain' | 'cover'
}

export default function MobileStoreHeader({
    heading,
    imageSrc,
    imageAlt,
    title,
    logoSrc,
    logoAlt,
    backgroundTo = '#8c4f2a',
}: MobileStoreHeaderProps) {
    return (
        <section className="relative overflow-hidden px-5 pb-2 pt-5" style={{ backgroundColor: backgroundTo }}>
            <div className="relative mx-auto max-w-md overflow-hidden rounded-[28px] border border-white/15 bg-white shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                <div className="absolute inset-x-5 top-6 z-10 flex items-center justify-between gap-3 rounded-[28px] border border-white/20 bg-black/10 px-4 py-4 backdrop-blur-[1px]">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                        {logoSrc ? (
                            <Image
                                src={logoSrc}
                                alt={logoAlt || title || heading}
                                width={56}
                                height={56}
                                className="h-11 w-11 object-contain"
                            />
                        ) : (
                            <div className="text-lg font-bold" style={{ color: backgroundTo }}>{String(title || heading).slice(0, 2)}</div>
                        )}
                    </div>

                    <div className="flex-1" />

                    <div className="shrink-0">
                        <Avatar name="Cuenta" />
                    </div>
                </div>

                <Image
                    src={imageSrc}
                    alt={imageAlt || title || heading}
                    width={1200}
                    height={900}
                    priority
                    className="h-auto w-full object-contain"
                    sizes="(max-width: 768px) 100vw, 448px"
                />
            </div>
        </section>
    )
}
