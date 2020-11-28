import { scrollbarWidth } from '@xobotyi/scrollbar-width'
import { useLayoutEffect, useState } from 'react'

export const useScrollbarWidth = () => {
  const [width, setWidth] = useState<number | undefined>(scrollbarWidth())

  useLayoutEffect(() => {
    setTimeout(() => setWidth(scrollbarWidth()), 0)
  }, [])

  return width
}
