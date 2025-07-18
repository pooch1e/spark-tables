CREATE TABLE "descriptor" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"subtheme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subtheme" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"theme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "table" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "theme" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"table_id" integer NOT NULL
);
