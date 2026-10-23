import { toast } from "@/components/ui/toast";

export const handleError = (error: unknown) => {
	if (error instanceof Error) {
		toast.add({ title: String(error.cause), description: error.message });
	} else {
		toast.add({ description: String(error) });
		console.error("Error Occurred:", error);
	}
};
