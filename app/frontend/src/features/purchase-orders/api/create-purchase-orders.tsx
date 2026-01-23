import API_BASE_URL from "@/config/api";

interface PurchaseOrderCreateDTO {
  items: {
    productId: number;
    quantity: number;
    buyPriceSupplier: number;
  }[];
}

export const createPurchaseOrder = async (payload: PurchaseOrderCreateDTO) => {
  const requestBody = {
    items: payload.items.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      buy_price_supplier: item.buyPriceSupplier,
    })),
  };

  const res = await fetch(`${API_BASE_URL}/purchase_orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) throw new Error("Error creando orden de compra");
  return res.json();
};
