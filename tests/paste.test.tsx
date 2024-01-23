import React from 'react'
import '@testing-library/jest-dom'
import { act, fireEvent, render, waitFor } from '@testing-library/react'
import {
  Column,
  DataSheetGrid,
  DataSheetGridRef,
  keyColumn,
  textColumn,
} from '../v4'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

type DataTransferType = {
  'text/html'?: string
  'text/plain'?: string
  text?: string
}

class MockDataTransfer {
  constructor(private data: DataTransferType) {}

  getData(format: keyof DataTransferType) {
    return this.data[format]
  }

  get types() {
    return Object.keys(this.data)
  }
}

const paste = (data: DataTransferType) => {
  fireEvent.paste(document, { clipboardData: new MockDataTransfer(data) })
}

const emptyRows = [
  { firstName: null, lastName: null },
  { firstName: null, lastName: null },
]

test('Single value text', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  paste({ text: 'Jeff' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: null },
      { firstName: 'Jeff', lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 1, toRowIndex: 2 }]
  )

  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
})

test('Single value text plain', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 1, row: 0 }))

  paste({ 'text/plain': 'Musk' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 1 }]
  )
})

test('HTML over text', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 1, row: 0 }))

  paste({
    'text/plain': 'foo',
    text: 'foo',
    'text/html': '<table><tr><td>Musk</td></tr></table>',
  })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 1 }]
  )
})

test('Single value on multiple rows selection', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  paste({ text: 'Elon' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: 'Elon', lastName: null },
      { firstName: 'Elon', lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 0,
    },
    max: {
      col: 0,
      colId: 'firstName',
      row: 1,
    },
  })
})

test('Single row on multiple rows selection', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
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

  paste({ text: 'Elon\tMusk' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Elon', lastName: 'Musk' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 0,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
  })
})

test('Single row on multiple rows selection with overflow to the right', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 1, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  paste({ text: 'Elon\tMusk' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Elon' },
      { firstName: null, lastName: 'Elon' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 1,
      colId: 'lastName',
      row: 0,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
  })
})

test('Multiple rows', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={emptyRows}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 0 },
    })
  )

  paste({ text: 'Elon\nJeff' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: 'Elon', lastName: null },
      { firstName: 'Jeff', lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 0,
    },
    max: {
      col: 0,
      colId: 'firstName',
      row: 1,
    },
  })
})

test('Multiple rows with overflow to the right', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{}, {}, {}]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 1, row: 0 },
      max: { col: 1, row: 2 },
    })
  )

  paste({ text: 'Elon\tMusk\nJeff\tBezos' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [{ lastName: 'Elon' }, { lastName: 'Jeff' }, {}],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 1,
      colId: 'lastName',
      row: 0,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
  })
})

test('Multiple rows with overflow at the bottom', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{}]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  paste({ text: 'Elon\tMusk\nJeff\tBezos\nRichard\tBranson' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
      { firstName: 'Richard', lastName: 'Branson' },
    ],
    [
      { type: 'UPDATE', fromRowIndex: 0, toRowIndex: 1 },
      { type: 'CREATE', fromRowIndex: 1, toRowIndex: 3 },
    ]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 0,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 2,
    },
  })
})

test('Multiple rows with overflow at the bottom and locked rows', async () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{}]}
      onChange={onChange}
      columns={columns}
      lockRows
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  paste({ text: 'Elon\tMusk\nJeff\tBezos\nRichard\tBranson' })

  await waitFor(() => expect(onChange).toHaveBeenCalled())

  expect(onChange).toHaveBeenCalledWith(
    [{ firstName: 'Elon', lastName: 'Musk' }],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 1 }]
  )

  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 0,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 0,
    },
  })
})
