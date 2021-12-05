import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
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

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

test('Add single row', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { id: 1, firstName: 'Elon', lastName: 'Musk' },
        { id: 2, firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={columns}
      createRow={jest.fn().mockReturnValueOnce({ id: 3 })}
      ref={ref}
    />
  )

  userEvent.click(screen.getByText('Add'))

  expect(onChange).toHaveBeenCalledWith([
    {
      id: 1,
      firstName: 'Elon',
      lastName: 'Musk',
    },
    {
      id: 2,
      firstName: 'Jeff',
      lastName: 'Bezos',
    },
    {
      id: 3,
    },
  ])
})

test('Add multiple rows', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const onChange = jest.fn()

  render(
    <DataSheetGrid
      value={[
        { id: 1, firstName: 'Elon', lastName: 'Musk' },
        { id: 2, firstName: 'Jeff', lastName: 'Bezos' },
      ]}
      onChange={onChange}
      columns={columns}
      createRow={jest
        .fn()
        .mockReturnValueOnce({ id: 3 })
        .mockReturnValueOnce({ id: 4 })
        .mockReturnValueOnce({ id: 5 })}
      ref={ref}
    />
  )

  userEvent.type(screen.getByRole('spinbutton'), '{selectall}3')
  userEvent.click(screen.getByText('Add'))

  expect(onChange).toHaveBeenCalledWith([
    {
      id: 1,
      firstName: 'Elon',
      lastName: 'Musk',
    },
    {
      id: 2,
      firstName: 'Jeff',
      lastName: 'Bezos',
    },
    {
      id: 3,
    },
    {
      id: 4,
    },
    {
      id: 5,
    },
  ])

  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 4,
  })
})
