"use client";

import { ModeToggle } from "@/components/mode-toggle";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	useSidebar,
} from "@/components/ui/sidebar";
import { TypographyH4 } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import Image from "next/image";
import DashboardRoutes from "./dashboard-routes";

function DashboardSidebar() {
	const { state } = useSidebar();
	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader className="border-b">
				<div className="flex items-center justify-between">
					<Image src="/logo.webp" alt="logo" width={50} height={50} />
					<TypographyH4 className={cn(state === "collapsed" && "hidden")}>
						Edu Learn
					</TypographyH4>
				</div>
			</SidebarHeader>
			<SidebarContent className="space-y-4 py-3 flex items-center justify-start flex-col">
				<DashboardRoutes />
			</SidebarContent>
			<SidebarFooter>
				<ModeToggle />
			</SidebarFooter>
		</Sidebar>
	);
}

export default DashboardSidebar;