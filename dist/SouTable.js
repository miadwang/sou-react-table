"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

var trimData = function trimData(tableData) {
  var tableDataCol = tableData.length;
  var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
  var newTableData = [];
  var newTableDataCol = tableDataCol;
  var newTableDataRow = tableDataRow;

  for (var i = newTableDataCol - 1; i >= 0; i -= 1) {
    if (tableData[i].every(function (datum) {
      return datum === '';
    })) {
      newTableDataCol -= 1;
    } else {
      break;
    }
  }

  loop: {
    // eslint
    for (var j = newTableDataRow - 1; j >= 0; j -= 1) {
      for (var _i = 0; _i < tableDataCol; _i += 1) {
        if (tableData[_i][j] !== '') {
          break loop;
        }
      }

      newTableDataRow -= 1;
    }
  }

  for (var _i2 = 0; _i2 < newTableDataCol; _i2 += 1) {
    newTableData[_i2] = tableData[_i2].slice(0, newTableDataRow);
  }

  return newTableData;
};

var SouTable =
/*#__PURE__*/
function (_Component) {
  _inherits(SouTable, _Component);

  function SouTable(props) {
    var _this;

    _classCallCheck(this, SouTable);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(SouTable).call(this, props));
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
    _this.onContextMenu = _this.onContextMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.hideContextMenu = _this.hideContextMenu.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.selectCell = _this.selectCell.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.selectNextCell = _this.selectNextCell.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.showEmptyInput = _this.showEmptyInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.showInput = _this.showInput.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onChangeInputValue = _this.onChangeInputValue.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onInputKeyPress = _this.onInputKeyPress.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onInputKeyDown = _this.onInputKeyDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateTable = _this.updateTable.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getTableDataForPaste = _this.getTableDataForPaste.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateTableOnPaste = _this.updateTableOnPaste.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.updateTableOnAutoPaste = _this.updateTableOnAutoPaste.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.insertCol = _this.insertCol.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.insertRow = _this.insertRow.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.deleteCol = _this.deleteCol.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.deleteRow = _this.deleteRow.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onMouseDown = _this.onMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onGripMouseDown = _this.onGripMouseDown.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onMouseOver = _this.onMouseOver.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onMouseUp = _this.onMouseUp.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.copy = _this.copy.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.clearCells = _this.clearCells.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.cut = _this.cut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.paste = _this.paste.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onCopy = _this.onCopy.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onCut = _this.onCut.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onPaste = _this.onPaste.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.getSwitchedTableData = _this.getSwitchedTableData.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.switchColRow = _this.switchColRow.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.sort = _this.sort.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onLeftHeaderScroll = _this.onLeftHeaderScroll.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onTopHeaderScroll = _this.onTopHeaderScroll.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.onInnerTableScroll = _this.onInnerTableScroll.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.styleTable = _this.styleTable.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderBorders = _this.renderBorders.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.styleBorders = _this.styleBorders.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    _this.renderContext = _this.renderContext.bind(_assertThisInitialized(_assertThisInitialized(_this)));
    return _this;
  }

  _createClass(SouTable, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.styleTable();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState(function (prevState) {
        return {
          tableData: nextProps.tableData,
          tableCol: Math.max(nextProps.minTableCol, nextProps.tableData.length, prevState.tableCol),
          tableRow: Math.max(nextProps.minTableRow, nextProps.tableData.length > 0 ? nextProps.tableData[0].length : 0, prevState.tableRow)
        };
      });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate() {
      if (this.state.colIndex !== undefined) {
        this.styleTable();
        this.styleBorders();
      }
    }
  }, {
    key: "onContextMenu",
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
          this.selectCell(target, Object.assign({}, this.mouseDownState, contextMenuState));
        }
      } else if (e.target.tagName === 'INPUT') {
        this.setState(contextMenuState);
      }

      this.mouseDownState = undefined;
    }
  }, {
    key: "hideContextMenu",
    value: function hideContextMenu() {
      this.setState({
        isContextMenuHidden: true
      });
    }
  }, {
    key: "selectCell",
    value: function selectCell(td, additionalState) {
      var _this2 = this;

      if (this.state.isTyping) {
        this.updateTable(this.state.inputValue);
      }

      var inputValue = td.textContent;
      this.setState(Object.assign({
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
    key: "selectNextCell",
    value: function selectNextCell(v, h) {
      var _this$state = this.state,
          tableCol = _this$state.tableCol,
          tableRow = _this$state.tableRow;
      var _this$state2 = this.state,
          colIndex = _this$state2.colIndex,
          rowIndex = _this$state2.rowIndex;

      if (h !== 0) {
        colIndex = h === -1 ? Math.max(colIndex + h, 0) : Math.min(colIndex + h, tableCol - 1);
      }

      if (v !== 0) {
        rowIndex = v === -1 ? Math.max(rowIndex + v, 0) : Math.min(rowIndex + v, tableRow - 1);
      }

      var nextTd = this.table.querySelector("[data-col='".concat(colIndex, "'][data-row='").concat(rowIndex, "']"));
      this.selectCell(nextTd, {
        colIndex: colIndex,
        rowIndex: rowIndex
      });
    }
  }, {
    key: "showEmptyInput",
    value: function showEmptyInput() {
      this.setState({
        inputValue: '',
        isTyping: true,
        isContextMenuHidden: true
      });
    }
  }, {
    key: "showInput",
    value: function showInput() {
      this.input.selectionStart = this.input.selectionEnd;
      this.setState({
        isTyping: true,
        isContextMenuHidden: true
      });
    }
  }, {
    key: "onChangeInputValue",
    value: function onChangeInputValue() {
      var inputValue = this.input.value;
      this.setState({
        inputValue: inputValue
      });
    }
  }, {
    key: "onInputKeyPress",
    value: function onInputKeyPress(e) {
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
  }, {
    key: "onInputKeyDown",
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
    key: "updateTable",
    value: function updateTable(value) {
      var _this$state3 = this.state,
          tableData = _this$state3.tableData,
          colIndex = _this$state3.colIndex,
          rowIndex = _this$state3.rowIndex;
      var newTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var newTableDataCol = Math.max(colIndex + 1, tableDataCol);
      var newTableDataRow = Math.max(rowIndex + 1, tableDataRow);

      for (var i = 0; i < newTableDataCol; i += 1) {
        newTableData[i] = [];

        for (var j = 0; j < newTableDataRow; j += 1) {
          if (i === colIndex && j === rowIndex) {
            newTableData[i][j] = value;
          } else if (i < tableDataCol && j < tableDataRow) {
            newTableData[i][j] = tableData[i][j];
          } else {
            newTableData[i][j] = '';
          }
        }
      }

      var trimmedTableData = trimData(newTableData);
      this.setState({
        tableData: trimmedTableData
      });
      this.props.getData(trimmedTableData);
    }
  }, {
    key: "getTableDataForPaste",
    value: function getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex) {
      var tableData = this.state.tableData;
      var newTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var pasteDataCol = pasteData.length > 0 ? pasteData[0].length : 0;
      var pasteDataRow = pasteData.length;
      var newTableDataCol = Math.max(pasteColIndex + pasteDataCol, tableDataCol);
      var newTableDataRow = Math.max(pasteRowIndex + pasteDataRow, tableDataRow);

      for (var i = 0; i < newTableDataCol; i += 1) {
        newTableData[i] = [];

        for (var j = 0; j < newTableDataRow; j += 1) {
          if (i >= pasteColIndex && i < pasteColIndex + pasteDataCol && j >= pasteRowIndex && j < pasteRowIndex + pasteDataRow) {
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
  }, {
    key: "updateTableOnPaste",
    value: function updateTableOnPaste(data) {
      var selectAfterPaste = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var _this$state4 = this.state,
          colIndex = _this$state4.colIndex,
          rowIndex = _this$state4.rowIndex,
          endColIndex = _this$state4.endColIndex,
          endRowIndex = _this$state4.endRowIndex;
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
        var pasteColIndex = colIndex;
        var pasteRowIndex = rowIndex;
        var selectCol = 1;
        var selectRow = 1;
        var pasteCol = dataCol;
        var pasteRow = dataRow;

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

            for (var i = 0; i < pasteRow; i += 1) {
              pasteData[i] = [];

              for (var j = 0; j < pasteCol; j += 1) {
                pasteData[i][j] = data[i % dataRow][j % dataCol];
              }
            }
          }
        } // step 2: get new table data


        var trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
        this.props.getData(trimmedData); // step 3: select cells and expand table after paste

        if (selectAfterPaste) {
          var pasteTd = this.table.querySelector("[data-col='".concat(pasteColIndex, "'][data-row='").concat(pasteRowIndex, "']"));
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
          this.setState(function (prevState) {
            return {
              tableData: trimmedData,
              tableCol: Math.max(prevState.tableCol, trimmedData.length),
              tableRow: Math.max(prevState.tableRow, trimmedData.length > 0 ? trimmedData[0].length : 0)
            };
          });
        }
      }
    }
  }, {
    key: "updateTableOnAutoPaste",
    value: function updateTableOnAutoPaste() {
      // step 1: get paste and select cells
      var _this$state5 = this.state,
          colIndex = _this$state5.colIndex,
          rowIndex = _this$state5.rowIndex,
          endColIndex = _this$state5.endColIndex,
          endRowIndex = _this$state5.endRowIndex,
          dragColIndex = _this$state5.dragColIndex,
          dragRowIndex = _this$state5.dragRowIndex;
      var pasteColIndex;
      var pasteRowIndex;
      var pasteCol = 1;
      var pasteRow = 1;
      var selectColIndex;
      var selectRowIndex;
      var selectEndColIndex;
      var selectEndRowIndex;

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
      } // step 2: get paste data


      var copyData = this.copy(false);
      var dataCol = copyData[0].length;
      var dataRow = copyData.length;
      var pasteData = [];

      for (var i = 0; i < pasteRow; i += 1) {
        pasteData[i] = [];

        for (var j = 0; j < pasteCol; j += 1) {
          pasteData[i][j] = copyData[i % dataRow][j % dataCol];
        }
      } // step 3: get new table data


      var trimmedData = this.getTableDataForPaste(pasteData, pasteColIndex, pasteRowIndex);
      this.props.getData(trimmedData); // step 4: select cells after paste

      var selectTd = this.table.querySelector("[data-col='".concat(selectColIndex, "'][data-row='").concat(selectRowIndex, "']"));
      this.selectCell(selectTd, {
        tableData: trimmedData,
        colIndex: selectColIndex,
        rowIndex: selectRowIndex,
        endColIndex: selectEndColIndex,
        endRowIndex: selectEndRowIndex
      });
    }
  }, {
    key: "insertCol",
    value: function insertCol(d) {
      var _this3 = this;

      return function () {
        var _this3$state = _this3.state,
            tableData = _this3$state.tableData,
            tableCol = _this3$state.tableCol,
            colIndex = _this3$state.colIndex;

        if (colIndex + d < tableData.length) {
          var emptyCol = [];

          for (var i = 0; i < tableData.length + 1; i += 1) {
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
    key: "insertRow",
    value: function insertRow(d) {
      var _this4 = this;

      return function () {
        var _this4$state = _this4.state,
            tableData = _this4$state.tableData,
            tableRow = _this4$state.tableRow,
            rowIndex = _this4$state.rowIndex;
        var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;

        if (rowIndex + d < tableDataRow) {
          for (var i = 0; i < tableData.length; i += 1) {
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
    key: "deleteCol",
    value: function deleteCol() {
      var _this$state6 = this.state,
          tableData = _this$state6.tableData,
          tableCol = _this$state6.tableCol,
          colIndex = _this$state6.colIndex;

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
    key: "deleteRow",
    value: function deleteRow() {
      var _this$state7 = this.state,
          tableData = _this$state7.tableData,
          tableRow = _this$state7.tableRow,
          rowIndex = _this$state7.rowIndex;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;

      if (rowIndex < tableDataRow) {
        for (var i = 0; i < tableData.length; i += 1) {
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
    key: "onMouseDown",
    value: function onMouseDown(e) {
      e.preventDefault();
      var target = e.target;
      var colIndex = Number(target.getAttribute('data-col'));
      var rowIndex = Number(target.getAttribute('data-row'));

      if ((target.tagName === 'TD' || target.tagName === 'TH') && !(rowIndex === -1 && colIndex === -1)) {
        var _this$state8 = this.state,
            tableCol = _this$state8.tableCol,
            tableRow = _this$state8.tableRow;
        var endColIndex;
        var endRowIndex;
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
    key: "onGripMouseDown",
    value: function onGripMouseDown(e) {
      e.preventDefault();
      this.setState({
        isDragging: true
      });
    }
  }, {
    key: "onMouseOver",
    value: function onMouseOver(e) {
      e.preventDefault();
      var target = e.target;

      if (target.tagName === 'TD' || target.tagName === 'TH') {
        var targetColIndex = Number(target.getAttribute('data-col'));
        var targetRowIndex = Number(target.getAttribute('data-row'));

        if (this.mouseDownState !== undefined) {
          var _this$state9 = this.state,
              tableCol = _this$state9.tableCol,
              tableRow = _this$state9.tableRow,
              isMultiSelecting = _this$state9.isMultiSelecting;
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
          var _this$state10 = this.state,
              colIndex = _this$state10.colIndex,
              rowIndex = _this$state10.rowIndex,
              _endColIndex = _this$state10.endColIndex,
              _endRowIndex = _this$state10.endRowIndex;
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
    key: "onMouseUp",
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
    key: "copy",
    value: function copy() {
      var toClipboard = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      var _this$state11 = this.state,
          tableData = _this$state11.tableData,
          colIndex = _this$state11.colIndex,
          rowIndex = _this$state11.rowIndex;
      var _this$state12 = this.state,
          endColIndex = _this$state12.endColIndex,
          endRowIndex = _this$state12.endRowIndex;

      if (endColIndex === undefined) {
        endColIndex = colIndex;
        endRowIndex = rowIndex;
      }

      var minCol = Math.min(colIndex, endColIndex);
      var maxCol = Math.max(colIndex, endColIndex);
      var minRow = Math.min(rowIndex, endRowIndex);
      var maxRow = Math.max(rowIndex, endRowIndex);
      var data = [];

      for (var i = minRow; i <= maxRow; i += 1) {
        data[i - minRow] = [];

        for (var j = minCol; j <= maxCol; j += 1) {
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
    key: "clearCells",
    value: function clearCells() {
      var emptyCol = Math.abs(this.state.colIndex - this.state.endColIndex) || 0;
      var emptyRow = Math.abs(this.state.rowIndex - this.state.endRowIndex) || 0;
      var emptyData = [];

      for (var i = 0; i <= emptyRow; i += 1) {
        emptyData[i] = [];

        for (var j = 0; j <= emptyCol; j += 1) {
          emptyData[i][j] = '';
        }
      }

      this.updateTableOnPaste(emptyData, false);
    }
  }, {
    key: "cut",
    value: function cut() {
      this.copy();
      this.clearCells();
    }
  }, {
    key: "paste",
    value: function paste() {
      this.updateTableOnPaste(this.state.innerClipboardData);
    }
  }, {
    key: "onCopy",
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
    key: "onCut",
    value: function onCut(e) {
      // will update innerClipboardData in onCopy
      e.preventDefault();
      this.onCopy(e);
      this.clearCells();
    }
  }, {
    key: "onPaste",
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
    key: "getSwitchedTableData",
    value: function getSwitchedTableData() {
      var tableData = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.state.tableData;
      var switchedTableData = [];
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;

      for (var i = 0; i < tableDataRow; i += 1) {
        switchedTableData[i] = [];

        for (var j = 0; j < tableDataCol; j += 1) {
          switchedTableData[i][j] = tableData[j][i];
        }
      }

      return switchedTableData;
    }
  }, {
    key: "switchColRow",
    value: function switchColRow() {
      var _this5 = this;

      var tableData = this.state.tableData;
      var tableDataCol = tableData.length;
      var tableDataRow = tableData.length > 0 ? tableData[0].length : 0;
      var newTableData = this.getSwitchedTableData();
      this.setState(function (prevState) {
        return {
          tableData: newTableData,
          tableCol: Math.max(_this5.props.minTableCol, tableDataRow, prevState.tableCol),
          tableRow: Math.max(_this5.props.minTableRow, tableDataCol, prevState.tableRow)
        };
      });
      this.props.getData(newTableData);
    }
  }, {
    key: "sort",
    value: function sort() {
      var _this6 = this;

      var inverse = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      return function () {
        var colIndex = _this6.state.colIndex;

        var switchedTableData = _this6.getSwitchedTableData();

        var firstRow = switchedTableData[0];
        var restRows = switchedTableData.slice(1);

        if (inverse) {
          restRows.sort(function (a, b) {
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
          restRows.sort(function (a, b) {
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

        var sortedTableData = _this6.getSwitchedTableData([firstRow].concat(restRows));

        _this6.setState({
          tableData: sortedTableData
        });

        _this6.props.getData(sortedTableData);
      };
    }
  }, {
    key: "onLeftHeaderScroll",
    value: function onLeftHeaderScroll() {
      var scrollTop = this.leftHeader.scrollTop;

      if (this.scrollTop !== scrollTop) {
        this.scrollTop = scrollTop;
        this.innerTable.scrollTop = scrollTop;

        if (scrollTop > 0) {
          this.topHeader.style.height = "".concat(this.props.cellHeight + 1, "px");
          this.innerTable.style.marginTop = '-1px';
          this.leftHeaderHead.style.height = "".concat(this.props.cellHeight + 1, "px");
        } else {
          this.topHeader.style.height = "".concat(this.props.cellHeight, "px");
          this.innerTable.style.marginTop = 0;
          this.leftHeaderHead.style.height = "".concat(this.props.cellHeight, "px");
        }
      }
    }
  }, {
    key: "onTopHeaderScroll",
    value: function onTopHeaderScroll() {
      var scrollLeft = this.topHeader.scrollLeft;

      if (this.scrollLeft !== scrollLeft) {
        this.scrollLeft = scrollLeft;
        this.innerTable.scrollLeft = scrollLeft;

        if (scrollLeft > 0) {
          this.leftWrapper.style.width = "".concat(this.props.minCellWidth + 1, "px");
        } else {
          this.leftWrapper.style.width = "".concat(this.props.minCellWidth, "px");
        }
      }
    }
  }, {
    key: "onInnerTableScroll",
    value: function onInnerTableScroll() {
      var _this$innerTable = this.innerTable,
          scrollTop = _this$innerTable.scrollTop,
          scrollLeft = _this$innerTable.scrollLeft;

      if (this.scrollTop !== scrollTop) {
        this.scrollTop = scrollTop;
        this.leftHeader.scrollTop = scrollTop;

        if (scrollTop > 0) {
          this.topHeader.style.height = "".concat(this.props.cellHeight + 1, "px");
          this.innerTable.style.marginTop = '-1px';
          this.leftHeaderHead.style.height = "".concat(this.props.cellHeight + 1, "px");
        } else {
          this.topHeader.style.height = "".concat(this.props.cellHeight, "px");
          this.innerTable.style.marginTop = 0;
          this.leftHeaderHead.style.height = "".concat(this.props.cellHeight, "px");
        }
      }

      if (this.scrollLeft !== scrollLeft) {
        this.scrollLeft = scrollLeft;
        this.topHeader.scrollLeft = scrollLeft;

        if (scrollLeft > 0) {
          this.leftWrapper.style.width = "".concat(this.props.minCellWidth + 1, "px");
        } else {
          this.leftWrapper.style.width = "".concat(this.props.minCellWidth, "px");
        }
      }
    }
  }, {
    key: "renderTable",
    value: function renderTable() {
      var _this7 = this;

      var _this$state13 = this.state,
          tableData = _this$state13.tableData,
          tableCol = _this$state13.tableCol,
          tableRow = _this$state13.tableRow,
          colIndex = _this$state13.colIndex,
          rowIndex = _this$state13.rowIndex,
          endColIndex = _this$state13.endColIndex,
          endRowIndex = _this$state13.endRowIndex;
      var _this$props = this.props,
          width = _this$props.width,
          height = _this$props.height,
          minCellWidth = _this$props.minCellWidth,
          cellHeight = _this$props.cellHeight;
      var cellStyle = {
        minWidth: "".concat(minCellWidth, "px"),
        height: "".concat(cellHeight, "px")
      };
      var leftHeaderRows = [];

      for (var j = 0; j < tableRow; j += 1) {
        var isRowIncluded = endRowIndex !== undefined ? j >= Math.min(rowIndex, endRowIndex) && j <= Math.max(rowIndex, endRowIndex) : j === rowIndex;
        leftHeaderRows.push(_react.default.createElement("tr", {
          key: j
        }, _react.default.createElement("td", {
          style: cellStyle,
          "data-col": -1,
          "data-row": j,
          className: isRowIncluded ? 'sou-selected-cell-indicator' : ''
        }, j)));
      }

      var ths = [];

      for (var i = 1; i <= tableCol; i += 1) {
        var isColIncluded = endColIndex !== undefined ? i - 1 >= Math.min(colIndex, endColIndex) && i - 1 <= Math.max(colIndex, endColIndex) : i - 1 === colIndex;
        ths.push(_react.default.createElement("th", {
          key: i,
          style: cellStyle,
          "data-col": i - 1,
          "data-row": -1,
          className: isColIncluded ? 'sou-selected-cell-indicator' : ''
        }, i > 26 && String.fromCharCode(Math.floor((i - 1) / 26) + 64), String.fromCharCode((i - 1) % 26 + 65)));
      }

      var rows = [];

      var _loop = function _loop(_j) {
        var row = _react.default.createElement("tr", {
          key: _j
        }, ths.map(function (col, index) {
          var isCurrent = index === colIndex && _j === rowIndex;

          var isMultiSelected = index >= Math.min(colIndex, endColIndex) && index <= Math.max(colIndex, endColIndex) && _j >= Math.min(rowIndex, endRowIndex) && _j <= Math.max(rowIndex, endRowIndex);

          return _react.default.createElement("td", {
            key: index + 1 // eslint-disable-line
            ,
            style: cellStyle,
            "data-col": index,
            "data-row": _j,
            className: isMultiSelected ? 'sou-selected-cell' : ''
          }, tableData[index] !== undefined ? tableData[index][_j] : '', isCurrent && _react.default.createElement("input", {
            type: "text",
            className: "sou-input",
            style: {
              zIndex: _this7.state.isTyping ? 100 : -100
            },
            ref: function ref(input) {
              _this7.input = input;
            },
            value: _this7.state.inputValue,
            onChange: _this7.onChangeInputValue,
            onKeyPress: _this7.onInputKeyPress,
            onKeyDown: _this7.onInputKeyDown,
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
            onCopy: _this7.onCopy,
            onCut: _this7.onCut,
            onPaste: _this7.onPaste
          }));
        }));

        rows.push(row);
      };

      for (var _j = 0; _j < tableRow; _j += 1) {
        _loop(_j);
      }

      return _react.default.createElement("div", null, _react.default.createElement("div", {
        className: "left-wrapper",
        style: {
          width: minCellWidth
        },
        ref: function ref(leftWrapper) {
          _this7.leftWrapper = leftWrapper;
        }
      }, _react.default.createElement("table", {
        className: "sou-table-left-header"
      }, _react.default.createElement("thead", {
        style: {
          height: "".concat(cellHeight, "px")
        },
        ref: function ref(leftHeaderHead) {
          _this7.leftHeaderHead = leftHeaderHead;
        }
      }, _react.default.createElement("tr", null, _react.default.createElement("th", {
        style: cellStyle,
        "data-col": -1,
        "data-row": -1,
        onClick: this.switchColRow,
        onContextMenu: function onContextMenu(e) {
          return e.preventDefault();
        }
      }, "switch"))), _react.default.createElement("tbody", {
        style: {
          marginTop: cellHeight,
          height: "".concat(height - cellHeight, "px")
        },
        onContextMenu: this.onContextMenu,
        onMouseDown: this.onMouseDown,
        onMouseOver: this.onMouseOver,
        onMouseUp: this.onMouseUp,
        ref: function ref(leftHeader) {
          _this7.leftHeader = leftHeader;
        },
        onScroll: this.onLeftHeaderScroll
      }, leftHeaderRows))), _react.default.createElement("div", {
        className: "right-wrapper"
      }, _react.default.createElement("div", {
        className: "right-top-wrapper",
        style: {
          width: "".concat(width - minCellWidth - 1, "px"),
          height: "".concat(cellHeight, "px")
        },
        ref: function ref(topHeader) {
          _this7.topHeader = topHeader;
        },
        onScroll: this.onTopHeaderScroll
      }, _react.default.createElement("table", {
        className: "sou-table",
        onContextMenu: this.onContextMenu,
        onMouseDown: this.onMouseDown,
        onMouseOver: this.onMouseOver,
        onMouseUp: this.onMouseUp
      }, _react.default.createElement("thead", null, _react.default.createElement("tr", null, ths)))), _react.default.createElement("div", {
        className: "right-bottom-wrapper",
        style: {
          width: "".concat(width - minCellWidth - 1, "px"),
          height: "".concat(height - cellHeight, "px")
        },
        ref: function ref(innerTable) {
          _this7.innerTable = innerTable;
        },
        onScroll: this.onInnerTableScroll
      }, _react.default.createElement("div", {
        className: "inner-wrapper"
      }, _react.default.createElement("table", {
        className: "sou-table",
        ref: function ref(table) {
          _this7.table = table;
        },
        onContextMenu: this.onContextMenu,
        onMouseDown: this.onMouseDown,
        onMouseOver: this.onMouseOver,
        onMouseUp: this.onMouseUp
      }, _react.default.createElement("tbody", {
        onDoubleClick: function onDoubleClick() {
          _this7.showInput();
        }
      }, rows)), this.renderBorders()))));
    }
  }, {
    key: "styleTable",
    value: function styleTable() {
      var tableCol = this.state.tableCol;
      var theadTr = document.querySelector('.sou-table > thead > tr');
      var ths = theadTr.children;
      var tbodyTr = document.querySelector('.sou-table > tbody > tr');
      var tds = tbodyTr.children;
      theadTr.style.width = "".concat(tbodyTr.offsetWidth + 1, "px");
      ths[0].style.width = "".concat(tds[0].offsetWidth + 1, "px");

      for (var i = 1; i < tableCol; i += 1) {
        ths[i].style.width = "".concat(tds[i].offsetWidth, "px");
      }
    }
  }, {
    key: "renderBorders",
    value: function renderBorders() {
      return _react.default.createElement("div", {
        className: "sou-borders",
        onMouseDown: function onMouseDown(e) {
          return e.preventDefault();
        },
        onMouseUp: this.onMouseUp,
        onContextMenu: function onContextMenu(e) {
          return e.preventDefault();
        }
      }, this.state.dragColIndex !== undefined && _react.default.createElement("div", {
        className: "sou-paste-borders"
      }, _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null)), this.state.endColIndex !== undefined && _react.default.createElement("div", {
        className: "sou-area-borders"
      }, _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", {
        className: "sou-drag-grip",
        onMouseDown: this.onGripMouseDown
      })), this.state.colIndex !== undefined && _react.default.createElement("div", {
        className: "sou-current-borders"
      }, _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null), _react.default.createElement("div", null), this.state.endColIndex === undefined && _react.default.createElement("div", {
        className: "sou-drag-grip",
        onMouseDown: this.onGripMouseDown
      })));
    }
  }, {
    key: "styleBorders",
    value: function styleBorders() {
      var _this$state14 = this.state,
          colIndex = _this$state14.colIndex,
          rowIndex = _this$state14.rowIndex,
          endColIndex = _this$state14.endColIndex,
          endRowIndex = _this$state14.endRowIndex,
          dragColIndex = _this$state14.dragColIndex,
          dragRowIndex = _this$state14.dragRowIndex;
      var currentTd = this.table.querySelector("[data-col='".concat(colIndex, "'][data-row='").concat(rowIndex, "']"));
      var offsetTop = currentTd.offsetTop,
          offsetLeft = currentTd.offsetLeft,
          offsetWidth = currentTd.offsetWidth,
          offsetHeight = currentTd.offsetHeight;
      var currentBorders = document.querySelectorAll('.sou-current-borders > div');
      currentBorders[0].setAttribute('style', "top: ".concat(offsetTop, "px; left: ").concat(offsetLeft, "px; width: ").concat(offsetWidth, "px; height: 2px;"));
      currentBorders[1].setAttribute('style', "top: ".concat(offsetTop, "px; left: ").concat(offsetLeft + offsetWidth - 1, "px; width: 2px; height: ").concat(offsetHeight, "px;"));
      currentBorders[2].setAttribute('style', "top: ".concat(offsetTop + offsetHeight - 1, "px; left: ").concat(offsetLeft, "px; width: ").concat(offsetWidth, "px; height: 2px;"));
      currentBorders[3].setAttribute('style', "top: ".concat(offsetTop, "px; left: ").concat(offsetLeft, "px; width: 2px; height: ").concat(offsetHeight, "px;"));
      var multiSelectOffsetTop;
      var multiSelectOffsetLeft;
      var multiSelectOffsetWidth;
      var multiSelectOffsetHeight;
      var autoPasteOffsetTop;
      var autoPasteOffsetLeft;
      var autoPasteOffsetWidth;
      var autoPasteOffsetHeight;

      if (endColIndex !== undefined) {
        var endTd = this.table.querySelector("[data-col='".concat(endColIndex, "'][data-row='").concat(endRowIndex, "']"));
        var endOffsetTop = endTd.offsetTop;
        var endOffsetLeft = endTd.offsetLeft;
        var endOffsetWidth = endTd.offsetWidth;
        var endOffsetHeight = endTd.offsetHeight;
        multiSelectOffsetTop = Math.min(offsetTop, endOffsetTop);
        multiSelectOffsetLeft = Math.min(offsetLeft, endOffsetLeft);
        multiSelectOffsetWidth = offsetLeft >= endOffsetLeft ? offsetLeft - endOffsetLeft + offsetWidth : endOffsetLeft - offsetLeft + endOffsetWidth;
        multiSelectOffsetHeight = offsetTop >= endOffsetTop ? offsetTop - endOffsetTop + offsetHeight : endOffsetTop - offsetTop + endOffsetHeight;
        var areaBorders = document.querySelectorAll('.sou-area-borders > div');
        areaBorders[0].setAttribute('style', "top: ".concat(multiSelectOffsetTop, "px; left: ").concat(multiSelectOffsetLeft, "px; width: ").concat(multiSelectOffsetWidth, "px; height: 1px;"));
        areaBorders[1].setAttribute('style', "top: ".concat(multiSelectOffsetTop, "px; left: ").concat(multiSelectOffsetLeft + multiSelectOffsetWidth, "px; width: 1px; height: ").concat(multiSelectOffsetHeight, "px;"));
        areaBorders[2].setAttribute('style', "top: ".concat(multiSelectOffsetTop + multiSelectOffsetHeight, "px; left: ").concat(multiSelectOffsetLeft, "px; width: ").concat(multiSelectOffsetWidth, "px; height: 1px;"));
        areaBorders[3].setAttribute('style', "top: ".concat(multiSelectOffsetTop, "px; left: ").concat(multiSelectOffsetLeft, "px; width: 1px; height: ").concat(multiSelectOffsetHeight, "px;"));
        areaBorders[4].setAttribute('style', "display: ".concat(this.state.isTyping ? 'none' : 'initial', "; top: ").concat(multiSelectOffsetTop + multiSelectOffsetHeight - 4, "px; left: ").concat(multiSelectOffsetLeft + multiSelectOffsetWidth - 4, "px;"));
      } else {
        currentBorders[4].setAttribute('style', "display: ".concat(this.state.isTyping ? 'none' : 'initial', "; top: ").concat(offsetTop + offsetHeight - 4, "px; left: ").concat(offsetLeft + offsetWidth - 4, "px;"));
      }

      if (dragColIndex !== undefined) {
        var dragTd = this.table.querySelector("[data-col='".concat(dragColIndex, "'][data-row='").concat(dragRowIndex, "']"));
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
        } else if (dragRowIndex <= Math.max(rowIndex, endRowIndex) && dragRowIndex >= Math.min(rowIndex, endRowIndex)) {
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

        var pasteBorders = document.querySelectorAll('.sou-paste-borders > div');
        pasteBorders[0].setAttribute('style', "top: ".concat(autoPasteOffsetTop, "px; left: ").concat(autoPasteOffsetLeft, "px; width: ").concat(autoPasteOffsetWidth, "px; height: 1px;"));
        pasteBorders[1].setAttribute('style', "top: ".concat(autoPasteOffsetTop, "px; left: ").concat(autoPasteOffsetLeft + autoPasteOffsetWidth, "px; width: 1px; height: ").concat(autoPasteOffsetHeight, "px;"));
        pasteBorders[2].setAttribute('style', "top: ".concat(autoPasteOffsetTop + autoPasteOffsetHeight, "px; left: ").concat(autoPasteOffsetLeft, "px; width: ").concat(autoPasteOffsetWidth, "px; height: 1px;"));
        pasteBorders[3].setAttribute('style', "top: ".concat(autoPasteOffsetTop, "px; left: ").concat(autoPasteOffsetLeft, "px; width: 1px; height: ").concat(autoPasteOffsetHeight, "px;"));
      }
    }
  }, {
    key: "renderContext",
    value: function renderContext() {
      var _this8 = this;

      return _react.default.createElement("ul", {
        style: {
          top: "".concat(this.state.yPos, "px"),
          left: "".concat(this.state.xPos, "px"),
          display: this.state.isContextMenuHidden ? 'none' : 'block'
        },
        className: "sou-context",
        onClick: function onClick() {
          _this8.hideContextMenu();

          _this8.input.select();
        },
        onKeyPress: function onKeyPress() {
          _this8.hideContextMenu();

          _this8.input.select();
        },
        onContextMenu: function onContextMenu(e) {
          return e.preventDefault();
        }
      }, _react.default.createElement("li", {
        key: "1",
        onClick: this.copy,
        onKeyPress: this.copy
      }, _react.default.createElement("span", null, "Copy")), _react.default.createElement("li", {
        key: "2",
        onClick: this.cut,
        onKeyPress: this.cut
      }, _react.default.createElement("span", null, "Cut")), _react.default.createElement("li", {
        key: "3",
        onClick: this.paste,
        onKeyPress: this.paste
      }, _react.default.createElement("span", null, "Paste")), _react.default.createElement("div", {
        key: "d1",
        className: "divider"
      }), _react.default.createElement("li", {
        key: "4",
        onClick: this.insertRow(0),
        onKeyPress: this.insertRow(0)
      }, _react.default.createElement("span", null, "Insert row above")), _react.default.createElement("li", {
        key: "5",
        onClick: this.insertRow(1),
        onKeyPress: this.insertRow(1)
      }, _react.default.createElement("span", null, "Insert row below")), _react.default.createElement("li", {
        key: "6",
        onClick: this.deleteRow,
        onKeyPress: this.deleteRow
      }, _react.default.createElement("span", null, "Delete row")), _react.default.createElement("div", {
        key: "d2",
        className: "divider"
      }), _react.default.createElement("li", {
        key: "7",
        onClick: this.insertCol(0),
        onKeyPress: this.insertCol(0)
      }, _react.default.createElement("span", null, "Insert column left")), _react.default.createElement("li", {
        key: "8",
        onClick: this.insertCol(1),
        onKeyPress: this.insertCol(1)
      }, _react.default.createElement("span", null, "Insert column right")), _react.default.createElement("li", {
        key: "9",
        onClick: this.deleteCol,
        onKeyPress: this.deleteCol
      }, _react.default.createElement("span", null, "Delete column")), _react.default.createElement("div", {
        key: "d3",
        className: "divider"
      }), _react.default.createElement("li", {
        key: "10",
        onClick: this.clearCells,
        onKeyPress: this.clearCells
      }, _react.default.createElement("span", null, "Clear")), _react.default.createElement("div", {
        key: "d4",
        className: "divider"
      }), _react.default.createElement("li", {
        key: "11",
        onClick: this.sort(),
        onKeyPress: this.sort()
      }, _react.default.createElement("span", null, "Sort A-Z")), _react.default.createElement("li", {
        key: "12",
        onClick: this.sort(true),
        onKeyPress: this.sort(true)
      }, _react.default.createElement("span", null, "Sort Z-A")));
    }
  }, {
    key: "render",
    value: function render() {
      var _this9 = this;

      var _this$props2 = this.props,
          width = _this$props2.width,
          height = _this$props2.height;
      return _react.default.createElement("div", {
        className: "sou-table-wrapper",
        style: {
          width: width === undefined ? 'auto' : "".concat(width, "px"),
          height: height === undefined ? 'auto' : "".concat(height, "px")
        },
        ref: function ref(wrapper) {
          _this9.wrapper = wrapper;
        }
      }, this.renderTable(), this.renderContext());
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
  tableData: _propTypes.default.arrayOf(_propTypes.default.arrayOf(_propTypes.default.string)),
  width: _propTypes.default.number,
  // eslint-disable-line
  height: _propTypes.default.number,
  // eslint-disable-line
  minTableCol: _propTypes.default.number,
  minTableRow: _propTypes.default.number,
  minCellWidth: _propTypes.default.number,
  cellHeight: _propTypes.default.number,
  getData: _propTypes.default.func
};
var _default = SouTable;
exports.default = _default;