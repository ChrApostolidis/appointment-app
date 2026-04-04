CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"description" varchar(255),
	"price" integer NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "service_id" uuid;--> statement-breakpoint
ALTER TABLE "appointments" ADD COLUMN "service_name" varchar(100);--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_provider_id_providers_user_id_fk" FOREIGN KEY ("provider_id") REFERENCES "public"."providers"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE no action ON UPDATE no action;