# react-datasheet-grid

[![NPM](https://img.shields.io/npm/v/react-datasheet-grid.svg)](https://www.npmjs.com/package/react-datasheet-grid)
![npm bundle size](https://img.shields.io/bundlephobia/min/react-datasheet-grid)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

View [Demo](https://react-datasheet-grid.netlify.app/) and examples

An Airtable-like / Excel-like component to create beautiful spreadsheets.

![Preview](./images/preview.png)

Feature rich:
- Dead simple to set up and to use
- Supports copy / pasting to and from Excel, Google-sheet...
- Keyboard navigation and shortcuts fully-supported
- Supports right clicking and custom context menu
- Supports custom widgets
- Blazing fast, optimized for speed
- Smooth animations
- Virtualized, supports hundreds of thousands of rows
- Extensively customizable, controllable behaviors
- Built with Typescript

## Install

```bash
npm i react-datasheet-grid
```

## Usage

```tsx
import {
  DataSheetGrid,
  checkboxColumn,
  textColumn,
  keyColumn,
} from 'react-datasheet-grid'

const Example = () => {
  const [ data, setData ] = useState([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns = [
    {
      ...keyColumn('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn('lastName', textColumn),
      title: 'Last name',
    },
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
`react-datasheet-grid` is more like Airtable, Notion, or a database and less like Excel in
the sense that instead of dealing with individual cells it deals with columns, 
each cell of a column being of the same type.

Columns support widgets likes checkboxes, selectors, calendars, money input, or any
component you wish to implement. Each individual columns is responsible for
formatting, typing, validating, and controlling any behavior related to
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

const columns = [
  { ...defaultSize, title: 'Column A', /*...*/ },
  { ...defaultSize, title: 'Column B', /*...*/ },
]
```

For columns implementation examples got to [src/columns](./src/columns).

All available properties are [listed bellow](#columns-definition).

## Performance
`react-datasheet-grid` is highly optimized for performance, to get the most out of it, 
it is recommended to follow a few principles.

### Static vs dynamic
By default `<DataSheetGrid />` is static, meaning that it saves the props it receives
during the first render and never updates them. This is extremely useful to avoid
un-necessary re-renders due to inline props change:
```tsx
import { DataSheetGrid } from 'react-datasheet-grid'

const MyComponent = () => {
  const [ data, setData ] = useState([])
  
  return (
    <DataSheetGrid
      data={data}
      onChange={setData}
      columns={[ // <- ⚠️ A new array is passed on every render
        {/*...*/}, 
        {/*...*/}, 
        {/*...*/},
      ]}
      createRow={() => ({ id: genId() })} // <- ⚠️ A new function is passed on every render
    />
  )
}
```
This example is perfectly fine because even tho `<DataSheetGrid />` receives different
props on every render, it only looks at the props it receives on the first render, no re-render is triggered.

Only props that are objects or functions are concerned by this static behavior (eg. `stickyRightColumn`, `createRow`, `duplicateRow`...) at the exception of `onChange` that is always dynamic.
All other props are dynamic by default (eg. `data`, `height`, `lockRows`...)

In most cases this behavior is desired and perfectly fine unless:
- You have dynamic columns (columns can be added / removed, or their props can change after the first render)
- Some functions like `duplicateRow` or `isRowEmpty` must change after the first render

For those particular cases you should use `<DynamicDataSheetGrid />`:

```tsx
import { DynamicDataSheetGrid } from 'react-datasheet-grid'

const MyComponent = () => {
  const [ data, setData ] = useState([])
  const columns = useMemo(() => [
    {/*...*/},
    {/*...*/},
    {/*...*/},
  ], [])
  const createRow = useCallback(() => ({ id: genId() }), [])

  return (
    <DynamicDataSheetGrid
      data={data}
      onChange={setData}
      columns={columns}
      createRow={createRow}
    />
  )
}
```
When you decide to use `<DynamicDataSheetGrid />` you can no longer inline the props and have to use
`useMemo` and `useCallback` for all props that are either a function or an object.
This allows you to have dynamic props while still having optimal performance.

### Cell component performance

It is recommended to wrap all cell components in `React.memo()` to avoid un-necessary renders (except for very light
components where a re-render is faster than a props check):
```tsx
const MyComponent = React.memo(({ rowData, setRowData }) => {
  return <input {/*...*/} />
})

const column = { component: MyComponent, /*...*/ }
```

Because each cell component takes the entire `rowData` as a prop and not just a single value for the row object,
all cells of a row are re-rendered when the user edits a single cell. Fortunately this can easily be avoided by
using the built-in `keyColumn`:
```tsx
// Without keyColumn 👎
const TextComponent = React.memo(
  ({ rowData, setRowData, columnData }) => {
    return (
      <input
        value={rowData[columnData]}
        onChange={(e) => setRowData({ ...rowData, [key]: e.target.value })}
      />
    )
  }
)

const textColumn = (key) => ({
  component: TextComponent,
  columnData: key,
  deleteValue: ({ rowData }) => ({ ...rowData, [key]: '' }),
  copyValue: ({ rowData }) => rowData[key],
  pasteValue: ({ rowData, value }) => ({ ...rowData, [key]: value }),
})

const columns = [
  { ...textColumn('name') }
]

// with keyColumn 👍
import { keyColumn } from 'react-datasheet-grid'

const TextComponent = React.memo(
  ({ rowData, setRowData }) => {
    return (
      <input
        value={rowData}
        onChange={(e) => setRowData(e.target.value)}
      />
    )
  }
)

const textColumn = {
  component: TextComponent,
  deleteValue: () => '',
  copyValue: ({ rowData }) => rowData,
  pasteValue: ({ value }) => value,
}

const columns = [
  { ...keyColumn('name', textColumn) }
]
```
`keyColumn` has the advantage of reducing the number of renders your component has to perform while also
making it much easier to write.

If a component is still slow to render it might have a big impact on performance while scrolling.
When the user scrolls through a long datasheet, hundreds of rows might be rendered in a few seconds,
it is recommended to set `renderWhenScrolling` to `false` to only start rendering the column when scroll stops:
```tsx
const column = { component: MyComponent, renderWhenScrolling: false, /*...*/ }
```

## Typescript

Types can be imported directly for convenience.
```tsx
import {
  DataSheetGrid,
  Column,
  keyColumn,
  textColumn,
  checkboxColumn,
} from 'react-datasheet-grid'

type Row = {
  active: boolean
  firstName: string | null
  lastName: string | null
}

function App() {
  const [data, setData] = useState<Row[]>([
    { active: true, firstName: 'Elon', lastName: 'Musk' },
    { active: false, firstName: 'Jeff', lastName: 'Bezos' },
  ])

  const columns: Column<Row>[] = [
    {
      ...keyColumn<Row, 'active'>('active', checkboxColumn),
      title: 'Active',
    },
    {
      ...keyColumn<Row, 'firstName'>('firstName', textColumn),
      title: 'First name',
    },
    {
      ...keyColumn<Row, 'lastName'>('lastName', textColumn),
      title: 'Last name',
    },
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
## API reference
### Props

| Prop                 | Type                                                | Default                                                                  | Message                                                                                                                                                                                                                           |
|----------------------|-----------------------------------------------------|--------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| data                 | `any[]`                                             | `[]`                                                                     | List of rows. Elements are usually objects but can be anything.                                                                                                                                                                   |
| onChange             | `(data) => void`                                    |                                                                         | This function is called when data is updated.                                                                                                                                                                                     |
| columns              | `Column[]`                                          | `[]`                                                                     | List of columns. [Details](#columns-definition)                                                                                                                                                                                   |
| gutterColumn         | `Column`                                            |                                                                          | Used to customize the gutter column to the left of the grid. Mostly used to customize the size or the render of the column                                                                                                        |
| stickyRightColumn    | `Column`                                            | `null`                                                                   | Used to add a column to the right of the grid. The added column is sticky (always visible event when scrolling) and cannot be selected, it is only used to show options to the user: delete row, insert row...                    |
| height               | `number`                                            | `400`                                                                    | Maximum height of the grid in pixels. If the content is longer, the grid becomes scrollable.                                                                                                                                      |
| rowHeight            | `number`                                            | `40`                                                                     | Height of a single row in pixels. All row have the same height.                                                                                                                                                                   |
| headerRowHeight      | `number`                                            | `rowHeight`                                                              | Height of the header row in pixels.                                                                                                                                                                                               |
| createRow            | `() => any`                                         | `() => ({})`                                                             | A function that should return a new row object. This function is called once per row every time the user appends or inserts new rows. Most often used to add default values and / or random ids to new rows.                      |
| duplicateRow         | `({ rowData }) => any`                              | `({ rowData }) => ({ ...rowData })`                                      | A function that should return a new row object from an existing row. This function is called once per row every time the user duplicates rows. Most often used to override values and / or change uniq ids when duplicating rows. |
| isRowEmpty           | `({ rowData }) => boolean`                          | A function that return true when one of the value of `rowData` is truthy | User can only delete empty rows. This function allows to customize what is considered an empty row. Most often used to ignore keys that are in the object but are not part of any column (eg. id).                                |
| autoAddRow           | `boolean`                                           | `false`                                                                  | When true, a new row is added at the end of the grid when the user presses enter while editing a cell from the last row.                                                                                                          |
| lockRows             | `boolean`                                           | `false`                                                                  | When true, prevents the user from adding or removing rows.                                                                                                                                                                        |
| disableContextMenu   | `boolean`                                           | `false`                                                                  | When true, no context menu is shown when right clicking.                                                                                                                                                                          |
| addRowsComponent     | A React component                                   |                                                                          | Used to replace the content of the "Add row" button bellow the grid for translations, custom inputs, icons... View [default implementation](./src/components/AddRows.tsx).                                                        |
| contextMenuComponent | A React component                                   |                                                                          | Used to customize the context menu when right clicking. View [default implementation](./src/components/ContextMenu.tsx).                                                                                                          |

### Columns definition
For columns implementation examples go to [src/columns](./src/columns). You can also check out more [demos and examples](https://react-datasheet-grid.netlify.app/).

| Key         | Type                                        | Default | Message                                                                                                                                                                                                                                                                                                                                                                                |
|-------------|---------------------------------------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| title       | `ReactNode`                                 | `null`  | Element to display in the header row.                                                                                                                                                                                                                                                                                                                                                  |
| width       | `string \| number`                          | `1`     | Width of the column, supports the same values as the CSS `flex` [property](https://developer.mozilla.org/en-US/docs/Web/CSS/flex). `'0 0 <width>px'` for fixed width of `<width>` pixels. `<number>` for responsive columns.                                                                                                                                                           |
| minWidth    | `number`                                    | `100`   | Minimum width of the column in pixels. Can be `0` for no minimum value.                                                                                                                                                                                                                                                                                                                |
| maxWidth    | `number \| null`                            | `null`  | Maximum width of the column in pixels. Can be `null` for no maximum value.                                                                                                                                                                                                                                                                                                             |
| renderWhenScrolling | `boolean`                           | `true`  | If a component is heavy to render it is recommended to set this value to `false`. It will wait for the user to stop scrolling before rendering the component, making the scroll experience much smoother.                                                                                                                                                                              |
| disableKeys | `boolean`                                   | `false` | Usually when the user is editing a cell, pressing the up, down, or return key will exit editing mode. Setting `disableKeys` to `true` will prevent this behavior. This is used when the widget needs to handle the up and down keys itself (eg. to increase the value, or select a choice). Usually the widget also needs to handle the return key by calling [stopEditing](#cell-component). |
| keepFocus   | `boolean`                                   | `false` | When you implement a widget using a portal (ie. a div that is not a direct children of the cell) you might want the cell to keep focus when the user interacts with that element even tho it is actually outside of the div itself. This mens that you have to handle the click event and call [stopEditing](#cell-component) yourself to release focus.                                     |
| disabled    | `boolean \| (({ rowData }) => boolean)`     | `false` | Disable the entire column by passing `true`, or disable it for specific rows by passing a function. Disabled cells cannot be edited.                                                                                                                                                                                                                                                                                   |
| deleteValue | `({ rowData }) => any`                      |         | A function that deletes the column value of a row. Used when the user clears a cell or deletes a row.                                                                                                                                                                                                                                                                                  |
| copyValue   | `({ rowData }) => number \| string \| null` |         | A function that returns the value of the copied cell. If the user copies multiple cells at once, this function will be called multiple times.  It can return a string, a number, or null, but it will always be turned into a string in the end.                                                                                                                                       |
| pasteValue  | `({ rowData, value }) => any`               |         | A function that takes in a row and the `value`  to be pasted, and should return the updated row. If the value should be ignored, it should still return the unchanged row. The `value` is always a string and should therefore be casted to whatever type is needed.                                                                                                                 |
| columnData  | `any`                                       |         | A value to pass to every cell component of the column through the `columnData` prop. Usually used to hold some kind of options for the column.                                                                                                                                                                                                                                        |
| component   | `Component`                                 |         | A react component that renders a cell. [Details](#cell-component)                                                                                                                                                                                                                                                                                                                               |

### Cell component

This component is used to render every cell of a column. 

| Key         | Type                           | Message                                                                                                                                                                                                                                                           |
|-------------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| rowData     | `any`                          | The row object from which tha value of the cell should be extracted.                                                                                                                                                                                              |
| rowIndex    | `number`                       | Index of the row.                                                                                                                                                                                                                                                 |
| columnIndex | `number`                       | Index of the column.                                                                                                                                                                                                                                              |
| active      | `boolean`                      | True when the cell is active / highlighted.                                                                                                                                                                                                                       |
| focus       | `boolean`                      | True when the cell is focused / being edited.                                                                                                                                                                                                                     |
| disabled    | `boolean`                      | True when the cell is disabled                                                                                                                                                                                                                                    |
| columnData  | `any`                          | The column data, see [columns definition](#columns-definition)                                                                                                                                                                                                    |
| setRowData  | `(rowData) => void`            | Function to call to update the row.                                                                                                                                                                                                                               |
| stopEditing | `({ nextRow = true }) => void` | This function can be called to exit edit mode manually. This is mainly used when  `disableKeys` is true but it can have other use-cases.  Optionally you can pass the `nextRow`  parameter to `false` so the active / highlighted cell stays on the current cell instead of going to the next row. |
| insertRowBelow | `() => void`                | This function can be called to insert a row below the current one. |
| duplicateRow | `() => void`                  | This function can be called to duplicate the current row. |
| deleteRow   | `() => void`                   | This function can be called to delete the current row. |
| getContextMenuItems | `() => ContextMenuItem[]` | This function can be called to get the list of available context menu items (insert row, duplicate selected rows...). |
