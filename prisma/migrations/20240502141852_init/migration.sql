-- CreateEnum
CREATE TYPE "view_types" AS ENUM ('blog', 'project', 'work');

-- CreateTable
CREATE TABLE "guestbook" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "body" TEXT NOT NULL,
    "createdBy" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6),

    CONSTRAINT "guestbook_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redirects" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "destination" VARCHAR(255) NOT NULL,
    "permanent" BOOLEAN NOT NULL,

    CONSTRAINT "redirects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "views" (
    "type" "view_types" NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "count" INTEGER NOT NULL,

    CONSTRAINT "views_pkey" PRIMARY KEY ("slug")
);

-- CreateIndex
CREATE INDEX "views_type_slug_idx" ON "views"("type", "slug");
