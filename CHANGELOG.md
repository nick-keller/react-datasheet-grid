# Change Log

## 4.0.0
> Date: 2022-01-26
### Changed
- CSS is no longer automatically imported and should be manually imported by the end user.
  This allows support for Nextjs and other frameworks.
- `data` prop is no longer supported in favor of `value`

## 3.6.3
> Date: 2022-01-17
### Fixed
- Endless re-renders with non-integer height
- Right and bottom shadow had false positive with non-integer sizes

## 3.6.2
> Date: 2022-01-13
### Fixed
- Flickering effect caused by scrollbars on non-integer pixel widths

## 3.6.0
> Date: 2021-12-30
### Added
- New column prop `prePasteValues`

## 3.5.0
> Date: 2021-12-26
### Added
- New prop `rowClassName`

## 3.4.0
> Date: 2021-12-23
### Added
- `onChange` now receives a second argument to track which rows were updated.

## 3.3.9
> Date: 2021-12-07
### Fixed
- Selection was overflowing when pasting a single row that overflows to the right
- A state could be updated (triggering a warning) after the component was unmounted
- Do not submit the form when adding a row

## 3.3.8
> Date: 2021-12-05
### Added
- CI and tests

## 3.3.7
> Date: 2021-11-23
### Added
- Now uses CSS custom properties to style DSG for easier customization.

## 3.3.6
> Date: 2021-11-20
### Added
- The `gutterColumn` prop now supports `false` to disable the gutter.
### Fixed
- Update context menu style to force text color to be black event when parent is white.

## 3.3.5
> Date: 2021-11-03
### Fixed
- Typo: ~~bellow~~ → below. For backward compatibility this does not affect the `type` of `ContextMenuItem`, it is still `INSERT_ROW_BELLOW`

## 3.3.4
> Date: 2021-11-02
### Fixed
- Pasting more columns than available caused a crash

## 3.3.3
> Date: 2021-10-13
### Added
- The package now exports `createTextColumn` that allows to create text-based columns from simple parsing and formatting functions.
  `floatColumn`, `intColumn`, `percentColumn`, and `textColumn` are now built using it.
- `floatColumn`, `intColumn`, and `percentColumn` now format the value when blurred using Intl

## 3.3.2
> Date: 2021-10-13
### Fixed
- `onBlur` was not passing the right cell to the callback

## 3.3.1
> Date: 2021-10-12
### Added
- Pressing Tab from the last cell of a row now moves the active
  cell to the first cell of the following row
- Pressing Shift+Tab from the first cell of a row now moves the active
  cell to the last cell of the previous row
- Draggable corner is now gray when the selection is disabled
- Draggable corner is hidden when all columns of the selection are disabled
### Fixed
- Fix typescript error in SelectionContext.ts
- Update tsconfig for better module compatibility

## 3.3.0
> Date: 2021-09-21
### Added
- User can now drag the corner of the selection to expand it.
### Fixed
- Headers width computation could be off in certain conditions because of the way flexbox computes 
  width when items have padding.

## 3.2.3
> Date: 2021-09-19
### Fixed
- Initial height computation made the grid jump 1 pixel

## 3.2.2
> Date: 2021-09-14
### Fixed
- Issues with SSR and DOMParser

## 3.2.0
> Date: 2021-09-14
### Added
- `activeCell` and `selection` of the ref now include `colId` if the column has an id.
- New props `onFocus`, `onBlur`, `onActiveCellChange`, and `onSelectionChange`
### Changed
- Prop `data` on `<DataSheetGrid/>` has been renamed `value` to match standards. `data` is still supported 
  but is now deprecated and support will be dropped on next major version.

## 3.1.2
> Date: 2021-09-07
### Improved
- Improved accessibility by allowing to focus next tabbable element in the dom when tabbing from the last cell, 
  and previous element when Shift+Tab from the first cell.

## 3.1.1
> Date: 2021-09-07
### Improved
- Improved copy / pasting by supporting text/html data type. Dealing with edge cases with special characters
  now works perfectly.

## 3.1.0
> Date: 2021-09-03
### Added
- Columns can now have an `id`, making `setActiveCell` and `setSelection` easier to use by specifying the column's `id` 
  instead of its index.

## 3.0.0
> Date: 2021-09-03
### Breaking changes
- Prop `isRowEmpty` on `<DataSheetGrid/>` has been deleted in favor of `isCellEmpty` on each column.

## 2.0.11
> Date: 2021-09-01 
### Added
- `disabled`, `deleteValue`, `copyValue`, `pasteValue`, `duplicateRow`, and `isRowEmpty` now have access to the `rowIndex`
- Columns can now specify `headerClassName` and `cellClassName`
- `<DataSheetGrid/>` now has `style` and `className` props

## Anterior versions
Changes were not track properly.
