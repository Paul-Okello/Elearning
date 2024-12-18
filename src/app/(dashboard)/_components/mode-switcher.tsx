"use client";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { VscArrowSwap } from "react-icons/vsc";

export default function ModeSwitcher() {
	const pathname = usePathname();

	const isTeacherPage = pathname?.startsWith("/teacher");
	const isPlayerPage = pathname?.includes("/chapter");
	return (
		<Card className="shadow-none">
			<CardHeader>
				<CardDescription className="">
					{isTeacherPage ? "Switch to Student Mode" : "Switch to Teacher Mode"}
				</CardDescription>
				<div className="">
					{isTeacherPage || isPlayerPage ? (
						<Link
							href="/index"
							className={buttonVariants({ variant: "secondary", size: "sm" })}
						>
							<VscArrowSwap className="h-4 w-4 mr-2" />
							Student Mode
						</Link>
					) : (
						<Link
							href="/teacher/courses"
							className={buttonVariants({ variant: "secondary", size: "sm" })}
						>
							<VscArrowSwap className="h-4 w-4 mr-2" />
							Teacher Mode
						</Link>
					)}
				</div>
			</CardHeader>
		</Card>
	);
}
