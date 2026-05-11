import React from 'react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import { DataSheetGrid, Column, keyColumn, textColumn } from '../src'

jest.mock('react-resize-detector', () => ({
  useResizeDetector: () => ({ width: 500, height: 300 }),
}))

const columns: Column[] = [
  keyColumn('firstName', textColumn),
  keyColumn('lastName', textColumn),
  keyColumn('company', textColumn),
]

test('stickyLeftColumnNumber pins the leading data columns', () => {
  const { container } = render(
    <DataSheetGrid
      value={[{ id: 1, firstName: 'Elon', lastName: 'Musk', company: 'X' }]}
      columns={columns}
      stickyLeftColumnNumber={2}
    />
  )

  const stickyLeftCells = container.querySelectorAll('.dsg-cell-sticky-left')
  // Header + first row for two sticky data columns.
  expect(stickyLeftCells).toHaveLength(4)
})

