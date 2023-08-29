-- CreateTable
CREATE TABLE "posts" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medias" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "medias_pkey" PRIMARY KEY ("id")
);
