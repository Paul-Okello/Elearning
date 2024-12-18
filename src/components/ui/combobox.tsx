"use client";

import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ComboboxProps {
	options: { value: string; label: string; description?: string }[];
	value?: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export default function Combobox({
	options,
	value,
	onChange,
	placeholder,
}: ComboboxProps) {
	const [open, setOpen] = React.useState(false);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					aria-expanded={open}
					className="w-full justify-between"
				>
					{value
						? options.find((option) => option.value === value)?.label
						: "Select option..."}
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-full p-0">
				<Command>
					<CommandInput placeholder={placeholder || "Search option..."} />
					<CommandList>
						<CommandEmpty>No option found.</CommandEmpty>
						<ScrollArea className="h-[300px]">
							<CommandGroup>
								{options.map((option, index) => (
									<CommandItem
										key={`${option.value}-${Math.PI * index + index}`}
										value={option.value}
										onSelect={() => {
											onChange(option.value === value ? "" : option.value);
											setOpen(false); // Close the popover after selection
										}}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												value === option.value ? "opacity-100" : "opacity-0",
											)}
										/>
										<div className="flex flex-col">
											<span>{option.label}</span>
											{option.description && (
												<span className="text-xs text-muted-foreground">
													{option.description}
												</span>
											)}
										</div>
									</CommandItem>
								))}
							</CommandGroup>
						</ScrollArea>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}