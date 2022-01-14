import React, { useEffect } from 'react'
import { throttle } from 'throttle-debounce'
import { useDeepEqualState } from './useDeepEqualState'

export const useEdges = (
  ref: React.RefObject<HTMLElement>,
  width?: number,
  height?: number
) => {
  const [edges, setEdges] = useDeepEqualState({
    top: true,
    right: true,
    bottom: true,
    left: true,
  })

  useEffect(() => {
    const onScroll = throttle(100, () => {
      setEdges({
        top: ref.current?.scrollTop === 0,
        right:
          (ref.current?.scrollLeft ?? 0) >=
          (ref.current?.scrollWidth ?? 0) - (width ?? 0) - 1,
        bottom:
          (ref.current?.scrollTop ?? 0) >=
          (ref.current?.scrollHeight ?? 0) - (height ?? 0) - 1,
        left: ref.current?.scrollLeft === 0,
      })
    })

    const current = ref.current
    current?.addEventListener('scroll', onScroll)
    setTimeout(onScroll, 100)

    return () => {
      current?.removeEventListener('scroll', onScroll)
      onScroll.cancel()
    }
  }, [height, width, ref, setEdges])

  return edges
}
