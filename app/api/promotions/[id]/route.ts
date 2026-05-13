import { NextResponse, type NextRequest } from 'next/server'
import cloudinary from 'cloudinary'
import { Readable } from 'stream'
import { prisma } from '@/app/lib/prisma'

export async function PUT(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)

        const contentType = req.headers.get('content-type') || ''
        let body: any = {}
        let uploadedImageUrl: string | null = null
        let uploadedImagePublicId: string | null = null

        if (contentType.includes('multipart/form-data')) {
            const form = await req.formData()
            body.name = String(form.get('name') || '')
            body.description = String(form.get('description') || '')
            body.specialPrice = String(form.get('specialPrice') || '')

            const imageFiles = form.getAll('imageFile') || []
            if (imageFiles.length > 1) {
                return NextResponse.json({ error: 'Solo se permite una imagen' }, { status: 400 })
            }
            const file = form.get('imageFile')
            if (file instanceof File && typeof file.arrayBuffer === 'function') {
                const buffer = Buffer.from(await file.arrayBuffer())
                if (process.env.CLOUDINARY_URL) {
                    try {
                        cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                        const uploadResult = await new Promise<any>((resolve, reject) => {
                            const uploadStream = cloudinary.v2.uploader.upload_stream({ folder: 'promotions' }, (error, result) => {
                                if (error) return reject(error)
                                if (!result) return reject(new Error('Missing upload result'))
                                resolve(result)
                            })
                            Readable.from(buffer).pipe(uploadStream)
                        })
                        uploadedImageUrl = uploadResult.secure_url
                        uploadedImagePublicId = uploadResult.public_id
                    } catch (err) {
                        console.error('Cloudinary upload failed', err)
                    }
                }
            }
        } else {
            body = await req.json().catch(() => ({}))
        }

        const prismaAny = prisma as any
        const existing = await prismaAny.promotion.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const updateData: any = {}
        if (body.name !== undefined) {
            const trimmed = String(body.name || '').trim()
            if (!trimmed) return NextResponse.json({ error: 'El campo name no puede estar vacío' }, { status: 400 })
            updateData.name = trimmed
        }
        if (body.description !== undefined) updateData.description = String(body.description || '').trim()
        if (body.specialPrice !== undefined) {
            const sp = String(body.specialPrice || '').trim()
            if (!sp) return NextResponse.json({ error: 'El campo specialPrice no puede estar vacío' }, { status: 400 })
            updateData.specialPrice = sp
        }
        if (uploadedImageUrl) {
            // If there's an existing image, delete it from Cloudinary
            try {
                const prismaAny = prisma as any
                if (existing.imagePublicId && process.env.CLOUDINARY_URL) {
                    cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                    cloudinary.v2.uploader.destroy(existing.imagePublicId, (err: unknown, res: unknown) => {
                        if (err) console.warn('Failed to remove previous Cloudinary image:', err)
                    })
                }
            } catch (e) {
                console.warn('Error removing previous Cloudinary image:', e)
            }
            updateData.image = uploadedImageUrl
            updateData.imagePublicId = uploadedImagePublicId || null
        } else if (body.image !== undefined) updateData.image = String(body.image || '').trim()

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
        }

        const updated = await prismaAny.promotion.update({ where: { id }, data: updateData })
        return NextResponse.json({ data: updated })
    } catch (e) {
        console.error('Update promotion error', e)
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
    }
}

export async function GET(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const prismaAny = prisma as any
        const item = await prismaAny.promotion.findUnique({ where: { id } })
        if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ data: item })
    } catch (e) {
        console.error('Get promotion by id error', e)
        return NextResponse.json({ error: 'Failed to fetch promotion' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, ctx: any) {
    try {
        const params = await ctx?.params
        const id = Number(params?.id)
        const prismaAny = prisma as any
        const existing = await prismaAny.promotion.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        // remove image from Cloudinary if present
        try {
            if (existing.imagePublicId && process.env.CLOUDINARY_URL) {
                cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
                await new Promise<void>((resolve) => {
                    cloudinary.v2.uploader.destroy(existing.imagePublicId, (err: unknown) => {
                        if (err) console.warn('Failed to remove Cloudinary image on delete:', err)
                        resolve()
                    })
                })
            }
        } catch (e) {
            console.warn('Error deleting Cloudinary image:', e)
        }

        await prismaAny.promotion.delete({ where: { id } })
        return new NextResponse(null, { status: 204 })
    } catch (e) {
        console.error('Delete promotion error', e)
        return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
    }
}
