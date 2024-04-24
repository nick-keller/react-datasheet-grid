import React, { FC, useState } from 'react'
import cx from 'classnames'
import { useResizeHandle } from '../hooks/useResizeHandler'
import { useColumnsWidthContext } from '../hooks/useColumnsWidthContext'

type CellProps = {
  index: number
  isHeader?: boolean
  gutter: boolean
  stickyRight: boolean
  disabled?: boolean
  className?: string
  active?: boolean
  children?: any
  width: number
  left: number
}

export const Cell: FC<CellProps> = ({ isHeader, ...props }) => {
  return isHeader ? <HeaderCell {...props} /> : <BodyCell {...props} />
}

export const BodyCell: FC<CellProps> = ({
  children,
  gutter,
  stickyRight,
  active,
  disabled,
  className,
  width,
  left,
}) => {
  return (
    <div
      className={cx(
        'dsg-cell',
        gutter && 'dsg-cell-gutter',
        disabled && 'dsg-cell-disabled',
        gutter && active && 'dsg-cell-gutter-active',
        stickyRight && 'dsg-cell-sticky-right',
        className
      )}
      style={{
        width,
        left: stickyRight ? undefined : left,
      }}
    >
      {children}
    </div>
  )
}

export const HeaderCell: FC<CellProps> = ({
  index,
  children,
  gutter,
  stickyRight,
  active,
  disabled,
  className,
  width,
  left,
}) => {
  const { columnWidths, onColumnsResize } = useColumnsWidthContext()
  const [prevWidth, setPrevWidth] = useState(width)
  const [colWidth, setColWidth] = useState(width)

  console.log('columnWidths', columnWidths, 'index', index)
  const ref = useResizeHandle({
    onDrag: (dx = 0) => {
      setColWidth(prevWidth + dx)
      onColumnsResize?.(
        columnWidths?.map((w, i) => (i === 0 ? w + dx : w)) ?? []
      )
    },
    onDragEnd: (dx) => {
      setPrevWidth(() => {
        if (colWidth && dx) {
          return colWidth + dx
        }

        return prevWidth
      })
    },
  })
  return (
    <div
      className={cx(
        'dsg-cell',
        gutter && 'dsg-cell-gutter',
        disabled && 'dsg-cell-disabled',
        gutter && active && 'dsg-cell-gutter-active',
        stickyRight && 'dsg-cell-sticky-right',
        className
      )}
      style={{
        width: colWidth ?? width,
        left: stickyRight ? undefined : left,
      }}
    >
      {children}
      <div className="dsg-resize-handle" ref={ref} />
    </div>
  )
}
