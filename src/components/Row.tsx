import { areEqual, ListChildComponentProps } from 'react-window'
import { ListItemData, RowProps } from '../types'
import React, { useRef } from 'react'
import cx from 'classnames'
import { Cell } from './Cell'
import { useFirstRender } from '../hooks/useFirstRender'

const RowComponent = React.memo(
  <T extends any>({
    index,
    style,
    data,
    isScrolling,
    columns,
    hasStickyRightColumn,
    active,
  }: RowProps<T>) => {
    console.log(data)

    const firstRender = useFirstRender()

    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender

    return (
      <div className="dsg-row" style={style}>
        {columns.map((column, i) => (
          <Cell
            key={i}
            gutter={i === 0}
            stickyRight={hasStickyRightColumn && i === columns.length - 1}
            column={column}
            active={active}
            className={cx(
              !column.renderWhenScrolling && renderLight && 'dsg-cell-light'
            )}
          >
            {(column.renderWhenScrolling || !renderLight) && (data as string)}
          </Cell>
        ))}
      </div>
    )
  },
  (prevProps, nextProps) => {
    const { isScrolling: prevIsScrolling, ...prevRest } = prevProps
    const { isScrolling: nextIsScrolling, ...nextRest } = nextProps

    // When we are scrolling always re-use previous render, otherwise check props
    return nextIsScrolling || (!prevIsScrolling && areEqual(prevRest, nextRest))
  }
)

export const Row = <T extends any>({
  index,
  style,
  data,
  isScrolling,
}: ListChildComponentProps<ListItemData<T>>) => {
  // Do not render header row, it is rendered by the InnerContainer
  if (index === 0) {
    return null
  }

  return (
    <RowComponent
      index={index - 1}
      data={data.data[index - 1]}
      columns={data.columns}
      style={{
        ...style,
        width: data.contentWidth ? data.contentWidth : '100%',
      }}
      hasStickyRightColumn={data.hasStickyRightColumn}
      isScrolling={isScrolling}
      active={
        index - 1 >= (data.selectionMinRow ?? Infinity) &&
        index - 1 <= (data.selectionMaxRow ?? -Infinity)
      }
    />
  )
}
