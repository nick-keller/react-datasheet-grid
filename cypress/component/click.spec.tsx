import React from 'react'
import { mount } from '@cypress/react'
import { DataSheetGrid, DataSheetGridRef } from '../../src'

it('should select cell on click', () => {
  const ref = { current: null as unknown as DataSheetGridRef }

  cy.viewport(500, 500)
  mount(
    <DataSheetGrid
      columns={[{ id: 'a' }, { id: 'b' }]}
      value={[{}, {}]}
      style={{ marginTop: 100, width: 440 }}
      ref={ref}
    />
  )
  cy.get('.dsg-container')
    .click(100, 60)
    .then(() => {
      expect(ref.current.activeCell).to.deep.equal({
        col: 0,
        row: 0,
        colId: 'a',
      })
    })

  cy.get('.dsg-container')
    .click(300, 85)
    .then(() => {
      expect(ref.current.activeCell).to.deep.equal({
        col: 1,
        row: 1,
        colId: 'b',
      })
    })

  cy.get('.dsg-container')
    .click(350, 20)
    .then(() => {
      expect(ref.current.selection).to.deep.equal({
        min: {
          col: 1,
          row: 0,
          colId: 'b',
        },
        max: {
          col: 1,
          row: 1,
          colId: 'b',
        },
      })
    })

  cy.get('.dsg-container')
    .click(20, 50)
    .then(() => {
      expect(ref.current.selection).to.deep.equal({
        min: {
          col: 0,
          row: 0,
          colId: 'a',
        },
        max: {
          col: 1,
          row: 0,
          colId: 'b',
        },
      })
    })
})

export {}
