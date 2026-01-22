import { pgTable, unique, integer, varchar, timestamp, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const orderStatus = pgEnum("order_status", ['pending', 'paid', 'delivered', 'delivered_paid', 'cancelled'])
export const purchaseOrderStatus = pgEnum("purchase_order_status", ['pending', 'received', 'paid', 'cancelled'])


export const clients = pgTable("clients", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "clients_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }),
	localName: varchar({ length: 255 }),
	address: varchar({ length: 512 }),
	phone: varchar({ length: 20 }),
	phoneId: varchar("phone_id", { length: 64 }).notNull(),
}, (table) => [
	unique("clients_phone_unique").on(table.phone),
	unique("clients_phone_id_unique").on(table.phoneId),
]);

export const orderLines = pgTable("order_lines", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "order_lines_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	orderId: integer("order_id").notNull(),
	productId: integer("product_id").notNull(),
	pricePerUnit: integer("price_per_unit").notNull(),
	quantity: integer().notNull(),
	lineTotal: integer("line_total").generatedAlwaysAs(sql`(price_per_unit * quantity)`),
});

export const orders = pgTable("orders", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "orders_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	clientId: integer("client_id").notNull(),
	status: orderStatus().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const products = pgTable("products", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "products_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 64 }).notNull(),
	sizeMl: integer("size_ml"),
	sellPriceClient: integer("sell_price_client").notNull(),
	buyPriceSupplier: integer("buy_price_supplier").notNull(),
	description: varchar({ length: 1024 }),
});

export const purchaseOrders = pgTable("purchase_orders", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "purchase_orders_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	status: purchaseOrderStatus().default('pending').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
});

export const purchaseOrderLines = pgTable("purchase_order_lines", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "purchase_order_lines_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	purchaseOrderId: integer("purchase_order_id").notNull(),
	productId: integer("product_id").notNull(),
	buyPrice: integer("buy_price").notNull(),
	quantity: integer().notNull(),
	lineTotal: integer("line_total").generatedAlwaysAs(sql`(buy_price * quantity)`),
}, (table) => [
	foreignKey({
			columns: [table.purchaseOrderId],
			foreignColumns: [purchaseOrders.id],
			name: "purchase_order_lines_purchase_order_id_fkey"
		}),
	foreignKey({
			columns: [table.productId],
			foreignColumns: [products.id],
			name: "purchase_order_lines_product_id_fkey"
		}),
]);
