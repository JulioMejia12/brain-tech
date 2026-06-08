'use client'

import { useMemo } from 'react'
import { FiDownload, FiFolder, FiLayers } from 'react-icons/fi'

type CatalogItem = {
    id: number
    name: string
    categoria?: string | null
}

type Props = {
    catalogs: CatalogItem[]
    negocioId: string
    borderColor: string
    textColor: string
    badgeClassName: string
    helperText: string
}

function getPartNumber(name: string) {
    const match = name.match(/parte\s*(\d+)/i)
    return match ? Number(match[1]) : Number.POSITIVE_INFINITY
}

function getDisplayCategory(value?: string | null) {
    const normalized = String(value || '').trim()
    return normalized || 'General'
}

export default function StorefrontCatalogDownloads({
    catalogs,
    negocioId,
    borderColor,
    textColor,
    badgeClassName,
    helperText,
}: Props) {
    const groupedCatalogs = useMemo(() => {
        const groups = new Map<string, { title: string; items: CatalogItem[] }>()

        for (const item of catalogs) {
            const title = getDisplayCategory(item.categoria)
            const key = title.toLowerCase()
            const group = groups.get(key)
            if (group) {
                group.items.push(item)
            } else {
                groups.set(key, { title, items: [item] })
            }
        }

        return Array.from(groups.values())
            .map((group) => ({
                ...group,
                items: [...group.items].sort((a, b) => {
                    const partDiff = getPartNumber(a.name) - getPartNumber(b.name)
                    if (partDiff !== 0) return partDiff
                    return a.name.localeCompare(b.name, 'es', { numeric: true, sensitivity: 'base' })
                }),
            }))
            .sort((a, b) => a.title.localeCompare(b.title, 'es', { sensitivity: 'base' }))
    }, [catalogs])

    if (groupedCatalogs.length === 0) return null

    return (
        <div className="mt-4 w-full space-y-4">
            {groupedCatalogs.map((group) => (
                <div
                    key={group.title}
                    className="w-full rounded-2xl border bg-white/95 p-4 shadow-sm"
                    style={{ borderColor }}
                >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <FiFolder className="shrink-0" style={{ color: textColor }} />
                                <h3 className="text-lg font-semibold" style={{ color: textColor }}>
                                    Catálogos de {group.title}
                                </h3>
                            </div>
                            <p className="mt-1 text-sm text-gray-600">
                                {group.items.length === 1
                                    ? helperText
                                    : `Descarga las ${group.items.length} partes en orden para no perderte.`}
                            </p>
                        </div>

                        <span className={`inline-flex items-center gap-2 self-start rounded-full px-3 py-1 text-xs font-semibold ${badgeClassName}`}>
                            <FiLayers className="shrink-0" />
                            {group.items.length} {group.items.length === 1 ? 'archivo' : 'partes'}
                        </span>
                    </div>

                    <div className="mt-4 grid gap-3 md:grid-cols-2">
                        {group.items.map((catalog, index) => (
                            <a
                                key={catalog.id}
                                href={`/api/catalog/${catalog.id}/download?negocioId=${encodeURIComponent(negocioId)}`}
                                className="inline-flex min-h-14 items-center gap-3 rounded-xl border bg-white px-4 py-3 font-medium shadow-sm transition hover:-translate-y-0.5"
                                style={{ borderColor, color: textColor }}
                            >
                                <span className="inline-flex h-8 min-w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                                    style={{ backgroundColor: borderColor }}>
                                    {index + 1}
                                </span>
                                <FiDownload className="shrink-0" />
                                <span className="truncate">{catalog.name}</span>
                            </a>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
