import { revalidatePath } from 'next/cache'

export function revalidateProductPaths(id: number | string) {
    const productId = String(id)

    revalidatePath(`/bazarcito/product/${productId}`)
    revalidatePath(`/bazarcito/products/${productId}`)
    revalidatePath(`/marron/product/${productId}`)
    revalidatePath(`/marron/products/${productId}`)
    revalidatePath(`/cremeria/product/${productId}`)
    revalidatePath(`/cremeria/products/${productId}`)
    revalidatePath(`/share/product/${productId}`)

    revalidatePath('/bazarcito')
    revalidatePath('/marron')
    revalidatePath('/cremeria')
}
