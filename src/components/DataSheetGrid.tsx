import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
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
import { useDocumentEventListener } from '../hooks/useDocumentEventListener'
import { useGetBoundingClientRect } from '../hooks/useGetBoundingClientRect'
import { useRefObject } from '../hooks/useRefObject'

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
    const listRef = useRef<VariableSizeList>(null)
    const innerRef = useRef<HTMLElement>(null)
    const outerRef = useRef<HTMLElement>(null)

    useEffect(() => {
      listRef.current?.resetAfterIndex(0)
    }, [headerRowHeight, rowHeight])

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

    // True when the active cell is being edited
    const [editing, setEditing] = useState(false)

    // Highlighted cell, null when not focused
    const [activeCell, setActiveCell] = useDeepEqualState<Cell | null>(null)

    // The selection cell and the active cell are the two corners of the selection, null when nothing is selected
    const [selectionCell, setSelectionCell] = useDeepEqualState<Cell | null>(
      null
    )

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

    // Behavior of the selection when the user drags the mouse around
    const [selectionMode, setSelectionMode] = useState({
      // True when the position of the cursor should impact the columns of the selection
      columns: false,
      // True when the position of the cursor should impact the rows of the selection
      rows: false,
      // True when the user is dragging the mouse around to select
      active: false,
    })

    const getInnerBoundingClientRect = useGetBoundingClientRect(innerRef)
    const getOuterBoundingClientRect = useGetBoundingClientRect(outerRef)

    const _ = useRefObject({
      data,
      getInnerBoundingClientRect,
      getOuterBoundingClientRect,
      columnRights,
      columnWidths,
      headerRowHeight,
      rowHeight,
      hasStickyRightColumn: Boolean(stickyRightColumn),
    })

    // Extract the coordinates of the cursor from a mouse event
    const getCursorIndex = useCallback(
      (
        event: MouseEvent,
        force: boolean = false,
        includeSticky: boolean = false
      ): Cell | null => {
        const innerBoundingClientRect =
          _.current.getInnerBoundingClientRect(force)
        const outerBoundingClientRect =
          includeSticky && _.current.getOuterBoundingClientRect(force)

        if (
          innerBoundingClientRect &&
          _.current.columnRights &&
          _.current.columnWidths
        ) {
          let x = event.clientX - innerBoundingClientRect.left
          let y = event.clientY - innerBoundingClientRect.top

          if (outerBoundingClientRect) {
            if (
              event.clientY - outerBoundingClientRect.top <=
              _.current.headerRowHeight
            ) {
              y = 0
            }

            if (
              event.clientX - outerBoundingClientRect.left <=
              _.current.columnWidths[0]
            ) {
              x = 0
            }

            if (
              _.current.hasStickyRightColumn &&
              outerBoundingClientRect.right - event.clientX <=
                _.current.columnWidths[_.current.columnWidths.length - 1]
            ) {
              x = _.current.columnRights[_.current.columnRights.length - 2] + 1
            }
          }

          return {
            col: _.current.columnRights.findIndex((right) => x < right) - 1,
            row: Math.min(
              _.current.data.length - 1,
              Math.max(
                -1,
                Math.floor(
                  (y - _.current.headerRowHeight) / _.current.rowHeight
                )
              )
            ),
          }
        }

        return null
      },
      [_]
    )

    const onMouseDown = useCallback(
      (event: MouseEvent) => {
        const rightClick = event.button === 2
        const clickInside =
          innerRef.current?.contains(event.target as Node) || false

        const cursorIndex = clickInside
          ? getCursorIndex(event, true, true)
          : null
        console.log(cursorIndex)
      },
      [getCursorIndex]
    )
    useDocumentEventListener('mousedown', onMouseDown)

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
              ref={listRef}
              height={outerHeight}
              itemCount={data.length + 1}
              itemSize={(index) => (index === 0 ? headerRowHeight : rowHeight)}
              estimatedItemSize={rowHeight}
              itemData={{
                data,
                contentWidth: fullWidth ? undefined : contentWidth,
                columns,
                hasStickyRightColumn: Boolean(stickyRightColumn),
                activeCell,
                selectionMinRow: selection?.min.row ?? activeCell?.row,
                selectionMaxRow: selection?.max.row ?? activeCell?.row,
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
