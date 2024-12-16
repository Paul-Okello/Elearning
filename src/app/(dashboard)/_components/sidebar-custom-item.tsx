"use client";

import { Button } from "@/components/ui/button";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

type Props = {
	icon: LucideIcon | IconType;
	label: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
};

function SidebarCustomItem({
	icon: Icon,
	label,
	href,
	disabled = false,
	external = false,
}: Props) {
	const pathname = usePathname();

	const isActive = pathname === href || pathname?.startsWith(`${href}/`);

	return (
		<SidebarMenuButton asChild>
			<Button size="sm" variant={isActive ? "link" : "ghost"}>
				<Icon className="mr-2 h-4 w-4" />
				<span>{label}</span>
			</Button>
		</SidebarMenuButton>
	);
}

export default SidebarCustomItem;