import React, {
  CSSProperties,
  ForwardedRef,
  forwardRef,
  memo,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
} from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import {
  DataSheetGridState,
  StickyRowData,
} from '../classes/DataSheetGridState'
import {
  Column,
  isStaticRow,
  RowParams,
  RowStickinessFn,
  StaticRow,
} from '../types'
import { ColumnSizer, flexColumnSizer } from '../classes/ColumnSizer'
import { useColumns } from '../hooks/useColumns'
import { useColumnSizes } from '../hooks/useColumnSizes'

export type DataSheetGridProps<Row> = {
  className?: string
  columns?: Partial<Column<Row>>[]
  columnSizer?: ColumnSizer
  overscanCols?: number
  overscanRows?: number
  rowHeight?: number | ((params: RowParams<Row>) => number)
  rowIsSticky?: RowStickinessFn<Row>
  rowKey?: string | ((params: RowParams<Row>) => string | number)
  style?: CSSProperties
  value?: (Row | StaticRow)[]
}

export type DataSheetGridRef = {}

const DEFAULT_DATA: any[] = []

export const DataSheetGrid = memo(
  forwardRef<DataSheetGridRef, DataSheetGridProps<any>>(
    (
      {
        value: data = DEFAULT_DATA,
        columnSizer = flexColumnSizer,
        className,
        style,
        overscanRows,
        overscanCols,
        rowIsSticky,
        columns: partialColumns = [],
        rowHeight = 40,
        rowKey = ({ rowIndex }) => rowIndex,
      },
      ref
    ) => {
      const columns = useColumns(partialColumns)

      const stateRef = useRef<DataSheetGridState<any>>(new DataSheetGridState())
      stateRef.current.update({
        data,
        columns,
        rowIsSticky,
      })

      const scrollableRef = useRef<HTMLDivElement>(null)

      const columnSizes = useColumnSizes(columns, scrollableRef, columnSizer)

      const rowVirtualizer = useVirtualizer({
        count: stateRef.current.rowCount(),
        getScrollElement: () => scrollableRef.current,
        estimateSize: (index) => {
          if (isStaticRow(data[index])) {
            return (
              data[index].height ??
              (typeof rowHeight === 'number' ? rowHeight : 40)
            )
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
        estimateSize: (index) => columnSizes[index],
        overscan: overscanCols,
        rangeExtractor: stateRef.current.colRangeExtractor,
      })

      useEffect(() => {
        colVirtualizer.measure()
      }, [columnSizes])

      useEffect(() => {
        rowVirtualizer.measure()
      }, [rowHeight])

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

        const dataRow = data[row.index]

        const rk = isStaticRow(dataRow)
          ? dataRow.key ?? row.index
          : typeof rowKey === 'function'
          ? rowKey({ rowIndex: row.index, rowData: dataRow })
          : ((dataRow[rowKey] ?? row.index) as string | number)

        colVirtualizer.getVirtualItems().forEach((col) => {
          const ck = columns[col.index].id ?? col.index
          const stickyLeft = stateRef.current.isStickyLeft(col.index)
          const stickyRight = stateRef.current.isStickyRight(col.index)
          const cursor = stateRef.current.cursor({
            rowData: dataRow,
            cell: { col: col.index, row: row.index },
            column: columns[col.index],
          });

          if (stickyRowData) {
            if (stickyLeft) {
              stickyRows[stickyRows.length - 1].stickyLeftCells.push(
                <div
                  key={`${ck}-${rk}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${col.start}px)`,
                  }}
                >
                  {cursor}
                  {col.index},{row.index}
                </div>
              )
            } else if (stickyRight) {
              stickyRows[stickyRows.length - 1].stickyRightCells.push(
                <div
                  key={`${ck}-${rk}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${
                      col.end - colVirtualizer.getTotalSize()
                    }px)`,
                  }}
                >
                  {cursor}
                  {col.index},{row.index}
                </div>
              )
            } else {
              stickyRows[stickyRows.length - 1].cells.push(
                <div
                  key={`${ck}-${rk}`}
                  className="dsg-cell-container"
                  style={{
                    width: col.size,
                    height: row.size,
                    transform: `translateX(${col.start}px)`,
                  }}
                >
                  {cursor}
                  {col.index},{row.index}
                </div>
              )
            }
          } else if (stickyLeft) {
            stickyLeftCells.push(
              <div
                key={`${ck}-${rk}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                }}
              >
                {cursor}
                {col.index},{row.index}
              </div>
            )
          } else if (stickyRight) {
            stickyRightCells.push(
              <div
                key={`${ck}-${rk}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${
                    col.end - colVirtualizer.getTotalSize()
                  }px) translateY(${row.start}px)`,
                }}
              >
                {cursor}
                {col.index},{row.index}
              </div>
            )
          } else {
            middleCells.push(
              <div
                key={`${ck}-${rk}`}
                className="dsg-cell-container"
                style={{
                  width: col.size,
                  height: row.size,
                  transform: `translateX(${col.start}px) translateY(${row.start}px)`,
                }}
              >
                {cursor}
                {col.index},{row.index}
              </div>
            )
          }
        })
      })

      return (
        <div className={className} style={style}>
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
