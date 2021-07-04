import React, { useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  dateColumn,
  intColumn,
  floatColumn,
  percentColumn,
  keyColumn,
} from 'react-datasheet-grid'
import faker from 'faker'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(100000).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      job: faker.name.jobTitle(),
      area: faker.name.jobArea(),
      int: faker.datatype.number(1100),
      float: faker.datatype.number(1000) / 100,
      percent: faker.datatype.number(100) / 100,
      date: new Date(faker.date.past()),
    }))
  )

  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={[
        { ...keyColumn('active', checkboxColumn), title: 'Active' },
        {
          ...keyColumn('firstName', textColumn),
          title: 'First name',
          minWidth: 150,
        },
        {
          ...keyColumn('lastName', textColumn),
          title: 'Last name',
          minWidth: 150,
        },
        { ...keyColumn('int', intColumn), title: 'Integer', minWidth: 150 },
        { ...keyColumn('float', floatColumn), title: 'Float', minWidth: 150 },
        {
          ...keyColumn('percent', percentColumn),
          title: 'Percentage',
          minWidth: 150,
        },
        { ...keyColumn('date', dateColumn), title: 'Date' },
        {
          ...keyColumn('job', textColumn),
          title: 'Job',
          minWidth: 250,
        },
        {
          ...keyColumn('area', textColumn),
          title: 'Job area',
          minWidth: 150,
        },
      ]}
      gutterColumn={{ width: '0 0 60px' }}
    />
  )
}
