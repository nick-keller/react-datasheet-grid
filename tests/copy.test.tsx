import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import {
  DataSheetGrid,
  Column,
  textColumn,
  keyColumn,
  DataSheetGridRef,
} from '../src'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

class MockDataTransfer {
  data: Record<string, string> = {}

  setData(format: string, data: string) {
    this.data[format] = data
  }
}

const copy = () => {
  const clipboardData = new MockDataTransfer()
  fireEvent.copy(document, { clipboardData: clipboardData })
  return clipboardData.data
}

const cut = () => {
  const clipboardData = new MockDataTransfer()
  fireEvent.cut(document, { clipboardData: clipboardData })
  return clipboardData.data
}

const rows = [
  { firstName: 'Elon', lastName: 'Musk' },
  { firstName: 'Jeff', lastName: 'Bezos' },
]

test('Copy single cell', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={rows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  expect(copy()).toEqual({
    'text/html': '<table><tr><td>Jeff</td></tr></table>',
    'text/plain': 'Jeff',
  })
  expect(onChange).not.toHaveBeenCalled()
})

test('Copy multiple cell', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }

  render(<DataSheetGrid value={rows} columns={columns} ref={ref} />)

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  expect(copy()).toEqual({
    'text/html':
      '<table><tr><td>Elon</td><td>Musk</td></tr><tr><td>Jeff</td><td>Bezos</td></tr></table>',
    'text/plain': 'Elon\tMusk\nJeff\tBezos',
  })
})

test('Cut multiple cells', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={rows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 0, row: 1 },
    })
  )

  expect(cut()).toEqual({
    'text/html': '<table><tr><td>Elon</td></tr><tr><td>Jeff</td></tr></table>',
    'text/plain': 'Elon\nJeff',
  })
  expect(onChange).toHaveBeenCalledWith([
    { firstName: null, lastName: 'Musk' },
    { firstName: null, lastName: 'Bezos' },
  ])
})
