/*
  Warnings:

  - A unique constraint covering the columns `[title,username]` on the table `medias` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "image" TEXT;

-- CreateTable
CREATE TABLE "publications" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "mediaId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,

    CONSTRAINT "publications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medias_title_username_key" ON "medias"("title", "username");

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "medias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "publications" ADD CONSTRAINT "publications_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
