import * as React from 'react'
import cx from 'classnames'

import { ListChildComponentProps } from 'react-window'
import { useContext } from 'react'
import { DataSheetGridContext } from '../contexts/DataSheetGridContext'

export const Row = React.memo(
  ({ style, index: rowIndex }: ListChildComponentProps) => {
    const {
      innerWidth,
      selection,
      data,
      columns,
      activeCell,
      editing,
      onChange,
      isCellDisabled,
      onDoneEditing,
      columnWidths,
      columnOffsets,
      rowHeight,
      onInsertRowAfter,
      onDuplicateRows,
      onDeleteRows,
    } = useContext(DataSheetGridContext)

    const headerRow = rowIndex === 0

    if (headerRow) {
      return null
    }

    return (
      <div
        className={cx({
          'dsg-row': true,
        })}
        style={{ ...style, width: `${innerWidth}px` }}
      >
        {columnWidths.map((width, columnIndex) => {
          const gutterColumn = columnIndex === 0
          const active =
            activeCell?.col === columnIndex - 1 &&
            activeCell.row === rowIndex - 1

          const disabled = isCellDisabled({
            col: columnIndex - 1,
            row: rowIndex - 1,
          })

          return (
            <div
              key={columnIndex}
              className={cx({
                'dsg-cell': true,
                'dsg-cell-disabled': !headerRow && disabled,
                'dsg-cell-gutter': gutterColumn,
                'dsg-cell-last-column': columnIndex === columns.length - 1,
                'dsg-cell-last-row': rowIndex === data.length,
                'dsg-cell-gutter-active':
                  gutterColumn &&
                  (activeCell?.row === rowIndex - 1 ||
                    (selection &&
                      rowIndex >= selection.min.row + 1 &&
                      rowIndex <= selection.max.row + 1)),
              })}
              style={{
                width: `${width}px`,
                left: `${columnOffsets[columnIndex - 1] || 0}px`,
                height: `${rowHeight}px`,
                top: 0,
              }}
            >
              {columns[columnIndex].render({
                insertRowBelow: () => {
                  onInsertRowAfter(rowIndex - 1)
                },
                duplicateRow: () => {
                  onDuplicateRows(rowIndex - 1)
                },
                deleteRow: () => {
                  onDeleteRows(rowIndex - 1)
                },
                active,
                focus: active && editing,
                rowIndex: rowIndex - 1,
                rowData: data[rowIndex - 1],
                columnIndex: columnIndex - 1,
                done: onDoneEditing,
                disabled,
                setRowData: (rowData) =>
                  onChange([
                    ...data.slice(0, rowIndex - 1),
                    rowData,
                    ...data.slice(rowIndex),
                  ]),
              })}
            </div>
          )
        })}
      </div>
    )
  }
)
