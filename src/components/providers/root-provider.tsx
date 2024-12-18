"use client";

import ConfettiProvider from "@/components/providers/confetti-provider";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NextTopLoader from "nextjs-toploader";
import type React from "react";

export default function RootProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ConvexClientProvider>
			<TooltipProvider>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<NextTopLoader
						color="#facc15"
						initialPosition={0.08}
						crawlSpeed={200}
						height={5}
						crawl={true}
						showSpinner={false}
						easing="ease"
						speed={200}
						shadow="0 0 20px #facc15,0 0 10px #facc15"
						template='<div class="bar z-[99999]" role="bar"><div class="peg"></div></div>'
						zIndex={1600}
						showAtBottom={false}
					/>
					{children}
					<Toaster closeButton richColors position="top-center" />
					<ConfettiProvider />
				</ThemeProvider>
			</TooltipProvider>
		</ConvexClientProvider>
	);
}