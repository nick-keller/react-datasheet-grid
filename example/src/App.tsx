import React, { useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  textColumn,
  Column,
  DataSheetGridRef,
} from 'react-datasheet-grid'
import './style.css'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
}

function App() {
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const ref = useRef<DataSheetGridRef>(null)

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

  useEffect(() => {
    setTimeout(
      () =>
        ref.current?.setSelection({
          max: { col: 5, row: 1 },
          min: { col: 1, row: 100 },
        }),
      3000
    )
  }, [])

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
        data={data}
        onChange={setData}
        columns={columns}
        ref={ref}
      />
    </div>
  )
}

export default App
