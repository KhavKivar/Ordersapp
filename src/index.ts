import Fastify from "fastify";
import { clientsRoutes } from "./routes/clients.js";
import { aiRoutes } from "./routes/ai.js";
import { ordersRoutes } from "./routes/orders.js";
import { productsRoutes } from "./routes/products.js";
import { startWhatsApp } from "./whatsapp/client.js";

const fastify = Fastify({ logger: true });

await fastify.register(aiRoutes);
await fastify.register(productsRoutes);
await fastify.register(ordersRoutes);
await fastify.register(clientsRoutes);

const port = Number(process.env.PORT || 3000);
await fastify.listen({ port, host: "0.0.0.0" });

void startWhatsApp().catch((error) => {
  fastify.log.error({ error }, "failed to start WhatsApp client");
});
