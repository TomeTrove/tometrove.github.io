import JSZip from 'jszip';

const DB_NAME = 'TomeEditorDB';
const STORE_NAME = 'currentPreview';
const DB_VERSION = 1;

interface TomePreviewData {
  zipData: ArrayBuffer;
  filename: string;
  timestamp: number;
}

/**
 * Open IndexedDB connection
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

/**
 * Save tome ZIP to IndexedDB for preview
 */
export async function saveTomeToStorage(zip: JSZip, filename: string): Promise<void> {
  try {
    // Generate ZIP as ArrayBuffer
    const zipData = await zip.generateAsync({ type: 'arraybuffer' });

    const data: TomePreviewData = {
      zipData,
      filename,
      timestamp: Date.now(),
    };

    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.put(data, 'current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    throw new Error(`Failed to save tome to storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Load tome from IndexedDB
 */
export async function loadTomeFromStorage(): Promise<{ zip: JSZip; filename: string } | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const data = await new Promise<TomePreviewData | undefined>((resolve, reject) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    if (!data) {
      return null;
    }

    // Load ZIP from ArrayBuffer
    const zip = await new JSZip().loadAsync(data.zipData);

    return {
      zip,
      filename: data.filename,
    };
  } catch (error) {
    console.error('Failed to load tome from storage:', error);
    return null;
  }
}

/**
 * Clear tome preview data from storage
 */
export async function clearTomeStorage(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    return new Promise((resolve, reject) => {
      const request = store.delete('current');
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Failed to clear tome storage:', error);
  }
}

/**
 * Check if there's a tome in storage
 */
export async function hasTomeInStorage(): Promise<boolean> {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const data = await new Promise<TomePreviewData | undefined>((resolve, reject) => {
      const request = store.get('current');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return !!data;
  } catch (error) {
    return false;
  }
}
