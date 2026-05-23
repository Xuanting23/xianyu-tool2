/**
 * "抄作业"模式 — 纯本地结构提取
 * 输入竞品文案 → 分析结构骨架 → 生成空模板
 */

const PLACEHOLDER_MAP = {
  title: '【在此填写标题/商品名称】',
  price_hint: '【价格/折扣信息】',
  brand: '【品牌/型号】',
  condition: '【新旧程度/使用情况】',
  desc: '【商品描述，说明特点和卖点】',
  spec: '【规格参数】',
  reason: '【出售原因】',
  shipping: '【邮寄/自提说明】',
  note: '【注意事项/交易说明】',
  contact: '【联系方式/交易方式】',
}

type LineType = 'title' | 'param' | 'short' | 'normal' | 'empty'

function classifyLine(line: string): LineType {
  if (line.trim() === '') return 'empty'
  const trimmed = line.trim()
  // 以 emoji 开头 + 短句 → 标题类
  const emojiReg = /^[\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}]/u
  if (emojiReg.test(trimmed) && trimmed.length <= 20) return 'title'
  // 含冒号/竖线/➡ 等分隔符 → 参数列表
  if (/[：:｜|]/.test(trimmed)) return 'param'
  // 纯短行（≤10字符）→ 标题
  if (trimmed.length <= 10) return 'title'
  return 'normal'
}

function buildTemplate(line: string, type: LineType, index: number): string {
  switch (type) {
    case 'empty':
      return ''
    case 'title': {
      // 保留开头 emoji，替换文字部分
      const emojiMatch = line.match(/^([\u{1F300}-\u{1FFFF}\u{2600}-\u{27BF}\s]*)/u)
      const prefix = emojiMatch ? emojiMatch[1] : ''
      return prefix + PLACEHOLDER_MAP.title
    }
    case 'param': {
      // 保留分隔符结构，替换值
      const colonIdx = line.search(/[：:]/)
      if (colonIdx > 0) {
        const key = line.slice(0, colonIdx + 1)
        return key + '【填写对应内容】'
      }
      return '【参数项】：【填写内容】'
    }
    case 'normal': {
      // 按段落顺序给出语义提示
      const hints = [
        PLACEHOLDER_MAP.desc,
        PLACEHOLDER_MAP.condition,
        PLACEHOLDER_MAP.reason,
        PLACEHOLDER_MAP.shipping,
        PLACEHOLDER_MAP.note,
      ]
      return hints[index % hints.length]
    }
    default:
      return '【内容】'
  }
}

export function extractStructure(raw: string): string {
  const lines = raw.split('\n')
  let normalCount = 0
  const result: string[] = []

  for (const line of lines) {
    const type = classifyLine(line)
    if (type === 'empty') {
      result.push('')
      continue
    }
    const templateLine = buildTemplate(line, type, type === 'normal' ? normalCount++ : 0)
    result.push(templateLine)
  }

  return result.join('\n')
}
