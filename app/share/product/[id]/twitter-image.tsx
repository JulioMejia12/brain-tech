import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'Vista previa de producto'
export const contentType = 'image/png'
export const size = { width: 1200, height: 630 }

export default function TwitterImage({ params }: { params: { id: string } }) {
  const id = params?.id || 'producto'

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          background: '#fff',
          color: '#111',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <div style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 40, fontWeight: 700, marginBottom: 12 }}>Bazarcito</div>
          <div style={{ fontSize: 28, marginBottom: 8 }}>Producto #{id}</div>
          <div style={{ fontSize: 18, color: '#666' }}>Comparte este producto en WhatsApp</div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height,
    }
  )
}
