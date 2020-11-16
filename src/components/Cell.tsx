import * as React from 'react'
import cx from 'classnames'

import { GridChildComponentProps } from 'react-window'
import { useContext } from 'react'
import { DataSheetGridContext } from '../contexts/DataSheetGridContext'

export const Cell = ({
  style,
  columnIndex,
  rowIndex,
}: GridChildComponentProps) => {
  const {
    selection,
    data,
    columns,
    activeCell,
    editing,
    onChange,
    isCellDisabled,
    onDoneEditing,
  } = useContext(DataSheetGridContext)

  const active =
    activeCell?.col === columnIndex - 1 && activeCell.row === rowIndex - 1

  const headerRow = rowIndex === 0
  const gutterColumn = columnIndex === 0

  return (
    <div
      className={cx({
        'dsg-cell': true,
        'dsg-cell-disabled':
          !headerRow &&
          isCellDisabled({ col: columnIndex - 1, row: rowIndex - 1 }),
        'dsg-cell-header': headerRow,
        'dsg-cell-gutter': gutterColumn,
        'dsg-cell-header-active':
          headerRow &&
          (activeCell?.col === columnIndex - 1 ||
            (selection &&
              columnIndex >= selection.min.col + 1 &&
              columnIndex <= selection.max.col + 1)),
        'dsg-cell-gutter-active':
          gutterColumn &&
          (activeCell?.row === rowIndex - 1 ||
            (selection &&
              rowIndex >= selection.min.row + 1 &&
              rowIndex <= selection.max.row + 1)),
      })}
      style={style}
    >
      {headerRow
        ? columns[columnIndex].title
        : columns[columnIndex].render({
            active,
            focus: active && editing,
            rowIndex: rowIndex - 1,
            rowData: data[rowIndex - 1],
            columnIndex: columnIndex - 1,
            onDoneEditing,
            setRowData: (rowData) =>
              onChange([
                ...data.slice(0, rowIndex - 1),
                rowData,
                ...data.slice(rowIndex),
              ]),
          })}
    </div>
  )
}
