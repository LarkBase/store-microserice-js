-- CreateTable
CREATE TABLE "AIResponse" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AIResponse_alertId_key" ON "AIResponse"("alertId");

-- AddForeignKey
ALTER TABLE "AIResponse" ADD CONSTRAINT "AIResponse_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "Alert"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
