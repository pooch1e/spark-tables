CREATE TABLE "Descriptor" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"subtheme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Subtheme" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"theme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "Theme" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"table_id" integer NOT NULL
);
