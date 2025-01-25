-- CreateTable
CREATE TABLE "Establishment" (
    "id" SERIAL NOT NULL,
    "merchantId" INTEGER NOT NULL,
    "income" DOUBLE PRECISION NOT NULL,
    "employees" INTEGER NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Establishment" ADD CONSTRAINT "Establishment_merchantId_fkey" FOREIGN KEY ("merchantId") REFERENCES "Merchant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
