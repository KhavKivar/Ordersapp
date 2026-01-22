import { FastifyInstance } from "fastify";
import {
  createPurchaseOrder,
  listPurchaseOrders,
} from "../services/purchase_orders.js";

export async function purchaseOrdersRoutes(fastify: FastifyInstance) {
  fastify.get("/purchase_orders", async () => {
    const orders = await listPurchaseOrders();
    return { orders };
  });

  fastify.post("/purchase_orders", async (request, reply) => {
    const body = request.body as {
      items?: Array<{
        product_id?: number;
        buy_price_supplier?: number;
        quantity?: number;
      }>;
    };

    const items = body?.items ?? [];

    if (items.length === 0) {
      return reply.status(400).send({
        error: "items are required",
      });
    }

    const normalizedItems: Array<{
      productId: number;
      buyPriceSupplier: number;
      quantity: number;
    }> = [];
    for (const item of items) {
      if (!item.product_id || !item.buy_price_supplier || !item.quantity) {
        return reply.status(400).send({
          error:
            "Each item needs product_id, buy_price_supplier, quantity with values greater than 0",
        });
      }

      normalizedItems.push({
        productId: item.product_id,
        buyPriceSupplier: item.buy_price_supplier,
        quantity: item.quantity,
      });
    }

    const created = await createPurchaseOrder({
      items: normalizedItems,
    });

    return created;
  });
}
