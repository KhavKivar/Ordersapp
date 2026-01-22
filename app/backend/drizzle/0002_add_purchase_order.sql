CREATE TYPE "purchase_order_status" AS ENUM (
  'pending',
  'received',
  'paid',
  'cancelled'
);
--> statement-breakpoint
CREATE TABLE "purchase_orders" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "status" "purchase_order_status" DEFAULT 'pending' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_lines" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "purchase_order_id" integer NOT NULL REFERENCES "purchase_orders"("id"),
  "product_id" integer NOT NULL REFERENCES "products"("id"),
  "buy_price" integer NOT NULL,
  "quantity" integer NOT NULL,
  "line_total" integer GENERATED ALWAYS AS ("buy_price" * "quantity") STORED
);