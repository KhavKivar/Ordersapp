import { FastifyInstance } from "fastify";
import {
  createPurchaseOrder,
  deletePurchaseOrder,
  getPurchaseOrderById,
  listPurchaseOrders,
  updatePurchaseOrder,
} from "../services/purchase_orders.js";

export async function purchaseOrdersRoutes(fastify: FastifyInstance) {
  fastify.get("/purchase_orders", async () => {
    const orders = await listPurchaseOrders();
    return { orders };
  });

  fastify.get("/purchase_orders/:id", async (request, reply) => {
    const id = Number((request.params as { id?: string }).id);
    if (!id) {
      return reply.status(400).send({ error: "id is required" });
    }

    try {
      const purchaseOrder = await getPurchaseOrderById(id);
      if (!purchaseOrder) {
        return reply.status(404).send({ error: "purchase order not found" });
      }

      return { purchaseOrder };
    } catch (error) {
      request.log.error(
        { err: error },
        "failed to fetch purchase order detail",
      );
      return reply
        .status(500)
        .send({ error: "failed to fetch purchase order" });
    }
  });

  fastify.post("/purchase_orders", async (request, reply) => {
    const body = request.body as {
      orderListIds?: Array<number>;
    };
    const orderListIds = body?.orderListIds ?? [];
    if (orderListIds.length === 0) {
      return reply.status(400).send({
        error: "orderListIds are required",
      });
    }

    const created = await createPurchaseOrder({
      orderListIds,
    });

    return created;
  });
  fastify.patch("/purchase_orders/:id", async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = request.body as { orderListIds?: number[] };

    const purchaseOrderId = Number(id);
    const orderListIds = body?.orderListIds ?? [];

    if (isNaN(purchaseOrderId)) {
      return reply.status(400).send({ error: "Invalid ID" });
    }

    try {
      const updated = await updatePurchaseOrder(purchaseOrderId, {
        orderListIds,
      });
      return updated;
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });

  fastify.delete("/purchase_orders/:id", async (request, reply) => {
    const id = Number((request.params as { id?: string }).id);
    if (!id) {
      return reply.status(400).send({ error: "id is required" });
    }

    const deleted = await deletePurchaseOrder(id);
    if (!deleted) {
      return reply.status(404).send({ error: "purchase order not found" });
    }

    return { order: deleted };
  });
}
