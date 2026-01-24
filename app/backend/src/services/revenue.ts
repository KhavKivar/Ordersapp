import { eq, sql } from "drizzle-orm";

import { db } from "../db/index.js";
import { orderLines, orders, products, purchaseOrders } from "../db/schema.js";

export interface RevenueByDay {
  day: string;
  totalGain: number;
}

export async function getRevenueByDay(): Promise<RevenueByDay[]> {
  return db
    .select({
      day: sql<string>`TO_CHAR(${purchaseOrders.createdAt}, 'DD/MM/YYYY')`.as(
        "day",
      ),
      totalGain: sql<number>`SUM(
        (${orderLines.pricePerUnit} - ${products.buyPriceSupplier}) * ${orderLines.quantity}
      )::integer`.as("totalGain"),
    })
    .from(purchaseOrders)

    .innerJoin(orders, eq(orders.purchaseOrderId, purchaseOrders.id))

    .innerJoin(orderLines, eq(orderLines.orderId, orders.id))
    .innerJoin(products, eq(orderLines.productId, products.id))
    .groupBy(
      sql`TO_CHAR(${purchaseOrders.createdAt}, 'DD/MM/YYYY')`,
      purchaseOrders.createdAt,
    )
    .orderBy(sql`${purchaseOrders.createdAt} DESC`);
}
