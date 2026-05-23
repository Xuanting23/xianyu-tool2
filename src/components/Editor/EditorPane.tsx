import { useRef, useState, useMemo } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { copyToClipboard } from '../../utils/copyToClipboard'
import { EmojiPanel } from './EmojiPanel'
import { useDraftAutoSave } from '../../hooks/useDraftAutoSave'
import { detectBannedWords, type DetectionResult } from '../../utils/bannedWords'

interface Props {
  value?: string
  onChange?: (v: string) => void
  showDraftName?: boolean
  compact?: boolean
}

export function EditorPane({ value, onChange, showDraftName = true, compact = false }: Props) {
  useDraftAutoSave()

  const storeContent = useEditorStore((s) => s.content)
  const storeSetContent = useEditorStore((s) => s.setContent)
  const currentDraftName = useEditorStore((s) => s.currentDraftName)

  const content = value ?? storeContent
  const setContent = onChange ?? storeSetContent

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showEmoji, setShowEmoji] = useState(false)
  const [showBanned, setShowBanned] = useState(false)
  const [copied, setCopied] = useState(false)
  const [charCount, setCharCount] = useState(content.length)

  const bannedResults = useMemo<DetectionResult[]>(() => detectBannedWords(content), [content])
  const highCount = bannedResults.filter((r) => r.level === 'high').length
  const mediumCount = bannedResults.filter((r) => r.level === 'medium').length
  const copyrightCount = bannedResults.filter((r) => r.level === 'copyright').length
  const hasAny = bannedResults.length > 0

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
    setCharCount(e.target.value.length)
  }

  const insertEmoji = (emoji: string) => {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart ?? content.length
    const end = ta.selectionEnd ?? content.length
    const next = content.slice(0, start) + emoji + content.slice(end)
    setContent(next)
    requestAnimationFrame(() => {
      ta.selectionStart = ta.selectionEnd = start + emoji.length
      ta.focus()
    })
  }

  const handleCopy = async () => {
    const ok = await copyToClipboard(content)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleClear = () => {
    if (content && window.confirm('确定清空内容？')) {
      setContent('')
      setCharCount(0)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', minWidth: 0 }}>
      {/* toolbar */}
      <div style={{
        padding: compact ? '6px 10px' : '8px 12px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}>
        {showDraftName && (
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            ✏️ {currentDraftName}
          </span>
        )}
        {!showDraftName && <span style={{ flex: 1 }} />}
        <button
          onClick={() => setShowEmoji((v) => !v)}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid #eee',
            background: showEmoji ? '#FFF0ED' : '#f8f8f8',
            cursor: 'pointer',
            fontSize: 14,
            color: showEmoji ? '#FF4520' : '#666',
          }}
          title="emoji 面板"
        >
          😊
        </button>
        <button
          onClick={() => setShowBanned((v) => !v)}
          title="违禁词检测"
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: `1px solid ${highCount > 0 ? '#ffccc7' : mediumCount > 0 ? '#ffe7ba' : copyrightCount > 0 ? '#d9d9d9' : '#eee'}`,
            background: showBanned
              ? (highCount > 0 ? '#fff1f0' : mediumCount > 0 ? '#fff7e6' : copyrightCount > 0 ? '#f5f5f5' : '#f8f8f8')
              : (highCount > 0 ? '#fff1f0' : mediumCount > 0 ? '#fff7e6' : copyrightCount > 0 ? '#f5f5f5' : '#f8f8f8'),
            cursor: 'pointer',
            fontSize: 12,
            color: highCount > 0 ? '#cf1322' : mediumCount > 0 ? '#d46b08' : copyrightCount > 0 ? '#595959' : '#999',
            fontWeight: hasAny ? 600 : 400,
            display: 'flex', alignItems: 'center', gap: 3,
          }}
        >
          <span>🚫</span>
          {hasAny ? (
            <span>{bannedResults.length}</span>
          ) : (
            <span className="hide-mobile">检测</span>
          )}
        </button>
        <button
          onClick={handleClear}
          style={{ padding: '4px 10px', borderRadius: 6, border: '1px solid #eee', background: '#f8f8f8', cursor: 'pointer', fontSize: 12, color: '#999' }}
        >
          清空
        </button>
        <button
          onClick={handleCopy}
          style={{
            padding: '4px 14px',
            borderRadius: 6,
            border: 'none',
            background: copied ? '#22c55e' : '#FF4520',
            color: '#fff',
            cursor: 'pointer',
            fontSize: 13,
            fontWeight: 600,
            transition: 'background 0.2s',
          }}
        >
          {copied ? '✓ 已复制' : '复制'}
        </button>
      </div>

      {/* emoji panel */}
      {showEmoji && (
        <EmojiPanel onInsert={insertEmoji} onClose={() => setShowEmoji(false)} />
      )}

      {/* banned word panel */}
      {showBanned && (
        <div style={{
          background: '#fff',
          borderBottom: '1px solid #eee',
          maxHeight: 220,
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f0f0f0', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#333', flex: 1 }}>违禁词检测</span>
            {bannedResults.length === 0 ? (
              <span style={{ fontSize: 12, color: '#52c41a', fontWeight: 500 }}>✓ 未发现违禁词</span>
            ) : (
              <div style={{ display: 'flex', gap: 6 }}>
                {highCount > 0 && (
                  <span style={{ fontSize: 11, background: '#fff1f0', color: '#cf1322', border: '1px solid #ffccc7', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
                    高风险 {highCount}
                  </span>
                )}
                {mediumCount > 0 && (
                  <span style={{ fontSize: 11, background: '#fff7e6', color: '#d46b08', border: '1px solid #ffe7ba', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
                    中风险 {mediumCount}
                  </span>
                )}
                {copyrightCount > 0 && (
                  <span style={{ fontSize: 11, background: '#f5f5f5', color: '#595959', border: '1px solid #d9d9d9', borderRadius: 4, padding: '1px 6px', fontWeight: 600 }}>
                    版权 {copyrightCount}
                  </span>
                )}
              </div>
            )}
            <button onClick={() => setShowBanned(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999', padding: '0 4px' }}>✕</button>
          </div>
          <div style={{ overflowY: 'auto', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {bannedResults.length === 0 ? (
              <div style={{ padding: '12px', textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                文案中未检测到违禁词，可以放心发布 🎉
              </div>
            ) : (
              bannedResults.map((r, i) => {
                const isCopyright = r.level === 'copyright'
                const bgColor = r.level === 'high' ? '#fff1f0' : r.level === 'medium' ? '#fff7e6' : '#f5f5f5'
                const borderColor = r.level === 'high' ? '#ffccc7' : r.level === 'medium' ? '#ffe7ba' : '#d9d9d9'
                const textColor = r.level === 'high' ? '#cf1322' : r.level === 'medium' ? '#d46b08' : '#595959'
                const label = r.level === 'high' ? '高' : r.level === 'medium' ? '中' : '版权'
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '6px 8px',
                    borderRadius: 6,
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: textColor, flexShrink: 0, marginTop: 1 }}>
                      {label}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: textColor,
                        background: borderColor,
                        borderRadius: 3, padding: '0 3px',
                      }}>「{r.word}」</span>
                      {r.indices.length > 1 && (
                        <span style={{ fontSize: 11, color: '#aaa', marginLeft: 4 }}>出现 {r.indices.length} 次</span>
                      )}
                      {isCopyright && (
                        <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>涉及版权/盗版内容，建议删除</span>
                      )}
                      {r.suggestion && (
                        <span style={{ fontSize: 11, color: '#888', marginLeft: 6 }}>
                          建议替换：<span style={{ color: '#52c41a', fontWeight: 500 }}>{r.suggestion}</span>
                        </span>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {/* textarea */}
      <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          placeholder="在这里输入闲鱼商品文案..."
          className="editor-textarea custom-scrollbar"
          style={{ position: 'absolute', inset: 0, height: '100%' }}
        />
      </div>

      {/* status bar */}
      <div style={{
        padding: '4px 12px',
        background: '#fafafa',
        borderTop: '1px solid #f0f0f0',
        display: 'flex',
        justifyContent: 'flex-end',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 11, color: '#bbb' }}>{charCount} 字符</span>
      </div>
    </div>
  )
}
