ALTER TABLE "appointments" DROP CONSTRAINT "appointments_provider_id_providers_id_fk";
--> statement-breakpoint
ALTER TABLE "providers" ADD CONSTRAINT "providers_user_id_unique" UNIQUE("user_id");
--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_provider_id_providers_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("user_id") ON DELETE cascade ON UPDATE no action;