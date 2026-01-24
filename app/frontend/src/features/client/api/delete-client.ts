import API_BASE_URL from "@/config/api";

import type { Client } from "./client.schema";

export const deleteClient = async (
  id: number | string,
): Promise<Client> => {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Client not deleted");
  }

  const response = await res.json();

  return response.client ?? response;
};
