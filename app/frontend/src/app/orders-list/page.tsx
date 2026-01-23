import { Button } from "@/components/ui/Button/button";
import { FloatingButton } from "@/components/ui/FloatingButton/floatingButton";
import OrderCard from "@/features/components/OrderCard";
import { getOrders } from "@/features/orders/api/get-orders";
import { useQuery } from "@tanstack/react-query";

import { useAppSelector } from "@/hooks/redux.hooks";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import {
  addSelectedPurchaseOrder,
  removeSelectedPurchaseOrder,
  selectedPurchaseOrder,
} from "../purchaseOrderSlice";

export default function OrdersListPage() {
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
  const dispatch = useDispatch();
  const choosingOrder = useAppSelector(selectedPurchaseOrder);

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2   px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Revisa los pedidos creados, su estado y el detalle de productos.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="primary"
            onClick={() => navigate("/purchase-orders")}
          >
            {`Crear orden de compra${
              choosingOrder.length > 0 ? ` (${choosingOrder.length})` : ""
            }`}
          </Button>
          <Button variant="outline" onClick={() => navigate("/purchase-orders/list")}>
            Ver ordenes de compra
          </Button>
        </div>

        <section className="space-y-4">
          <div className="grid gap-4">
            {isPending && <div>Cargando...</div>}
            {error && <div>Error cargando pedidos</div>}
            {data?.orders.map((order) => (
              <OrderCard
                key={order.orderId}
                id={order.orderId}
                clientName={order.clientName ?? "Cliente"}
                status="pending"
                createdAt={order.createdAt}
                items={order.lines.map((item) => ({
                  name: item.productName ?? "Producto",
                  quantity: item.quantity,
                  pricePerUnit: item.pricePerUnit,
                }))}
                isSelected={choosingOrder.includes(order)}
                onEdit={(orderId) => navigate(`/orders/${orderId}/edit`)}
                onClick={() => {
                  //First check if the order is already in the list
                  if (choosingOrder.includes(order)) {
                    dispatch(removeSelectedPurchaseOrder(order));
                    return;
                  }
                  dispatch(addSelectedPurchaseOrder(order));
                }}
              />
            ))}
          </div>
        </section>
      </div>
      <FloatingButton
        label="Agregar pedido"
        title="Agregar pedido"
        onClick={() => navigate("/orders/new")}
      />
    </div>
  );
}
