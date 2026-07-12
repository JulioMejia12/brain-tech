# Cómo verificar que las imágenes se muestran en WhatsApp

## Cambios realizados

1. **Metadata Open Graph mejorada**:
   - Cambiado `type: 'website'` a `type: 'product'` para productos individuales
   - Agregado `secureUrl` para las imágenes
   - Agregado `type: 'image/jpeg'` para las imágenes
   - Cambiado `siteName` de 'brain-tech-kappa' a 'Marron' y 'Bazarcito online'
   - Agregado fallback para descripción si está vacía

2. **Archivos modificados**:
   - `/app/marron/product/[id]/page.tsx`
   - `/app/bazarcito/product/[id]/page.tsx`
   - `/app/marron/layout.tsx`
   - `/app/bazarcito/layout.tsx`

## Pasos para verificar la corrección

### 1. Limpiar caché de WhatsApp usando Facebook Debugger

WhatsApp usa el mismo sistema de preview que Facebook, así que puedes usar su herramienta:

1. Ve a: **https://developers.facebook.com/tools/debug/**
2. Pega la URL del producto (ejemplo: `https://brain-tech-kappa.vercel.app/marron/product/1950001`)
3. Haz clic en **"Debug"** o **"Scrape Again"**
4. Verifica que aparezca la imagen en la preview
5. Si ves errores, revísalos en la sección "Warnings That Should Be Fixed"

### 2. Verificar que la imagen de Cloudinary es accesible

1. Abre la URL de la imagen directamente en el navegador
2. Verifica que se cargue correctamente
3. Si usa Cloudinary, asegúrate de que las imágenes son públicas

### 3. Probar en WhatsApp Web/Móvil

Después de limpiar caché:

1. Abre WhatsApp Web o móvil
2. Comparte el enlace del producto
3. Espera 2-3 segundos para que cargue la preview
4. Deberías ver:
   - Nombre del producto como título
   - Descripción del producto
   - Imagen del producto

### 4. Si sigue sin funcionar

**Opción A: Verifica las variables de entorno**

Asegúrate de que `NEXT_PUBLIC_SITE_URL` está configurada correctamente en tu `.env` o en Vercel:

```bash
NEXT_PUBLIC_SITE_URL=https://brain-tech-kappa.vercel.app
```

**Opción B: Verifica que el deploy se completó**

1. Ve a tu panel de Vercel
2. Verifica que el último deployment se haya completado correctamente
3. Comprueba los logs para ver si hay errores

**Opción C: Inspecciona el HTML generado**

1. Abre la página del producto en el navegador
2. Haz clic derecho → "Ver código fuente"
3. Busca las etiquetas `<meta property="og:image">`
4. Verifica que la URL de la imagen sea absoluta y comience con `https://`

Ejemplo de lo que deberías ver:

```html
<meta property="og:type" content="product">
<meta property="og:url" content="https://brain-tech-kappa.vercel.app/marron/product/1950001">
<meta property="og:site_name" content="Marron">
<meta property="og:title" content="Lámpara para Uñas con Soporte Cel">
<meta property="og:description" content="Incluye dos limas de uñas...">
<meta property="og:image" content="https://res.cloudinary.com/ddfj0omil/image/upload/...">
<meta property="og:image:secure_url" content="https://res.cloudinary.com/ddfj0omil/image/upload/...">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:type" content="image/jpeg">
```

### 5. Timeframe esperado

- El caché de WhatsApp puede tardar **hasta 24 horas** en actualizarse naturalmente
- Usar el Facebook Debugger fuerza la actualización inmediata
- Si acabas de deployar, espera **2-3 minutos** para que Vercel propague los cambios

## Comandos útiles

```bash
# Reconstruir la aplicación localmente
npm run build

# Verificar que no hay errores de TypeScript
npm run type-check

# Deploy a Vercel (si usas Vercel CLI)
vercel --prod
```

## Contacto

Si después de seguir estos pasos el problema persiste, revisa:
1. Los logs de error de Next.js
2. La consola del navegador en la página del producto
3. Que el producto efectivamente existe en la base de datos con una imagen válida
