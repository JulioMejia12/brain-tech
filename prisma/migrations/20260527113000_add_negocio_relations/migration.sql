-- CreateTable
CREATE TABLE IF NOT EXISTS `Negocio` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `whatsapp` VARCHAR(191) NULL,
    `logo` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Negocio_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable
ALTER TABLE `User`
    ADD COLUMN IF NOT EXISTS `negocioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Product`
    ADD COLUMN IF NOT EXISTS `negocioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Promotion`
    ADD COLUMN IF NOT EXISTS `negocioId` INTEGER NULL;

-- AlterTable
ALTER TABLE `Category`
    ADD COLUMN IF NOT EXISTS `negocioId` INTEGER NULL;
