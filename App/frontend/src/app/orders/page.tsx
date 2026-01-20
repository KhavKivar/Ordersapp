

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

type Product = {
  id: number;
  name: string;
  sellPriceClient: number;
};

type Client = {
  id: number;
  name: string | null;
  phone: string | null;
};

type ProductsResponse = {
  products: Product[];
};

type ClientsResponse = {
  clients: Client[];
};

type OrderLine = {
  productId: number;
  name: string;
  price: number;
  quantity: number;
};

const formatCurrency = (value: number) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(safeValue);
};

export default function OrdersPage() {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [clientQuery, setClientQuery] = useState("");
  const [clientLocked, setClientLocked] = useState(false);
  const [productQuery, setProductQuery] = useState("");
  const [productLocked, setProductLocked] = useState(false);
  const [quantity, setQuantity] = useState("1");
  const [orderLines, setOrderLines] = useState<OrderLine[]>([]);
  const {
    isPending: productsPending,
    error: productsError,
    data: productsData,
  } = useQuery({
    queryKey: ["products"],
    queryFn: () => fetch(API_BASE_URL + "/products").then((res) => res.json()),
  });

  const {
    isPending: clientsPending,
    error: clientsError,
    data: clientsData,
  } = useQuery({
    queryKey: ["clients"],
    queryFn: () => fetch(API_BASE_URL + "/clients").then((res) => res.json()),
  });
  console.log("Clients Data:", productsData);
  const products =
    (productsData as ProductsResponse | undefined)?.products ?? [];
  const clients = (clientsData as ClientsResponse | undefined)?.clients ?? [];
  const isLoading = productsPending || clientsPending;
  const hasError = productsError || clientsError;
  const clientLabels = clients.map(
    (client) =>
      `${client.name || "Cliente sin nombre"}${
        client.phone ? ` · ${client.phone}` : ""
      }`
  );
  const clientQueryLower = clientQuery.trim().toLowerCase();
  const clientSuggestions = clientLabels
    .filter((label) =>
      clientQueryLower ? label.toLowerCase().includes(clientQueryLower) : true
    )
    .slice(0, 5);
  const productQueryLower = productQuery.trim().toLowerCase();
  const productSuggestions = products
    .filter((product) =>
      productQueryLower
        ? product.name.toLowerCase().includes(productQueryLower)
        : true
    )
    .slice(0, 5);
  const selectedProduct = products.find(
    (product) => product.name === productQuery
  );

  const orderTotal = orderLines.reduce(
    (sum, line) => sum + line.price * line.quantity,
    0
  );
  const parsedQuantity = Number.parseInt(quantity, 10);
  const normalizedQuantity = Number.isFinite(parsedQuantity)
    ? parsedQuantity
    : 0;

  const handleAddProduct = () => {
    if (!selectedProduct || normalizedQuantity < 1) return;
    const price = Number(selectedProduct.sellPriceClient);
    console.log("Price:", price);
    const safePrice = Number.isFinite(price) ? price : 0;

    setOrderLines((prev) => {
      const existing = prev.find(
        (line) => line.productId === selectedProduct.id
      );
      if (!existing) {
        return [
          ...prev,
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            price: safePrice,
            quantity: normalizedQuantity,
          },
        ];
      }

      return prev.map((line) =>
        line.productId === selectedProduct.id
          ? {
              ...line,
              price: safePrice,
              quantity: line.quantity + normalizedQuantity,
            }
          : line
      );
    });

    setProductLocked(true);
    setProductQuery(selectedProduct.name);
    setQuantity("1");
  };

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error loading data</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-rose-50 text-slate-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <header className="space-y-3">
          <a
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-amber-700 transition hover:text-amber-600"
            href="/"
          >
            <span className="text-base">←</span>
            Volver
          </a>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            Crear pedido
          </p>
          <h1 className="text-4xl font-semibold text-slate-900">
            Nuevo pedido manual
          </h1>
          <p className="max-w-2xl text-base text-slate-600">
            Selecciona el cliente y define los productos del pedido.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-amber-100 bg-white/90 p-8 shadow-[0_24px_80px_-60px_rgba(15,23,42,0.7)]">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  Cliente
                </label>
                <div className="relative">
                  <input
                    className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                      clientLocked ? "pr-24" : ""
                    }`}
                    list="clients-list"
                    placeholder="Busca un cliente"
                    value={clientQuery}
                    readOnly={clientLocked}
                    onChange={(event) => {
                      const nextValue = event.target.value;
                      setClientQuery(nextValue);
                      if (!clientLocked && clientLabels.includes(nextValue)) {
                        setClientLocked(true);
                      }
                    }}
                  />
                  {clientLocked && (
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                      onClick={() => {
                        setClientLocked(false);
                        setClientQuery("");
                      }}
                    >
                      Cambiar
                    </button>
                  )}
                </div>
                <datalist id="clients-list">
                  {clientSuggestions.map((label) => (
                    <option key={label} value={label} />
                  ))}
                </datalist>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-[1.4fr_0.6fr_0.4fr]">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Producto
                  </label>
                  <div className="relative">
                    <input
                      className={`w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100 ${
                        productLocked ? "pr-24" : ""
                      }`}
                      list="products-list"
                      placeholder="Busca un producto"
                      value={productQuery}
                      readOnly={productLocked}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setProductQuery(nextValue);
                        if (
                          !productLocked &&
                          products.some((product) => product.name === nextValue)
                        ) {
                          setProductLocked(true);
                        }
                      }}
                    />
                    {productLocked && (
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                        onClick={() => {
                          setProductLocked(false);
                          setProductQuery("");
                        }}
                      >
                        Cambiar
                      </button>
                    )}
                  </div>
                  <datalist id="products-list">
                    {productSuggestions.map((product) => (
                      <option key={product.id} value={product.name} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Cantidad
                  </label>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-100"
                    min={1}
                    type="number"
                    value={quantity}
                    onChange={(event) => {
                      setQuantity(event.target.value);
                    }}
                  />
                </div>
                <div className="flex items-end">
                  <button
                    className="w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    type="button"
                    onClick={handleAddProduct}
                    disabled={!selectedProduct || normalizedQuantity < 1}
                  >
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-amber-100 bg-white/90 p-6">
              <h2 className="text-lg font-semibold text-slate-900">
                Resumen del pedido
              </h2>
              <div className="mt-4 space-y-3">
                {orderLines.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    Aun no hay productos agregados.
                  </p>
                ) : (
                  orderLines.map((line) => (
                    <div
                      key={line.productId}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700"
                    >
                      <span>
                        {line.name} x {line.quantity}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900">
                          {formatCurrency(line.price * line.quantity)}
                        </span>
                        <button
                          type="button"
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                          onClick={() =>
                            setOrderLines((prev) =>
                              prev.filter(
                                (item) => item.productId !== line.productId
                              )
                            )
                          }
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4 text-sm text-slate-700">
                <span>Total</span>
                <span className="text-base font-semibold text-slate-900">
                  {formatCurrency(orderTotal)}
                </span>
              </div>
              <button
                className="mt-6 w-full rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                type="button"
                disabled={orderLines.length === 0 || !clientLocked}
              >
                Crear pedido
              </button>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
}
