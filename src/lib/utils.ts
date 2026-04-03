export interface TimeEntry {
	id: number;
	date: string;
	startTime: string;
	endTime: string;
	hours: string;
}

export function formatDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
	return new Date(dateString).toLocaleDateString(undefined, options);
}

export function getNextWeekdayDate(inputDateStr: string): string {
	const inputDate = new Date(inputDateStr);
	const nextDay = new Date(inputDate);
	nextDay.setDate(inputDate.getDate() + 1);

	if (nextDay.getDay() === 0) {
		nextDay.setDate(inputDate.getDate() + 6);
	} else if (nextDay.getDay() === 6) {
		nextDay.setDate(inputDate.getDate() + 2);
	}

	if (nextDay.getDay() >= 1 && nextDay.getDay() <= 5) {
		if (nextDay.getDay() === 5) {
			nextDay.setDate(inputDate.getDate() + 3);
		}
	}

	const year = nextDay.getFullYear();
	const month = String(nextDay.getMonth() + 1).padStart(2, '0');
	const day = String(nextDay.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

export function calculateHours(dateStr: string, start: string, end: string): string {
	const startDate = new Date(`${dateStr}T${start}`);
	const endDate = new Date(`${dateStr}T${end}`);
	const diffMs = endDate.getTime() - startDate.getTime();
	const hours = Math.floor(diffMs / (1000 * 60 * 60));
	const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}h ${minutes}m`;
}

export function calculateTotalHours(entries: TimeEntry[]): string {
	let totalMs = 0;
	entries.forEach((entry: TimeEntry) => {
		const start = new Date(`${entry.date}T${entry.startTime}`);
		const end = new Date(`${entry.date}T${entry.endTime}`);
		totalMs += end.getTime() - start.getTime();
	});
	const hours = Math.floor(totalMs / (1000 * 60 * 60));
	const minutes = Math.floor((totalMs % (1000 * 60 * 60)) / (1000 * 60));
	return `${hours}h ${minutes}m`;
}
