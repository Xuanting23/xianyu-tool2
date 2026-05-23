import { useState } from 'react'
import { XIANYU_EMOJIS, EMOJI_CATEGORIES } from '../../utils/xianyuEmojis'

interface Props {
  onInsert: (emoji: string) => void
  onClose: () => void
}

export function EmojiPanel({ onInsert, onClose }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>(EMOJI_CATEGORIES[0])

  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #eee',
      maxHeight: 260,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', borderBottom: '1px solid #f0f0f0' }}>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1, color: '#333' }}>emoji 面板</span>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 16, color: '#999', padding: '0 4px' }}>✕</button>
      </div>

      {/* category tabs */}
      <div style={{ display: 'flex', overflowX: 'auto', padding: '6px 8px', gap: 4, flexShrink: 0, scrollbarWidth: 'none' }}>
        {EMOJI_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '3px 10px',
              borderRadius: 12,
              border: '1px solid',
              borderColor: activeCategory === cat ? '#FF4520' : '#eee',
              background: activeCategory === cat ? '#FFF0ED' : '#f8f8f8',
              color: activeCategory === cat ? '#FF4520' : '#666',
              fontSize: 11,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* emoji grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 8px 12px', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {XIANYU_EMOJIS[activeCategory as keyof typeof XIANYU_EMOJIS]?.map((item) => (
          <button
            key={item.code}
            onClick={() => onInsert(item.code)}
            title={item.code}
            style={{
              width: 48,
              height: 48,
              border: '1px solid #f0f0f0',
              borderRadius: 8,
              background: '#fafafa',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              padding: 0,
            }}
          >
            <span>{item.preview}</span>
            <span style={{ fontSize: 8, color: '#bbb', lineHeight: 1 }}>{item.code}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
