import type { FastifyInstance } from "fastify";
import {
  listOrders,
  createOrder,
  deleteOrder,
} from "../services/orders.js";

export async function ordersRoutes(fastify: FastifyInstance) {
  fastify.get("/orders", async () => {
    const orders = await listOrders();
    return { orders };
  });

  fastify.post("/orders", async (request, reply) => {
    const body = request.body as {
      product_id?: number;
      client_id?: number;
      price_per_unit?: number;
      quantity?: number;
    };

    const productId = body?.product_id;
    const clientId = body?.client_id;
    const pricePerUnit = body?.price_per_unit;
    const quantity = body?.quantity;

    if (!productId || !clientId || !pricePerUnit || !quantity) {
      return reply.status(400).send({
        error: "product_id, client_id, price_per_unit, quantity are required",
      });
    }

    const created = await createOrder({
      productId,
      clientId,
      pricePerUnit,
      quantity,
    });

    return { order: created };
  });

  fastify.delete("/orders/:id", async (request, reply) => {
    const id = Number((request.params as { id?: string }).id);
    if (!id) {
      return reply.status(400).send({ error: "id is required" });
    }

    const deleted = await deleteOrder(id);

    if (!deleted) {
      return reply.status(404).send({ error: "order not found" });
    }

    return { order: deleted };
  });
}
