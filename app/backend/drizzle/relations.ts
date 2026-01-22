import { relations } from "drizzle-orm/relations";
import { purchaseOrders, purchaseOrderLines, products } from "./schema";

export const purchaseOrderLinesRelations = relations(purchaseOrderLines, ({one}) => ({
	purchaseOrder: one(purchaseOrders, {
		fields: [purchaseOrderLines.purchaseOrderId],
		references: [purchaseOrders.id]
	}),
	product: one(products, {
		fields: [purchaseOrderLines.productId],
		references: [products.id]
	}),
}));

export const purchaseOrdersRelations = relations(purchaseOrders, ({many}) => ({
	purchaseOrderLines: many(purchaseOrderLines),
}));

export const productsRelations = relations(products, ({many}) => ({
	purchaseOrderLines: many(purchaseOrderLines),
}));