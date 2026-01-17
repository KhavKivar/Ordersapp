import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { clientTable } from "../db/schema.js";

export async function listClients() {
  return db.select().from(clientTable);
}

export async function createClient(input: {
  name: string;
  localName?: string;
  address?: string;
  phone?: string;
}) {
  const [created] = await db
    .insert(clientTable)
    .values({
      name: input.name,
      localName: input.localName,
      address: input.address,
      phone: input.phone,
    })
    .returning();

  return created;
}

export async function deleteClient(id: number) {
  const [deleted] = await db
    .delete(clientTable)
    .where(eq(clientTable.id, id))
    .returning();

  return deleted;
}
