import React, { FC, useLayoutEffect, useRef, useState } from 'react'
import cx from 'classnames'
import { useResizeHandle } from '../hooks/useResizeHandler'
import { throttle } from 'throttle-debounce'
import { useColumnWidthsContext } from '../hooks/useColumnsWidthContext'

export const MIN_COLUMN_WIDTH = 40

type CellProps = {
  id?: string
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
  return isHeader ? (
    <HeaderCell {...props} resizable={props.index !== 0} />
  ) : (
    <BodyCell {...props} />
  )
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

export const HeaderCell: FC<CellProps & { resizable?: boolean }> = ({
  id,
  index,
  children,
  gutter,
  stickyRight,
  active,
  disabled,
  className,
  width,
  left,
  resizable,
}) => {
  const {
    columnWidths,
    columnsMap,
    resizedColumnWidths,
    onColumnsResize,
    resizeCallback,
  } = useColumnWidthsContext()

  const [prevWidth, setPrevWidth] = useState(width)

  const colWidth = useRef(width)

  useLayoutEffect(() => {
    setPrevWidth(width)
    colWidth.current = width
  }, [width])

  const throttledOnDrag = throttle(50, (dx = 0) => {
    // prevent column collapse
    if (prevWidth + dx <= MIN_COLUMN_WIDTH) {
      return
    }

    colWidth.current = prevWidth + dx

    if (id) {
      resizeCallback?.(() => ({
        ...resizedColumnWidths,
        [id]: colWidth.current,
      }))
    }
  })

  const ref = useResizeHandle({
    onDrag: throttledOnDrag,
    onDragEnd: () => {
      if (id) {
        onColumnsResize?.({ ...resizedColumnWidths, [id]: colWidth.current })
      }
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
        width: colWidth.current ?? width,
        left: stickyRight ? undefined : left,
      }}
    >
      {children}
      {resizable && onColumnsResize && (
        <div className="dsg-resize-handle" ref={ref} />
      )}
    </div>
  )
}
