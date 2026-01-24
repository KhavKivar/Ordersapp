import API_BASE_URL from "@/config/api";

export type PurchaseOrderLine = {
  productId: number;
  buyPriceSupplier: number;
  sellPriceClient: number;
  quantity: number;
  productName: string | null;
};

export type PurchaseOrderListItem = {
  purchaseOrderId: number;
  createdAt: string;
  lines: PurchaseOrderLine[];
};

export type PurchaseOrdersResponse = {
  orders: PurchaseOrderListItem[];
};

export const getPurchaseOrders = async (): Promise<PurchaseOrdersResponse> => {
  const res = await fetch(`${API_BASE_URL}/purchase_orders`);

  if (!res.ok) {
    throw new Error("Error cargando ordenes de compra");
  }

  const data: PurchaseOrdersResponse = await res.json();

  const ordersList = data.orders.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return { orders: ordersList };
};
