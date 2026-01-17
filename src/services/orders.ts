import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { clientTable, ordersTable, productsTable } from "../db/schema.js";

export interface OrderListItem {
  orderId: number;
  pricePerUnit: number;
  quantity: number;
  totalPrice: number | null;
  clientName: string | null;
  phone: string | null;
  productName: string | null;
}

export async function listOrders(): Promise<OrderListItem[]> {
  return db
    .select({
      orderId: ordersTable.id,
      pricePerUnit: ordersTable.price_per_unit,
      quantity: ordersTable.quantity,
      totalPrice: ordersTable.total_price,
      clientName: clientTable.name,
      phone: clientTable.phone,
      productName: productsTable.name,
    })
    .from(ordersTable)
    .innerJoin(clientTable, eq(ordersTable.client_id, clientTable.id))
    .leftJoin(productsTable, eq(ordersTable.product_id, productsTable.id));
}

export async function createOrder(input: {
  productId: number;
  clientId: number;
  pricePerUnit: number;
  quantity: number;
}) {
  const [created] = await db
    .insert(ordersTable)
    .values({
      product_id: input.productId,
      client_id: input.clientId,
      price_per_unit: input.pricePerUnit,
      quantity: input.quantity,
    })
    .returning();

  return created;
}

export async function deleteOrder(id: number) {
  const [deleted] = await db
    .delete(ordersTable)
    .where(eq(ordersTable.id, id))
    .returning();

  return deleted;
}
