-- CreateTable
CREATE TABLE "Table" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "Table_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "table_id" INTEGER NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subtheme" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "theme_id" INTEGER NOT NULL,

    CONSTRAINT "Subtheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Descriptor" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "subtheme_id" INTEGER NOT NULL,

    CONSTRAINT "Descriptor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Theme" ADD CONSTRAINT "Theme_table_id_fkey" FOREIGN KEY ("table_id") REFERENCES "Table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subtheme" ADD CONSTRAINT "Subtheme_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Descriptor" ADD CONSTRAINT "Descriptor_subtheme_id_fkey" FOREIGN KEY ("subtheme_id") REFERENCES "Subtheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
