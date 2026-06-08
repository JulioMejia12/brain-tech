import PromotionForm from '../PromotionForm'
import { marronProductsSellProps } from '@/app/lib/productsSellConfig'

export const metadata = {
    title: 'Crear promoción — Marron'
}

export default function NewPromotionPage() {
    const bg = marronProductsSellProps.bgColor || '#fff'
    const headingColor = marronProductsSellProps.secondary || '#111'

    return (
        <div style={{ background: bg }}>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6" style={{ color: headingColor }}>Crear promoción</h1>
                <div className="bg-white rounded-lg p-6 shadow">
                    <PromotionForm />
                </div>
            </div>
        </div>
    )
}
