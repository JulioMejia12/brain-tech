# Compartir productos por WhatsApp

Implementación aislada y reutilizable para compartir productos por WhatsApp. No modifica la lógica existente de `ProductsSell` ni `productWhatsApp.ts`.

## Archivos

- `app/lib/productWhatsAppShare.ts`: utilidades puras para construir la URL del producto, el mensaje y el enlace de WhatsApp.
- `app/components/catalog/ProductWhatsAppShareButton.tsx`: botón cliente reutilizable.

## Uso del botón

```tsx
import ProductWhatsAppShareButton from '@/app/components/catalog/ProductWhatsAppShareButton'

<ProductWhatsAppShareButton
    product={product}
    storeBasePath="/tienda-betterware"
    productPath="detail"
    storeName="Tienda Betterware"
    label="Compartir"
/>
```

Para una página con detalle de producto:

```tsx
<ProductWhatsAppShareButton
    product={product}
    storeBasePath="/mi-tienda"
    productPath="detail"
    storeName="Mi Tienda"
/>
```

La URL compartida debe ser una página con metadatos Open Graph e imagen del producto para que WhatsApp muestre la vista previa. En Betterware se usa `app/tienda-betterware/product/[id]/page.tsx`.

### Props

| Prop | Tipo | Default | Descripción |
| --- | --- | --- | --- |
| `product` | `ShareableProduct` | Requerido | Producto a compartir. |
| `storeBasePath` | `string` | `/` | Ruta base de la tienda. |
| `shareBaseUrl` | `string` | `NEXT_PUBLIC_SITE_URL` o URL de producción | Dominio usado fuera de producción. |
| `productPath` | `'detail' \| 'store'` | `'detail'` | Comparte el detalle del producto o la página de la tienda. |
| `includePreview` | `boolean` | `true` si es `detail` | Agrega `preview` y `force_preview` a la URL. |
| `storeName` | `string` | `nuestra tienda` | Nombre usado en el mensaje por defecto. |
| `label` | `string` | `Compartir` | Texto del botón. |
| `showIcon` | `boolean` | `true` | Muestra el icono de WhatsApp. |
| `className` | `string` | Estilo incluido | Clases del botón. |
| `style` | `CSSProperties` | - | Estilos inline, útil para temas. |
| `disabled` | `boolean` | `false` | Deshabilita el botón. |
| `onShared` | `(result) => void` | - | Callback con `whatsappUrl`, `productUrl` y `message`. |

## Uso de las utilidades

```ts
import {
    buildProductWhatsAppShare,
    buildProductWhatsAppShareUrl,
    buildProductShareLink,
    buildProductShareMessage,
    openProductWhatsAppShare,
    shareProductViaWhatsApp,
} from '@/app/lib/productWhatsAppShare'

const productUrl = buildProductShareLink(product, {
    storeBasePath: '/mi-tienda',
    productPath: 'detail',
})

const message = buildProductShareMessage(product, productUrl, 'Mi Tienda')

const whatsappUrl = buildProductWhatsAppShareUrl({
    product,
    storeBasePath: '/mi-tienda',
    storeName: 'Mi Tienda',
})

const result = buildProductWhatsAppShare({
    product,
    storeBasePath: '/mi-tienda',
    storeName: 'Mi Tienda',
})

openProductWhatsAppShare({
    product,
    storeBasePath: '/mi-tienda',
    storeName: 'Mi Tienda',
})
```

## Comportamiento

- La URL incluye `utm_source=whatsapp` y `utm_medium=share`.
- En modo `detail` se agrega `preview` y `force_preview=1` por defecto.
- El mensaje incluye URL, nombre, precio, promoción, descripción y detalles.
- Soporta `promotionPrice`, `promotion_price` y `promoPrice`.
- En localhost usa `shareBaseUrl`, `NEXT_PUBLIC_SITE_URL` o la URL de producción por defecto.
