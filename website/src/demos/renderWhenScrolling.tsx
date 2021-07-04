import React, { useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(100).fill(0).map(() => ({
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    }))
  )

  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={[
        {
          ...keyColumn('firstName', textColumn),
          title: 'A',
          renderWhenScrolling: false,
        },
        { ...keyColumn('lastName', textColumn), title: 'B' },
      ]}
    />
  )
}
