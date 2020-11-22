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
> `array` default to `[]`

List of rows. Elements are usually objects but can be anything.

#### onChange
> `(data: any[]) => void` default to empty function

This function is called when the data is updated.

#### columns
> `Column[]` default to `[]`

List of columns.

#### width
> `number` default to `400`

Width of grid in pixels.

#### height
> `number` default to `300`

Height of grid in pixels.

#### rowHeight
> `number` default to `40`

Height of a row in pixels.

#### headerRowHeight
> `number` default to `rowHeight`

Height of the header row in pixels.

#### gutterColumnWidth
> `number | string` default to `'0 0 30px'`

Width of the gutter column. Accepts the same values as any column.

#### createRow
> `() => any` default to `() => ({})`

A function that should return a new row object.
This function is called once per row every time the user appends or inserts new rows.

Most often used to add default values and / or random ids to new rows.

#### duplicateRow
> `func({ rowData }) => any` default to `({ rowData }) => ({ ...rowData })`

A function that should return a new row object from an existing row.
This function is called once per row every time the user duplicates rows.

Most often used to override values and / or change uniq ids when duplicating rows.

#### isRowEmpty
> `({ rowData }) => boolean` default to a function that return true when one of the value of `rowData` is truthy

User can only delete empty rows. This function allows to customize what is considered an empty row.

Most often used to ignore keys that are in the object but are not part of any column (eg. id).

#### autoAddRow
> `boolean` default to `false`

When true, a new row is added at the end of the grid when the user presses enter while editing a cell from the last row.

#### lockRows
> `boolean` default to `false`

When true, prevents the user from adding or removing rows.

### Columns

#### title
> `ReactNode` default to `null`

Element to display in the header row.

#### width
> `string | number` default to `1`

Width of the column, supports the same values than the CSS `flex` [property](https://developer.mozilla.org/en-US/docs/Web/CSS/flex).

- `'0 0 <width>px'`: Fixed width column of `<width>` pixels.
- `<number>`: Responsive column that grows and shrinks. The number determines how large is the column compared to other columns.
- Any other possible values defined by [flex](https://developer.mozilla.org/en-US/docs/Web/CSS/flex).

#### minWidth
> `number` default to `100`

Minimum width of the column in pixels. Can be `null` for no minimum value.

#### maxWidth
> `number`

Maximum width of the column in pixels. Can be `null` for no maximum value.

#### disableKeys
> `boolean` default to `false`

Usually when the user is editing a cell, pressing the up, down, or return key will exit editing mode.
Setting `disableKeys` to `true` will prevent this behavior.

#### disabled
> `boolean | (({ rowData }) => boolean)` default to `false`

Disable the entire column by passing `true`, or disable it for specific rows by passing a function.

#### deleteValue
> `({ rowData }) => any`

A function that deletes the column value of a row. Used when the user clears a cell or deletes a row.



## License

MIT © [nick-keller](https://github.com/nick-keller)
