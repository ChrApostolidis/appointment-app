ALTER TABLE "provider_working_hours" RENAME COLUMN "start_time" TO "hours";--> statement-breakpoint
ALTER TABLE "provider_working_hours" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "provider_working_hours" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "provider_working_hours" DROP COLUMN "day";--> statement-breakpoint
ALTER TABLE "provider_working_hours" DROP COLUMN "end_time";--> statement-breakpoint
ALTER TABLE "provider_working_hours" DROP COLUMN "enabled";