import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  ChevronRight,
  Loader2,
  Package,
  Plus,
  Receipt,
  Store,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/Button/button";
import { Card } from "@/components/ui/Card/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deletePurchaseOrder } from "@/features/purchase-orders/api/delete-purchase-order";
import { getPurchaseOrders } from "@/features/purchase-orders/api/get-purchase-orders";
import { cn } from "@/lib/utils";
import { formatChileanPeso } from "@/utils/format-currency";

const STATUS_CONFIG: Record<string, { label: string; style: string }> = {
  pending: {
    label: "Pendiente",
    style: "bg-amber-100 text-amber-700 border-amber-200",
  },
  received: {
    label: "Recibido",
    style: "bg-blue-100 text-blue-700 border-blue-200",
  },
  paid: {
    label: "Pagado",
    style: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  cancelled: {
    label: "Cancelado",
    style: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

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

    deleteMutation.mutate(orderId);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-12 pt-6 sm:px-6 sm:pt-12">
        {/* HEADER */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-600">
              <Package className="size-6" />
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Ordenes de Compra
              </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Gestiona tus pedidos a proveedores.
            </p>
          </div>
          <Button
            variant="primary"
            onClick={() => navigate("/purchase-order/new/select")}
            className="h-12 w-full rounded-2xl shadow-md shadow-indigo-100 sm:h-10 sm:w-auto"
          >
            <Plus className="mr-2 size-5 sm:size-4" />
            Crear orden
          </Button>
        </header>

        {/* CONTENIDO */}
        <section className="grid gap-4">
          {/* ESTADOS DE CARGA / ERROR */}
          {isPending && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-indigo-500" />
              <p className="mt-2 font-medium">Cargando ordenes...</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 rounded-3xl border border-rose-100 bg-rose-50 p-6 text-rose-700">
              <AlertCircle className="size-5 shrink-0" />
              <p>Error al cargar el historial de ordenes.</p>
            </div>
          )}

          {/* EMPTY STATE */}
          {!isPending && !error && data?.orders.length === 0 && (
            <Card className="flex flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-transparent p-12 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <Receipt className="size-8" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Sin ordenes creadas
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Registra tu primera compra a proveedores.
              </p>
            </Card>
          )}

          {/* LISTA DE TARJETAS */}
          {data?.orders.map((order) => {
            const orderTotal = order.lines.reduce(
              (total, line) => total + line.buyPriceSupplier * line.quantity,
              0,
            );

            // Determinar estado (fallback a pending si no existe)
            const statusInfo = STATUS_CONFIG.pending;

            return (
              <Card
                key={order.purchaseOrderId}
                className="group relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-5 transition-all hover:border-indigo-200 hover:shadow-lg sm:p-6"
              >
                {/* CABECERA DE TARJETA */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    {/* Icono de Proveedor */}
                    <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 sm:flex">
                      <Store className="size-6" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                          #{order.purchaseOrderId}
                        </span>
                        <span
                          className={cn(
                            "rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase",
                            statusInfo.style,
                          )}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Proveedor: Barack
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="size-3.5" />
                        <span>
                          {new Date(order.createdAt).toLocaleDateString(
                            "es-CL",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ACCIONES (Desktop: derecha, Movil: arriba) */}
                  <div className="flex items-center gap-1 self-end sm:self-start">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 rounded-xl border-slate-200 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                      onClick={() =>
                        navigate(`/purchase-order/${order.purchaseOrderId}`)
                      }
                    >
                      Ver detalle
                      <ChevronRight className="ml-1 size-4" />
                    </Button>

                    {/* DIALOG DE ELIMINAR */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-rose-400 hover:bg-rose-50 hover:text-rose-600"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="rounded-[2rem]">
                        <DialogHeader>
                          <DialogTitle>
                            Eliminar Orden #{order.purchaseOrderId}
                          </DialogTitle>
                          <DialogDescription>
                            ¿Estás seguro? Esta acción eliminará el registro de
                            compra y sus líneas asociadas.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                          <DialogClose asChild>
                            <Button variant="outline" className="rounded-xl">
                              Cancelar
                            </Button>
                          </DialogClose>
                          <Button
                            variant="destructive"
                            className="rounded-xl"
                            onClick={() => handleDelete(order.purchaseOrderId)}
                          >
                            Eliminar
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* DETALLE DE ITEMS (Estilo Mini-Factura) */}
                <div className="mt-5 rounded-2xl border border-slate-100 bg-slate-50/50 p-1">
                  <div className="flex flex-col divide-y divide-slate-100">
                    {order.lines.map((line) => (
                      <div
                        key={line.productId}
                        className="flex items-center justify-between px-4 py-3 text-sm hover:bg-slate-50"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-700">
                            {line.productName ?? "Producto"}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {line.quantity} un. x{" "}
                            {formatChileanPeso(line.buyPriceSupplier)}
                          </span>
                        </div>
                        <span className="font-medium text-slate-900">
                          {formatChileanPeso(
                            line.buyPriceSupplier * line.quantity,
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* FOOTER: TOTAL */}
                <div className="mt-4 flex items-center justify-end gap-3 px-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    Total Compra
                  </span>
                  <span className="text-xl font-black text-indigo-600">
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
