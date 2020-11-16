import * as React from 'react'

import { DataSheetGrid } from '.'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

jest.mock('./hooks/useColumnWidths', () => ({
  useColumnWidths: jest.fn((_, columns) => ({ widths: columns.map(() => 100), offsets: columns.map((_, i) => i * 100) })),
}))

describe('DataSheetGrid', () => {
  it('is exported', () => {
    expect(DataSheetGrid).toBeTruthy()
  })
})

describe('hello', () => {
  test('world', async() => {
    render(
      <DataSheetGrid
        columns={[
          { title: 'First name'},
          { title: 'Last name'},
        ]}
      />
    )

    await waitFor(() => {
      expect(screen.getByText('First name')).toBeInTheDocument()
      expect(screen.getByText('Last name')).toBeInTheDocument()
    })
    screen.debug()
  })
})
