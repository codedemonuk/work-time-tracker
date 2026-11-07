import type { TimeEntry } from './utils';

const DB_NAME = 'work-time-tracker';
const DB_VERSION = 1;
const STORE_NAME = 'entries';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
	if (typeof indexedDB === 'undefined') {
		return Promise.reject(new Error('IndexedDB is not available'));
	}

	dbPromise ??= openDatabase();

	return dbPromise;
}

function openDatabase(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onupgradeneeded = () => {
			const db = request.result;

			if (!db.objectStoreNames.contains(STORE_NAME)) {
				db.createObjectStore(STORE_NAME, { keyPath: 'id' });
			}
		};

		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Returns all time entries stored in IndexedDB.
 */
export async function getEntries(): Promise<TimeEntry[]> {
	const db = await openDb();

	return new Promise((resolve, reject) => {
		const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll();

		request.onsuccess = () => resolve(request.result as TimeEntry[]);
		request.onerror = () => reject(request.error);
	});
}

/**
 * Replaces all time entries stored in IndexedDB with the given entries.
 */
export async function saveEntries(entries: TimeEntry[]): Promise<void> {
	const db = await openDb();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction(STORE_NAME, 'readwrite');
		const store = transaction.objectStore(STORE_NAME);

		store.clear();
		entries.forEach((entry: TimeEntry) => store.put(entry));

		transaction.oncomplete = () => resolve();
		transaction.onerror = () => reject(transaction.error);
		transaction.onabort = () => reject(transaction.error);
	});
}
