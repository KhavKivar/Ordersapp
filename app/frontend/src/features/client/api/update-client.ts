import API_BASE_URL from "@/config/api";
import z from "zod";

import type { Client } from "./client.schema";

export const UpdateClientDtoSchema = z.object({
  localName: z.string().nonempty("El nombre del local es obligatorio"),
  address: z.string().nonempty("La direccion es obligatoria"),
  phone: z.string().min(5, "El telefono debe tener al menos 5 caracteres"),
  phoneId: z.string().optional(),
});

export type UpdateClientDto = z.infer<typeof UpdateClientDtoSchema>;

export const updateClient = async (
  id: number | string,
  updateDto: UpdateClientDto,
): Promise<Client> => {
  const res = await fetch(`${API_BASE_URL}/clients/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateDto),
  });

  if (!res.ok) {
    throw new Error("Client not updated");
  }

  const response = await res.json();

  return response.client ?? response;
};
