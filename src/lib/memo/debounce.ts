export function debounce<T extends (...args: never[]) => void>(
	func: T,
	delay = 15000,
) {
	let timer: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => {
			func(...args);
		}, delay);
	};
}
