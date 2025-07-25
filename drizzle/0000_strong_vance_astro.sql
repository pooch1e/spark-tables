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
	"topic_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topics" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "descriptors" ADD CONSTRAINT "descriptors_subtheme_id_subthemes_id_fk" FOREIGN KEY ("subtheme_id") REFERENCES "public"."subthemes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subthemes" ADD CONSTRAINT "subthemes_theme_id_themes_id_fk" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "themes" ADD CONSTRAINT "themes_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;