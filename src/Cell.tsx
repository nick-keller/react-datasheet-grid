import * as React from 'react'
import s from './styles.css'
import cx from 'classnames'

import { GridChildComponentProps } from 'react-window'
import { useContext } from 'react'
import { DataSheetGridContext } from './DataSheetGridContext'

export const Cell = ({
  style,
  columnIndex,
  rowIndex,
}: GridChildComponentProps) => {
  const { selection, data, columns, activeCell } = useContext(
    DataSheetGridContext
  )

  return (
    <div
      className={cx({
        [`dsgCol${columnIndex - 1}`]: columnIndex > 0,
        [`dsgCol${columnIndex - columns.length}`]: columnIndex > 0,
        [`dsgRow${rowIndex - 1}`]: rowIndex > 0,
        [`dsgRow${rowIndex - data.length}`]: rowIndex > 0,
        [s.dsgCell]: true,
        [s.dsgCellHeader]: rowIndex === 0,
        [s.dsgCellGutter]: columnIndex === 0,
        [s.dsgCellHeaderActive]:
          rowIndex === 0 &&
          (activeCell?.col === columnIndex - 1 ||
            (selection &&
              columnIndex >= selection.min.col + 1 &&
              columnIndex <= selection.max.col + 1)),
        [s.dsgCellGutterActive]:
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
            active:
              activeCell?.col === columnIndex - 1 &&
              activeCell.row === rowIndex - 1,
            focus: false,
            rowIndex: rowIndex - 1,
            rowData: data[rowIndex - 1],
          })}
    </div>
  )
}
