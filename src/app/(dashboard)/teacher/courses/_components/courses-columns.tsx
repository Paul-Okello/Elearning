"use client";

import { api } from "@/_generated/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TypographyInlineCode } from "@/components/ui/typography";
import { formatPrice } from "@/lib/format";
import type { ColumnDef } from "@tanstack/react-table";
import { FunctionReturnType } from "convex/server";
import { ArrowUpDown, MoreHorizontal, Pencil } from "lucide-react";
import Link from "next/link";

type Column = FunctionReturnType<typeof api.course.course.getCoursesByUser>[0];

export const coursesColumns: ColumnDef<Column>[] = [
	{
		accessorKey: "title",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Title
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "price",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Price
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const price = Number.parseFloat(row.getValue("price") || "0");
			const formatted = formatPrice(price);
			return <div>{formatted}</div>;
		},
	},
	{
		accessorKey: "isPublished",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					size="sm"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Published
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
		cell: ({ row }) => {
			const isPublished = row.getValue("isPublished") || false;
			return (
				<Badge variant={isPublished ? "default" : "outline"}>
					{isPublished ? "Published" : "Draft"}
				</Badge>
			);
		},
	},
	{
		accessorKey: "chapters",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Chapters" />
		),
		cell: ({ row }) => {
			const { chapters } = row.original;

			return (
				<TypographyInlineCode>
					{chapters.length} {chapters.length === 1 ? "Chapter" : "Chapters"}
				</TypographyInlineCode>
			);
		},
	},
	{
		accessorKey: "attachments",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Attachments" />
		),
		cell: ({ row }) => {
			const { attachments } = row.original;
			return (
				<TypographyInlineCode>
					{attachments.length}{" "}
					{attachments.length === 1 ? "Attachment" : "Attachments"}
				</TypographyInlineCode>
			);
		},
	},
	{
		id: "actions",
		header: "Actions",
		cell: ({ row }) => {
			const { _id } = row.original;
			return (
				<Button className="" variant="secondary" size="sm" asChild>
					<Link className="flex items-center" href={`/teacher/courses/${_id}`}>
						<Pencil className="h-4 w-4 mr-2" />
						Edit
					</Link>
				</Button>
			);
		},
	},
];