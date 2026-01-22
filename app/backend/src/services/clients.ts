import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { clients } from "../db/schema.js";

type Client = typeof clients.$inferSelect;

export type OptionalClient = Client | null;

interface CreateClientInput {
  name: string;
  localName?: string;
  address?: string;
  phone: string;
  phoneId: string;
}

export async function listClients() {
  return db.select().from(clients);
}

export async function getClientByPhone(phone: string): Promise<OptionalClient> {
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.phone, phone))
    .limit(1);
  return client[0] || null;
}

export async function getClientByPhoneId(
  phoneId: string,
): Promise<OptionalClient> {
  console.log("Searching client by phoneId:", phoneId);
  const client = await db
    .select()
    .from(clients)
    .where(eq(clients.phoneId, phoneId))
    .limit(1);
  return client[0] || null;
}

export async function findOrCreateClient(
  input: CreateClientInput,
): Promise<{ client: Client; isNew: boolean }> {
  const clientAlreadyExist = await db
    .select()
    .from(clients)
    .where(eq(clients.phoneId, input.phoneId))
    .limit(1);
  if (clientAlreadyExist.length > 0) {
    return { client: clientAlreadyExist[0], isNew: false };
  }

  const [created] = await db
    .insert(clients)
    .values({
      name: input.name,
      localName: input.localName,
      address: input.address,
      phone: input.phone,
      phoneId: input.phoneId,
    })
    .returning();

  return { client: created, isNew: true };
}

export async function deleteClient(id: number) {
  const [deleted] = await db
    .delete(clients)
    .where(eq(clients.id, id))
    .returning();

  return deleted;
}
