import React, { ForwardedRef, forwardRef, memo, ReactNode, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  DataSheetGridState,
  StickyRowData,
} from '../classes/DataSheetGridState'
import { Column, RowParams, RowStickiness, RowStickinessFn } from '../types'

export type DataSheetGridProps<Row> = {
  value?: Row[]
  overscanRows?: number
  overscanCols?: number
  rowIsSticky?: RowStickinessFn<Row>
  columns?: Partial<Column<Row>>[]
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
      },
      ref
    ) => {
      const stateRef = useRef<DataSheetGridState<any>>(new DataSheetGridState())
      stateRef.current.data = data
      stateRef.current.rowIsSticky = rowIsSticky
      stateRef.current.columns = columns as Column<any>[]

      const scrollableRef = useRef<HTMLDivElement>(null)

      const rowVirtualizer = useVirtualizer({
        count: stateRef.current.rowCount(),
        getScrollElement: () => scrollableRef.current,
        estimateSize: () => 35,
        overscan: overscanRows,
        rangeExtractor: (range) => stateRef.current.rowRangeExtractor(range),
        onChange: (instance) => {
          stateRef.current.rowVirtualizer = instance
          stateRef.current.computeStickyRows()
        },
      })

      const colVirtualizer = useVirtualizer({
        count: stateRef.current.colCount(),
        horizontal: true,
        getScrollElement: () => scrollableRef.current,
        estimateSize: () => 50,
        overscan: overscanCols,
        rangeExtractor: (range) => stateRef.current.colRangeExtractor(range),
        onChange: (instance) => {
          stateRef.current.colVirtualizer = instance
        },
      })

      const middleCells: ReactNode[] = []
      const stickyLeftCells: ReactNode[] = []
      const stickyRightCells: ReactNode[] = []
      const stickyRows: { data: StickyRowData; cells: ReactNode[] }[] = []
      let nextStickyRowIndex = 0

      rowVirtualizer.getVirtualItems().forEach((row) => {
        while (
          nextStickyRowIndex < stateRef.current.stickyRows.length &&
          stateRef.current.stickyRows[nextStickyRowIndex] < row.index
        ) {
          nextStickyRowIndex++
        }
        const stickyRow =
          stateRef.current.stickyRows[nextStickyRowIndex] === row.index

        let stickyRowData: StickyRowData | undefined

        if (stickyRow) {
          stickyRowData = stateRef.current.stickyRowsData.get(row.index)
          stickyRows.push({
            data: stickyRowData as StickyRowData,
            cells: [],
          })
        }

        colVirtualizer.getVirtualItems().forEach((col) => {
          const stickyLeft = stateRef.current.isStickyLeft(col.index)
          const stickyRight = stateRef.current.isStickyRight(col.index)

          if (stickyRow) {
            stickyRows[stickyRows.length - 1].cells.push(
              <div
                key={`${col.key}-${row.key}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px)`,
                  background: ['#ff0000', '#cc0000', '#990000', '#660000'][
                    stickyRowData!.level
                  ],
                }}
              >
                {col.index},{row.index}
              </div>
            )
          } else if (stickyLeft) {
            stickyLeftCells.push(
              <div
                key={`${col.key}-${row.key}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                  background: 'red',
                }}
              >
                {col.index},{row.index}
              </div>
            )
          } else if (stickyRight) {
            stickyRightCells.push(
              <div
                key={`${col.key}-${row.key}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${
                    col.end - colVirtualizer.getTotalSize()
                  }px) translateY(${row.start}px)`,
                  background: 'blue',
                }}
              >
                {col.index},{row.index}
              </div>
            )
          } else {
            middleCells.push(
              <div
                key={`${col.key}-${row.key}`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                  background: 'green',
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
            style={{
              height: `400px`,
              overflow: 'auto',
            }}
          >
            <div
              style={{
                height: rowVirtualizer.getTotalSize(),
                width: colVirtualizer.getTotalSize(),
                position: 'relative',
              }}
            >
              {middleCells}
              <div
                style={{
                  position: 'sticky',
                  left: 0,
                  background: 'blue',
                  width: 1,
                }}
              >
                {stickyLeftCells}
              </div>
              <div
                style={{
                  position: 'sticky',
                  right: 0,
                  width: 1,
                  marginLeft: 'auto',
                }}
              >
                {stickyRightCells}
              </div>
              {stickyRows.map(({ data, cells }) => (
                <div
                  key={data.areaTop + '-' + data.areaBottom}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: data.areaTop,
                    height: data.areaBottom - data.areaTop,
                    zIndex: 100 - data.level,
                  }}
                >
                  {data.stickyBottom !== undefined && (
                    <div
                      style={{
                        height: data.areaBottom - data.areaTop - data.rowHeight,
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: 'sticky',
                      top: data.stickyTop,
                      bottom: data.stickyBottom,
                      width: 100,
                      height: data.rowHeight,
                    }}
                  >
                    {cells}
                  </div>
                </div>
              ))}
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
