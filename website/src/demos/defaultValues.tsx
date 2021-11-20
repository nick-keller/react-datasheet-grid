import React, { useState } from 'react'
import {
  DataSheetGrid,
  dateColumn,
  intColumn,
  keyColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(3).fill(0).map(() => ({
      name: faker.name.firstName(),
      int: faker.datatype.number(100),
      date: new Date(faker.date.past()),
    }))
  )

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        value={data}
        onChange={setData}
        createRow={() => ({ int: 25, date: new Date() })}
        duplicateRow={({ rowData }) => ({
          ...rowData,
          int: rowData.int ?? 25,
          date: rowData.date ?? new Date(),
        })}
        columns={[
          { ...keyColumn('name', textColumn), title: 'Name' },
          { ...keyColumn('int', intColumn), title: 'Age' },
          { ...keyColumn('date', dateColumn), title: 'Birthday' },
        ]}
      />
    </div>
  )
}
