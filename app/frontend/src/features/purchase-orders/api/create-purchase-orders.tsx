import API_BASE_URL from "@/config/api";

interface PurchaseOrderCreateDTO {
  orderListIds: number[];
}

export const createPurchaseOrder = async (payload: PurchaseOrderCreateDTO) => {
  const requestBody = {
    orderListIds: payload.orderListIds,
  };

  const res = await fetch(`${API_BASE_URL}/purchase_orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) throw new Error("Error creando orden de compra");
  return res.json();
};
