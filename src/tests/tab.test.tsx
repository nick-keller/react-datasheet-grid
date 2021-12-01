import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen, act } from '@testing-library/react'
import {
  DataSheetGrid,
  Column,
  textColumn,
  keyColumn,
  DataSheetGridRef,
} from '../index'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const data = [
  { firstName: 'Elon', lastName: 'Musk' },
  { firstName: 'Jeff', lastName: 'Bezos' },
]
const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

test('Tab', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  render(
    <>
      <input data-testid="input-before" />
      <DataSheetGrid value={data} columns={columns} ref={ref} lockRows />
      <input data-testid="input-after" />
    </>
  )

  userEvent.click(screen.getByTestId('input-before'))

  userEvent.tab()
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })

  userEvent.tab()
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 0,
  })

  userEvent.tab()
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })

  userEvent.tab()
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 1,
  })

  userEvent.tab()
  expect(ref.current.activeCell).toEqual(null)
  expect(screen.getByTestId('input-after')).toHaveFocus()
})

test('Shift tab', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  render(
    <>
      <input data-testid="input-before" />
      <DataSheetGrid value={data} columns={columns} ref={ref} lockRows />
      <input data-testid="input-after" />
    </>
  )

  userEvent.click(screen.getByTestId('input-after'))

  userEvent.tab({ shift: true })
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 1,
  })

  userEvent.tab({ shift: true })
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })

  userEvent.tab({ shift: true })
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 0,
  })

  userEvent.tab({ shift: true })
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })

  userEvent.tab({ shift: true })
  expect(ref.current.activeCell).toEqual(null)
  expect(screen.getByTestId('input-before')).toHaveFocus()
})
