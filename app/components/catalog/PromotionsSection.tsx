'use client'

import type { ReactNode } from 'react'
import PromotionsSlider, { type PromotionsSliderProps } from '@/components/PromotionsSlider'

function cx(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ')
}

export type PromotionsSectionProps = Omit<
    PromotionsSliderProps,
    'textColor' | 'backgroundColor' | 'className'
> & {
    id?: string
    title?: string
    description?: ReactNode
    action?: ReactNode
    textColor?: string
    backgroundColor?: string
    className?: string
    sliderClassName?: string
    titleClassName?: string
    descriptionClassName?: string
}

export default function PromotionsSection({
    id,
    title = 'Promociones',
    description,
    action,
    textColor,
    backgroundColor,
    className,
    sliderClassName,
    titleClassName,
    descriptionClassName,
    ...sliderProps
}: PromotionsSectionProps) {
    const customColorsStyle = {
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(textColor ? { color: textColor } : {}),
    }

    return (
        <section
            id={id}
            style={customColorsStyle}
            className={cx('mx-auto w-full max-w-4xl px-4 py-8 sm:px-6', className)}
        >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2
                        style={textColor ? { color: textColor } : undefined}
                        className={cx(
                            'text-2xl font-extrabold tracking-tight text-[#111827] dark:text-white',
                            titleClassName,
                        )}
                    >
                        {title}
                    </h2>
                    {description ? (
                        <p
                            style={textColor ? { color: textColor } : undefined}
                            className={cx(
                                'mt-1 text-sm text-[#4b5563] dark:text-white/70',
                                textColor && 'opacity-70',
                                descriptionClassName,
                            )}
                        >
                            {description}
                        </p>
                    ) : null}
                </div>
                {action}
            </div>

            <PromotionsSlider
                {...sliderProps}
                className={sliderClassName}
                textColor={textColor}
                backgroundColor={backgroundColor ? 'transparent' : undefined}
            />
        </section>
    )
}
