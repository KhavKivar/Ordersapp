import type { FastifyInstance } from "fastify";
import {
  deleteClient,
  findOrCreateClient,
  listClients,
  updateClient,
} from "../services/clients.js";

export async function clientsRoutes(fastify: FastifyInstance) {
  fastify.get("/clients", async () => {
    const clients = await listClients();
    return { clients };
  });

  fastify.post("/clients", async (request, reply) => {
    const body = request.body as {
      localName?: string;
      address?: string;
      phone?: string;
      phoneId?: string;
    };

    const phoneId = body?.phoneId?.trim();
    if (!phoneId) {
      return reply.status(400).send({ error: "phoneId is required" });
    }

    const created = await findOrCreateClient({
      localName: body?.localName,
      address: body?.address,
      phone: body?.phone ?? "",
      phoneId,
    });

    return { client: created };
  });

  fastify.delete("/clients/:id", async (request, reply) => {
    const id = Number((request.params as { id?: string }).id);
    if (!id) {
      return reply.status(400).send({ error: "id is required" });
    }

    const deleted = await deleteClient(id);

    if (!deleted) {
      return reply.status(404).send({ error: "client not found" });
    }

    return { client: deleted };
  });

  fastify.patch("/clients/:id", async (request, reply) => {
    const id = Number((request.params as { id?: string }).id);
    if (!id) {
      return reply.status(400).send({ error: "id is required" });
    }

    const body = request.body as {
      localName?: string;
      address?: string;
      phone?: string;
      phoneId?: string;
    };

    const updates: {
      localName?: string;
      address?: string;
      phone?: string;
      phoneId?: string;
    } = {};

    if (typeof body?.localName === "string") {
      updates.localName = body.localName.trim();
    }

    if (typeof body?.address === "string") {
      updates.address = body.address.trim();
    }

    if (typeof body?.address === "string") {
      updates.address = body.address.trim();
    }

    if (typeof body?.phone === "string") {
      const phone = body.phone.trim();
      if (!phone) {
        return reply.status(400).send({ error: "phone is required" });
      }
      updates.phone = phone;
    }

    if (typeof body?.phoneId === "string") {
      const phoneId = body.phoneId.trim();
      if (!phoneId) {
        return reply.status(400).send({ error: "phoneId is required" });
      }
      updates.phoneId = phoneId;
    }

    if (Object.keys(updates).length === 0) {
      return reply.status(400).send({ error: "no fields to update" });
    }

    const updated = await updateClient(id, updates);

    if (!updated) {
      return reply.status(404).send({ error: "client not found" });
    }

    return { client: updated };
  });
}
