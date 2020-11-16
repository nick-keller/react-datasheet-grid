import { scrollbarWidth } from '@xobotyi/scrollbar-width'
import { useEffect, useState } from 'react'

export const useScrollbarWidth = () => {
  const [width, setWidth] = useState<number | undefined>(scrollbarWidth())

  useEffect(() => {
    setWidth(scrollbarWidth())
  }, [])

  return width
}
