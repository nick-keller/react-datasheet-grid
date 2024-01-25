import React, { ForwardedRef, forwardRef, memo, ReactNode, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  DataSheetGridState,
  StickyRowData,
} from '../classes/DataSheetGridState'
import {Column, isStaticRow, RowParams, RowStickinessFn, StaticRow} from '../types'

export type DataSheetGridProps<Row> = {
  value?: (Row | StaticRow)[]
  overscanRows?: number
  overscanCols?: number
  rowIsSticky?: RowStickinessFn<Row>
  columns?: Partial<Column<Row>>[]
  rowHeight?: number | ((params: RowParams<Row>) => number)
}

export type DataSheetGridRef = {}

const DEFAULT_DATA: any[] = []

export const DataSheetGrid = memo(
  forwardRef<DataSheetGridRef, DataSheetGridProps<any>>(
    (
      {
        value: data = DEFAULT_DATA,
        overscanRows,
        overscanCols,
        rowIsSticky,
        columns,
        rowHeight = 40,
      },
      ref
    ) => {
      const stateRef = useRef<DataSheetGridState<any>>(new DataSheetGridState())
      stateRef.current.update({
        data,
        columns: columns as Column<any>[],
        rowIsSticky,
      })

      const scrollableRef = useRef<HTMLDivElement>(null)

      const rowVirtualizer = useVirtualizer({
        count: stateRef.current.rowCount(),
        getScrollElement: () => scrollableRef.current,
        estimateSize: (index) => {
          if (isStaticRow(data[index])) {
            return data[index].height ?? (typeof rowHeight === 'number' ? rowHeight : 40)
          }

          if (typeof rowHeight === 'function') {
            return rowHeight({ rowIndex: index, rowData: data[index] })
          }

          return rowHeight
        },
        overscan: overscanRows,
        rangeExtractor: stateRef.current.rowRangeExtractor,
        onChange: (instance) => {
          stateRef.current.rowVirtualizer = instance
        },
      })

      const colVirtualizer = useVirtualizer({
        count: stateRef.current.colCount(),
        horizontal: true,
        getScrollElement: () => scrollableRef.current,
        estimateSize: (index) => 50 + (index % 9) * 4,
        overscan: overscanCols,
        rangeExtractor: stateRef.current.colRangeExtractor,
      })

      // Cells that scroll normally
      const middleCells: ReactNode[] = []
      // Cells that are sticky to the left, but otherwise scroll normally
      const stickyLeftCells: ReactNode[] = []
      // Cells that are sticky to the right, but otherwise scroll normally
      const stickyRightCells: ReactNode[] = []
      // Rows that are sticky to the top or bottom
      const stickyRows: {
        data: StickyRowData
        // Cells that scroll left to right normally
        cells: ReactNode[]
        // Cells that are sticky to the left
        stickyLeftCells: ReactNode[]
        // Cells that are sticky to the right
        stickyRightCells: ReactNode[]
      }[] = []

      const stickyRowsData = [...stateRef.current.stickyRows]

      rowVirtualizer.getVirtualItems().forEach((row) => {
        // We just pop the array from the front to avoid re-iterating over the array for every row
        while (stickyRowsData.length && stickyRowsData[0].index < row.index) {
          stickyRowsData.shift()
        }

        const stickyRowData =
          stickyRowsData[0]?.index === row.index
            ? stickyRowsData[0].data
            : undefined

        if (stickyRowData) {
          stickyRows.push({
            data: stickyRowData,
            cells: [],
            stickyLeftCells: [],
            stickyRightCells: [],
          })
        }

        colVirtualizer.getVirtualItems().forEach((col) => {
          const stickyLeft = stateRef.current.isStickyLeft(col.index)
          const stickyRight = stateRef.current.isStickyRight(col.index)

          if (stickyRowData) {
            if (stickyLeft) {
              stickyRows[stickyRows.length - 1].stickyLeftCells.push(
                <div
                  key={`${col.key}-${row.key}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${col.start}px)`,
                  }}
                >
                  {col.index},{row.index}
                </div>
              )
            } else if (stickyRight) {
              stickyRows[stickyRows.length - 1].stickyRightCells.push(
                <div
                  key={`${col.key}-${row.key}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${
                      col.end - colVirtualizer.getTotalSize()
                    }px)`,
                  }}
                >
                  {col.index},{row.index}
                </div>
              )
            } else {
              stickyRows[stickyRows.length - 1].cells.push(
                <div
                  key={`${col.key}-${row.key}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${col.start}px)`,
                  }}
                >
                  {col.index},{row.index}
                </div>
              )
            }
          } else if (stickyLeft) {
            stickyLeftCells.push(
              <div
                key={`${col.key}-${row.key}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                }}
              >
                {col.index},{row.index}
              </div>
            )
          } else if (stickyRight) {
            stickyRightCells.push(
              <div
                key={`${col.key}-${row.key}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${
                    col.end - colVirtualizer.getTotalSize()
                  }px) translateY(${row.start}px)`,
                }}
              >
                {col.index},{row.index}
              </div>
            )
          } else {
            middleCells.push(
              <div
                key={`${col.key}-${row.key}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                }}
              >
                {col.index},{row.index}
              </div>
            )
          }
        })
      })

      return (
        <div>
          <div
            ref={scrollableRef}
            className="dsg-container"
            style={{
              height: `400px`,
            }}
          >
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                width: colVirtualizer.getTotalSize(),
              }}
            >
              {middleCells}
              {stickyLeftCells.length > 0 && (
                <div className="dsg-sticky-left-container">
                  {stickyLeftCells}
                </div>
              )}
              {stickyRightCells.length > 0 && (
                <div className="dsg-sticky-right-container">
                  {stickyRightCells}
                </div>
              )}
              {stickyRows.map(
                ({ data, cells, stickyRightCells, stickyLeftCells }) => (
                  <div
                    key={data.areaTop + '-' + data.areaBottom}
                    className="dsg-sticky-row-area"
                    style={{
                      top: data.areaTop,
                      height: data.areaBottom - data.areaTop,
                      zIndex: 100 - data.level,
                    }}
                  >
                    {data.stickyBottom !== undefined && (
                      <div
                        style={{
                          height:
                            data.areaBottom - data.areaTop - data.rowHeight,
                        }}
                      />
                    )}
                    <div
                      className="dsg-sticky-row"
                      style={{
                        top: data.stickyTop,
                        bottom: data.stickyBottom,
                        height: data.rowHeight,
                      }}
                    >
                      {cells}
                      {stickyLeftCells.length > 0 && (
                        <div className="dsg-sticky-left-container">
                          {stickyLeftCells}
                        </div>
                      )}
                      {stickyRightCells.length > 0 && (
                        <div className="dsg-sticky-right-container">
                          {stickyRightCells}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )
    }
  )
) as <Row>(
  props: DataSheetGridProps<Row> & { ref?: ForwardedRef<DataSheetGridRef> }
) => JSX.Element

// @ts-ignore
DataSheetGrid.displayName = 'DataSheetGrid'
