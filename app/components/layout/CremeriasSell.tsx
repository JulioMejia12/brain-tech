'use client'

import ProductsSell, { type ProductsSellProps } from './ProductsSell'
import { ProductCard } from '@/app/components/catalog/product-card'

const CremeriasSell = (props: ProductsSellProps) => {
    return (
        <ProductsSell
            {...props}
            renderProductCard={({
                product,
                primary,
                isAdmin,
                editing,
                deleting,
                requesting,
                sharing,
                onEdit,
                onDelete,
                onRequest,
                onShare,
            }) => (
                <ProductCard product={product} primary={primary}>
                    <ProductCard.Image />
                    <ProductCard.Body>
                        <ProductCard.AdminActions isAdmin={isAdmin}>
                            <ProductCard.EditButton loading={editing} onClick={onEdit} />
                            <ProductCard.DeleteButton loading={deleting} onClick={onDelete} />
                        </ProductCard.AdminActions>
                        <ProductCard.Title />
                        <ProductCard.Description />
                        <ProductCard.Details />
                        <ProductCard.Actions>
                            <div className="flex items-baseline gap-2">
                                <ProductCard.Price />
                                <b className="font-bold">KILO</b>
                            </div>
                            <ProductCard.ShareButton loading={sharing} onClick={onShare} />
                        </ProductCard.Actions>
                    </ProductCard.Body>
                </ProductCard>
            )}
        />
    )
}

export default CremeriasSell
