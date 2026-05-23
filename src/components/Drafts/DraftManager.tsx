import { useState, useEffect, useRef } from 'react'
import { useDraftStore } from '../../store/draftStore'
import { useEditorStore } from '../../store/editorStore'
import type { Draft, HistoryEntry } from '../../db/database'
import { deleteHistoryEntry } from '../../db/database'

function formatDate(ts: number) {
  const d = new Date(ts)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function HistoryPanel({ draftId, onRestore }: { draftId: string; onRestore: (content: string) => void }) {
  const { currentHistory, loadHistory } = useDraftStore()

  useEffect(() => {
    loadHistory(draftId)
  }, [draftId, loadHistory])

  if (currentHistory.length === 0) {
    return <div style={{ padding: 16, color: '#999', fontSize: 13 }}>暂无历史版本</div>
  }

  return (
    <div style={{ padding: '8px 0' }}>
      {currentHistory.map((h: HistoryEntry) => (
        <div key={h.id} style={{ padding: '8px 16px', borderBottom: '1px solid #f5f5f5', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#666' }}>{h.label || '自动保存'}</div>
            <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>{formatDate(h.savedAt)} · {h.content.length} 字</div>
          </div>
          <button
            onClick={() => onRestore(h.content)}
            style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid #FF4520', background: '#FFF0ED', color: '#FF4520', fontSize: 12, cursor: 'pointer' }}
          >
            恢复
          </button>
          <button
            onClick={async () => { await deleteHistoryEntry(h.id); loadHistory(draftId) }}
            style={{ padding: '3px 8px', borderRadius: 6, border: '1px solid #eee', background: '#f8f8f8', color: '#999', fontSize: 12, cursor: 'pointer' }}
          >
            删
          </button>
        </div>
      ))}
    </div>
  )
}

export function DraftManager() {
  const { drafts, loadDrafts, createDraft, removeDraft, addHistoryEntry } = useDraftStore()
  const { content, setContent, setCurrentDraft, currentDraftId } = useEditorStore()
  const [renamingId, setRenamingId] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')
  const [historyDraftId, setHistoryDraftId] = useState<string | null>(null)
  const [newDraftName, setNewDraftName] = useState('')
  const [showNewDraft, setShowNewDraft] = useState(false)
  const renameRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadDrafts()
  }, [loadDrafts])

  const handleNewDraft = async () => {
    const name = newDraftName.trim() || '新草稿'
    const draft = await createDraft(name, '')
    setCurrentDraft(draft.id, draft.name)
    setContent('')
    setShowNewDraft(false)
    setNewDraftName('')
  }

  const handleLoadDraft = (draft: Draft) => {
    setCurrentDraft(draft.id, draft.name)
    setContent(draft.content)
    useEditorStore.getState().setMode('editor')
  }

  const handleDeleteDraft = async (id: string) => {
    if (window.confirm('确定删除此草稿？')) {
      await removeDraft(id)
      if (currentDraftId === id) {
        setCurrentDraft(null, '未命名草稿')
      }
    }
  }

  const handleSaveVersion = async () => {
    if (!currentDraftId) return
    const label = prompt('版本备注（可选）') ?? undefined
    await addHistoryEntry(currentDraftId, content, label)
    alert('已保存历史版本')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* header */}
      <div style={{ padding: '12px 16px', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#333', flex: 1 }}>草稿管理</span>
        {currentDraftId && (
          <button onClick={handleSaveVersion}
            style={{ padding: '5px 12px', borderRadius: 8, border: '1px solid #FF4520', background: '#FFF0ED', color: '#FF4520', fontSize: 12, cursor: 'pointer' }}>
            保存版本
          </button>
        )}
        <button onClick={() => setShowNewDraft(true)}
          style={{ padding: '5px 12px', borderRadius: 8, border: 'none', background: '#FF4520', color: '#fff', fontSize: 13, cursor: 'pointer' }}>
          + 新草稿
        </button>
      </div>

      {/* new draft input */}
      {showNewDraft && (
        <div style={{ padding: '10px 16px', background: '#FFF0ED', borderBottom: '1px solid #ffd5cc', display: 'flex', gap: 8 }}>
          <input
            autoFocus
            value={newDraftName}
            onChange={(e) => setNewDraftName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewDraft()}
            placeholder="草稿名称"
            style={{ flex: 1, padding: '6px 10px', borderRadius: 6, border: '1px solid #ffd5cc', fontSize: 13 }}
          />
          <button onClick={handleNewDraft} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: '#FF4520', color: '#fff', fontSize: 13, cursor: 'pointer' }}>创建</button>
          <button onClick={() => setShowNewDraft(false)} style={{ padding: '6px 12px', borderRadius: 6, border: '1px solid #eee', background: '#fff', color: '#999', fontSize: 13, cursor: 'pointer' }}>取消</button>
        </div>
      )}

      {/* draft list */}
      <div style={{ flex: 1, overflowY: 'auto' }} className="custom-scrollbar">
        {drafts.length === 0 && (
          <div style={{ padding: 32, textAlign: 'center', color: '#999', fontSize: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📝</div>
            还没有草稿，点击"新草稿"开始
          </div>
        )}
        {drafts.map((draft) => (
          <div key={draft.id}>
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid #f5f5f5',
              background: currentDraftId === draft.id ? '#FFF7F5' : '#fff',
              cursor: 'pointer',
            }}>
              {renamingId === draft.id ? (
                <input
                  ref={renameRef}
                  autoFocus
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={async (e) => {
                    if (e.key === 'Enter') {
                      const { updateDraft } = useDraftStore.getState()
                      await updateDraft(draft.id, renameValue, draft.content)
                      if (currentDraftId === draft.id) setCurrentDraft(draft.id, renameValue)
                      setRenamingId(null)
                      loadDrafts()
                    }
                    if (e.key === 'Escape') setRenamingId(null)
                  }}
                  style={{ width: '100%', border: '1px solid #FF4520', borderRadius: 4, padding: '3px 6px', fontSize: 13 }}
                />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1 }} onClick={() => handleLoadDraft(draft)}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{draft.name}</div>
                    <div style={{ fontSize: 11, color: '#bbb', marginTop: 2 }}>
                      {formatDate(draft.updatedAt)} · {draft.content.length} 字
                      {currentDraftId === draft.id && <span style={{ marginLeft: 6, color: '#FF4520' }}>● 当前</span>}
                    </div>
                  </div>
                  <button onClick={() => { setRenamingId(draft.id); setRenameValue(draft.name) }}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999', fontSize: 13 }}>✏️</button>
                  <button onClick={() => setHistoryDraftId(historyDraftId === draft.id ? null : draft.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999', fontSize: 13 }}>🕐</button>
                  <button onClick={() => handleDeleteDraft(draft.id)}
                    style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#ccc', fontSize: 13 }}>🗑️</button>
                </div>
              )}
            </div>
            {historyDraftId === draft.id && (
              <div style={{ background: '#fafafa', borderBottom: '1px solid #eee' }}>
                <HistoryPanel
                  draftId={draft.id}
                  onRestore={(c) => {
                    handleLoadDraft(draft)
                    setContent(c)
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
