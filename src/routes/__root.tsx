import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "@/components/ui/toast";

const RootLayout = () => (
	<div className="mx-3 flex flex-col h-screen">
		{/* Navi */}
		<div className="p-2 shrink-0 flex gap-2">
			<Link to="/" className="[&.active]:font-bold">
				Home
			</Link>{" "}
			<Link to="/about" className="[&.active]:font-bold">
				About
			</Link>
		</div>
		<hr />
		{/* Main Content */}
		<Outlet />
		<Toaster />
		<TanStackRouterDevtools />
	</div>
);

export const Route = createRootRoute({ component: RootLayout });
