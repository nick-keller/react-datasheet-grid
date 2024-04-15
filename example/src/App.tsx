import React, { useState } from 'react'
import {
  checkboxColumn,
  Column,
  DataSheetGrid,
  keyColumn,
  textColumn,
  intColumn,
} from '../../src'
import '../../src/style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
  score?: number
}

function App() {
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk', score: 1 },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
      grow: 0.5,
      enableSumFooter: true,
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
      grow: 2,
    },
    {
      ...keyColumn<Row, 'score'>('score', intColumn),
      title: 'Last name',
      grow: 2,
      enableSumFooter: true,
    },
  ]

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '900px',
        background: '#f3f3f3',
      }}
    >
      <DataSheetGrid
        // stickyFirstColumn
        value={data}
        onChange={setData}
        columns={columns}
      />
    </div>
  )
}

export default App
