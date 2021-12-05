import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { act, render } from '@testing-library/react'
import {
  Column,
  createTextColumn,
  DataSheetGridRef,
  keyColumn,
  textColumn,
} from '../index'
import { DataWrapper } from './helpers/DataWrapper'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 100, height: 100 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
]

const lazyColumns: Column[] = [
  keyColumn('firstName', createTextColumn({ continuousUpdates: false })),
  keyColumn('lastName', createTextColumn({ continuousUpdates: false })),
]

test('Type to replace', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={columns} />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('Kimbal')
  expect(data.current).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})

test('Enter to edit', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={columns} />)

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  userEvent.keyboard('[Enter][ArrowRight]rey')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])
})

test('Lazy cell validate with Enter', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={lazyColumns} />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('Kimbal')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  userEvent.keyboard('[Enter]')
  expect(data.current).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})

test('Lazy cell validate with Arrow', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={lazyColumns} />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('Kimbal')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  userEvent.keyboard('[ArrowDown]')
  expect(data.current).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})

test('Lazy cell cancel with Escape', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={lazyColumns} />)

  act(() => ref.current.setActiveCell({ col: 0, row: 0 }))

  userEvent.keyboard('Kimbal[Escape]')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
})
