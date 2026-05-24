import { useRef, useState, useEffect } from 'react'
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
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const availW = el.clientWidth - 32
      const frameW = device.contentWidth + 18
      const ratio = availW / frameW
      setScale(ratio < 1 ? ratio : 1)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [device.contentWidth])

  // 缩放后手动补偿高度，避免容器出现多余空白
  const frameH = Math.min(device.screenHeight, 660) + 18
  const scaledH = Math.round(frameH * scale)

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
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '24px 16px',
          background: '#e8e8e8',
        }}
      >
        <div style={{
          transformOrigin: 'top center',
          transform: `scale(${scale})`,
          height: scaledH,
          flexShrink: 0,
        }}>
          <PhoneFrame device={device} content={content} scrollRef={scrollRef} onScroll={onScroll} />
        </div>
      </div>
    </div>
  )
}
