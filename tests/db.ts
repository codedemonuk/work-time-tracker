import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { getEntries, saveEntries } from '#lib/db.js';
import type { TimeEntry } from '#lib/utils.js';

function entry(id: number, date = '2026-11-02'): TimeEntry {
	return {
		id,
		date,
		startTime: '09:00',
		endTime: '11:45',
		hours: '2h 45m'
	};
}

beforeEach(async () => {
	await saveEntries([]);
});

describe('getEntries', () => {
	it('resolves with an empty array when nothing has been saved', async () => {
		await expect(getEntries()).resolves.toEqual([]);
	});
});

describe('saveEntries', () => {
	it('persists entries so they can be retrieved later', async () => {
		const entries = [entry(1), entry(2)];

		await saveEntries(entries);

		await expect(getEntries()).resolves.toEqual(entries);
	});

	it('persists all fields of an entry', async () => {
		await saveEntries([entry(1, '2026-11-05')]);

		await expect(getEntries()).resolves.toEqual([
			{ id: 1, date: '2026-11-05', startTime: '09:00', endTime: '11:45', hours: '2h 45m' }
		]);
	});

	it('replaces previously saved entries', async () => {
		await saveEntries([entry(1), entry(2)]);
		await saveEntries([entry(3)]);

		await expect(getEntries()).resolves.toEqual([entry(3)]);
	});

	it('clears all entries when saved with an empty array', async () => {
		await saveEntries([entry(1), entry(2)]);
		await saveEntries([]);

		await expect(getEntries()).resolves.toEqual([]);
	});
});
