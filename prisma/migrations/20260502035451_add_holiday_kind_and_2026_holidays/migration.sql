-- CreateEnum
CREATE TYPE "HolidayKind" AS ENUM ('NATIONAL', 'OPTIONAL', 'MUNICIPAL');

-- AlterTable
ALTER TABLE "Holiday" ADD COLUMN     "kind" "HolidayKind" NOT NULL DEFAULT 'NATIONAL';
