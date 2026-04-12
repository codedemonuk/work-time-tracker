import { describe, it, expect } from 'vitest';
import { formatDate, getNextWeekdayDate, calculateHours, calculateTotalHours, getFirstWeekdayOfMonth, type TimeEntry } from '$lib/utils';

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

describe('getFirstWeekdayOfMonth', () => {
	it('returns the first weekday of the month when 1st is a Monday', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-01-01'));
		expect(result).toBe('2024-01-01');
	});

	it('returns the first weekday of the month when 1st is a Saturday', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-05-01'));
		expect(result).toBe('2024-05-01');
	});

	it('returns the first weekday of the month when 1st is a Sunday', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-02-01'));
		expect(result).toBe('2024-02-01');
	});

	it('returns the first weekday of the month when 1st is a Tuesday', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-03-01'));
		expect(result).toBe('2024-03-01');
	});

	it('returns the first weekday of the month when 1st is a Friday', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-06-01'));
		expect(result).toBe('2024-06-03');
	});

	it('handles different months correctly', () => {
		const result = getFirstWeekdayOfMonth(new Date('2024-12-01'));
		expect(result).toBe('2024-12-02');
	});
});
