const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const { randomUUID } = require('crypto')

const prisma = new PrismaClient()

async function run() {
    console.log('Starting backfill: hashing passwords for users without a password...')
    const users = await prisma.user.findMany({ where: { password: null } })
    console.log(`Found ${users.length} users without password`)

    for (const u of users) {
        const plain = randomUUID()
        const hash = bcrypt.hashSync(plain, 10)
        await prisma.user.update({ where: { id: u.id }, data: { password: hash } })
        console.log(`Backfilled user id=${u.id} email=${u.email}`)
    }

    console.log('Backfill complete')
}

run()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
