import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import { LucideIcon } from "lucide-react";

// Corrected and updated `cva` configuration
const backgroundVariants = cva(
	"rounded-full flex items-center justify-center",
	{
		variants: {
			variant: {
				default: "bg-primary/20",
				success: "bg-emerald-100", // Fixed typo
			},
			size: {
				default: "p-2",
				sm: "p-1",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

const iconVariants = cva("", {
	variants: {
		variant: {
			default: "text-primary",
			success: "text-emerald-700", // Fixed typo
		},
		size: {
			default: "h-8 w-8",
			sm: "h-4 w-4",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

// Extend the prop types to mark `variant` and `size` as optional
type BackgroundVariantsProps = VariantProps<typeof backgroundVariants>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
	icon: LucideIcon;
}

export const IconBadge = ({ icon: Icon, variant, size }: IconBadgeProps) => {
	return (
		<div
			className={cn(
				backgroundVariants({
					variant,
					size,
				}),
			)}
		>
			<Icon
				className={cn(
					iconVariants({
						variant,
						size,
					}),
				)}
			/>
		</div>
	);
};