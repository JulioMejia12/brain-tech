import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'

const DATA_FILE = path.resolve(process.cwd(), 'data', 'promotions.json')

async function ensureDataFile() {
    try {
        await fs.mkdir(path.dirname(DATA_FILE), { recursive: true })
        await fs.access(DATA_FILE)
    } catch {
        await fs.writeFile(DATA_FILE, '[]')
    }
}

async function readPromotions() {
    await ensureDataFile()
    const raw = await fs.readFile(DATA_FILE, 'utf-8')
    return JSON.parse(raw || '[]')
}

async function writePromotions(items: any[]) {
    await ensureDataFile()
    await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export async function GET() {
    try {
        const items = await readPromotions()
        return NextResponse.json({ data: items })
    } catch (e) {
        console.error('GET /api/promotions error', e)
        return NextResponse.json({ error: 'Failed to read promotions' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        await ensureDataFile()
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
        const id = Date.now()
        const item = { id, name: body.name || '', description: body.description || '', specialPrice: body.specialPrice || '', image: uploadedImageUrl || body.image || '' }
        items.unshift(item)
        await writePromotions(items)
        return NextResponse.json({ data: item }, { status: 201 })
    } catch (error) {
        console.error('POST /api/promotions error', error)
        return NextResponse.json({ error: 'Failed to create promotion' }, { status: 500 })
    }
}
