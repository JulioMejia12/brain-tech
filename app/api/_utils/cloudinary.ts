import cloudinary from 'cloudinary'

export function extractCloudinaryPublicId(urlStr: string | null | undefined) {
    if (!urlStr) return null
    try {
        const u = new URL(urlStr)
        const parts = u.pathname.split('/').filter(Boolean)
        const uploadIdx = parts.findIndex((p) => p === 'upload')
        if (uploadIdx === -1) return null

        let rest = parts.slice(uploadIdx + 1)
        const versionIdx = rest.findIndex((p) => /^v\d+$/.test(p))

        if (versionIdx !== -1) {
            rest = rest.slice(versionIdx + 1)
        } else if (rest.length > 1 && /[,:]/.test(rest[0])) {
            rest = rest.slice(1)
        }

        const publicPath = rest.join('/').replace(/\.[^.]+$/, '')
        return publicPath || null
    } catch {
        return null
    }
}

function configureCloudinary() {
    if (process.env.CLOUDINARY_URL) {
        cloudinary.v2.config({ cloudinary_url: process.env.CLOUDINARY_URL })
        return true
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME
    const apiKey = process.env.CLOUDINARY_API_KEY
    const apiSecret = process.env.CLOUDINARY_API_SECRET

    if (!cloudName || !apiKey || !apiSecret) return false

    cloudinary.v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
    return true
}

export async function deleteCloudinaryImageByUrl(imageUrl: string | null | undefined) {
    if (!imageUrl || !String(imageUrl).includes('res.cloudinary.com')) return
    if (!configureCloudinary()) return

    const publicId = extractCloudinaryPublicId(String(imageUrl))
    if (!publicId) return

    await new Promise<void>((resolve) => {
        cloudinary.v2.uploader.destroy(publicId, { invalidate: true }, (error, result) => {
            if (error) {
                console.warn('Cloudinary delete failed', { publicId, error })
            } else {
                console.info('Cloudinary image deleted', { publicId, result })
            }
            resolve()
        })
    })
}
