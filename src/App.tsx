import './index.css'
import { useState, useEffect } from 'react'
import { Header } from './components/Layout/Header'
import { EditorPane } from './components/Editor/EditorPane'
import { PreviewPane } from './components/Preview/PreviewPane'
import { CompareView } from './components/Compare/CompareView'
import { DraftManager } from './components/Drafts/DraftManager'
import { useEditorStore } from './store/editorStore'
import { useSyncScroll } from './hooks/useSyncScroll'

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile
}

function EditorLayout() {
  const syncScroll = useEditorStore((s) => s.syncScroll)
  const setSyncScroll = useEditorStore((s) => s.setSyncScroll)
  const { registerRef, handleScroll } = useSyncScroll(syncScroll)
  const isMobile = useIsMobile()
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit')

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
        {/* 手机端 tab 切换条 */}
        <div style={{
          display: 'flex',
          background: '#fff',
          borderBottom: '1px solid #eee',
          flexShrink: 0,
        }}>
          {(['edit', 'preview'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setMobileTab(tab)}
              style={{
                flex: 1,
                padding: '10px 0',
                border: 'none',
                background: 'none',
                fontSize: 14,
                fontWeight: mobileTab === tab ? 600 : 400,
                color: mobileTab === tab ? '#FF4520' : '#888',
                borderBottom: mobileTab === tab ? '2px solid #FF4520' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab === 'edit' ? '✏️ 编辑' : '👁 预览'}
            </button>
          ))}
        </div>

        {/* 内容区 */}
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {mobileTab === 'edit' ? (
            <EditorPane />
          ) : (
            <PreviewPane
              scrollRef={registerRef(0)}
              onScroll={handleScroll(0)}
            />
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, height: '100%' }}>
      {/* sync scroll toggle */}
      <div style={{ padding: '4px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', cursor: 'pointer', userSelect: 'none' }}>
          <input type="checkbox" checked={syncScroll} onChange={(e) => setSyncScroll(e.target.checked)} />
          预览同步滚动
        </label>
      </div>

      {/* dual pane */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        <div style={{ borderRight: '1px solid #eee', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <EditorPane />
        </div>
        <div style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <PreviewPane
            scrollRef={registerRef(0)}
            onScroll={handleScroll(0)}
          />
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const mode = useEditorStore((s) => s.mode)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Header />
      <main style={{ flex: 1, overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {mode === 'editor' && <EditorLayout />}
        {mode === 'compare' && <CompareView />}
        {mode === 'drafts' && <DraftManager />}
      </main>
    </div>
  )
}

