import Navbar from "@/components/layouts/site-header";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import React from 'react'
import DashboardSidebar from "./_components/dashboard-sidebar";

type Props = {
  children: React.ReactNode
}

export default function DashboardLayout({children}: Props) {
  return (
			<div className="flex">
				<SidebarProvider>
					<DashboardSidebar />
					<main className="flex-1 ">
						<Navbar>
							<div className="container flex h-14 items-center justify-between">
								<SidebarTrigger />
								<div className="flex items-center gap-x-2 justify-center">
									<div className="">
										<ClerkLoading>
											<Loader2 className="size-5 animate-spin" />
										</ClerkLoading>
										<ClerkLoaded>
											<UserButton />
										</ClerkLoaded>
									</div>
									<ModeToggle />
								</div>
							</div>
						</Navbar>
						<div className="">{children}</div>
					</main>
				</SidebarProvider>
			</div>
		);
}

