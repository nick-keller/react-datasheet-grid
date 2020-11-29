# react-datasheet-grid

> Made with create-react-library

[![NPM](https://img.shields.io/npm/v/react-datasheet-grid.svg)](https://www.npmjs.com/package/react-datasheet-grid) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

An Airtable-like / Excel-like component to create spreadsheets.

![Preview](./images/preview.png)

Feature rich:
- Dead simple to setup and to use
- Supports copy / pasting to and from Excel, Google-sheet...
- Keyboard navigation and shortcuts fully-supported
- Supports custom widgets
- Blazing fast, optimized for speed
- Smooth animations
- Virtualized, supports hundreds of thousands of rows
- Extensively customizable, controllable behaviors

## Install

```bash
npm install --save react-datasheet-grid
```

## Usage

```tsx
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
} from 'react-datasheet-grid'
import 'react-datasheet-grid/dist/index.css'

const Example = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns = [
    checkboxColumn({ title: 'Active', key: 'active' }),
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

## Columns based spreadsheet
`react-datasheet-grid` is more like Airtable or Notion and less like Excel in
the sense that instead of dealing with individual cells it deals with entire
rows, and each column is responsible for a single property of each row.

Columns support widgets likes checkboxes, selectors, money input, or any
component you wish to implement. Each individual columns is responsible for
formatting, typing, validation, and controlling any other behavior related to
the property it handles.

Columns are simple objects:
```tsx
const columns = [
  { title: 'Column A', width: 1, minWidth: 200, /*...*/ },
  { title: 'Column B', width: 1, minWidth: 200, /*...*/ },
]
```

This makes it terribly easy to extend and re-use existing columns:
```tsx
const defaultSize = { width: 1, minWidth: 200 }
const columnA = { title: 'Column A', ...defaultSize, /*...*/ }

const columns = [
  columnA,
  { title: 'Column B', ...columnA },
]
```

All available properties are [listed here](#columns-definition).

## API reference
### Props
#### data
> `any[]`

List of rows. Elements are usually objects but can be anything.

#### onChange
> `(data: any[]) => void`

This function is called when the data is updated.

#### columns
> `Column[]`

List of columns. [Learn more](#columns-definition).

#### height
> `number` default to `400`

Maximum height of the grid in pixels. If the content is longer, the grid
becomes scrollable.

#### rowHeight
> `number` default to `40`

Height of a single row in pixels. All rows must have the same height.

#### headerRowHeight
> `number` default to `rowHeight`

Height of the header row in pixels. Same as `rowHeight` by default.

#### gutterColumnWidth
> `number | string` default to `'0 0 40px'`

Width of the gutter column. Accepts the same values as the `width` property
of any column.

Be aware that giving it a number will **not** give the gutter a
fixed size. To make it a fixed size in pixels pass a string like so: `'0 0 50px'`.
Learn more about the [width property](#width).

#### createRow
> `() => any` default to `() => ({})`

A function that should return a new row object.
This function is called once per row every time the user appends or inserts new rows.

Most often used to add default values and / or random ids to new rows.

#### duplicateRow
> `({ rowData }) => any` default to `({ rowData }) => ({ ...rowData })`

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

#### counterComponent
> A React component with props `value` and `onChange`

Used to replace the content of the "Add row" button, enables:
- Translations
- Custom input / icons
- Removing the counter

`value` is an integer and `onChange` should be called with the new value
(it should not be called with the event).

View [default implementation](src/components/AddRowsCounter.tsx).

### Columns definition

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

This is used when the widget needs to handle the up and down keys itself
(eg. to increase the value, or select a choice). Usually the widget also needs to
handle to return key by calling [done](#done).

#### disabled
> `boolean | (({ rowData }) => boolean)` default to `false`

Disable the entire column by passing `true`, or disable it for specific rows by passing a function.

#### deleteValue
> `({ rowData }) => any`

A function that deletes the column value of a row. Used when the user clears a cell or deletes a row.

#### copyValue
> `({ rowData }) => number | string | null`

A function that returns the value of the copied cell.
If the user copies multiple cells at once, this function will be called
multiple times.

It can return a string, a number, or null, but it will always be turned into a
string in the end.

#### pasteValue
> `({ rowData, value }) => any`

A function that takes in a row and the `value` to be paste, and should return the updated row.
If the value should be ignored, it should still return the unchanged row.

The `value` is always a string and should therefore be casted to whatever type is needed.

#### render
> `({ rowData, rowIndex, ... }) => ReactNode`

A function to render a cell. Arguments are defined [here](#render-function).

### Render function
#### rowData
The row object from wich tha value of the cell should be extracted.

#### rowIndex and columnIndex
Row and column index.

#### active
> `boolean`

True when the cell is active / highlighted.

#### focus
> `boolean`

True when the cell is focused / being edited.

#### setRowData
> `(rowData) => void`

Function to call to update the row.

#### done
> `({ nextRow = true }) => void`

This function can be called to exit edit mode manually.
This is mainly used when [disableKeys](#disablekeys) is true but it can have other use-cases.

Optionally you can pass the `nextRow` parameter to `false` so the active / highlighted
cell stays on the current cell.

## License

MIT © [nick-keller](https://github.com/nick-keller)
