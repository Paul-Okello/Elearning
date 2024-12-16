import DashboardSidebar from "./_components/dashboard-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import React from 'react'

type Props = {
  children: React.ReactNode
}
export default function DashboardLayout({children}: Props) {
  return (
    <SidebarProvider>
    <DashboardSidebar />
    <main>
      <SidebarTrigger />
      {children}
    </main>
  </SidebarProvider>
  )
}
