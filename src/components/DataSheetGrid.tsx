import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  Cell,
  Column,
  ContextMenuItem,
  DataSheetGridProps,
  DataSheetGridRef,
  HeaderContextType,
  ListItemData,
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
import { AddRows } from './AddRows'
import { useDebounceState } from '../hooks/useDebounceState'
import deepEqual from 'fast-deep-equal'
import { ContextMenu } from './ContextMenu'
import { parseTextPlainData, parseTextHtmlData } from '../utils/copyPasting'
import {
  getCell,
  getCellWithId,
  getSelection,
  getSelectionWithId,
} from '../utils/typeCheck'
import { encode as encodeHtml } from 'html-entities'
import { getAllTabbableElements } from '../utils/tab'

const DEFAULT_DATA: any[] = []
const DEFAULT_COLUMNS: Column<any, any>[] = []
const DEFAULT_CREATE_ROW: DataSheetGridProps<any>['createRow'] = () => ({})
const DEFAULT_EMPTY_CALLBACK: () => void = () => null
const DEFAULT_DUPLICATE_ROW: DataSheetGridProps<any>['duplicateRow'] = ({
  rowData,
}) => ({ ...rowData })

// eslint-disable-next-line react/display-name
export const DataSheetGrid = React.memo(
  React.forwardRef<DataSheetGridRef, DataSheetGridProps<any>>(
    <T extends any>(
      {
        // Data is deprecated but still supported, value should be used instead
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        data: deprecatedValue,
        value: data = deprecatedValue ?? DEFAULT_DATA,
        className,
        style,
        height: maxHeight = 400,
        onChange = DEFAULT_EMPTY_CALLBACK,
        columns: rawColumns = DEFAULT_COLUMNS,
        rowHeight = 40,
        headerRowHeight = rowHeight,
        gutterColumn,
        stickyRightColumn,
        addRowsComponent: AddRowsComponent = AddRows,
        createRow = DEFAULT_CREATE_ROW as () => T,
        autoAddRow = false,
        lockRows = false,
        duplicateRow = DEFAULT_DUPLICATE_ROW,
        contextMenuComponent: ContextMenuComponent = ContextMenu,
        disableContextMenu: disableContextMenuRaw = false,
        onFocus = DEFAULT_EMPTY_CALLBACK,
        onBlur = DEFAULT_EMPTY_CALLBACK,
        onActiveCellChange = DEFAULT_EMPTY_CALLBACK,
        onSelectionChange = DEFAULT_EMPTY_CALLBACK,
      }: DataSheetGridProps<T>,
      ref: React.ForwardedRef<DataSheetGridRef>
    ): JSX.Element => {
      // Display a warning message message when `data` is used instead of `value`
      useMemo(() => {
        if (deprecatedValue !== undefined) {
          console.warn(
            'Property `data` of <DataSheetGrid /> is deprecated, please use `value` instead.'
          )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

      const disableContextMenu = disableContextMenuRaw || lockRows
      const columns = useColumns(rawColumns, gutterColumn, stickyRightColumn)
      const hasStickyRightColumn = Boolean(stickyRightColumn)
      const listRef = useRef<VariableSizeList>(null)
      const innerRef = useRef<HTMLElement>(null)
      const outerRef = useRef<HTMLElement>(null)
      const beforeTabIndexRef = useRef<HTMLDivElement>(null)
      const afterTabIndexRef = useRef<HTMLDivElement>(null)

      useEffect(() => {
        listRef.current?.resetAfterIndex(0)
      }, [headerRowHeight, rowHeight])

      // Default value is 1 for the border
      const [heightDiff, setHeightDiff] = useDebounceState(1, 100)

      // Height of the list (including scrollbars and borders) to display
      const displayHeight = Math.min(
        maxHeight,
        headerRowHeight + data.length * rowHeight + heightDiff
      )

      // Width and height of the scrollable area
      const { width, height } = useResizeDetector({
        targetRef: outerRef,
        refreshMode: 'throttle',
        refreshRate: 100,
      })

      setHeightDiff(height ? displayHeight - height : 0)

      const edges = useEdges(outerRef, width, height)

      const {
        fullWidth,
        totalWidth: contentWidth,
        columnWidths,
        columnRights,
      } = useColumnWidths(columns, width)

      // x,y coordinates of the right click
      const [contextMenu, setContextMenu] = useState<{
        x: number
        y: number
      } | null>(null)

      // Items of the context menu
      const [contextMenuItems, setContextMenuItems] = useState<
        ContextMenuItem[]
      >([])

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
      const [selectionMode, setSelectionMode] = useDeepEqualState({
        // True when the position of the cursor should impact the columns of the selection
        columns: false,
        // True when the position of the cursor should impact the rows of the selection
        rows: false,
        // True when the user is dragging the mouse around to select
        active: false,
      })

      const getInnerBoundingClientRect = useGetBoundingClientRect(innerRef)
      const getOuterBoundingClientRect = useGetBoundingClientRect(outerRef)

      // Blur any element on focusing the grid
      useEffect(() => {
        if (activeCell !== null) {
          ;(document.activeElement as HTMLElement).blur()
          window.getSelection()?.removeAllRanges()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [activeCell !== null])

      // Extract the coordinates of the cursor from a mouse event
      const getCursorIndex = useCallback(
        (
          event: MouseEvent,
          force: boolean = false,
          includeSticky: boolean = false
        ): Cell | null => {
          const innerBoundingClientRect = getInnerBoundingClientRect(force)
          const outerBoundingClientRect =
            includeSticky && getOuterBoundingClientRect(force)

          if (innerBoundingClientRect && columnRights && columnWidths) {
            let x = event.clientX - innerBoundingClientRect.left
            let y = event.clientY - innerBoundingClientRect.top

            if (outerBoundingClientRect) {
              if (
                event.clientY - outerBoundingClientRect.top <=
                headerRowHeight
              ) {
                y = 0
              }

              if (
                event.clientX - outerBoundingClientRect.left <=
                columnWidths[0]
              ) {
                x = 0
              }

              if (
                hasStickyRightColumn &&
                outerBoundingClientRect.right - event.clientX <=
                  columnWidths[columnWidths.length - 1]
              ) {
                x = columnRights[columnRights.length - 2] + 1
              }
            }

            return {
              col: columnRights.findIndex((right) => x < right) - 1,
              row: Math.min(
                data.length - 1,
                Math.max(-1, Math.floor((y - headerRowHeight) / rowHeight))
              ),
            }
          }

          return null
        },
        [
          columnRights,
          columnWidths,
          data.length,
          getInnerBoundingClientRect,
          getOuterBoundingClientRect,
          headerRowHeight,
          rowHeight,
          hasStickyRightColumn,
        ]
      )

      const dataRef = useRef(data)
      dataRef.current = data

      const isCellDisabled = useCallback(
        (cell: Cell): boolean => {
          const disabled = columns[cell.col + 1].disabled

          return Boolean(
            typeof disabled === 'function'
              ? disabled({
                  rowData: dataRef.current[cell.row],
                  rowIndex: cell.row,
                })
              : disabled
          )
        },
        [columns]
      )

      const insertRowAfter = useCallback(
        (row: number, count = 1) => {
          if (lockRows) {
            return
          }

          setSelectionCell(null)
          setEditing(false)

          onChange([
            ...dataRef.current.slice(0, row + 1),
            ...new Array(count).fill(0).map(createRow),
            ...dataRef.current.slice(row + 1),
          ])
          setActiveCell((a) => ({ col: a?.col || 0, row: row + count }))
        },
        [createRow, lockRows, onChange, setActiveCell, setSelectionCell]
      )

      const duplicateRows = useCallback(
        (rowMin: number, rowMax: number = rowMin) => {
          if (lockRows) {
            return
          }

          onChange([
            ...dataRef.current.slice(0, rowMax + 1),
            ...dataRef.current
              .slice(rowMin, rowMax + 1)
              .map((rowData, i) =>
                duplicateRow({ rowData, rowIndex: i + rowMin })
              ),
            ...dataRef.current.slice(rowMax + 1),
          ])
          setActiveCell({ col: 0, row: rowMax + 1 })
          setSelectionCell({
            col: columns.length - (hasStickyRightColumn ? 3 : 2),
            row: 2 * rowMax - rowMin + 1,
          })
          setEditing(false)
        },
        [
          columns.length,
          duplicateRow,
          lockRows,
          onChange,
          setActiveCell,
          setSelectionCell,
          hasStickyRightColumn,
        ]
      )

      // Scroll to any given cell making sure it is in view
      const scrollTo = useCallback(
        (cell: Cell) => {
          if (!height || !width) {
            return
          }

          // Align top
          const topMax = cell.row * rowHeight
          // Align bottom
          const topMin =
            (cell.row + 1) * rowHeight + headerRowHeight - height + 1
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const scrollTop = listRef.current?.state.scrollOffset as number

          if (scrollTop > topMax) {
            listRef.current?.scrollTo(topMax)
          } else if (scrollTop < topMin) {
            listRef.current?.scrollTo(topMin)
          }

          if (columnRights && columnWidths && outerRef.current) {
            // Align left
            const leftMax = columnRights[cell.col] - columnRights[0]
            // Align right
            const leftMin =
              columnRights[cell.col] +
              columnWidths[cell.col + 1] +
              (hasStickyRightColumn
                ? columnWidths[columnWidths.length - 1]
                : 0) -
              width +
              1

            const scrollLeft = outerRef.current.scrollLeft

            if (scrollLeft > leftMax) {
              outerRef.current.scrollLeft = leftMax
            } else if (scrollLeft < leftMin) {
              outerRef.current.scrollLeft = leftMin
            }
          }
        },
        [
          height,
          width,
          rowHeight,
          headerRowHeight,
          columnRights,
          columnWidths,
          hasStickyRightColumn,
        ]
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

      const setRowData = useCallback(
        (rowIndex: number, item: T) => {
          onChange([
            ...dataRef.current?.slice(0, rowIndex),
            item,
            ...dataRef.current?.slice(rowIndex + 1),
          ])
        },
        [onChange]
      )

      const deleteRows = useCallback(
        (rowMin: number, rowMax: number = rowMin) => {
          if (lockRows) {
            return
          }

          setEditing(false)
          setActiveCell((a) => {
            const row = Math.min(
              dataRef.current.length - 2 - rowMax + rowMin,
              rowMin
            )

            if (row < 0) {
              return null
            }

            return a && { ...a, row }
          })
          setSelectionCell(null)
          onChange([
            ...dataRef.current.slice(0, rowMin),
            ...dataRef.current.slice(rowMax + 1),
          ])
        },
        [lockRows, onChange, setActiveCell, setSelectionCell]
      )

      const deleteSelection = useCallback(
        (smartDelete = true) => {
          if (!activeCell) {
            return
          }

          const min: Cell = selection?.min || activeCell
          const max: Cell = selection?.max || activeCell

          if (
            data
              .slice(min.row, max.row + 1)
              .every((rowData, i) =>
                columns.every((column) =>
                  column.isCellEmpty({ rowData, rowIndex: i + min.row })
                )
              )
          ) {
            if (smartDelete) {
              deleteRows(min.row, max.row)
            }
            return
          }

          const newData = [...data]

          for (let row = min.row; row <= max.row; ++row) {
            for (let col = min.col; col <= max.col; ++col) {
              if (!isCellDisabled({ col, row })) {
                const { deleteValue = ({ rowData }) => rowData } =
                  columns[col + 1]
                newData[row] = deleteValue({
                  rowData: newData[row],
                  rowIndex: row,
                })
              }
            }
          }

          if (smartDelete && deepEqual(newData, data)) {
            setActiveCell({ col: 0, row: min.row })
            setSelectionCell({
              col: columns.length - (hasStickyRightColumn ? 3 : 2),
              row: max.row,
            })
            return
          }

          onChange(newData)
        },
        [
          activeCell,
          columns,
          data,
          deleteRows,
          isCellDisabled,
          onChange,
          selection?.max,
          selection?.min,
          setActiveCell,
          setSelectionCell,
          hasStickyRightColumn,
        ]
      )

      const stopEditing = useCallback(
        ({ nextRow = true } = {}) => {
          if (activeCell?.row === dataRef.current.length - 1) {
            if (nextRow && autoAddRow) {
              insertRowAfter(activeCell.row)
            } else {
              setEditing(false)
            }
          } else {
            setEditing(false)

            if (nextRow) {
              setActiveCell((a) => a && { ...a, row: a.row + 1 })
            }
          }
        },
        [activeCell?.row, autoAddRow, insertRowAfter, setActiveCell]
      )

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
                copyData[row - min.row].push(
                  copyValue({ rowData: data[row], rowIndex: row })
                )
              }
            }

            event.clipboardData?.setData(
              'text/plain',
              copyData.map((row) => row.join('\t')).join('\n')
            )
            event.clipboardData?.setData(
              'text/html',
              `<table>${copyData
                .map(
                  (row) =>
                    `<tr>${row
                      .map(
                        (cell) =>
                          `<td>${encodeHtml(String(cell ?? '')).replace(
                            /\n/g,
                            '<br/>'
                          )}</td>`
                      )
                      .join('')}</tr>`
                )
                .join('')}</table>`
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
            deleteSelection(false)
            event.preventDefault()
          }
        },
        [activeCell, deleteSelection, editing, onCopy]
      )
      useDocumentEventListener('cut', onCut)

      const onPaste = useCallback(
        async (event: ClipboardEvent) => {
          if (!editing && activeCell) {
            let pasteData = [['']]

            if (event.clipboardData?.types.includes('text/html')) {
              pasteData = parseTextHtmlData(
                event.clipboardData?.getData('text/html')
              )
            } else if (event.clipboardData?.types.includes('text/plain')) {
              pasteData = parseTextPlainData(
                event.clipboardData?.getData('text/plain')
              )
            } else if (event.clipboardData?.types.includes('text')) {
              pasteData = parseTextPlainData(
                event.clipboardData?.getData('text')
              )
            }

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
                const pasteValue =
                  columns[min.col + columnIndex + 1]?.pasteValue

                if (pasteValue) {
                  for (
                    let rowIndex = min.row;
                    rowIndex <= max.row;
                    rowIndex++
                  ) {
                    if (
                      !isCellDisabled({
                        col: columnIndex + min.col,
                        row: rowIndex,
                      })
                    ) {
                      newData[rowIndex] = await pasteValue({
                        rowData: newData[rowIndex],
                        value: pasteData[0][columnIndex],
                        rowIndex,
                      })
                    }
                  }
                }
              }

              onChange(newData)
              setActiveCell({ col: min.col, row: min.row })
              setSelectionCell({
                col: min.col + pasteData[0].length - 1,
                row: max.row,
              })
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
                min.col + columnIndex <
                  columns.length - (hasStickyRightColumn ? 2 : 1);
                columnIndex++
              ) {
                const pasteValue =
                  columns[min.col + columnIndex + 1]?.pasteValue

                if (pasteValue) {
                  for (
                    let rowIndex = 0;
                    rowIndex < pasteData.length;
                    rowIndex++
                  ) {
                    if (
                      !isCellDisabled({
                        col: min.col + columnIndex,
                        row: min.row + rowIndex,
                      })
                    ) {
                      newData[min.row + rowIndex] = await pasteValue({
                        rowData: newData[min.row + rowIndex],
                        value: pasteData[rowIndex][columnIndex],
                        rowIndex: min.row + rowIndex,
                      })
                    }
                  }
                }
              }

              onChange(newData)
              setActiveCell({ col: min.col, row: min.row })
              setSelectionCell({
                col: Math.min(
                  min.col + pasteData[0].length - 1,
                  columns.length - (hasStickyRightColumn ? 3 : 2)
                ),
                row: min.row + pasteData.length - 1,
              })
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
          hasStickyRightColumn,
          isCellDisabled,
          lockRows,
          onChange,
          selection?.max,
          selection?.min,
          setActiveCell,
          setSelectionCell,
        ]
      )
      useDocumentEventListener('paste', onPaste)

      const onMouseDown = useCallback(
        (event: MouseEvent) => {
          if (contextMenu && contextMenuItems.length) {
            return
          }

          const rightClick = event.button === 2
          const clickInside =
            innerRef.current?.contains(event.target as Node) || false

          const cursorIndex = clickInside
            ? getCursorIndex(event, true, true)
            : null

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

          const clickOnStickyRightColumn =
            cursorIndex?.col === columns.length - 2 && hasStickyRightColumn

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

          const clickOnSelectedStickyRightColumn =
            clickOnStickyRightColumn &&
            selection &&
            cursorIndex &&
            cursorIndex.row >= selection.min.row &&
            cursorIndex.row <= selection.max.row

          if (rightClick && !disableContextMenu) {
            setContextMenu({ x: event.clientX, y: event.clientY })
          }

          if (
            (!(event.shiftKey && activeCell) || rightClick) &&
            data.length > 0
          ) {
            setActiveCell(
              cursorIndex && {
                col:
                  (rightClickInSelection || rightClickOnSelectedHeaders) &&
                  activeCell
                    ? activeCell.col
                    : Math.max(
                        0,
                        clickOnStickyRightColumn ? 0 : cursorIndex.col
                      ),
                row:
                  (rightClickInSelection ||
                    rightClickOnSelectedGutter ||
                    clickOnSelectedStickyRightColumn) &&
                  activeCell
                    ? activeCell.row
                    : Math.max(0, cursorIndex.row),
              }
            )
          }

          setEditing(Boolean(clickOnActiveCell && !rightClick))
          setSelectionMode(
            cursorIndex && !rightClick
              ? {
                  columns:
                    (cursorIndex.col !== -1 && !clickOnStickyRightColumn) ||
                    Boolean(event.shiftKey && activeCell),
                  rows:
                    cursorIndex.row !== -1 ||
                    Boolean(event.shiftKey && activeCell),
                  active: true,
                }
              : {
                  columns: false,
                  rows: false,
                  active: false,
                }
          )

          if (event.shiftKey && activeCell && !rightClick) {
            setSelectionCell(
              cursorIndex && {
                col: Math.max(
                  0,
                  cursorIndex.col - (clickOnStickyRightColumn ? 1 : 0)
                ),
                row: Math.max(0, cursorIndex.row),
              }
            )
          } else if (!rightClickInSelection) {
            if (
              cursorIndex &&
              (cursorIndex?.col === -1 ||
                cursorIndex?.row === -1 ||
                clickOnStickyRightColumn)
            ) {
              let col = cursorIndex.col
              let row = cursorIndex.row

              if (cursorIndex.col === -1 || clickOnStickyRightColumn) {
                col = columns.length - (hasStickyRightColumn ? 3 : 2)
              }

              if (cursorIndex.row === -1) {
                row = data.length - 1
              }

              if (rightClickOnSelectedHeaders && selectionCell) {
                col = selectionCell.col
              }

              if (
                (rightClickOnSelectedGutter ||
                  clickOnSelectedStickyRightColumn) &&
                selectionCell
              ) {
                row = selectionCell.row
              }

              setSelectionCell({ col, row })
            } else {
              setSelectionCell(null)
            }

            if (clickInside) {
              event.preventDefault()
            }
          }
        },
        [
          contextMenu,
          contextMenuItems.length,
          getCursorIndex,
          editing,
          activeCell,
          columns,
          isCellDisabled,
          selection,
          hasStickyRightColumn,
          disableContextMenu,
          setSelectionMode,
          setActiveCell,
          setSelectionCell,
          selectionCell,
          data.length,
        ]
      )
      useDocumentEventListener('mousedown', onMouseDown)

      const onMouseUp = useCallback(() => {
        setSelectionMode({
          columns: false,
          rows: false,
          active: false,
        })
      }, [setSelectionMode])
      useDocumentEventListener('mouseup', onMouseUp)

      const onMouseMove = useCallback(
        (event: MouseEvent) => {
          if (selectionMode.active) {
            const cursorIndex = getCursorIndex(event)

            const lastColumnIndex =
              columns.length - (hasStickyRightColumn ? 3 : 2)

            setSelectionCell(
              cursorIndex && {
                col: selectionMode.columns
                  ? Math.max(0, Math.min(lastColumnIndex, cursorIndex.col))
                  : lastColumnIndex,
                row: selectionMode.rows
                  ? Math.max(0, cursorIndex.row)
                  : data.length - 1,
              }
            )
            setEditing(false)
          }
        },
        [
          selectionMode.active,
          selectionMode.columns,
          selectionMode.rows,
          getCursorIndex,
          columns.length,
          hasStickyRightColumn,
          setSelectionCell,
          data.length,
        ]
      )
      useDocumentEventListener('mousemove', onMouseMove)

      const onKeyDown = useCallback(
        (event: KeyboardEvent) => {
          if (!activeCell) {
            return
          }

          // Tab from last cell
          if (
            event.key === 'Tab' &&
            !event.shiftKey &&
            activeCell.col ===
              columns.length - (hasStickyRightColumn ? 3 : 2) &&
            activeCell.row === data.length - 1 &&
            afterTabIndexRef.current &&
            !columns[activeCell.col + 1].disableKeys
          ) {
            event.preventDefault()

            setActiveCell(null)
            setSelectionCell(null)
            setEditing(false)

            const allElements = getAllTabbableElements()
            const index = allElements.indexOf(afterTabIndexRef.current)

            allElements[(index + 1) % allElements.length].focus()

            return
          }

          // Shift+Tab from first cell
          if (
            event.key === 'Tab' &&
            event.shiftKey &&
            activeCell.col === 0 &&
            activeCell.row === 0 &&
            beforeTabIndexRef.current &&
            !columns[activeCell.col + 1].disableKeys
          ) {
            event.preventDefault()

            setActiveCell(null)
            setSelectionCell(null)
            setEditing(false)

            const allElements = getAllTabbableElements()
            const index = allElements.indexOf(beforeTabIndexRef.current)

            allElements[
              (index - 1 + allElements.length) % allElements.length
            ].focus()

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
                col: Math.max(
                  0,
                  Math.min(
                    columns.length - (hasStickyRightColumn ? 3 : 2),
                    cell.col + x
                  )
                ),
                row: Math.max(0, Math.min(data.length - 1, cell.row + y)),
              }

            if (event.key === 'Tab' && event.shiftKey) {
              setActiveCell((cell) => add([-1, 0], cell))
              setSelectionCell(null)
            } else {
              const direction = {
                ArrowDown: [0, 1],
                ArrowUp: [0, -1],
                ArrowLeft: [-1, 0],
                ArrowRight: [1, 0],
                Tab: [1, 0],
              }[event.key] as [number, number]

              if (event.ctrlKey || event.metaKey) {
                direction[0] *= columns.length
                direction[1] *= data.length
              }

              if (event.shiftKey) {
                setSelectionCell((cell) => add(direction, cell || activeCell))
              } else {
                setActiveCell((cell) => add(direction, cell))
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
                stopEditing()
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
            insertRowAfter(selection?.max.row || activeCell.row)
          } else if (
            event.key === 'd' &&
            (event.ctrlKey || event.metaKey) &&
            !event.altKey &&
            !event.shiftKey
          ) {
            duplicateRows(
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
              deleteSelection()
              event.preventDefault()
            }
          } else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
            if (!editing) {
              setActiveCell({ col: 0, row: 0 })
              setSelectionCell({
                col: columns.length - (hasStickyRightColumn ? 3 : 2),
                row: data.length - 1,
              })
              event.preventDefault()
            }
          }
        },
        [
          activeCell,
          columns,
          data.length,
          deleteSelection,
          duplicateRows,
          editing,
          insertRowAfter,
          isCellDisabled,
          scrollTo,
          selection?.max.row,
          selection?.min.row,
          selectionCell,
          setActiveCell,
          setSelectionCell,
          stopEditing,
          hasStickyRightColumn,
        ]
      )
      useDocumentEventListener('keydown', onKeyDown)

      const onContextMenu = useCallback(
        (event: MouseEvent) => {
          const clickInside =
            innerRef.current?.contains(event.target as Node) || false

          const cursorIndex = clickInside
            ? getCursorIndex(event, true, true)
            : null

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

      useEffect(() => {
        const items: ContextMenuItem[] = []

        if (selection?.max.row !== undefined) {
          items.push({
            type: 'INSERT_ROW_BELLOW',
            action: () => {
              setContextMenu(null)
              insertRowAfter(selection.max.row)
            },
          })
        } else if (activeCell?.row !== undefined) {
          items.push({
            type: 'INSERT_ROW_BELLOW',
            action: () => {
              setContextMenu(null)
              insertRowAfter(activeCell.row)
            },
          })
        }

        if (
          selection?.min.row !== undefined &&
          selection.min.row !== selection.max.row
        ) {
          items.push({
            type: 'DUPLICATE_ROWS',
            fromRow: selection.min.row + 1,
            toRow: selection.max.row + 1,
            action: () => {
              setContextMenu(null)
              duplicateRows(selection.min.row, selection.max.row)
            },
          })
        } else if (activeCell?.row !== undefined) {
          items.push({
            type: 'DUPLICATE_ROW',
            action: () => {
              setContextMenu(null)
              duplicateRows(activeCell.row)
            },
          })
        }

        if (
          selection?.min.row !== undefined &&
          selection.min.row !== selection.max.row
        ) {
          items.push({
            type: 'DELETE_ROWS',
            fromRow: selection.min.row + 1,
            toRow: selection.max.row + 1,
            action: () => {
              setContextMenu(null)
              deleteRows(selection.min.row, selection.max.row)
            },
          })
        } else if (activeCell?.row !== undefined) {
          items.push({
            type: 'DELETE_ROW',
            action: () => {
              setContextMenu(null)
              deleteRows(activeCell.row)
            },
          })
        }

        setContextMenuItems(items)
        if (!items.length) {
          setContextMenu(null)
        }
      }, [
        activeCell?.row,
        deleteRows,
        duplicateRows,
        insertRowAfter,
        selection?.min.row,
        selection?.max.row,
      ])

      const headerContext = useMemoObject<HeaderContextType<T>>({
        hasStickyRightColumn,
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
        hasStickyRightColumn,
        dataLength: data.length,
        viewHeight: height,
        viewWidth: width,
        contentWidth: fullWidth ? undefined : contentWidth,
        edges,
        editing,
        isCellDisabled,
      })

      const contextMenuItemsRef = useRef(contextMenuItems)
      contextMenuItemsRef.current = contextMenuItems

      const getContextMenuItems = useCallback(
        () => contextMenuItemsRef.current,
        []
      )

      const itemData = useMemoObject<ListItemData<T>>({
        data,
        contentWidth: fullWidth ? undefined : contentWidth,
        columns,
        hasStickyRightColumn,
        activeCell,
        selectionMinRow: selection?.min.row ?? activeCell?.row,
        selectionMaxRow: selection?.max.row ?? activeCell?.row,
        editing,
        setRowData,
        deleteRows,
        duplicateRows,
        insertRowAfter,
        stopEditing,
        getContextMenuItems,
      })

      const itemSize = useCallback(
        (index) => (index === 0 ? headerRowHeight : rowHeight),
        [headerRowHeight, rowHeight]
      )

      useImperativeHandle(ref, () => ({
        activeCell: getCellWithId(activeCell, columns),
        selection: getSelectionWithId(
          selection ??
            (activeCell ? { min: activeCell, max: activeCell } : null),
          columns
        ),
        setSelection: (value) => {
          const selection = getSelection(
            value,
            columns.length - (hasStickyRightColumn ? 2 : 1),
            data.length,
            columns
          )

          setActiveCell(selection?.min || null)
          setEditing(false)
          setSelectionMode({ columns: false, active: false, rows: false })
          setSelectionCell(selection?.max || null)
        },
        setActiveCell: (value) => {
          const cell = getCell(
            value,
            columns.length - (hasStickyRightColumn ? 2 : 1),
            data.length,
            columns
          )

          setActiveCell(cell)
          setEditing(false)
          setSelectionMode({ columns: false, active: false, rows: false })
          setSelectionCell(null)
        },
      }))

      // Used to remember the last non-null value of active cell
      const lastActiveCellRef = useRef(activeCell)
      lastActiveCellRef.current = activeCell ?? lastActiveCellRef.current

      const callbacksRef = useRef({
        onFocus,
        onBlur,
        onActiveCellChange,
        onSelectionChange,
      })
      callbacksRef.current.onFocus = onFocus
      callbacksRef.current.onBlur = onBlur
      callbacksRef.current.onActiveCellChange = onActiveCellChange
      callbacksRef.current.onSelectionChange = onSelectionChange

      useEffect(() => {
        if (lastActiveCellRef.current) {
          if (editing) {
            callbacksRef.current.onFocus({
              cell: getCellWithId(lastActiveCellRef.current, columns),
            })
          } else {
            callbacksRef.current.onBlur({
              cell: getCellWithId(lastActiveCellRef.current, columns),
            })
          }
        }
      }, [editing, columns])

      useEffect(() => {
        callbacksRef.current.onActiveCellChange({
          cell: getCellWithId(activeCell, columns),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [activeCell?.col, activeCell?.row, columns])

      useEffect(() => {
        callbacksRef.current.onSelectionChange({
          selection: getSelectionWithId(
            selection ??
              (activeCell ? { min: activeCell, max: activeCell } : null),
            columns
          ),
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selection?.min.col ?? activeCell?.col,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selection?.min.row ?? activeCell?.row,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selection?.max.col ?? activeCell?.col,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        selection?.max.row ?? activeCell?.row,
        activeCell?.col,
        activeCell?.row,
        columns,
      ])

      return (
        <div className={className} style={style}>
          <div
            ref={beforeTabIndexRef}
            tabIndex={rawColumns.length && data.length ? 0 : undefined}
            onFocus={(e) => {
              e.target.blur()
              setActiveCell({ col: 0, row: 0 })
            }}
          />
          <HeaderContext.Provider value={headerContext}>
            <SelectionContext.Provider value={selectionContext}>
              <VariableSizeList<ListItemData<T>>
                className="dsg-container"
                width="100%"
                ref={listRef}
                height={displayHeight}
                itemCount={data.length + 1}
                itemSize={itemSize}
                estimatedItemSize={rowHeight}
                itemData={itemData}
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
          <div
            ref={afterTabIndexRef}
            tabIndex={rawColumns.length && data.length ? 0 : undefined}
            onFocus={(e) => {
              e.target.blur()
              setActiveCell({
                col: columns.length - (hasStickyRightColumn ? 3 : 2),
                row: data.length - 1,
              })
            }}
          />
          {!lockRows && (
            <AddRowsComponent
              addRows={(count) => insertRowAfter(data.length - 1, count)}
            />
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
      )
    }
  )
) as <T extends any>(
  props: DataSheetGridProps<T> & { ref?: React.ForwardedRef<DataSheetGridRef> }
) => JSX.Element

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
DataSheetGrid.displayName = 'DataSheetGrid'
