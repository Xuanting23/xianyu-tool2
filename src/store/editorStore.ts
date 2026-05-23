import { create } from 'zustand'

export type DeviceType = 'iphone-se' | 'iphone-15' | 'iphone-pro-max' | 'android'
export type OSType = 'ios' | 'android'
export type AppMode = 'editor' | 'compare' | 'drafts'

export interface DeviceConfig {
  id: DeviceType
  label: string
  os: OSType
  contentWidth: number
  screenHeight: number
}

export const DEVICES: DeviceConfig[] = [
  { id: 'iphone-se', label: 'iPhone SE', os: 'ios', contentWidth: 375, screenHeight: 667 },
  { id: 'iphone-15', label: 'iPhone 15', os: 'ios', contentWidth: 390, screenHeight: 844 },
  { id: 'iphone-pro-max', label: 'Pro Max', os: 'ios', contentWidth: 430, screenHeight: 932 },
  { id: 'android', label: 'Android', os: 'android', contentWidth: 360, screenHeight: 800 },
]

interface EditorState {
  content: string
  device: DeviceType
  mode: AppMode
  syncScroll: boolean
  setContent: (c: string) => void
  setDevice: (d: DeviceType) => void
  setMode: (m: AppMode) => void
  setSyncScroll: (v: boolean) => void
  currentDraftId: string | null
  currentDraftName: string
  setCurrentDraft: (id: string | null, name: string) => void
}

export const useEditorStore = create<EditorState>((set) => ({
  content: `✨ 商品名称/标题

📦 商品详情
这里写商品的详细描述，介绍商品的特点、卖点和使用感受。

🔍 商品参数
品牌：xxx
型号：xxx
成色：9成新

💡 出售原因
写出售原因，增加买家信任感。

🚀 邮寄说明
支持快递，运费到付 / 包邮

⚠️ 注意事项
拍前请仔细看图，一旦拍下视为认可商品现状。`,
  device: 'iphone-15',
  mode: 'editor',
  syncScroll: true,
  currentDraftId: null,
  currentDraftName: '未命名草稿',
  setContent: (c) => set({ content: c }),
  setDevice: (d) => set({ device: d }),
  setMode: (m) => set({ mode: m }),
  setSyncScroll: (v) => set({ syncScroll: v }),
  setCurrentDraft: (id, name) => set({ currentDraftId: id, currentDraftName: name }),
}))
