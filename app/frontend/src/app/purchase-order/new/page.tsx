import { Outlet } from "react-router";

export default function PurchaseOrderNewLayout() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-6 pb-12 pt-4 sm:pt-8 lg:pt-12">
        <Outlet />
      </div>
    </div>
  );
}
