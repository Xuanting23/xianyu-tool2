import { create } from 'zustand'
import type { Draft, HistoryEntry } from '../db/database'
import { listDrafts, saveDraft, deleteDraft, getHistory, saveHistoryEntry, getDraft } from '../db/database'

interface DraftState {
  drafts: Draft[]
  currentHistory: HistoryEntry[]
  historyDraftId: string | null
  loadDrafts: () => Promise<void>
  createDraft: (name: string, content: string) => Promise<Draft>
  updateDraft: (id: string, name: string, content: string) => Promise<void>
  removeDraft: (id: string) => Promise<void>
  loadHistory: (draftId: string) => Promise<void>
  addHistoryEntry: (draftId: string, content: string, label?: string) => Promise<void>
  getDraftById: (id: string) => Promise<Draft | undefined>
}

export const useDraftStore = create<DraftState>((set) => ({
  drafts: [],
  currentHistory: [],
  historyDraftId: null,

  loadDrafts: async () => {
    const drafts = await listDrafts()
    set({ drafts })
  },

  createDraft: async (name, content) => {
    const draft = await saveDraft({ name, content })
    const drafts = await listDrafts()
    set({ drafts })
    return draft
  },

  updateDraft: async (id, name, content) => {
    const existing = await getDraft(id)
    if (!existing) return
    await saveDraft({ id, name, content, createdAt: existing.createdAt })
    const drafts = await listDrafts()
    set({ drafts })
  },

  removeDraft: async (id) => {
    await deleteDraft(id)
    const drafts = await listDrafts()
    set({ drafts })
  },

  loadHistory: async (draftId) => {
    const history = await getHistory(draftId)
    set({ currentHistory: history, historyDraftId: draftId })
  },

  addHistoryEntry: async (draftId, content, label) => {
    await saveHistoryEntry(draftId, content, label)
    const history = await getHistory(draftId)
    set({ currentHistory: history })
  },

  getDraftById: async (id) => getDraft(id),
}))
