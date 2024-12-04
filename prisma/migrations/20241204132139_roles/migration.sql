/*
  Warnings:

  - You are about to drop the column `ROLE` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "ROLE",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
