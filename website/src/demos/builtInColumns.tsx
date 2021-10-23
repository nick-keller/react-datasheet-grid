import React, { useState } from 'react'
import {
  checkboxColumn,
  DataSheetGrid,
  keyColumn,
  dateColumn,
  floatColumn,
  intColumn,
  percentColumn,
  textColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(5).fill(0).map(() => ({
      textColumn: faker.name.firstName(),
      checkboxColumn: faker.datatype.boolean(),
      dateColumn: new Date(faker.date.past()),
      intColumn: faker.datatype.number(1100),
      floatColumn: faker.datatype.number(1000) / 100,
      percentColumn: faker.datatype.number(100) / 100,
    }))
  )

  return (
    <div style={{ marginBottom: 20 }}>
      <DataSheetGrid
        value={data}
        onChange={setData}
        columns={[
          {
            ...keyColumn('textColumn', textColumn),
            title: 'textColumn',
            minWidth: 150,
          },
          {
            ...keyColumn('checkboxColumn', checkboxColumn),
            title: 'checkboxColumn',
            minWidth: 150,
          },
          {
            ...keyColumn('intColumn', intColumn),
            title: 'intColumn',
            minWidth: 120,
          },
          {
            ...keyColumn('floatColumn', floatColumn),
            title: 'floatColumn',
            minWidth: 120,
          },
          {
            ...keyColumn('dateColumn', dateColumn),
            title: 'dateColumn',
          },
          {
            ...keyColumn('percentColumn', percentColumn),
            title: 'percentColumn',
            minWidth: 150,
          },
        ]}
      />
    </div>
  )
}
