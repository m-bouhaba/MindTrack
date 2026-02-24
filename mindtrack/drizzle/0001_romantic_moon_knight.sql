CREATE TABLE "habit_completions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"habit_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"date" varchar(20) NOT NULL
);
