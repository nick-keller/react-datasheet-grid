import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Column, DataSheetGridProps, HeaderContextType } from '../types'
import { VariableSizeList } from 'react-window'
import '../style.css'
import { Row } from './Row'
import { useColumnWidths } from '../hooks/useColumnWidths'
import { useResizeDetector } from 'react-resize-detector'
import { InnerContainer } from './InnerContainer'
import { HeaderContext } from '../contexts/HeaderContext'

export const DataSheetGrid = React.memo(
  <T extends any>({
    data = [],
    height: outerHeight = 400,
    onChange = () => null,
    columns: rawColumns = [],
    rowHeight = 40,
    headerRowHeight = rowHeight,
    gutterColumn,
    stickyRightColumn,
  }: DataSheetGridProps<T>): JSX.Element => {
    console.log('render DataSheetGrid')

    // Add gutter column and default values
    const columns = useMemo<Column<T>[]>(() => {
      const partialColumns: Partial<Column<T>>[] = [
        {
          width: '0 0 40px',
          minWidth: 0,
          title: <div className="dsg-corner-indicator" />,
          ...gutterColumn,
          // render: renderGutterColumn,
        },
        ...rawColumns,
        ...(stickyRightColumn
          ? [
              {
                width: '0 0 40px',
                minWidth: 0,
                ...stickyRightColumn,
              },
            ]
          : []),
      ]

      return partialColumns.map<Column<T>>((column) => ({
        width: 1,
        minWidth: 100,
        renderWhenScrolling: true,
        // render: () => null,
        // disableKeys: false,
        // disabled: false,
        // keepFocus: false,
        // deleteValue: ({ rowData }) => rowData,
        // copyValue: () => null,
        // pasteValue: ({ rowData }) => rowData,
        ...column,
      }))
    }, [gutterColumn, stickyRightColumn, rawColumns])

    const innerRef = useRef<HTMLElement>(null)
    const outerRef = useRef<HTMLElement>(null)

    // Outer width (including borders) of the outer container
    const { width, height } = useResizeDetector({
      targetRef: outerRef,
      refreshMode: 'throttle',
      refreshRate: 100,
    })

    const {
      fullWidth,
      totalWidth: contentWidth,
      columnWidths,
      columnRights,
    } = useColumnWidths(columns, width)

    const headerContext = useMemo<HeaderContextType<T>>(
      () => ({
        hasStickyRightColumn: Boolean(stickyRightColumn),
        height: headerRowHeight,
        contentWidth: fullWidth ? undefined : contentWidth,
        columns,
      }),
      [
        Boolean(stickyRightColumn),
        headerRowHeight,
        columns,
        fullWidth ? undefined : contentWidth,
      ]
    )

    return (
      <div>
        <HeaderContext.Provider value={headerContext}>
          <VariableSizeList
            className="dsg-container"
            width="100%"
            height={outerHeight}
            itemCount={data.length + 1}
            itemSize={(index) => (index === 0 ? headerRowHeight : rowHeight)}
            estimatedItemSize={rowHeight}
            itemData={{
              data,
              contentWidth: fullWidth ? undefined : contentWidth,
              columns,
              hasStickyRightColumn: Boolean(stickyRightColumn),
            }}
            outerRef={outerRef}
            innerRef={innerRef}
            innerElementType={InnerContainer}
            children={Row}
            useIsScrolling
          />
        </HeaderContext.Provider>
      </div>
    )
  }
) as <T extends any>(props: DataSheetGridProps<T>) => JSX.Element
