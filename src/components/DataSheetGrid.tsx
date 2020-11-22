import * as React from 'react'
import { VariableSizeGrid } from 'react-window'
import { Cell as CellComponent } from './Cell'

import { useColumnWidths } from '../hooks/useColumnWidths'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { InnerContainer } from './InnerContainer'
import { DataSheetGridContext } from '../contexts/DataSheetGridContext'
import { useGetBoundingRect } from '../hooks/useGetBoundingRect'
import { useDocumentEventListener } from '../hooks/useDocumentEventListener'
import deepEqual from 'fast-deep-equal'
import { Cell, Column, DataSheetGridProps } from '../typings'

export function DataSheetGrid<TRow = any>({
  data = [],
  onChange = () => null,
  columns: rawColumns = [],
  width = 400,
  height = 300,
  rowHeight = 40,
  headerRowHeight = rowHeight,
  gutterColumnWidth = '0 0 30px',
  createRow = () => ({} as TRow),
  duplicateRow = ({ rowData }) => ({ ...rowData }),
  isRowEmpty = ({ rowData }) => Object.values(rowData).every((value) => !value),
  autoAddRow = false,
  lockRows = false,
}: DataSheetGridProps<TRow>) {
  // Add gutter column
  const columns: Column[] = [
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
    deleteValue: ({ rowData }) => rowData,
    copyValue: () => null,
    pasteValue: ({ rowData }) => rowData,
    ...column,
  }))

  const { widths: columnWidths, offsets: columnOffsets } = useColumnWidths(
    width,
    columns,
    height < headerRowHeight + rowHeight * data.length
  )
  const gridRef = useRef<VariableSizeGrid>(null)
  const containerRef = useRef<HTMLElement>(null)
  const getContainerBoundingRect = useGetBoundingRect(containerRef)

  // Update grid when column widths changes
  useEffect(
    () => gridRef.current?.resetAfterColumnIndex(0),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    columnWidths || columns.map(() => 0)
  )

  // True when the active cell is being edited
  const [editing, setEditing] = useState(false)

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

  // Scroll to the active cell when it changes
  useEffect(() => {
    if (activeCell) {
      gridRef.current?.scrollToItem({
        rowIndex: activeCell.row + 1,
        columnIndex: activeCell.col + 1,
      })
    }
  }, [activeCell])

  // Extract the coordinates of the cursor from a mouse event
  const getCursorIndex = useCallback(
    (event: MouseEvent, force: boolean = false): Cell | null => {
      const boundingClientRect = getContainerBoundingRect(force)
      if (boundingClientRect && columnOffsets) {
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
    (row: number) => {
      if (!createRow) {
        return
      }
      setSelectionCell(null)
      setEditing(false)

      if (lockRows) {
        return
      }

      onChange([...data.slice(0, row + 1), createRow(), ...data.slice(row + 1)])
      setActiveCell((a) => a && { ...a, row: row + 1 })
      setTimeout(
        () =>
          gridRef.current?.scrollToItem({
            rowIndex: row + 3,
          }),
        0
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
          setActiveCell((a) => a && { ...a, row: a.row + 1 })
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
      setActiveCell({ col: 0, row: rowMax + 1 })
      setSelectionCell({
        col: columns.length - 2,
        row: 2 * rowMax - rowMin + 1,
      })
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
      setActiveCell((a) => {
        const row = Math.min(data.length - 2 - rowMax + rowMin, rowMin)

        if (row < 0) {
          return null
        }

        return a && { ...a, row }
      })
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
      setActiveCell({ col: 0, row: min.row })
      setSelectionCell({ col: columns.length - 2, row: max.row })
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
            const { pasteValue } = columns[min.col + columnIndex + 1]

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
            min.col + columnIndex < columns.length - 2;
            columnIndex++
          ) {
            const { pasteValue } = columns[min.col + columnIndex + 1]

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

          onChange(newData)
          setActiveCell({ col: min.col, row: min.row })
          setSelectionCell({
            col: Math.min(
              min.col + pasteData[0].length - 1,
              columns.length - 2
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
          cursorIndex && {
            col: selectionMode.columns
              ? Math.max(0, cursorIndex.col)
              : columns.length - 1,
            row: selectionMode.rows
              ? Math.max(0, cursorIndex.row)
              : data.length - 1,
          }
        )
        setEditing(false)
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

      const clickOnActiveCell =
        cursorIndex &&
        activeCell &&
        activeCell.col === cursorIndex.col &&
        activeCell.row === cursorIndex.row &&
        !isCellDisabled(activeCell)

      if (clickOnActiveCell && editing) {
        return
      }

      setEditing(clickOnActiveCell || false)

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

      event.preventDefault()
    },
    [
      getCursorIndex,
      activeCell,
      isCellDisabled,
      editing,
      columns.length,
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
  }, [])
  useDocumentEventListener('mouseup', onMouseUp)

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
          setSelectionCell((cell) => add(direction, cell || activeCell))
        } else {
          setActiveCell((cell) => add(direction, cell))
          setSelectionCell(null)
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
          if (!columns[activeCell.col].disableKeys) {
            onDoneEditing()
          }
        } else if (!isCellDisabled(activeCell)) {
          setEditing(true)
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
        }
      } else if (['Backspace', 'Delete'].includes(event.key)) {
        if (!editing) {
          onDelete()
        }
      } else if (event.key === 'a' && (event.ctrlKey || event.metaKey)) {
        if (!editing) {
          setActiveCell({ col: 0, row: 0 })
          setSelectionCell({ col: columns.length - 2, row: data.length - 1 })
          event.preventDefault()
        }
      }
    },
    [
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

  return (
    <DataSheetGridContext.Provider
      value={{
        focus: Boolean(activeCell),
        editing,
        activeCell: activeCell,
        columnWidths: columnWidths || columns.map(() => 0),
        rowHeight,
        headerRowHeight,
        selection,
        columns,
        data,
        onChange,
        onDoneEditing,
        isCellDisabled,
      }}
    >
      <VariableSizeGrid
        ref={gridRef}
        innerRef={containerRef}
        width={width}
        className='dsg-container'
        columnCount={(columnWidths && columns.length) || 0}
        columnWidth={(i) => columnWidths?.[i] || 0}
        height={Math.min(height, headerRowHeight + rowHeight * data.length)}
        rowCount={(columnWidths && data.length + 1) || 0}
        rowHeight={(i) => (i === 0 ? headerRowHeight : rowHeight)}
        estimatedRowHeight={rowHeight}
        innerElementType={InnerContainer}
        children={CellComponent}
      />
      {createRow && !lockRows && (
        <button
          className='dsg-add-row'
          style={{ width }}
          onClick={() => onInsertRowAfter(data?.length - 1)}
        >
          Add
        </button>
      )}
    </DataSheetGridContext.Provider>
  )
}
