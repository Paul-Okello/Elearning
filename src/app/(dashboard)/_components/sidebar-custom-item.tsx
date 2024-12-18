"use client";

import {
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";


type Props = {
	icon: LucideIcon | IconType;
	label: string;
	href: string;
	disabled?: boolean;
	external?: boolean;
};

function SidebarCustomItem({ icon: Icon, label, href }: Props) {
	const pathname = usePathname();
	const { state } = useSidebar();

	const isActive = pathname === href || pathname?.startsWith(`${href}/`);

	return (
		<SidebarMenuItem className={cn(state === "collapsed" && "mx-0", "mx-3")}>
			<Tooltip>
				<TooltipTrigger asChild>
					<SidebarMenuButton asChild isActive={isActive}>
						<Link href={href}>
							<Icon className="mr-2 size-5" />
							<span className={cn(state === "collapsed" && "hidden")}>
								{label}
							</span>
						</Link>
					</SidebarMenuButton>
				</TooltipTrigger>
				<TooltipContent
					className={cn(state === "expanded" && "hidden")}
					side="right"
					align="center"
				>
					{label}
				</TooltipContent>
			</Tooltip>
		</SidebarMenuItem>
	);
}

export default SidebarCustomItem;
