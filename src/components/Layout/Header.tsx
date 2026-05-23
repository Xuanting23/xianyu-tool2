import { useState, useRef, useEffect } from 'react'
import { useEditorStore, type AppMode } from '../../store/editorStore'
import { CopyHomeworkModal } from '../CopyHomework/CopyHomeworkModal'

export function Header() {
  const mode = useEditorStore((s) => s.mode)
  const setMode = useEditorStore((s) => s.setMode)
  const [showCopyHomework, setShowCopyHomework] = useState(false)
  const [showMoreTools, setShowMoreTools] = useState(false)
  const moreToolsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showMoreTools) return
    function handleClick(e: MouseEvent) {
      if (moreToolsRef.current && !moreToolsRef.current.contains(e.target as Node)) {
        setShowMoreTools(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showMoreTools])

  const tabs: { id: AppMode; label: string; icon: string }[] = [
    { id: 'editor', label: '编辑', icon: '✏️' },
    { id: 'compare', label: '对比', icon: '⚖️' },
    { id: 'drafts', label: '草稿', icon: '📁' },
  ]

  return (
    <>
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e8e8e8',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        height: 52,
        flexShrink: 0,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 24 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, #FF4520 0%, #ff6b4a 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16, flexShrink: 0,
          }}>
            🐟
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: '#333', whiteSpace: 'nowrap' }}>
            鱼排版
          </span>
        </div>

        {/* mode tabs */}
        <nav style={{ display: 'flex', gap: 2 }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background: mode === tab.id ? '#FF4520' : 'transparent',
                color: mode === tab.id ? '#fff' : '#666',
                fontSize: 13,
                fontWeight: mode === tab.id ? 600 : 400,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <button
            onClick={() => setShowCopyHomework(true)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid #eee',
              background: '#f8f8f8',
              color: '#555',
              fontSize: 13,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <span>📋</span>
            <span className="hide-mobile">抄作业</span>
          </button>

          {/* 更多工具 */}
          <div ref={moreToolsRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setShowMoreTools((v) => !v)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid #eee',
                background: showMoreTools ? '#f0f0f0' : '#f8f8f8',
                color: '#555',
                fontSize: 13,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <span>🧰</span>
              <span className="hide-mobile">更多工具</span>
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ marginLeft: 1 }}>
                <path d="M2 3.5L5 6.5L8 3.5" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {showMoreTools && (
              <div style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                width: 280,
                background: '#fff',
                borderRadius: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)',
                zIndex: 200,
                overflow: 'hidden',
              }}>
                {/* 标题 */}
                <div style={{ padding: '12px 16px 8px', borderBottom: '1px solid #f5f5f5' }}>
                  <span style={{ fontSize: 12, color: '#aaa', fontWeight: 500 }}>推荐工具</span>
                </div>

                {/* 极道引擎 */}
                <a
                  href="https://api.jdyq.work"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setShowMoreTools(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 16px',
                    textDecoration: 'none',
                    borderBottom: '1px solid #f5f5f5',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>⚡</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#222' }}>极道引擎</span>
                      <span style={{ fontSize: 10, color: '#fff', background: '#FF4520', borderRadius: 4, padding: '1px 5px', fontWeight: 600 }}>推荐</span>
                    </div>
                    <span style={{ fontSize: 12, color: '#888', lineHeight: 1.4 }}>已聚合国内外 600+ AI 大模型，国内直连</span>
                  </div>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>

                {/* 占位第二条 */}
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 16px',
                  borderBottom: '1px solid #f5f5f5',
                  opacity: 0.45,
                }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                    background: '#f0f0f0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18,
                  }}>🔧</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#aaa' }}>更多工具</div>
                    <div style={{ fontSize: 12, color: '#bbb' }}>即将上线，敬请期待</div>
                  </div>
                </div>

                {/* 客服联系 */}
                <div style={{ padding: '12px 16px', background: '#fafafa' }}>
                  <div style={{ fontSize: 11, color: '#aaa', marginBottom: 8, fontWeight: 500 }}>联系我们</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: '#07C160',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" fill="#fff"/>
                      </svg>
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: '#333', fontWeight: 500 }}>微信客服</div>
                      <div style={{ fontSize: 12, color: '#07C160', fontWeight: 600, letterSpacing: 0.5 }}>WYGQ0201</div>
                    </div>
                    <div style={{ marginLeft: 'auto', fontSize: 11, color: '#bbb' }}>反馈 · 合作</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {showCopyHomework && <CopyHomeworkModal onClose={() => setShowCopyHomework(false)} />}
    </>
  )
}
