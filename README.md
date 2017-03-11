
# Sou React Table

[![npm version](https://badge.fury.io/js/sou-react-table.svg)](https://badge.fury.io/js/sou-react-table)

A spreadsheet component for React ([Demo](https://miadwang.github.io/sou-react-table/))

![SouTable](./screenshot.png?raw=true "SouTable")

## Features

- Table cell editing
- Data pasting from table editing applications e.g. **Numbers**
- Multi-cell selecting / copying / cutting / pasting
- Arrow key selecting
- Auto-filling via dragging
- Row / column inserting / deleting
- Data sorting A-Z / Z-A
- Row-column switching
- Horizontal / vertical scrolling with sticky headers
- Styling cell width / height 


## Installation

The package can be installed via NPM:

```
npm install sou-react-table --save
```

You'll need to install React and ReactDOM separately since they are not included in the package.


## Usage

`SouTable` can be used as below. You can style it by importing your own css file.

```js
import SouTable from 'sou-react-table';
import 'sou-react-table/SouTable.css';

<SouTable
  tableData={[
    { 'City', 'Beijing', 'Shanghai', 'Guangzhou' },
    { 'Temperature', '5', '22', '29' },
    { 'Weather', 'Windy', 'Sunny', 'Rainy' },
  ]}
  width={600}
  height={600}
  minTableCol={10}
  minTableRow={21}
  minCellWidth={50}
  cellHeight={28}
  getData={function getData(data) {
    console.log(data);
  }}
/>
```

### `tableData`

type: `array` of `arrays`

default value:

```js
[
  { 'City', 'Beijing', 'Shanghai', 'Guangzhou' },
  { 'Temperature', '5', '22', '29' },
  { 'Weather', 'Windy', 'Sunny', 'Rainy' },
]
```

Each column of the table data should be put into a child array.
`tableData` can be an empty `array`.

### `width`

type: `number`

Default value: auto

The width of the table in px. 

### `height`

type: `number`

Default value: auto

The height of the table in px.

**Note: Setting width and height will make the table scroll with sticky headers.**

### `minTableCol`

type: `number`

Default value: 10

The minimum number of columns of the table.

### `minTableRow`

type: `number`

Default value: 21

The minimum number of rows of the table.

### `minCellwidth`

type: `number`

Default value: 50

The minimum width of the cell in px.

### `cellHeight`

type: `number`

Default value: 28

The height of the cell in px.

### `getData`

type: `function`

default value:

```js
function getData(data) {
  console.log(data);
}
```

Callback function `getData` is executed when table data changes. The changed table data will be passed as the parameter.

## Browser Compatibility

Only **Chrome** at present.

## Contributing

Welcome all contributions. You can submit any ideas as [pull requests](https://github.com/miadwang/sou-react-table/pulls) or as [GitHub issues](https://github.com/miadwang/sou-react-table/issues).

## License

Copyright (c) 2017 Mia Wang. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.
