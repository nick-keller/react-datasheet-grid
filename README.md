# react-datasheet-grid

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-datasheet-grid.svg)](https://www.npmjs.com/package/react-datasheet-grid) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-datasheet-grid
```

## Usage

```tsx
import React from 'react'

import { DataSheetGrid } from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const Example = () => {
  const [ data, setData ] = useState([
    { firstName: 'Elon', lastName: 'Musk' },
  ])


  const columns = [
    textColumn({ title: 'First name', key: 'firstName' }),
    textColumn({ title: 'Last name', key: 'lastName' }),
  ]

  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={columns}
    />
  )
}
```

## API
### Props
#### data
#### onChange
#### columns
#### width
> `number` default to 400

Width of grid in pixels.

#### height
> `number` default to 300

Height of grid in pixels.

#### rowHeight
> `number` default to 40

Height of a row in pixels.

#### headerRowHeight = rowHeight,
> `number` default to `rowHeight`

Height of a the header row in pixels.

#### createRow
> `func() => any` default to `() => ({})`

A function that should return a new row object.
This function is called once per row every time the user appends or inserts new rows.

Most often used to add default values and / or random ids to new rows.

#### duplicateRow
> `func({ rowData }) => any` default to `({ rowData }) => ({ ...rowData })`

A function that should return a new row object from an existing row.
This function is called once per row every time the user duplicates rows.

Most often used to override values and / or change uniq ids when duplicating rows.

#### isRowEmpty = ({ rowData }) => Object.values(rowData).every((value) => !value),
#### autoAddRow = false,
#### lockRows = false,
### Columns

## License

MIT © [nick-keller](https://github.com/nick-keller)
