import * as React from 'react'

import { DataSheetGrid } from '.'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'

describe('DataSheetGrid', () => {
  it('is exported', () => {
    expect(DataSheetGrid).toBeTruthy()
  })
})
