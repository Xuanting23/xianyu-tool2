import { useState, useRef } from 'react'
import { DEVICES } from '../../store/editorStore'
import { PhoneFrame } from '../Preview/PhoneFrame'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { EmojiPanel } from '../Editor/EmojiPanel'
import { useSyncScroll } from '../../hooks/useSyncScroll'

interface ColumnState {
  name: string
  content: string
  deviceId: string
}

const DEFAULT_COLUMNS: ColumnState[] = [
  { name: '版本 A', content: '', deviceId: 'iphone-15' },
  { name: '版本 B', content: '', deviceId: 'iphone-15' },
  { name: '版本 C', content: '', deviceId: 'iphone-15' },
]

const DEFAULT_CONTENT = `✨ 商品标题

📦 商品详情
这里写商品描述。

🔍 商品参数
品牌：xxx
成色：9成新

🚀 邮寄说明
支持快递`

function CompareColumn({
  col,
  index,
  onChange,
  scrollRef,
  onScroll,
}: {
  col: ColumnState
  index: number
  onChange: (idx: number, update: Partial<ColumnState>) => void
  scrollRef?: (el: HTMLDivElement | null) => void
  onScroll?: () => void
}) {
  const [showEmoji, setShowEmoji] = useState(false)
  const [copied, setCopied] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const device = DEVICES.find((d) => d.id === col.deviceId) ?? DEVICES[1]

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart ?? col.content.length
    const end = ta.selectionEnd ?? col.content.length
    const next = col.content.slice(0, start) + emoji + col.content.slice(end)
    onChange(index, { content: next })
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + emoji.length
      ta.focus()
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid #e8e8e8', borderRadius: 12, overflow: 'hidden', background: '#fff', height: '100%' }}>
      {/* column header */}
      <div style={{ padding: '8px 10px', background: '#f8f8f8', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
        <input
          value={col.name}
          onChange={(e) => onChange(index, { name: e.target.value })}
          style={{ flex: 1, border: 'none', background: 'transparent', fontSize: 13, fontWeight: 600, color: '#333', outline: 'none' }}
        />
        <button onClick={() => setShowEmoji((v) => !v)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 14 }}>😊</button>
        <button
          onClick={async () => { const ok = await copyToClipboard(col.content); if (ok) { setCopied(true); setTimeout(() => setCopied(false), 2000) } }}
          style={{ padding: '3px 10px', borderRadius: 6, border: 'none', background: copied ? '#22c55e' : '#FF4520', color: '#fff', fontSize: 12, cursor: 'pointer' }}
        >
          {copied ? '✓' : '复制'}
        </button>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #eee', flexShrink: 0 }}>
        {(['edit', 'preview'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '6px 0', border: 'none', background: tab === t ? '#fff' : '#f8f8f8',
              borderBottom: tab === t ? '2px solid #FF4520' : '2px solid transparent',
              color: tab === t ? '#FF4520' : '#999', fontSize: 12, cursor: 'pointer',
            }}
          >
            {t === 'edit' ? '编辑' : '预览'}
          </button>
        ))}
      </div>

      {/* device switcher in preview mode */}
      {tab === 'preview' && (
        <div style={{ padding: '6px 8px', display: 'flex', gap: 4, flexWrap: 'wrap', borderBottom: '1px solid #f0f0f0', flexShrink: 0 }}>
          {DEVICES.map((d) => (
            <button key={d.id} onClick={() => onChange(index, { deviceId: d.id })}
              style={{ padding: '2px 8px', borderRadius: 6, border: '1px solid', borderColor: col.deviceId === d.id ? '#FF4520' : '#ddd', background: col.deviceId === d.id ? '#FF4520' : '#fff', color: col.deviceId === d.id ? '#fff' : '#666', fontSize: 11, cursor: 'pointer' }}>
              {d.label}
            </button>
          ))}
        </div>
      )}

      {/* emoji panel */}
      {showEmoji && tab === 'edit' && (
        <EmojiPanel onInsert={insertEmoji} onClose={() => setShowEmoji(false)} />
      )}

      {/* content area */}
      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        {tab === 'edit' ? (
          <textarea
            ref={textareaRef}
            value={col.content}
            onChange={(e) => onChange(index, { content: e.target.value })}
            placeholder={DEFAULT_CONTENT}
            className="editor-textarea custom-scrollbar"
            style={{ height: '100%' }}
          />
        ) : (
          <div style={{ height: '100%', overflow: 'auto', background: '#e8e8e8', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 16 }}>
            <div style={{ transform: 'scale(0.75)', transformOrigin: 'top center' }}>
              <PhoneFrame device={device} content={col.content || DEFAULT_CONTENT} scrollRef={scrollRef} onScroll={onScroll} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export function CompareView() {
  const [columns, setColumns] = useState<ColumnState[]>(DEFAULT_COLUMNS)
  const [syncScroll, setSyncScroll] = useState(true)
  const [activeTab, setActiveTab] = useState(0) // for mobile
  const { registerRef, handleScroll } = useSyncScroll(syncScroll)

  const updateColumn = (idx: number, update: Partial<ColumnState>) => {
    setColumns((cols) => cols.map((c, i) => (i === idx ? { ...c, ...update } : c)))
  }

  const isMobile = window.innerWidth < 640

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 0 }}>
      {/* toolbar */}
      <div style={{ padding: '8px 16px', background: '#fff', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>三栏对比</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666', cursor: 'pointer' }}>
          <input type="checkbox" checked={syncScroll} onChange={(e) => setSyncScroll(e.target.checked)} />
          同步滚动
        </label>
        {/* mobile tab switcher */}
        {isMobile && (
          <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
            {columns.map((col, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                style={{ padding: '3px 10px', borderRadius: 6, border: '1px solid', borderColor: activeTab === i ? '#FF4520' : '#ddd', background: activeTab === i ? '#FF4520' : '#fff', color: activeTab === i ? '#fff' : '#666', fontSize: 12, cursor: 'pointer' }}>
                {col.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* columns grid */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: 12,
        padding: 12,
        overflow: 'auto',
        minHeight: 0,
      }}>
        {columns.map((col, i) => (
          <div key={i} style={{ display: isMobile && activeTab !== i ? 'none' : 'flex', flexDirection: 'column', minHeight: isMobile ? 'calc(100vh - 160px)' : 0 }}>
            <CompareColumn
              col={col}
              index={i}
              onChange={updateColumn}
              scrollRef={registerRef(i)}
              onScroll={handleScroll(i)}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
