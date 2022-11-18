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
  isoDateColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(5).fill(0).map(() => ({
      textColumn: faker.name.firstName(),
      checkboxColumn: faker.datatype.boolean(),
      dateColumn: new Date(faker.date.past()),
      isoDateColumn: new Date(faker.date.past()).toISOString().slice(0, 10),
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
            ...keyColumn('isoDateColumn', isoDateColumn),
            title: 'isoDateColumn',
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
