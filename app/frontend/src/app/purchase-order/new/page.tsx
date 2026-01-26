import { cn } from "@/lib/utils";
import { Circle } from "lucide-react";
import { Outlet, useLocation } from "react-router";

export default function PurchaseOrderNewLayout() {
  const location = useLocation();
  const isSummary = location.pathname.includes("summary");

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {" "}
      {/* Padding bottom extra para la barra flotante */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pt-6 sm:pt-10">
        {/* STEPPER / INDICADOR DE PROGRESO */}
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-8">
          <div
            className={cn(
              "flex items-center gap-2",
              !isSummary ? "text-indigo-600" : "text-indigo-600/60",
            )}
          >
            <div className="flex size-8 items-center justify-center rounded-full bg-indigo-100 font-bold">
              1
            </div>
            <span className="font-semibold">Selección de Pedidos</span>
          </div>

          <div className="h-0.5 w-12 bg-slate-200" />

          <div
            className={cn(
              "flex items-center gap-2",
              isSummary ? "text-indigo-600" : "text-slate-400",
            )}
          >
            <div
              className={cn(
                "flex size-8 items-center justify-center rounded-full font-bold",
                isSummary ? "bg-indigo-100" : "bg-slate-100",
              )}
            >
              {isSummary ? "2" : <Circle className="size-5" />}
            </div>
            <span className="font-semibold">Resumen y Confirmación</span>
          </div>
        </div>

        <div className="mt-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
