import * as React from 'react'
import { forwardRef, RefObject, useContext } from 'react'
import { DataSheetGridContext } from './DataSheetGridContext'
import s from './styles.css'

const buildSquare = (top, right, bottom, left) => {
  return [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
    [left, top],
  ]
}

const buildClipPath = (top, right, bottom, left) => {
  const values = [
    ...buildSquare(0, '100%', '100%', 0),
    ...buildSquare(top, right, bottom, left),
  ]

  return `polygon(evenodd, ${values
    .map((pair) =>
      pair
        .map((value) =>
          typeof value === 'number' && value !== 0 ? value + 'px' : value
        )
        .join(' ')
    )
    .join(',')})`
}

export const InnerContainer = forwardRef(
  ({ children, ...rest }, ref: RefObject<HTMLDivElement>) => {
    const {
      activeCell,
      columnWidths,
      rowHeight,
      headerRowHeight,
      selection,
      data,
      columns,
    } = useContext(DataSheetGridContext)

    const extraPixelV = (rowI: number): number => {
      return rowI < data.length - 1 ? 1 : 0
    }

    const extraPixelH = (colI: number): number => {
      return colI < columns.length - 2 ? 1 : 0
    }

    const activeCellRect = activeCell && {
      width: columnWidths[activeCell.col + 1] + extraPixelH(activeCell.col),
      height: rowHeight + extraPixelV(activeCell.row),
      left: columnWidths
        .slice(0, activeCell.col + 1)
        .reduce((a, b) => a + b, 0),
      top: rowHeight * activeCell.row + headerRowHeight,
    }

    const selectionRect = selection && {
      width: columnWidths
        .slice(selection.min.col + 1, selection.max.col + 2)
        .reduce((a, b) => a + b, extraPixelH(selection.max.col)),
      height:
        rowHeight * (selection.max.row - selection.min.row + 1) +
        extraPixelV(selection.max.row),
      left: columnWidths
        .slice(0, selection.min.col + 1)
        .reduce((a, b) => a + b, 0),
      top: rowHeight * selection.min.row + headerRowHeight,
    }

    return (
      <div ref={ref} {...rest}>
        {children}
        {activeCellRect && (
          <div className={s.dsgActiveCell} style={activeCellRect} />
        )}
        {selectionRect && activeCellRect && (
          <div
            className={s.dsgSelectionRect}
            style={{
              ...selectionRect,
              clipPath: buildClipPath(
                activeCellRect.top - selectionRect.top,
                activeCellRect.left - selectionRect.left,
                activeCellRect.top + activeCellRect.height - selectionRect.top,
                activeCellRect.left + activeCellRect.width - selectionRect.left,
              ),
            }}
          />
        )}
      </div>
    )
  }
)
