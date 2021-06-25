import React, { useEffect, useState } from 'react'
import { throttle } from 'throttle-debounce'

export const useEdges = (
  ref: React.RefObject<HTMLElement>,
  width?: number,
  height?: number
) => {
  const [edges, setEdges] = useState({
    top: true,
    right: true,
    bottom: true,
    left: true,
  })

  useEffect(() => {
    const onScroll = throttle(100, () => {
      const newEdges = {
        top: ref.current?.scrollTop === 0,
        right:
          ref.current?.scrollLeft ===
          (ref.current?.scrollWidth ?? 0) - (width ?? 0),
        bottom:
          ref.current?.scrollTop ===
          (ref.current?.scrollHeight ?? 0) - (height ?? 0),
        left: ref.current?.scrollLeft === 0,
      }

      setEdges((prevEdges) => {
        if (
          prevEdges.top !== newEdges.top ||
          prevEdges.right !== newEdges.right ||
          prevEdges.bottom !== newEdges.bottom ||
          prevEdges.left !== newEdges.left
        ) {
          return newEdges
        }

        return prevEdges
      })
    })

    ref.current?.addEventListener('scroll', onScroll)
    onScroll()

    return () => {
      ref.current?.removeEventListener('scroll', onScroll)
      onScroll.cancel()
    }
  }, [height, width])

  return edges
}
