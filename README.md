
# Sou React Table

A spreadsheet component for React

![SouTable](./SouTable.png?raw=true "SouTable")

## Features

- Table cell editing
- Data pasting from table editing applications e.g. **Numbers**
- Multi-cell selecting / copying / cutting / pasting
- Arrow key selecting
- Auto-filling via dragging
- Row / column inserting / deleting
- Data sorting A-Z / Z-A
- Row-column switching


## Installation

The package can be installed via NPM:

```
npm install sou-react-table --save
```

You'll need to install React and ReactDOM separately since they are not included in the package.


## Usage

`SouTable` can be used as below

```js
import SouTable from 'sou-react-table';
import SouTable.css from 'sou-react-table';

<SouTable
  tableData = [
    { 'City', 'Beijing', 'Shanghai', 'Guangzhou' },
    { 'Temperature', '5', '22', '29' },
    { 'Weather', 'Windy', 'Sunny', 'Rainy' },
  ]
  minTableCol = 10
  minTableRow = 21
  getData = function getData(data) {
    console.log(data);
  }
/>
```

### `tableData`

type: `array` of `arrays`

Each column of the table data should be put into a child array.
`tableData` can be an empty `array`.

### `minTableCol`

type: `number`

The minimum number of columns of the table.

### `minTableRow`

type: `number`

The minimum number of rows of the table.

### `getData`

type: `function`

Callback function `getData` is executed when table data changes. The changed table data will be passed as the parameter.


## Contributing

Welcome all contributions. You can submit any ideas as [pull requests](https://github.com/miadwang/sou-react-table/pulls) or as [GitHub issues](https://github.com/miadwang/sou-react-table/issues).

## License

Copyright (c) 2017 Mia Wang. Licensed under MIT license, see [LICENSE](LICENSE) for the full license.
