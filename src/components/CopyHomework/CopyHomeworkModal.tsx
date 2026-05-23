import { useState } from 'react'
import { extractStructure } from '../../utils/extractStructure'
import { useEditorStore } from '../../store/editorStore'

interface Props {
  onClose: () => void
}

export function CopyHomeworkModal({ onClose }: Props) {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const setContent = useEditorStore((s) => s.setContent)

  const handleExtract = () => {
    if (!input.trim()) return
    setOutput(extractStructure(input))
  }

  const handleUseTemplate = () => {
    if (!output) return
    setContent(output)
    useEditorStore.getState().setMode('editor')
    onClose()
  }

  const handleCopyOutput = async () => {
    if (!output) return
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, width: '100%', maxWidth: 720,
        maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#333' }}>📋 抄作业模式</div>
            <div style={{ fontSize: 12, color: '#999', marginTop: 2 }}>粘贴竞品文案 → 自动提取结构骨架 → 生成空模板</div>
          </div>
          <button onClick={onClose} style={{ marginLeft: 'auto', border: 'none', background: 'none', cursor: 'pointer', fontSize: 20, color: '#999' }}>✕</button>
        </div>

        {/* content */}
        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, overflow: 'hidden', minHeight: 300 }}>
          {/* input */}
          <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #eee' }}>
            <div style={{ padding: '8px 16px', background: '#f8f8f8', borderBottom: '1px solid #eee', fontSize: 12, fontWeight: 600, color: '#666' }}>
              竞品文案（粘贴到这里）
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="粘贴你想参考的竞品文案..."
              className="editor-textarea custom-scrollbar"
              style={{ flex: 1, borderRadius: 0 }}
            />
          </div>

          {/* output */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '8px 16px', background: '#f8f8f8', borderBottom: '1px solid #eee', fontSize: 12, fontWeight: 600, color: '#666' }}>
              提取的结构模板
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="点击【提取结构】按钮生成模板..."
              className="editor-textarea custom-scrollbar"
              style={{ flex: 1, borderRadius: 0, background: '#fafff8', color: output ? '#333' : '#bbb' }}
            />
          </div>
        </div>

        {/* footer */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid #eee', display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #eee', background: '#fff', color: '#666', fontSize: 14, cursor: 'pointer' }}>取消</button>
          <button
            onClick={handleExtract}
            disabled={!input.trim()}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: input.trim() ? '#333' : '#ccc', color: '#fff', fontSize: 14, cursor: input.trim() ? 'pointer' : 'not-allowed' }}
          >
            ✨ 提取结构
          </button>
          <button
            onClick={handleCopyOutput}
            disabled={!output}
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid #FF4520', background: '#FFF0ED', color: '#FF4520', fontSize: 14, cursor: output ? 'pointer' : 'not-allowed' }}
          >
            {copied ? '✓ 已复制' : '复制模板'}
          </button>
          <button
            onClick={handleUseTemplate}
            disabled={!output}
            style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: output ? '#FF4520' : '#ccc', color: '#fff', fontSize: 14, cursor: output ? 'pointer' : 'not-allowed' }}
          >
            使用此模板 →
          </button>
        </div>
      </div>
    </div>
  )
}
