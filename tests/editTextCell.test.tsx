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
} from '../v4'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
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

  userEvent.keyboard('[Enter]')
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
})

test('Type to replace from selection', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(<DataWrapper dataRef={data} dsgRef={ref} columns={columns} />)

  act(() =>
    ref.current.setSelection({
      min: { col: 0, row: 0 },
      max: { col: 1, row: 1 },
    })
  )

  userEvent.keyboard('Kimbal')
  expect(data.current).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  expect(ref.current.selection).toEqual({
    min: { col: 0, colId: 'firstName', row: 0 },
    max: { col: 0, colId: 'firstName', row: 0 },
  })

  userEvent.keyboard('[Enter]')
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
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
  userEvent.keyboard('[Enter]')
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
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
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 1,
  })
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

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  userEvent.keyboard('[Enter][ArrowRight]rey')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  userEvent.keyboard('[ArrowUp]')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])
  expect(ref.current.activeCell).toEqual({
    col: 0,
    colId: 'firstName',
    row: 0,
  })
})

test('Lazy cell validate with Tab', () => {
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
  userEvent.tab()
  expect(data.current).toEqual([
    { firstName: 'Kimbal', lastName: 'Musk' },
    { firstName: 'Jeff', lastName: 'Bezos' },
  ])
  expect(ref.current.activeCell).toEqual({
    col: 1,
    colId: 'lastName',
    row: 0,
  })
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

test('Edit cell auto add row', () => {
  const ref = { current: null as unknown as DataSheetGridRef }
  const data = {
    current: [
      { firstName: 'Elon', lastName: 'Musk' },
      { firstName: 'Jeff', lastName: 'Bezos' },
    ],
  }

  render(
    <DataWrapper dataRef={data} dsgRef={ref} columns={columns} autoAddRow />
  )

  act(() => ref.current.setActiveCell({ col: 0, row: 1 }))

  userEvent.keyboard('[Enter][ArrowRight]rey')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
  ])

  userEvent.keyboard('[Enter]')
  expect(data.current).toEqual([
    { firstName: 'Elon', lastName: 'Musk' },
    { firstName: 'Jeffrey', lastName: 'Bezos' },
    {},
  ])
})
