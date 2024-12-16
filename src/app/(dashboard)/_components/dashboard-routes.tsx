"use client";

import { SidebarMenu } from "@/components/ui/sidebar";
import { guestRoutes, teacherRoutes } from "@/lib/dashboard-utils";
import { usePathname } from "next/navigation";
import React from "react";
import SidebarCustomItem from "./sidebar-custom-item";

function DashboardRoutes() {
	const pathname = usePathname();
	const isTeacherPage = pathname?.includes("/teacher");
	const routes = isTeacherPage ? teacherRoutes : guestRoutes;
	return (
		<SidebarMenu>
			{routes.map(({ href, icon, label }) => (
				<SidebarCustomItem key={href} icon={icon} label={label} href={href} />
			))}
		</SidebarMenu>
	);
}

export default DashboardRoutes;


