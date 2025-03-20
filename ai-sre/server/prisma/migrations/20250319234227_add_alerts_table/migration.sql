-- CreateTable
CREATE TABLE "Alert" (
    "id" TEXT NOT NULL,
    "alertName" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "description" TEXT,
    "instance" TEXT NOT NULL,
    "job" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);
