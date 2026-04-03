import { describe, it, expect } from 'vitest';
import { formatDate, getNextWeekdayDate, calculateHours, calculateTotalHours, type TimeEntry } from '$lib/utils';

describe('formatDate', () => {
	it('formats a date string in short month format', () => {
		const result = formatDate('2024-01-15');
		expect(result).toContain('15');
		expect(result).toMatch(/Jan/);
		expect(result).toMatch(/2024/);
	});

	it('handles different months correctly', () => {
		expect(formatDate('2024-02-28')).toMatch(/Feb/);
		expect(formatDate('2024-12-25')).toMatch(/Dec/);
		expect(formatDate('2024-06-01')).toMatch(/Jun/);
	});

	it('includes day of month', () => {
		const result = formatDate('2024-03-10');
		expect(result).toContain('10');
	});
});

describe('getNextWeekdayDate', () => {
	it('returns next day for Monday (Tuesday)', () => {
		const result = getNextWeekdayDate('2024-01-08');
		expect(result).toBe('2024-01-09');
	});

	it('returns next day for Tuesday (Wednesday)', () => {
		const result = getNextWeekdayDate('2024-01-09');
		expect(result).toBe('2024-01-10');
	});

	it('handles month boundary', () => {
		const result = getNextWeekdayDate('2026-03-31');
		expect(result).toBe('2026-04-01');
	});
});

describe('calculateHours', () => {
	it('calculates exact hours with no minutes', () => {
		const result = calculateHours('2024-01-15', '09:00', '17:00');
		expect(result).toBe('8h 0m');
	});

	it('calculates hours with minutes', () => {
		const result = calculateHours('2024-01-15', '09:00', '10:30');
		expect(result).toBe('1h 30m');
	});

	it('calculates fractional hours correctly', () => {
		const result = calculateHours('2024-01-15', '09:00', '11:45');
		expect(result).toBe('2h 45m');
	});

	it('handles 15 minute intervals', () => {
		const result = calculateHours('2024-01-15', '09:00', '09:15');
		expect(result).toBe('0h 15m');
	});

	it('handles 30 minute intervals', () => {
		const result = calculateHours('2024-01-15', '14:00', '14:30');
		expect(result).toBe('0h 30m');
	});

	it('calculates full work day (9-5)', () => {
		const result = calculateHours('2024-01-15', '09:00', '17:00');
		expect(result).toBe('8h 0m');
	});

	it('handles short break (30 min)', () => {
		const result = calculateHours('2024-01-15', '12:00', '12:30');
		expect(result).toBe('0h 30m');
	});
});

describe('calculateTotalHours', () => {
	it('returns 0h 0m for empty entries', () => {
		const result = calculateTotalHours([]);
		expect(result).toBe('0h 0m');
	});

	it('calculates total for single entry', () => {
		const entries: TimeEntry[] = [
			{ id: 1, date: '2024-01-15', startTime: '09:00', endTime: '17:00', hours: '8h 0m' }
		];
		const result = calculateTotalHours(entries);
		expect(result).toBe('8h 0m');
	});

	it('calculates total for multiple entries', () => {
		const entries: TimeEntry[] = [
			{ id: 1, date: '2024-01-15', startTime: '09:00', endTime: '17:00', hours: '8h 0m' },
			{ id: 2, date: '2024-01-16', startTime: '09:00', endTime: '13:00', hours: '4h 0m' },
			{ id: 3, date: '2024-01-17', startTime: '10:00', endTime: '14:30', hours: '4h 30m' }
		];
		const result = calculateTotalHours(entries);
		expect(result).toBe('16h 30m');
	});

	it('accumulates minutes correctly', () => {
		const entries: TimeEntry[] = [
			{ id: 1, date: '2024-01-15', startTime: '09:00', endTime: '09:30', hours: '0h 30m' },
			{ id: 2, date: '2024-01-15', startTime: '10:00', endTime: '10:30', hours: '0h 30m' },
			{ id: 3, date: '2024-01-15', startTime: '11:00', endTime: '11:30', hours: '0h 30m' },
			{ id: 4, date: '2024-01-15', startTime: '12:00', endTime: '12:30', hours: '0h 30m' }
		];
		const result = calculateTotalHours(entries);
		expect(result).toBe('2h 0m');
	});

	it('handles single 15-minute entry', () => {
		const entries: TimeEntry[] = [
			{ id: 1, date: '2024-01-15', startTime: '09:00', endTime: '09:15', hours: '0h 15m' }
		];
		const result = calculateTotalHours(entries);
		expect(result).toBe('0h 15m');
	});
});
