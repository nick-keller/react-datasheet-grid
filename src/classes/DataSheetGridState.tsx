import {
  Cell,
  Column,
  Cursor,
  isStaticRow,
  RowParams,
  RowStickiness,
  RowStickinessFn,
  RowStickinessShortHand,
  ScrollBehavior,
  StaticRow,
} from '../types'
import {
  Range,
  Virtualizer,
  defaultRangeExtractor,
} from '@tanstack/react-virtual'
import React from 'react'

export type StickyRowData = {
  // Top of the sticky area in which the element can travel
  areaTop: number
  // Bottom of the sticky area in which the element can travel
  areaBottom: number
  // Number of pixels from the top edge
  stickyTop?: number
  // Number of pixels from the bottom edge
  stickyBottom?: number
  rowHeight: number
  level: number
}

const parseRowStickinessFnResult = (
  result: RowStickinessShortHand
): RowStickiness | null => {
  if (typeof result === 'boolean' || result === 'top') {
    return result ? { level: 1, position: 'top' } : null
  }

  if (result === 'bottom') {
    return { level: 1, position: 'bottom' }
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
  private _data: (Row | StaticRow)[] = []
  private _rowIsSticky: null | RowStickinessFn<Row> = null
  private _stickyRows: { index: number; data: StickyRowData }[] = []
  private _stickyColumnsLeft: number = 0
  private _stickyColumnsRightFromIndex: number = Infinity
  private _columns: Column<Row>[] = []
  private _colRangeExtractor: (range: Range) => number[] = defaultRangeExtractor
  private _rowRangeExtractor: (range: Range) => number[] = defaultRangeExtractor
  // Highlighted cell, null when not focused
  private _activeCell: (Cell & ScrollBehavior) | null = { col: 2, row: 2 }
  // The selection cell and the active cell are the two corners of the selection, null when nothing is selected
  private _selectionCell: (Cell & ScrollBehavior) | null = { col: 0, row: 5 }
  private _cursor: Cursor<Row> = () => false
  public _rowVirtualizer: Virtualizer<HTMLDivElement, Element> | null = null

  constructor() {
    this.computeCursor()
  }

  update({
    data,
    columns,
    rowIsSticky,
  }: {
    data: Row[]
    columns: Column<Row>[]
    rowIsSticky: null | undefined | RowStickinessFn<Row>
  }) {
    let computeStickyRows = false
    let computeStickyColumns = false

    if (this._data !== data) {
      computeStickyRows = true
      this._data = data
    }
    if (this._columns !== columns) {
      computeStickyColumns = true
      this._columns = columns
    }
    if (this._rowIsSticky !== (rowIsSticky ?? null)) {
      computeStickyRows = true
      this._rowIsSticky = rowIsSticky ?? null
    }

    if (computeStickyRows) {
      this.computeStickyRows()
    }
    if (computeStickyColumns) {
      this.computeStickyColumns()
    }
  }

  get activeCell(): (Cell & ScrollBehavior) | null {
    return this._activeCell
  }

  set activeCell(value: (Cell & ScrollBehavior) | null) {
    this._activeCell = value
    this.computeCursor()
  }

  get selectionCell(): (Cell & ScrollBehavior) | null {
    return this._selectionCell
  }

  set selectionCell(value: (Cell & ScrollBehavior) | null) {
    this._selectionCell = value
    this.computeCursor()
  }

  private computeCursor() {
    this._cursor = ({ cell }) => {
      if (!this._activeCell) {
        return false
      }

      if (
        this._activeCell.col > cell.col &&
        (!this._selectionCell || this._selectionCell.col > cell.col)
      ) {
        return false
      }

      if (
        this._activeCell.col < cell.col &&
        (!this._selectionCell || this._selectionCell.col < cell.col)
      ) {
        return false
      }

      if (
        this._activeCell.row < cell.row &&
        (!this._selectionCell || this._selectionCell.row < cell.row)
      ) {
        return false
      }

      if (
        this._activeCell.row > cell.row &&
        (!this._selectionCell || this._selectionCell.row > cell.row)
      ) {
        return false
      }

      console.log(cell)
      return <div className="dsg-cursor" />
    }
  }

  get cursor() {
    return this._cursor
  }

  get data() {
    return this._data
  }

  get columns() {
    return this._columns
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
    return col >= this._stickyColumnsRightFromIndex
  }

  get colRangeExtractor() {
    return this._colRangeExtractor
  }

  get rowRangeExtractor() {
    return this._rowRangeExtractor
  }

  set rowVirtualizer(
    rowVirtualizer: Virtualizer<HTMLDivElement, Element> | null
  ) {
    if (this._rowVirtualizer === rowVirtualizer) return

    this._rowVirtualizer = rowVirtualizer
    this.computeStickyRows()
  }

  computeStickyColumns() {
    if (!this._columns.length) {
      this._stickyColumnsLeft = 0
      this._stickyColumnsRightFromIndex = Infinity
      return
    }

    this._stickyColumnsLeft = this._columns.findIndex(
      ({ sticky }) => sticky !== 'left'
    )
    this._stickyColumnsRightFromIndex =
      this._columns.length -
      [...this._columns].reverse().findIndex(({ sticky }) => sticky !== 'right')

    this._colRangeExtractor = (range: Range): number[] => {
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
        i = Math.max(i, this._stickyColumnsRightFromIndex);
        i < range.count;
        i++
      ) {
        items.push(i)
      }

      return items
    }
  }

  computeStickyRows() {
    const isSticky = this._rowIsSticky ?? (() => false)
    const rowVirtualizer = this._rowVirtualizer
    this._stickyRows = []

    if (!rowVirtualizer) {
      return
    }

    const stickyRows = this._data.reduce((acc, rowData, rowIndex) => {
      const rowStickiness = parseRowStickinessFnResult(
        isStaticRow(rowData) ? rowData.sticky : isSticky({ rowData, rowIndex })
      )

      if (rowStickiness) {
        acc.push({ index: rowIndex, rowStickiness })
      }

      return acc
    }, [] as { index: number; rowStickiness: RowStickiness }[])

    const stickyRowsData = new Map<number, StickyRowData>()

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

        stickyRowsData.set(index, {
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

        stickyRowsData.set(index, {
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

    this._stickyRows = stickyRows.map(({ index }) => ({
      index,
      data: stickyRowsData.get(index) as StickyRowData,
    }))

    this._rowRangeExtractor = (range: Range): number[] => {
      const items = [] as number[]
      const top =
        this._rowVirtualizer?.measurementsCache[range.startIndex].start ?? 0
      const bottom =
        this._rowVirtualizer?.measurementsCache[range.endIndex].end ?? 0

      const visibleRows = this._stickyRows.filter(
        ({ data }) => data.areaTop < bottom && data.areaBottom > top
      )

      const firstVisibleIndex = Math.max(0, range.startIndex - range.overscan)
      const lastVisibleIndex = Math.min(
        range.count - 1,
        range.endIndex + range.overscan
      )

      for (const { index } of visibleRows) {
        if (index >= firstVisibleIndex) {
          break
        }
        items.push(index)
      }

      for (let i = firstVisibleIndex; i <= lastVisibleIndex; i++) {
        items.push(i)
      }

      for (const { index } of visibleRows) {
        if (index <= lastVisibleIndex) {
          continue
        }
        items.push(index)
      }

      return items
    }
  }

  get stickyRows() {
    return this._stickyRows
  }
}
