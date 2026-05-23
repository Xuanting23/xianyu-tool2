// 闲鱼官方支持的 emoji，用方括号编码插入，面板显示对应 Unicode 预览
// 格式：{ code: '[名称]', preview: 'Unicode字符' }

export interface XianyuEmoji {
  code: string
  preview: string
}

export const XIANYU_EMOJIS: Record<string, XianyuEmoji[]> = {
  '数字箭头': [
    { code: '[1]', preview: '1️⃣' },
    { code: '[2]', preview: '2️⃣' },
    { code: '[3]', preview: '3️⃣' },
    { code: '[上]', preview: '⬆️' },
    { code: '[下]', preview: '⬇️' },
    { code: '[左]', preview: '⬅️' },
    { code: '[右]', preview: '➡️' },
    { code: '[灯泡]', preview: '💡' },
    { code: '[cool]', preview: '🆒' },
    { code: '[hot]', preview: '🔥' },
    { code: '[new]', preview: '🆕' },
    { code: '[VS]', preview: '🆚' },
    { code: '[钉子]', preview: '📌' },
    { code: '[火]', preview: '🔥' },
    { code: '[五角星]', preview: '⭐' },
    { code: '[闪亮]', preview: '✨' },
  ],
  '装饰符号': [
    { code: '[红旗]', preview: '🚩' },
    { code: '[黄圆]', preview: '🟡' },
    { code: '[红圆]', preview: '🔴' },
    { code: '[蓝圆]', preview: '🔵' },
    { code: '[绿圆]', preview: '🟢' },
  ],
  '表情': [
    { code: '[微笑]', preview: '😊' },
    { code: '[呲牙]', preview: '😁' },
    { code: '[偷笑]', preview: '🤭' },
    { code: '[流泪]', preview: '😢' },
    { code: '[大哭]', preview: '😭' },
    { code: '[破涕为笑]', preview: '😂' },
    { code: '[捂脸哭]', preview: '🤣' },
    { code: '[含羞]', preview: '😳' },
    { code: '[感动]', preview: '🥹' },
    { code: '[托腮]', preview: '🤔' },
    { code: '[愉快]', preview: '😄' },
    { code: '[惊讶]', preview: '😮' },
    { code: '[调皮]', preview: '😜' },
    { code: '[得意]', preview: '😏' },
    { code: '[疑问]', preview: '🤨' },
    { code: '[难过]', preview: '😔' },
    { code: '[白眼]', preview: '🙄' },
    { code: '[流汗]', preview: '😅' },
    { code: '[憨笑]', preview: '😆' },
    { code: '[号外]', preview: '📢' },
    { code: '[裂开]', preview: '🫠' },
  ],
  '手势动作': [
    { code: '[ok]', preview: '👌' },
    { code: '[送花]', preview: '💐' },
    { code: '[棒]', preview: '👍' },
    { code: '[比心]', preview: '🤞' },
    { code: '[感谢]', preview: '🙏' },
    { code: '[小刀]', preview: '🤏' },
    { code: '[不刀]', preview: '🖐️' },
  ],
  '商品标签': [
    { code: '[包邮]', preview: '📦' },
    { code: '[佛系]', preview: '🧘' },
    { code: '[超便宜]', preview: '💰' },
    { code: '[白菜]', preview: '🥬' },
    { code: '[拥抱]', preview: '🤗' },
    { code: '[摊手]', preview: '🤷' },
    { code: '[蹲]', preview: '🫳' },
    { code: '[跪了]', preview: '🫶' },
    { code: '[拜]', preview: '🙇' },
    { code: '[旺柴]', preview: '🐶' },
    { code: '[招财猫]', preview: '🐱' },
  ],
  '生活场景': [
    { code: '[房子]', preview: '🏠' },
    { code: '[汽车]', preview: '🚗' },
    { code: '[度假]', preview: '🏖️' },
    { code: '[相机]', preview: '📷' },
    { code: '[吉他]', preview: '🎸' },
    { code: '[手机]', preview: '📱' },
    { code: '[沙发]', preview: '🛋️' },
    { code: '[快递]', preview: '📬' },
    { code: '[搬砖]', preview: '🧱' },
    { code: '[树]', preview: '🌲' },
    { code: '[帐篷]', preview: '⛺' },
    { code: '[干杯]', preview: '🍺' },
    { code: '[菜狗]', preview: '🐕' },
    { code: '[牛]', preview: '🐮' },
    { code: '[夺笋]', preview: '🎋' },
    { code: '[小丑]', preview: '🤡' },
  ],
}

export type EmojiCategory = keyof typeof XIANYU_EMOJIS
export const EMOJI_CATEGORIES = Object.keys(XIANYU_EMOJIS) as EmojiCategory[]

// code → preview 映射，供预览渲染时替换
export const EMOJI_CODE_MAP: Record<string, string> = Object.values(XIANYU_EMOJIS)
  .flat()
  .reduce((acc, item) => { acc[item.code] = item.preview; return acc }, {} as Record<string, string>)

// 将文本中的 [名称] 替换为对应 emoji（用于预览显示）
export function decodeXianyuEmojis(text: string): string {
  return text.replace(/\[[^\]]+\]/g, (match) => EMOJI_CODE_MAP[match] ?? match)
}
