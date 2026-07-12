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
        <section className="relative px-5 pb-2 pt-4" style={{ backgroundColor: backgroundTo }}>
            <div className="relative mx-auto max-w-md rounded-[28px]">
                <div className="absolute inset-x-5 top-4 z-20 flex items-center justify-between gap-3 rounded-[24px] border border-white/20 bg-white/80 px-4 py-3 shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-[8px]">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
                        {logoSrc ? (
                            <Image
                                src={logoSrc}
                                alt={logoAlt || title || heading}
                                width={56}
                                height={56}
                                unoptimized
                                className="h-9 w-9 object-contain"
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

                <div className="overflow-hidden rounded-[28px] border border-white/15 bg-white pt-20 shadow-[0_18px_50px_rgba(0,0,0,0.16)]">
                    <Image
                        src={imageSrc}
                        alt={imageAlt || title || heading}
                        width={1200}
                        height={900}
                        priority
                        unoptimized
                        className="h-auto w-full object-contain"
                        sizes="(max-width: 768px) 100vw, 448px"
                    />
                </div>
            </div>
        </section>
    )
}
