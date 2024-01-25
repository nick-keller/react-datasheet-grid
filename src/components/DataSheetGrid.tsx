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
      stateRef.current.update({
        data,
        columns: columns as Column<any>[],
        rowIsSticky,
      })

      const scrollableRef = useRef<HTMLDivElement>(null)

      const rowVirtualizer = useVirtualizer({
        count: stateRef.current.rowCount(),
        getScrollElement: () => scrollableRef.current,
        estimateSize: (index) => 20 + (index % 9) * 6,
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
        while (stickyRowsData.length && stickyRowsData[0].index < row.index) {
          stickyRowsData.shift()
        }

        const stickyRowData =
          stickyRowsData[0].index === row.index
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
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${col.start}px)`,
                    background: ['#00ff00', '#00cc00', '#009900', '#006600'][
                      stickyRowData!.level
                    ],
                  }}
                >
                  {col.index},{row.index}
                </div>
              )
            } else if (stickyRight) {
              stickyRows[stickyRows.length - 1].stickyRightCells.push(
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
                    }px)`,
                    background: ['#0000ff', '#0000cc', '#000099', '#000066'][
                      stickyRowData!.level
                    ],
                  }}
                >
                  {col.index},{row.index}
                </div>
              )
            } else {
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
            }
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
                  background: 'teal',
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
                  background: 'plum',
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
                  background: 'white',
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
              {stickyRows.map(
                ({ data, cells, stickyRightCells, stickyLeftCells }) => (
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
                          height:
                            data.areaBottom - data.areaTop - data.rowHeight,
                        }}
                      />
                    )}
                    <div
                      style={{
                        position: 'sticky',
                        top: data.stickyTop,
                        bottom: data.stickyBottom,
                        width: '100%',
                        height: data.rowHeight,
                      }}
                    >
                      {cells}
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
