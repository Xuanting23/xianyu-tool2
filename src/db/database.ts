import { openDB, type IDBPDatabase } from 'idb'

export interface Draft {
  id: string
  name: string
  content: string
  createdAt: number
  updatedAt: number
}

export interface HistoryEntry {
  id: string
  draftId: string
  content: string
  savedAt: number
  label?: string
}

const DB_NAME = 'xianyu-tool'
const DB_VERSION = 1

let db: IDBPDatabase | null = null

async function getDB() {
  if (db) return db
  db = await openDB(DB_NAME, DB_VERSION, {
    upgrade(database) {
      if (!database.objectStoreNames.contains('drafts')) {
        const drafts = database.createObjectStore('drafts', { keyPath: 'id' })
        drafts.createIndex('updatedAt', 'updatedAt')
      }
      if (!database.objectStoreNames.contains('history')) {
        const history = database.createObjectStore('history', { keyPath: 'id' })
        history.createIndex('draftId', 'draftId')
        history.createIndex('savedAt', 'savedAt')
      }
    },
  })
  return db
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

// Drafts CRUD
export async function listDrafts(): Promise<Draft[]> {
  const database = await getDB()
  const drafts = await database.getAllFromIndex('drafts', 'updatedAt')
  return drafts.reverse()
}

export async function getDraft(id: string): Promise<Draft | undefined> {
  const database = await getDB()
  return database.get('drafts', id)
}

export async function saveDraft(draft: { id?: string; name: string; content: string; createdAt?: number; updatedAt?: number }): Promise<Draft> {
  const database = await getDB()
  const now = Date.now()
  const full: Draft = {
    id: draft.id ?? genId(),
    name: draft.name,
    content: draft.content,
    createdAt: draft.createdAt ?? now,
    updatedAt: now,
  }
  await database.put('drafts', full)
  return full
}

export async function deleteDraft(id: string): Promise<void> {
  const database = await getDB()
  await database.delete('drafts', id)
  // also delete associated history
  const tx = database.transaction('history', 'readwrite')
  const idx = tx.store.index('draftId')
  let cursor = await idx.openCursor(IDBKeyRange.only(id))
  while (cursor) {
    await cursor.delete()
    cursor = await cursor.continue()
  }
  await tx.done
}

// History
export async function saveHistoryEntry(draftId: string, content: string, label?: string): Promise<void> {
  const database = await getDB()
  const entry: HistoryEntry = {
    id: genId(),
    draftId,
    content,
    savedAt: Date.now(),
    label,
  }
  await database.put('history', entry)
  // keep max 50 entries per draft
  const tx = database.transaction('history', 'readwrite')
  const idx = tx.store.index('draftId')
  const all = await idx.getAll(IDBKeyRange.only(draftId))
  all.sort((a, b) => b.savedAt - a.savedAt)
  for (const old of all.slice(50)) {
    await tx.store.delete(old.id)
  }
  await tx.done
}

export async function getHistory(draftId: string): Promise<HistoryEntry[]> {
  const database = await getDB()
  const idx = database.transaction('history').store.index('draftId')
  const entries = await idx.getAll(IDBKeyRange.only(draftId))
  return entries.sort((a, b) => b.savedAt - a.savedAt)
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  const database = await getDB()
  await database.delete('history', id)
}
