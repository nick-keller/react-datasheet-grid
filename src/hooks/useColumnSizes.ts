import { Column } from '../types'
import { ColumnSizer } from '../classes/ColumnSizer'
import { RefObject, useMemo } from 'react'

import { useResizeDetector } from 'react-resize-detector'

export const useColumnSizes = (
  columns: Column<any>[],
  containerRef: RefObject<HTMLDivElement>,
  columnSizer: ColumnSizer
) => {
  const { width } = useResizeDetector({
    targetRef: containerRef,
    handleHeight: false,
    refreshMode: 'throttle',
    refreshRate: 100,
  })

  return useMemo(
    () => columnSizer(width ?? null, columns),
    [width, columnSizer]
  )
}
