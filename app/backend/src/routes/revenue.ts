import type { FastifyInstance } from "fastify";
import { getRevenueByDay } from "../services/revenue.js";

export async function revenueRoutes(fastify: FastifyInstance) {
  fastify.get("/revenue", async () => {
    const revenue = await getRevenueByDay();
    return { revenue };
  });
}
