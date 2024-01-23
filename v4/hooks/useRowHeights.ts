import { DataSheetGridProps } from '../types'
import { useMemo, useRef, useState } from 'react'

type RowSize = { height: number; top: number }

export const useRowHeights = <T extends any>({
  value,
  rowHeight,
}: Required<Pick<DataSheetGridProps<T>, 'value' | 'rowHeight'>>) => {
  const calculatedHeights = useRef<RowSize[]>([])
  const [, rerender] = useState(0)

  return useMemo(() => {
    const getRowIndex = (top: number): number => {
      if (typeof rowHeight === 'number') {
        return Math.min(
          value.length - 1,
          Math.max(-1, Math.floor(top / rowHeight))
        )
      }

      let l = 0
      let r = calculatedHeights.current.length - 1

      while (l <= r) {
        const m = Math.floor((l + r) / 2)

        if (calculatedHeights.current[m].top < top) {
          l = m + 1
        } else if (calculatedHeights.current[m].top > top) {
          r = m - 1
        } else {
          return m
        }
      }

      if (
        r === calculatedHeights.current.length - 1 &&
        value.length > calculatedHeights.current.length &&
        (!calculatedHeights.current.length ||
          top >=
            calculatedHeights.current[r].top +
              calculatedHeights.current[r].height)
      ) {
        let lastBottom =
          r === -1
            ? 0
            : calculatedHeights.current[r].top +
              calculatedHeights.current[r].height

        do {
          r++
          const height = rowHeight({ rowIndex: r, rowData: value[r] })
          calculatedHeights.current.push({
            height,
            top: lastBottom,
          })
          lastBottom += height
        } while (lastBottom <= top && r < calculatedHeights.current.length - 1)
      }

      return r
    }

    return {
      resetAfter: (index: number) => {
        calculatedHeights.current = calculatedHeights.current.slice(0, index)
        rerender((x) => x + 1)
      },
      getRowSize: (index: number): RowSize => {
        if (typeof rowHeight === 'number') {
          return { height: rowHeight, top: rowHeight * index }
        }

        if (index >= value.length) {
          return { height: 0, top: 0 }
        }

        if (index < calculatedHeights.current.length) {
          return calculatedHeights.current[index]
        }

        let lastBottom =
          calculatedHeights.current[calculatedHeights.current.length - 1].top +
          calculatedHeights.current[calculatedHeights.current.length - 1].height

        for (let i = calculatedHeights.current.length; i <= index; i++) {
          const height = rowHeight({ rowIndex: i, rowData: value[i] })

          calculatedHeights.current.push({ height, top: lastBottom })
          lastBottom += height
        }

        return calculatedHeights.current[index]
      },
      getRowIndex,
      totalSize: (maxHeight: number) => {
        if (typeof rowHeight === 'number') {
          return value.length * rowHeight
        }

        const index = getRowIndex(maxHeight)

        return (
          calculatedHeights.current[index].top +
          calculatedHeights.current[index].height
        )
      },
    }
  }, [rowHeight, value])
}
