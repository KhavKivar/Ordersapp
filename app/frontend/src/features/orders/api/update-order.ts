import API_BASE_URL from "@/config/api";

import type { OrderCreateDto } from "./order.schema";

export const updateOrder = async (
  orderId: number,
  payload: OrderCreateDto,
) => {
  const requestBody = {
    client_id: payload.clientId,
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      price_per_unit: item.pricePerUnit,
    })),
  };

  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    throw new Error("Error actualizando pedido");
  }

  return res.json();
};
