import { relations } from "drizzle-orm/relations";
import { products, purchaseOrderLines, purchaseOrders } from "./schema.js";

export const purchaseOrderLinesRelations = relations(
  purchaseOrderLines,
  ({ one }) => ({
    purchaseOrder: one(purchaseOrders, {
      fields: [purchaseOrderLines.purchaseOrderId],
      references: [purchaseOrders.id],
    }),
    product: one(products, {
      fields: [purchaseOrderLines.productId],
      references: [products.id],
    }),
  }),
);

export const purchaseOrdersRelations = relations(
  purchaseOrders,
  ({ many }) => ({
    purchaseOrderLines: many(purchaseOrderLines),
  }),
);

export const productsRelations = relations(products, ({ many }) => ({
  purchaseOrderLines: many(purchaseOrderLines),
}));
