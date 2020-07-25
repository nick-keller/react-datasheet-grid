import { useEffect, useMemo, useState } from 'react'
import { useScrollbarWidth } from './useScrollbarWidth'

export const useColumnWidths = (width: number, columns: Column[]) => {
  const scrollbarWidth = useScrollbarWidth()
  const [widths, setWidths] = useState<number[]>(() =>
    columns.map(() => Math.floor(width / columns.length))
  )
  const offsets = useMemo<number[]>(() => {
    let total = 0
    return widths.map((w, i) => {
      total += w
      return i === widths.length - 1 ? Infinity : total
    })
  }, [widths])

  const columnsHash = columns
    .map(({ width, minWidth, maxWidth }) =>
      [width, minWidth, maxWidth].join(',')
    )
    .join('|')

  useEffect(() => {
    if (scrollbarWidth !== undefined) {
      const el = document.createElement('div')

      el.style.display = 'flex'
      el.style.position = 'fixed'
      el.style.width = `${width - scrollbarWidth}px`
      el.style.left = '-999px'
      el.style.top = '-1px'

      const children = columns.map((column) => {
        const child = document.createElement('div')

        child.style.display = 'block'
        child.style.flex = String(column.width || 1)
        child.style.minWidth = `${column.minWidth}px`
        child.style.maxWidth = `${column.maxWidth}px`

        return child
      })

      children.forEach((child) => el.appendChild(child))
      document.body.insertBefore(el, null)

      setWidths(children.map((child) => child.offsetWidth))
      el.remove()
    }
  }, [width, columnsHash, scrollbarWidth])

  return { widths, offsets }
}
