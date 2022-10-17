import { Column } from '../types'
import { useMemo } from 'react'

export const getColumnWidths = (
  containerWidth: number,
  columns: Pick<
    Column<any, any, any>,
    'basis' | 'grow' | 'shrink' | 'minWidth' | 'maxWidth'
  >[]
) => {
  const items = columns.map(({ basis, minWidth, maxWidth }) => ({
    basis,
    minWidth,
    maxWidth,
    size: basis,
    violation: 0,
    frozen: false,
    factor: 0,
  }))

  let availableWidth = items.reduce(
    (acc, cur) => acc - cur.size,
    containerWidth
  )

  if (availableWidth > 0) {
    columns.forEach(({ grow }, i) => {
      items[i].factor = grow
    })
  } else if (availableWidth < 0) {
    columns.forEach(({ shrink }, i) => {
      items[i].factor = shrink
    })
  }

  for (const item of items) {
    if (item.factor === 0) {
      item.frozen = true
    }
  }

  while (items.some(({ frozen }) => !frozen)) {
    const sumFactors = items.reduce(
      (acc, cur) => acc + (cur.frozen ? 0 : cur.factor),
      0
    )

    let totalViolation = 0

    for (const item of items) {
      if (!item.frozen) {
        item.size += (availableWidth * item.factor) / sumFactors

        if (item.size < item.minWidth) {
          item.violation = item.minWidth - item.size
        } else if (item.maxWidth !== undefined && item.size > item.maxWidth) {
          item.violation = item.maxWidth - item.size
        } else {
          item.violation = 0
        }

        item.size += item.violation
        totalViolation += item.violation
      }
    }

    if (totalViolation > 0) {
      for (const item of items) {
        if (item.violation > 0) {
          item.frozen = true
        }
      }
    } else if (totalViolation < 0) {
      for (const item of items) {
        if (item.violation < 0) {
          item.frozen = true
        }
      }
    } else {
      break
    }

    availableWidth = items.reduce((acc, cur) => acc - cur.size, containerWidth)
  }

  return items.map(({ size }) => size)
}

export const useColumnWidths = (
  columns: Column<any, any, any>[],
  width?: number
) => {
  const columnsHash = columns
    .map(({ basis, minWidth, maxWidth, grow, shrink }) =>
      [basis, minWidth, maxWidth, grow, shrink].join(',')
    )
    .join('|')

  return useMemo(() => {
    if (width === undefined) {
      return {
        fullWidth: false,
        columnWidths: undefined,
        columnRights: undefined,
        totalWidth: undefined,
      }
    }

    const columnWidths = getColumnWidths(width, columns)

    let totalWidth = 0

    const columnRights = columnWidths.map((w, i) => {
      totalWidth += w
      return i === columnWidths.length - 1 ? Infinity : totalWidth
    })

    return {
      fullWidth: Math.abs(width - totalWidth) < 0.1,
      columnWidths,
      columnRights,
      totalWidth,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, columnsHash])
}
