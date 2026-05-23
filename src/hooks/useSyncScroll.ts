import { useCallback, useRef } from 'react'

export function useSyncScroll(enabled: boolean) {
  const refs = useRef<(HTMLElement | null)[]>([])
  const isSyncing = useRef(false)

  const registerRef = useCallback((index: number) => (el: HTMLElement | null) => {
    refs.current[index] = el
  }, [])

  const handleScroll = useCallback((sourceIndex: number) => () => {
    if (!enabled || isSyncing.current) return
    const source = refs.current[sourceIndex]
    if (!source) return
    const scrollable = source.scrollHeight - source.clientHeight
    if (scrollable <= 0) return
    const ratio = source.scrollTop / scrollable

    isSyncing.current = true
    refs.current.forEach((el, i) => {
      if (!el || i === sourceIndex) return
      const targetScrollable = el.scrollHeight - el.clientHeight
      el.scrollTop = ratio * targetScrollable
    })
    requestAnimationFrame(() => { isSyncing.current = false })
  }, [enabled])

  return { registerRef, handleScroll }
}
