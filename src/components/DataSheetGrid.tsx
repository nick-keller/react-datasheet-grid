import * as React from 'react'
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { VariableSizeList } from 'react-window'
import { Row as RowComponent } from './Row'

import { useColumnWidths } from '../hooks/useColumnWidths'
import { InnerContainer } from './InnerContainer'
import { DataSheetGridContext } from '../contexts/DataSheetGridContext'
import { useGetBoundingRect } from '../hooks/useGetBoundingRect'
import { useDocumentEventListener } from '../hooks/useDocumentEventListener'
import deepEqual from 'fast-deep-equal'
import {
  Cell,
  Column,
  ContextMenuItem,
  DataSheetGridProps,
  GridContext,
} from '../typings'
import useResizeObserver from '@react-hook/resize-observer'
import { useScrollbarWidth } from '../hooks/useScrollbarWidth'
import { AddRowsCounter } from './AddRowsCounter'
import { ContextMenu } from './ContextMenu'

const DEFAULT_DATA = []
const DEFAULT_COLUMNS = []
const DEFAULT_CREATE_ROW = () => ({})
const DEFAULT_ON_CHANGE = () => null
const DEFAULT_DUPLICATE_ROW = ({ rowData }) => ({ ...rowData })
const DEFAULT_IS_ROW_EMPTY = ({ rowData }) =>
  Object.values(rowData).every((value) => !value)

function setStateDeepEqual<T>(newValue: T | ((old: T) => T)) {
  return (oldValue: T): T => {
    const newVal =
      // @ts-ignore
      typeof newValue === 'function' ? newValue(oldValue) : newValue
    return deepEqual(oldValue, newVal) ? oldValue : newVal
  }
}

export function DataSheetGrid<TRow = any>({
  data = DEFAULT_DATA,
  onChange = DEFAULT_ON_CHANGE,
  columns: rawColumns = DEFAULT_COLUMNS,
  height = 400,
  rowHeight = 40,
  headerRowHeight = rowHeight,
  gutterColumnWidth = '0 0 40px',
  createRow = DEFAULT_CREATE_ROW as () => TRow,
  duplicateRow = DEFAULT_DUPLICATE_ROW,
  isRowEmpty = DEFAULT_IS_ROW_EMPTY,
  counterComponent = AddRowsCounter,
  contextMenuComponent = ContextMenu,
  autoAddRow = false,
  lockRows = false,
  disableContextMenu: disableContextMenuRaw = false,
}: DataSheetGridProps<TRow>) {
  const disableContextMenu = disableContextMenuRaw || lockRows

  // Add gutter column
  const columns = useMemo<Column[]>(
    () =>
      [
        {
          width: gutterColumnWidth,
          minWidth: 0,
          title: <div className='dsg-corner-indicator' />,
          render: ({ rowIndex }) => rowIndex + 1,
        },
        ...rawColumns,
      ].map((column) => ({
        width: 1,
        minWidth: 100,
        render: () => null,
        disableKeys: false,
        disabled: false,
        keepFocus: false,
        deleteValue: ({ rowData }) => rowData,
        copyValue: () => null,
        pasteValue: ({ rowData }) => rowData,
        ...column,
      })),
    [gutterColumnWidth, rawColumns]
  )

  // Outer width (including borders) of the outer container
  const [width, setWidth] = useState<number>(0)

  // Height of all rows (including header row)
  const innerHeight = headerRowHeight + rowHeight * data.length

  // True when the vertical scrollbar is visible
  const verticalScrollBar = height < innerHeight

  const {
    widths: columnWidths,
    offsets: columnOffsets,
    innerWidth,
  } = useColumnWidths(width - 1, columns, verticalScrollBar)

  // True when the horizontal scrollbar is visible
  const horizontalScrollBar = (innerWidth || 0) >= width

  const scrollbarWidth = useScrollbarWidth() || 0

  const listRef = useRef<VariableSizeList>(null)
  const containerRef = useRef<HTMLElement>(null)
  const outsideContainerRef = useRef<HTMLDivElement>(null)
  const getContainerBoundingRect = useGetBoundingRect(containerRef)

  // Recompute the width as outside container is resized
  useLayoutEffect(() => {
    setWidth(
      (w) => outsideContainerRef.current?.getBoundingClientRect().width || w
    )
  }, [])
  useResizeObserver(outsideContainerRef, (entry) =>
    setWidth(entry.contentRect.width)
  )

  // True when the active cell is being edited
  const [editing, setEditing] = useState(false)

  // x,y coordinates of the right click
  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
  } | null>(null)

  // Items of the context menu
  const [contextMenuItems, setContextMenuItems] = useState<ContextMenuItem[]>(
    []
  )

  // Highlighted cell, null when not focused
  const [activeCell, setActiveCell] = useState<Cell | null>(null)

  // The selection cell and the active cell are the two corners of the selection, null when nothing is selected
  const [selectionCell, setSelectionCell] = useState<Cell | null>(null)

  // Behavior of the selection when the user drags the mouse around
  const [selectionMode, setSelectionMode] = useState({
    // True when the position of the cursor should impact the columns of the selection
    columns: false,
    // True when the position of the cursor should impact the rows of the selection
    rows: false,
    // True when the user is dragging the mouse around to select
    active: false,
  })

  // Min and max of the current selection (rectangle defined by the active cell and the selection cell), null when nothing is selected
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

  // Scroll to any given cell making sure it is in view
  const scrollTo = useCallback(
    (cell: Cell) => {
      // Align top
      const topMax = cell.row * rowHeight
      // Align bottom
      const topMin =
        (cell.row + 1) * rowHeight +
        headerRowHeight -
        (listRef.current?.props.height as number) +
        1
      // @ts-ignore
      const scrollTop = listRef.current?.state.scrollOffset as number

      if (scrollTop > topMax) {
        listRef.current?.scrollTo(topMax)
      } else if (scrollTop < topMin) {
        listRef.current?.scrollTo(topMin)
      }

      if (columnOffsets && columnWidths) {
        // Align left
        const leftMax = columnOffsets[cell.col] - columnOffsets[0]
        // Align right
        const leftMin =
          columnOffsets[cell.col] + columnWidths[cell.col + 1] - width + 1

        // @ts-ignore
        const outerRef = listRef.current?._outerRef as HTMLElement
        const scrollLeft = outerRef.scrollLeft

        if (scrollLeft > leftMax) {
          outerRef.scrollLeft = leftMax
        } else if (scrollLeft < leftMin) {
          outerRef.scrollLeft = leftMin
        }
      }
    },
    [rowHeight, headerRowHeight, columnOffsets, width, columnWidths]
  )

  // Scroll to the selectionCell cell when it changes
  useEffect(() => {
    if (selectionCell) {
      scrollTo(selectionCell)
    }
  }, [selectionCell, scrollTo])

  // Scroll to the active cell when it changes
  useEffect(() => {
    if (activeCell) {
      scrollTo(activeCell)
    }
  }, [activeCell, scrollTo])

  // Blur any element on focusing the grid
  useEffect(() => {
    if (activeCell !== null) {
      ;(document.activeElement as HTMLElement).blur()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCell !== null])

  // Extract the coordinates of the cursor from a mouse event
  const getCursorIndex = useCallback(
    (event: MouseEvent, force: boolean = false): Cell | null => {
      const boundingClientRect = getContainerBoundingRect(force)
      const outsideBoundingClientRect =
        force && outsideContainerRef.current?.getBoundingClientRect()

      if (boundingClientRect && columnOffsets) {
        let x = event.clientX - boundingClientRect.left
        let y = event.clientY - boundingClientRect.top

        if (outsideBoundingClientRect) {
          if (
            event.clientY - outsideBoundingClientRect.top <=
            headerRowHeight
          ) {
            y = 0
          }
          if (
            event.clientX - outsideBoundingClientRect.left <=
            columnOffsets[0]
          ) {
            x = 0
          }
        }

        return {
          col: columnOffsets.findIndex((right) => x < right) - 1,
          row: Math.min(
            data.length - 1,
            Math.max(-1, Math.floor((y - headerRowHeight) / rowHeight))
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

  const isCellDisabled = useCallback(
    (cell: Cell): boolean => {
      const disabled = columns[cell.col + 1].disabled

      return Boolean(
        typeof disabled === 'function'
          ? disabled({ rowData: data[cell.row] })
          : disabled
      )
    },
    [columns, data]
  )

  const onInsertRowAfter = useCallback(
    (row: number, count = 1) => {
      if (!createRow) {
        return
      }
      setSelectionCell(null)
      setEditing(false)

      if (lockRows) {
        return
      }

      onChange([
        ...data.slice(0, row + 1),
        ...new Array(count).fill(0).map(createRow),
        ...data.slice(row + 1),
      ])
      setActiveCell(
        setStateDeepEqual((a) => ({ col: a?.col || 0, row: row + count }))
      )
    },
    [createRow, data, lockRows, onChange]
  )

  const onDoneEditing = useCallback(
    ({ nextRow = true } = {}) => {
      if (activeCell?.row === data.length - 1) {
        if (nextRow && autoAddRow) {
          onInsertRowAfter(activeCell.row)
        } else {
          setEditing(false)
        }
      } else {
        setEditing(false)

        if (nextRow) {
          setActiveCell(setStateDeepEqual((a) => a && { ...a, row: a.row + 1 }))
        }
      }
    },
    [activeCell, autoAddRow, data.length, onInsertRowAfter]
  )

  const onDuplicateRows = useCallback(
    (rowMin, rowMax = rowMin) => {
      if (lockRows) {
        return
      }

      onChange([
        ...data.slice(0, rowMax + 1),
        ...data
          .slice(rowMin, rowMax + 1)
          .map((rowData) => duplicateRow({ rowData })),
        ...data.slice(rowMax + 1),
      ])
      setActiveCell(
        setStateDeepEqual<Cell | null>({ col: 0, row: rowMax + 1 })
      )
      setSelectionCell(
        setStateDeepEqual<Cell | null>({
          col: columns.length - 2,
          row: 2 * rowMax - rowMin + 1,
        })
      )
      setEditing(false)
    },
    [columns.length, data, duplicateRow, lockRows, onChange]
  )

  const onDeleteRows = useCallback(
    (rowMin, rowMax = rowMin) => {
      if (lockRows) {
        return
      }

      setEditing(false)
      setActiveCell(
        setStateDeepEqual((a) => {
          const row = Math.min(data.length - 2 - rowMax + rowMin, rowMin)

          if (row < 0) {
            return null
          }

          return a && { ...a, row }
        })
      )
      setSelectionCell(null)
      onChange([...data.slice(0, rowMin), ...data.slice(rowMax + 1)])
    },
    [data, lockRows, onChange]
  )

  const onDelete = useCallback(() => {
    if (!activeCell) {
      return
    }

    const min: Cell = selection?.min || activeCell
    const max: Cell = selection?.max || activeCell

    if (
      data
        .slice(min.row, max.row + 1)
        .every((rowData) => isRowEmpty({ rowData }))
    ) {
      onDeleteRows(min.row, max.row)
      return
    }

    const newData = [...data]

    for (let row = min.row; row <= max.row; ++row) {
      for (let col = min.col; col <= max.col; ++col) {
        if (!isCellDisabled({ col, row })) {
          const { deleteValue = ({ rowData }) => rowData } = columns[col + 1]
          newData[row] = deleteValue({ rowData: newData[row] })
        }
      }
    }

    if (deepEqual(newData, data)) {
      setActiveCell(
        setStateDeepEqual<Cell | null>({ col: 0, row: min.row })
      )
      setSelectionCell(
        setStateDeepEqual<Cell | null>({
          col: columns.length - 2,
          row: max.row,
        })
      )
      return
    }

    onChange(newData)
  }, [
    activeCell,
    columns,
    data,
    isCellDisabled,
    isRowEmpty,
    onChange,
    onDeleteRows,
    selection,
  ])

  const onCopy = useCallback(
    (event: ClipboardEvent) => {
      if (!editing && activeCell) {
        const copyData: Array<Array<number | string | null>> = []

        const min: Cell = selection?.min || activeCell
        const max: Cell = selection?.max || activeCell

        for (let row = min.row; row <= max.row; ++row) {
          copyData.push([])

          for (let col = min.col; col <= max.col; ++col) {
            const { copyValue = () => null } = columns[col + 1]
            copyData[row - min.row].push(copyValue({ rowData: data[row] }))
          }
        }

        event.clipboardData?.setData(
          'text/plain',
          copyData.map((row) => row.join('\t')).join('\n')
        )
        event.preventDefault()
      }
    },
    [activeCell, columns, data, editing, selection]
  )
  useDocumentEventListener('copy', onCopy)

  const onCut = useCallback(
    (event: ClipboardEvent) => {
      if (!editing && activeCell) {
        onCopy(event)
        onDelete()
        event.preventDefault()
      }
    },
    [activeCell, editing, onCopy, onDelete]
  )
  useDocumentEventListener('cut', onCut)

  const onPaste = useCallback(
    async (event: ClipboardEvent) => {
      if (!editing && activeCell) {
        const pasteData =
          event.clipboardData
            ?.getData('text')
            .replace(/\r/g, '')
            .split('\n')
            .map((row) => row.split('\t')) || []

        const min: Cell = selection?.min || activeCell
        const max: Cell = selection?.max || activeCell

        // Paste single row
        if (pasteData.length === 1) {
          const newData = [...data]

          for (
            let columnIndex = 0;
            columnIndex < pasteData[0].length;
            columnIndex++
          ) {
            const pasteValue = columns[min.col + columnIndex + 1]?.pasteValue

            if (pasteValue) {
              for (let rowIndex = min.row; rowIndex <= max.row; rowIndex++) {
                if (
                  !isCellDisabled({ col: columnIndex + min.col, row: rowIndex })
                ) {
                  newData[rowIndex] = await pasteValue({
                    rowData: newData[rowIndex],
                    value: pasteData[0][columnIndex],
                  })
                }
              }
            }
          }

          onChange(newData)
          setActiveCell(
            setStateDeepEqual<Cell | null>({ col: min.col, row: min.row })
          )
          setSelectionCell(
            setStateDeepEqual<Cell | null>({
              col: min.col + pasteData[0].length - 1,
              row: max.row,
            })
          )
        } else {
          // Paste multiple rows
          let newData = [...data]
          const missingRows = min.row + pasteData.length - data.length

          if (missingRows > 0) {
            if (!lockRows) {
              newData = [
                ...newData,
                ...new Array(missingRows).fill(0).map(() => createRow()),
              ]
            } else {
              pasteData.splice(pasteData.length - missingRows, missingRows)
            }
          }

          for (
            let columnIndex = 0;
            columnIndex < pasteData[0].length &&
            min.col + columnIndex < columns.length - 1;
            columnIndex++
          ) {
            const pasteValue = columns[min.col + columnIndex + 1]?.pasteValue

            if (pasteValue) {
              for (let rowIndex = 0; rowIndex < pasteData.length; rowIndex++) {
                if (
                  !isCellDisabled({
                    col: min.col + columnIndex,
                    row: min.row + rowIndex,
                  })
                ) {
                  newData[min.row + rowIndex] = await pasteValue({
                    rowData: newData[min.row + rowIndex],
                    value: pasteData[rowIndex][columnIndex],
                  })
                }
              }
            }
          }

          onChange(newData)
          setActiveCell(
            setStateDeepEqual<Cell | null>({ col: min.col, row: min.row })
          )
          setSelectionCell(
            setStateDeepEqual<Cell | null>({
              col: Math.min(
                min.col + pasteData[0].length - 1,
                columns.length - 2
              ),
              row: min.row + pasteData.length - 1,
            })
          )
        }

        event.preventDefault()
      }
    },
    [
      activeCell,
      columns,
      createRow,
      data,
      editing,
      isCellDisabled,
      lockRows,
      onChange,
      selection,
    ]
  )
  useDocumentEventListener('paste', onPaste)

  const onMouseMove = useCallback(
    (event: MouseEvent) => {
      if (selectionMode.active) {
        const cursorIndex = getCursorIndex(event)

        setSelectionCell(
          setStateDeepEqual(
            cursorIndex && {
              col: selectionMode.columns
                ? Math.max(0, cursorIndex.col)
                : columns.length - 2,
              row: selectionMode.rows
                ? Math.max(0, cursorIndex.row)
                : data.length - 1,
            }
          )
        )
        setEditing(false)
      }
    },
    [getCursorIndex, selectionMode, columns.length, data.length]
  )
  useDocumentEventListener('mousemove', onMouseMove)

  const onMouseDown = useCallback(
    (event: MouseEvent) => {
      const rightClick = event.button === 2
      const clickInside =
        containerRef.current?.contains(event.target as Node) || false
      const cursorIndex = clickInside ? getCursorIndex(event, true) : null

      if (contextMenuItems.length) {
        return
      }

      if (
        !clickInside &&
        editing &&
        activeCell &&
        columns[activeCell.col + 1].keepFocus
      ) {
        return
      }

      const clickOnActiveCell =
        cursorIndex &&
        activeCell &&
        activeCell.col === cursorIndex.col &&
        activeCell.row === cursorIndex.row &&
        !isCellDisabled(activeCell)

      if (clickOnActiveCell && editing) {
        return
      }

      const rightClickInSelection =
        rightClick &&
        selection &&
        cursorIndex &&
        cursorIndex.row >= selection.min.row &&
        cursorIndex.row <= selection.max.row &&
        cursorIndex.col >= selection.min.col &&
        cursorIndex.col <= selection.max.col

      const rightClickOnSelectedHeaders =
        rightClick &&
        selection &&
        cursorIndex &&
        cursorIndex.row === -1 &&
        cursorIndex.col >= selection.min.col &&
        cursorIndex.col <= selection.max.col

      const rightClickOnSelectedGutter =
        rightClick &&
        selection &&
        cursorIndex &&
        cursorIndex.row >= selection.min.row &&
        cursorIndex.row <= selection.max.row &&
        cursorIndex.col === -1

      if (rightClick && !disableContextMenu) {
        setTimeout(
          () => setContextMenu({ x: event.clientX, y: event.clientY }),
          0
        )
      }

      setEditing((clickOnActiveCell && !rightClick) || false)

      setActiveCell(
        setStateDeepEqual<Cell | null>(
          cursorIndex && {
            col:
              (rightClickInSelection || rightClickOnSelectedHeaders) &&
              activeCell
                ? activeCell.col
                : Math.max(0, cursorIndex.col),
            row:
              (rightClickInSelection || rightClickOnSelectedGutter) &&
              activeCell
                ? activeCell.row
                : Math.max(0, cursorIndex.row),
          }
        )
      )

      if (cursorIndex && !rightClick) {
        setSelectionMode(
          setStateDeepEqual({
            columns: cursorIndex.col !== -1,
            rows: cursorIndex.row !== -1,
            active: true as boolean,
          })
        )
      }

      if (!rightClickInSelection) {
        if (cursorIndex?.col === -1 || cursorIndex?.row === -1) {
          let col = cursorIndex.col
          let row = cursorIndex.row

          if (cursorIndex.col === -1) {
            col = columns.length - 2
          }

          if (cursorIndex.row === -1) {
            row = data.length - 1
          }

          if (rightClickOnSelectedHeaders && selectionCell) {
            col = selectionCell.col
          }

          if (rightClickOnSelectedGutter && selectionCell) {
            row = selectionCell.row
          }

          setSelectionCell(
            setStateDeepEqual<Cell | null>({ col, row })
          )
        } else {
          setSelectionCell(null)
        }
      }

      if (clickInside) {
        event.preventDefault()
      }
    },
    [
      disableContextMenu,
      selectionCell,
      getCursorIndex,
      activeCell,
      isCellDisabled,
      editing,
      columns,
      data.length,
      selection,
      contextMenuItems.length,
    ]
  )
  useDocumentEventListener('mousedown', onMouseDown)

  const onMouseUp = useCallback(() => {
    setSelectionMode(
      setStateDeepEqual({
        columns: false as boolean,
        rows: false as boolean,
        active: false as boolean,
      })
    )
  }, [])
  useDocumentEventListener('mouseup', onMouseUp)

  const onContextMenu = useCallback(
    (event: MouseEvent) => {
      const clickInside =
        containerRef.current?.contains(event.target as Node) || false

      const cursorIndex = clickInside ? getCursorIndex(event, true) : null

      const clickOnActiveCell =
        cursorIndex &&
        activeCell &&
        activeCell.col === cursorIndex.col &&
        activeCell.row === cursorIndex.row &&
        editing

      if (clickInside && !clickOnActiveCell) {
        event.preventDefault()
      }
    },
    [getCursorIndex, activeCell, editing]
  )
  useDocumentEventListener('contextmenu', onContextMenu)

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!activeCell) {
        return
      }

      if (event.key.startsWith('Arrow') || event.key === 'Tab') {
        if (editing && columns[activeCell.col + 1].disableKeys) {
          return
        }

        if (editing && ['ArrowLeft', 'ArrowRight'].includes(event.key)) {
          return
        }

        const add = (
          [x, y]: [number, number],
          cell: Cell | null
        ): Cell | null =>
          cell && {
            col: Math.max(0, Math.min(columns.length - 2, cell.col + x)),
            row: Math.max(0, Math.min(data.length - 1, cell.row + y)),
          }

        if (event.key === 'Tab' && event.shiftKey) {
          setActiveCell(setStateDeepEqual((cell) => add([-1, 0], cell)))
          setSelectionCell(null)
        } else {
          const direction = {
            ArrowDown: [0, 1],
            ArrowUp: [0, -1],
            ArrowLeft: [-1, 0],
            ArrowRight: [1, 0],
            Tab: [1, 0],
          }[event.key]

          if (event.ctrlKey || event.metaKey) {
            direction[0] *= columns.length
            direction[1] *= data.length
          }

          if (event.shiftKey) {
            setSelectionCell(
              setStateDeepEqual((cell) => add(direction, cell || activeCell))
            )
          } else {
            setActiveCell(setStateDeepEqual((cell) => add(direction, cell)))
            setSelectionCell(null)
          }
        }
        setEditing(false)

        event.preventDefault()
      } else if (event.key === 'Escape') {
        if (!editing && !selectionCell) {
          setActiveCell(null)
        }

        setSelectionCell(null)
        setEditing(false)
      } else if (
        event.key === 'Enter' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        !event.shiftKey
      ) {
        setSelectionCell(null)

        if (editing) {
          if (!columns[activeCell.col + 1].disableKeys) {
            onDoneEditing()
          }
        } else if (!isCellDisabled(activeCell)) {
          setEditing(true)
          scrollTo(activeCell)
        }
      } else if (
        event.key === 'Enter' &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey &&
        event.shiftKey
      ) {
        onInsertRowAfter(selection?.max.row || activeCell.row)
      } else if (
        event.key === 'd' &&
        (event.ctrlKey || event.metaKey) &&
        !event.altKey &&
        !event.shiftKey
      ) {
        onDuplicateRows(
          selection?.min.row || activeCell.row,
          selection?.max.row
        )
        event.preventDefault()
      } else if (
        event.key.match(/^[a-zA-Z0-9 ,.+-]$/) &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        if (!editing && !isCellDisabled(activeCell)) {
          setSelectionCell(null)
          setEditing(true)
          scrollTo(activeCell)
        }
      } else if (['Backspace', 'Delete'].includes(event.key)) {
        if (!editing) {
          onDelete()
          event.preventDefault()
        }
      } else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        if (!editing) {
          setActiveCell(
            setStateDeepEqual<Cell | null>({ col: 0, row: 0 })
          )
          setSelectionCell(
            setStateDeepEqual<Cell | null>({
              col: columns.length - 2,
              row: data.length - 1,
            })
          )
          event.preventDefault()
        }
      }
    },
    [
      scrollTo,
      activeCell,
      columns,
      data.length,
      editing,
      isCellDisabled,
      onDelete,
      onDoneEditing,
      onDuplicateRows,
      onInsertRowAfter,
      selection,
      selectionCell,
    ]
  )
  useDocumentEventListener('keydown', onKeyDown)

  useEffect(() => {
    if (!contextMenu && contextMenuItems.length) {
      setContextMenuItems([])
    }

    if (contextMenu && !contextMenuItems.length) {
      const items: ContextMenuItem[] = []

      if (selection) {
        items.push({
          type: 'INSERT_ROW_BELLOW',
          action: () => {
            setContextMenu(null)
            onInsertRowAfter(selection.max.row)
          },
        })
      } else if (activeCell) {
        items.push({
          type: 'INSERT_ROW_BELLOW',
          action: () => {
            setContextMenu(null)
            onInsertRowAfter(activeCell.row)
          },
        })
      }

      if (selection && selection.min.row !== selection.max.row) {
        items.push({
          type: 'DUPLICATE_ROWS',
          fromRow: selection.min.row + 1,
          toRow: selection.max.row + 1,
          action: () => {
            setContextMenu(null)
            onDuplicateRows(selection.min.row, selection.max.row)
          },
        })
      } else if (activeCell) {
        items.push({
          type: 'DUPLICATE_ROW',
          action: () => {
            setContextMenu(null)
            onDuplicateRows(activeCell.row)
          },
        })
      }

      if (selection && selection.min.row !== selection.max.row) {
        items.push({
          type: 'DELETE_ROWS',
          fromRow: selection.min.row + 1,
          toRow: selection.max.row + 1,
          action: () => {
            setContextMenu(null)
            onDeleteRows(selection.min.row, selection.max.row)
          },
        })
      } else if (activeCell) {
        items.push({
          type: 'DELETE_ROW',
          action: () => {
            setContextMenu(null)
            onDeleteRows(activeCell.row)
          },
        })
      }

      if (items.length) {
        setContextMenuItems(items)
      } else {
        setContextMenu(null)
      }
    }
  }, [
    contextMenu,
    selection,
    onInsertRowAfter,
    onDeleteRows,
    onDuplicateRows,
    contextMenuItems.length,
    activeCell,
  ])

  const ContextMenuComponent = contextMenuComponent

  // Counter components and props
  const CounterComponent = counterComponent

  const counterAddRows = useCallback(
    (batchSize: number = 1) =>
      onInsertRowAfter(
        data?.length - 1,
        Math.max(1, Math.round(Number(batchSize)))
      ),
    [data?.length, onInsertRowAfter]
  )

  // Grid context
  const focus = Boolean(activeCell)
  const gridContext = useMemo<GridContext>(
    () => ({
      focus: focus,
      editing,
      activeCell: activeCell,
      columnWidths: columnWidths || columns.map(() => 0),
      columnOffsets: columnOffsets || columns.map(() => 0),
      innerWidth: innerWidth || 0,
      rowHeight,
      headerRowHeight,
      selection,
      columns,
      data,
      onChange,
      onDoneEditing,
      isCellDisabled,
      onInsertRowAfter,
      onDuplicateRows,
      onDeleteRows,
    }),
    [
      focus,
      editing,
      activeCell,
      columnWidths,
      columnOffsets,
      innerWidth,
      rowHeight,
      headerRowHeight,
      selection,
      columns,
      data,
      onChange,
      onDoneEditing,
      isCellDisabled,
      onInsertRowAfter,
      onDuplicateRows,
      onDeleteRows,
    ]
  )

  return (
    <DataSheetGridContext.Provider value={gridContext}>
      <div ref={outsideContainerRef}>
        <VariableSizeList
          ref={listRef}
          innerRef={containerRef}
          innerElementType={InnerContainer}
          estimatedItemSize={rowHeight}
          itemSize={(i) => (i === 0 ? headerRowHeight : rowHeight)}
          height={Math.min(
            height,
            innerHeight + (horizontalScrollBar ? scrollbarWidth : 0) + 1
          )}
          itemCount={(columnWidths && data.length + 1) || 0}
          className='dsg-container'
          width='100%'
          children={RowComponent}
        />

        {createRow && !lockRows && (
          <CounterComponent addRows={counterAddRows} />
        )}

        {contextMenu && contextMenuItems.length > 0 && (
          <ContextMenuComponent
            clientX={contextMenu.x}
            clientY={contextMenu.y}
            items={contextMenuItems}
            close={() => setContextMenu(null)}
          />
        )}
      </div>
    </DataSheetGridContext.Provider>
  )
}
