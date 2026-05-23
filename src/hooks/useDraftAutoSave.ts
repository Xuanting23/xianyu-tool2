import { useEffect, useRef } from 'react'
import { useEditorStore } from '../store/editorStore'
import { useDraftStore } from '../store/draftStore'

export function useDraftAutoSave(debounceMs = 1500) {
  const content = useEditorStore((s) => s.content)
  const currentDraftId = useEditorStore((s) => s.currentDraftId)
  const currentDraftName = useEditorStore((s) => s.currentDraftName)
  const { updateDraft } = useDraftStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!currentDraftId) return
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      updateDraft(currentDraftId, currentDraftName, content)
    }, debounceMs)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [content, currentDraftId, currentDraftName, debounceMs, updateDraft])
}
