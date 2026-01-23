import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { clients, orderLines, orders, products } from "../db/schema.js";

export interface OrderLineItem {
  lineId: number;
  productId: number;
  pricePerUnit: number;
  buyPriceSupplier: number;
  quantity: number;
  lineTotal: number | null;
  productName: string | null;
}

export interface OrderListItem {
  orderId: number;
  createdAt: string;
  clientName: string | null;
  phone: string | null;
  lines: OrderLineItem[];
}

interface itemInput {
  productId: number;
  pricePerUnit: number;
  quantity: number;
}
export interface CreateOrderInput {
  clientId: number;
  items: itemInput[];
}

export async function listOrders(): Promise<OrderListItem[]> {
  const rows = await db
    .select({
      createdAt: orders.createdAt,
      orderId: orders.id,
      lineId: orderLines.id,
      productId: orderLines.productId,
      pricePerUnit: orderLines.pricePerUnit,
      quantity: orderLines.quantity,
      lineTotal: orderLines.lineTotal,
      clientName: clients.name,
      phone: clients.phone,
      productName: products.name,
      buyPriceSupplier: products.buyPriceSupplier,
    })
    .from(orders)
    .innerJoin(clients, eq(orders.clientId, clients.id))
    .innerJoin(orderLines, eq(orderLines.orderId, orders.id))
    .leftJoin(products, eq(orderLines.productId, products.id));

  const ordersMap = new Map<number, OrderListItem>();

  for (const row of rows) {
    let order = ordersMap.get(row.orderId);
    if (!order) {
      order = {
        orderId: row.orderId,
        createdAt: row.createdAt,
        clientName: row.clientName,
        phone: row.phone,
        lines: [],
      };
      ordersMap.set(row.orderId, order);
    }

    order.lines.push({
      lineId: row.lineId,
      productId: row.productId,
      pricePerUnit: row.pricePerUnit,
      quantity: row.quantity,
      lineTotal: row.lineTotal,
      productName: row.productName,
      buyPriceSupplier: row.buyPriceSupplier ?? 0,
    });
  }

  return Array.from(ordersMap.values());
}

export async function createOrder(input: CreateOrderInput) {
  const [createdOrder] = await db
    .insert(orders)
    .values({
      clientId: input.clientId,
    })
    .returning();

  const itemsToInsert = input.items.map((item) => ({
    orderId: createdOrder.id,
    productId: item.productId,
    pricePerUnit: item.pricePerUnit,
    quantity: item.quantity,
  }));

  const createdLines = await db
    .insert(orderLines)
    .values(itemsToInsert)
    .returning();

  return { order: createdOrder, lines: createdLines };
}

export async function deleteOrder(id: number) {
  const [deleted] = await db
    .delete(orders)
    .where(eq(orders.id, id))
    .returning();

  return deleted;
}
