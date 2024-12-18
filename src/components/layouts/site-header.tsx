
import React from "react";

type Props = {
	children: React.ReactNode;
};

const Navbar = ({ children }: Props) => {
	return (
		<header className="border-grid sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			{children}
		</header>
	);
};

export default Navbar;