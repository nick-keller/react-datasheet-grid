import React, { useMemo, useRef, useState } from 'react'
import {
  Cell,
  DataSheetGridProps,
  HeaderContextType,
  Selection,
  SelectionContextType,
} from '../types'
import { VariableSizeList } from 'react-window'
import '../style.css'
import { Row } from './Row'
import { useColumnWidths } from '../hooks/useColumnWidths'
import { useResizeDetector } from 'react-resize-detector'
import { InnerContainer } from './InnerContainer'
import { HeaderContext } from '../contexts/HeaderContext'
import { useColumns } from '../hooks/useColumns'
import { useMemoObject } from '../hooks/useMemoObject'
import { SelectionContext } from '../contexts/SelectionContext'
import { useEdges } from '../hooks/useEdges'
import { useDeepEqualState } from '../hooks/useDeepEqualState'

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

    const columns = useColumns(rawColumns, gutterColumn, stickyRightColumn)
    const innerRef = useRef<HTMLElement>(null)
    const outerRef = useRef<HTMLElement>(null)

    // Width and height of the scrollable area
    const { width, height } = useResizeDetector({
      targetRef: outerRef,
      refreshMode: 'throttle',
      refreshRate: 100,
    })

    const edges = useEdges(outerRef, width, height)

    const {
      fullWidth,
      totalWidth: contentWidth,
      columnWidths,
      columnRights,
    } = useColumnWidths(columns, width)

    // Highlighted cell, null when not focused
    const [activeCell, setActiveCell] = useDeepEqualState<Cell | null>({
      col: 1,
      row: 1,
    })

    // The selection cell and the active cell are the two corners of the selection, null when nothing is selected
    const [selectionCell, setSelectionCell] = useDeepEqualState<Cell | null>({
      col: 2,
      row: 5,
    })

    // Min and max of the current selection (rectangle defined by the active cell and the selection cell), null when nothing is selected
    const selection = useMemo<Selection | null>(
      () =>
        activeCell &&
        selectionCell && {
          min: {
            col: Math.min(activeCell.col, selectionCell.col),
            row: Math.min(activeCell.row, selectionCell.row),
          },
          max: {
            col: Math.max(activeCell.col, selectionCell.col),
            row: Math.max(activeCell.row, selectionCell.row),
          },
        },
      [activeCell, selectionCell]
    )

    const headerContext = useMemoObject<HeaderContextType<T>>({
      hasStickyRightColumn: Boolean(stickyRightColumn),
      height: headerRowHeight,
      contentWidth: fullWidth ? undefined : contentWidth,
      columns,
      activeColMin: selection?.min.col ?? activeCell?.col,
      activeColMax: selection?.max.col ?? activeCell?.col,
    })

    const selectionContext = useMemoObject<SelectionContextType>({
      columnRights,
      columnWidths,
      activeCell,
      selection,
      headerRowHeight,
      rowHeight,
      hasStickyRightColumn: Boolean(stickyRightColumn),
      dataLength: data.length,
      viewHeight: height,
      viewWidth: width,
      contentWidth: fullWidth ? undefined : contentWidth,
      edges,
    })

    return (
      <div>
        <HeaderContext.Provider value={headerContext}>
          <SelectionContext.Provider value={selectionContext}>
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
                selection,
                activeCell,
              }}
              outerRef={outerRef}
              innerRef={innerRef}
              innerElementType={InnerContainer}
              children={Row}
              useIsScrolling={columns.some(
                ({ renderWhenScrolling }) => !renderWhenScrolling
              )}
            />
          </SelectionContext.Provider>
        </HeaderContext.Provider>
      </div>
    )
  }
) as <T extends any>(props: DataSheetGridProps<T>) => JSX.Element
