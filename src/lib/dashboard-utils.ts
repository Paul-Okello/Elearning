import { BarChart, Compass, Layout, List } from "lucide-react";

const guestRoutes = [
	{
		icon: Layout,
		label: "Dashboard",
		href: "/index",
	},
	{
		icon: Compass,
		label: "Browse",
		href: "/index/search",
	},
];

const teacherRoutes = [
	{
		icon: List,
		label: "Courses",
		href: "/teacher/courses",
	},
	{
		icon: BarChart,
		label: "Analytics",
		href: "/teacher/analytics",
	},
];

export { guestRoutes, teacherRoutes };