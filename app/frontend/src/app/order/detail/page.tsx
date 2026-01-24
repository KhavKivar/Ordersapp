import { Button } from "@/components/ui/Button/button";
import { Card } from "@/components/ui/Card/card";
import type { OrderListItem } from "@/features/orders/api/get-orders";
import { formatChileanPeso } from "@/utils/format-currency";
import { useLocation, useNavigate, useParams } from "react-router";

export default function OrderDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const order =
    (location.state as { order?: OrderListItem } | null)?.order ?? null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        {!order && (
          <Card className="rounded-3xl border border-border/70 bg-card/90 p-6 text-left">
            <h2 className="text-lg font-semibold text-foreground">
              {`Pedido #${id ?? ""}`}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No se encontro informacion del pedido. Vuelve a la lista para
              seleccionar uno.
            </p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => navigate("/order")}>
                Volver a pedidos
              </Button>
            </div>
          </Card>
        )}

        {order && (
          <section className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Pedido #{order.orderId}
                </p>
                <h2 className="mt-2 text-lg font-semibold text-foreground">
                  {order.clientName ?? "Cliente"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("es-CL", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="divide-y divide-border/60 rounded-2xl border border-border/60 bg-white/80">
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
                      {line.quantity} x {formatChileanPeso(line.pricePerUnit)}
                    </p>
                  </div>
                  <span className="text-sm font-semibold text-foreground">
                    {formatChileanPeso(line.pricePerUnit * line.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
