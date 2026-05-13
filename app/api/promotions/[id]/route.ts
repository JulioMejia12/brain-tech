import { NextResponse, type NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'promotions.json')

async function readPromotions() {
    try {
        const raw = await fs.readFile(DATA_FILE, 'utf-8')
        return JSON.parse(raw || '[]')
    } catch {
        return []
    }
}

async function writePromotions(items: any[]) {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function PUT(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const contentType = req.headers.get('content-type') || ''
        let body: any = {}
        let uploadedImageUrl: string | null = null

        if (contentType.includes('multipart/form-data')) {
            const form = await req.formData()
            body.name = String(form.get('name') || '')
            body.description = String(form.get('description') || '')
            body.specialPrice = String(form.get('specialPrice') || '')

            const file = form.get('imageFile')
            if (file instanceof File && typeof file.arrayBuffer === 'function') {
                const buffer = Buffer.from(await file.arrayBuffer())
                if (process.env.CLOUDINARY_URL) {
                    try {
                        cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                        uploadedImageUrl = await new Promise<string>((resolve, reject) => {
                            const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'promotions' }, (error, result) => {
                                if (error) return reject(error)
                                if (!result?.secure_url) return reject(new Error('Missing secure_url'))
                                resolve(result.secure_url)
                            })
                            Readable.from(buffer).pipe(uploadStream)
                        })
                    } catch (e) {
                        console.error('Cloudinary upload failed', e)
                    }
                }
            }
        } else {
            body = await req.json().catch(() => ({}))
        }

        const items = await readPromotions()
        const idParam = params?.id
        const idNum = Number(idParam)
        const idx = items.findIndex((p: any) => String(p.id) === String(idParam) || (Number.isFinite(idNum) && Number(p.id) === idNum))
        if (idx === -1) {
            console.warn('Promotion id not found for PUT:', { idParam, itemsIds: items.map((i: any) => i.id) })
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        const current = items[idx]
        const updated = { ...current }
        if (body.name) updated.name = body.name
        if (body.description) updated.description = body.description
        if (body.specialPrice) updated.specialPrice = body.specialPrice
        if (uploadedImageUrl) updated.image = uploadedImageUrl

        items[idx] = updated
        await writePromotions(items)
        return NextResponse.json({ data: updated })
    } catch (e) {
        console.error('Update promotion error', e)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const idParam = params?.id
        const idNum = Number(idParam)
        const items = await readPromotions()
        const filtered = items.filter((p: any) => !(String(p.id) === String(idParam) || (Number.isFinite(idNum) && Number(p.id) === idNum)))
        if (filtered.length === items.length) {
            console.warn('Promotion id not found for DELETE, attempting loose match:', { idParam, itemsIds: items.map((i: any) => i.id) })
            // Try a loose match (endsWith or digit-only equality) as fallback
            const digitsOnly = (s: any) => String(s).replace(/\D/g, '')
            const looseIdx = items.findIndex((p: any) => {
                try {
                    if (String(p.id).endsWith(String(idParam))) return true
                    if (digitsOnly(p.id) === digitsOnly(idParam)) return true
                } catch (e) {
                    return false
                }
                return false
            })
            if (looseIdx !== -1) {
                console.warn('Loose match found, deleting id at index', looseIdx, 'id=', items[looseIdx].id)
                items.splice(looseIdx, 1)
                await writePromotions(items)
                return new NextResponse(null, { status: 204 })
            }

            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
        await writePromotions(filtered)
        return new NextResponse(null, { status: 204 })
    } catch (e) {
        console.error('Delete promotion error', e)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
