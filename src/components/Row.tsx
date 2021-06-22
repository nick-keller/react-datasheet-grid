import { areEqual, ListChildComponentProps } from 'react-window'
import { ListItemData, RowProps } from '../types'
import React, { useRef } from 'react'
import cx from 'classnames'

const RowComponent = React.memo(
  <T extends any>({
    index,
    style,
    data,
    isScrolling,
    columns,
    columnWidths,
    columnRights,
  }: RowProps<T>) => {
    console.log(data)

    const firstRenderRef = useRef(true)
    const firstRender = firstRenderRef.current
    firstRenderRef.current = false

    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender

    if (renderLight || !columnWidths || !columnRights) {
      return (
        <div className={cx('dsg-row', 'dsg-row-light')} style={style}>
          {columnWidths &&
            columnRights &&
            columns.map((column, i) => (
              <div
                className={cx('dsg-cell', 'dsg-cell-light')}
                key={i}
                style={{
                  width: i === columns.length - 1 ? undefined : columnWidths[i],
                  right: i === columns.length - 1 ? 0 : undefined,
                  left: columnRights[i - 1] ?? 0,
                }}
              />
            ))}
        </div>
      )
    }

    return (
      <div className="dsg-row" style={style}>
        {columns.map((column, i) => (
          <div
            className="dsg-cell"
            key={i}
            style={{
              width: i === columns.length - 1 ? undefined : columnWidths[i],
              right: i === columns.length - 1 ? 0 : undefined,
              left: columnRights[i - 1] ?? 0,
            }}
          />
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
  return (
    <RowComponent
      index={index}
      data={data.data[index]}
      columns={data.columns}
      columnWidths={data.columnWidths}
      columnRights={data.columnRights}
      style={{
        ...style,
        width: data.contentWidth ? data.contentWidth : undefined,
        right: data.contentWidth ? undefined : 0,
      }}
      isScrolling={isScrolling}
    />
  )
}
