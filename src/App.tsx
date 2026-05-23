import './index.css'
import { Header } from './components/Layout/Header'
import { EditorPane } from './components/Editor/EditorPane'
import { PreviewPane } from './components/Preview/PreviewPane'
import { CompareView } from './components/Compare/CompareView'
import { DraftManager } from './components/Drafts/DraftManager'
import { useEditorStore } from './store/editorStore'
import { useSyncScroll } from './hooks/useSyncScroll'

function EditorLayout() {
  const syncScroll = useEditorStore((s) => s.syncScroll)
  const setSyncScroll = useEditorStore((s) => s.setSyncScroll)
  const { registerRef, handleScroll } = useSyncScroll(syncScroll)

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
