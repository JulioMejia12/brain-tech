import PromotionForm from '../PromotionForm'
import { bazarcitoProductsSellProps } from '@/app/lib/productsSellConfig'

export const metadata = {
    title: 'Crear promoción — Bazarcito'
}

export default function NewPromotionPage() {
    const bg = bazarcitoProductsSellProps.bgColor || '#ffb6ef'

    return (
        <div style={{ background: bg }} className="min-h-screen">
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Crear promoción</h1>
                <div className="bg-white rounded-lg p-6 shadow">
                    <PromotionForm />
                </div>
            </div>
        </div>
    )
}
