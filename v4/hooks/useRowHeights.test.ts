import { useRef, useState, useMemo } from 'react'
import { useRowHeights } from './useRowHeights'
jest.mock('react')

const useRefMock = useRef as unknown as jest.Mock<{
  current: { height: number; top: number }[]
}>
const useStateMock = useState as unknown as jest.Mock
const useMemoMock = useMemo as unknown as jest.Mock

const createSizes = (...heights: number[]) => {
  let bottom = 0

  return heights.map((height) => {
    bottom += height
    return { height, top: bottom - height }
  })
}

const fromSizes = (heights: number[], calculated = heights.length) => {
  useRefMock.mockReturnValue({
    current: createSizes(...heights.slice(0, calculated)),
  })

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useRowHeights({
    value: new Array(heights.length).fill(0),
    rowHeight: ({ rowIndex }) => heights[rowIndex],
  })
}

beforeEach(() => {
  useStateMock.mockReturnValue([null, () => null])
  useMemoMock.mockImplementation((cb) => cb())
})

describe('getRowIndex', () => {
  test('Right on top', () => {
    const { getRowIndex } = fromSizes([2, 3, 4])

    expect(getRowIndex(0)).toBe(0)
    expect(getRowIndex(2)).toBe(1)
    expect(getRowIndex(5)).toBe(2)
  })

  test('Between tops', () => {
    const { getRowIndex } = fromSizes([2, 3, 4])

    expect(getRowIndex(1)).toBe(0)
    expect(getRowIndex(4)).toBe(1)
  })

  test('Negative', () => {
    const { getRowIndex } = fromSizes([2, 3, 4])

    expect(getRowIndex(-1)).toBe(-1)
    expect(getRowIndex(-100)).toBe(-1)
  })

  test('Beyond', () => {
    const { getRowIndex } = fromSizes([2, 3, 4])

    expect(getRowIndex(6)).toBe(2)
    expect(getRowIndex(100)).toBe(2)
  })

  test('No row calculated right on top', () => {
    const { getRowIndex } = fromSizes([2, 3, 4], 0)

    expect(getRowIndex(0)).toBe(0)
    expect(getRowIndex(2)).toBe(1)
    expect(getRowIndex(5)).toBe(2)
  })
})
