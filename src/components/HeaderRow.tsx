import React, { useContext } from 'react'
import { HeaderContext } from '../contexts/HeaderContext'
import cx from 'classnames'
import { Cell } from './Cell'

export const HeaderRow = React.memo(() => {
  console.log('header')
  const { columns, contentWidth, height, hasStickyRightColumn } =
    useContext(HeaderContext)

  return (
    <div
      className={cx('dsg-row', 'dsg-row-header')}
      style={{
        width: contentWidth ? contentWidth : '100%',
        height,
      }}
    >
      {columns.map((column, i) => (
        <Cell
          key={i}
          gutter={i === 0}
          stickyRight={hasStickyRightColumn && i === columns.length - 1}
          column={column}
          className="dsg-cell-header"
        >
          {column.title}
        </Cell>
      ))}
    </div>
  )
})
