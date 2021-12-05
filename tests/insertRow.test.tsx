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

test('Insert row with Shift+Enter', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { firstName: 'Elon', lastName: 'Musk' },
        { firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      createRow={() => ({ firstName: 'Richard', lastName: 'Branson' })}
      onChange={onChange}
      columns={columns}
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 1, row: 0 }))

  userEvent.keyboard('[ShiftLeft>][Enter][/ShiftLeft]')

  expect(onChange).toHaveBeenCalledWith([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Richard', lastName: 'Branson' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  expect(ref.current.selection).toEqual({
    min: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
    max: {
      col: 1,
      colId: 'lastName',
      row: 1,
    },
  })
})

test('Insert row from selection', () => {
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
      min: { col: 1, row: 0 },
      max: { col: 0, row: 1 },
    })
  )

  userEvent.keyboard('[ShiftLeft>][Enter][/ShiftLeft]')

  expect(onChange).toHaveBeenCalledWith([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
    {},
  ])
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 2,
  })
})

test('Insert row with locked rows', () => {
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
      lockRows
      ref={ref}
    />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('[ShiftLeft>][Enter][/ShiftLeft]')

  expect(onChange).not.toHaveBeenCalled()
})
