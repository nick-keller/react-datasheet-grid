import React, { useRef, useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  DataSheetGridRef,
  keyColumn,
  textColumn,
  Column,
} from 'react-datasheet-grid'
import './style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
}

function App() {
  const ref = useRef<DataSheetGridRef>(null)
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
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
      <button
        onClick={() => ref.current?.setActiveCell({ col: 'firstName', row: 1 })}
      >
        hello
      </button>
      <DataSheetGrid
        ref={ref}
        data={data}
        onChange={setData}
        columns={columns}
      />
    </div>
  )
}

export default App
