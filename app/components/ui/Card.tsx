'use client'

import Image from 'next/image'
import {
    createContext,
    createElement,
    useContext,
    type ElementType,
    type HTMLAttributes,
    type ReactNode,
} from 'react'

type CardVariant = 'default' | 'elevated' | 'outline' | 'ghost'

type CardContextValue = {
    variant: CardVariant
    interactive: boolean
    backgroundColor?: string
}

const CardContext = createContext<CardContextValue | null>(null)

function useCardContext() {
    const context = useContext(CardContext)
    if (!context) {
        throw new Error('Los subcomponentes de <Card> deben renderizarse dentro de <Card>.')
    }
    return context
}

function cx(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ')
}

const variantClasses: Record<CardVariant, string> = {
    default: 'border-[#111827]/10 bg-white shadow-sm dark:border-white/10 dark:bg-[#0b1b12]',
    elevated: 'border-transparent bg-white shadow-lg dark:bg-[#0b1b12]',
    outline: 'border-[#111827]/15 bg-transparent shadow-none dark:border-white/15',
    ghost: 'border-transparent bg-transparent shadow-none',
}

type CardProps = {
    as?: ElementType
    variant?: CardVariant
    interactive?: boolean
    backgroundColor?: string
    className?: string
    children: ReactNode
} & Omit<HTMLAttributes<HTMLElement>, 'children'>

function CardRoot({
    as,
    variant = 'default',
    interactive = false,
    backgroundColor,
    className,
    children,
    ...rest
}: CardProps) {
    const Component = as ?? 'div'
    const { style, ...restProps } = rest
    const mergedStyle = {
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(style ?? {}),
    }

    return (
        <CardContext.Provider value={{ variant, interactive, backgroundColor }}>
            {createElement(
                Component,
                {
                    ...restProps,
                    style: mergedStyle,
                    className: cx(
                        'relative flex flex-col overflow-hidden rounded-2xl border text-[#111827] transition dark:text-white',
                        variantClasses[variant],
                        interactive &&
                            'group hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-[var(--primary)]/40',
                        className,
                    ),
                },
                children,
            )}
        </CardContext.Provider>
    )
}

type CardMediaAspect = 'square' | 'video' | 'wide'

type CardMediaProps = {
    src?: string
    alt?: string
    aspect?: CardMediaAspect
    fit?: 'cover' | 'contain'
    sizes?: string
    priority?: boolean
    className?: string
    children?: ReactNode
}

const aspectClasses: Record<CardMediaAspect, string> = {
    square: 'aspect-square',
    video: 'aspect-video',
    wide: 'aspect-[16/9]',
}

function CardMedia({
    src,
    alt = '',
    aspect = 'video',
    fit = 'cover',
    sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
    priority,
    className,
    children,
}: CardMediaProps) {
    const { interactive, backgroundColor } = useCardContext()

    return (
        <div
            className={cx(
                'relative w-full overflow-hidden',
                backgroundColor ? 'bg-transparent' : 'bg-[#f3f4f6] dark:bg-white/5',
                aspectClasses[aspect],
                className,
            )}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    fill
                    sizes={sizes}
                    priority={priority}
                    className={cx(
                        fit === 'contain' ? 'object-contain' : 'object-cover',
                        interactive && 'transition-transform duration-300 group-hover:scale-[1.03]',
                    )}
                />
            ) : null}
            {children}
        </div>
    )
}

type CardHeaderProps = HTMLAttributes<HTMLDivElement>

function CardHeader({ className, children, ...rest }: CardHeaderProps) {
    useCardContext()

    return (
        <div {...rest} className={cx('flex items-start justify-between gap-3 px-4 pt-4', className)}>
            {children}
        </div>
    )
}

type CardBodyProps = HTMLAttributes<HTMLDivElement>

function CardBody({ className, children, ...rest }: CardBodyProps) {
    useCardContext()

    return (
        <div {...rest} className={cx('flex flex-1 flex-col gap-2 px-4 py-4', className)}>
            {children}
        </div>
    )
}

type CardTitleProps = HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h2' | 'h3' | 'h4'
}

function CardTitle({ as: Tag = 'h3', className, children, ...rest }: CardTitleProps) {
    useCardContext()

    return (
        <Tag {...rest} className={cx('text-base font-semibold leading-snug tracking-tight', className)}>
            {children}
        </Tag>
    )
}

type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>

function CardDescription({ className, children, ...rest }: CardDescriptionProps) {
    useCardContext()

    return (
        <p {...rest} className={cx('text-sm leading-relaxed text-[#4b5563] dark:text-white/70', className)}>
            {children}
        </p>
    )
}

type CardBadgeTone = 'default' | 'success' | 'warning' | 'danger' | 'info'

const badgeToneClasses: Record<CardBadgeTone, string> = {
    default: 'bg-[#111827]/5 text-[#111827] dark:bg-white/10 dark:text-white',
    success: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300',
    info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300',
}

type CardBadgeProps = HTMLAttributes<HTMLSpanElement> & {
    tone?: CardBadgeTone
}

function CardBadge({ tone = 'default', className, children, ...rest }: CardBadgeProps) {
    useCardContext()

    return (
        <span
            {...rest}
            className={cx(
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
                badgeToneClasses[tone],
                className,
            )}
        >
            {children}
        </span>
    )
}

type CardFooterProps = HTMLAttributes<HTMLDivElement>

function CardFooter({ className, children, ...rest }: CardFooterProps) {
    const { variant } = useCardContext()

    return (
        <div
            {...rest}
            className={cx(
                'mt-auto flex items-center justify-between gap-3 border-t px-4 py-3',
                variant === 'ghost'
                    ? 'border-transparent'
                    : 'border-[#111827]/10 dark:border-white/10',
                className,
            )}
        >
            {children}
        </div>
    )
}

type CardActionsProps = HTMLAttributes<HTMLDivElement>

function CardActions({ className, children, ...rest }: CardActionsProps) {
    useCardContext()

    return (
        <div {...rest} className={cx('flex flex-wrap items-center gap-2', className)}>
            {children}
        </div>
    )
}

const Card = Object.assign(CardRoot, {
    Media: CardMedia,
    Header: CardHeader,
    Body: CardBody,
    Title: CardTitle,
    Description: CardDescription,
    Badge: CardBadge,
    Footer: CardFooter,
    Actions: CardActions,
})

export {
    Card,
    CardRoot,
    CardMedia,
    CardHeader,
    CardBody,
    CardTitle,
    CardDescription,
    CardBadge,
    CardFooter,
    CardActions,
}
export type { CardProps, CardVariant, CardBadgeTone, CardMediaAspect }

export default Card
