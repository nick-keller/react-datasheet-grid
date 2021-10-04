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
    new Array(3).fill(0).map((_, i) => ({
      active: i % 2 === 0,
      firstName: faker.name.firstName(),
      number: faker.datatype.number(150),
    }))
  )

  return (
    <div>
      <DataSheetGrid
        value={data}
        onChange={setData}
        style={{ marginBottom: 20 }}
        columns={[
          { ...keyColumn('active', checkboxColumn), title: 'Active' },
          { ...keyColumn('firstName', textColumn), title: 'First name' },
          { ...keyColumn('number', intColumn), title: 'Number' },
        ]}
      />
      <CodeBlock className="language-json">
        {JSON.stringify(data.slice(0, 5), null, 2)}
      </CodeBlock>
    </div>
  )
}
