import * as React from 'react'
import { VariableSizeGrid } from 'react-window'
import { Cell } from './Cell'

import { useColumnWidths } from './useColumnWidths'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InnerContainer } from './InnerContainer'
import { DataSheetGridContext } from './DataSheetGridContext'
import s from './styles.css'
import { useGetBoundingRect } from './useGetBoundingRect'
import { useDocumentEventListener } from './useDocumentEventListener'

interface DataSheetGridProps {
  data: any[]
  columns: Column[]
  width: number
  height: number
  rowHeight?: number
  headerRowHeight?: number
}

export const DataSheetGrid = ({
  data,
  columns: rawColumns,
  width,
  height,
  rowHeight = 40,
  headerRowHeight = rowHeight,
}: DataSheetGridProps) => {
  // Add gutter column
  const columns: Column[] = [
    {
      width: '0 0 30px',
      title: <div className={s.dsgCornerIndicator} />,
      render: ({ rowIndex }) => rowIndex + 1,
    },
    ...rawColumns,
  ]
  const { widths: columnWidths, offsets: columnOffsets } = useColumnWidths(
    width,
    columns
  )
  const gridRef = useRef<VariableSizeGrid>(null)
  const containerRef = useRef<HTMLElement>(null)
  const getContainerBoundingRect = useGetBoundingRect(containerRef)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => gridRef.current?.resetAfterColumnIndex(0), columnWidths)

  const [focus, setFocus] = useState(false)
  const [activeCell, setActiveCell] = useState<Cell | null>(null)
  const [selectionCell, setSelectionCell] = useState<Cell | null>(null)

  const [selectionMode, setSelectionMode] = useState({
    columns: false,
    rows: false,
    active: false,
  })
  const selection = useMemo<{ min: Cell; max: Cell } | null>(
    () =>
      activeCell &&
      selectionCell && {
        min: {
          col: Math.min(activeCell.col, selectionCell?.col),
          row: Math.min(activeCell.row, selectionCell?.row),
        },
        max: {
          col: Math.max(activeCell.col, selectionCell?.col),
          row: Math.max(activeCell.row, selectionCell?.row),
        },
      },
    [activeCell, selectionCell]
  )

  const getCursorIndex = useCallback(
    (event: MouseEvent, force: boolean = false): Cell | null => {
      const boundingClientRect = getContainerBoundingRect(force)
      if (boundingClientRect) {
        const x = event.clientX - boundingClientRect.left

        return {
          col: columnOffsets.findIndex((right) => x < right) - 1,
          row: Math.min(
            data.length - 1,
            Math.max(
              -1,
              Math.floor(
                (event.clientY - boundingClientRect.top - headerRowHeight) /
                  rowHeight
              )
            )
          ),
        }
      }

      return null
    },
    [
      getContainerBoundingRect,
      columnOffsets,
      data.length,
      headerRowHeight,
      rowHeight,
    ]
  )

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (selectionMode.active) {
        const cursorIndex = getCursorIndex(event)

        setSelectionCell(
          cursorIndex && {
            col: selectionMode.columns
              ? Math.max(0, cursorIndex.col)
              : columns.length - 1,
            row: selectionMode.rows
              ? Math.max(0, cursorIndex.row)
              : data.length - 1,
          }
        )
      }
    },
    [getCursorIndex, selectionMode, columns.length, data.length]
  )
  useDocumentEventListener('mousemove', onMouseMove)

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      const clickInside =
        containerRef.current?.contains(event.target as Node) || false
      const cursorIndex = clickInside ? getCursorIndex(event, true) : null

      setFocus(clickInside)
      setActiveCell(
        cursorIndex && {
          col: Math.max(0, cursorIndex.col),
          row: Math.max(0, cursorIndex.row),
        }
      )

      if (cursorIndex) {
        setSelectionMode({
          columns: cursorIndex.col !== -1,
          rows: cursorIndex.row !== -1,
          active: true,
        })
      }

      setSelectionCell(
        cursorIndex?.col === -1 || cursorIndex?.row === -1
          ? {
              col:
                cursorIndex.col === -1 ? columns.length - 1 : cursorIndex.col,
              row: cursorIndex.row === -1 ? data.length - 1 : cursorIndex.row,
            }
          : null
      )
    },
    [columns.length, data.length, getCursorIndex]
  )
  useDocumentEventListener('mousedown', onMouseDown)

  const onMouseUp = useCallback(() => {
    setSelectionMode({
      columns: false,
      rows: false,
      active: false,
    })
  }, [])
  useDocumentEventListener('mouseup', onMouseUp)

  return (
    <DataSheetGridContext.Provider
      value={{
        focus,
        activeCell: activeCell,
        columnWidths,
        rowHeight,
        headerRowHeight,
        selection,
        columns,
        data,
      }}
    >
      <VariableSizeGrid
        ref={gridRef}
        innerRef={containerRef}
        width={width}
        columnCount={columns.length}
        columnWidth={(i) => columnWidths[i]}
        height={height}
        rowCount={data.length + 1}
        rowHeight={(i) => (i === 0 ? headerRowHeight : rowHeight)}
        estimatedRowHeight={rowHeight}
        style={{ userSelect: 'none', margin: 50 }}
        innerElementType={InnerContainer}
        children={Cell}
      />
    </DataSheetGridContext.Provider>
  )
}
