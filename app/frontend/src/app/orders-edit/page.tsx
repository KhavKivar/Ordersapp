import { Button } from "@/components/ui/Button/button";
import { Card } from "@/components/ui/Card/card";
import { useNavigate, useParams } from "react-router";

export default function OrdersEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <p className="max-w-2xl text-base text-muted-foreground">
          Actualiza los datos del pedido seleccionado.
        </p>
        <Card className="p-6 text-left">
          <h2 className="text-lg font-semibold text-foreground">
            {`Editar pedido #${id ?? ""}`}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            La edicion de pedidos estara disponible aqui.
          </p>
          <div className="mt-6 flex">
            <Button variant="outline" onClick={() => navigate("/orders")}>
              Volver a pedidos
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
