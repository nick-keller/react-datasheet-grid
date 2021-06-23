import React, { FC } from 'react'
import cx from 'classnames'
import { Column } from '../types'

export const Cell: FC<{
  gutter: boolean
  stickyRight: boolean
  column: Column<unknown>
  className: string
}> = ({ children, gutter, stickyRight, column, className }) => {
  return (
    <div
      className={cx(
        'dsg-cell',
        gutter && 'dsg-cell-gutter',
        stickyRight && 'dsg-cell-sticky-right',
        className
      )}
      style={{
        flex: String(column.width),
        minWidth: column.minWidth,
        maxWidth: column.maxWidth,
      }}
    >
      {children}
    </div>
  )
}
