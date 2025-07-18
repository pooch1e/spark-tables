CREATE TABLE "descriptors" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"subtheme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subthemes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"theme_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "themes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"order" integer NOT NULL,
	"table_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
