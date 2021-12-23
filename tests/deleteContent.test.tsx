import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, act } from '@testing-library/react'
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

test('Backspace to delete cell', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('[Backspace]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 1 }]
  )
})

test('Delete to delete cell', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 1, row: 1 }))

  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 1, toRowIndex: 2 }]
  )
})

test('Delete selection', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
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

  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: 'Bezos' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )
})

test('Delete entire grid', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
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

  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: null },
      { firstName: null, lastName: null },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )
})

test('Delete disabled cells', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={[
        keyColumn('firstName', textColumn),
        { ...keyColumn('lastName', textColumn), disabled: true },
      ]}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: 'Bezos' },
    ],
    [{ type: 'UPDATE', fromRowIndex: 0, toRowIndex: 2 }]
  )
})

test('Delete partially empty selection', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: null, lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
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

  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [
      { firstName: null, lastName: 'Musk' },
      { firstName: null, lastName: 'Bezos' },
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

test('Delete empty selection', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: null, lastName: 'Musk' },
        { firstName: null, lastName: 'Bezos' },
      ]}
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

  userEvent.keyboard('[Delete]')

  expect(onChange).not.toHaveBeenCalled()
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

test('Delete empty cell', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: null, lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))
  userEvent.keyboard('[Delete]')

  expect(onChange).not.toHaveBeenCalled()
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

test('Delete empty row', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{ firstName: 'Elon', lastName: 'Musk' }, { firstName: null }]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 1, row: 1 }))
  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [{ firstName: 'Elon', lastName: 'Musk' }],
    [{ type: 'DELETE', fromRowIndex: 1, toRowIndex: 2 }]
  )
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 0,
  })
})

test('Delete empty rows', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{ lastName: null }, { firstName: null, lastName: null }]}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: {
        col: 0,
        row: 0,
      },
      max: {
        col: 0,
        row: 1,
      },
    })
  )
  userEvent.keyboard('[Delete]')

  expect(onChange).toHaveBeenCalledWith(
    [],
    [{ type: 'DELETE', fromRowIndex: 0, toRowIndex: 2 }]
  )
  expect(ref.current.activeCell).toEqual(null)
})

test('Delete empty locked rows', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[{ lastName: null }, { firstName: null, lastName: null }]}
      onChange={onChange}
      columns={columns}
      lockRows
      ref={ref}
    />
  )

  act(() =>
    ref.current.setSelection({
      min: {
        col: 0,
        row: 0,
      },
      max: {
        col: 0,
        row: 1,
      },
    })
  )
  userEvent.keyboard('[Delete]')

  expect(onChange).not.toHaveBeenCalled()
})
