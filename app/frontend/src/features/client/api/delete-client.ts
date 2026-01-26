import API_BASE_URL from "@/config/api";

import type { Client } from "./client.schema";

export const deleteClient = async (id: number | string): Promise<Client> => {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));

    if (errorData.message === "Client has orders") {
      throw new Error("El cliente tiene pedidos");
    }

    throw new Error(errorData.message || "Error al eliminar el cliente");
  }

  const response = await res.json();
  return response.client ?? response;
};
