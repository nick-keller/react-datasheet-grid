import { useEffect, useMemo, useState } from 'react'
import { useScrollbarWidth } from './useScrollbarWidth'
import { Column } from '../typings'

export const useColumnWidths = (
  width: number,
  columns: Column[],
  includeScrollbar: boolean
) => {
  const scrollbarWidth = useScrollbarWidth()
  const [widths, setWidths] = useState<number[] | null>(null)
  const innerWidth = useMemo<number | null>(
    () =>
      widths &&
      widths.reduce((total, w) => {
        return total + w
      }),
    [widths]
  )
  const offsets = useMemo<number[] | null>(() => {
    let total = 0
    return (
      widths &&
      widths.map((w, i) => {
        total += w
        return i === widths.length - 1 ? Infinity : total
      })
    )
  }, [widths])

  const columnsHash = columns
    .map(({ width, minWidth, maxWidth }) =>
      [width, minWidth, maxWidth].join(',')
    )
    .join('|')

  useEffect(() => {
    if (scrollbarWidth !== undefined || !includeScrollbar) {
      const el = document.createElement('div')

      el.style.display = 'flex'
      el.style.position = 'fixed'
      el.style.width = `${
        width - (includeScrollbar ? (scrollbarWidth as number) : 0)
      }px`
      el.style.left = '-999px'
      el.style.top = '-1px'

      const children = columns.map((column) => {
        const child = document.createElement('div')

        child.style.display = 'block'
        child.style.flex = String(column.width)
        child.style.minWidth = `${column.minWidth}px`
        child.style.maxWidth = `${column.maxWidth}px`

        return child
      })

      children.forEach((child) => el.appendChild(child))
      document.body.insertBefore(el, null)

      setWidths(children.map((child) => child.offsetWidth))
      el.remove()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, columnsHash, scrollbarWidth, includeScrollbar])

  return { widths, offsets, innerWidth }
}
