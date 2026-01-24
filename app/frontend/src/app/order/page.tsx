import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button/button";
import { deleteOrder } from "@/features/orders/api/delete-order";
import {
  getOrders,
  type OrderListItem,
} from "@/features/orders/api/get-orders";
import OrderCard from "@/features/orders/components/OrderCard";

export default function OrdersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: (payload: { orderId: number; order: OrderListItem }) =>
      deleteOrder(payload.orderId),
    onSuccess: (_response, payload) => {
      toast.success("Pedido eliminado");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "No se pudo eliminar el pedido.";
      toast.error(message);
    },
  });

  const handleDelete = (order: OrderListItem) => {
    if (deleteMutation.isPending) {
      return;
    }
    const confirmed = window.confirm("Eliminar este pedido?");
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate({ orderId: order.orderId, order });
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2   px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Revisa los pedidos creados, su estado y el detalle de productos.
        </p>
        <Button variant="primary" onClick={() => navigate("/order/new")}>
          Crear pedido
        </Button>

        <section className="space-y-4">
          <div className="grid gap-4">
            {isPending && <div>Cargando...</div>}
            {error && <div>Error cargando pedidos</div>}
            {data?.orders.map((order) => (
              <OrderCard
                key={order.orderId}
                id={order.orderId}
                localName={order.localName ?? "Local"}
                status="pending"
                createdAt={order.createdAt}
                items={order.lines.map((item) => ({
                  name: item.productName ?? "Producto",
                  quantity: item.quantity,
                  pricePerUnit: item.pricePerUnit,
                }))}
                onEdit={(orderId) => navigate(`/order/${orderId}/edit`)}
                onDelete={() => handleDelete(order)}
                isSelected={false}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
