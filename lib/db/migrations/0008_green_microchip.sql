CREATE TABLE IF NOT EXISTS "guest_rate_limits" (
	"ip" varchar(255) PRIMARY KEY NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	"last_updated" timestamp DEFAULT now() NOT NULL
);
