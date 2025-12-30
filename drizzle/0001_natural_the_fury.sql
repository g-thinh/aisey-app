ALTER TABLE `entries` ADD `created_at` integer DEFAULT (unixepoch()) NOT NULL;--> statement-breakpoint
ALTER TABLE `entries` ADD `updated_at` integer DEFAULT (unixepoch()) NOT NULL;