import { Sidebar, SidebarContent } from "@/components/ui/sidebar";
import React from "react";
import DashboardRoutes from "./dashboard-routes";

function DashboardSidebar() {
	return (
		<Sidebar>
			<SidebarContent>
				<DashboardRoutes />
			</SidebarContent>
		</Sidebar>
	);
}

export default DashboardSidebar;