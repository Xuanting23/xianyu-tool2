import { decodeXianyuEmojis } from '../../utils/xianyuEmojis'

interface Props {
  text: string
}

export function XianyuContent({ text }: Props) {
  const lines = decodeXianyuEmojis(text).split('\n')

  return (
    <div className="xianyu-content">
      {lines.map((line, i) =>
        line === '' ? (
          <div key={i} style={{ height: '0.8em' }} />
        ) : (
          <p key={i} style={{ marginBottom: 0 }}>{line}</p>
        )
      )}
    </div>
  )
}
