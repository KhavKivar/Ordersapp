import API_BASE_URL from "@/config/api";

interface OrderCreateDTO {
  clientId: number;
  items: {
    productId: number;
    quantity: number;
    pricePerUnit: number;
  }[];
}

export const createOrder = async (payload: OrderCreateDTO) => {
  const requestBody = {
    client_id: payload.clientId,
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      price_per_unit: item.pricePerUnit,
    })),
  };

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (!res.ok) throw new Error("Error creando pedido");
  return res.json();
};
