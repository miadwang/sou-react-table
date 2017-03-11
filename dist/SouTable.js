'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SouTable = function (_Component) {
  (0, _inherits3.default)(SouTable, _Component);

  function SouTable(props) {
    (0, _classCallCheck3.default)(this, SouTable);

    var _this = (0, _possibleConstructorReturn3.default)(this, (SouTable.__proto__ || (0, _getPrototypeOf2.default)(SouTable)).call(this, props));

    _this.state = {
      tableData: props.tableData,
      tableCol: Math.max(props.minTableCol, props.tableData.length),
      tableRow: Math.max(props.minTableRow, props.tableData.length > 0 ? props.tableData[0].length : 0),
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
      innerClipboardData: undefined
    };

    _this.onContextMenu = _this.onContextMenu.bind(_this);
    _this.hideContextMenu = _this.hideContextMenu.bind(_this);
    _this.selectCell = _this.selectCell.bind(_this);
    _this.selectNextCell = _this.selectNextCell.bind(_this);
    _this.showEmptyInput = _this.showEmptyInput.bind(_this);
    _this.showInput = _this.showInput.bind(_this);
    _this.onChangeInputValue = _this.onChangeInputValue.bind(_this);
    _this.onInputKeyPress = _this.onInputKeyPress.bind(_this);
    _this.onInputKeyDown = _this.onInputKeyDown.bind(_this);
    _this.trimData = _this.trimData.bind(_this);
    _this.updateTable = _this.updateTable.bind(_this);
    _this.getTableDataForPaste = _this.getTableDataForPaste.bind(_this);
    _this.updateTableOnPaste = _this.updateTableOnPaste.bind(_this);
    _this.updateTableOnAutoPaste = _this.updateTableOnAutoPaste.bind(_this);
    _this.insertCol = _this.insertCol.bind(_this);
    _this.insertRow = _this.insertRow.bind(_this);
    _this.deleteCol = _this.deleteCol.bind(_this);
    _this.deleteRow = _this.deleteRow.bind(_this);
    _this.onMouseDown = _this.onMouseDown.bind(_this);
    _this.onGripMouseDown = _this.onGripMouseDown.bind(_this);
    _this.onMouseOver = _this.onMouseOver.bind(_this);
    _this.onMouseUp = _this.onMouseUp.bind(_this);
    _this.copy = _this.copy.bind(_this);
    _this.clearCells = _this.clearCells.bind(_this);
    _this.cut = _this.cut.bind(_this);
    _this.paste = _this.paste.bind(_this);
    _this.onCopy = _this.onCopy.bind(_this);
    _this.onCut = _this.onCut.bind(_this);
    _this.onPaste = _this.onPaste.bind(_this);
    _this.getSwitchedTableData = _this.getSwitchedTableData.bind(_this);
    _this.switchColRow = _this.switchColRow.bind(_this);
    _this.sort = _this.sort.bind(_this);
    _this.onLeftHeaderScroll = _this.onLeftHeaderScroll.bind(_this);
    _this.onTopHeaderScroll = _this.onTopHeaderScroll.bind(_this);
    _this.onInnerTableScroll = _this.onInnerTableScroll.bind(_this);
    _this.styleTable = _this.styleTable.bind(_this);
    _this.renderBorders = _this.renderBorders.bind(_this);
    _this.styleBorders = _this.styleBorders.bind(_this);
    _this.renderContext = _this.renderContext.bind(_this);
    return _this;
  }

  (0, _createClass3.default)(SouTable, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.styleTable();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var tableCol = Math.max(nextProps.minTableCol, nextProps.tableData.length, this.state.tableCol);
      var tableRow = Math.max(nextProps.minTableRow, nextProps.tableData.length > 0 ? nextProps.tableData[0].length : 0, this.state.tableRow);
      this.setState({
        tableData: nextProps.tableData,
        tableCol: tableCol,
        tableRow: tableRow
      });
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      if (this.state.colIndex !== undefined) {
        this.styleTable();
        this.styleBorders();
      }
    }
  }, {
    key: 'onContextMenu',
    value: function onContextMenu(e) {
      e.preventDefault();
      var target = e.target;
      var wrapperRect = this.wrapper.getBoundingClientRect();
      var contextMenuState = {
        xPos: e.clientX - wrapperRect.left,
        yPos: e.clientY - wrapperRect.top,
        isContextMenuHidden: false
      };
      if (target.tagName === 'TD' || target.tagName === 'TH') {
        if (target.className === 'sou-selected-cell') {
          this.setState(contextMenuState);
        } else {
          this.selectCell(target, (0, _assign2.default)({}, this.mouseDownState, contextMenuState));
        }
      } else if (e.target.tagName === 'INPUT') {
        this.setState(contextMenuState);
      }
      this.mouseDownState = undefined;
    }
  }, {
    key: 'hideContextMenu',
    value: function hideContextMenu() {
      this.setState({
        isContextMenuHidden: true
      });
    }
  }, {
    key: 'selectCell',
    value: function selectCell(td, additionalState) {
      var _this2 = this;

      if (this.state.isTyping) {
        this.updateTable(this.state.inputValue);
      }
      var inputValue = td.textContent;
      this.setState((0, _assign2.default)({
        inputValue: inputValue,
        isTyping: false,
        isContextMenuHidden: true,
        isMultiSelecting: false,
        isDragging: false,
        endColIndex: undefined,
        endRowIndex: undefined,
        dragColIndex: undefined,
        dragRowIndex: undefined
      }, additionalState), function () {
        return _this2.input.select();
      });
    }
  }, {
    key: 'selectNextCell',
    value: function selectNextCell(v, h) {
      var _state = this.state,
          tableCol = _state.tableCol,
          tableRow = _state.tableRow,
          colIndex = _state.colIndex,
          rowIndex = _state.rowIndex;

      if (h !== 0) {
        colIndex = h === -1 ? Math.max(colIndex + h, 0) : Math.min(colIndex + h, tableCol - 1);
      }
      if (v !== 0) {
        rowIndex = v === -1 ? Math.max(rowIndex + v, 0) : Math.min(rowIndex + v, tableRow - 1);
      }
      var nextTd = this.table.querySelector('[data-col=\'' + colIndex + '\'][data-row=\'' + rowIndex + '\']');
      this.selectCell(nextTd, { colIndex: colIndex, rowIndex: rowIndex });
    }
  }, {
    key: 'showEmptyInput',
    value: function showEmptyInput() {
      this.setState({
        inputValue: '',
        isTyping: true,
        isContextMenuHidden: true
      });
    }
  }, {
    key: 'showInput',
    value: function showInput() {
      this.input.selectionStart = this.input.selectionEnd;
      this.setState({
        isTyping: true,
        isContextMenuHidden: true
      });
    }
  }, {
    key: 'onChangeInputValue',
    value: function onChangeInputValue() {
      var inputValue = this.input.value;
      this.setState({ inputValue: inputValue });
    }
  }, {
    key: 'onInputKeyPress',
    value: function onInputKeyPress(e) {
      if (!this.state.isTyping) {
        if (e.key === 'Enter') {
          this.showInput();
        } else {
          this.showEmptyInput();
        }
      } else {
        if (e.key === 'Enter') {
          this.selectNextCell(1, 0);
        }
      }
    }
  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(e) {
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
  }, {
    key: 'trimData',
    value: function trimData(tableData) {
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var newTableData = [];
      var newTableDataCol = tableDataCol;
      var newTableDataRow = tableDataRow;

      for (var i = newTableDataCol - 1; i >= 0; i--) {
        if (tableData[i].every(function (datum) {
          return datum === '';
        })) {
          newTableDataCol--;
        } else {
          break;
        }
      }
      loop: {
        for (var j = newTableDataRow - 1; j >= 0; j--) {
          for (var _i = 0; _i < tableDataCol; _i++) {
            if (tableData[_i][j] !== '') {
              break loop;
            }
          }
          newTableDataRow--;
        }
      }

      for (var _i2 = 0; _i2 < newTableDataCol; _i2++) {
        newTableData[_i2] = tableData[_i2].slice(0, newTableDataRow);
      }
      return newTableData;
    }
  }, {
    key: 'updateTable',
    value: function updateTable(value) {
      var _state2 = this.state,
          tableData = _state2.tableData,
          colIndex = _state2.colIndex,
          rowIndex = _state2.rowIndex;

      var newTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var newTableDataCol = Math.max(colIndex + 1, tableDataCol);
      var newTableDataRow = Math.max(rowIndex + 1, tableDataRow);

      for (var i = 0; i < newTableDataCol; i++) {
        newTableData[i] = [];
        for (var j = 0; j < newTableDataRow; j++) {
          if (i === colIndex && j === rowIndex) {
            newTableData[i][j] = value;
          } else if (i < tableDataCol && j < tableDataRow) {
            newTableData[i][j] = tableData[i][j];
          } else {
            newTableData[i][j] = '';
          }
        }
      }

      var trimmedTableData = this.trimData(newTableData);
      this.setState({
        tableData: trimmedTableData
      });
      this.props.getData(trimmedTableData);
    }
  }, {
    key: 'getTableDataForPaste',
    value: function getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex) {
      var tableData = this.state.tableData;

      var newTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var pasteDataCol = pasteData.length > 0 ? pasteData[0].length : 0;
      var pasteDataRow = pasteData.length;
      var newTableDataCol = Math.max(pasteColIndex + pasteDataCol, tableDataCol);
      var newTableDataRow = Math.max(pasteRowIndex + pasteDataRow, tableDataRow);

      for (var i = 0; i < newTableDataCol; i++) {
        newTableData[i] = [];
        for (var j = 0; j < newTableDataRow; j++) {
          if (i >= pasteColIndex && i < pasteColIndex + pasteDataCol && j >= pasteRowIndex && j < pasteRowIndex + pasteDataRow) {
            newTableData[i][j] = pasteData[j - pasteRowIndex][i - pasteColIndex];
          } else if (i < tableDataCol && j < tableDataRow) {
            newTableData[i][j] = tableData[i][j];
          } else {
            newTableData[i][j] = '';
          }
        }
      }

      return this.trimData(newTableData);
    }
  }, {
    key: 'updateTableOnPaste',
    value: function updateTableOnPaste(data) {
      var selectAfterPaste = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _state3 = this.state,
          colIndex = _state3.colIndex,
          rowIndex = _state3.rowIndex,
          endColIndex = _state3.endColIndex,
          endRowIndex = _state3.endRowIndex;

      var dataCol = data[0].length;
      var dataRow = data.length;
      var pasteData = data;
      if (dataRow === 1 && dataCol === 1 && endColIndex === undefined) {
        // 1 to 1 copy-paste
        this.updateTable(pasteData[0][0]);
      } else {
        // 1 to n, n to 1, n to n copy-paste

        // step 1-1: get paste cells
        // n to 1 as default
        var pasteColIndex = colIndex,
            pasteRowIndex = rowIndex,
            selectCol = 1,
            selectRow = 1,
            pasteCol = dataCol,
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
            for (var i = 0; i < pasteRow; i++) {
              pasteData[i] = [];
              for (var j = 0; j < pasteCol; j++) {
                pasteData[i][j] = data[i % dataRow][j % dataCol];
              }
            }
          }
        }

        // step 2: get new table data
        var trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
        this.props.getData(trimmedData);

        // step 3: select cells and expand table after paste
        if (selectAfterPaste) {
          var pasteTd = this.table.querySelector('[data-col=\'' + pasteColIndex + '\'][data-row=\'' + pasteRowIndex + '\']');
          var pasteEndColIndex = pasteColIndex + pasteCol - 1;
          var pasteEndRowIndex = pasteRowIndex + pasteRow - 1;
          this.selectCell(pasteTd, {
            tableData: trimmedData,
            tableCol: Math.max(this.state.tableCol, trimmedData.length),
            tableRow: Math.max(this.state.tableRow, trimmedData.length > 0 ? trimmedData[0].length : 0),
            colIndex: pasteColIndex,
            rowIndex: pasteRowIndex,
            endColIndex: pasteEndColIndex,
            endRowIndex: pasteEndRowIndex,
            innerClipboardData: data
          });
        } else {
          this.setState({
            tableData: trimmedData,
            tableCol: Math.max(this.state.tableCol, trimmedData.length),
            tableRow: Math.max(this.state.tableRow, trimmedData.length > 0 ? trimmedData[0].length : 0)
          });
        }
      }
    }
  }, {
    key: 'updateTableOnAutoPaste',
    value: function updateTableOnAutoPaste() {
      // step 1: get paste and select cells
      var _state4 = this.state,
          colIndex = _state4.colIndex,
          rowIndex = _state4.rowIndex,
          endColIndex = _state4.endColIndex,
          endRowIndex = _state4.endRowIndex,
          dragColIndex = _state4.dragColIndex,
          dragRowIndex = _state4.dragRowIndex;

      var pasteColIndex = void 0,
          pasteRowIndex = void 0,
          pasteCol = 1,
          pasteRow = 1,
          selectColIndex = void 0,
          selectRowIndex = void 0,
          selectEndColIndex = void 0,
          selectEndRowIndex = void 0;
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
        var minColIndex = Math.min(colIndex, endColIndex);
        var maxColIndex = Math.max(colIndex, endColIndex);
        var minRowIndex = Math.min(rowIndex, endRowIndex);
        var maxRowIndex = Math.max(rowIndex, endRowIndex);
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
      var copyData = this.copy(false);
      var dataCol = copyData[0].length;
      var dataRow = copyData.length;
      var pasteData = [];
      for (var i = 0; i < pasteRow; i++) {
        pasteData[i] = [];
        for (var j = 0; j < pasteCol; j++) {
          pasteData[i][j] = copyData[i % dataRow][j % dataCol];
        }
      }

      // step 3: get new table data
      var trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
      this.props.getData(trimmedData);

      // step 4: select cells after paste
      var selectTd = this.table.querySelector('[data-col=\'' + selectColIndex + '\'][data-row=\'' + selectRowIndex + '\']');
      this.selectCell(selectTd, {
        tableData: trimmedData,
        colIndex: selectColIndex,
        rowIndex: selectRowIndex,
        endColIndex: selectEndColIndex,
        endRowIndex: selectEndRowIndex
      });
    }
  }, {
    key: 'insertCol',
    value: function insertCol(d) {
      var _this3 = this;

      return function () {
        var _state5 = _this3.state,
            tableData = _state5.tableData,
            tableCol = _state5.tableCol,
            colIndex = _state5.colIndex;

        if (colIndex + d < tableData.length) {
          var emptyCol = [];
          for (var i = 0; i < tableData.length + 1; i++) {
            emptyCol.push('');
          }
          tableData.splice(colIndex + d, 0, emptyCol);
          _this3.setState({
            tableData: tableData,
            tableCol: tableCol + 1
          });
          _this3.props.getData(tableData);
        } else {
          _this3.setState({
            tableCol: tableCol + 1
          });
        }
      };
    }
  }, {
    key: 'insertRow',
    value: function insertRow(d) {
      var _this4 = this;

      return function () {
        var _state6 = _this4.state,
            tableData = _state6.tableData,
            tableRow = _state6.tableRow,
            rowIndex = _state6.rowIndex;

        var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
        if (rowIndex + d < tableDataRow) {
          for (var i = 0; i < tableData.length; i++) {
            tableData[i].splice(rowIndex + d, 0, '');
          }
          _this4.setState({
            tableData: tableData,
            tableRow: tableRow + 1
          });
          _this4.props.getData(tableData);
        } else {
          _this4.setState({
            tableRow: tableRow + 1
          });
        }
      };
    }
  }, {
    key: 'deleteCol',
    value: function deleteCol() {
      var _state7 = this.state,
          tableData = _state7.tableData,
          tableCol = _state7.tableCol,
          colIndex = _state7.colIndex;

      if (colIndex < tableData.length) {
        tableData.splice(colIndex, 1);
        this.setState({
          tableData: tableData,
          tableCol: tableCol > this.props.minTableCol ? tableCol - 1 : tableCol
        });
        this.props.getData(tableData);
      } else {
        this.setState({
          tableCol: tableCol > this.props.minTableCol ? tableCol - 1 : tableCol
        });
      }
    }
  }, {
    key: 'deleteRow',
    value: function deleteRow() {
      var _state8 = this.state,
          tableData = _state8.tableData,
          tableRow = _state8.tableRow,
          rowIndex = _state8.rowIndex;

      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      if (rowIndex < tableDataRow) {
        for (var i = 0; i < tableData.length; i++) {
          tableData[i].splice(rowIndex, 1);
        }
        this.setState({
          tableData: tableData,
          tableRow: tableRow > this.props.minTableRow ? tableRow - 1 : tableRow
        });
        this.props.getData(tableData);
      } else {
        this.setState({
          tableRow: tableRow > this.props.minTableRow ? tableRow - 1 : tableRow
        });
      }
    }
  }, {
    key: 'onMouseDown',
    value: function onMouseDown(e) {
      e.preventDefault();
      var target = e.target;
      var colIndex = Number(target.getAttribute('data-col'));
      var rowIndex = Number(target.getAttribute('data-row'));
      if ((target.tagName === 'TD' || target.tagName === 'TH') && !(rowIndex === -1 && colIndex === -1)) {
        var _state9 = this.state,
            tableCol = _state9.tableCol,
            tableRow = _state9.tableRow;

        var endColIndex = undefined;
        var endRowIndex = undefined;
        var isMultiSelecting = false;
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
          colIndex: colIndex,
          rowIndex: rowIndex,
          endColIndex: endColIndex,
          endRowIndex: endRowIndex,
          isMultiSelecting: isMultiSelecting
        };
        if (e.button === 0) {
          this.selectCell(target, this.mouseDownState);
        }
      }
    }
  }, {
    key: 'onGripMouseDown',
    value: function onGripMouseDown(e) {
      e.preventDefault();
      this.setState({
        isDragging: true
      });
    }
  }, {
    key: 'onMouseOver',
    value: function onMouseOver(e) {
      e.preventDefault();
      var target = e.target;
      if (target.tagName === 'TD' || target.tagName === 'TH') {
        var targetColIndex = Number(target.getAttribute('data-col'));
        var targetRowIndex = Number(target.getAttribute('data-row'));
        if (this.mouseDownState !== undefined) {
          var _state10 = this.state,
              tableCol = _state10.tableCol,
              tableRow = _state10.tableRow;

          var isMultiSelecting = this.state.isMultiSelecting;
          var endColIndex = isMultiSelecting === 'row' ? tableCol - 1 : Math.max(targetColIndex, 0);
          var endRowIndex = isMultiSelecting === 'col' ? tableRow - 1 : Math.max(targetRowIndex, 0);
          if (!isMultiSelecting) {
            this.setState({
              isMultiSelecting: true,
              endColIndex: endColIndex,
              endRowIndex: endRowIndex
            });
          } else if (endColIndex === this.state.colIndex && endRowIndex === this.state.rowIndex) {
            this.setState({
              isMultiSelecting: false,
              endColIndex: undefined,
              endRowIndex: undefined
            });
          } else {
            this.setState({
              endColIndex: endColIndex,
              endRowIndex: endRowIndex
            });
          }
        } else if (this.state.isDragging) {
          var _state11 = this.state,
              colIndex = _state11.colIndex,
              rowIndex = _state11.rowIndex,
              _endColIndex = _state11.endColIndex,
              _endRowIndex = _state11.endRowIndex;

          var willAutoPaste = _endColIndex === undefined ? !(targetColIndex === colIndex && targetRowIndex === rowIndex) : !(targetColIndex <= Math.max(colIndex, _endColIndex) && targetColIndex >= Math.min(colIndex, _endColIndex) && targetRowIndex <= Math.max(rowIndex, _endRowIndex) && targetRowIndex >= Math.min(rowIndex, _endRowIndex));
          if (willAutoPaste) {
            this.setState({
              dragColIndex: targetColIndex,
              dragRowIndex: targetRowIndex
            });
          } else {
            this.setState({
              dragColIndex: undefined,
              dragRowIndex: undefined
            });
          }
        }
      }
    }
  }, {
    key: 'onMouseUp',
    value: function onMouseUp(e) {
      e.preventDefault();
      if (this.mouseDownState !== undefined) {
        this.setState({
          isMultiSelecting: false
        });
        this.mouseDownState = undefined;
      } else if (this.state.isDragging && this.state.dragColIndex !== undefined) {
        this.updateTableOnAutoPaste();
      } else if (this.state.isDragging) {
        this.setState({
          isDragging: false
        });
      }
    }
  }, {
    key: 'copy',
    value: function copy() {
      var toClipboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var _state12 = this.state,
          tableData = _state12.tableData,
          colIndex = _state12.colIndex,
          rowIndex = _state12.rowIndex;
      var _state13 = this.state,
          endColIndex = _state13.endColIndex,
          endRowIndex = _state13.endRowIndex;

      if (endColIndex === undefined) {
        endColIndex = colIndex;
        endRowIndex = rowIndex;
      }
      var minCol = Math.min(colIndex, endColIndex);
      var maxCol = Math.max(colIndex, endColIndex);
      var minRow = Math.min(rowIndex, endRowIndex);
      var maxRow = Math.max(rowIndex, endRowIndex);
      var data = [];
      for (var i = minRow; i <= maxRow; i++) {
        data[i - minRow] = [];
        for (var j = minCol; j <= maxCol; j++) {
          if (tableData[j] !== undefined && tableData[j][i] !== undefined) {
            data[i - minRow][j - minCol] = tableData[j][i];
          } else {
            data[i - minRow][j - minCol] = '';
          }
        }
      }
      if (toClipboard) {
        this.setState({
          innerClipboardData: data
        });
      }
      return data;
    }
  }, {
    key: 'clearCells',
    value: function clearCells() {
      var emptyCol = Math.abs(this.state.colIndex - this.state.endColIndex) || 0;
      var emptyRow = Math.abs(this.state.rowIndex - this.state.endRowIndex) || 0;
      var emptyData = [];
      for (var i = 0; i <= emptyRow; i++) {
        emptyData[i] = [];
        for (var j = 0; j <= emptyCol; j++) {
          emptyData[i][j] = '';
        }
      }
      this.updateTableOnPaste(emptyData, false);
    }
  }, {
    key: 'cut',
    value: function cut() {
      this.copy();
      this.clearCells();
    }
  }, {
    key: 'paste',
    value: function paste() {
      this.updateTableOnPaste(this.state.innerClipboardData);
    }
  }, {
    key: 'onCopy',
    value: function onCopy(e) {
      // will update innerClipboardData in copy
      e.preventDefault();
      var data = this.copy();
      var dataCol = data[0].length;
      var rawData = '';
      data.forEach(function (row, rowIndex) {
        row.forEach(function (datum, colIndex) {
          var tail = '\t';
          if (colIndex === dataCol - 1) {
            tail = rowIndex === data.length - 1 ? '' : '\n';
          }
          rawData += datum + tail;
        });
      });
      e.clipboardData.setData('text/plain', rawData);
    }
  }, {
    key: 'onCut',
    value: function onCut(e) {
      // will update innerClipboardData in onCopy
      e.preventDefault();
      this.onCopy(e);
      this.clearCells();
    }
  }, {
    key: 'onPaste',
    value: function onPaste(e) {
      // will update innerClipboardData in updateTableOnPaste
      e.preventDefault();
      var rawData = e.clipboardData.getData('Text');
      var data = [];
      rawData.split('\n').forEach(function (row, index) {
        data[index] = row.split('\t');
      });
      this.updateTableOnPaste(data);
    }
  }, {
    key: 'getSwitchedTableData',
    value: function getSwitchedTableData() {
      var tableData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.tableData;

      var switchedTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      for (var i = 0; i < tableDataRow; i++) {
        switchedTableData[i] = [];
        for (var j = 0; j < tableDataCol; j++) {
          switchedTableData[i][j] = tableData[j][i];
        }
      }
      return switchedTableData;
    }
  }, {
    key: 'switchColRow',
    value: function switchColRow() {
      var tableData = this.state.tableData;

      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var newTableData = this.getSwitchedTableData();
      var tableCol = Math.max(this.props.minTableCol, tableDataRow, this.state.tableCol);
      var tableRow = Math.max(this.props.minTableRow, tableDataCol, this.state.tableRow);
      this.setState({
        tableData: newTableData,
        tableCol: tableCol,
        tableRow: tableRow
      });
      this.props.getData(newTableData);
    }
  }, {
    key: 'sort',
    value: function sort() {
      var _this5 = this;

      var inverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      return function () {
        var colIndex = _this5.state.colIndex;

        var switchedTableData = _this5.getSwitchedTableData();
        var firstRow = switchedTableData[0];
        var restRows = switchedTableData.slice(1);
        if (inverse) {
          restRows.sort(function (a, b) {
            if (!isNaN(+a[colIndex]) && !isNaN(+b[colIndex])) {
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
          restRows.sort(function (a, b) {
            if (!isNaN(+a[colIndex]) && !isNaN(+b[colIndex])) {
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
        var sortedTableData = _this5.getSwitchedTableData([firstRow].concat(restRows));
        _this5.setState({
          tableData: sortedTableData
        });
        _this5.props.getData(sortedTableData);
      };
    }
  }, {
    key: 'onLeftHeaderScroll',
    value: function onLeftHeaderScroll() {
      var scrollTop = this.leftHeader.scrollTop;
      if (this.scrollTop !== scrollTop) {
        this.scrollTop == scrollTop;
        this.innerTable.scrollTop = scrollTop;
        if (scrollTop > 0) {
          this.topHeader.style.height = this.props.cellHeight + 1 + 'px';
          this.innerTable.style.marginTop = '-1px';
          this.leftHeaderHead.style.height = this.props.cellHeight + 1 + 'px';
        } else {
          this.topHeader.style.height = this.props.cellHeight + 'px';
          this.innerTable.style.marginTop = 0;
          this.leftHeaderHead.style.height = this.props.cellHeight + 'px';
        }
      }
    }
  }, {
    key: 'onTopHeaderScroll',
    value: function onTopHeaderScroll() {
      var scrollLeft = this.topHeader.scrollLeft;
      if (this.scrollLeft !== scrollLeft) {
        this.scrollLeft = scrollLeft;
        this.innerTable.scrollLeft = scrollLeft;
        if (scrollLeft > 0) {
          this.leftWrapper.style.width = this.props.minCellWidth + 1 + 'px';
        } else {
          this.leftWrapper.style.width = this.props.minCellWidth + 'px';
        }
      }
    }
  }, {
    key: 'onInnerTableScroll',
    value: function onInnerTableScroll() {
      var scrollTop = this.innerTable.scrollTop;
      var scrollLeft = this.innerTable.scrollLeft;
      if (this.scrollTop !== scrollTop) {
        this.scrollTop = scrollTop;
        this.leftHeader.scrollTop = scrollTop;
        if (scrollTop > 0) {
          this.topHeader.style.height = this.props.cellHeight + 1 + 'px';
          this.innerTable.style.marginTop = '-1px';
          this.leftHeaderHead.style.height = this.props.cellHeight + 1 + 'px';
        } else {
          this.topHeader.style.height = this.props.cellHeight + 'px';
          this.innerTable.style.marginTop = 0;
          this.leftHeaderHead.style.height = this.props.cellHeight + 'px';
        }
      }

      if (this.scrollLeft !== scrollLeft) {
        this.scrollLeft = scrollLeft;
        this.topHeader.scrollLeft = scrollLeft;
        if (scrollLeft > 0) {
          this.leftWrapper.style.width = this.props.minCellWidth + 1 + 'px';
        } else {
          this.leftWrapper.style.width = this.props.minCellWidth + 'px';
        }
      }
    }
  }, {
    key: 'renderTable',
    value: function renderTable() {
      var _this6 = this;

      var _state14 = this.state,
          tableData = _state14.tableData,
          tableCol = _state14.tableCol,
          tableRow = _state14.tableRow,
          colIndex = _state14.colIndex,
          rowIndex = _state14.rowIndex,
          endColIndex = _state14.endColIndex,
          endRowIndex = _state14.endRowIndex;
      var _props = this.props,
          width = _props.width,
          height = _props.height,
          minCellWidth = _props.minCellWidth,
          cellHeight = _props.cellHeight;

      var cellStyle = {
        minWidth: minCellWidth + 'px',
        height: cellHeight + 'px'
      };
      var leftHeaderRows = [];
      for (var j = 0; j < tableRow; j++) {
        var isRowIncluded = endRowIndex !== undefined ? j >= Math.min(rowIndex, endRowIndex) && j <= Math.max(rowIndex, endRowIndex) : j === rowIndex;
        leftHeaderRows.push(_react2.default.createElement(
          'tr',
          { key: j },
          _react2.default.createElement(
            'td',
            {
              style: cellStyle,
              'data-col': -1,
              'data-row': j,
              className: isRowIncluded ? 'sou-selected-cell-indicator' : ''
            },
            j
          )
        ));
      }

      var ths = [];
      for (var i = 1; i <= tableCol; i++) {
        var isColIncluded = endColIndex !== undefined ? i - 1 >= Math.min(colIndex, endColIndex) && i - 1 <= Math.max(colIndex, endColIndex) : i - 1 === colIndex;
        ths.push(_react2.default.createElement(
          'th',
          {
            key: i,
            style: cellStyle,
            'data-col': i - 1,
            'data-row': -1,
            className: isColIncluded ? 'sou-selected-cell-indicator' : ''
          },
          i > 26 && String.fromCharCode(Math.floor((i - 1) / 26) + 64),
          String.fromCharCode((i - 1) % 26 + 65)
        ));
      }

      var rows = [];

      var _loop = function _loop(_j) {
        var row = _react2.default.createElement(
          'tr',
          { key: _j },
          ths.map(function (col, index) {
            var isCurrent = index === colIndex && _j === rowIndex;
            var isMultiSelected = index >= Math.min(colIndex, endColIndex) && index <= Math.max(colIndex, endColIndex) && _j >= Math.min(rowIndex, endRowIndex) && _j <= Math.max(rowIndex, endRowIndex);
            return _react2.default.createElement(
              'td',
              {
                key: index + 1,
                style: cellStyle,
                'data-col': index,
                'data-row': _j,
                className: isMultiSelected ? 'sou-selected-cell' : ''
              },
              tableData[index] !== undefined ? tableData[index][_j] : '',
              isCurrent && _react2.default.createElement('input', {
                type: 'text',
                className: 'sou-input',
                style: { zIndex: _this6.state.isTyping ? 100 : -100 },
                ref: function ref(input) {
                  return _this6.input = input;
                },
                value: _this6.state.inputValue,
                onChange: _this6.onChangeInputValue,
                onKeyPress: _this6.onInputKeyPress,
                onKeyDown: _this6.onInputKeyDown,
                onDoubleClick: function onDoubleClick(e) {
                  return e.stopPropagation();
                },
                onMouseDown: function onMouseDown(e) {
                  return e.stopPropagation();
                },
                onMouseOver: function onMouseOver(e) {
                  return e.stopPropagation();
                },
                onMouseUp: function onMouseUp(e) {
                  return e.stopPropagation();
                },
                onMouseLeave: function onMouseLeave(e) {
                  return e.stopPropagation();
                },
                onCopy: _this6.onCopy,
                onCut: _this6.onCut,
                onPaste: _this6.onPaste
              })
            );
          })
        );
        rows.push(row);
      };

      for (var _j = 0; _j < tableRow; _j++) {
        _loop(_j);
      }
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          'div',
          {
            className: 'left-wrapper',
            style: {
              width: minCellWidth
            },
            ref: function ref(leftWrapper) {
              return _this6.leftWrapper = leftWrapper;
            }
          },
          _react2.default.createElement(
            'table',
            {
              className: 'sou-table-left-header'
            },
            _react2.default.createElement(
              'thead',
              {
                style: {
                  height: cellHeight + 'px'
                },
                ref: function ref(leftHeaderHead) {
                  return _this6.leftHeaderHead = leftHeaderHead;
                }
              },
              _react2.default.createElement(
                'tr',
                null,
                _react2.default.createElement(
                  'th',
                  {
                    style: cellStyle,
                    'data-col': -1,
                    'data-row': -1,
                    onClick: this.switchColRow,
                    onContextMenu: function onContextMenu(e) {
                      return e.preventDefault();
                    }
                  },
                  'switch'
                )
              )
            ),
            _react2.default.createElement(
              'tbody',
              {
                style: {
                  marginTop: cellHeight,
                  height: height - cellHeight + 'px'
                },
                onContextMenu: this.onContextMenu,
                onMouseDown: this.onMouseDown,
                onMouseOver: this.onMouseOver,
                onMouseUp: this.onMouseUp,
                ref: function ref(leftHeader) {
                  return _this6.leftHeader = leftHeader;
                },
                onScroll: this.onLeftHeaderScroll
              },
              leftHeaderRows
            )
          )
        ),
        _react2.default.createElement(
          'div',
          { className: 'right-wrapper' },
          _react2.default.createElement(
            'div',
            {
              className: 'right-top-wrapper',
              style: {
                width: width - minCellWidth - 1 + 'px',
                height: cellHeight + 'px'
              },
              ref: function ref(topHeader) {
                return _this6.topHeader = topHeader;
              },
              onScroll: this.onTopHeaderScroll
            },
            _react2.default.createElement(
              'table',
              {
                className: 'sou-table',
                onContextMenu: this.onContextMenu,
                onMouseDown: this.onMouseDown,
                onMouseOver: this.onMouseOver,
                onMouseUp: this.onMouseUp
              },
              _react2.default.createElement(
                'thead',
                null,
                _react2.default.createElement(
                  'tr',
                  null,
                  ths
                )
              )
            )
          ),
          _react2.default.createElement(
            'div',
            {
              className: 'right-bottom-wrapper',
              style: {
                width: width - minCellWidth - 1 + 'px',
                height: height - cellHeight + 'px'
              },
              ref: function ref(innerTable) {
                return _this6.innerTable = innerTable;
              },
              onScroll: this.onInnerTableScroll
            },
            _react2.default.createElement(
              'div',
              { className: 'inner-wrapper' },
              _react2.default.createElement(
                'table',
                {
                  className: 'sou-table',
                  ref: function ref(table) {
                    return _this6.table = table;
                  },
                  onContextMenu: this.onContextMenu,
                  onMouseDown: this.onMouseDown,
                  onMouseOver: this.onMouseOver,
                  onMouseUp: this.onMouseUp
                },
                _react2.default.createElement(
                  'tbody',
                  {
                    onDoubleClick: function onDoubleClick() {
                      _this6.showInput();
                    }
                  },
                  rows
                )
              ),
              this.renderBorders()
            )
          )
        )
      );
    }
  }, {
    key: 'styleTable',
    value: function styleTable() {
      var tableCol = this.state.tableCol;

      var theadTr = document.querySelector('.sou-table > thead > tr');
      var ths = theadTr.children;
      var tbodyTr = document.querySelector('.sou-table > tbody > tr');
      var tds = tbodyTr.children;
      theadTr.style.width = tbodyTr.offsetWidth + 1 + 'px';
      ths[0].style.width = tds[0].offsetWidth + 1 + 'px';
      for (var i = 1; i < tableCol; i++) {
        ths[i].style.width = tds[i].offsetWidth + 'px';
      }
    }
  }, {
    key: 'renderBorders',
    value: function renderBorders() {
      return _react2.default.createElement(
        'div',
        {
          className: 'sou-borders',
          onMouseDown: function onMouseDown(e) {
            return e.preventDefault();
          },
          onMouseUp: this.onMouseUp,
          onContextMenu: function onContextMenu(e) {
            return e.preventDefault();
          }
        },
        this.state.dragColIndex !== undefined && _react2.default.createElement(
          'div',
          { className: 'sou-paste-borders' },
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null)
        ),
        this.state.endColIndex !== undefined && _react2.default.createElement(
          'div',
          { className: 'sou-area-borders' },
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', {
            className: 'sou-drag-grip',
            onMouseDown: this.onGripMouseDown
          })
        ),
        this.state.colIndex !== undefined && _react2.default.createElement(
          'div',
          { className: 'sou-current-borders' },
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          _react2.default.createElement('div', null),
          this.state.endColIndex === undefined && _react2.default.createElement('div', {
            className: 'sou-drag-grip',
            onMouseDown: this.onGripMouseDown
          })
        )
      );
    }
  }, {
    key: 'styleBorders',
    value: function styleBorders() {
      var _state15 = this.state,
          colIndex = _state15.colIndex,
          rowIndex = _state15.rowIndex,
          endColIndex = _state15.endColIndex,
          endRowIndex = _state15.endRowIndex,
          dragColIndex = _state15.dragColIndex,
          dragRowIndex = _state15.dragRowIndex;

      var currentTd = this.table.querySelector('[data-col=\'' + colIndex + '\'][data-row=\'' + rowIndex + '\']');
      var offsetTop = currentTd.offsetTop,
          offsetLeft = currentTd.offsetLeft,
          offsetWidth = currentTd.offsetWidth,
          offsetHeight = currentTd.offsetHeight;


      var currentBorders = document.querySelectorAll('.sou-current-borders > div');
      currentBorders[0].setAttribute('style', 'top: ' + offsetTop + 'px; left: ' + offsetLeft + 'px; width: ' + offsetWidth + 'px; height: 2px;');
      currentBorders[1].setAttribute('style', 'top: ' + offsetTop + 'px; left: ' + (offsetLeft + offsetWidth - 1) + 'px; width: 2px; height: ' + offsetHeight + 'px;');
      currentBorders[2].setAttribute('style', 'top: ' + (offsetTop + offsetHeight - 1) + 'px; left: ' + offsetLeft + 'px; width: ' + offsetWidth + 'px; height: 2px;');
      currentBorders[3].setAttribute('style', 'top: ' + offsetTop + 'px; left: ' + offsetLeft + 'px; width: 2px; height: ' + offsetHeight + 'px;');

      var multiSelectOffsetTop = void 0,
          multiSelectOffsetLeft = void 0,
          multiSelectOffsetWidth = void 0,
          multiSelectOffsetHeight = void 0,
          autoPasteOffsetTop = void 0,
          autoPasteOffsetLeft = void 0,
          autoPasteOffsetWidth = void 0,
          autoPasteOffsetHeight = void 0;

      if (endColIndex !== undefined) {
        var endTd = this.table.querySelector('[data-col=\'' + endColIndex + '\'][data-row=\'' + endRowIndex + '\']');
        var endOffsetTop = endTd.offsetTop;
        var endOffsetLeft = endTd.offsetLeft;
        var endOffsetWidth = endTd.offsetWidth;
        var endOffsetHeight = endTd.offsetHeight;
        multiSelectOffsetTop = Math.min(offsetTop, endOffsetTop);
        multiSelectOffsetLeft = Math.min(offsetLeft, endOffsetLeft);
        multiSelectOffsetWidth = offsetLeft >= endOffsetLeft ? offsetLeft - endOffsetLeft + offsetWidth : endOffsetLeft - offsetLeft + endOffsetWidth;
        multiSelectOffsetHeight = offsetTop >= endOffsetTop ? offsetTop - endOffsetTop + offsetHeight : endOffsetTop - offsetTop + endOffsetHeight;

        var areaBorders = document.querySelectorAll('.sou-area-borders > div');
        areaBorders[0].setAttribute('style', 'top: ' + multiSelectOffsetTop + 'px; left: ' + multiSelectOffsetLeft + 'px; width: ' + multiSelectOffsetWidth + 'px; height: 1px;');
        areaBorders[1].setAttribute('style', 'top: ' + multiSelectOffsetTop + 'px; left: ' + (multiSelectOffsetLeft + multiSelectOffsetWidth) + 'px; width: 1px; height: ' + multiSelectOffsetHeight + 'px;');
        areaBorders[2].setAttribute('style', 'top: ' + (multiSelectOffsetTop + multiSelectOffsetHeight) + 'px; left: ' + multiSelectOffsetLeft + 'px; width: ' + multiSelectOffsetWidth + 'px; height: 1px;');
        areaBorders[3].setAttribute('style', 'top: ' + multiSelectOffsetTop + 'px; left: ' + multiSelectOffsetLeft + 'px; width: 1px; height: ' + multiSelectOffsetHeight + 'px;');
        areaBorders[4].setAttribute('style', 'display: ' + (this.state.isTyping ? 'none' : 'initial') + '; top: ' + (multiSelectOffsetTop + multiSelectOffsetHeight - 4) + 'px; left: ' + (multiSelectOffsetLeft + multiSelectOffsetWidth - 4) + 'px;');
      } else {
        currentBorders[4].setAttribute('style', 'display: ' + (this.state.isTyping ? 'none' : 'initial') + '; top: ' + (offsetTop + offsetHeight - 4) + 'px; left: ' + (offsetLeft + offsetWidth - 4) + 'px;');
      }

      if (dragColIndex !== undefined) {
        var dragTd = this.table.querySelector('[data-col=\'' + dragColIndex + '\'][data-row=\'' + dragRowIndex + '\']');
        var dragOffsetTop = dragTd.offsetTop;
        var dragOffsetLeft = dragTd.offsetLeft;
        var dragOffsetWidth = dragTd.offsetWidth;
        var dragOffsetHeight = dragTd.offsetHeight;
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
          } else {
            if (dragRowIndex < rowIndex) {
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
          }
        } else {
          if (dragRowIndex <= Math.max(rowIndex, endRowIndex) && dragRowIndex >= Math.min(rowIndex, endRowIndex)) {
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
          } else {
            if (dragRowIndex < Math.min(rowIndex, endRowIndex)) {
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
          }
        }

        var pasteBorders = document.querySelectorAll('.sou-paste-borders > div');
        pasteBorders[0].setAttribute('style', 'top: ' + autoPasteOffsetTop + 'px; left: ' + autoPasteOffsetLeft + 'px; width: ' + autoPasteOffsetWidth + 'px; height: 1px;');
        pasteBorders[1].setAttribute('style', 'top: ' + autoPasteOffsetTop + 'px; left: ' + (autoPasteOffsetLeft + autoPasteOffsetWidth) + 'px; width: 1px; height: ' + autoPasteOffsetHeight + 'px;');
        pasteBorders[2].setAttribute('style', 'top: ' + (autoPasteOffsetTop + autoPasteOffsetHeight) + 'px; left: ' + autoPasteOffsetLeft + 'px; width: ' + autoPasteOffsetWidth + 'px; height: 1px;');
        pasteBorders[3].setAttribute('style', 'top: ' + autoPasteOffsetTop + 'px; left: ' + autoPasteOffsetLeft + 'px; width: 1px; height: ' + autoPasteOffsetHeight + 'px;');
      }
    }
  }, {
    key: 'renderContext',
    value: function renderContext() {
      var _this7 = this;

      return _react2.default.createElement(
        'ul',
        {
          style: {
            top: this.state.yPos + 'px',
            left: this.state.xPos + 'px',
            display: this.state.isContextMenuHidden ? 'none' : 'block'
          },
          className: 'sou-context',
          onClick: function onClick() {
            _this7.hideContextMenu();
            _this7.input.select();
          },
          onContextMenu: function onContextMenu(e) {
            return e.preventDefault();
          }
        },
        _react2.default.createElement(
          'li',
          {
            key: '1',
            onClick: this.copy
          },
          _react2.default.createElement(
            'span',
            null,
            'Copy'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '2',
            onClick: this.cut
          },
          _react2.default.createElement(
            'span',
            null,
            'Cut'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '3',
            onClick: this.paste
          },
          _react2.default.createElement(
            'span',
            null,
            'Paste'
          )
        ),
        _react2.default.createElement('div', { key: 'd1', className: 'divider' }),
        _react2.default.createElement(
          'li',
          {
            key: '4',
            onClick: this.insertRow(0)
          },
          _react2.default.createElement(
            'span',
            null,
            'Insert row above'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '5',
            onClick: this.insertRow(1)
          },
          _react2.default.createElement(
            'span',
            null,
            'Insert row below'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '6',
            onClick: this.deleteRow
          },
          _react2.default.createElement(
            'span',
            null,
            'Delete row'
          )
        ),
        _react2.default.createElement('div', { key: 'd2', className: 'divider' }),
        _react2.default.createElement(
          'li',
          {
            key: '7',
            onClick: this.insertCol(0)
          },
          _react2.default.createElement(
            'span',
            null,
            'Insert column left'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '8',
            onClick: this.insertCol(1)
          },
          _react2.default.createElement(
            'span',
            null,
            'Insert column right'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '9',
            onClick: this.deleteCol
          },
          _react2.default.createElement(
            'span',
            null,
            'Delete column'
          )
        ),
        _react2.default.createElement('div', { key: 'd3', className: 'divider' }),
        _react2.default.createElement(
          'li',
          {
            key: '10',
            onClick: this.clearCells
          },
          _react2.default.createElement(
            'span',
            null,
            'Clear'
          )
        ),
        _react2.default.createElement('div', { key: 'd4', className: 'divider' }),
        _react2.default.createElement(
          'li',
          {
            key: '11',
            onClick: this.sort()
          },
          _react2.default.createElement(
            'span',
            null,
            'Sort A-Z'
          )
        ),
        _react2.default.createElement(
          'li',
          {
            key: '12',
            onClick: this.sort(true)
          },
          _react2.default.createElement(
            'span',
            null,
            'Sort Z-A'
          )
        )
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this8 = this;

      var _props2 = this.props,
          width = _props2.width,
          height = _props2.height;

      return _react2.default.createElement(
        'div',
        {
          className: 'sou-table-wrapper',
          style: {
            width: width === undefined ? 'auto' : width + 'px',
            height: height === undefined ? 'auto' : height + 'px'
          },
          ref: function ref(wrapper) {
            return _this8.wrapper = wrapper;
          }
        },
        this.renderTable(),
        this.renderContext()
      );
    }
  }]);
  return SouTable;
}(_react.Component);

SouTable.defaultProps = {
  tableData: [['City', 'Beijing', 'Shanghai', 'Guangzhou'], ['Temperature', '5', '22', '29'], ['Weather', 'Windy', 'Sunny', 'Rainy']],
  minTableCol: 10,
  minTableRow: 21,
  minCellWidth: 50,
  cellHeight: 28,
  getData: function getData(data) {
    console.log(data);
  }
};

SouTable.propTypes = {
  tableData: _react.PropTypes.array,
  width: _react.PropTypes.number,
  height: _react.PropTypes.number,
  minTableCol: _react.PropTypes.number,
  minTableRow: _react.PropTypes.number,
  minCellWidth: _react.PropTypes.number,
  cellHeight: _react.PropTypes.number,
  getData: _react.PropTypes.func
};

exports.default = SouTable;