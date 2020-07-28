import * as React from 'react'
import cx from 'classnames'

import { GridChildComponentProps } from 'react-window'
import { useContext } from 'react'
import { DataSheetGridContext } from './DataSheetGridContext'

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
  } = useContext(DataSheetGridContext)

  const active =
    activeCell?.col === columnIndex - 1 && activeCell.row === rowIndex - 1

  return (
    <div
      className={cx({
        'dsg-cell': true,
        'dsg-cell-disabled':
          rowIndex !== 0 &&
          isCellDisabled({ col: columnIndex - 1, row: rowIndex - 1 }),
        'dsg-cell-header': rowIndex === 0,
        'dsg-cell-gutter': columnIndex === 0,
        'dsg-cell-header-active':
          rowIndex === 0 &&
          (activeCell?.col === columnIndex - 1 ||
            (selection &&
              columnIndex >= selection.min.col + 1 &&
              columnIndex <= selection.max.col + 1)),
        'dsg-cell-gutter-active':
          columnIndex === 0 &&
          (activeCell?.row === rowIndex - 1 ||
            (selection &&
              rowIndex >= selection.min.row + 1 &&
              rowIndex <= selection.max.row + 1)),
      })}
      style={style}
    >
      {rowIndex === 0
        ? columns[columnIndex].title
        : columns[columnIndex].render({
            active,
            focus: active && editing,
            rowIndex: rowIndex - 1,
            rowData: data[rowIndex - 1],
            columnIndex: columnIndex - 1,
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
