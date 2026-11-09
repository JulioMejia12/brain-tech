import { Fragment, type Key, type ReactNode } from 'react'

function cx(...values: Array<string | false | null | undefined>) {
    return values.filter(Boolean).join(' ')
}

export type ProductGridLayoutProps<T> = {
    id?: string
    title: string
    description?: ReactNode
    action?: ReactNode
    items: T[]
    getItemKey: (item: T, index: number) => Key
    renderItem: (item: T, index: number) => ReactNode
    emptyMessage?: string
    textColor?: string
    backgroundColor?: string
    className?: string
    headerClassName?: string
    titleClassName?: string
    descriptionClassName?: string
    gridClassName?: string
    emptyClassName?: string
}

export default function ProductGridLayout<T>({
    id,
    title,
    description,
    action,
    items,
    getItemKey,
    renderItem,
    emptyMessage = 'No hay elementos disponibles por el momento.',
    textColor,
    backgroundColor,
    className,
    headerClassName,
    titleClassName,
    descriptionClassName,
    gridClassName,
    emptyClassName,
}: ProductGridLayoutProps<T>) {
    const customColorsStyle = {
        ...(backgroundColor ? { backgroundColor } : {}),
        ...(textColor ? { color: textColor } : {}),
    }

    return (
        <section
            id={id}
            style={customColorsStyle}
            className={cx('mx-auto w-full max-w-6xl px-4 pb-12 pt-4 sm:px-6', className)}
        >
            <div
                className={cx(
                    'mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between',
                    headerClassName,
                )}
            >
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

            {items.length === 0 ? (
                <div
                    className={cx(
                        'rounded-2xl border border-dashed border-[#111827]/15 px-6 py-12 text-center dark:border-white/15',
                        emptyClassName,
                    )}
                >
                    <p
                        style={textColor ? { color: textColor } : undefined}
                        className={cx(
                            'text-sm text-[#4b5563] dark:text-white/70',
                            textColor && 'opacity-70',
                        )}
                    >
                        {emptyMessage}
                    </p>
                </div>
            ) : (
                <div
                    className={cx(
                        'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3',
                        gridClassName,
                    )}
                >
                    {items.map((item, index) => (
                        <Fragment key={getItemKey(item, index)}>{renderItem(item, index)}</Fragment>
                    ))}
                </div>
            )}
        </section>
    )
}
