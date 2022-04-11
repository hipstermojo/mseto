-- CreateTable
CREATE TABLE "Pack" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Puzzle" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "packId" TEXT NOT NULL,

    CONSTRAINT "Puzzle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Word" (
    "text" TEXT NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("text")
);

-- CreateTable
CREATE TABLE "WordPuzzle" (
    "puzzleId" TEXT NOT NULL,
    "wordId" TEXT NOT NULL,

    CONSTRAINT "WordPuzzle_pkey" PRIMARY KEY ("puzzleId","wordId")
);

-- AddForeignKey
ALTER TABLE "Puzzle" ADD CONSTRAINT "Puzzle_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPuzzle" ADD CONSTRAINT "WordPuzzle_puzzleId_fkey" FOREIGN KEY ("puzzleId") REFERENCES "Puzzle"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WordPuzzle" ADD CONSTRAINT "WordPuzzle_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("text") ON DELETE CASCADE ON UPDATE CASCADE;
