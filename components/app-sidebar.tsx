"use client"
import * as React from "react"
import { Package, LayoutDashboard, ArrowDownToLine, Truck, History, Settings, User, LogOut, ChevronDown, ArrowLeftRight, ClipboardList, Warehouse } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ActiveView } from "@/app/page"

interface AppSidebarProps {
  activeView: ActiveView
  onNavigate: (view: ActiveView) => void
  onLogout: () => void
}

export function AppSidebar({ activeView, onNavigate, onLogout }: AppSidebarProps) {
  const [operationsOpen, setOperationsOpen] = React.useState(true)

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Package className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">CoreInventory</span>
            <span className="text-xs text-muted-foreground">Warehouse Management</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "dashboard"} onClick={() => onNavigate("dashboard")}>
                  <LayoutDashboard className="h-4 w-4" /><span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "products"} onClick={() => onNavigate("products")}>
                  <Package className="h-4 w-4" /><span>Products</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <Collapsible open={operationsOpen} onOpenChange={setOperationsOpen}>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Truck className="h-4 w-4" /><span>Operations</span>
                      <ChevronDown className={`ml-auto h-4 w-4 transition-transform ${operationsOpen ? "rotate-180" : ""}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={activeView === "receipts"} onClick={() => onNavigate("receipts")}>
                          <ArrowDownToLine className="h-4 w-4" /><span>Receipts</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={activeView === "delivery"} onClick={() => onNavigate("delivery")}>
                          <Truck className="h-4 w-4" /><span>Delivery Orders</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={activeView === "transfers"} onClick={() => onNavigate("transfers")}>
                          <ArrowLeftRight className="h-4 w-4" /><span>Internal Transfers</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton isActive={activeView === "adjustments"} onClick={() => onNavigate("adjustments")}>
                          <ClipboardList className="h-4 w-4" /><span>Stock Adjustment</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "history"} onClick={() => onNavigate("history")}>
                  <History className="h-4 w-4" /><span>Move History</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={activeView === "warehouses"} onClick={() => onNavigate("warehouses")}>
                  <Warehouse className="h-4 w-4" /><span>Warehouses</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-sidebar-accent">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">JM</AvatarFallback>
              </Avatar>
              <div className="flex flex-1 flex-col">
                <span className="text-sm font-medium text-sidebar-foreground">John Manager</span>
                <span className="text-xs text-muted-foreground">Warehouse Manager</span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem><User className="mr-2 h-4 w-4" />Profile</DropdownMenuItem>
            <DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={onLogout}><LogOut className="mr-2 h-4 w-4" />Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
