const PLATERIAS_CATEGORY_PREFIX = 'platerias:'

export function toPlateriasCategoryName(category?: string | null) {
    const normalized = String(category || 'general').trim().toLowerCase()
    return `${PLATERIAS_CATEGORY_PREFIX}${normalized}`
}

export function fromPlateriasCategoryName(category?: string | null) {
    const raw = String(category || '').trim()
    if (raw.startsWith(PLATERIAS_CATEGORY_PREFIX)) {
        return raw.slice(PLATERIAS_CATEGORY_PREFIX.length) || 'general'
    }

    return raw || 'general'
}

export function isPlateriasCategoryName(category?: string | null) {
    return String(category || '').trim().toLowerCase().startsWith(PLATERIAS_CATEGORY_PREFIX)
}

export function plateriasWhereClause() {
    return {
        category: {
            name: {
                startsWith: PLATERIAS_CATEGORY_PREFIX,
            },
        },
    }
}

export function bazarcitoWhereClause() {
    return {
        NOT: {
            category: {
                name: {
                    startsWith: PLATERIAS_CATEGORY_PREFIX,
                },
            },
        },
    }
}
