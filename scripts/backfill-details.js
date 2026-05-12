#!/usr/bin/env node
// Backfill existing products to have an empty `details` JSON array if missing
// Run with: node scripts/backfill-details.js

const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Backfilling product.details...')
    const products = await prisma.product.findMany({ select: { id: true, details: true } })
    let updated = 0
    for (const p of products) {
        if (p.details == null) {
            await prisma.product.update({ where: { id: p.id }, data: { details: [] } })
            updated++
        }
    }
    console.log(`Updated ${updated} products`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
