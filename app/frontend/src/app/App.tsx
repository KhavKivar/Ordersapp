import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Routes } from "react-router";
import NewClientPage from "./clients/page";
import Home from "./home/page";
import Layout from "./layout";
import OrdersListPage from "./orders-list/page";
import OrdersPage from "./orders/page";
import OrdersEditPage from "./orders-edit/page";
import OrderDetailPage from "./orders-detail/page";
import PurchaseOrdersPage from "./purchase-orders/page";
import PurchaseOrdersListPage from "./purchase-orders-list/page";

const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<OrdersListPage />} />
          <Route path="/orders/new" element={<OrdersPage />} />
          <Route path="/orders/:id/edit" element={<OrdersEditPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
          <Route path="/clients/new" element={<NewClientPage />} />
          <Route path="/purchase-orders" element={<PurchaseOrdersPage />} />
          <Route
            path="/purchase-orders/list"
            element={<PurchaseOrdersListPage />}
          />
        </Route>
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
