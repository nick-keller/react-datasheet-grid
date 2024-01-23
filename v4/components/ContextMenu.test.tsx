import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { ContextMenu } from './ContextMenu'
import { MatcherFunction } from '@testing-library/dom/types/matches'

test('Closes properly', () => {
  const onClose = jest.fn()
  const { container } = render(
    <ContextMenu
      cursorIndex={{ col: 0, row: 0 }}
      clientX={0}
      clientY={0}
      items={[]}
      close={onClose}
    />
  )
  userEvent.click(container)
  expect(onClose).toHaveBeenCalled()
})

test('Click on item', () => {
  const onClose = jest.fn()
  const onInsertRowBelow = jest.fn()
  render(
    <ContextMenu
      cursorIndex={{ col: 0, row: 0 }}
      clientX={0}
      clientY={0}
      items={[{ type: 'INSERT_ROW_BELLOW', action: onInsertRowBelow }]}
      close={onClose}
    />
  )
  userEvent.click(screen.getByText('Insert row below'))
  expect(onInsertRowBelow).toHaveBeenCalled()
  expect(onClose).not.toHaveBeenCalled()
})

const textContentMatcher = (text: string): MatcherFunction => {
  const hasText = (node: Element | null) => node?.textContent === text

  return function (_, node) {
    const nodeHasText = hasText(node)
    const childrenDontHaveText = Array.from(node?.children ?? []).every(
      (child) => !hasText(child)
    )
    return nodeHasText && childrenDontHaveText
  }
}

test('Check all items', () => {
  render(
    <ContextMenu
      cursorIndex={{ col: 0, row: 0 }}
      clientX={0}
      clientY={0}
      items={[
        { type: 'INSERT_ROW_BELLOW', action: () => null },
        { type: 'DELETE_ROW', action: () => null },
        { type: 'DUPLICATE_ROW', action: () => null },
        { type: 'DELETE_ROWS', fromRow: 1, toRow: 3, action: () => null },
        { type: 'DUPLICATE_ROWS', fromRow: 5, toRow: 7, action: () => null },
      ]}
      close={() => null}
    />
  )
  expect(screen.getByText('Insert row below')).toBeInTheDocument()
  expect(screen.getByText('Delete row')).toBeInTheDocument()
  expect(screen.getByText('Duplicate row')).toBeInTheDocument()
  expect(
    screen.getByText(textContentMatcher('Delete rows 1 to 3'))
  ).toBeInTheDocument()
  expect(
    screen.getByText(textContentMatcher('Duplicate rows 5 to 7'))
  ).toBeInTheDocument()
})

test('Fallback for unknown item', () => {
  render(
    <ContextMenu
      cursorIndex={{ col: 0, row: 0 }}
      clientX={0}
      clientY={0}
      items={[
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        { type: 'UNKNOWN_ITEM', action: () => null },
      ]}
      close={() => null}
    />
  )
  expect(screen.getByText('UNKNOWN_ITEM')).toBeInTheDocument()
})
