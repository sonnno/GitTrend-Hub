-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
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
    "starsPrev" INTEGER NOT NULL DEFAULT 0,
    "starsGrowth" REAL NOT NULL DEFAULT 0,
    "growthTier" TEXT NOT NULL DEFAULT 'none',
    "cachedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Project" ("cachedAt", "createdAt", "description", "forks", "fullName", "githubId", "htmlUrl", "id", "issues", "language", "name", "owner", "ownerAvatar", "pushedAt", "stars") SELECT "cachedAt", "createdAt", "description", "forks", "fullName", "githubId", "htmlUrl", "id", "issues", "language", "name", "owner", "ownerAvatar", "pushedAt", "stars" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_githubId_key" ON "Project"("githubId");
CREATE INDEX "Project_githubId_idx" ON "Project"("githubId");
CREATE INDEX "Project_stars_idx" ON "Project"("stars");
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");
CREATE INDEX "Project_pushedAt_idx" ON "Project"("pushedAt");
CREATE INDEX "Project_growthTier_idx" ON "Project"("growthTier");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
