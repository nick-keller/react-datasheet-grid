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

test('Duplicate row with Cmd+D', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      duplicateRow={() => ({ firstName: 'Richard', lastName: 'Branson' })}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('[MetaLeft>]d[/MetaLeft]')

  expect(onChange).toHaveBeenCalledWith([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Richard', lastName: 'Branson' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 1,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
  })
})

test('Duplicate row with Ctrl+D', () => {
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
      min: { col: 0, row: 1 },
      max: { col: 1, row: 1 },
    })
  )

  userEvent.keyboard('[ControlLeft>]d[/ControlLeft]')

  expect(onChange).toHaveBeenCalledWith([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 2,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 2,
    },
  })
})

test('Duplicate multiple rows', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()
  const duplicateRow = jest.fn(({ rowData }) => ({ ...rowData }))

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
        { firstName: 'Richard', lastName: 'Branson' },
      ]}
      onChange={onChange}
      duplicateRow={duplicateRow}
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

  userEvent.keyboard('[ControlLeft>]d[/ControlLeft]')

  expect(onChange).toHaveBeenCalledWith([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
    { firstName: 'Richard', lastName: 'Branson' },
  ])
  expect(ref.current.selection).toEqual({
    min: {
      col: 0,
      colId: 'firstName',
      row: 2,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 3,
    },
  })
  expect(duplicateRow).toHaveBeenCalledWith({
    rowData: {
      firstName: 'Elon',
      lastName: 'Musk',
    },
    rowIndex: 0,
  })
  expect(duplicateRow).toHaveBeenCalledWith({
    rowData: {
      firstName: 'Jeff',
      lastName: 'Bezos',
    },
    rowIndex: 1,
  })
})

test('Try to duplicate locked rows', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      duplicateRow={() => ({ firstName: 'Richard', lastName: 'Branson' })}
      onChange={onChange}
      columns={columns}
      lockRows
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('[MetaLeft>]d[/MetaLeft]')

  expect(onChange).not.toHaveBeenCalled()
})
