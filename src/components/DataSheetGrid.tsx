import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Column, DataSheetGridProps } from '../types'
import { FixedSizeList } from 'react-window'
import '../style.css'
import { Row } from './Row'
import { useColumnWidths } from '../hooks/useColumnWidths'
import { useResizeDetector } from 'react-resize-detector'

export const DataSheetGrid = React.memo(
  <T extends any>({
    data = [],
    height: outerHeight = 400,
    onChange = () => null,
    columns: rawColumns = [],
    rowHeight = 40,
    headerRowHeight = rowHeight,
    gutterColumnWidth = '0 0 40px',
  }: DataSheetGridProps<T>): JSX.Element => {
    console.log('render DataSheetGrid')

    // Add gutter column and default values
    const columns = useMemo<Column<T>[]>(
      () =>
        [
          {
            width: gutterColumnWidth,
            minWidth: 0,
            title: <div className="dsg-corner-indicator" />,
            // render: renderGutterColumn,
          },
          ...rawColumns,
        ].map((column) => ({
          width: 1,
          minWidth: 100,
          // render: () => null,
          // disableKeys: false,
          // disabled: false,
          // keepFocus: false,
          // deleteValue: ({ rowData }) => rowData,
          // copyValue: () => null,
          // pasteValue: ({ rowData }) => rowData,
          ...column,
        })),
      [gutterColumnWidth, rawColumns]
    )

    const innerRef = useRef<HTMLElement>(null)
    const outerRef = useRef<HTMLElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

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

    return (
      <div ref={containerRef}>
        <FixedSizeList
          width="100%"
          height={outerHeight}
          itemCount={data.length}
          itemSize={rowHeight}
          itemData={{
            data,
            contentWidth: fullWidth ? undefined : contentWidth,
            columns,
            columnWidths,
            columnRights,
          }}
          outerRef={outerRef}
          innerRef={innerRef}
          children={Row}
          useIsScrolling
        />
      </div>
    )
  }
) as <T extends any>(props: DataSheetGridProps<T>) => JSX.Element
