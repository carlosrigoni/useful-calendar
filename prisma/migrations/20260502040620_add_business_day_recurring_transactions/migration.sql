-- CreateEnum
CREATE TYPE "RecurringDayRule" AS ENUM ('CALENDAR_DAY', 'BUSINESS_DAY');

-- AlterTable
ALTER TABLE "RecurringTransaction" ADD COLUMN     "businessDayOfMonth" INTEGER,
ADD COLUMN     "dayRule" "RecurringDayRule" NOT NULL DEFAULT 'CALENDAR_DAY';
