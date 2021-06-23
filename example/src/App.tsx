import React, { useMemo, useState } from 'react'
import { DataSheetGrid, Column } from 'react-datasheet-grid'

function App() {
  const [data, setData] = useState([
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
  ])
  const [count, setCount] = useState(0)
  const columns = useMemo<Column<string>[]>(
    () => [
      { title: 'First name' },
      { title: 'Last name' },
      { title: 'Age' },
      { title: 'Job' },
      {},
      {},
    ],
    []
  )

  return (
    <div
      style={{
        margin: '50px',
        padding: '50px',
        maxWidth: '500px',
        background: '#f3f3f3',
      }}
    >
      <p>
        Counter: <b>{count}</b>
      </p>
      <button onClick={() => setCount(count + 1)}>Up</button>
      <DataSheetGrid
        data={data}
        headerRowHeight={100}
        onChange={setData}
        columns={columns}
        stickyRightColumn={{}}
      />
    </div>
  )
}

export default App
