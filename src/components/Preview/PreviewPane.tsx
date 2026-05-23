import { DEVICES, useEditorStore } from '../../store/editorStore'
import { PhoneFrame } from './PhoneFrame'
import { DeviceSwitcher } from './DeviceSwitcher'

interface Props {
  scrollRef?: (el: HTMLDivElement | null) => void
  onScroll?: () => void
}

export function PreviewPane({ scrollRef, onScroll }: Props) {
  const content = useEditorStore((s) => s.content)
  const deviceId = useEditorStore((s) => s.device)
  const device = DEVICES.find((d) => d.id === deviceId) ?? DEVICES[1]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minWidth: 0 }}>
      {/* toolbar */}
      <div style={{
        padding: '8px 12px',
        background: '#fff',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>预览</span>
        <DeviceSwitcher />
      </div>

      {/* phone frame area */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '24px 16px',
        background: '#e8e8e8',
      }}>
        <PhoneFrame device={device} content={content} scrollRef={scrollRef} onScroll={onScroll} />
      </div>
    </div>
  )
}
