import PromotionForm from '../PromotionForm'

export const metadata = {
    title: 'Crear promoción — Marron'
}

export default function NewPromotionPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Crear promoción</h1>
            <div className="bg-white rounded-lg p-6 shadow">
                <PromotionForm />
            </div>
        </div>
    )
}
