import API_BASE_URL from "@/config/api";
import type { Client } from "./client.schema";

export type ClientsResponse = {
  clients: Client[];
};

export const getClients = async (): Promise<ClientsResponse> => {
  const res = await fetch(`${API_BASE_URL}/clients`);

  if (!res.ok) {
    throw new Error("Error cargando clientes");
  }

  const data: ClientsResponse = await res.json();
  const clientsList = data.clients.sort((a, b) =>
    a.localName.localeCompare(b.localName),
  );

  return { clients: clientsList };
};
