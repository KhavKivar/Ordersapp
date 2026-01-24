import API_BASE_URL from "@/config/api";

import type { PurchaseOrderListItem } from "./get-purchase-orders";

export const deletePurchaseOrder = async (
  orderId: number | string,
): Promise<PurchaseOrderListItem> => {
  const res = await fetch(`${API_BASE_URL}/purchase_orders/${orderId}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Error eliminando orden de compra");
  }

  const response = await res.json();

  return response.order ?? response;
};
