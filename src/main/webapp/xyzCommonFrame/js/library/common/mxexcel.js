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
  var isSelectHandle = false; // 是否在进行连选
  var cacheCelArr = []; // 选择的单元格缓存
  var cacheCopiedCelArr = []; // 复制的单元格
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
      htmlStr += '<tbody><tr>';
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
        + '<span class="delbtn" title="删除此行">-</span>'
        + '<span class="addbtn" title="添加一行">+</span>'
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
      + 'top: -2px;'
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
      + 'bottom: 4px;'
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
      + 'display: flex;padding: 2px;'
      + 'justify-content: space-around;flex-direction: column;'
      + 'min-height: ' + cellHight + ' ;'
      + 'height: 100%;box-sizing: border-box;transition: .8s background-color;'
      + ' } ';
    // 兼容ff  display: flex; 焦点 bug
    styleStr += '.' + eTableClassName + ' .cel-item:focus::after{ '
      + 'content: "";width: 100%;height: 3px;'
      + '}';
    // 兼容ff  display: flex; 焦点 bug
    styleStr += '.' + eTableClassName + ' .cel-item:focus::before{ '
      + 'content: "";width: 100%;height: 8px;'
      + '}';
    // 设置选中的单元格的样式
    cellSelectedStyle = cellSelectedStyle
      || 'box-shadow: 0 0 3px rgb(15, 144, 255);';
    styleStr += '.' + eTableClassName + ' .cel-item:focus { '
      + 'text-align: left;'
      + cellSelectedStyle
      +' } ';
    styleStr += '.' + eTableClassName + ' .cel-item.focus { '
      + cellSelectedStyle
      + ' } ';
    // 设置单元被粘贴的样式
    cellPastedStyle = cellPastedStyle
      || 'background-color: rgba(1, 1, 1, .8);'
    styleStr += '.' + eTableClassName + ' .cel-item.copied { '
      +  cellPastedStyle
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
      + 'background:rgb(15, 144, 255);color: #fff;'
      + ' }';
    styleStr += '.' + eTableClassName + ' *:focus::-moz-selection '
      + ' { '
      + 'background:rgb(15, 144, 255);color: #fff;'
      + ' }';
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
  function emitChange(targertNode, text) {
    var textold = $(targertNode).text();
    if (textold === text) return;
    var col = $(targertNode).data('col');
    var row = $(targertNode).data('row');
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
  function copyCelByText(targetNode, text, isRest) {
    emitChange(targetNode, text);
    if (isRest) {
      $(targetNode).text('');
    }
    setSelection(text);
    $(targetNode).addClass('copied');
    setTimeout(function() {
      $(targetNode).removeClass('copied');
    }, 1000);
  }
  // 复制一个单元格
  function copyCel(targetNode, originalNode) {
    var text = $(originalNode).text();
    emitChange(targetNode, text);
    $(targetNode).text(text);
    $(targetNode).addClass('copied');
    setTimeout(function() {
      $(targetNode).removeClass('copied');
    }, 1000);
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
  // 将缓存的数组转为map
  function getCatchMap(arr) {
    arr = cacheArrSort(arr);
    var data = {};
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i];
      var row = $(item).data('row');
      (data['row' + row] || (data['row' + row] = [])).push(item);
    }
    return data;
  }
  var oldSelectText = '';
  // 粘贴事件回调
  function selectTextHandle(targetNode) {
    var catchMap = getCatchMap(cacheCopiedCelArr);
    var row = $(targetNode).data('row');
    var canUseRow = rowCount - row; // 可利用的行数
    var col = $(targetNode).data('col');
    var canUseCol = colCount - col; // 可利用的列数
    var catchMapKeyArr = Object.keys(catchMap).sort();
    var originalRowCount = catchMapKeyArr.length;
    canUseRow = canUseRow < originalRowCount ? canUseRow : originalRowCount;
    for (var i = 0; i < canUseRow; i++) {
      var rowNum = row + i;
      var originalColCount = catchMap[catchMapKeyArr[i]].length;
      originalColCount = canUseCol < originalColCount ? canUseCol : originalColCount;
      for (var j = 0; j < originalColCount; j++) {
        var item = catchMap[catchMapKeyArr[i]][j];
        var colNum = col + j;
        var targetItem = $('.row'+ rowNum + 'col' + colNum)[0];
        if (i === 0 && j === 0) {
          copyCelByText(targetItem, $(item).text(), true);
        } else {
          copyCel(targetItem, item);
        }
      }
    }
  }
  // 初始化dom及相应事件
  var dblclickHandle = option.dblclick;
  var clickHandle = option.click;
  var changeHandle = option.change;
  var cellChangeOption = option.cellChangeOption || [];
  function initDom() {
    var html = _initHmlt();
    $($target).html(html);
    initDomEvent();
    // 复制逻辑
    $($target).find('.e-table').on('copy', function (e) {
      oldSelectText = getSelection();
      if (cacheCelArr.length === 1) {
        cacheCopiedCelArr = cacheCelArr;
        var clipboardData = _getClipboardData(e);
        clipboardData.setData('text/plain', '');
        e.preventDefault();
      } else if (cacheCelArr.length > 1) {
        cacheCopiedCelArr = cacheCelArr;
        var clipboardData = _getClipboardData(e);
        clipboardData.setData('text/plain', '');
        e.preventDefault();
      } else {
        cacheCopiedCelArr = [];
      }
    });
  }
  // 设置正确焦点位置
  function setSelection(text) {
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
  function initDomEvent() {
    // 删除一行
    $($target).find('.e-table .data-tbody .delbtn').each(function(index, item) {
      $(item).click(function() {
        var index = $(this).parent('.no').data('index');
        index = parseInt(index);
        removeRow(1, index);
      })
    });
    // 添加一行
    $($target).find('.e-table .data-tbody .addbtn').each(function(index, item) {
      $(item).click(function(e) {
        var index = $(this).parent('.no').data('index');
        index = parseInt(index);
        addRow(1, index + 1);
      });
    });
    $($target).find('.e-table td .cel-item').each(function(index, item) {
      // 单元格鼠标点击事件
      $(item).mousedown(function(e) {
        ($target).find('.e-table td .cel-item')
          .removeClass('focus')
          .attr('mxNoBackSpace', '');
        $(item).attr('contenteditable', true);
        // 框架里 禁用回退键 设置mxNoBackSpace 属性开启回退
        $(item).attr('mxNoBackSpace', 'cancel');
        cacheCelArr = [item];
      });
      var col = $(item).data('col');
      var row = $(item).data('row');
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
      // text改变回调
      var hasCellChange = false;
      if (cellChangeOption.length > 0) {
        var itemIndex = arrayFindIndex(cellChangeOption, function(item) {
          if (item.position.c == col && item.position.r == row) return true;
        });
        if (itemIndex > -1) {
          hasCellChange = true;
          var changeHandleItem = cellChangeOption[itemIndex].change;
          $(item).on('DOMCharacterDataModified', function(e) {
            changeHandleItem({c: col, r: row}, $(item).text());
          })
        }
      }
      if (changeHandle && !hasCellChange) {
        $(item).on('DOMCharacterDataModified', function(e) {
          changeHandle({c: col, r: row}, $(item).text());
        })
      }
      // 单元格鼠标移开逻辑
      $(item).mouseleave(function(e) {
        if (isSelectHandle) {
          $(item).blur();
          $(item).attr('contenteditable', false);
          $(item).attr('mxNoBackSpace', '');
        }
      });
      // 单元格粘贴逻辑
      $(item).on('paste', function(e) {
        var selectText = _getSelectedText(e) || '';
        if (!selectText) {
          if (cacheCopiedCelArr.length == 1) {
            e.preventDefault();
            var selectTextItem = $(cacheCopiedCelArr[0]).text();
              if (!oldSelectText) {
              copyCelByText(item, selectTextItem);
            } else {
              setSelection(oldSelectText);
            }
          } else if (cacheCopiedCelArr.length > 1) { // 复制多个单元格逻辑
            e.preventDefault();
            selectTextHandle(item);
          }
        } else {
          e.preventDefault();
          cacheCopiedCelArr = [];
          setSelection(selectText);
        }
      });
    });
  }
  // 清除dom相关事件
  function clearDomEvent() {
    $($target).find('.e-table .data-tbody .delbtn').each(function(index, item) {
      $(item).off('click');
    });
    $($target).find('.e-table .data-tbody .addbtn').each(function(index, item) {
      $(item).off('click');
    });
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
          $(item).off('DOMCharacterDataModified');
        }
      }
      if (changeHandle && !hasCellChange) {
        $(item).off('DOMCharacterDataModified');
      }
    });
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
    if (isIn) {
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
      $(item).text('');
      $(item).removeClass('focus');
      $(item).attr('mxNoBackSpace', '');
    }
    cacheCelArr[0] && $(cacheCelArr[0]).blur();
    cacheCelArr = [];
  }
  // 函数节流
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
      if (isSelectHandle) {
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
    var throttleMousemoveHandle = _throttle(14, mousemoveHandle);
    $('body').mousemove(throttleMousemoveHandle);
    // 连选控制
    function mouseupHandle(e) {
      isSelectHandle = false;
    }
    $('body').mouseup(mouseupHandle);
    function mousedownHandle(e) {
      isSelectHandle = true;
      oldx1 = e.clientX;
      oldy1 = e.clientY;
    }
    $('body').mousedown(mousedownHandle);
    // 删除逻辑
    function keydownHandle(e) {
      // keyup
      var isDeleteKeyCode = e.keyCode == 8 || e.keyCode == 46;
      // 删除键
      if (isDeleteKeyCode && cacheCelArr.length > 1) {
        deleteTextHandle(e);
        e.preventDefault();
      }
    }
    $('body').on('keydown', keydownHandle);
    // 返回清理事件函数
    return function clear() {
      $('body').off('mousemove', throttleMousemoveHandle);
      $('body').off('mouseup', mouseupHandle);
      $('dody').off('mousedown', mousedownHandle);
      $('body').off('keydown', keydownHandle);
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
    cacheCopiedCelArr = null;
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

  // 获取单元格的值
  function getValue(position) {
    var $item = getCel(position);
    return $item.data('celValue');
  }

  // 获取单元格的text
  function getText(position) {
    var $item = getCel(position);
    return $item.text()
  }

  // 设置单元格的值
  function setValue(position, val) {
    var $item = getCel(position);
    return $item.data('celValue', val);
  }

  // 设置单元格的text
  function setText(position, text) {
    var $item = getCel(position);
    emitChange($item, text);
    return $item.text(text)
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
        + '<span class="delbtn" title="删除此行">-</span>'
        + '<span class="addbtn" title="添加一行">+</span>'
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
              $(item).find('.no').data('index', currentRi);
              $(item).removeClass().addClass('tr-' + currentRi);
              $(item).find('.cel-item').each(function(ci, cellItem) {
                $(cellItem).data('row', currentRi);
                var classNameItem = $(cellItem).attr('class').replace(/^row\d+col\d+$/, 'row'+currentRi+'col'+ci);
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
          $(item).find('.no').data('index', ri);
          $(item).find('.cel-item').each(function(ci, cellItem) {
            $(cellItem).data('row', ri);
            var classNameItem = $(cellItem).attr('class').replace(/^row\d+col\d+$/, 'row'+ri+'col'+ci);
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
        var text = $(tdItem).text();
        var value = $(tdItem).data('celValue');
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
          var text = $(tdItem).text();
          var value = $(tdItem).data('celValue');
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
          var value = $(tdItem).data('celValue');
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
    getColCount: getColCount
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
