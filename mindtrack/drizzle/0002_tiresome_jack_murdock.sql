ALTER TABLE "users" ADD COLUMN "onboarding_completed" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "onboarding_mood" varchar(50);