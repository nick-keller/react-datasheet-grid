import React, { FC } from 'react'
import cx from 'classnames'
import { Column } from '../types'

export const Cell: FC<{
  gutter: boolean
  stickyRight: boolean
  disabled?: boolean
  column: Column<any, any, any>
  className: string
  active?: boolean
  children?: any
}> = ({
  children,
  gutter,
  stickyRight,
  column,
  active,
  disabled,
  className,
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
        flexBasis: column.basis,
        flexGrow: column.grow,
        flexShrink: column.shrink,
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
    >
      {children}
    </div>
  )
}
