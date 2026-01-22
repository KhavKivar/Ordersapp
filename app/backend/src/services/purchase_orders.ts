import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { products, purchaseOrderLines, purchaseOrders } from "../db/schema.js";

export interface OrderLineItem {
  lineId: number;
  productId: number;
  buyPriceSupplier: number;
  quantity: number;
  lineTotal: number | null;
  productName: string | null;
}

export interface OrderListItem {
  orderId: number;
  createdAt: string;
  lines: OrderLineItem[];
}

interface itemInput {
  productId: number;
  buyPriceSupplier: number;
  quantity: number;
}
export interface CreateOrderInput {
  items: itemInput[];
}

export async function listPurchaseOrders(): Promise<OrderListItem[]> {
  const rows = await db
    .select({
      createdAt: purchaseOrders.createdAt,
      orderId: purchaseOrders.id,
      lineId: purchaseOrderLines.id,
      productId: purchaseOrderLines.productId,
      buyPriceSupplier: purchaseOrderLines.buyPrice,
      quantity: purchaseOrderLines.quantity,
      lineTotal: purchaseOrderLines.lineTotal,
      productName: products.name,
    })
    .from(purchaseOrders)
    .innerJoin(
      purchaseOrderLines,
      eq(purchaseOrderLines.purchaseOrderId, purchaseOrders.id),
    )
    .leftJoin(products, eq(purchaseOrderLines.productId, products.id));

  const ordersMap = new Map<number, OrderListItem>();

  for (const row of rows) {
    let order = ordersMap.get(row.orderId);
    if (!order) {
      order = {
        orderId: row.orderId,
        createdAt: row.createdAt,
        lines: [],
      };
      ordersMap.set(row.orderId, order);
    }

    order.lines.push({
      lineId: row.lineId,
      productId: row.productId,
      buyPriceSupplier: row.buyPriceSupplier,
      quantity: row.quantity,
      lineTotal: row.lineTotal,
      productName: row.productName,
    });
  }

  return Array.from(ordersMap.values());
}

export async function createPurchaseOrder(input: CreateOrderInput) {
  const [createdOrder] = await db.insert(purchaseOrders).values({}).returning();

  const itemsToInsert = input.items.map((item) => ({
    purchaseOrderId: createdOrder.id,
    productId: item.productId,
    buyPrice: item.buyPriceSupplier,
    quantity: item.quantity,
  }));

  const createdLines = await db
    .insert(purchaseOrderLines)
    .values(itemsToInsert)
    .returning();

  return { order: createdOrder, lines: createdLines };
}
