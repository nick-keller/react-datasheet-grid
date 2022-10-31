import { areEqual, ListChildComponentProps } from 'react-window'
import { Cell as CellType, ListItemData, RowProps } from '../types'
import React, { useCallback } from 'react'
import cx from 'classnames'
import { Cell } from './Cell'
import { useFirstRender } from '../hooks/useFirstRender'

const nullfunc = () => null

const RowComponent = React.memo(
  ({
    index,
    style,
    data,
    errorData,
    isScrolling,
    columns,
    hasStickyRightColumn,
    active,
    activeColIndex,
    editing,
    setRowData,
    deleteRows,
    insertRowAfter,
    duplicateRows,
    stopEditing,
    getContextMenuItems,
    rowClassName,
  }: RowProps<any>) => {
    const firstRender = useFirstRender()

    // True when we should render the light version (when we are scrolling)
    const renderLight = isScrolling && firstRender

    const setGivenRowData = useCallback(
      (rowData: any) => {
        setRowData(index, rowData)
      },
      [index, setRowData]
    )

    const deleteGivenRow = useCallback(() => {
      deleteRows(index)
    }, [deleteRows, index])

    const duplicateGivenRow = useCallback(() => {
      duplicateRows(index)
    }, [duplicateRows, index])

    const insertAfterGivenRow = useCallback(() => {
      insertRowAfter(index)
    }, [insertRowAfter, index])

    return (
      <div
        className={cx(
          'dsg-row',
          typeof rowClassName === 'string' ? rowClassName : null,
          typeof rowClassName === 'function'
            ? rowClassName({ rowData: data, rowIndex: index })
            : null
        )}
        style={style}
      >
        {columns.map((column, i) => {
          const Component = column.component

          const disabled =
            column.disabled === true ||
            (typeof column.disabled === 'function' &&
              column.disabled({ rowData: data, rowIndex: index }))

          const isCellInError = errorData?.find(
            (cell: CellType) => cell.col === i - 1 && cell.row === index
          )
          return (
            <Cell
              key={i}
              gutter={i === 0}
              disabled={disabled}
              stickyRight={hasStickyRightColumn && i === columns.length - 1}
              column={column}
              active={active}
              className={cx(
                !column.renderWhenScrolling && renderLight && 'dsg-cell-light',
                typeof column.cellClassName === 'function'
                  ? column.cellClassName({
                      rowData: data,
                      rowIndex: index,
                      columnId: column.id,
                    })
                  : column.cellClassName
              )}
              error={!!isCellInError}
            >
              {(column.renderWhenScrolling || !renderLight) && (
                <Component
                  rowData={data}
                  getContextMenuItems={getContextMenuItems}
                  disabled={disabled}
                  active={activeColIndex === i - 1}
                  columnIndex={i - 1}
                  rowIndex={index}
                  focus={activeColIndex === i - 1 && editing}
                  deleteRow={deleteGivenRow}
                  duplicateRow={duplicateGivenRow}
                  stopEditing={
                    activeColIndex === i - 1 && editing && stopEditing
                      ? stopEditing
                      : nullfunc
                  }
                  insertRowBelow={insertAfterGivenRow}
                  setRowData={setGivenRowData}
                  columnData={column.columnData}
                />
              )}
            </Cell>
          )
        })}
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

RowComponent.displayName = 'RowComponent'

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
      errorData={data.errorData}
      columns={data.columns}
      style={{
        ...style,
        width: data.contentWidth ? data.contentWidth : '100%',
      }}
      hasStickyRightColumn={data.hasStickyRightColumn}
      isScrolling={isScrolling}
      active={Boolean(
        index - 1 >= (data.selectionMinRow ?? Infinity) &&
          index - 1 <= (data.selectionMaxRow ?? -Infinity) &&
          data.activeCell
      )}
      activeColIndex={
        data.activeCell?.row === index - 1 ? data.activeCell.col : null
      }
      editing={Boolean(data.activeCell?.row === index - 1 && data.editing)}
      setRowData={data.setRowData}
      deleteRows={data.deleteRows}
      insertRowAfter={data.insertRowAfter}
      duplicateRows={data.duplicateRows}
      stopEditing={
        data.activeCell?.row === index - 1 && data.editing
          ? data.stopEditing
          : undefined
      }
      getContextMenuItems={data.getContextMenuItems}
      rowClassName={data.rowClassName}
    />
  )
}
