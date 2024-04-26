import React, { FC, useLayoutEffect, useRef, useState } from 'react'
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
  const { columnWidths, onColumnsResize, resizeCallback } =
    useColumnsWidthContext()
  const [prevWidth, setPrevWidth] = useState(width)

  const colWidth = useRef(width)

  useLayoutEffect(() => {
    setPrevWidth(width)
    colWidth.current = width
  }, [width])

  console.log(
    `cell ${index} width from props: ${width} and from context: ${columnWidths?.[index]} and from the state: ${colWidth.current}`
  )
  const ref = useResizeHandle({
    onDrag: (dx = 0) => {
      colWidth.current = prevWidth + dx
      resizeCallback?.(
        [...columnWidths].map((w, i) => (i === index ? colWidth.current : w))
      )
    },
    onDragEnd: (dx) => {
      setPrevWidth(() => {
        if (colWidth && dx) {
          return colWidth.current + dx
        }

        return prevWidth
      })

      onColumnsResize?.(
        columnWidths?.map((w, i) =>
          i === index ? colWidth.current : undefined
        ) ?? []
      )
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
      {resizable && <div className="dsg-resize-handle" ref={ref} />}
    </div>
  )
}
