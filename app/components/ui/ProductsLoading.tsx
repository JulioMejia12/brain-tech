import React from 'react'

type Props = {
    message?: string
}

export default function ProductsLoading({ message = 'Cargando productos...' }: Props) {
    return (
        <div className="mx-auto max-w-4xl px-4 py-6 text-sm text-gray-600">{message}</div>
    )
}
