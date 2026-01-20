import { Route, Routes } from "react-router";
import Home from "./home/page";
import OrdersPage from "./orders/page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const queryClient = new QueryClient()
function App() {
  return (
  <QueryClientProvider client={queryClient}> 
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<OrdersPage   />}/>
    </Routes>
    </QueryClientProvider>
  );
}

export default App
