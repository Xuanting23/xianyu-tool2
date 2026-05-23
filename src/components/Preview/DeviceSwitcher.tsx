import { DEVICES, useEditorStore } from '../../store/editorStore'

export function DeviceSwitcher() {
  const device = useEditorStore((s) => s.device)
  const setDevice = useEditorStore((s) => s.setDevice)

  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {DEVICES.map((d) => (
        <button
          key={d.id}
          onClick={() => setDevice(d.id)}
          style={{
            padding: '4px 10px',
            borderRadius: 6,
            border: '1px solid',
            borderColor: device === d.id ? '#FF4520' : '#ddd',
            background: device === d.id ? '#FF4520' : '#fff',
            color: device === d.id ? '#fff' : '#666',
            fontSize: 12,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {d.os === 'ios' ? '📱' : '🤖'} {d.label}
        </button>
      ))}
    </div>
  )
}
