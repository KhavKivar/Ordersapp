import { Card } from "@/components/ui/Card/card";
import { getPurchaseOrders } from "@/features/purchase-orders/api/get-purchase-orders";
import { formatChileanPeso } from "@/utils/format-currency";
import { useQuery } from "@tanstack/react-query";

export default function PurchaseOrdersListPage() {
  const { data, isPending, error } = useQuery({
    queryKey: ["purchase-orders"],
    queryFn: getPurchaseOrders,
  });

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Historial de ordenes de compra creadas.
        </p>
        <section className="space-y-4">
          {isPending && <div>Cargando...</div>}
          {error && <div>Error cargando ordenes de compra</div>}
          {data?.orders.map((order) => (
            <Card
              key={order.orderId}
              className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Orden #{order.orderId}
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
              <div className="mt-4 divide-y divide-border/60 rounded-2xl border border-border/60 bg-white/80">
                {order.lines.map((line) => (
                  <div
                    key={line.lineId}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-semibold text-foreground">
                        {line.productName ?? "Producto"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {line.quantity} x {formatChileanPeso(line.buyPriceSupplier)}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {formatChileanPeso(line.buyPriceSupplier * line.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </div>
  );
}
