-- CreateTable
CREATE TABLE "CharitySubmission" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "charityName" TEXT NOT NULL,
    "website" TEXT,
    "description" TEXT,
    "reason" TEXT,
    "submitterName" TEXT,
    "submitterEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
