// 此插件依赖于jquery
// targertNode
//   dom节点或节点的id 节点对象 HTMLElement 或id字符串 String
// option 一个参数配置对象 一个对象 Object
//   thOption Object
//     thText Array 表头的内容 元素 String 为 每一列的表头字符串
//       如 ['性别' '姓名']
//     thStyle: 表头单元格的样式 String css样式字符串
//   row Number 表格的行数  默认为 5
//   col Number 表格的列数  默认为 4
//   setTextOption Object
//      单元格设置text的验证 通过验证才设值
//   tdData [[Object]] 二维数组
//     以数据初始话表格
//     参数数组的第第一维的长度为行数 第一维的第一个的元素的数组长度为列的长度
//     二维数组的第二维的元素为对象 Object
//       text String 单元格的text值
//       value String/NUmber 单元格的value值
//     如 [
//         [{text: '向xxx', value: 'name'}, {text: '123213'， value: 'phone'}],
//         [{text: '李xxx', value: 'name'}, {text: '123213'， value: 'phone'}]
//        ] 将生成 2 行 2 列 的表格
//   width String 表格的宽度 css width值 默认为 100%
//   cellHight String 单元格的初始化高度 css height值 默认 30px
//   cellWidth Array 单元格的固定宽度 值为数组 元素为 css长度值
//      建议写成百分比形式，默认值是每个单元格宽度一样
//      如： 表格有三列 可设值为 ['30%', '30%, '40%]
//   cellSelectedStyle String : 设置选中时，单元格的样式 css样式字符串
//     默认值为 outline: box-shadow: 0 0 3px rgb(15, 144, 255);
//   cellPastedStyle String: 设置粘贴赋值时，被赋值的单元格的样式 css样式字符串
//     默认值为 background-color: rgba(1, 1, 1, .8);
//   dblclick(e, postion) Function 表格单元格的双击事件
//     第一个参数事件对象 第二个参数单元格的位置对象
//   clcik(e, position) Function 表格单元格的单击事件
//   change(postion, text) Function 表格单元格的text改变事件 每个单元格都会注册此事件
//     position 位置信息 单元格的text
//   cellChangeOption [Object] [{ change， position }] 数组 给单个单元格注册事件
//     数组元素为对象 Oject
//       change 事件的回调函数 同 change参数样
//       position 位置信息，确定要注册事件的单元格位置
// 返回实列 Object
//   【】代表非必传参数
//   clear() Function 销毁实例
//   getAllTextAndValue() Function 获取单元格所有的value和text
//     结果为 一个二维数组 第一维为行的集合 第二维为行的列的集合
//       列的数组的元素为对象 Object { value: '', text: '', position: {}}
//       value 为单元格的value text 为单元格text position 为位置对象
//   getTextAndValueByRow(row) Function 获取表格一行的所有单元格的text和value
//      参数 row Number 表格的行数索引 从 0 开始
//   getTextAndValueByCol(col) Function 获取表格一列的所有单元格的text和value
//      参数 col Number 表格的列数索引 从 0 开始
//   getValue(postion) Funcion 获取单元格的 vaule值
//      postion Object {c: 0, r: 0} 单元的位置信息
//        c 单元格行索引 从 0 开始
//        r 单元格的列索引 从 0 开始
//  getText(postion) Function 获取单元的 text值 即显示值
//  setValue(positon, value) Function 设置单元格的value值
//  setText(postion, value) Function 设置单元格的text值
//  addRow(num, index, data) Function 添加行
//     【num】 Number 添加的行数 不带此参数默认添加一行
//     【index】 Number 添加的位置 从0开始 不带参数默认在末尾添加一行
//     【data】 [[Object]] 添加可选的数据 二维数组 和 tdData相同
//     不可只带index而不带number
//  removeRow(num, index) Function 删除行
//     【num】 Number 删除的行数 默认删除一行
//     【index】 Number 删除的位置 从0开始 不带参数默认在末尾删除一行
//     不可只带index而不带number
//  addCol(num, index, data) Function 添加列
//    【num】 Number 添加的列数 不带此参数默认添加一行
//    【index】 Number 添加的位置 从0开始 不带参数默认在末尾添加一列
//    【data】 Object 添加可选的数据
//       data.thOption Object 表头的设置数据
//         thOption.text [String] 数组 元素为表头的文字
//       data.tdOption [[Object]] 二维数组 第一维为对应的列
//         第二维为对应的每行的数据 {text: 单元格text值, value：单元格value值 }
//       data.cellWith [String] 数组 每个单元格的宽度
//         数组元素为每个单元格的宽度 不设置此值，则重置每个表格宽度相等，
//         数组的长度与表格列的长度不配也重置每个单元格宽度相等
//    不可只带index而不带number
//    例子: addCol(2,1, {thOption: {
//                              text: ['性别', '姓名],
//                              width: []
//                             }
//                      tdOption: [
//                        [{value: '1', text: '男'}, {value: '0', text: '女'}],
//                        [{value: 'xiang': text: '向xxxx'}, {vale: 'li', text: '李xxx'}]
//                        ]
//                      }) 在第二列新增2列
//  removeCol(num, index, data) Function 删除列
//    【num】 Number 删除的列数 默认删除一列
//    【index】 Number 删除的位置 从0开始 不带参数默认在末尾删除一列
//    【data】 Array 重置的单元的长度 数组元素为单元的长度，值为css的长度单位
//        数组元素为每个单元格的宽度 不设置此值，则重置每个表格宽度相等，
//        数组的长度与表格列的长度不配也重置每个单元格宽度相等
//     不可只带index而不带number
//  getRowCount() Function 获取表格的行数
//  getColCount() Function 获取表格的列数

function MxExcel(targertNode, option) {
  if (!$) {
    console.error('请先引入变量为$的jquery库存');
    return;
  }
  if (!targertNode) {
    console.error('请传人目标节点参数,是一个节点或者是节点的id名');
    return;
  }
  var $target;
  if (typeof targertNode === 'string') {
    $target = $('#' + targertNode);
    if (!$target[0]) {
      console.error('请传入正确的目标节点正确的id名，不存在此id名的节点');
      return;
    }
  } else {
    $target = $(targertNode);
    if (!$target[0]) {
      console.error('请传入正确的目标节点，不存在此节点');
      return;
    }
  }
  option = option || {};
  // 设值时的验证
  // setTextOption
  //   [{ verify: fn, noPass: fn, position: {c: 0, r: 0}, noPassStyle: {} }]
  var setTextOption = option.setTextOption || [];
  var setCellOption = option.setCellOption || [];
  var isSelectHandle = false; // 是否在进行连选
  var cacheCelArr = []; // 选择的单元格缓存
  // 行数
  var rowCount = option.row || 0;
  // 列数
  var colCount = option.col || 0;
  var isDataProduce = false;
  var tdData = option.tdData || [];
  var tdItem = tdData[0] || [];
  if (tdItem.length > 0) {
    isDataProduce = true;
    rowCount = rowCount > tdData.length ? rowCount : tdData.length;
    colCount = colCount > tdItem.length ? colCount : tdItem.length;
  }
  rowCount = rowCount || 5;
  colCount = colCount || 4;
  var thOption = option.thOption || {};
  // 判断是否需要引入popper 插件
  var popperHandle = option.popperHandle || [];
  var PopperJs = window.Popper;
  if (popperHandle.length > 0) {
    if (!PopperJs) {
      console.warn('请引入./popper.min.js文件');
      return
    }
  }
  function getSelection() {
    //IE 9 ，10，其他浏览器
    var selection = window.getSelection ?
      window.getSelection() :
      document.selection.createRange().text;
    return selection.toString();
  }
  // 初始化结构
  function _initHmlt() {
    var htmlStr = '';
    htmlStr = '<table class="e-table ' +  eTableClassName + '" >';
    var thText = thOption.thText || [];
    if (thText.length > 0) {
      htmlStr += '<tbody>';
      htmlStr += '<tr>';
      if (thText.length > colCount) colCount = thText.length;
      if (thText.length > 0) {
        htmlStr += '<th class="no">序号</th>'
      }
      for (var i = 0; i < thText.length; i++) {
        htmlStr += '<th class="e-th '
          + ('td-c' + i)
          + '">' + thText[i] + '</th>';
      }
      htmlStr += '</th></tbody>'
    }
    htmlStr += '<tbody class="data-tbody">'
    for (var ri = 0; ri < rowCount; ri++) {
      htmlStr += '<tr class="tr-' + ri + '" >';
      var itemTd = tdData[ri] || [];
      // var itemStr = '';
      htmlStr += '<td data-index="' + ri + '"'
        + ' class="no">'
        + '<span class="no-text">'
        + (ri+1)
        + '</span>'
        + '<span class="addbtn" title="添加一行">+</span>'
        + '<span class="delbtn" title="删除此行">-</span>'
        + '</td>';
      for (var ci = 0; ci < colCount; ci++) {
        var text = undefined;
        var value = undefined;
        if (isDataProduce) {
          text = (itemTd[ci] || {}).text || '';
          value = (itemTd[ci] || {}).value;
        }
        var itemStr = '<td class="e-td ' + ('td-c' + ci) + '" >';
        itemStr += '<div ' + 'data-row="' + ri + '" '
          + 'data-col="' + ci +  '" ';
        if (typeof value !== 'undefined') {
          itemStr += 'data-celValue="' + value + '" ';
        }
        itemStr += ' class="cel-item ' + ('row'+ ri + 'col' + ci)
          + '" >' + (text || '')
          + '</div>'
        itemStr += '</td>';
        htmlStr += itemStr;
      }
      htmlStr += '</tr>';
    }
    htmlStr += '</tbody></table>'
    return htmlStr;
  }
  // 动态生成样式
  function _addStyle(styleStr, styleNodeClassName) {
    var styleNode = document.createElement('style');
    styleNode.type = 'text/css';
    styleNode.rel = 'stylesheet';
    styleNode.className = styleNodeClassName || '';
    try {
      styleNode.appendChild(document.createTextNode(styleStr));
    } catch(ex) {
      styleNode.styleSheet.cssText = styleStr;
    }
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(styleNode);
  }
  // 表的类
  var eTableClassName = 'e-table-' + (+new Date());
  // 样式的类
  var eTableStyleClassName = 'e-style-' + (+new Date());
  // 初始化样式
  var width = option.width;
  var cellWidth = option.cellWidth || [];
  var cellHight = option.cellHight;
  var cellSelectedStyle = option.cellSelectedStyle;
  var cellPastedStyle = option.cellPastedStyle;
  function initStyle() {
    width = width || '100%';
    var styleStr = '.' + eTableClassName + '{ '
      + 'table-layout: fixed;height: 1%;border-spacing: 0;'
      +'word-wrap: break-word;word-break:break-all;'
      + 'width:' + width + ';'
      + ' } ';
    cellHight = cellHight || '34px';
    var thText = thOption.thText || [];
    styleStr += '.' + eTableClassName + ' .no { '
      + 'width:' + '40px' + ';'
      + 'text-align: center;'
      + 'color: #aaa;position: relative;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' td.no { '
      + 'text-align: center;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' tr:hover td.no { '
      + 'text-align: left;'
      + 'text-indent: 6px;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' .no .delbtn { '
      + 'display: none;'
      + 'width: 16px;height: 14px;'
      + 'text-align: center;'
      + 'position: absolute;cursor: pointer;'
      + 'right: 2px;'
      + 'bottom: 4px;'
      + 'color: #666;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' tr:hover .no .delbtn { '
      + 'display: block;'
      + '}';
    styleStr += '.' + eTableClassName + ' .no .addbtn { '
      + 'display: none;'
      + 'width: 16px;height: 14px;'
      + 'text-align: center;'
      + 'position: absolute;cursor: pointer;'
      + 'right: 2px;'
      + ' top: -2px;'
      + 'color: #666;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' tr:hover .no .addbtn { '
      + 'display: block;'
      + '}';
    // 设置表头样式
    if (thText.length > 0) {
      var thStyle = thOption.thStyle;
      styleStr += '.' + eTableClassName + ' th { '
        + 'height:' + cellHight + ';'
        + 'border: 1px solid #eee;text-align: center;'
        + 'border-bottom: none;border-left: none;'
        + '}';
      styleStr += '.' + eTableClassName + ' th:first-child { '
        + 'border-left: 1px solid #eee;'
        + '}';
      if (thStyle) {
        styleStr += '.' + eTableClassName + ' th {'
          + thStyle + ';'
          + '}';
      }
    }
    styleStr += '.' + eTableClassName + ' td { '
      + 'min-height:' + cellHight + ';'
      + 'border: 1px solid #eee;'
      +' border-left: none;border-top: none;height: 1%;padding: 0;'
      + 'width:' + (100 / colCount) + '%;'
      + ' } ';
    // 设置单元格宽度
    if (cellWidth.length > 0 && cellWidth.length === colCount) {
      for(var i = 0; i < cellWidth.length; i++) {
        styleStr += '.' + eTableClassName + ' .' + 'td-c' + i + '{ '
          + 'width:' + cellWidth[i] + ';'
          + ' } ';
      }
    } 
    styleStr += '.' + eTableClassName + ' tr:first-child td { '
      + 'border-top: 1px solid #eee;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' tr td:first-child { '
      + 'border-left: 1px solid #eee;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' .cel-item { '
      + 'width: 100%;text-align: center;'
      +'display: flex;padding-left: 2px;'
      + 'justify-content: space-around;flex-direction: column;'
      + 'min-height: ' + cellHight + ' ;'
      + 'height: 100%;box-sizing: border-box;transition: .8s background-color;'
      + ' } ';
    // 兼容ff  display: flex; 焦点 bug
    styleStr += '.' + eTableClassName + ' .cel-item:focus::after{ '
      + 'content: "";width: 100%;height: 3px;'
      + '}';
    // // 兼容ff  display: flex; 焦点 bug
    // styleStr += '.' + eTableClassName + ' .cel-item:focus::before{ '
    //   + 'content: "";width: 100%;height: 8px;'
    //   + '}';
    // 设置选中的单元格的样式
    cellSelectedStyle = cellSelectedStyle
      || 'box-shadow: 0 0 3px rgb(15, 144, 255);';
    styleStr += '.' + eTableClassName + ' .cel-item:focus { '
      // + 'text-align: left;'
      // + 'display:block;'
      + cellSelectedStyle
      +' } ';
    styleStr += '.' + eTableClassName + ' .cel-item:focus.no-tab { '
      + 'box-shadow: 0 0 0 #fff;'
      + 'outline: none;'
      +' } ';
    styleStr += '.' + eTableClassName + ' .cel-item:focus::selection.no-tab { '
      + 'background: #fff;'
      +' } ';
    styleStr += '.' + eTableClassName + ' .cel-item.focus { '
      + cellSelectedStyle
      // + 'display:block;'
      + ' } ';
    // 设置单元被粘贴的样式
    cellPastedStyle = cellPastedStyle
      || 'background:rgb(15, 144, 255);color: #fff;'
    styleStr += '.' + eTableClassName + ' .cel-item.copied { '
      +  'background-color: rgba(1, 1, 1, .8);'
      + ' } ';
    styleStr += '.' + eTableClassName + ' *::selection { '
      + 'background:transparent;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' *::-moz-selection { '
      + 'background:transparent;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' *.focus::selection '
      + ' { '
      + 'background:white;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' *.focus::-moz-selection '
      + ' { '
      + 'background:white;'
      + ' } ';
    styleStr += '.' + eTableClassName + ' *:focus::selection '
      + ' { '
      + cellPastedStyle
      + ' }';
    styleStr += '.' + eTableClassName + ' *:focus::-moz-selection '
      + ' { '
      + cellPastedStyle
      + ' }';
    // popper 样式
    styleStr += '.poper-xx-container {'
      + 'width: 260px;'
      + 'height: 325px;'
      + 'padding: 10px;'
      + 'background-color: #fff;'
      + 'box-shadow: 0px 0px 14px rgba(0, 0, 0, 0.7);'
      + 'border: 1px solid #ebeef5;'
      + 'border-radius: 4px;'
      + 'box-sizing: border-box;'
      + '}';
    styleStr += '.poper-xx-container .poper-content {'
      + 'height: 100%;'
      + 'width: 100%;'
      + '}';
    _addStyle(styleStr, eTableStyleClassName);
  }
  // 清除样式
  function clearStyle() {
    $('style[class^="e-style-"]').remove();
  }
  // 获取剪切板
  function _getClipboardData(e) {
    var clipboardData = window.clipboardData ||
      (e.originalEvent || e).clipboardData;
    return clipboardData;
  }
  // 获剪切板的字符
  function _getSelectedText(e) {
    var clipboardData = window.clipboardData ||
      (e.originalEvent || e).clipboardData;
    var text = clipboardData.getData('text/plain');
    return text;
  }
  // 手动触发单元格change事件
  function emitChange(targertNode, text, textold) {
    if (textold === text) return;
    var positon = getPosition(targertNode)
    var col = positon.c;
    col = Number(col);
    var row = positon.r;
    row = Number(row)
    var hasCellChange = false;
    if (cellChangeOption.length > 0) {
      var itemIndex = arrayFindIndex(cellChangeOption, function(item) {
        if (item.position.c == col && item.position.r == row) return true;
      });
      if (itemIndex > -1) {
        hasCellChange = true;
        var changeHandleItem = cellChangeOption[itemIndex].change;
        changeHandleItem({c: col, r: row}, text);
      }
    }
    if (changeHandle && !hasCellChange) {
      changeHandle({c: col, r: row}, text);
    }
  }
  // 复制一个单元格由由文字
  function copyCelByText(targetNode, text, isNoEmitChange, value, noNeedCheck) {
    var oldText = $(targertNode).text();
    $(targetNode).text(text);
    if (value) {
      $(targetNode).attr('data-celValue', value);
    }
    if (!isNoEmitChange) {
      // emitChange(targetNode, text, oldText);
    }
    $(targetNode).addClass('copied');
    setTimeout(function() {
      $(targetNode).removeClass('copied');
    }, 1000);
    if (!noNeedCheck) {
      setTextverifyIsPass(targertNode, text)
    }
  }
  // 单元格排序
  function cacheArrSort(cacheArr) {
    // 排序 先排行 再排列
    cacheArr.sort(function (item1, item2) {
      var row1 = $(item1).data('row');
      var row2 = $(item2).data('row');
      var col1 = $(item1).data('col');
      var col2 = $(item2).data('col');
      if (row1 > row2) {
        return 1;
      } else if (row1 == row2) {
        return col1 - col2;
      } else {
        return -1;
      }
    });
    return cacheArr;
  }
  // 粘贴事件回调
  function selectTextHandle(targetNode, selectMap) {
    var row = $(targetNode).data('row');
    var canUseRow = rowCount - row; // 可利用的行数
    var col = $(targetNode).data('col');
    var canUseCol = colCount - col; // 可利用的列数
    // var catchMapKeyArr = Object.keys(selectMap).sort();
    var catchMapKeyArr = Object.keys(selectMap);
    var originalRowCount = catchMapKeyArr.length;
    canUseRow = canUseRow < originalRowCount ? canUseRow : originalRowCount;
    for (var i = 0; i < canUseRow; i++) {
      var rowNum = row + i;
      var originalColCount = selectMap[catchMapKeyArr[i]].length;
      originalColCount = canUseCol < originalColCount ? canUseCol : originalColCount;
      for (var j = 0; j < originalColCount; j++) {
        var item = selectMap[catchMapKeyArr[i]][j];
        // 2019-7-25 pls 适配mxinfocore插件
        var colNum = col + item.col;
        var targetItem = $('.row'+ rowNum + 'col' + colNum)[0];
        var itemCellOption = getCellOption(targetItem);
        if (!itemCellOption.disabled && !itemCellOption.readOnly) {
          if (i === 0 && j === 0) {
            // 选择多个单元格复制 不需要设置焦点
            if (cacheCelArr.length > 1) {
              copyCelByText(targetItem, item.text);
            }  else {
              // 设置正确的焦点位置
              // 设置焦点位置时会触发原生的change事件所以不需要手动触发change事件
              copyCelByText(targetItem, '', true, null, true);
              setSelection(item.text);
              setTextverifyIsPass(targetItem, item.text);
            }
          } else {
            copyCelByText(targetItem, item.text);
          }
        }
      }
    }
  }
  // 初始化dom及相应事件
  // 2019-7-25 pls 适配mxinfocore插件
  var beforePasteHandle = option.beforePaste;
  var deleteAfter = option.deleteAfter;
  var dblclickHandle = option.dblclick;
  var clickHandle = option.click;
  var changeHandle = option.change;
  var blurHandle = option.blur;
  var cellChangeOption = option.cellChangeOption || [];
  // 将选中的单元格转为剪切板的文字
  function changeTextByCell(arr) {
    var map = {};
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var row = $(item).attr('data-row');
      var text = $(item).text();
      var dataItem = {
        row: row,
        text: text
      };
      (map['row' + row] || (map['row' + row] = [])).push(dataItem);
    }
    var rtext = '';
    Object.keys(map).forEach(function(rowi) {
      var row = map[rowi];
      for (var c = 0; c < row.length; c++) {
        var col = row[c];
        var text = col.text;
        rtext += text;
        if (c != row.length - 1) {
          rtext += '\t';
        }
      }
      rtext += '\r\n';
    });
    return rtext;
  }
  function initDom() {
    var html = _initHmlt();
    $($target).html(html);
    initDomEvent();
    // 复制逻辑
    $($target).find('.e-table').on('copy', function (e) {
      if (cacheCelArr.length >= 1) {
        var clipboardData = _getClipboardData(e);
        var orderArr = cacheArrSort(cacheCelArr);
        var text = changeTextByCell(orderArr);
        clipboardData.setData('text/plain', text);
        e.preventDefault();
      }
    });
  }
  // 设置正确焦点位置
  function setSelection(text) {
    var textRange;
    if (document.body.createTextRange) {
      if (document.selection) {
        textRange = document.selection.createRange();
      } else if (window.getSelection) {
        sel = window.getSelection();
        var range = sel.getRangeAt(0);
        // 创建临时元素，使得TextRange可以移动到正确的位置
        var tempEl = document.createElement("span");
        tempEl.innerHTML = "&#FEFF;";
        range.deleteContents();
        range.insertNode(tempEl);
        textRange = document.body.createTextRange();
        textRange.moveToElementText(tempEl);
        tempEl.parentNode.removeChild(tempEl);
      }
      textRange.text = text;
      textRange.collapse(false);
      textRange.select();
    } else {
      // Chrome之类浏览器
      document.execCommand("insertText", false, text);
    }
  }
  // 选择内容
  function selectText(node) {
    if (document.selection) {
      var range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
    } else if (window.getSelection) {
      var range = document.createRange();
      range.selectNodeContents(node);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    }
  }
  // 粘贴事件回调
  var paste = option.paste;
  var rowheadClick = option.rowheadClick;
  function initDomEvent() {
    // 删除一行
    $($target).find('.e-table .data-tbody .delbtn').each(function(index, item) {
      $(item).click(function() {
        if (!confirm("是否确定删除该行?")) {
          return;
        }
        hidePopper();
        var index = $(this).parent('.no').data('index');
        index = parseInt(index);
        removeRow(1, index);
      })
    });
    // 序号的点击事件
    // $($target).find('.e-table .data-tbody .no').each(function(index, item) {
    //   $(item).click(function(e) {
    //     var index = $(this).data('index');
    //     index = Number(index);
    //     if (rowheadClick) {
    //       rowheadClick(index);
    //     }
    //   });
    // });
    $($target).find('.e-table .data-tbody .no').click(function(e) {
      var index = $(this).attr('data-index');
      index = Number(index);
      hidePopper();
      if (rowheadClick && (this == e.target || $(e.target).hasClass('no-text'))) {
        rowheadClick(index);
      }
    });
    // 添加一行
    $($target).find('.e-table .data-tbody .addbtn').each(function(index, item) {
      $(item).click(function(e) {
        hidePopper();
        var index = $(this).parent('.no').data('index');
        index = parseInt(index);
        addRow(1, index + 1);
      });
    });
    $($target).find('.e-table td .cel-item').each(function(index, item) {
      // 设置tabindex 使tab键可以跳转
      $(item).attr('tabindex', 0);
      var col = $(item).data('col');
      var row = $(item).data('row');
      var itemCellOption = getCellOption(item);
      if (itemCellOption.disabled) {
        $(item).addClass('no-tab');
      } else {
        $(item).removeClass('no-tab');
      }
      $(item).focus(function(e) {
        // 自动选择文字
        var text = $(item).text()
        if (text) {
          selectText(item)
        }
      });
      $(item).on('dragstart', function(e) {
        return false
      });
      // 单元格鼠标点击事件
      $(item).mousedown(function(e) {
        var itemCellOption = getCellOption(item);
        if (!itemCellOption.readOnly && !itemCellOption.disabled) {
          ($target).find('.e-table td .cel-item')
            .removeClass('focus')
            .attr('mxNoBackSpace', '');
          if (!$(item).attr('contenteditable') != 'true') {
            $(item).attr('contenteditable', true);
          }
          // 框架里 禁用回退键 设置mxNoBackSpace 属性开启回退
          $(item).attr('mxNoBackSpace', 'cancel');
          cacheCelArr = [item];
          $(item).removeClass('no-tab');
          hidePopper();
          if (popperHandle.length > 0) {
            var popperHandleItem = arrayFind(popperHandle, function(ele) {
              return ele.col == col
            });
            if (popperHandleItem) {
              var handle = popperHandleItem.handle;
              if (handle) {
                initPopper(item);
                var popper = popperHandleItem.popper;
                var height = popper.height;
                if (height) {
                  $('.poper-xx-container').height(height);
                }
                var width = popper.width;
                if (width) {
                  $('.poper-xx-container').width(width);
                }
                handle(getPosition(item), $('.poper-xx-container')[0]);
              }
            }
          }
        } else if (itemCellOption.readOnly && !itemCellOption.disabled) {
          ($target).find('.e-table td .cel-item')
              .removeClass('focus')
              .attr('mxNoBackSpace', '');
            $(item).attr('mxNoBackSpace', 'cancel');
              cacheCelArr = [item];
            $(item).attr('contenteditable', false);
            $(item).removeClass('no-tab');
        } else {
          $(item).attr('contenteditable', false);
          $(item).addClass('no-tab');
        }
      });
      // 单元格鼠标移开逻辑
      $(item).mouseleave(function(e) {
        if (isSelectHandle) {
          $(item).attr('contenteditable', false);
          $(item).attr('mxNoBackSpace', '');
          // $(item).blur();
          hidePopper();
        }
      });
      $(item).on('input', function(e) {
        var text = $(item).text()
        setTextverifyIsPass(item, text);
      });
      // 单击回调
      if (clickHandle) {
        $(item).click(function (e) {
          clickHandle(e, {c: col, r: row});
        });
      }
      // 双击回调
      if (dblclickHandle) {
        $(item).dblclick(function(e) {
          dblclickHandle(e, {c: col, r: row});
        });
      }
      // blur
      if (blurHandle) {
        $(item).on('blur', function(e) {
          var itemCellOption = getCellOption(item);
          if (!itemCellOption.disabled) {
            blurHandle({c: col, r: row}, $(this).text());
          }
        });
      }
      // text改变回调
      var hasCellChange = false;
      // if (cellChangeOption.length > 0) {
      //   var itemIndex = arrayFindIndex(cellChangeOption, function(item) {
      //     if (item.position.c == col && item.position.r == row) return true;
      //   });
      //   if (itemIndex > -1) {
      //     hasCellChange = true;
      //     var changeHandleItem = cellChangeOption[itemIndex].change;
      //     $(item).on('input', function(e) {
      //       var position = getPosition(this);
      //       changeHandleItem({c: position.c, r: position.r}, $(this).text());
      //     })
      //   }
      // }
      // if (changeHandle && !hasCellChange) {
      //   $(item).on('input', function(e) {
      //     var position = getPosition(this);
      //     changeHandle({c: position.c, r: position.r}, $(this).text());
      //   })
      // }
      var aTimer = null;
      // 模拟change
      $(item).on('input', function(e) {
        clearTimeout(aTimer);
        aTimer = setTimeout(function(e) {
          cellChangeExeCuteHandle(e, item)
        }, 20);
      });
      var cellChangeExeCuteHandle = function (e, item) {
        if (cellChangeOption.length > 0) {
          var itemIndex = arrayFindIndex(cellChangeOption, function(item) {
            if (item.position.c == col && item.position.r == row) return true;
          });
          if (itemIndex > -1) {
            hasCellChange = true;
            var changeHandleItem = cellChangeOption[itemIndex].change;
            var position = getPosition(item);
            changeHandleItem({c: position.c, r: position.r}, $(item).text());
          }
        }
        if (changeHandle && !hasCellChange) {
          var position = getPosition(item);
          changeHandle({c: position.c, r: position.r}, $(item).text());
        }
      }
      // 单元格粘贴逻辑
      $(item).on('paste', function(e) {
        var selectText = _getSelectedText(e) || '';
        if (selectText) {
          e.preventDefault();
          var selectMap = changeMapByTxet(selectText,item);
          selectTextHandle(item, selectMap);
        }
        if (paste) paste();
      });
    });
  }
  // 是否打开popper
  var isInnerPopper = false;
  // 创建popperContainer
  function initPopperNode() {
    var node = document.querySelector('.poper-xx-container');
    if (!node) {
      node = document.createElement('div');
      node.className = 'poper-xx-container';
      // var innerHtml = '';
      // innerHtml += '<div class="poper-content">';
      // innerHtml += '</div>';
      // node.innerHTML = innerHtml;
      document.body.appendChild(node);
    }
    $(node).mouseenter(function handle(e) {
      isInnerPopper = true;
      console.log('in')
    })
    $(node).mouseout(function handle(params) {
      isInnerPopper = false;
      console.log('outer')
    })
  }
  // 创建Popper
  function initPopper(referenceEl) {
    var popperNode = document.querySelector('.poper-xx-container');
    if (!popperNode) {
      initPopperNode();
      popperNode = document.querySelector('.poper-xx-container');
    }
    showPopper();
    var aPopper = new PopperJs(referenceEl, popperNode, {
      onCreate: function(data) {
        var instance = data.instance;
        var popper = instance.popper;
        var reference = data.offsets.reference;
        var popperOffsets = data.offsets.popper;
        var popperHieght = popperOffsets.height;
        var height = reference.height || 0;
        var top = reference.top || 0;
        if (top > popperHieght + 20) {
          top -= (popperHieght + 4);
        } else {
          top += height + 4;
        }
        var left = reference.left || 0;
        popper.style.transform = 'translate3d('+(left + 'px')+ ','+(top + 'px')+', 0)';
        popper.style.zIndex = '10000';
      },
      positionFixed: true,
      placement: 'bottom-start'
    });
  }
  // 隐藏popper
  function hidePopper() {
    $('.poper-xx-container').hide();
  }
  // 显示popper
  function showPopper() {
    $('.poper-xx-container').show();
  }

  // 将剪切板的文字转为粘贴需要的文字
  function changeMapByTxet(text,item) {
    if (!text) return null
    var map = {};
    text = String(text);
    // 去掉最后一个\r\n
    // 判断是否应该用 '\r\n'分割还是 '\n'分割 （浏览器兼容性）
    var splitText = '\n';
    if (text.length > 0) {
      var isRN = text.indexOf('\r\n') > -1;
      if (isRN) {
        splitText = '\r\n';
      }
    }
    var index = text.lastIndexOf(splitText);
    if (index > -1) {
      text = text.slice(0, index);
    }
    var rowList = text.split(splitText);
    // rowList = rowList
    for (var i = 0; i < rowList.length; i++) {
      var row = rowList[i];
      var colList = row.split('\t');
      map['row' + i] = map['row' + i] || [];
      for (var c = 0; c < colList.length; c ++) {
        var col = colList[c];
        var data = {
          col: c,
          row: i,
          text: col
        };
        ((map['row' + i])).push(data);
      }
    }
    // 2019-7-25 pls 适配mxinfocore插件
    if (beforePasteHandle) {
      map = beforePasteHandle(map,item)
    }
    return map
  }
  // 清除dom相关事件
  function clearDomEvent() {
    $($target).find('.e-table .data-tbody .delbtn').each(function(index, item) {
      $(item).off('click');
    });
    $($target).find('.e-table .data-tbody .addbtn').each(function(index, item) {
      $(item).off('click');
    });
    $($target).find('.e-table .data-tbody .no').off('click');
    $($target).find('.e-table td .cel-item').each(function(index, item) {
      $(item).off('mousedown');
      if (clickHandle) {
        $(item).off('click');
      }
      if (dblclickHandle) {
        $(item).off('dblclick');
      }
      $(item).off('mouseleave');
      $(item).off('paste');
      // 清除change
      var hasCellChange = false;
      if (cellChangeOption.length > 0) {
        var itemIndex = arrayFindIndex(cellChangeOption, function(item) {
          if (item.position.c == col && item.position.r == row) return true;
        });

        if (itemIndex > -1) {
          hasCellChange = true;
          var changeHandleItem = cellChangeOption[itemIndex].change;
          $(item).off('input');
        }
      }
      if (changeHandle && !hasCellChange) {
        $(item).off('input');
      }
    });
  }
  function arrayFind(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
      if (callback(arr[i])) {
        return arr[i]
      }
    }
    return null
  }
  // 判断数组是否包含一个元素
  function arrayIncludes(arr, item) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) return true;
    }
    return false;
  }
  // 查找一个数组元素的索引
  function arrayFindIndex(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
      if (callback(arr[i])) {
        return i;
      }
    }
    return -1;
  }
  // 选中操作
  function selectedHandle(item, isIn) {
    var itemCellOption = getCellOption(item);
    var canOp = !itemCellOption.disabled
    if (isIn && canOp) {
      !$(item).hasClass('focus') && $(item).addClass('focus');
      if (!arrayIncludes(cacheCelArr, item)) {
        cacheCelArr.push(item);
      }
    } else {
      var index = arrayFindIndex(cacheCelArr, function (ele) {
        return ele == item;
      });
      if (index > -1) {
        cacheCelArr.splice(index, 1);
      }
      $(item).hasClass('focus') && $(item).removeClass('focus');
    }
  }
  // 删除事件回调
  function deleteTextHandle(e) {
    for (var i = 0; i < cacheCelArr.length; i++) {
      var item = cacheCelArr[i];
      var textOld = $(item).text();
      $(item).text('');
      var positon = getPosition(item)
      deleteAfter && deleteAfter(positon,'')
      // emitChange(item, '', textOld);
      $(item).removeClass('focus');
      $(item).attr('mxNoBackSpace', '');
    }
    cacheCelArr[0] && $(cacheCelArr[0]).blur();
    cacheCelArr = [];
  }
  // 函数节流emitChange
  function _throttle(delay, noTailing, func, debounceMode) {
    var timeOutID;
    var lastExce = 0;
    if (typeof noTailing !== 'boolean') {
      debounceMode = func;
      func = noTailing;
      noTailing = undefined;
    }
    function wrapper() {
      var that = this;
      var elapsed = +new Date() - lastExce;
      var args = arguments;
      function exec() {
        lastExce = +new Date();
        func.apply(that, args);
      }
      function clear() {
        timeOutID = undefined;
      }
      if (debounceMode && !timeOutID) {
        exec();
      }
      if (timeOutID) {
        clearTimeout(timeOutID);
      }
      if (debounceMode === undefined && elapsed > delay) {
        exec();
      } else if (noTailing !== true) {
        timeOutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ?
          delay - elapsed : delay);
      }
    }
    wrapper.cancel = function() {
      clearTimeout(timeOutID);
    };
    return wrapper;
  }
  // 设置被移动到的样式
  function setMovedCell(cell) {
    ($target).find('.e-table td .cel-item')
        .removeClass('focus')
        .attr('mxNoBackSpace', '');
    $(cell).attr('contenteditable', true);
    // 框架里 禁用回退键 设置mxNoBackSpace 属性开启回退
    $(cell).attr('mxNoBackSpace', 'cancel');
    $(cell).attr('tabindex', 1);
    // $(currentCell).blur();
    $(cell).focus();
    var text = $(cell).text();
    $(cell).text('')
    setSelection(text);
    cacheCelArr = [cell];
  }
  // 跳到第一个单元格
  function goFirstCell() {
    var queryStr = '.e-table .cel-item' + ('.row' + 0)
      + ('col' + 0);
    var currentCell = $($target).find(queryStr);
    var isCanUse = false
    if (currentCell) {
      var itemCellOption = getCellOption(currentCell);
      if (!(itemCellOption.readOnly || itemCellOption.disabled || itemCellOption.skipMoveCell)) {
        isCanUse = true
      }
    }
    if (isCanUse) {
      setMovedCell(currentCell)
    } else {
      var position = {
        r: 0, c: 0
      };
      var nextCell = nextCanMoveCell(position);
      if (nextCell) {
        setMovedCell(nextCell)
      }
    }
  }
  // 找到下个可以移动的单元格
  function nextCanMoveCell(position) {
    var dataRow = position.r;
    var dataCol = position.c;
    dataRow = Number(dataRow);
    dataCol = Number(dataCol);
    var nextCell;
    while(true) {
      if (dataCol >= colCount - 1) {
        dataCol = 0;
        dataRow += 1;
      } else {
        dataCol += 1;
      }
      if (dataRow > rowCount - 1) {
        dataRow = 0;
      }
      var queryStr = '.e-table .cel-item' + ('.row' + dataRow)
        + ('col' + dataCol);
      nextCell = $($target).find(queryStr);
      if (nextCell) {
        var itemCellOption = getCellOption(nextCell);
        if (!(itemCellOption.readOnly || itemCellOption.disabled || itemCellOption.skipMoveCell)) {
          break
        }
      } else {
        console.log(queryStr + '单元格未找到')
        break
      }
    }
    return nextCell
  }
  // 跳到下一个单元格
  function goNextCell() {
    var currentCell = cacheCelArr[0];
    if (currentCell) {
      var currentCell = cacheCelArr[0];
      if (currentCell) {
        var positon = getPosition(currentCell);
        var nextCell = nextCanMoveCell(positon);
        if (nextCell) {
          // $(currentCell).blur();
          // // 需要判断是否有blur事件
          // if (blurHandle) {
          //   blurHandle({r: Number($(currentCell).attr('data-row')), c: Number($(currentCell).attr('data-col'))}, $(currentCell).text());
          // }
          setMovedCell(nextCell)
        }
      }
    }
  }
  // 找到可以动的上一个单元格
    function preCanMoveCell(position) {
      var dataRow = position.r;
      var dataCol = position.c;
      dataRow = Number(dataRow);
      dataCol = Number(dataCol);
      var nextCell;
      while(true) {
        if (dataCol <= 0) {
          dataCol = colCount - 1;
          dataRow -= 1;
        } else {
          dataCol -= 1;
        }
        if (dataRow < 0) {
          dataRow = rowCount - 1;
        }
        var queryStr = '.e-table .cel-item' + ('.row' + dataRow)
          + ('col' + dataCol);
        nextCell = $($target).find(queryStr);
        if (nextCell) {
          var itemCellOption = getCellOption(nextCell);
          if (!(itemCellOption.readOnly || itemCellOption.disabled || itemCellOption.skipMoveCell)) {
            break
          }
        } else {
          console.log(queryStr + '单元格未找到')
          break
        }
      }
      return nextCell
    }
  // 跳到上一个单元格
  function goPrevCell() {
    var currentCell = cacheCelArr[0];
    if (currentCell) {
      var positon = getPosition(currentCell);
      var nextCell = preCanMoveCell(positon);
      if (nextCell) {
        // $(currentCell).blur();
        // // 需要判断是否有blur事件
        // if (blurHandle) {
        //   blurHandle({r: Number($(currentCell).attr('data-row')), c: Number($(currentCell).attr('data-col'))}, $(currentCell).text());
        // }
        setMovedCell(nextCell)
      }
    }
  }
  // 找个可以动的下一行单元格
  function nextRowCanMoveCell(position) {
    var dataRow = position.r;
    var dataCol = position.c;
    dataRow = Number(dataRow);
    dataCol = Number(dataCol);
    var nextCell;
    while(true) {
      if (dataRow >= rowCount - 1) {
        dataRow = 0;
      } else {
        dataRow += 1;
      }
      var queryStr = '.e-table .cel-item' + ('.row' + dataRow)
        + ('col' + dataCol);
      nextCell = $($target).find(queryStr);
      if (nextCell) {
        var itemCellOption = getCellOption(nextCell);
        if (!(itemCellOption.readOnly || itemCellOption.disabled || itemCellOption.skipMoveCell)) {
          break
        }
      } else {
        console.log(queryStr + '单元格未找到')
        break
      }
    }
    return nextCell
  }
  // 跳到下一行的单元格
  function goNextRowCell() {
    var currentCell = cacheCelArr[0];
    if (currentCell) {
      var positon = getPosition(currentCell);
      var nextCell = nextRowCanMoveCell(positon);
      if (nextCell) {
        // $(currentCell).blur();
        // // 需要判断是否有blur事件
        // if (blurHandle) {
        //   blurHandle({r: Number($(currentCell).attr('data-row')), c: Number($(currentCell).attr('data-col'))}, $(currentCell).text());
        // }
        setMovedCell(nextCell)
      }
      // var dataRow = $(currentCell).attr('data-row');
      // var dataCol = $(currentCell).attr('data-col');
      // dataRow = Number(dataRow);
      // dataCol = Number(dataCol);
      // if (dataRow >= rowCount - 1) {
      //   dataRow = 0;
      // } else {
      //   dataRow += 1;
      // }
      // var queryStr = '.e-table .cel-item' + ('.row' + dataRow)
      //   + ('col' + dataCol);
      // var nextCell = $($target).find(queryStr);
      // if (nextCell) {
      //   $(currentCell).blur();
      //   // 需要判断是否有blur事件
      //   if (blurHandle) {
      //     blurHandle({r: Number($(currentCell).attr('data-row')), c: Number($(currentCell).attr('data-col'))}, $(currentCell).text());
      //   }
      //   ($target).find('.e-table td .cel-item')
      //     .removeClass('focus')
      //     .attr('mxNoBackSpace', '');
      //   $(nextCell).attr('contenteditable', true);
      //   // 框架里 禁用回退键 设置mxNoBackSpace 属性开启回退
      //   $(nextCell).attr('mxNoBackSpace', 'cancel');
      //   $(nextCell).focus();
      //   var text = $(nextCell).text();
      //   $(nextCell).text('')
      //   setSelection(text);
      //   cacheCelArr = [nextCell];
      // }
    }
  }
  function preRowCanMoveCell(position) {
    var dataRow = position.r;
    var dataCol = position.c;
    dataRow = Number(dataRow);
    dataCol = Number(dataCol);
    var nextCell;
    while(true) {
      if (dataRow <= 0) {
        dataRow = rowCount - 1;
      } else {
        dataRow -= 1;
      }
      var queryStr = '.e-table .cel-item' + ('.row' + dataRow)
        + ('col' + dataCol);
      nextCell = $($target).find(queryStr);
      if (nextCell) {
        var itemCellOption = getCellOption(nextCell);
        if (!(itemCellOption.readOnly || itemCellOption.disabled || itemCellOption.skipMoveCell)) {
          break
        }
      } else {
        console.log(queryStr + '单元格未找到')
        break
      }
    }
    return nextCell
  }
  // 跳到上一行
  function goPrevRowCell() {
    var currentCell = cacheCelArr[0];
    if (currentCell) {
      var positon = getPosition(currentCell);
      var nextCell = preRowCanMoveCell(positon);
      if (nextCell) {
        // $(currentCell).blur();
        // // 需要判断是否有blur事件
        // if (blurHandle) {
        //   blurHandle({r: Number($(currentCell).attr('data-row')), c: Number($(currentCell).attr('data-col'))}, $(currentCell).text());
        // }
        setMovedCell(nextCell)
      }
    }
  }
  // body相关事件初始化
  function initBodyHandle() {
    var oldx1 = -1;
    var oldy1 = -1;
    // 判断是否在范围内
    function isSelected(item, x1, y1, x2, y2) {
      var domRect = item.getBoundingClientRect();
      var logicx = false;
      var logicy = false;
      var itemx1 = (domRect.x || domRect.left);
      var itemy1 = (domRect.y || domRect.top);
      var itemx2 = itemx1 + domRect.width;
      var itemy2 = itemy1 + domRect.height;
      if (x1 > itemx2 || x2 < itemx1) {
        logicx = false;
      } else {
        logicx = true;
      }
      if (y1 > itemy2 || y2 < itemy1) {
        logicy = false;
      } else {
        logicy = true;
      }
      var isIn = logicx && logicy;
      return isIn;
    }
    // 选择项 选择逻辑
    function mousemoveHandle(e) {
      if (isSelectHandle && !isInnerPopper) {
        var x = e.clientX;
        var y = e.clientY;
        var x1 = x < oldx1 ? x : oldx1;
        var x2 = x > oldx1 ? x : oldx1;
        var y1 = y < oldy1 ? y : oldy1;
        var y2 = y > oldy1 ? y : oldy1;
        $($target).find('.e-table td .cel-item').each(function (index, item){
          var isIn = isSelected(item, x1, y1, x2, y2);
          selectedHandle(item, isIn);
        });
      }
    }
    var throttleMousemoveHandle = mousemoveHandle;
    // var throttleMousemoveHandle = _throttle(14, mousemoveHandle);
    // $('body').mousemove(throttleMousemoveHandle);
    $target.mousemove(throttleMousemoveHandle);
    // 连选控制
    function mouseupHandle(e) {
      isSelectHandle = false;
    }
    // $('body').mouseup(mouseupHandle);
    $target.mouseup(mouseupHandle);
    function mousedownHandle(e) {
      isSelectHandle = true;
      oldx1 = e.clientX;
      oldy1 = e.clientY;
    }
    // 判断一个节点是否在表格内
    // $('body').mousedown(mousedownHandle);
    $target.mousedown(mousedownHandle);
    // 按键监听逻辑
    function keydownHandle(e) {
      // keyup
      var isDeleteKeyCode = e.keyCode == 8 || e.keyCode == 46;
      var isShiftKey = e.shiftKey === true
      // 删除键
      if (isDeleteKeyCode && cacheCelArr.length > 1) {
        deleteTextHandle(e);
        console.log('delete')
        e.preventDefault();
      }
      // tab键
      var isTabKeyCode = e.keyCode == 9;
      if (isTabKeyCode  && cacheCelArr.length > 0) {
        goNextCell();
        e.preventDefault();
      }
      // 回车键
      var isEnterKeyCode = e.keyCode == 13;
      if (isEnterKeyCode  && cacheCelArr.length > 0) {
        goNextRowCell();
        e.preventDefault();
      }
      // 方向键
      // 向左
      if (e.keyCode == 37 && isShiftKey && cacheCelArr.length > 0) {
        goPrevCell();
        e.preventDefault();
      } else if (e.keyCode == 37 && isShiftKey && cacheCelArr.length == 0) {
        goFirstCell();
        e.preventDefault();
      }
      // 向右
      if (e.keyCode == 39 && isShiftKey && cacheCelArr.length > 0) {
        goNextCell();
        e.preventDefault();
      } else if (e.keyCode == 39 && isShiftKey && cacheCelArr.length == 0) {
        goFirstCell();
        e.preventDefault();
      }
      // 向下
      if (e.keyCode == 40 && isShiftKey && cacheCelArr.length > 0) {
        goNextRowCell();
        e.preventDefault();
      } else if (e.keyCode == 40 && isShiftKey && cacheCelArr.length == 0) {
        goFirstCell();
        e.preventDefault();
      }
      // 向上
      if (e.keyCode == 38 && isShiftKey && cacheCelArr.length > 0) {
        goPrevRowCell();
        e.preventDefault();
      } else if (e.keyCode == 38 && isShiftKey && cacheCelArr.length == 0) {
        goFirstCell();
        e.preventDefault();
      }
    }
    // $('body').on('keydown', keydownHandle);
    $target.on('keydown', keydownHandle);
    // 双击表格外的区域取消已选择的数据
    function clickHandle(e) {
      var target = e.target;
      var hasEtable = $(target).parents('.e-table').length > 0;
      if (!hasEtable && !isInnerPopper) {
        ($target).find('.e-table td .cel-item')
          .removeClass('focus')
          .attr('mxNoBackSpace', '');
        cacheCelArr = [];
        hidePopper();
      }
    }
    // $('html').on('dblclick', dbclickHandle);
    // $('html').on('click', clickHandle);
    $target.on('click', clickHandle);
    // 返回清理事件函数
    return function clear() {
      // $('body').off('mousemove', throttleMousemoveHandle);
      $target.off('mousemove', throttleMousemoveHandle);
      // $('body').off('mouseup', mouseupHandle);
      $target.off('mouseup', mouseupHandle);
      // $('dody').off('mousedown', mousedownHandle);
      $target.off('mousedown', mousedownHandle);
      // $('body').off('keydown', keydownHandle);
      $target.off('keydown', keydownHandle);
      // $('html').off('click', dbclickHandle);
      $target.off('click', clickHandle);
    };
  }
  var clearBodyHandle;
  // 初始化
  function init() {
    // 初始化dom及相关事件
    initDom();
    // 初始化样式
    initStyle();
    // 初始化body的相关事件
    clearBodyHandle = initBodyHandle();
  }
  // 清理dom及事件
  function clear() {
    // 清理body相关事件
    clearBodyHandle();
    // 清除样式表
    clearStyle();
    // 清理生成的表格及相关事件
    $($target).find('.e-table').remove();
    // 回收各个变量
    isSelectHandle = null;
    cacheCelArr = null;
    rowCount = null;
    colCount = null;
    eTableClassName = null;
    eTableStyleClassName = null;
    clearBodyHandle = null;
    dblclickHandle = null;
    clickHandle = null;
    width = null;
  }
  // 获取单元格
  function getCel(position) {
    var row = position.r;
    var col = position.c;
    var $item = $($target).find('.row' + row + 'col' + col);
    return $item;
  }

  // 获取一个单元格的位置
  function getPosition(cell) {
    var row = $(cell).attr('data-row');
    row = Number(row);
    var col = $(cell).attr('data-col');
    col = Number(col)
    return { r: row, c: col }
  }

  // 收集验证通过的样式
  var passStyleMap = {}

  // 验证是否通过
  function setTextverifyIsPass(item, text) {
    var position = getPosition(item);
    var c = position.c;
    var r = position.r;
    var needCheck = false;
    var checkItem;
    var selectStr = '';
    if (setTextOption.length > 0) {
      var index = arrayFindIndex(setTextOption, function(ele) {
        ele = ele.position || {};
        if ('c' in ele && 'r' in ele) {
          selectStr = 'r' + r + 'c' + c;
          return c == ele.c && r == ele.r
        } else if ('c' in ele) {
          selectStr = 'c' + c;
          return c == ele.c
        } else if ('r' in ele) {
          selectStr = 'r' + r;
          return r == ele.r
        } else {
          return false
        }
      });
      if (index > -1) {
        checkItem = setTextOption[index];
        needCheck = true;
      }
    }
    if (!needCheck) {
      return true
    } else {
      var verify = checkItem.verify;
      var noPass = checkItem.noPass;
      var noPassStyle = checkItem.noPassStyle;
      if (verify) {
        if (verify(text)) {
          var cssMap = passStyleMap[selectStr];
          if (cssMap) {
            var cssKyes = Object.keys(cssMap);
            cssKyes.forEach(function(css) {
              $(item).css(css, cssMap[css]);
            });
          }
          return true
        } else {
          if (noPass) {
            noPass(text, position);
          }
          if (noPassStyle) {
            if (!passStyleMap[selectStr]) {
              var cssMap = passStyleMap[selectStr] = {};
              var cssKyes = Object.keys(noPassStyle);
              cssKyes.forEach(function(css) {
                var cssValue = $(item).css(css);
                cssMap[css] = cssValue;
              });
            }
            $(item).css(noPassStyle)
          }
          return false
        }
      } else {
        var cssMap = passStyleMap[selectStr];
        if (cssMap) {
          var cssKyes = Object.keys(cssMap);
          cssKyes.forEach(function(css) {
            $(item).css(css, cssMap[css]);
          });
        }
        return true
      }
    }
  }

  // 获取单元格的值
  function getValue(position) {
    var $item = getCel(position);
    return $item.attr('data-celValue');
  }

  // 获取单元格的text
  function getText(position) {
    var $item = getCel(position);
    if ($item.attr('data-MultiLine') == '1') {
      return $item.attr('data-text')
    } else {
      return $item.text()
    }
  }

  // 设置单元格的值
  function setValue(position, val) {
    var $item = getCel(position);
    return $item.attr('data-celValue', val);
  }

  // 设置单元格的text
  function setText(position, text, isMultiLine) {
    var $item = getCel(position);
    var oldText = $($item).text();
    if (isMultiLine) {
      text = text || ''
      var newText = text.replace(/\n/g, '<br>')
      $item.html(newText)
      $item.attr('data-MultiLine', '1')
      $item.attr('data-text', text)
    } else {
      $item.attr('data-MultiLine', '')
      $item.text(text);
    }
    // settext要求不获取焦点
    // var range = window.getSelection(); //创建range
    // range.selectAllChildren($item[0])
    // range.collapseToEnd();
    //emitChange($item, text, oldText);
    return text
  }

  // 添加行数
  function addRow(num, index, data) {
    var agrlen = arguments.length;
    if (agrlen === 0) {
      num = 1;
      index = rowCount;
      data = [[{}]];
    } else if (agrlen === 1) {
      if (typeof num === 'number') {
        index = rowCount;
        data = [[{}]];
      } else {
        data = Array.isArray(num) ? num : [[{}]];
        num = 1;
        index = rowCount;
      }
    } else if (agrlen === 2) {
      if (typeof index === 'number') {
        data = [[{}]];
      } else {
        data = index;
        index = rowCount;
      }
    }
    num = num || 1;
    if (index < 0 && index > rowCount) {
      console.error('请传入正确的位置参数(0~表格行的长度)');
      return false;
    }
    var htmlStr = '';
    for (var i = 0, ri = index; i < num; i++, ri++) {
      htmlStr += '<tr class="tr-' + ri + '" >';
      var itemTd = data[i] || [];
      htmlStr += '<td data-index="' + ri + '"'
        + ' class="no">'
        + '<span class="no-text">'
        + (ri+1)
        + '</span>'
        + '<span class="addbtn" title="添加一行">+</span>'
        + '<span class="delbtn" title="删除此行">-</span>'
        + '</td>';
      for (var ci = 0; ci < colCount; ci++) {
        var text = undefined;
        var value = undefined;
        text = (itemTd[ci] || {}).text || '';
        value = (itemTd[ci] || {}).value;
        var itemStr = '<td class="' + ('td-c' + ci) + '" >';
        itemStr += '<div ' + 'data-row="' + ri + '" '
          + 'data-col="' + ci +  '" ';
        if (typeof value !== 'undefined') {
          itemStr += 'data-celValue="' + value + '" ';
        }
        itemStr += ' class="cel-item ' + ('row'+ ri + 'col' + ci)
          + '" >' + (text || '')
          + '</div></td>';
        htmlStr += itemStr;
      }
      htmlStr += '</tr>';
    }
    // 插入
    var html = $(htmlStr);
    // 判断是否有数据
    if (rowCount > 0) {
      // 在现有数据位置添加
      if (index <= rowCount - 1) {
        $(html).insertBefore($($target).find('.e-table .data-tbody .tr-' + index));
        // 重置 要更改的数据
        if (index < rowCount) {
          $($target).find('.e-table .data-tbody tr').each(function (ri, item) {
            if (ri >= index + num) {
              var currentRi = ri;
              $(item).find('.no-text').text(currentRi + 1);
              $(item).find('.no').attr('data-index', currentRi);
              $(item).removeClass().addClass('tr-' + currentRi);
              $(item).find('.cel-item').each(function(ci, cellItem) {
                $(cellItem).attr('data-row', currentRi);
                var classNameItem = $(cellItem).attr('class').replace(/row\d+col\d+/, 'row'+currentRi+'col'+ci);
                $(cellItem).attr('class', classNameItem);
              });
            }
          });
        }
      } else { // 末尾添加
        $(html).insertAfter($($target).find('.e-table .data-tbody .tr-' + (rowCount-1)));
      }
    } else {
      $($target).find('.data-tbody').append(html);
    }
    rowCount += num;
    // 事件重置
    clearDomEvent();
    initDomEvent();
    return true;
  }

  // 获取单元格
  function getCels(position) {
    if ('r' in position && 'c' in position) {
      var row = position.r;
      var col = position.c;
      var $item = $($target).find('.row' + row + 'col' + col);
      return $item;
    } else if ('c' in position) {
      var col = position.c;
      var str = '[data-col=' + col + ']'
      var $item = $item = $($target).find(str)
      return $item
    } else if ('r' in position) {
      var row = position.r;
      var str = '[data-row=' + row + ']'
      var $item = $item = $($target).find(str)
      return $item
    } else {
      return null
    }
  }

  // 获取单元格的配置
  function getCellOption(item) {
    var position = getPosition(item);
    var c = position.c;
    var r = position.r;
    var checkItem;
    var opionItem = {
      readOnly: false,
      disabled: false,
      skipMoveCell: false
    };
    if (setCellOption.length > 0) {
      var index = arrayFindIndex(setCellOption, function(ele) {
        ele = ele.position || {};
        if ('c' in ele && 'r' in ele) {
          // selectStr = 'r' + r + 'c' + c;
          return c == ele.c && r == ele.r
        } else if ('c' in ele) {
          // selectStr = 'c' + c;
          return c == ele.c
        } else if ('r' in ele) {
          // selectStr = 'r' + r;
          return r == ele.r
        } else {
          return false
        }
      });
      if (index > -1) {
        checkItem = setCellOption[index];
        if (checkItem) checkItem = checkItem.cellOption || {};
        opionItem.readOnly = checkItem.readOnly || false;
        opionItem.disabled = checkItem.disabled || false;
        opionItem.skipMoveCell = checkItem.skipMoveCell || false;
      }
    }
    return opionItem
  }

  // 删除行数
  function removeRow(num, index) {
    num = num || 1;
    if (num > rowCount) num = rowCount - 1;
    if (rowCount < 1) return false;
    if (typeof index === 'number') {
      if (index < 0 || index > rowCount -1) {
        console.error('请传入正确的位置参数(表格的行索引)');
        return false;
      }
    } else {
      index = rowCount - 1;
    }
    var i = 0;
    $($target).find('.e-table .data-tbody tr')
      .each(function(ri, item) {
        if (ri >= index && ri < index + num) {
          $(item).remove();
        } else if (ri >= index + num) {
          $(item).attr('row', i + index);
          var ri = i + index;
          $(item).attr('class', 'tr-' + ri);
          $(item).find('.no-text').text(ri+1);
          $(item).find('.no').attr('data-index', ri);
          $(item).find('.cel-item').each(function(ci, cellItem) {
            $(cellItem).attr('data-row', ri);
            var classNameItem = $(cellItem).attr('class').replace(/row\d+col\d$/, 'row'+ri+'col'+ci);
            $(cellItem).attr('class', classNameItem);
          });
          i++;
        }
      });
    rowCount -= num;
    return true;
  }

  // 获取单元的vuale和text
  function getAllTextAndValue() {
    var result = [];
    $($target).find('.e-table .data-tbody tr').each(function(ri, trItem) {
      var trItemData = [];
      $(trItem).find('.cel-item').each(function (ci, tdItem) {
        // var text = $(tdItem).text();
        var $item = $(tdItem)
        var text;
        if ($item.attr('data-MultiLine') == '1') {
          text = $item.attr('data-text')
        } else {
          text = $item.text()
        }
        var value = $(tdItem).attr('data-celValue');
        var position = {
          c: ci,
          r: ri
        };
        var data = {
          text: text,
          value: value,
          position: position
        }
        trItemData.push(data);
      });
      result.push(trItemData);
    });
    if (result.length === 0) result.push([]);
    return result;
  }

  // 获取表格一行的所有单元格的text和value
  function getTextAndValueByRow(row) {
    if (typeof row === 'number') {
      if (row < 0 || row > rowCount - 1) {
        return [];
      }
      var result = [];
      $($target).find('.data-tbody .tr-' + row + ' .cel-item')
        .each(function(ci, tdItem) {
          // var text = $(tdItem).text();
          var $item = $(tdItem);
          var text;
          if ($(tdItem).attr('data-MultiLine') == '1') {
            text = $item.attr('data-text')
          } else {
            text = $item.text()
          }
          var value = $(tdItem).attr('data-celValue');
          var position = {
            c: ci,
            r: row
          };
          var data = {
            text: text,
            value: value,
            posiiton: position
          };
          result.push(data);
        });
      return result;
    } else return [];
  }

  //.获取表格的一列所有的单元格的text和value
  function getTextAndValueByCol(col) {
    if (typeof col === 'number') {
      if (col < 0 || col > colCount - 1) {
        return [];
      }
      var result = [];
      $($target).find('.data-tbody [data-col="'+col+'"]')
        .each(function(ri, tdItem) {
          var text = $(tdItem).text();
          var value = $(tdItem).attr('data-celValue');
          var position = {
            c: col,
            r: ri
          };
          var data = {
            text: text,
            value: value,
            posiiton: position
          };
          result.push(data);
        });
      return result;
    } else return [];
  }

  // 添加列
  function addCol(num, index, data) {
    var agrlen = arguments.length;
    if (agrlen === 0) {
      num = 1;
      index = colCount;
      data = {};
    } else if (agrlen === 1) {
      if (typeof num === 'number') {
        index = colCount;
        data = {};
      } else {
        data = typeof num === 'object' ? num : {};
        num = 1;
        index = colCount;
      }
    } else if (agrlen === 2) {
      if (typeof index === 'number') {
        data = {};
      } else {
        data = index;
        index = colCount;
      }
    }
    num = num || 1;
    if (index < 0 && index > colCount) {
      console.error('请传入正确的位置参数(0~表格列的长度)');
      return false;
    }
    var htmlStr = '';
    var tdOption = data.tdOption || [[]];
    var thOption = data.thOption || {};
    var thText = thOption.text || [];
    // 表头
    var thStr = '';
    for (var ci = 0; ci < num; ci++) {
      thStr += '<th class="e-th td-c' + (index + ci)
        + '">'
        + (thText[ci] || '')
        + '</th>'
    }
    if (index < colCount) {
      $($target).find('.e-table th.td-c' + index)
        .insertBefore($(thStr));
    } else {
      $($target).find('.e-table th.td-c' + (colCount - 1))
        .after($(thStr));
    }
    // 表体
    for (var ri = 0; ri < rowCount; ri++) {
      htmlStr = '';
      for (var ci = 0; ci < num; ci ++) {
        var dataItem = (tdOption[ci] || [])[ri] || {};
        var text = dataItem.text;
        var value = dataItem.value;
        htmlStr += '<td class="e-td td-c' + (ci + index)
          + '" >'
          + '<div data-row="' + ri + '" '
          + 'data-col="' + (ci + index) + '"'
          + 'class="cel-item ' + ('row'+(ri)+'col'+(ci + index)) + '"';
        if (dataItem.value != undefined) {
          htmlStr += 'data-celValue="' + value + '"';
        }
        htmlStr += ' >' + (text || '')
          + '</div>'
          + '</td>'
      }
      if (index < colCount) {
        $($target).find('.data-tbody '+ '.tr-' + ri + ' .td-c' + (colCount -1))
          .insertBefore($(htmlStr));
      } else {
        $($target).find('.data-tbody '+ '.tr-' + ri + ' .td-c' + (colCount -1))
          .after($(htmlStr));
      }
    }
    // 重置数据
    if (thText.length > 0) {
      $($target).find('th').each(function(ri, thItem) {
        if (index > colCount) {
          if (ci >= index + num) {
            $(thItem).removeClass()
              .addClass('e-th')
              .addClass('td-c'+ci);
          }
        }
      });
    }
    $($target).find('.data-tbody tr').each(function(ri, trItem) {
      $(trItem).find('.e-td').each(function(ci, tdItem) {
        if (index < colCount) {
          if (ci >= index + num) {
            $(tdItem).removeClass()
              .addClass('td-c' + ci);
            var cellItem$ = $(tdItem).find('.cel-item');
            var classNameItem = cellItem$.attr('class')
              .replace(/^row\d+col\d+$/, 'row'+ri+'col'+ci);
            cellItem$.data('col', ci);
            cellItem$.attr('class', classNameItem);
          }
        }
      });
    });
    colCount += num;
    // 样式修改
    var styleStr = '';
    var cellWith = data.cellWith || [];
    if (cellWith.length == colCount) {
      for (var i = 0; i < cellWith.length; i++) {
        styleStr += '.' + eTableClassName + ' .td-c' + i + '{'
          + 'width:' + cellWith[i] + ';'
          +'}';
      }
    } else {
      for (var i = 0; i < colCount; i++) {
        styleStr += '.' + eTableClassName + ' .td-c' + i + ' {'
          + 'width:' + (100 / colCount) + '%;'
          + '}';
      }
    }
    _addStyle(styleStr, 'e-style-'+(+new Date()));
    // 事件重置
    clearDomEvent();
    initDomEvent();
    return true;
  }

  // 删除列
  function removeCol(num, index, data) {
    var agrlen = arguments.length;
    if (agrlen === 0) {
      num = 1;
      index = colCount - 1;
      data = [];
    } else if (agrlen === 1) {
      if (typeof num === 'number') {
        index = colCount - 1;
        data = [];
      } else {
        data = Array.isArray(num) ? num : [];
        num = 1;
        index = colCount - 1;
      }
    } else if (agrlen === 2) {
      if (typeof index === 'number') {
        data = [];
      } else {
        data = index;
        index = colCount - 1;
      }
    }
    num = num || 1;
    if (num > colCount) num = colCount;
    if (colCount < 1) return false;
    if (index < 0 || index > colCount -1) {
      console.error('请传入正确的位置参数(表格的列索引)');
      return false;
    }
    $($target).find('.e-table .data-tbody tr')
      .each(function(ri, trItem) {
        var i = 0;
        $(trItem).find('.e-td').each(function(ci, tdItem) {
          if (ci >= index && ci < index + num) {
            $(tdItem).remove();
          } else if (ci >= index + num) {
            var ci = i + index;
            $(tdItem).removeClass()
              .addClass('td-c'+ci);
            var cellItem$ = $(tdItem).find('.cel-item');
            var classNameItem = cellItem$.attr('class')
              .replace(/^row\d+col\d+$/, 'row'+ri+'col'+ci);
            cellItem$.data('col', ci);
            cellItem$.attr('class', classNameItem);
            i++;
          }
        });
      });
    $($target).find('.e-table .e-th').each(function(ci, thItem) {
      if (ci >= index  && ci < index + num) {
        $(thItem).remove();
      } else if (ci >= index + num) {
        $(thItem).removeClass()
          .addClass('e-th')
          .addClass('td-c'+ci);
      }
    });
    colCount -= num;
    // 样式重置
    var styleStr = '';
    var cellWith = data || [];
    if (cellWith.length == colCount) {
      for (var i = 0; i < cellWith.length; i++) {
        styleStr += '.' + eTableClassName + ' .td-c' + i + '{'
          + 'width:' + cellWith[i] + ';'
          +'}';
      }
    } else {
      for (var i = 0; i < colCount; i++) {
        styleStr += '.' + eTableClassName + ' .td-c' + i + ' {'
          + 'width:' + (100 / colCount) + '%;'
          + '}';
      }
    }
    _addStyle(styleStr, 'e-style-'+(+new Date()));
    return true;
  }

  // 获取表格的行数
  function getRowCount() {
    return rowCount;
  }

  // 获取表格的列数
  function getColCount() {
    return colCount;
  }

  function setCellStyleAndOption(cellStyleAndOption) {
    if (cellStyleAndOption.length) {
      setCellOption = []
      cellStyleAndOption.forEach(function(ele) {
        var position = ele.position || {};
        var cellOption = ele.cellOption;
        var cellStyle = ele.cellStyle;
        var setCellOptionItem = {
          position: position,
          cellOption: cellOption
        }
        setCellOption.push(setCellOptionItem)
        var $item = getCels(position);
        if ($item && cellStyle) {
          $($item).css(cellStyle)
        }
      })
    }
  }

  init();
  // 返回实例及相关api
  return {
    destroy: clear,
    getValue: getValue,
    getText: getText,
    setValue: setValue,
    setText: setText,
    addRow: addRow,
    removeRow: removeRow,
    getAllTextAndValue: getAllTextAndValue,
    getTextAndValueByRow: getTextAndValueByRow,
    getTextAndValueByCol: getTextAndValueByCol,
    addCol: addCol,
    removeCol: removeCol,
    getRowCount: getRowCount,
    getColCount: getColCount,
    goNextRowCell: goNextRowCell,
    goPrevRowCell: goPrevRowCell,
    goPrevCell: goPrevCell,
    goNextCell: goNextCell,
    hidePopper: hidePopper,
    setCellStyleAndOption: setCellStyleAndOption
  };
}

window.MxExcel = MxExcel;

// var mxExcl = MxExcel('atable', {
//   dblclick: function(e, a) {
//     // console.log(e, a)
//   },
//   click: function(e, p) {
//     // console.log(e, p);
//   },
//   change: function(p, text) {
//     // console.log(p, text)
//   },
//   // cellChangeOption: [{
//   //   change: function(p, text) {
//   //     console.log(p, 'dd')
//   //   },
//   //   position: {
//   //     c: 0, r: 0
//   //   }
//   // }],
//   cellWidth: ['20%', '30%', '30%', '20%'],
//   cellHight: '34px',
//   thOption: {
//     thText: ['性别', '姓名', '学号', '年龄'],
//     thStyle: 'background: rgba(1,1,1,.8);color:#fff;',
//   },
//   tdData: [
//     [{text: '男', value: ''}, {text: '向xxx'}, {text: '3423423'}],
//     [{text: '男'}, {text: '向xxx'}, {text: '3423423'}],
//     [{text: '男'}, {text: '向xxx'}, {text: '3423423'},]
//   ],
//   row: 14,
//   col: 4
// });
// mxExcl.setText({c: 0, r: 0}, 'hello,world');
// mxExcl.setValue({c: 0, r: 0}, 'x');
// console.log(mxExcl.getValue({c: 0, r: 0}), mxExcl.getText({c: 0, r: 0}));
// $('#addbtn').click(function(e) {
//   mxExcl.addRow(2, [[{text: 'hh', value: ''}]]);
// });
// $('#delbtn').click(function(e) {
//   mxExcl.removeRow();
// });
// $('#addColBtn').click(function(e) {
//   mxExcl.addCol();
// });
// $('#delColBtn').click(function(e) {
//   mxExcl.removeCol(['50%', '20%', '30%']);
// });
// var r = mxExcl.getTextAndValueByCol(0);
// console.log(r);
