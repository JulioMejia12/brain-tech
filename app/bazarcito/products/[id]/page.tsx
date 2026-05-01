import ProductPage from '../../product/[id]/page'

export default async function Page({ params }: { params: Promise<{ id?: string }> }) {
    // Render the same product detail component used by the canonical route
    return <ProductPage params={params as Promise<{ id: string }>} />
}
