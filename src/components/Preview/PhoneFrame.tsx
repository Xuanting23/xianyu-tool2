import React from 'react'
import { type DeviceConfig } from '../../store/editorStore'
import { XianyuContent } from './XianyuContent'

interface Props {
  device: DeviceConfig
  content: string
  scrollRef?: (el: HTMLDivElement | null) => void
  onScroll?: () => void
}

// iPhone外壳：边框厚度12px两侧，顶底更厚，真实比例
function IPhoneShell({ device, children }: { device: DeviceConfig; children: React.ReactNode }) {
  const isModern = device.id !== 'iphone-se'
  const isSE = device.id === 'iphone-se'

  const sideBorder = isModern ? 9 : 10
  const topBorder = isModern ? 9 : 10
  const bottomBorder = isModern ? 9 : 10

  const frameW = device.contentWidth + sideBorder * 2
  // 屏幕高度限制，不超过660
  const screenH = Math.min(device.screenHeight, 660)
  const frameH = screenH + topBorder + bottomBorder

  const outerRadius = isModern ? 52 : 38
  const innerRadius = isModern ? 40 : 26

  // Dynamic Island 尺寸
  const islandW = isSE ? 58 : 120
  const islandH = isSE ? 18 : 34
  const islandRadius = isSE ? 9 : 20

  // 按键颜色
  const btnColor = '#3a3a3a'

  return (
    <div style={{
      width: frameW,
      height: frameH,
      borderRadius: outerRadius,
      background: 'linear-gradient(160deg, #2a2a2a 0%, #1a1a1a 40%, #111 100%)',
      padding: `${topBorder}px ${sideBorder}px ${bottomBorder}px`,
      // 真实iPhone的多层高光阴影
      boxShadow: [
        '0 0 0 1px #555',          // 外框线
        '0 0 0 2px #1a1a1a',       // 黑色间隙
        '0 0 0 3px #666',          // 金属侧面高光
        '0 20px 80px rgba(0,0,0,0.6)',
        'inset 0 1px 0 rgba(255,255,255,0.12)',  // 顶部高光
      ].join(', '),
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* 左侧：静音键 + 音量键（现代iPhone在左侧，SE也在左侧） */}
      {/* 静音开关 */}
      <div style={{
        position: 'absolute', left: -4, top: isModern ? 100 : 80,
        width: 4, height: 28, background: btnColor,
        borderRadius: '2px 0 0 2px',
        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* 音量+ */}
      <div style={{
        position: 'absolute', left: -4, top: isModern ? 150 : 126,
        width: 4, height: isModern ? 56 : 44, background: btnColor,
        borderRadius: '2px 0 0 2px',
        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* 音量- */}
      <div style={{
        position: 'absolute', left: -4, top: isModern ? 220 : 182,
        width: 4, height: isModern ? 56 : 44, background: btnColor,
        borderRadius: '2px 0 0 2px',
        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* 右侧：电源键 */}
      <div style={{
        position: 'absolute', right: -4, top: isModern ? 160 : 120,
        width: 4, height: isModern ? 72 : 56, background: btnColor,
        borderRadius: '0 2px 2px 0',
        boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.5)',
      }} />

      {/* 屏幕 */}
      <div style={{
        background: '#f5f5f5',
        borderRadius: innerRadius,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 状态栏 */}
        <div style={{
          height: isModern ? 50 : 26,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}>
          {/* Dynamic Island / 刘海 */}
          <div style={{
            width: islandW, height: islandH,
            background: '#1a1a1a',
            borderRadius: islandRadius,
          }} />
          {/* 时间（左）- 仅现代机型 */}
          {isModern && (
            <span style={{
              position: 'absolute', left: 16,
              fontSize: 12, fontWeight: 600, color: '#000',
            }}>9:41</span>
          )}
          {/* 信号图标（右）- 仅现代机型 */}
          {isModern && (
            <div style={{
              position: 'absolute', right: 14,
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              {/* 信号格 */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
                {[8, 11, 14, 17].map((h, i) => (
                  <div key={i} style={{ width: 3, height: h, background: '#000', borderRadius: 1 }} />
                ))}
              </div>
              {/* WiFi */}
              <svg width="14" height="11" viewBox="0 0 20 15" fill="none">
                <path d="M1 5C5 1 15 1 19 5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <path d="M4 8.5C6.5 6 13.5 6 16 8.5" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <path d="M7 12C8.5 10.5 11.5 10.5 13 12" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="10" cy="14" r="1.5" fill="#000"/>
              </svg>
              {/* 电池 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <div style={{
                  width: 22, height: 11, border: '1.5px solid #000', borderRadius: 3,
                  display: 'flex', alignItems: 'center', padding: '1.5px',
                }}>
                  <div style={{ width: '75%', height: '100%', background: '#000', borderRadius: 1.5 }} />
                </div>
                <div style={{ width: 2, height: 5, background: '#000', borderRadius: '0 1px 1px 0' }} />
              </div>
            </div>
          )}
        </div>
        {children}
      </div>
    </div>
  )
}

function AndroidShell({ device, children }: { device: DeviceConfig; children: React.ReactNode }) {
  const sideBorder = 9
  const topBorder = 9
  const bottomBorder = 14  // 安卓底部稍厚（导航栏区域）

  const screenH = Math.min(device.screenHeight, 660)
  const frameW = device.contentWidth + sideBorder * 2
  const frameH = screenH + topBorder + bottomBorder

  const outerRadius = 38
  const innerRadius = 26
  const btnColor = '#3a3a3a'

  return (
    <div style={{
      width: frameW,
      height: frameH,
      borderRadius: outerRadius,
      background: 'linear-gradient(160deg, #2c2c2c 0%, #1a1a1a 40%, #111 100%)',
      padding: `${topBorder}px ${sideBorder}px ${bottomBorder}px`,
      boxShadow: [
        '0 0 0 1px #555',
        '0 0 0 2px #1a1a1a',
        '0 0 0 3px #666',
        '0 20px 80px rgba(0,0,0,0.6)',
        'inset 0 1px 0 rgba(255,255,255,0.1)',
      ].join(', '),
      position: 'relative',
      flexShrink: 0,
    }}>
      {/* 右侧：音量键 */}
      <div style={{
        position: 'absolute', right: -4, top: 110,
        width: 4, height: 50, background: btnColor,
        borderRadius: '0 2px 2px 0',
        boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.5)',
      }} />
      <div style={{
        position: 'absolute', right: -4, top: 174,
        width: 4, height: 50, background: btnColor,
        borderRadius: '0 2px 2px 0',
        boxShadow: 'inset -1px 0 2px rgba(0,0,0,0.5)',
      }} />
      {/* 左侧：电源键 */}
      <div style={{
        position: 'absolute', left: -4, top: 140,
        width: 4, height: 62, background: btnColor,
        borderRadius: '2px 0 0 2px',
        boxShadow: 'inset 1px 0 2px rgba(0,0,0,0.5)',
      }} />

      {/* 屏幕 */}
      <div style={{
        background: '#f5f5f5',
        borderRadius: innerRadius,
        height: '100%',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 状态栏 + 打孔摄像头 */}
        <div style={{
          height: 36,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}>
          {/* 打孔摄像头：真实大小约4-5mm，比之前更合理 */}
          <div style={{
            width: 12, height: 12,
            borderRadius: '50%',
            background: '#1a1a1a',
            boxShadow: '0 0 0 1px #333, inset 0 0 3px rgba(0,0,0,0.8)',
          }} />
          {/* 时间 */}
          <span style={{
            position: 'absolute', left: 14,
            fontSize: 11, fontWeight: 600, color: '#000',
          }}>9:41</span>
          {/* 状态图标 */}
          <div style={{
            position: 'absolute', right: 12,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5 }}>
              {[7, 10, 13, 16].map((h, i) => (
                <div key={i} style={{ width: 3, height: h, background: '#000', borderRadius: 1 }} />
              ))}
            </div>
            <div style={{
              width: 20, height: 10, border: '1.5px solid #000', borderRadius: 2.5,
              display: 'flex', alignItems: 'center', padding: '1.5px',
            }}>
              <div style={{ width: '70%', height: '100%', background: '#000', borderRadius: 1 }} />
            </div>
          </div>
        </div>
        {children}
        {/* 底部手势导航条 */}
        <div style={{
          height: 20, background: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <div style={{ width: 100, height: 4, background: '#ccc', borderRadius: 2 }} />
        </div>
      </div>
    </div>
  )
}

// 闲鱼顶部导航栏
function XianyuNavBar() {
  return (
    <div style={{
      height: 44,
      background: '#fff',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      gap: 8,
      flexShrink: 0,
    }}>
      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="10" height="16" viewBox="0 0 10 16" fill="none">
          <path d="M8 2L2 8L8 14" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div style={{ flex: 1, height: 30, background: '#f5f5f5', borderRadius: 15, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 4 }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="7" stroke="#aaa" strokeWidth="2"/>
          <path d="M16.5 16.5L21 21" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <span style={{ fontSize: 11, color: '#aaa' }}>搜索你要的宝贝</span>
      </div>
      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <div style={{ width: 22, height: 22, borderRadius: 11, border: '1.5px solid #666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 9, color: '#666', fontWeight: 700, lineHeight: 1 }}>卖</span>
        </div>
      </div>
      <div style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  )
}

function XianyuSellerRow() {
  return (
    <div style={{ background: '#fff', padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
      <div style={{ width: 36, height: 36, borderRadius: 18, background: 'linear-gradient(135deg,#888,#bbb)', flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>卖家昵称</span>
          <div style={{ padding: '1px 5px', background: '#FFF0ED', borderRadius: 3, border: '1px solid #FF4520' }}>
            <span style={{ fontSize: 9, color: '#FF4520', fontWeight: 600 }}>闲小辅 L2</span>
          </div>
        </div>
        <span style={{ fontSize: 10, color: '#999' }}>55分钟前来过 | 深圳</span>
      </div>
    </div>
  )
}

function XianyuPriceRow() {
  return (
    <div style={{ background: '#fff', padding: '8px 12px 10px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#FF4520', lineHeight: 1 }}>¥</span>
        <span style={{ fontSize: 26, fontWeight: 700, color: '#FF4520', lineHeight: 1 }}>99</span>
        <div style={{ marginLeft: 6, padding: '2px 5px', background: '#f5f5f5', borderRadius: 3 }}>
          <span style={{ fontSize: 10, color: '#999' }}>包邮</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 10, color: '#999' }}>1818人想要</span>
        <span style={{ fontSize: 10, color: '#ddd' }}>|</span>
        <span style={{ fontSize: 10, color: '#999' }}>1.8万人浏览</span>
      </div>
    </div>
  )
}

function XianyuSkuRow() {
  return (
    <div style={{ background: '#fff', marginTop: 6, padding: '10px 12px', display: 'flex', alignItems: 'center', flexShrink: 0, borderBottom: '1px solid #f5f5f5' }}>
      <div style={{ width: 18, height: 18, marginRight: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="#999" strokeWidth="1.5"/>
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="#999" strokeWidth="1.5"/>
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="#999" strokeWidth="1.5"/>
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="#999" strokeWidth="1.5"/>
        </svg>
      </div>
      <span style={{ fontSize: 12, color: '#333', flex: 1 }}>5种数量 可选</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
        <path d="M9 6l6 6-6 6" stroke="#bbb" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

function XianyuBottomBar() {
  return (
    <div style={{
      background: '#fff',
      height: 52,
      display: 'flex',
      alignItems: 'center',
      borderTop: '1px solid #f0f0f0',
      padding: '0 12px',
      gap: 12,
      flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 30 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#999" strokeWidth="1.5" strokeLinejoin="round"/>
        </svg>
        <span style={{ fontSize: 8, color: '#999' }}>1</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, minWidth: 30 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#f0a500" strokeWidth="1.5" fill="#f0a500"/>
        </svg>
        <span style={{ fontSize: 8, color: '#f0a500' }}>617</span>
      </div>
      <div style={{ flex: 1, height: 34, background: '#FF4520', borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: '#fff', fontWeight: 600 }}>立即购买</span>
      </div>
      <div style={{ flex: 1, height: 34, background: '#FFD000', borderRadius: 17, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: '#333', fontWeight: 600 }}>💬 聊一聊</span>
      </div>
    </div>
  )
}

export function PhoneFrame({ device, content, scrollRef, onScroll }: Props) {
  const contentArea = (
    <>
      <XianyuNavBar />
      <div style={{ flex: 1, overflowY: 'auto', background: '#f5f5f5', minHeight: 0 }} ref={scrollRef} onScroll={onScroll} className="phone-scroll-area">
        <div style={{ background: '#fff' }}>
          <XianyuSellerRow />
          <div style={{ height: 1, background: '#f5f5f5' }} />
          <XianyuPriceRow />
          <XianyuSkuRow />
        </div>
        <div style={{ background: '#fff', marginTop: 6, padding: '14px 12px 20px' }}>
          <XianyuContent text={content} />
        </div>
        <div style={{ height: 20 }} />
      </div>
      <XianyuBottomBar />
    </>
  )

  if (device.os === 'android') {
    return <AndroidShell device={device}>{contentArea}</AndroidShell>
  }
  return <IPhoneShell device={device}>{contentArea}</IPhoneShell>
}
