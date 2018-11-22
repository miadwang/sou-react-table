import React, { Component } from 'react';
import PropTypes from 'prop-types';

const trimData = (tableData) => {
  const tableDataCol = tableData.length;
  const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
  const newTableData = [];
  let newTableDataCol = tableDataCol;
  let newTableDataRow = tableDataRow;

  for (let i = newTableDataCol - 1; i >= 0; i -= 1) {
    if (tableData[i].every(datum => datum === '')) {
      newTableDataCol -= 1;
    } else {
      break;
    }
  }
  loop: { // eslint
    for (let j = newTableDataRow - 1; j >= 0; j -= 1) {
      for (let i = 0; i < tableDataCol; i += 1) {
        if (tableData[i][j] !== '') {
          break loop;
        }
      }
      newTableDataRow -= 1;
    }
  }

  for (let i = 0; i < newTableDataCol; i += 1) {
    newTableData[i] = tableData[i].slice(0, newTableDataRow);
  }
  return newTableData;
};

class SouTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: props.tableData,
      tableCol: Math.max(props.minTableCol, props.tableData.length),
      tableRow: Math.max(props.minTableRow, props.tableData.length > 0
        ? props.tableData[0].length : 0),
      colIndex: undefined,
      rowIndex: undefined,
      endColIndex: undefined,
      endRowIndex: undefined,
      dragColIndex: undefined,
      dragRowIndex: undefined,
      inputValue: '',
      isTyping: false,
      isContextMenuHidden: true,
      isDragging: false,
      innerClipboardData: undefined,
    };

    this.onContextMenu = this.onContextMenu.bind(this);
    this.hideContextMenu = this.hideContextMenu.bind(this);
    this.selectCell = this.selectCell.bind(this);
    this.selectNextCell = this.selectNextCell.bind(this);
    this.showEmptyInput = this.showEmptyInput.bind(this);
    this.showInput = this.showInput.bind(this);
    this.onChangeInputValue = this.onChangeInputValue.bind(this);
    this.onInputKeyPress = this.onInputKeyPress.bind(this);
    this.onInputKeyDown = this.onInputKeyDown.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.getTableDataForPaste = this.getTableDataForPaste.bind(this);
    this.updateTableOnPaste = this.updateTableOnPaste.bind(this);
    this.updateTableOnAutoPaste = this.updateTableOnAutoPaste.bind(this);
    this.insertCol = this.insertCol.bind(this);
    this.insertRow = this.insertRow.bind(this);
    this.deleteCol = this.deleteCol.bind(this);
    this.deleteRow = this.deleteRow.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onGripMouseDown = this.onGripMouseDown.bind(this);
    this.onMouseOver = this.onMouseOver.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.copy = this.copy.bind(this);
    this.clearCells = this.clearCells.bind(this);
    this.cut = this.cut.bind(this);
    this.paste = this.paste.bind(this);
    this.onCopy = this.onCopy.bind(this);
    this.onCut = this.onCut.bind(this);
    this.onPaste = this.onPaste.bind(this);
    this.getSwitchedTableData = this.getSwitchedTableData.bind(this);
    this.switchColRow = this.switchColRow.bind(this);
    this.sort = this.sort.bind(this);
    this.onLeftHeaderScroll = this.onLeftHeaderScroll.bind(this);
    this.onTopHeaderScroll = this.onTopHeaderScroll.bind(this);
    this.onInnerTableScroll = this.onInnerTableScroll.bind(this);
    this.styleTable = this.styleTable.bind(this);
    this.renderBorders = this.renderBorders.bind(this);
    this.styleBorders = this.styleBorders.bind(this);
    this.renderContext = this.renderContext.bind(this);
  }

  componentDidMount() {
    this.styleTable();
  }

  componentWillReceiveProps(nextProps) {
    this.setState(prevState => ({
      tableData: nextProps.tableData,
      tableCol: Math.max(nextProps.minTableCol,
        nextProps.tableData.length, prevState.tableCol),
      tableRow: Math.max(nextProps.minTableRow, nextProps.tableData.length > 0
        ? nextProps.tableData[0].length : 0, prevState.tableRow),
    }));
  }

  componentDidUpdate() {
    if (this.state.colIndex !== undefined) {
      this.styleTable();
      this.styleBorders();
    }
  }

  onContextMenu(e) {
    e.preventDefault();
    const { target } = e;
    const wrapperRect = this.wrapper.getBoundingClientRect();
    const contextMenuState = {
      xPos: e.clientX - wrapperRect.left,
      yPos: e.clientY - wrapperRect.top,
      isContextMenuHidden: false,
    };
    if (target.tagName === 'TD' || target.tagName === 'TH') {
      if (target.className === 'sou-selected-cell') {
        this.setState(contextMenuState);
      } else {
        this.selectCell(target, Object.assign({}, this.mouseDownState, contextMenuState));
      }
    } else if (e.target.tagName === 'INPUT') {
      this.setState(contextMenuState);
    }
    this.mouseDownState = undefined;
  }

  hideContextMenu() {
    this.setState({
      isContextMenuHidden: true,
    });
  }

  selectCell(td, additionalState) {
    if (this.state.isTyping) {
      this.updateTable(this.state.inputValue);
    }
    const inputValue = td.textContent;
    this.setState(Object.assign({
      inputValue,
      isTyping: false,
      isContextMenuHidden: true,
      isMultiSelecting: false,
      isDragging: false,
      endColIndex: undefined,
      endRowIndex: undefined,
      dragColIndex: undefined,
      dragRowIndex: undefined,
    }, additionalState), () => this.input.select());
  }

  selectNextCell(v, h) {
    const { tableCol, tableRow } = this.state;
    let { colIndex, rowIndex } = this.state;
    if (h !== 0) {
      colIndex = h === -1 ? Math.max(colIndex + h, 0) : Math.min(colIndex + h, tableCol - 1);
    }
    if (v !== 0) {
      rowIndex = v === -1 ? Math.max(rowIndex + v, 0) : Math.min(rowIndex + v, tableRow - 1);
    }
    const nextTd = this.table.querySelector(`[data-col='${colIndex}'][data-row='${rowIndex}']`);
    this.selectCell(nextTd, { colIndex, rowIndex });
  }

  showEmptyInput() {
    this.setState({
      inputValue: '',
      isTyping: true,
      isContextMenuHidden: true,
    });
  }

  showInput() {
    this.input.selectionStart = this.input.selectionEnd;
    this.setState({
      isTyping: true,
      isContextMenuHidden: true,
    });
  }

  onChangeInputValue() {
    const inputValue = this.input.value;
    this.setState({ inputValue });
  }

  onInputKeyPress(e) {
    if (!this.state.isTyping) {
      if (e.key === 'Enter') {
        this.showInput();
      } else {
        this.showEmptyInput();
      }
    } else if (e.key === 'Enter') {
      this.selectNextCell(1, 0);
    }
  }

  onInputKeyDown(e) {
    if (!this.state.isContextMenuHidden) {
      this.hideContextMenu();
    }
    if (!this.state.isTyping) {
      switch (e.key) {
        case 'Backspace':
          if (this.state.endColIndex === undefined) {
            this.updateTable('');
          } else {
            this.clearCells();
          }
          break;
        case 'ArrowUp':
          this.selectNextCell(-1, 0);
          break;
        case 'ArrowDown':
          this.selectNextCell(1, 0);
          break;
        case 'ArrowLeft':
          this.selectNextCell(0, -1);
          break;
        case 'ArrowRight':
          this.selectNextCell(0, 1);
          break;
        case 'Tab':
          e.preventDefault();
          this.selectNextCell(0, 1);
          break;
        default:
          break;
      }
    }
  }

  updateTable(value) {
    const { tableData, colIndex, rowIndex } = this.state;
    const newTableData = [];
    const tableDataCol = tableData.length;
    const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
    const newTableDataCol = Math.max(colIndex + 1, tableDataCol);
    const newTableDataRow = Math.max(rowIndex + 1, tableDataRow);

    for (let i = 0; i < newTableDataCol; i += 1) {
      newTableData[i] = [];
      for (let j = 0; j < newTableDataRow; j += 1) {
        if (i === colIndex && j === rowIndex) {
          newTableData[i][j] = value;
        } else if (i < tableDataCol && j < tableDataRow) {
          newTableData[i][j] = tableData[i][j];
        } else {
          newTableData[i][j] = '';
        }
      }
    }

    const trimmedTableData = trimData(newTableData);
    this.setState({
      tableData: trimmedTableData,
    });
    this.props.getData(trimmedTableData);
  }

  getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex) {
    const { tableData } = this.state;
    const newTableData = [];
    const tableDataCol = tableData.length;
    const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
    const pasteDataCol = pasteData.length > 0 ? pasteData[0].length : 0;
    const pasteDataRow = pasteData.length;
    const newTableDataCol = Math.max(pasteColIndex + pasteDataCol, tableDataCol);
    const newTableDataRow = Math.max(pasteRowIndex + pasteDataRow, tableDataRow);

    for (let i = 0; i < newTableDataCol; i += 1) {
      newTableData[i] = [];
      for (let j = 0; j < newTableDataRow; j += 1) {
        if (i >= pasteColIndex && i < pasteColIndex + pasteDataCol
          && j >= pasteRowIndex && j < pasteRowIndex + pasteDataRow) {
          newTableData[i][j] = pasteData[j - pasteRowIndex][i - pasteColIndex];
        } else if (i < tableDataCol && j < tableDataRow) {
          newTableData[i][j] = tableData[i][j];
        } else {
          newTableData[i][j] = '';
        }
      }
    }

    return trimData(newTableData);
  }

  updateTableOnPaste(data, selectAfterPaste = true) {
    const {
      colIndex, rowIndex, endColIndex, endRowIndex,
    } = this.state;
    const dataCol = data[0].length;
    const dataRow = data.length;
    let pasteData = data;
    if (dataRow === 1 && dataCol === 1 && endColIndex === undefined) {
      // 1 to 1 copy-paste
      this.updateTable(pasteData[0][0]);
    } else {
      // 1 to n, n to 1, n to n copy-paste

      // step 1-1: get paste cells
      // n to 1 as default
      let pasteColIndex = colIndex; let pasteRowIndex = rowIndex;


      let selectCol = 1; let selectRow = 1;


      let pasteCol = dataCol; let
        pasteRow = dataRow;
      if (endColIndex !== undefined) {
        // 1 to n, n to n
        pasteColIndex = Math.min(colIndex, endColIndex);
        pasteRowIndex = Math.min(rowIndex, endRowIndex);
        selectCol = Math.abs(endColIndex - colIndex) + 1;
        selectRow = Math.abs(endRowIndex - rowIndex) + 1;
        pasteCol = Math.max(dataCol, selectCol);
        pasteRow = Math.max(dataRow, selectRow);
        if (selectCol > dataCol || selectRow > dataRow) {
          // step 1-2: get paste data if select area larger than data,
          pasteData = [];
          for (let i = 0; i < pasteRow; i += 1) {
            pasteData[i] = [];
            for (let j = 0; j < pasteCol; j += 1) {
              pasteData[i][j] = data[i % dataRow][j % dataCol];
            }
          }
        }
      }

      // step 2: get new table data
      const trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
      this.props.getData(trimmedData);

      // step 3: select cells and expand table after paste
      if (selectAfterPaste) {
        const pasteTd = this.table.querySelector(`[data-col='${pasteColIndex}'][data-row='${pasteRowIndex}']`);
        const pasteEndColIndex = pasteColIndex + pasteCol - 1;
        const pasteEndRowIndex = pasteRowIndex + pasteRow - 1;
        this.selectCell(pasteTd, {
          tableData: trimmedData,
          tableCol: Math.max(this.state.tableCol, trimmedData.length),
          tableRow: Math.max(this.state.tableRow, trimmedData.length > 0
            ? trimmedData[0].length : 0),
          colIndex: pasteColIndex,
          rowIndex: pasteRowIndex,
          endColIndex: pasteEndColIndex,
          endRowIndex: pasteEndRowIndex,
          innerClipboardData: data,
        });
      } else {
        this.setState(prevState => ({
          tableData: trimmedData,
          tableCol: Math.max(prevState.tableCol, trimmedData.length),
          tableRow: Math.max(prevState.tableRow, trimmedData.length > 0
            ? trimmedData[0].length : 0),
        }));
      }
    }
  }

  updateTableOnAutoPaste() {
    // step 1: get paste and select cells
    const {
      colIndex, rowIndex, endColIndex, endRowIndex, dragColIndex, dragRowIndex,
    } = this.state;
    let pasteColIndex; let pasteRowIndex;


    let pasteCol = 1; let pasteRow = 1;


    let selectColIndex; let selectRowIndex; let selectEndColIndex; let
      selectEndRowIndex;
    if (endColIndex === undefined) {
      if (dragRowIndex === rowIndex) {
        // drag in row
        pasteRowIndex = rowIndex;
        pasteCol = Math.abs(dragColIndex - colIndex);
        selectRowIndex = rowIndex;
        selectEndRowIndex = rowIndex;
        if (dragColIndex > colIndex) {
          // drag right
          pasteColIndex = colIndex + 1;
          selectColIndex = colIndex;
          selectEndColIndex = dragColIndex;
        } else {
          // drag left
          pasteColIndex = dragColIndex;
          selectColIndex = dragColIndex;
          selectEndColIndex = colIndex;
        }
      } else {
        // drag in col
        pasteColIndex = colIndex;
        pasteRow = Math.abs(dragRowIndex - rowIndex);
        selectColIndex = colIndex;
        selectEndColIndex = colIndex;
        if (dragRowIndex < rowIndex) {
          // drag up
          pasteRowIndex = dragRowIndex;
          selectRowIndex = dragRowIndex;
          selectEndRowIndex = rowIndex;
        } else {
          // drag down
          pasteRowIndex = rowIndex + 1;
          selectRowIndex = rowIndex;
          selectEndRowIndex = dragRowIndex;
        }
      }
    } else {
      const minColIndex = Math.min(colIndex, endColIndex);
      const maxColIndex = Math.max(colIndex, endColIndex);
      const minRowIndex = Math.min(rowIndex, endRowIndex);
      const maxRowIndex = Math.max(rowIndex, endRowIndex);
      pasteCol = Math.abs(endColIndex - colIndex) + 1;
      pasteRow = Math.abs(endRowIndex - rowIndex) + 1;
      if (dragRowIndex <= maxRowIndex && dragRowIndex >= minRowIndex) {
        // drag in row
        pasteRowIndex = minRowIndex;
        selectRowIndex = minRowIndex;
        selectEndRowIndex = maxRowIndex;
        if (dragColIndex > maxColIndex) {
          // drag right
          pasteColIndex = maxColIndex + 1;
          pasteCol = dragColIndex - maxColIndex;
          selectColIndex = minColIndex;
          selectEndColIndex = dragColIndex;
        } else {
          // drag left
          pasteColIndex = dragColIndex;
          pasteCol = minColIndex - dragColIndex;
          selectColIndex = dragColIndex;
          selectEndColIndex = maxColIndex;
        }
      } else {
        // drag in col
        pasteColIndex = minColIndex;
        selectColIndex = minColIndex;
        selectEndColIndex = maxColIndex;
        if (dragRowIndex < minRowIndex) {
          // drag up
          pasteRowIndex = dragRowIndex;
          pasteRow = minRowIndex - dragRowIndex;
          selectRowIndex = dragRowIndex;
          selectEndRowIndex = maxRowIndex;
        } else {
          // drag down
          pasteRowIndex = maxRowIndex + 1;
          pasteRow = dragRowIndex - maxRowIndex;
          selectRowIndex = minRowIndex;
          selectEndRowIndex = dragRowIndex;
        }
      }
    }

    // step 2: get paste data
    const copyData = this.copy(false);
    const dataCol = copyData[0].length;
    const dataRow = copyData.length;
    const pasteData = [];
    for (let i = 0; i < pasteRow; i += 1) {
      pasteData[i] = [];
      for (let j = 0; j < pasteCol; j += 1) {
        pasteData[i][j] = copyData[i % dataRow][j % dataCol];
      }
    }

    // step 3: get new table data
    const trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
    this.props.getData(trimmedData);

    // step 4: select cells after paste
    const selectTd = this.table.querySelector(`[data-col='${selectColIndex}'][data-row='${selectRowIndex}']`);
    this.selectCell(selectTd, {
      tableData: trimmedData,
      colIndex: selectColIndex,
      rowIndex: selectRowIndex,
      endColIndex: selectEndColIndex,
      endRowIndex: selectEndRowIndex,
    });
  }

  insertCol(d) {
    return () => {
      const { tableData, tableCol, colIndex } = this.state;
      if (colIndex + d < tableData.length) {
        const emptyCol = [];
        for (let i = 0; i < tableData.length + 1; i += 1) {
          emptyCol.push('');
        }
        tableData.splice(colIndex + d, 0, emptyCol);
        this.setState({
          tableData,
          tableCol: tableCol + 1,
        });
        this.props.getData(tableData);
      } else {
        this.setState({
          tableCol: tableCol + 1,
        });
      }
    };
  }

  insertRow(d) {
    return () => {
      const { tableData, tableRow, rowIndex } = this.state;
      const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      if (rowIndex + d < tableDataRow) {
        for (let i = 0; i < tableData.length; i += 1) {
          tableData[i].splice(rowIndex + d, 0, '');
        }
        this.setState({
          tableData,
          tableRow: tableRow + 1,
        });
        this.props.getData(tableData);
      } else {
        this.setState({
          tableRow: tableRow + 1,
        });
      }
    };
  }

  deleteCol() {
    const { tableData, tableCol, colIndex } = this.state;
    if (colIndex < tableData.length) {
      tableData.splice(colIndex, 1);
      this.setState({
        tableData,
        tableCol: tableCol > this.props.minTableCol ? tableCol - 1 : tableCol,
      });
      this.props.getData(tableData);
    } else {
      this.setState({
        tableCol: tableCol > this.props.minTableCol ? tableCol - 1 : tableCol,
      });
    }
  }

  deleteRow() {
    const { tableData, tableRow, rowIndex } = this.state;
    const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
    if (rowIndex < tableDataRow) {
      for (let i = 0; i < tableData.length; i += 1) {
        tableData[i].splice(rowIndex, 1);
      }
      this.setState({
        tableData,
        tableRow: tableRow > this.props.minTableRow ? tableRow - 1 : tableRow,
      });
      this.props.getData(tableData);
    } else {
      this.setState({
        tableRow: tableRow > this.props.minTableRow ? tableRow - 1 : tableRow,
      });
    }
  }

  onMouseDown(e) {
    e.preventDefault();
    const { target } = e;
    let colIndex = Number(target.getAttribute('data-col'));
    let rowIndex = Number(target.getAttribute('data-row'));
    if ((target.tagName === 'TD' || target.tagName === 'TH') && !(rowIndex === -1 && colIndex === -1)) {
      const { tableCol, tableRow } = this.state;
      let endColIndex;
      let endRowIndex;
      let isMultiSelecting = false;
      if (rowIndex !== -1 && colIndex === -1) {
        colIndex = 0;
        endColIndex = tableCol - 1;
        endRowIndex = rowIndex;
        isMultiSelecting = 'row';
      } else if (rowIndex === -1 && colIndex !== -1) {
        rowIndex = 0;
        endColIndex = colIndex;
        endRowIndex = tableRow - 1;
        isMultiSelecting = 'col';
      }

      this.mouseDownState = {
        colIndex,
        rowIndex,
        endColIndex,
        endRowIndex,
        isMultiSelecting,
      };
      if (e.button === 0) {
        this.selectCell(target, this.mouseDownState);
      }
    }
  }

  onGripMouseDown(e) {
    e.preventDefault();
    this.setState({
      isDragging: true,
    });
  }

  onMouseOver(e) {
    e.preventDefault();
    const { target } = e;
    if ((target.tagName === 'TD' || target.tagName === 'TH')) {
      const targetColIndex = Number(target.getAttribute('data-col'));
      const targetRowIndex = Number(target.getAttribute('data-row'));
      if (this.mouseDownState !== undefined) {
        const { tableCol, tableRow, isMultiSelecting } = this.state;
        const endColIndex = isMultiSelecting === 'row' ? tableCol - 1 : Math.max(targetColIndex, 0);
        const endRowIndex = isMultiSelecting === 'col' ? tableRow - 1 : Math.max(targetRowIndex, 0);
        if (!isMultiSelecting) {
          this.setState({
            isMultiSelecting: true,
            endColIndex,
            endRowIndex,
          });
        } else if (endColIndex === this.state.colIndex && endRowIndex === this.state.rowIndex) {
          this.setState({
            isMultiSelecting: false,
            endColIndex: undefined,
            endRowIndex: undefined,
          });
        } else {
          this.setState({
            endColIndex,
            endRowIndex,
          });
        }
      } else if (this.state.isDragging) {
        const {
          colIndex, rowIndex, endColIndex, endRowIndex,
        } = this.state;
        const willAutoPaste = endColIndex === undefined
          ? !(targetColIndex === colIndex && targetRowIndex === rowIndex)
          : !(
            targetColIndex <= Math.max(colIndex, endColIndex)
            && targetColIndex >= Math.min(colIndex, endColIndex)
            && targetRowIndex <= Math.max(rowIndex, endRowIndex)
            && targetRowIndex >= Math.min(rowIndex, endRowIndex)
          );
        if (willAutoPaste) {
          this.setState({
            dragColIndex: targetColIndex,
            dragRowIndex: targetRowIndex,
          });
        } else {
          this.setState({
            dragColIndex: undefined,
            dragRowIndex: undefined,
          });
        }
      }
    }
  }

  onMouseUp(e) {
    e.preventDefault();
    if (this.mouseDownState !== undefined) {
      this.setState({
        isMultiSelecting: false,
      });
      this.mouseDownState = undefined;
    } else if (this.state.isDragging && this.state.dragColIndex !== undefined) {
      this.updateTableOnAutoPaste();
    } else if (this.state.isDragging) {
      this.setState({
        isDragging: false,
      });
    }
  }

  copy(toClipboard = true) {
    const { tableData, colIndex, rowIndex } = this.state;
    let { endColIndex, endRowIndex } = this.state;
    if (endColIndex === undefined) {
      endColIndex = colIndex;
      endRowIndex = rowIndex;
    }
    const minCol = Math.min(colIndex, endColIndex);
    const maxCol = Math.max(colIndex, endColIndex);
    const minRow = Math.min(rowIndex, endRowIndex);
    const maxRow = Math.max(rowIndex, endRowIndex);
    const data = [];
    for (let i = minRow; i <= maxRow; i += 1) {
      data[i - minRow] = [];
      for (let j = minCol; j <= maxCol; j += 1) {
        if (tableData[j] !== undefined && tableData[j][i] !== undefined) {
          data[i - minRow][j - minCol] = tableData[j][i];
        } else {
          data[i - minRow][j - minCol] = '';
        }
      }
    }
    if (toClipboard) {
      this.setState({
        innerClipboardData: data,
      });
    }
    return data;
  }

  clearCells() {
    const emptyCol = Math.abs(this.state.colIndex - this.state.endColIndex) || 0;
    const emptyRow = Math.abs(this.state.rowIndex - this.state.endRowIndex) || 0;
    const emptyData = [];
    for (let i = 0; i <= emptyRow; i += 1) {
      emptyData[i] = [];
      for (let j = 0; j <= emptyCol; j += 1) {
        emptyData[i][j] = '';
      }
    }
    this.updateTableOnPaste(emptyData, false);
  }

  cut() {
    this.copy();
    this.clearCells();
  }

  paste() {
    this.updateTableOnPaste(this.state.innerClipboardData);
  }

  onCopy(e) {
    // will update innerClipboardData in copy
    e.preventDefault();
    const data = this.copy();
    const dataCol = data[0].length;
    let rawData = '';
    data.forEach((row, rowIndex) => {
      row.forEach((datum, colIndex) => {
        let tail = '\t';
        if (colIndex === dataCol - 1) {
          tail = rowIndex === data.length - 1 ? '' : '\n';
        }
        rawData += datum + tail;
      });
    });
    e.clipboardData.setData('text/plain', rawData);
  }

  onCut(e) {
    // will update innerClipboardData in onCopy
    e.preventDefault();
    this.onCopy(e);
    this.clearCells();
  }

  onPaste(e) {
    // will update innerClipboardData in updateTableOnPaste
    e.preventDefault();
    const rawData = e.clipboardData.getData('Text');
    const data = [];
    rawData.split('\n').forEach((row, index) => {
      data[index] = row.split('\t');
    });
    this.updateTableOnPaste(data);
  }

  getSwitchedTableData(tableData = this.state.tableData) {
    const switchedTableData = [];
    const tableDataCol = tableData.length;
    const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
    for (let i = 0; i < tableDataRow; i += 1) {
      switchedTableData[i] = [];
      for (let j = 0; j < tableDataCol; j += 1) {
        switchedTableData[i][j] = tableData[j][i];
      }
    }
    return switchedTableData;
  }

  switchColRow() {
    const { tableData } = this.state;
    const tableDataCol = tableData.length;
    const tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
    const newTableData = this.getSwitchedTableData();
    this.setState(prevState => ({
      tableData: newTableData,
      tableCol: Math.max(this.props.minTableCol, tableDataRow, prevState.tableCol),
      tableRow: Math.max(this.props.minTableRow, tableDataCol, prevState.tableRow),
    }));
    this.props.getData(newTableData);
  }

  sort(inverse = false) {
    return () => {
      const { colIndex } = this.state;
      const switchedTableData = this.getSwitchedTableData();
      const firstRow = switchedTableData[0];
      const restRows = switchedTableData.slice(1);
      if (inverse) {
        restRows.sort((a, b) => {
          if (!Number.isNaN(+a[colIndex]) && !Number.isNaN(+b[colIndex])) {
            return b[colIndex] - a[colIndex];
          }
          if (b[colIndex] < a[colIndex]) {
            return -1;
          }
          if (b[colIndex] > a[colIndex]) {
            return 1;
          }
          return 0;
        });
      } else {
        restRows.sort((a, b) => {
          if (!Number.isNaN(+a[colIndex]) && !Number.isNaN(+b[colIndex])) {
            return a[colIndex] - b[colIndex];
          }
          if (a[colIndex] < b[colIndex]) {
            return -1;
          }
          if (a[colIndex] > b[colIndex]) {
            return 1;
          }
          return 0;
        });
      }
      const sortedTableData = this.getSwitchedTableData([firstRow].concat(restRows));
      this.setState({
        tableData: sortedTableData,
      });
      this.props.getData(sortedTableData);
    };
  }

  onLeftHeaderScroll() {
    const { scrollTop } = this.leftHeader;
    if (this.scrollTop !== scrollTop) {
      this.scrollTop = scrollTop;
      this.innerTable.scrollTop = scrollTop;
      if (scrollTop > 0) {
        this.topHeader.style.height = `${this.props.cellHeight + 1}px`;
        this.innerTable.style.marginTop = '-1px';
        this.leftHeaderHead.style.height = `${this.props.cellHeight + 1}px`;
      } else {
        this.topHeader.style.height = `${this.props.cellHeight}px`;
        this.innerTable.style.marginTop = 0;
        this.leftHeaderHead.style.height = `${this.props.cellHeight}px`;
      }
    }
  }

  onTopHeaderScroll() {
    const { scrollLeft } = this.topHeader;
    if (this.scrollLeft !== scrollLeft) {
      this.scrollLeft = scrollLeft;
      this.innerTable.scrollLeft = scrollLeft;
      if (scrollLeft > 0) {
        this.leftWrapper.style.width = `${this.props.minCellWidth + 1}px`;
      } else {
        this.leftWrapper.style.width = `${this.props.minCellWidth}px`;
      }
    }
  }

  onInnerTableScroll() {
    const { scrollTop, scrollLeft } = this.innerTable;
    if (this.scrollTop !== scrollTop) {
      this.scrollTop = scrollTop;
      this.leftHeader.scrollTop = scrollTop;
      if (scrollTop > 0) {
        this.topHeader.style.height = `${this.props.cellHeight + 1}px`;
        this.innerTable.style.marginTop = '-1px';
        this.leftHeaderHead.style.height = `${this.props.cellHeight + 1}px`;
      } else {
        this.topHeader.style.height = `${this.props.cellHeight}px`;
        this.innerTable.style.marginTop = 0;
        this.leftHeaderHead.style.height = `${this.props.cellHeight}px`;
      }
    }

    if (this.scrollLeft !== scrollLeft) {
      this.scrollLeft = scrollLeft;
      this.topHeader.scrollLeft = scrollLeft;
      if (scrollLeft > 0) {
        this.leftWrapper.style.width = `${this.props.minCellWidth + 1}px`;
      } else {
        this.leftWrapper.style.width = `${this.props.minCellWidth}px`;
      }
    }
  }

  renderTable() {
    const {
      tableData, tableCol, tableRow, colIndex, rowIndex, endColIndex, endRowIndex,
    } = this.state;
    const {
      width, height, minCellWidth, cellHeight,
    } = this.props;
    const cellStyle = {
      minWidth: `${minCellWidth}px`,
      height: `${cellHeight}px`,
    };
    const leftHeaderRows = [];
    for (let j = 0; j < tableRow; j += 1) {
      const isRowIncluded = endRowIndex !== undefined ? (j >= Math.min(rowIndex, endRowIndex)
      && j <= Math.max(rowIndex, endRowIndex)) : (j === rowIndex);
      leftHeaderRows.push(
        <tr key={j}>
          <td
            style={cellStyle}
            data-col={-1}
            data-row={j}
            className={isRowIncluded ? 'sou-selected-cell-indicator' : ''}
          >
            {j}
          </td>
        </tr>,
      );
    }

    const ths = [];
    for (let i = 1; i <= tableCol; i += 1) {
      const isColIncluded = endColIndex !== undefined ? (i - 1 >= Math.min(colIndex, endColIndex)
      && i - 1 <= Math.max(colIndex, endColIndex)) : (i - 1 === colIndex);
      ths.push(
        <th
          key={i}
          style={cellStyle}
          data-col={i - 1}
          data-row={-1}
          className={isColIncluded ? 'sou-selected-cell-indicator' : ''}
        >
          {i > 26 && String.fromCharCode(Math.floor((i - 1) / 26) + 64)}
          {String.fromCharCode(((i - 1) % 26) + 65)}
        </th>,
      );
    }

    const rows = [];
    for (let j = 0; j < tableRow; j += 1) {
      const row = (
        <tr key={j}>
          {ths.map((col, index) => {
            const isCurrent = index === colIndex && j === rowIndex;
            const isMultiSelected = index >= Math.min(colIndex, endColIndex)
              && index <= Math.max(colIndex, endColIndex)
              && j >= Math.min(rowIndex, endRowIndex)
              && j <= Math.max(rowIndex, endRowIndex);
            return (
              <td
                key={index + 1} // eslint-disable-line
                style={cellStyle}
                data-col={index}
                data-row={j}
                className={isMultiSelected ? 'sou-selected-cell' : ''}
              >
                {tableData[index] !== undefined ? tableData[index][j] : ''}
                {isCurrent && (
                  <input
                    type="text"
                    className="sou-input"
                    style={{ zIndex: this.state.isTyping ? 100 : -100 }}
                    ref={(input) => {
                      this.input = input;
                    }}
                    value={this.state.inputValue}
                    onChange={this.onChangeInputValue}
                    onKeyPress={this.onInputKeyPress}
                    onKeyDown={this.onInputKeyDown}
                    onDoubleClick={e => e.stopPropagation()}
                    onMouseDown={e => e.stopPropagation()}
                    onMouseOver={e => e.stopPropagation()}
                    onMouseUp={e => e.stopPropagation()}
                    onMouseLeave={e => e.stopPropagation()}
                    onCopy={this.onCopy}
                    onCut={this.onCut}
                    onPaste={this.onPaste}
                  />
                )}
              </td>
            );
          })}
        </tr>
      );
      rows.push(row);
    }
    return (
      <div>
        <div
          className="left-wrapper"
          style={{
            width: minCellWidth,
          }}
          ref={(leftWrapper) => {
            this.leftWrapper = leftWrapper;
          }}
        >
          <table
            className="sou-table-left-header"
          >
            <thead
              style={{
                height: `${cellHeight}px`,
              }}
              ref={(leftHeaderHead) => {
                this.leftHeaderHead = leftHeaderHead;
              }}
            >
              <tr>
                <th
                  style={cellStyle}
                  data-col={-1}
                  data-row={-1}
                  onClick={this.switchColRow}
                  onContextMenu={e => e.preventDefault()}
                >
                  switch
                </th>
              </tr>
            </thead>

            <tbody
              style={{
                marginTop: cellHeight,
                height: `${height - cellHeight}px`,
              }}
              onContextMenu={this.onContextMenu}
              onMouseDown={this.onMouseDown}
              onMouseOver={this.onMouseOver}
              onMouseUp={this.onMouseUp}
              ref={(leftHeader) => {
                this.leftHeader = leftHeader;
              }}
              onScroll={this.onLeftHeaderScroll}
            >
              {leftHeaderRows}
            </tbody>
          </table>
        </div>

        <div className="right-wrapper">
          <div
            className="right-top-wrapper"
            style={{
              width: `${width - minCellWidth - 1}px`,
              height: `${cellHeight}px`,
            }}
            ref={(topHeader) => {
              this.topHeader = topHeader;
            }}
            onScroll={this.onTopHeaderScroll}
          >
            <table
              className="sou-table"
              onContextMenu={this.onContextMenu}
              onMouseDown={this.onMouseDown}
              onMouseOver={this.onMouseOver}
              onMouseUp={this.onMouseUp}
            >
              <thead>
                <tr>
                  {ths}
                </tr>
              </thead>
            </table>
          </div>

          <div
            className="right-bottom-wrapper"
            style={{
              width: `${width - minCellWidth - 1}px`,
              height: `${height - cellHeight}px`,
            }}
            ref={(innerTable) => {
              this.innerTable = innerTable;
            }}
            onScroll={this.onInnerTableScroll}
          >
            <div className="inner-wrapper">
              <table
                className="sou-table"
                ref={(table) => {
                  this.table = table;
                }}
                onContextMenu={this.onContextMenu}
                onMouseDown={this.onMouseDown}
                onMouseOver={this.onMouseOver}
                onMouseUp={this.onMouseUp}
              >
                <tbody
                  onDoubleClick={() => {
                    this.showInput();
                  }}
                >
                  {rows}
                </tbody>
              </table>

              {this.renderBorders()}
            </div>
          </div>
        </div>
      </div>
    );
  }

  styleTable() {
    const { tableCol } = this.state;
    const theadTr = document.querySelector('.sou-table > thead > tr');
    const ths = theadTr.children;
    const tbodyTr = document.querySelector('.sou-table > tbody > tr');
    const tds = tbodyTr.children;
    theadTr.style.width = `${tbodyTr.offsetWidth + 1}px`;
    ths[0].style.width = `${tds[0].offsetWidth + 1}px`;
    for (let i = 1; i < tableCol; i += 1) {
      ths[i].style.width = `${tds[i].offsetWidth}px`;
    }
  }

  renderBorders() {
    return (
      <div
        className="sou-borders"
        onMouseDown={e => e.preventDefault()}
        onMouseUp={this.onMouseUp}
        onContextMenu={e => e.preventDefault()}
      >
        {this.state.dragColIndex !== undefined && (
        <div className="sou-paste-borders">
          <div />
          <div />
          <div />
          <div />
        </div>
        )}

        {this.state.endColIndex !== undefined && (
        <div className="sou-area-borders">
          <div />
          <div />
          <div />
          <div />
          <div
            className="sou-drag-grip"
            onMouseDown={this.onGripMouseDown}
          />
        </div>
        )}

        {this.state.colIndex !== undefined && (
        <div className="sou-current-borders">
          <div />
          <div />
          <div />
          <div />

          {this.state.endColIndex === undefined && (
          <div
            className="sou-drag-grip"
            onMouseDown={this.onGripMouseDown}
          />
          )}
        </div>
        )}
      </div>
    );
  }

  styleBorders() {
    const {
      colIndex, rowIndex, endColIndex, endRowIndex, dragColIndex, dragRowIndex,
    } = this.state;
    const currentTd = this.table.querySelector(`[data-col='${colIndex}'][data-row='${rowIndex}']`);
    const {
      offsetTop, offsetLeft, offsetWidth, offsetHeight,
    } = currentTd;

    const currentBorders = document.querySelectorAll('.sou-current-borders > div');
    currentBorders[0].setAttribute('style', `top: ${offsetTop}px; left: ${offsetLeft}px; width: ${offsetWidth}px; height: 2px;`);
    currentBorders[1].setAttribute('style', `top: ${offsetTop}px; left: ${offsetLeft + offsetWidth - 1}px; width: 2px; height: ${offsetHeight}px;`);
    currentBorders[2].setAttribute('style', `top: ${offsetTop + offsetHeight - 1}px; left: ${offsetLeft}px; width: ${offsetWidth}px; height: 2px;`);
    currentBorders[3].setAttribute('style', `top: ${offsetTop}px; left: ${offsetLeft}px; width: 2px; height: ${offsetHeight}px;`);

    let multiSelectOffsetTop;
    let multiSelectOffsetLeft;
    let multiSelectOffsetWidth;
    let multiSelectOffsetHeight;


    let autoPasteOffsetTop;
    let autoPasteOffsetLeft;
    let autoPasteOffsetWidth;
    let autoPasteOffsetHeight;

    if (endColIndex !== undefined) {
      const endTd = this.table.querySelector(`[data-col='${endColIndex}'][data-row='${endRowIndex}']`);
      const endOffsetTop = endTd.offsetTop;
      const endOffsetLeft = endTd.offsetLeft;
      const endOffsetWidth = endTd.offsetWidth;
      const endOffsetHeight = endTd.offsetHeight;
      multiSelectOffsetTop = Math.min(offsetTop, endOffsetTop);
      multiSelectOffsetLeft = Math.min(offsetLeft, endOffsetLeft);
      multiSelectOffsetWidth = offsetLeft >= endOffsetLeft
        ? offsetLeft - endOffsetLeft + offsetWidth : endOffsetLeft - offsetLeft + endOffsetWidth;
      multiSelectOffsetHeight = offsetTop >= endOffsetTop
        ? offsetTop - endOffsetTop + offsetHeight : endOffsetTop - offsetTop + endOffsetHeight;

      const areaBorders = document.querySelectorAll('.sou-area-borders > div');
      areaBorders[0].setAttribute('style', `top: ${multiSelectOffsetTop}px; left: ${multiSelectOffsetLeft}px; width: ${multiSelectOffsetWidth}px; height: 1px;`);
      areaBorders[1].setAttribute('style', `top: ${multiSelectOffsetTop}px; left: ${multiSelectOffsetLeft + multiSelectOffsetWidth}px; width: 1px; height: ${multiSelectOffsetHeight}px;`);
      areaBorders[2].setAttribute('style', `top: ${multiSelectOffsetTop + multiSelectOffsetHeight}px; left: ${multiSelectOffsetLeft}px; width: ${multiSelectOffsetWidth}px; height: 1px;`);
      areaBorders[3].setAttribute('style', `top: ${multiSelectOffsetTop}px; left: ${multiSelectOffsetLeft}px; width: 1px; height: ${multiSelectOffsetHeight}px;`);
      areaBorders[4].setAttribute('style', `display: ${this.state.isTyping ? 'none' : 'initial'}; top: ${multiSelectOffsetTop + multiSelectOffsetHeight - 4}px; left: ${multiSelectOffsetLeft + multiSelectOffsetWidth - 4}px;`);
    } else {
      currentBorders[4].setAttribute('style', `display: ${this.state.isTyping ? 'none' : 'initial'}; top: ${offsetTop + offsetHeight - 4}px; left: ${offsetLeft + offsetWidth - 4}px;`);
    }

    if (dragColIndex !== undefined) {
      const dragTd = this.table.querySelector(`[data-col='${dragColIndex}'][data-row='${dragRowIndex}']`);
      const dragOffsetTop = dragTd.offsetTop;
      const dragOffsetLeft = dragTd.offsetLeft;
      const dragOffsetWidth = dragTd.offsetWidth;
      const dragOffsetHeight = dragTd.offsetHeight;
      if (endColIndex === undefined) {
        if (dragRowIndex === rowIndex) {
          if (dragColIndex > colIndex) {
            // drag right
            autoPasteOffsetTop = offsetTop;
            autoPasteOffsetLeft = offsetLeft + offsetWidth;
            autoPasteOffsetWidth = dragOffsetLeft + dragOffsetWidth - autoPasteOffsetLeft;
            autoPasteOffsetHeight = offsetHeight;
          } else {
            // drag left
            autoPasteOffsetTop = offsetTop;
            autoPasteOffsetLeft = dragOffsetLeft;
            autoPasteOffsetWidth = offsetLeft - dragOffsetLeft;
            autoPasteOffsetHeight = offsetHeight;
          }
        } else if (dragRowIndex < rowIndex) {
          // drag up
          autoPasteOffsetTop = dragOffsetTop;
          autoPasteOffsetLeft = offsetLeft;
          autoPasteOffsetWidth = offsetWidth;
          autoPasteOffsetHeight = offsetTop - dragOffsetTop;
        } else {
          // drag down
          autoPasteOffsetTop = offsetTop + offsetHeight;
          autoPasteOffsetLeft = offsetLeft;
          autoPasteOffsetWidth = offsetWidth;
          autoPasteOffsetHeight = dragOffsetTop + dragOffsetHeight - autoPasteOffsetTop;
        }
      } else if (dragRowIndex <= Math.max(rowIndex, endRowIndex)
        && dragRowIndex >= Math.min(rowIndex, endRowIndex)
      ) {
        if (dragColIndex > Math.max(colIndex, endColIndex)) {
          // drag right
          autoPasteOffsetTop = multiSelectOffsetTop;
          autoPasteOffsetLeft = multiSelectOffsetLeft + multiSelectOffsetWidth;
          autoPasteOffsetWidth = dragOffsetLeft + dragOffsetWidth - autoPasteOffsetLeft;
          autoPasteOffsetHeight = multiSelectOffsetHeight;
        } else {
          // drag left
          autoPasteOffsetTop = multiSelectOffsetTop;
          autoPasteOffsetLeft = dragOffsetLeft;
          autoPasteOffsetWidth = multiSelectOffsetLeft - dragOffsetLeft;
          autoPasteOffsetHeight = multiSelectOffsetHeight;
        }
      } else if (dragRowIndex < Math.min(rowIndex, endRowIndex)) {
        // drag up
        autoPasteOffsetTop = dragOffsetTop;
        autoPasteOffsetLeft = multiSelectOffsetLeft;
        autoPasteOffsetWidth = multiSelectOffsetWidth;
        autoPasteOffsetHeight = multiSelectOffsetTop - dragOffsetTop;
      } else {
        // drag down
        autoPasteOffsetTop = multiSelectOffsetTop + multiSelectOffsetHeight;
        autoPasteOffsetLeft = multiSelectOffsetLeft;
        autoPasteOffsetWidth = multiSelectOffsetWidth;
        autoPasteOffsetHeight = dragOffsetTop + dragOffsetHeight - autoPasteOffsetTop;
      }

      const pasteBorders = document.querySelectorAll('.sou-paste-borders > div');
      pasteBorders[0].setAttribute('style', `top: ${autoPasteOffsetTop}px; left: ${autoPasteOffsetLeft}px; width: ${autoPasteOffsetWidth}px; height: 1px;`);
      pasteBorders[1].setAttribute('style', `top: ${autoPasteOffsetTop}px; left: ${autoPasteOffsetLeft + autoPasteOffsetWidth}px; width: 1px; height: ${autoPasteOffsetHeight}px;`);
      pasteBorders[2].setAttribute('style', `top: ${autoPasteOffsetTop + autoPasteOffsetHeight}px; left: ${autoPasteOffsetLeft}px; width: ${autoPasteOffsetWidth}px; height: 1px;`);
      pasteBorders[3].setAttribute('style', `top: ${autoPasteOffsetTop}px; left: ${autoPasteOffsetLeft}px; width: 1px; height: ${autoPasteOffsetHeight}px;`);
    }
  }

  renderContext() {
    return (
      <ul
        style={{
          top: `${this.state.yPos}px`,
          left: `${this.state.xPos}px`,
          display: this.state.isContextMenuHidden ? 'none' : 'block',
        }}
        className="sou-context"
        onClick={() => {
          this.hideContextMenu();
          this.input.select();
        }}
        onKeyPress={() => {
          this.hideContextMenu();
          this.input.select();
        }}
        onContextMenu={e => e.preventDefault()}
      >
        <li
          key="1"
          onClick={this.copy}
          onKeyPress={this.copy}
        >
          <span>Copy</span>
        </li>

        <li
          key="2"
          onClick={this.cut}
          onKeyPress={this.cut}
        >
          <span>Cut</span>
        </li>

        <li
          key="3"
          onClick={this.paste}
          onKeyPress={this.paste}
        >
          <span>Paste</span>
        </li>

        <div key="d1" className="divider" />

        <li
          key="4"
          onClick={this.insertRow(0)}
          onKeyPress={this.insertRow(0)}
        >
          <span>Insert row above</span>
        </li>

        <li
          key="5"
          onClick={this.insertRow(1)}
          onKeyPress={this.insertRow(1)}
        >
          <span>Insert row below</span>
        </li>

        <li
          key="6"
          onClick={this.deleteRow}
          onKeyPress={this.deleteRow}
        >
          <span>Delete row</span>
        </li>

        <div key="d2" className="divider" />

        <li
          key="7"
          onClick={this.insertCol(0)}
          onKeyPress={this.insertCol(0)}
        >
          <span>Insert column left</span>
        </li>

        <li
          key="8"
          onClick={this.insertCol(1)}
          onKeyPress={this.insertCol(1)}
        >
          <span>Insert column right</span>
        </li>

        <li
          key="9"
          onClick={this.deleteCol}
          onKeyPress={this.deleteCol}
        >
          <span>Delete column</span>
        </li>

        <div key="d3" className="divider" />

        <li
          key="10"
          onClick={this.clearCells}
          onKeyPress={this.clearCells}
        >
          <span>Clear</span>
        </li>

        <div key="d4" className="divider" />

        <li
          key="11"
          onClick={this.sort()}
          onKeyPress={this.sort()}
        >
          <span>Sort A-Z</span>
        </li>

        <li
          key="12"
          onClick={this.sort(true)}
          onKeyPress={this.sort(true)}
        >
          <span>Sort Z-A</span>
        </li>
      </ul>
    );
  }

  render() {
    const { width, height } = this.props;
    return (
      <div
        className="sou-table-wrapper"
        style={{
          width: width === undefined ? 'auto' : `${width}px`,
          height: height === undefined ? 'auto' : `${height}px`,
        }}
        ref={(wrapper) => {
          this.wrapper = wrapper;
        }}
      >
        {this.renderTable()}
        {this.renderContext()}
      </div>
    );
  }
}

SouTable.defaultProps = {
  tableData: [
    ['City', 'Beijing', 'Shanghai', 'Guangzhou'],
    ['Temperature', '5', '22', '29'],
    ['Weather', 'Windy', 'Sunny', 'Rainy'],
  ],
  minTableCol: 10,
  minTableRow: 21,
  minCellWidth: 50,
  cellHeight: 28,
  getData: function getData(data) {
    console.log(data);
  },
};

SouTable.propTypes = {
  tableData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  width: PropTypes.number, // eslint-disable-line
  height: PropTypes.number, // eslint-disable-line
  minTableCol: PropTypes.number,
  minTableRow: PropTypes.number,
  minCellWidth: PropTypes.number,
  cellHeight: PropTypes.number,
  getData: PropTypes.func,
};

export default SouTable;
