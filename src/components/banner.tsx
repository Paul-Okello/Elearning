import { type VariantProps, cva } from "class-variance-authority";
import { AlertTriangle, CheckCircleIcon } from "lucide-react";
import React from "react";
import { cn } from "../lib/utils";

const bannerVariants = cva("border text-center p-4 flex items-center w-full", {
	variants: {
		variant: {
			warning: "bg-yellow-200/80 border-yellow-500 text-yellow-900  my-2",
			success: "bg-primary border-primary text-secondary  my-2",
		},
	},
	defaultVariants: {
		variant: "warning",
	},
});

interface Props extends VariantProps<typeof bannerVariants> {
	label: string;
}

const iconMap = {
	warning: AlertTriangle,
	success: CheckCircleIcon,
};

function Banner({ label, variant }: Props) {
	const Icon = iconMap[variant || "warning"];
	return (
		<div
			className={cn(
				bannerVariants({
					variant,
				}),
			)}
		>
			<Icon className="mr-2 size-6" />
			{label}
		</div>
	);
}

export default Banner;