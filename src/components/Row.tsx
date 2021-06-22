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
    hasStickyRightColumn,
  }: RowProps<T>) => {
    console.log(data)

    // Used to detect first render
    const firstRenderRef = useRef(true)
    const firstRender = firstRenderRef.current
    firstRenderRef.current = false

    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender

    // When columnWidths or columnRights is not defined we render the light version
    if (renderLight) {
      return (
        <div className={cx('dsg-row', 'dsg-row-light')} style={style}>
          {columns.map((column, i) => (
            <div
              className={cx(
                'dsg-cell',
                i === 0 && 'dsg-cell-gutter',
                hasStickyRightColumn &&
                  i === columns.length - 1 &&
                  'dsg-cell-sticky-right',
                'dsg-cell-light'
              )}
              key={i}
              style={{
                flex: String(column.width),
                minWidth: column.minWidth,
                maxWidth: column.maxWidth,
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
            className={cx(
              'dsg-cell',
              i === 0 && 'dsg-cell-gutter',
              hasStickyRightColumn &&
                i === columns.length - 1 &&
                'dsg-cell-sticky-right'
            )}
            key={i}
            style={{
              flex: String(column.width),
              minWidth: column.minWidth,
              maxWidth: column.maxWidth,
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
      style={{
        ...style,
        width: data.contentWidth ? data.contentWidth : '100%',
      }}
      hasStickyRightColumn={data.hasStickyRightColumn}
      isScrolling={isScrolling}
    />
  )
}
