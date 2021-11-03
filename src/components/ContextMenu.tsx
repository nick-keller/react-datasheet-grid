import * as React from 'react'
import { useCallback, useRef } from 'react'
import { useDocumentEventListener } from '../hooks/useDocumentEventListener'
import { ContextMenuItem, ContextMenuComponentProps } from '../types'

const renderItem = (item: ContextMenuItem) => {
  if (item.type === 'DELETE_ROW') {
    return 'Delete row'
  }

  if (item.type === 'DELETE_ROWS') {
    return (
      <>
        Delete rows <b>{item.fromRow}</b> to <b>{item.toRow}</b>
      </>
    )
  }

  if (item.type === 'INSERT_ROW_BELLOW') {
    return 'Insert row below'
  }

  if (item.type === 'DUPLICATE_ROW') {
    return 'Duplicate row'
  }

  if (item.type === 'DUPLICATE_ROWS') {
    return (
      <>
        Duplicate rows <b>{item.fromRow}</b> to <b>{item.toRow}</b>
      </>
    )
  }

  return item.type
}

export const ContextMenu = ({
  clientX,
  clientY,
  items,
  close,
}: ContextMenuComponentProps) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const onClickOutside = useCallback(
    (event: MouseEvent) => {
      const clickInside = containerRef.current?.contains(event.target as Node)

      if (!clickInside) {
        close()
      }
    },
    [close]
  )
  useDocumentEventListener('mousedown', onClickOutside)

  return (
    <div
      className="dsg-context-menu"
      style={{ left: clientX + 'px', top: clientY + 'px' }}
      ref={containerRef}
    >
      {items.map((item) => (
        <div
          key={item.type}
          onClick={item.action}
          className="dsg-context-menu-item"
        >
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
