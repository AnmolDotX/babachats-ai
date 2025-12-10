CREATE TABLE IF NOT EXISTS "UserProfile" (
	"userId" uuid PRIMARY KEY NOT NULL,
	"displayName" text,
	"skills" text,
	"hobbies" text,
	"motivations" text,
	"currentFeelings" text,
	"occupation" text,
	"additionalContext" text,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
