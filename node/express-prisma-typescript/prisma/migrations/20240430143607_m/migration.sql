-- CreateTable
CREATE TABLE "ProfileVisibility" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL,
    "profileTypeId" UUID NOT NULL,

    CONSTRAINT "ProfileVisibility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfileType" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "type" TEXT NOT NULL,

    CONSTRAINT "ProfileType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileVisibility_userId_key" ON "ProfileVisibility"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProfileVisibility_profileTypeId_key" ON "ProfileVisibility"("profileTypeId");

-- AddForeignKey
ALTER TABLE "ProfileVisibility" ADD CONSTRAINT "ProfileVisibility_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileVisibility" ADD CONSTRAINT "ProfileVisibility_profileTypeId_fkey" FOREIGN KEY ("profileTypeId") REFERENCES "ProfileType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
