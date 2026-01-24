import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button/button";
import { Card } from "@/components/ui/Card/card";
import { deletePurchaseOrder } from "@/features/purchase-orders/api/delete-purchase-order";
import { getPurchaseOrders } from "@/features/purchase-orders/api/get-purchase-orders";
import { formatChileanPeso } from "@/utils/format-currency";

export default function PurchaseOrdersListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isPending, error } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: getPurchaseOrders,
  });

  const deleteMutation = useMutation({
    mutationFn: deletePurchaseOrder,
    onSuccess: () => {
      toast.success("Orden de compra eliminada");
      queryClient.invalidateQueries({ queryKey: ["purchase-orders"] });
    },
    onError: (mutationError) => {
      const message =
        mutationError instanceof Error
          ? mutationError.message
          : "No se pudo eliminar la orden de compra.";
      toast.error(message);
    },
  });

  const handleDelete = (orderId: number) => {
    if (deleteMutation.isPending) {
      return;
    }
    const confirmed = window.confirm("Eliminar esta orden de compra?");
    if (!confirmed) {
      return;
    }
    deleteMutation.mutate(orderId);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Historial de ordenes de compra creadas.
        </p>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="primary"
            onClick={() => navigate("/purchase-order/new/select")}
          >
            Crear orden de compra
          </Button>
        </div>
        <section className="space-y-4">
          {isPending && <div>Cargando...</div>}
          {error && <div>Error cargando ordenes de compra</div>}
          {data?.orders.map((order) => {
            const orderTotal = order.lines.reduce(
              (total, line) => total + line.buyPriceSupplier * line.quantity,
              0,
            );

            return (
              <Card
                key={order.purchaseOrderId}
                className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      Orden #{order.purchaseOrderId}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-foreground">
                      Proveedor: Barack
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString("es-CL", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigate(`/purchase-order/${order.purchaseOrderId}`)
                      }
                    >
                      Ver detalle
                    </Button>
                    <Button
                      aria-label="Eliminar orden de compra"
                      title="Eliminar"
                      variant="ghost"
                      size="icon-lg"
                      className="rounded-full text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                      disabled={deleteMutation.isPending}
                      onClick={() => handleDelete(order.purchaseOrderId)}
                    >
                      <Trash2 className="size-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/60 bg-white/80">
                  {order.lines.map((line) => (
                    <div
                      key={line.productId}
                      className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                    >
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-semibold text-foreground">
                          {line.productName ?? "Producto"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {line.quantity} x{" "}
                          {formatChileanPeso(line.buyPriceSupplier)}
                        </p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatChileanPeso(
                          line.buyPriceSupplier * line.quantity,
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground"
                >
                  <span>Total</span>
                  <span className="text-base font-semibold text-foreground">
                    {formatChileanPeso(orderTotal)}
                  </span>
                </div>
              </Card>
            );
          })}
        </section>
      </div>
    </div>
  );
}
