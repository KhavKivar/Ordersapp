import { Button } from "@/components/ui/Button/button";
import { Card } from "@/components/ui/Card/card";
import { FloatingButton } from "@/components/ui/FloatingButton/floatingButton";
import Header from "@/components/ui/Header/header";
import SubHeader from "@/components/ui/Header/subHeader";
import { Spacer } from "@/components/ui/Spacer/spacer";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const toastMessage =
    typeof location.state === "object" && location.state
      ? (location.state as { toast?: string }).toast
      : undefined;
  const [showToast, setShowToast] = useState(Boolean(toastMessage));

  const handleToastDismiss = () => {
    setShowToast(false);
    navigate(location.pathname, { replace: true });
  };

  return (
    <div className="min-h-screen ">
      {showToast && (
        <div className="fixed inset-x-0 top-0 z-50 bg-emerald-600 text-white shadow-lg">
          <div
            className="toast-auto-hide mx-auto flex max-w-3xl items-center gap-2 px-6 py-3 text-sm font-semibold"
            onAnimationEnd={handleToastDismiss}
          >
            <CheckCircle className="h-4 w-4" aria-hidden />
            {toastMessage ?? "Pedido agregado"}
          </div>
        </div>
      )}
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <header className="space-y-3">
          <SubHeader text="Vasvani App" />
          <Header text="Panel Principal" />
          <p className="max-w-2xl text-base text-muted-foreground">
            Esta vista esta en construccion. Pronto veras un resumen con los
            pedidos recientes y accesos rapidos.
          </p>
        </header>
        <Card>
          <p className="text-lg font-semibold text-foreground">
            Vista en desarrollo
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Aqui mostraremos el resumen de pedidos, accesos rapidos y
            notificaciones clave.
          </p>
        </Card>
        <Card className="bg-card/90 p-8 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-accent-foreground">
            Acciones rapidas
          </p>
          <h2 className="mt-3 text-lg font-semibold text-foreground">
            Agregar cliente
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Crea un nuevo cliente para usarlo en los pedidos manuales.
          </p>
          <Spacer />
          <Button variant={"primary"} onClick={() => navigate("/clients/new")}>
            Crear Cliente
          </Button>
        </Card>
      </div>
      <FloatingButton
        label="Agregar pedido"
        title="Agregar pedido"
        onClick={() => navigate("/orders")}
      />
    </div>
  );
}
