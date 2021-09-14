import React, { useState } from 'react'
import { DataSheetGrid } from 'react-datasheet-grid'

const Component = ({ active, focus }) => {
  return (
    <div style={{ padding: '0 10px' }}>{`${active ? 'active' : ''}${
      focus ? ' + focus' : ''
    }`}</div>
  )
}

export default () => {
  const [data, setData] = useState<any[]>([null, null, null, null])

  return (
    <DataSheetGrid
      value={data}
      onChange={setData}
      columns={[
        { title: 'A', component: Component },
        { title: 'B', component: Component },
        { title: 'C', component: Component },
      ]}
    />
  )
}
