"use client"

import * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { DashboardHeader } from "@/components/dashboard-header"
import { KPICards } from "@/components/kpi-cards"
import { FiltersBar } from "@/components/filters-bar"
import { OperationsTable } from "@/components/operations-table"
import { AddProductModal } from "@/components/add-product-modal"
import { StockMovementChart } from "@/components/stock-movement-chart"
import { ReceiptModal } from "@/components/receipt-modal"
import { DeliveryModal } from "@/components/delivery-modal"
import { TransferModal } from "@/components/transfer-modal"
import { AdjustmentModal } from "@/components/adjustment-modal"
import { ProductsView } from "@/components/products-view"
import { HistoryView } from "@/components/history-view"
import { WarehousesView } from "@/components/warehouses-view"
import { LoginPage } from "@/components/login-page"

export type ActiveView = "dashboard" | "products" | "receipts" | "delivery" | "transfers" | "adjustments" | "history" | "warehouses"

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false)
  const [addProductOpen, setAddProductOpen] = React.useState(false)
  const [receiptOpen, setReceiptOpen] = React.useState(false)
  const [deliveryOpen, setDeliveryOpen] = React.useState(false)
  const [transferOpen, setTransferOpen] = React.useState(false)
  const [adjustmentOpen, setAdjustmentOpen] = React.useState(false)
  const [activeView, setActiveView] = React.useState<ActiveView>("dashboard")

  // Check for existing token on mount
  React.useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (token) setIsLoggedIn(true)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    setIsLoggedIn(false)
    setActiveView("dashboard")
  }

  const handleNav = (view: ActiveView) => {
    setActiveView(view)
    if (view === "receipts") setReceiptOpen(true)
    else if (view === "delivery") setDeliveryOpen(true)
    else if (view === "transfers") setTransferOpen(true)
    else if (view === "adjustments") setAdjustmentOpen(true)
  }

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />
  }

  return (
    <SidebarProvider>
      <AppSidebar activeView={activeView} onNavigate={handleNav} onLogout={handleLogout} />
      <SidebarInset>
        <DashboardHeader onNewProductClick={() => setAddProductOpen(true)} />
        <main className="flex-1 overflow-auto p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {activeView === "dashboard" && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Inventory Dashboard</h1>
                  <p className="text-muted-foreground">Monitor your warehouse operations and inventory levels</p>
                </div>
                <KPICards />
                <StockMovementChart />
                <FiltersBar />
                <OperationsTable />
              </>
            )}
            {activeView === "products" && <ProductsView onAddProduct={() => setAddProductOpen(true)} />}
            {activeView === "history" && <HistoryView />}
            {activeView === "warehouses" && <WarehousesView />}
            {(activeView === "receipts" || activeView === "delivery" || activeView === "transfers" || activeView === "adjustments") && (
              <>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Inventory Dashboard</h1>
                  <p className="text-muted-foreground">Monitor your warehouse operations and inventory levels</p>
                </div>
                <KPICards />
                <StockMovementChart />
                <FiltersBar />
                <OperationsTable />
              </>
            )}
          </div>
        </main>
      </SidebarInset>
      <AddProductModal open={addProductOpen} onOpenChange={setAddProductOpen} />
      <ReceiptModal open={receiptOpen} onOpenChange={setReceiptOpen} />
      <DeliveryModal open={deliveryOpen} onOpenChange={setDeliveryOpen} />
      <TransferModal open={transferOpen} onOpenChange={setTransferOpen} />
      <AdjustmentModal open={adjustmentOpen} onOpenChange={setAdjustmentOpen} />
    </SidebarProvider>
  )
}
