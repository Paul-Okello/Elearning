"use client";

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
import Link from "next/link";
import DashboardRoutes from "./dashboard-routes";
import ModeSwitcher from "./mode-switcher";

function DashboardSidebar() {
	const { state } = useSidebar();
	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader className="border-b">
				<div className="flex items-center justify-between">
					<Link href="/">
						<Image src="/logo.webp" alt="logo" width={50} height={50} />
					</Link>

					<TypographyH4 className={cn(state === "collapsed" && "hidden")}>
						Edu Learn
					</TypographyH4>
				</div>
			</SidebarHeader>
			<SidebarContent className="space-y-4 py-3 flex items-center justify-start flex-col">
				<DashboardRoutes />
			</SidebarContent>
			<SidebarFooter>
				<ModeSwitcher />
			</SidebarFooter>
		</Sidebar>
	);
}

export default DashboardSidebar;