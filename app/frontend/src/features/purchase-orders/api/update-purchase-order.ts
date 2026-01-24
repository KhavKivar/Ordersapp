import API_BASE_URL from "@/config/api";

type UpdatePurchaseOrderInput = {
  id: number;
  orderListIds: number[];
};

export const updatePurchaseOrder = async (
  payload: UpdatePurchaseOrderInput,
) => {
  const res = await fetch(`${API_BASE_URL}/purchase_orders/${payload.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      orderListIds: payload.orderListIds,
    }),
  });

  if (!res.ok) {
    throw new Error("Error actualizando orden de compra");
  }

  return res.json();
};
