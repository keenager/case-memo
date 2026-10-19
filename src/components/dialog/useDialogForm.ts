import { zodResolver } from "@hookform/resolvers/zod";
import { type NavigateOptions, useNavigate } from "@tanstack/react-router";
import type QueryResult from "@tauri-apps/plugin-sql";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import type { object } from "zod";

type Props = {
	schema: ReturnType<typeof object>;
	defaultValues: Record<string, unknown>;
	fnToDB: (data: Record<string, any>) => Promise<QueryResult>;
	naviOptions?: NavigateOptions;
};

export default function useDialogForm({
	schema,
	defaultValues,
	fnToDB,
	naviOptions,
}: Props) {
	const [open, setOpen] = useState(false);
	const navi = useNavigate();

	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues,
		mode: "onChange",
	});

	async function onSubmit(data: z.infer<typeof schema>) {
		console.log("Form submitted:", data);
		// Here you can handle the form submission, e.g., save to database or state
		try {
			const result = await fnToDB(data);
			console.log("Hearing saved:", result);
		} catch (error) {
			// TODO: 토스트 메시지 띄우기
			console.error("Error saving case:", error);
		}
		setOpen(false);
		form.reset();
		if (naviOptions) {
			navi(naviOptions);
		}
	}
	return { form, onSubmit, open, setOpen };
}
