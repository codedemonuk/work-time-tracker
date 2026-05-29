import { describe, it, expect, beforeEach } from 'vitest';
import type { TimeEntry } from '$lib/utils';

// Simple in-memory store for testing
const memoryStore: Record<string, any> = {};

async function mockGet(key: string): Promise<any> {
    return memoryStore[key] || null;
}

async function mockSet(key: string, value: any): Promise<void> {
    memoryStore[key] = value;
}

async function mockClear(): Promise<void> {
    Object.keys(memoryStore).forEach(key => delete memoryStore[key]);
}

// Mock idb-keyval before importing db module
vi.mock('idb-keyval', () => ({
    get: vi.fn(mockGet),
    set: vi.fn(mockSet),
    clear: vi.fn(mockClear)
}));

const { getAllEntries, addEntry, deleteEntry, clearAllEntries } = await import('$lib/db');

describe('IndexedDB Tests (db.ts)', () => {
    beforeEach(async () => {
        memoryStore['entries'] = [];
    });

    describe('getAllEntries', () => {
        it('returns empty array when no entries exist', async () => {
            const entries = await getAllEntries();
            expect(entries).toEqual([]);
        });

        it('returns all entries after adding them', async () => {
            const entry1: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            const entry2: TimeEntry = {
                id: 2,
                date: '2024-01-16',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            await addEntry(entry1);
            await addEntry(entry2);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(2);
        });
    });

    describe('addEntry', () => {
        it('adds a single entry to the database', async () => {
            const entry: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            await addEntry(entry);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(1);
        });

        it('adds multiple entries with different IDs', async () => {
            const entry1: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            const entry2: TimeEntry = {
                id: 2,
                date: '2024-01-16',
                startTime: '09:30',
                endTime: '17:30',
                hours: '8h 0m'
            };

            await addEntry(entry1);
            await addEntry(entry2);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(2);
        });

        it('updates entry when adding with existing ID', async () => {
            const entry1: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            const entry2: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '18:00',
                hours: '9h 0m'
            };

            await addEntry(entry1);
            await addEntry(entry2);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(1);
            expect(entries[0].hours).toBe('9h 0m');
        });
    });

    describe('deleteEntry', () => {
        it('deletes an existing entry by ID', async () => {
            const entry: TimeEntry = {
                id: 1,
                date: '2024-01-15',
                startTime: '09:00',
                endTime: '17:00',
                hours: '8h 0m'
            };

            await addEntry(entry);
            await deleteEntry(1);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(0);
        });

        it('does not throw when deleting non-existent entry', async () => {
            await expect(deleteEntry(999)).resolves.not.toThrow();
        });

        it('deletes only the specified entry when multiple exist', async () => {
            const entry1: TimeEntry = { id: 1, date: '2024-01-15', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };
            const entry2: TimeEntry = { id: 2, date: '2024-01-16', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };
            const entry3: TimeEntry = { id: 3, date: '2024-01-17', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };

            await addEntry(entry1);
            await addEntry(entry2);
            await addEntry(entry3);

            await deleteEntry(2);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(2);
        });
    });

    describe('clearAllEntries', () => {
        it('removes all entries from the database', async () => {
            const entry1: TimeEntry = { id: 1, date: '2024-01-15', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };
            const entry2: TimeEntry = { id: 2, date: '2024-01-16', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };

            await addEntry(entry1);
            await addEntry(entry2);

            expect((await getAllEntries()).length).toBe(2);

            await clearAllEntries();
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(0);
        });

        it('works when database is empty', async () => {
            await expect(clearAllEntries()).resolves.not.toThrow();
        });
    });

    describe('Data Persistence', () => {
        it('preserves entry data after add and retrieve', async () => {
            const entry: TimeEntry = {
                id: 12345,
                date: '2024-06-15',
                startTime: '09:30',
                endTime: '18:00',
                hours: '8h 30m'
            };

            await addEntry(entry);
            
            const entries = await getAllEntries();
            expect(entries[0].id).toBe(entry.id);
            expect(entries[0].date).toBe(entry.date);
            expect(entries[0].startTime).toBe(entry.startTime);
            expect(entries[0].endTime).toBe(entry.endTime);
            expect(entries[0].hours).toBe(entry.hours);
        });

        it('handles entries with same date but different times', async () => {
            const entry1: TimeEntry = { id: 1, date: '2024-06-15', startTime: '09:00', endTime: '12:00', hours: '3h 0m' };
            const entry2: TimeEntry = { id: 2, date: '2024-06-15', startTime: '13:00', endTime: '17:00', hours: '4h 0m' };

            await addEntry(entry1);
            await addEntry(entry2);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(2);
        });
    });

    describe('Edge Cases', () => {
        it('handles entry with short duration (30 min)', async () => {
            const entry: TimeEntry = {
                id: 1,
                date: '2024-06-15',
                startTime: '09:00',
                endTime: '09:30',
                hours: '0h 30m'
            };

            await addEntry(entry);
            
            const entries = await getAllEntries();
            expect(entries.length).toBe(1);
        });

        it('handles large number of entries', async () => {
            for (let i = 0; i < 50; i++) {
                const entry: TimeEntry = {
                    id: i,
                    date: `2024-06-${String(i + 1).padStart(2, '0')}`,
                    startTime: '09:00',
                    endTime: '17:00',
                    hours: '8h 0m'
                };
                await addEntry(entry);
            }

            const entries = await getAllEntries();
            expect(entries.length).toBe(50);
        });
    });

    describe('Error Handling', () => {
        it('returns empty array when database is fresh', async () => {
            const entries = await getAllEntries();
            expect(entries).toEqual([]);
        });

        it('handles concurrent operations gracefully', async () => {
            const entry: TimeEntry = { id: 1, date: '2024-06-15', startTime: '09:00', endTime: '17:00', hours: '8h 0m' };

            await Promise.all([addEntry(entry), addEntry(entry)]);
            
            const entries = await getAllEntries();
            expect(entries.length).toBeGreaterThanOrEqual(1);
        });
    });
});
