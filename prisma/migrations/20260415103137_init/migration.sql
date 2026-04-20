-- CreateTable
CREATE TABLE "Project" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "ownerAvatar" TEXT NOT NULL,
    "description" TEXT,
    "language" TEXT,
    "stars" INTEGER NOT NULL,
    "forks" INTEGER NOT NULL,
    "issues" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "pushedAt" DATETIME NOT NULL,
    "htmlUrl" TEXT NOT NULL,
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "githubId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Collection_githubId_fkey" FOREIGN KEY ("githubId") REFERENCES "Project" ("githubId") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Project_githubId_key" ON "Project"("githubId");

-- CreateIndex
CREATE INDEX "Project_githubId_idx" ON "Project"("githubId");

-- CreateIndex
CREATE INDEX "Project_stars_idx" ON "Project"("stars");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "Project_pushedAt_idx" ON "Project"("pushedAt");

-- CreateIndex
CREATE INDEX "Collection_githubId_idx" ON "Collection"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "Collection_githubId_key" ON "Collection"("githubId");
