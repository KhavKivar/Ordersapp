import API_BASE_URL from "@/config/api";

export type PurchaseOrderDetailLine = {
  lineId: number;
  productId: number;
  productName: string | null;
  pricePerUnit: number;
  buyPriceSupplier: number;
  quantity: number;
  lineTotal: number | null;
};

export type PurchaseOrderDetailOrder = {
  orderId: number;
  createdAt: string;
  localName: string | null;
  phone: string | null;
  lines: PurchaseOrderDetailLine[];
};

export type PurchaseOrderDetail = {
  purchaseOrderId: number;
  createdAt: string;
  status: "pending" | "received" | "paid" | "cancelled";
  orders: PurchaseOrderDetailOrder[];
};

export type PurchaseOrderDetailResponse = {
  purchaseOrder: PurchaseOrderDetail;
};

export const getPurchaseOrder = async (
  id: number,
): Promise<PurchaseOrderDetail> => {
  const res = await fetch(`${API_BASE_URL}/purchase_orders/${id}`);

  if (!res.ok) {
    throw new Error("Error cargando orden de compra");
  }

  const data: PurchaseOrderDetailResponse = await res.json();
  return data.purchaseOrder;
};
