import React, { useState } from 'react'
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
  intColumn,
} from 'react-datasheet-grid'
import faker from 'faker'
import CodeBlock from '@theme/CodeBlock'

export default () => {
  const [data, setData] = useState<any[]>(
    new Array(3).fill(0).map(() => ({
      active: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      number: faker.datatype.number(150),
    }))
  )

  return (
    <>
      <DataSheetGrid
        data={data}
        onChange={setData}
        columns={[
          { ...keyColumn('active', checkboxColumn), title: 'Active' },
          { ...keyColumn('firstName', textColumn), title: 'First name' },
          { ...keyColumn('number', intColumn), title: 'Number' },
        ]}
      />
      <div style={{ marginTop: 20 }}>
        <CodeBlock className="language-json">
          {JSON.stringify(data.slice(0, 10), null, 2)}
        </CodeBlock>
      </div>
    </>
  )
}
