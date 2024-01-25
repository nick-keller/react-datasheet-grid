import { Column, RowParams, RowStickiness, RowStickinessFn } from '../types'
import { Range, Virtualizer } from '@tanstack/react-virtual'

export type StickyRowData = {
  // To of the sticky area in which the element can travel
  areaTop: number
  // Bottom of the sticky area in which the element can travel
  areaBottom: number
  // number of pixels from the top edge
  stickyTop?: number
  // number of pixels from the bottom edge
  stickyBottom?: number
  rowHeight: number
  level: number
}

const parseRowStickinessFnResult = (
  result: ReturnType<RowStickinessFn<any>>
): RowStickiness | null => {
  if (typeof result === 'boolean') {
    return result ? { level: 1, position: 'top' } : null
  }

  if (typeof result === 'number') {
    return { level: result, position: 'top' }
  }

  if (result === null || result === undefined) {
    return null
  }

  return result
}

export class DataSheetGridState<Row> {
  private _data: Row[] = []
  private _rowIsSticky: null | RowStickinessFn<Row> = null
  private _stickyRows: number[] = []
  private _stickyRowsData: Map<number, StickyRowData> = new Map()
  private _stickyColumnsLeft: number = 0
  private _stickyColumnsRight: number = 0
  private _columns: Column<Row>[] = []
  public rowVirtualizer: Virtualizer<HTMLDivElement, Element> | null = null
  public colVirtualizer: Virtualizer<HTMLDivElement, Element> | null = null

  constructor() {}

  get data() {
    return this._data
  }

  set data(data: Row[]) {
    if (this._data === data) return

    this._data = data
    this.computeStickyRows()
  }

  get columns() {
    return this._columns
  }

  set columns(columns: Column<Row>[]) {
    if (this._columns === columns) return

    this._columns = columns
    this.computeStickyColumns()
  }

  get rowIsSticky() {
    return this._rowIsSticky
  }

  set rowIsSticky(rowIsSticky: null | undefined | RowStickinessFn<Row>) {
    if (this._rowIsSticky === (rowIsSticky ?? null)) return

    this._rowIsSticky = rowIsSticky ?? null
    this.computeStickyRows()
  }

  colCount() {
    return this._columns.length
  }

  rowCount() {
    return this._data.length
  }

  isStickyLeft(col: number) {
    return col < this._stickyColumnsLeft
  }

  isStickyRight(col: number) {
    return col >= this._columns.length - this._stickyColumnsRight
  }

  get stickyColumnsLeft() {
    return this._stickyColumnsLeft
  }

  get stickyColumnsRight() {
    return this._stickyColumnsRight
  }

  colRangeExtractor(range: Range): number[] {
    const items = [] as number[]
    let i = 0

    for (; i < this._stickyColumnsLeft; i++) {
      items.push(i)
    }

    for (
      i = Math.max(i, range.startIndex - range.overscan);
      i <= Math.min(range.endIndex + range.overscan, range.count - 1);
      i++
    ) {
      items.push(i)
    }

    for (
      i = Math.max(i, range.count - this._stickyColumnsRight);
      i < range.count;
      i++
    ) {
      items.push(i)
    }

    return items
  }

  rowRangeExtractor(range: Range): number[] {
    const items = [] as number[]
    const top =
      this.rowVirtualizer?.measurementsCache[range.startIndex].start ?? 0
    const bottom =
      this.rowVirtualizer?.measurementsCache[range.endIndex].end ?? 0

    const visibleRows = this._stickyRows.filter((rowIndex) => {
      const row = this._stickyRowsData.get(rowIndex)
      return row ? row.areaTop < bottom && row.areaBottom > top : false
    })

    const firstVisibleIndex = Math.max(0, range.startIndex - range.overscan)
    const lastVisibleIndex = Math.min(
      range.count - 1,
      range.endIndex + range.overscan
    )

    for (const rowIndex of visibleRows) {
      if (rowIndex >= firstVisibleIndex) {
        break
      }
      items.push(rowIndex)
    }

    for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
      items.push(i)
    }

    for (const rowIndex of visibleRows) {
      if (rowIndex <= lastVisibleIndex) {
        continue
      }
      items.push(rowIndex)
    }

    console.log(items)

    return items
  }

  computeStickyColumns() {
    if (!this._columns.length) {
      this._stickyColumnsLeft = 0
      this._stickyColumnsRight = 0
      return
    }

    this._stickyColumnsLeft = this._columns.findIndex(
      ({ sticky }) => sticky !== 'left'
    )
    this._stickyColumnsRight = [...this._columns]
      .reverse()
      .findIndex(({ sticky }) => sticky !== 'right')
  }

  computeStickyRows() {
    const isSticky = this._rowIsSticky
    const rowVirtualizer = this.rowVirtualizer
    this._stickyRows = []
    this._stickyRowsData.clear()

    if (!isSticky || !rowVirtualizer) {
      return
    }

    const stickyRows = this._data.reduce((acc, rowData, rowIndex) => {
      const rowStickiness = parseRowStickinessFnResult(
        isSticky({ rowData, rowIndex })
      )

      if (rowStickiness) {
        this._stickyRows.push(rowIndex)
        acc.push({ index: rowIndex, rowStickiness })
      }

      return acc
    }, [] as { index: number; rowStickiness: RowStickiness }[])

    const top = [] as { level: number; top: number }[]

    for (let i = 0; i < stickyRows.length; i++) {
      const { index, rowStickiness } = stickyRows[i]

      if (rowStickiness.position === 'top') {
        let next = i + 1

        while (next < stickyRows.length) {
          if (stickyRows[next].rowStickiness.level <= rowStickiness.level) {
            break
          }
          next++
        }

        while (top.length && top[top.length - 1].level >= rowStickiness.level) {
          top.pop()
        }

        top.push({
          top: rowVirtualizer.measurementsCache[index].size,
          level: rowStickiness.level,
        })

        this._stickyRowsData.set(index, {
          areaTop: rowVirtualizer.measurementsCache[index].start,
          areaBottom:
            next === stickyRows.length
              ? rowVirtualizer.measurementsCache[this._data.length - 1].end
              : rowVirtualizer.measurementsCache[stickyRows[next].index].start,
          rowHeight: rowVirtualizer.measurementsCache[index].size,
          level: rowStickiness.level,
          stickyTop: top.reduce(
            (acc, value, index) =>
              index < top.length - 1 ? acc + value.top : acc,
            0
          ),
        })
      }
    }

    const bottom = [] as { level: number; bottom: number }[]

    for (let i = stickyRows.length - 1; i >= 0; i--) {
      const { index, rowStickiness } = stickyRows[i]

      if (rowStickiness.position === 'bottom') {
        let next = i - 1

        while (next >= 0) {
          if (stickyRows[next].rowStickiness.level <= rowStickiness.level) {
            break
          }
          next--
        }

        while (
          bottom.length &&
          bottom[bottom.length - 1].level >= rowStickiness.level
        ) {
          bottom.pop()
        }

        bottom.push({
          bottom: rowVirtualizer.measurementsCache[index].size,
          level: rowStickiness.level,
        })

        this._stickyRowsData.set(index, {
          areaBottom: rowVirtualizer.measurementsCache[index].end,
          areaTop:
            next === -1
              ? 0
              : rowVirtualizer.measurementsCache[stickyRows[next].index].end,
          rowHeight: rowVirtualizer.measurementsCache[index].size,
          level: rowStickiness.level,
          stickyBottom: bottom.reduce(
            (acc, value, index) =>
              index < bottom.length - 1 ? acc + value.bottom : acc,
            0
          ),
        })
      }
    }
    //
    // // The stack of levels in increasing order
    // const levels: {
    //   level: number
    //   top: number
    //   nextTop: number
    //   stickyRowData: StickyRowData
    // }[] = []
    // // Just a shorthand for the last element of the array
    // let lastLevel: typeof levels[number] | undefined
    //
    // this._stickyRowsData.clear()
    // this._stickyRows = this._data.reduce((acc, rowData, rowIndex) => {
    //   const rowStickiness = parseRowStickinessFnResult(
    //     isSticky({ rowData, rowIndex })
    //   )
    //
    //   if (rowStickiness) {
    //     acc.push(rowIndex)
    //
    //     const stickyRowData: StickyRowData = {
    //       areaTop: rowVirtualizer.measurementsCache[rowIndex].start,
    //       // Will be computed later
    //       areaBottom: 0,
    //       rowHeight: rowVirtualizer.measurementsCache[rowIndex].size,
    //       level: rowStickiness.level,
    //     }
    //
    //     // We found a level that is lower than the current one, we need to pop the stack
    //     if (lastLevel && lastLevel.level > rowStickiness.level) {
    //       // The total height of the removed levels
    //       let removedHeight = 0
    //       while (levels.length && lastLevel.level > rowStickiness.level) {
    //         // The bottom of the area of the sticky row is the top of the next level
    //         lastLevel.stickyRowData.areaBottom +=
    //           rowVirtualizer.measurementsCache[rowIndex].start - removedHeight
    //         removedHeight += lastLevel.stickyRowData.rowHeight
    //         levels.pop()
    //         lastLevel = levels[levels.length - 1]
    //       }
    //       lastLevel.stickyRowData.areaBottom -= removedHeight
    //     }
    //
    //     if (!lastLevel) {
    //       lastLevel = {
    //         level: rowStickiness.level,
    //         top: 0,
    //         nextTop: rowVirtualizer.measurementsCache[rowIndex].size,
    //         stickyRowData,
    //       }
    //       levels.push(lastLevel)
    //     } else if (lastLevel.level < rowStickiness.level) {
    //       lastLevel = {
    //         level: rowStickiness.level,
    //         top: lastLevel.nextTop,
    //         nextTop:
    //           rowVirtualizer.measurementsCache[rowIndex].size +
    //           lastLevel.nextTop,
    //         stickyRowData,
    //       }
    //       levels.push(lastLevel)
    //     } else if (lastLevel.level === rowStickiness.level) {
    //       lastLevel.stickyRowData.areaBottom +=
    //         rowVirtualizer.measurementsCache[rowIndex].start
    //       levels.pop()
    //       lastLevel = {
    //         level: rowStickiness.level,
    //         top: lastLevel.top,
    //         nextTop:
    //           rowVirtualizer.measurementsCache[rowIndex].size + lastLevel.top,
    //         stickyRowData,
    //       }
    //       levels.push(lastLevel)
    //     }
    //
    //     stickyRowData.stickyTop = lastLevel.top
    //
    //     this._stickyRowsData.set(rowIndex, stickyRowData)
    //   }
    //
    //   if (rowIndex === this._data.length - 1) {
    //     while (levels.length) {
    //       levels[levels.length - 1].stickyRowData.areaBottom +=
    //         rowVirtualizer.measurementsCache[rowIndex].end
    //       levels.pop()
    //     }
    //   }
    //
    //   return acc
    // }, [] as number[])

    console.log('stickyRows', this._stickyRows)
    console.log('stickyRowsData', this._stickyRowsData)
  }

  get stickyRows() {
    return this._stickyRows
  }

  get stickyRowsData() {
    return this._stickyRowsData
  }
}
