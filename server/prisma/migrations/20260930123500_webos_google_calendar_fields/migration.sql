-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "googleEventId" TEXT;

-- AlterTable
ALTER TABLE "Site" ADD COLUMN     "googleCalendarConnected" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "googleCalendarId" TEXT,
ADD COLUMN     "googleCalendarRefreshToken" TEXT;
