"use client";

import {
	ThemeProvider as NextThemesProvider,
	type ThemeProviderProps,
} from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	// State to check if the component is mounted on the client
	const [mounted, setMounted] = useState(false);

	// Only set mounted to true on client-side rendering
	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted)
		// Prevent rendering on the server
		return null;

	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}