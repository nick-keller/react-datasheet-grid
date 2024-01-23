import * as React from 'react'
import { FC, useCallback, useRef } from 'react'
import { useDocumentEventListener } from '../hooks/useDocumentEventListener'
import { ContextMenuItem, ContextMenuComponentProps } from '../types'

export const defaultRenderItem = (item: ContextMenuItem) => {
  if (item.type === 'CUT') {
    return <>Cut</>
  }

  if (item.type === 'COPY') {
    return <>Copy</>
  }

  if (item.type === 'PASTE') {
    return <>Paste</>
  }

  if (item.type === 'DELETE_ROW') {
    return <>Delete row</>
  }

  if (item.type === 'DELETE_ROWS') {
    return (
      <>
        Delete rows <b>{item.fromRow}</b> to <b>{item.toRow}</b>
      </>
    )
  }

  if (item.type === 'INSERT_ROW_BELLOW') {
    return <>Insert row below</>
  }

  if (item.type === 'DUPLICATE_ROW') {
    return <>Duplicate row</>
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

export const createContextMenuComponent =
  (
    renderItem: (item: ContextMenuItem) => JSX.Element = defaultRenderItem
  ): FC<ContextMenuComponentProps> =>
  // eslint-disable-next-line react/display-name
  ({ clientX, clientY, items, close }) => {
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

export const ContextMenu = createContextMenuComponent(defaultRenderItem)

ContextMenu.displayName = 'ContextMenu'
