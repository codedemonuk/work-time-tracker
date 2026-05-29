import type { TimeEntry } from './utils';
import * as idbKeyVal from 'idb-keyval';

export async function getAllEntries(): Promise<TimeEntry[]> {
    const entries = await idbKeyVal.get<TimeEntry[]>('entries');
    return entries || [];
}

export async function addEntry(entry: TimeEntry): Promise<void> {
    const entries = await idbKeyVal.get<TimeEntry[]>('entries') || [];
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
        entries[existingIndex] = entry;
    } else {
        entries.push(entry);
    }
    
    await idbKeyVal.set('entries', entries);
}

export async function deleteEntry(id: number): Promise<void> {
    const entries = await idbKeyVal.get<TimeEntry[]>('entries') || [];
    const filtered = entries.filter(e => e.id !== id);
    await idbKeyVal.set('entries', filtered);
}

export async function clearAllEntries(): Promise<void> {
    await idbKeyVal.set('entries', []);
}
