/**
 * 老姚重写的xyzSetValue方法 不要再搞丢了!
 */
$.extend($.fn.combobox.methods, {
    xyzSetValue: function (jq, value) {
        if (!xyzIsNull(value)) {
            var options = jq.combobox('options');
            var mote = options.mode;
            if (mote == 'remote') {
                var queryParams = options.queryParams;
                if (typeof obj == 'object') {
                    queryParams.q = value;
                } else {
                    queryParams = {};
                    queryParams.q = value;
                }
                options.queryParams = queryParams;
                jq.combobox('reload');
                jq.combobox('setValue', value);
            } else {
                jq.combobox('setValue', value);
            }
        } else {
            jq.combobox('setValue', value);
        }
    }
});
//读取用户自定义配置

$.extend($.fn.switchbutton.defaults, {
    handleWidth: 22,
    width: 46
});

$.extend($.fn.datebox.defaults, {
    panelWidth: 260,
    panelHeight: 272,
    onShowPanel: function () {
        $(".datebox-calendar-inner").parent().parent().addClass("now");
        $(".datebox-calendar-inner").parent().addClass("now");
    }
});

$.extend($.fn.datetimebox.defaults, {
    panelWidth: 260,
    panelHeight: 298,
    onShowPanel: function () {
        $(".datebox-calendar-inner").parent().parent().addClass("now");
        $(".datebox-calendar-inner").parent().addClass("now");
    }
});

$.extend($.fn.tabs.defaults, {
    onAdd: function (title, index) {

    }
});

//滚动条
$.extend($.fn.combobox.defaults, {
    panelMaxWidth: 500,
    onShowPanel: function () {
        $(this).next().addClass("now");
        initShowPanelsroll($(this));
    },
    onHidePanel: function () {
        $(this).next().removeClass("now");
    }
});

function initShowPanelsroll($this) {
    var scrollBoxHeight = $this.combobox("options").panelMaxHeight;//获取设置的最大高
    var scrollContentHeight = 0;//设置的内容高
    var scrollCombobox = $this.combobox("panel");//获取内容外框对象
    var scrollComboboxParent = $this.combobox("panel").parent();//获取内容外框父级
    if (scrollCombobox.children().length > 0) {
        scrollCombobox.children().each(function (index) {
            scrollContentHeight += $(this).outerHeight();//计算内容高度
        });

        if (scrollContentHeight > scrollBoxHeight) {//判断是否出现滚动条
            if (scrollBoxHeight == null) {//防止没有设置最大高
                return;
            }
            ;
            if (scrollComboboxParent.find(".sbar").length == 0) {//滚动条只生成一次
                var scrollbar = "<div class='sbarbox' style='height:" + (scrollBoxHeight - 2) + "px'><div class='sbar'><span></span></div></div>";
                scrollComboboxParent.append(scrollbar);
            }
            ;
            initscroll($this.combobox("panel"), scrollBoxHeight, scrollContentHeight);
        }
        ;
    }
};

function initscroll(e, scrollBoxHeight, scrollContentHeight) {
    var $ul = e;
    var $span = $ul.parent().find('.sbarbox span').eq(0);
    var n = ((scrollBoxHeight / scrollContentHeight) * 100) + '%';
    $span.css('height', n);
    $ul.parent().find('.sbarbox').show();
    $ul.parent().find('.sbar').fadeIn();
    scrollBoxHeight = $ul[0].getBoundingClientRect().height; // 设置的理论最大高度和真实渲染的高度有出入
    $ul.parent().find('.sbar').css({"height": scrollBoxHeight - 20 + "px"});
    // 监听高度
    $ul.scroll(function () {
        if ($ul.children()[0]) {
            if ($ul.children()[0].offsetWidth == 0 || $ul.children()[0].offsetWidth + 4 >= $ul[0].offsetWidth) {
                $ul.parent().find('.sbarbox').hide();
            } else {
                $ul.parent().find('.sbarbox').show();
            }

            scrollContentHeight = $ul[0].scrollHeight;
            var scrolltop = $ul.scrollTop();
            var box_height = $ul.parent().find('.sbar')[0].getBoundingClientRect().height,
                scroll_bar_height = $ul.parent().find('.sbar span')[0].getBoundingClientRect().height;

            // scrolltop=(scrolltop/scrollContentHeight)*(scrollBoxHeight-20);
            scrolltop = (scrolltop / (scrollContentHeight - scrollBoxHeight)) * (box_height - scroll_bar_height);
            $span.css({"top": scrolltop + "px"});
        }
    });
}

// 测试皮肤样式是否生效
function watchSkinCssStyle(d) {
    if ($("#testCssStyleLoaded").length < 1) {
        var testDiv = '<div id="testCssStyleLoaded" style="display: none;"></div>';
        $("body").prepend(testDiv);
    }
    var width = $("#testCssStyleLoaded").width();
    if (width != 1) {
        setTimeout(function () {
            watchSkinCssStyle(d);
        }, 1);
    } else {
        $("#" + d.table).datagrid("resize");
    }
}

/**
 * datagrid 移动端
 * */
var _datagridInit = false;
let TableArr = []

function xyzgrid(config) {
    if (!_checkLoginInfo()) return false;
    TableArr.push(mxApi.clone(config));
    if (!config.table) {
        return;
    }

    if (!config.hasOwnProperty('loadFilter')) {
        config.loadFilter = function (data) {
            return perData(data)
        }
    }

    //全局处理返回数据0条时弹出无数据提示
    function perData(data) {
        if (!data) return
        let res = data.content;
        if (data.status === 1 && data.content.hasOwnProperty('total') && data.content.total === 0) {
            top.$.messager.alert('提示', '没有可用数据', 'info');
            res = data.content;
        } else if (data.status === 0) {
            top.$.messager.alert('提示', data.msg, 'info');
            res = {
                total: 0,
                rows: []
            }
        }
        return res
    }

    var parent = document.getElementsByClassName('datagridBox');
    if (mxApi.isPc() || parent.length > 1) {
        return xyzgridPc(config);
    } else {
        var obj = {};

        //为pc专门初始化一个toolbar
        function initToolBar(config) {
            var parent = document.getElementsByClassName('datagridBox')[0];

            var old_toolbar = document.querySelector('#' + config.table + '_toolbar');
            old_toolbar && old_toolbar.parentNode.removeChild(old_toolbar);
            var toolbar = document.createElement('div');
            toolbar.setAttribute('id', config.table + '_toolbar');
            toolbar.className = 'mobile-toolbar';
            parent.insertBefore(toolbar, parent.childNodes[0]);

            var _toolbar = config.toolbar ? config.toolbar : [];
            if (_toolbar.length > 0) {
                var tempToolbar = [];
                for (var i = 0; i < _toolbar.length; i++) {
                    if (typeof (_toolbar[i]) !== 'string') {
                        tempToolbar.push(_toolbar[i]);
                    }
                }
                _toolbar = tempToolbar;
                for (i = 0; i < _toolbar.length; i++) {
                    var obj = _toolbar[i];

                    var btn = document.createElement('div');
                    btn.className = 'mobile-toolbar-btn';
                    if (obj.id) {
                        btn.id = obj.id;
                        toolbar.appendChild(btn);
                        continue;
                    }

                    if (obj.group) {
                        btn.className += ' ' + obj.group;
                    }

                    var img = document.createElement('span');
                    img.className = 'img ';
                    if (obj.iconCls) {
                        btn.appendChild(img);
                        img.className += obj.iconCls;
                    } else {
                        img.innerText = '　'
                    }

                    var txt = document.createElement('span');
                    txt.innerText = obj.text;

                    btn.appendChild(txt);

                    btn.addEventListener('click', obj.handler ? obj.handler : undefined);

                    toolbar.appendChild(btn);
                }
            } else {
                toolbar.style.margin = 0;
                toolbar.style.padding = 0;
            }
        }

        initToolBar(config);
        var table = xyzgridMultiple(config);
        var detail = xyzgridSingle(config);

        obj.getChecked = function () {
            if (detail.isShow) {
                return detail.getChecked();
            } else {
                return table.datagrid('getChecked');
            }
        };

        obj.setData = function (content) {
            if (detail.isShow) {
                return detail.setData(content.total, content.rows);
            } else {
                return table.datagrid('setData', content);
            }
        };

        obj.reload = function () {
            if (detail.isShow) {
                return detail.reload();
            } else {
                return table.datagrid('reload');
            }
        };

        obj.load = function (queryParams) {
            /*if (detail.isShow) {
                return detail.load(queryParams);
            } else {
                return table.datagrid('load', queryParams);
            }*/

            if (detail.isShow) {
                detail.hide(false);
            }
            table.datagrid('load', queryParams);
        };

        obj.uncheckAll = function () {
            if (detail.isShow) {
                detail.hide(false);
            }
            return table.datagrid('uncheckAll');
        };

        obj.selectRecord = function (idValue) {
            if (detail.isShow) {
                detail.hide(false);
            }
            return table.datagrid('selectRecord', idValue);
        };

        obj.datagrid = function (funcName, param1, param2) {
            if (param2) {
                return obj[funcName](param1, param2);
            } else if (param1) {
                return obj[funcName](param1);
            } else {
                return obj[funcName]();
            }
        };

        window.$datagrid_table = table;
        window.$datagrid_detail = detail;

        return obj;
    }
}

//移动端表格
function xyzgridSingle(config) {
    var obj = {
        id: config.table,
        init: false,
        _dataRes: [],
    };

    //数据请求配置
    obj.url = config.url;
    //父容器
    obj.parent = document.getElementsByClassName('datagridBox')[0];

    //表格外层容器
    var container = document.getElementById(obj.id + '_container');
    if (container) {
        obj.parent.removeChild(container);
    }

    container = document.createElement('div');
    container.setAttribute('id', obj.id + '_container');
    container.className = 'mobile-container';

    obj.parent.appendChild(container);
    obj.parent = container;
    obj.isShow = false;

    obj.show = function (isPaging, index, page, pageSize, total, data) {
        obj.isShow = true;
        container.className = 'mobile-container mobile-container-show';

        var nowPage = (Number(page) - 1) * Number(pageSize) + Number(index) + 1;
        obj._pagingRes.isPaging = isPaging;
        obj.setData(nowPage, total, data);
    };

    obj.hide = function (isReload) {
        obj.isShow = false;
        container.className = 'mobile-container';

        if (window.$datagrid_table && isReload !== false) {
            setTimeout(function () {
                window.$datagrid_table.datagrid('reload');
            }, 600);
        }
    };

    var backBtn = document.createElement('div');
    backBtn.setAttribute('id', obj.id + '_back');
    backBtn.className = 'mobile-back-btn';
    var backIcon = document.createElement('span');
    backIcon.className = 'iconfont icon-searchClear';
    var backText = document.createElement('span');
    backText.innerText = '返回列表';
    backBtn.appendChild(backIcon);
    backBtn.appendChild(backText);
    backBtn.addEventListener('click', function () {
        obj.hide();
    });
    container.appendChild(backBtn);

    //调整外容器大小
    var toolbarHeight = $("#" + obj.id + '_toolbar').outerHeight(true);
    var backBtnHeight = $("#" + obj.id + '_back').outerHeight(true);
    var datagridHeight = $('.datagrid').height();
    container.style.top = toolbarHeight + 'px';
    container.style.minHeight = datagridHeight - backBtnHeight + 'px';

    var _toolbar = config.toolbar ? config.toolbar : [];
    var _columns = config.columns ? config.columns : [];

    //页面渲染数 现在强制只允许渲染一个
    config.pageSize = 1;
    config.dataNum = config.pageSize;

    //默认隐藏单项

    //初始化 操作栏
    obj.initToolbar = function (_toolbar) {
        var self = this;
        if (_toolbar.length > 0) {
            var toolbar = document.createElement('div');
            toolbar.setAttribute('id', self.id + '_detail_toolbar');
            toolbar.className = 'mobile-detail-toolbar';

            self.parent.appendChild(toolbar);
            var tempToolbar = [];
            for (var i = 0; i < _toolbar.length; i++) {
                if (typeof (_toolbar[i]) !== 'string') {
                    tempToolbar.push(_toolbar[i]);
                }
            }
            _toolbar = tempToolbar;
            tempToolbar = [];
            for (i = 0; i < _toolbar.length; i++) {
                var obj = _toolbar[i];

                var btn = document.createElement('div');
                btn.className = 'mobile-detail-toolbar-btn';
                if (obj.group) {
                    btn.className += ' ' + obj.group;
                }

                if (obj.iconCls) {
                    var img = document.createElement('span');
                    img.className = 'img ' + obj.iconCls;
                    btn.appendChild(img);
                }

                var txt = document.createElement('span');
                txt.innerText = obj.text;
                if (obj.text.length === 2) {
                    txt.className = 't-2';
                } else if (obj.text.length === 3) {
                    txt.className = 't-3';
                } else if (obj.text.length === 4) {
                    txt.className = 't-4';
                } else if (obj.text.length === 5) {
                    txt.className = 't-4';
                } else if (obj.text.length >= 6 && obj.text.length < 10) {
                    txt.className = 't-6';
                } else {
                    txt.className = 't-7';
                }


                btn.appendChild(txt);

                btn.addEventListener('click', obj.handler ? obj.handler : undefined);

                toolbar.appendChild(btn);

                tempToolbar.push({
                    dom: btn,
                    config: obj
                });
            }

            self._toolbarRes = tempToolbar;
        }
    };
    //初始化 表格
    obj.initTable = function (_columns) {
        var self = this;
        if (_columns && _columns.length > 0) {
            self._rowRes = [];//行列表
            self._contentRes = [];//内容列表
            //主表格div
            var mainDoc = document.createElement('div');
            mainDoc.setAttribute('id', self.id + '_table');
            mainDoc.className = 'mobile-table';
            self.parent.appendChild(mainDoc);

            //目前只允许渲染一个列表
            if (_columns[0] instanceof Array) {
                _columns = _columns[0];
            }

            //获取最后一个显示的列位置,如果没有隐藏列 lastShow 才会有效果
            var lastShow = _columns.length - 1;
            var isHidden = false;
            for (var j = _columns.length - 1; j >= 0; j--) {
                var c = _columns[j];

                if (c.hidden) {
                    isHidden = true;
                    lastShow = j;
                }
            }

            lastShow = lastShow < 0 ? 0 : lastShow;

            for (j = 0; j < _columns.length; j++) {
                var column = _columns[j];

                if (config.pageSize && config.pageSize === 1 && column.field === 'checkboxTemp') {
                    //当pageSize =1 并且 第一列被设置为 checkboxTemp 时 忽略掉，只有显示多列时才显示这个
                    continue;
                }

                //行div
                var row = document.createElement('div');
                row.className = 'mobile-row';
                row.id = 'datagrid_row_' + j;
                row.setAttribute('data-config', JSON.stringify(column));

                //标题div
                var title = document.createElement('div');
                title.className = 'mobile-title';
                title.id = 'datagrid_row_title_' + j;
                title.setAttribute('data-key', column.field);

                if (column.hidden) {
                    row.className = 'mobile-row mobile-hidden';
                } else {
                    //没有隐藏列时，最后一列隐藏 底部 边线
                    if (lastShow === j) {
                        row.style.borderBottom = 'unset';
                        title.style.borderBottom = 'unset';
                    }
                }

                var span = document.createElement('div');
                span.innerText = column.title ? column.title : '';
                span.id = 'datagrid_row_title_txt_' + j;

                title.appendChild(span);

                row.appendChild(title);

                var contentWidth = '100%';
                if (config.pageSize > 1) {
                    contentWidth = '5.1rem';
                    row.style.width = (1.5 + 5.1 * config.pageSize) + 'rem';
                }

                var domList = [];
                for (var cols = 0; cols < config.pageSize; cols++) {
                    //内容div
                    var content = document.createElement('div');
                    content.className = 'mobile-content';
                    content.id = 'datagrid_row_content_' + j + '_' + cols;
                    content.innerText = ' - ';
                    content.setAttribute('data-key', column.field);

                    if (column.align) {
                        // content.style.textAlign = column.align; // 移动端详细信息先默认左对齐
                    } else {
                        content.style.textAlign = 'left';
                    }

                    content.style.width = contentWidth;

                    if (!column.hidden && lastShow === j) {
                        content.style.borderBottom = 'unset';
                    }

                    row.appendChild(content);
                    domList.push(content);
                }

                self._contentRes.push({
                    dom: domList,
                    format: column.formatter,
                    styler: column.styler,
                    key: column.field,
                    check: false,
                    dataRes: []
                });

                self._rowRes.push({
                    dom: row,
                    config: column,
                    idx: j
                });

                mainDoc.appendChild(row);
            }

            if (isHidden) {
                //如果有隐藏列 则增加一行 展开收起
                var last = document.createElement('div');
                last.className = 'mobile-last';
                last.id = 'datagrid_row_last';
                last.innerText = '点击展开隐藏信息';
                last.setAttribute('data-status', '1');

                last.addEventListener('click', function () {
                    var status = this.getAttribute('data-now');
                    if (status === '1') {
                        status = '0';
                        last.innerText = '展开';
                    } else {
                        status = '1';
                        last.innerText = '收起';
                    }

                    for (var j = 0; j < self._rowRes.length; j++) {
                        var row = self._rowRes[j].dom;

                        var conf = JSON.parse(row.getAttribute('data-config'));

                        if (conf.hidden) {
                            if (status === '0') {
                                row.className = 'mobile-row mobile-hidden mobild-hidden-hide';
                            } else {
                                row.className = 'mobile-row mobile-hidden mobild-hidden-show';
                            }
                        }
                    }

                    this.setAttribute('data-now', status);
                });

                mainDoc.appendChild(last);
            }
        }
    };
    //初始化 分页栏
    obj.initPagingbar = function () {
        var self = this;
        self._pagingRes = {
            page: 1,
            pageSize: config.pageSize,
            dataNum: config.dataNum,
            total: 0,
            allPage: 0,
            now: 0,
            isPaging: true
        };
        //占位符
        var seat = document.createElement('div');
        seat.className = 'mobile-paging-seat';
        self.parent.appendChild(seat);

        //初始化 分页栏
        var pagingbar = document.createElement('div');
        pagingbar.setAttribute('id', self.id + '_footbar');
        pagingbar.className = 'mobile-pagingbar';
        self.parent.appendChild(pagingbar);

        var leftBtn = document.createElement('div');
        leftBtn.className = 'btn left';
        leftBtn.innerText = '上一页';
        var imgL = document.createElement('div');
        imgL.className = 'img';
        leftBtn.appendChild(imgL);
        var rightBtn = document.createElement('div');
        rightBtn.className = 'btn right';
        rightBtn.innerText = '下一页';
        var imgR = document.createElement('div');
        imgR.className = 'img';
        rightBtn.appendChild(imgR);
        var page = document.createElement('div');
        page.className = 'page';
        page.innerText = '第' + self._pagingRes.page + '/' + self._pagingRes.allPage + '页';

        var input = document.createElement('input');
        input.className = 'input';
        input.setAttribute('placeholder', '共' + self._pagingRes.allPage + '页');
        input.setAttribute('type', 'number');
        input.style.display = 'none';

        input.addEventListener('change', function (e) {
            if (e.target.value) {
                if (self.pageTurning(Number(e.target.value))) {
                    self.reload();
                }
            }
        });

        input.addEventListener('blur', function (e) {
            e.target.style.display = 'none';
        });

        input.addEventListener('keydown', function (e) {
            if (e.keyCode === 13) {
                input.blur();
            }
        });

        page.addEventListener('click', function () {
            input.style.display = 'block';
            input.focus();
        });

        leftBtn.addEventListener('click', function () {
            if (self.pageTurning(self._pagingRes.page - 1)) {
                self.reload();
            }
        });

        rightBtn.addEventListener('click', function () {
            if (self.pageTurning(self._pagingRes.page + 1)) {
                self.reload();
            }
        });

        pagingbar.appendChild(leftBtn);
        pagingbar.appendChild(rightBtn);
        pagingbar.appendChild(page);
        pagingbar.appendChild(input);

        self._pagingRes.dom = pagingbar;
        self._pagingRes.pageDom = page;
        self._pagingRes.inputDom = input;
    };
    //翻页
    obj.pageTurning = function (page) {
        var self = this;
        if (page >= 1 && page <= self._pagingRes.allPage) {
            return setPagingTxt(page, self._pagingRes.total);
        } else if (page < 1 || self._pagingRes.allPage === 0) {
            return setPagingTxt(1, self._pagingRes.total);
        } else if (page > self._pagingRes.allPage) {
            return setPagingTxt(self._pagingRes.allPage, self._pagingRes.total);
        }
        return false;
    };
    //加载参数
    obj.reloadParams = function (queryParams) {
        var self = this;
        if (queryParams) {
            queryParams['page'] = self._pagingRes.page;
            queryParams['rows'] = self._pagingRes.pageSize;
            if (queryParams.q) {
                if (typeof queryParams.q === 'string' && queryParams.q.constructor === String) {
                    queryParams.q = JSON.parse(queryParams.q);
                }

                if (queryParams.q['flagDefaultFastForQuery']) {
                    if (_datagridInit) {
                        queryParams.q['flagDefaultFastForQuery'] = 'flagDefaultFastForQueryNo';
                    }
                }

                queryParams.q = JSON.stringify(queryParams.q);
            } else {
                queryParams.q = JSON.stringify({'flagDefaultFastForQuery': 'flagDefaultFastForQueryNo'});
            }
        } else {
            queryParams = {
                'page': self._pagingRes.page,
                'rows': self._pagingRes.pageSize,
                'q': JSON.stringify({'flagDefaultFastForQuery': 'flagDefaultFastForQueryNo'})
            };
        }
        self['queryParams'] = queryParams;
    };
    //发送请求
    obj.sendRequest = function () {
        var self = this;

        self.queryParams.page = self._pagingRes.page;
        self.queryParams.rows = self._pagingRes.pageSize;

        if (top && top.progressBar) {
            top.progressBar.begin();
        }
        xyzAjax({
            url: self.url,
            data: self.queryParams,
            async: true,
            success: function (data) {
                if (top && top.progressBar) {
                    top.progressBar.finish();
                }
                if (data.status === 1) {
                    obj.setData(self._pagingRes.page, data.content.total, data.content.rows);
                } else {
                    top.$.messager.alert("警告", data.msg, "warning");
                    // data = _testData[obj._pagingRes.page - 1];
                    // this.success(data);
                }
            }
        });
    };
    //页面回到第一页 加载
    obj.load = function (queryParams) {
        if (obj.url) {
            obj.pageTurning(1);
            obj.reloadParams(queryParams);
            obj.reload();
        }
    };
    //重新加载
    obj.reload = function () {
        if (obj.url) {
            if (config.onBeforeLoad) {
                if (config.onBeforeLoad(obj.queryParams) === false) {
                    return;
                }
            }

            obj.sendRequest();
        }
    };

    //修改分页文本
    function setPagingTxt(page, total) {
        var allPage = parseInt(total / obj._pagingRes.pageSize);
        var yu = total % obj._pagingRes.pageSize;
        allPage = allPage + (yu > 0 ? 1 : 0);
        obj._pagingRes.page = page;
        obj._pagingRes.total = total;
        obj._pagingRes.allPage = allPage;
        obj._pagingRes.inputDom.value = page;
        obj._pagingRes.inputDom.setAttribute('placeholder', '共' + obj._pagingRes.allPage + '页');
        obj._pagingRes.pageDom.innerText = '第' + obj._pagingRes.page + '/' + obj._pagingRes.allPage + '页';

        if (obj._pagingRes.isPaging) {
            obj._pagingRes.dom.style.display = 'block';
        } else {
            obj._pagingRes.dom.style.display = 'none';
        }

        return true;
    }

    //把 - 分割的样式名 改成 驼峰命名的名称
    function styleToAttr(styleName) {
        if (styleName.indexOf('-') > -1) {
            var str = styleName.substring(styleName.indexOf('-') + 1, styleName.indexOf('-') + 2);
            return styleName.replace('-' + str, str.toLocaleUpperCase());
        } else {
            return styleName;
        }
    }

    //验证空对象
    function isEmptyObject(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }

        return true;
    }

    //填充数据
    obj.setData = function (page, total, rows) {
        var self = this;

        self._dataRes = rows;

        //更新分页文本
        setPagingTxt(page, total);

        var _contentRes = self._contentRes;

        //内容 div 列表
        for (var j = 0; j < _contentRes.length; j++) {
            var _contentList = _contentRes[j];
            var _format = _contentList.format;
            var _styler = _contentList.styler;
            var _key = _contentList.key;
            var _dataRes = [];
            //赋值到dom
            for (var i = 0; i < _contentList.dom.length; i++) {
                var _content = _contentList.dom[i];
                var resData = rows[i] ? rows[i] : {};
                var value = resData[_key] ? resData[_key] : '';
                _dataRes.push(resData);
                if (isEmptyObject(resData)) {
                    _content.innerHTML = '-';
                } else {
                    if (_format) {
                        _content.innerHTML = _format(value, resData, i);
                    } else {
                        var dataKey = _content.getAttribute('data-key');
                        if (dataKey === 'idx') {
                            _content.innerText = ((self._pagingRes.page - 1) * self._pagingRes.pageSize) + i + 1;
                        } else if (dataKey === 'checkboxTemp') {
                            _content.innerText = ((self._pagingRes.page - 1) * self._pagingRes.pageSize) + i + 1;
                        } else {
                            _content.innerText = value ? value : '-';
                        }
                    }

                    if (_styler) {
                        var styleList = _styler(value, resData, i).split(';');
                        for (var s = 0; s < styleList.length; s++) {
                            var style = styleList[s];
                            var kv = style.split(':');

                            var name = kv[0];
                            var val = kv[1];
                            val = val.replace(/(^\s*)|(\s*$)/g, '');

                            _content.style[styleToAttr(name)] = val;
                        }
                    }
                }
            }
            _contentList.dataRes = _dataRes;
            _contentList.check = [0];
        }

        if (config.onLoadSuccess) {
            config.onLoadSuccess({
                'total': total,
                'rows': rows
            });
        }

        self.init = true;
    };

    //获取选中行
    obj.getChecked = function () {
        var self = this;
        // var checkList = [];
        // var _contentList = self._contentRes[0];
        // for (var i = 0; i < _contentList.check.length; i++) {
        //     checkList.push(_contentList.dataRes[_contentList.check[i]]);
        // }
        return self._dataRes.length > 0 ? [self._dataRes[self._pagingRes.now]] : [];
    };

    //兼容老式调用方法
    obj.datagrid = function (funcName, param1, param2) {
        var self = this;
        if (param2) {
            return self[funcName](param1, param2);
        } else if (param1) {
            return self[funcName](param1);
        } else {
            return self[funcName]();
        }
    };

    // obj.initToolbar(_toolbar);
    obj.initTable(_columns);
    obj.initPagingbar();
    // obj.load(config.queryParams);
    if (obj.url) {
        obj.pageTurning(1);
        obj.reloadParams(config.queryParams);
    }

    return obj;
}

//移动端表格
function xyzgridMultiple(d) {
    if (top.skinVersion) {
        setTimeout(function () {
            watchSkinCssStyle(d);
        }, 1);
    }
    //是否显示表单右边的默认工具
    var showDefaultTool = d.showDefaultTool === undefined ? true : d.showDefaultTool;

    // 重写表格CheckBox
    var hasCheckboxTemp = false; // 是否存在复选框
    for (var i = 0; i < d.columns.length; i++) {
        for (var j = 0; j < d.columns[i].length; j++) {
            if (d.columns[i][j].field === "checkboxTemp") {
                hasCheckboxTemp = true;
                d.columns[i][j].checkbox = false;
                d.columns[i][j].hidden = false;
                d.columns[i][j].width = 30;
                d.columns[i][j].align = 'center';
                d.columns[i][j].title = '<input id="checkAll" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>',
                    d.columns[i][j].formatter = function (value, rowData, rowIndex) {
                        return '<input name="checkboxTemp" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>';
                    };
                // break;
            } else {
                // 移动端zoom: .7影响datagrid单元格内容展示不全
                if (typeof d.columns[i][j].width === 'number') d.columns[i][j].width = d.columns[i][j].width / 0.6;
            }
        }
    }
    // 设置冻结列 复选框
    var checkbox_obj = {
        field: 'checkboxTemp',
        checkbox: false,
        hidden: false,
        width: 30,
        align: 'center',
        title: '<input id="checkAll" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>',
        formatter: function (value, rowData, rowIndex) {
            return '<input name="checkboxTemp" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>';
        }
    };
    if (Object.prototype.toString.call(d.frozenColumns) === '[object Array]') {
        // 冻结列 是否有复选框 判断
        for (var i = 0; i < d.frozenColumns.length; i++) {
            for (var j = 0; j < d.frozenColumns[i].length; j++) {
                if (d.frozenColumns[i][j].field === "checkboxTemp") {
                    hasCheckboxTemp = true;
                    break;
                }
            }
        }
        if (showDefaultTool === true) {
            !hasCheckboxTemp && d.frozenColumns[0].unshift(checkbox_obj)
        }
    } else {
        if (showDefaultTool === true) {
            d.frozenColumns = hasCheckboxTemp ? [[]] : [[checkbox_obj]];
        }
    }

    var pathName = window.location.host + window.location.pathname;
    var tab;
    if (mxApi.isPc()) {
        //判断是否新版
        if (top.window.maiframeInfo.versions == "2.0") {
            tab = top.$("#iframeContainer iframe")[top.window.app.tabsSelected];
        } else {
            var selectedTab = top.$('#centerContentTabs').tabs("getSelected");
            tab = selectedTab.panel('options');
        }
    }
    tab = self.frameElement;
    var keyCode = tab.id + "_" + pathName + "_" + d.table;
    /**重新规划显示、隐藏**/
    {
        d.frozenColumns = xyzIsNull(d.frozenColumns) || d.frozenColumns === [] ? [[]] : d.frozenColumns;
        d.columns = xyzIsNull(d.columns) || d.columns === [] ? [[]] : d.columns;
        for (var q = 0; q < d.columns.length; q++) {
            //判断是否有设置行渲染，如果没有，给一个最低46px的行高度
            var isDefaultStyler = false;

            for (var qq = 0; qq < d.columns[q].length; qq++) {

                if (d.columns[q][qq].styler) {
                    var test = stringify(d.columns[q][qq].styler);

                    if (test.indexOf('d.') > -1) {
                        isDefaultStyler = false;
                        delete d.columns[q][qq].styler
                    } else {
                        isDefaultStyler = true;
                    }
                }
            }
            if (!isDefaultStyler) {
                for (i = 0; i < d.columns[q].length; i++) {
                    if (!d.columns[q][i].hidden) {
                        d.columns[q][i].styler = function (value, row, index) {
                            return "height:" + (xyzIsNull(d.rowHeight) || d.rowHeight <= 46 ? 46 : d.rowHeight) + "px;";
                        };
                        break
                    }
                }
            }
        }
        {
            var userOpersValue = xyzGetUserOpers(keyCode);
            if (!xyzIsNull(userOpersValue)) {
                userOpersValue = xyzHtmlDecode(userOpersValue);
                userOpersValue = JSON.parse(userOpersValue);
                d.pageSize = !xyzIsNull(userOpersValue.pageSize) ? userOpersValue.pageSize : d.pageSize;
                var xyzCols = userOpersValue.columns;
                var objlength = Object.keys(xyzCols).length + 1;
                if (objlength <= d.frozenColumns[0].length + d.columns[0].length || d.columns.length > 1) {
                    for (var xyzCol in xyzCols) {
                        if (xyzCols.hasOwnProperty(xyzCol)) {
                            var sort = xyzIsNull(xyzCols[xyzCol].index) ? 100 : xyzCols[xyzCol].index;

                            for (var q = 0; q < d.frozenColumns.length; q++) {
                                for (var qq = 0; qq < d.frozenColumns[q].length; qq++) {
                                    if (d.frozenColumns[q][qq].field === xyzCol) {
                                        d.frozenColumns[q][qq].hidden = xyzCols[xyzCol].hidden;
                                        d.frozenColumns[q][qq].width = xyzCols[xyzCol].width;
                                        d.frozenColumns[q][qq].title = xyzIsNull(xyzCols[xyzCol].title) ? d.frozenColumns[q][qq].title : xyzCols[xyzCol].title;
                                    }
                                }
                            }

                            for (var q = 0; q < d.columns.length; q++) {
                                for (var qq = 0; qq < d.columns[q].length; qq++) {
                                    if (xyzIsNull(d.columns[q][qq])) {
                                        continue
                                    }
                                    if (d.columns[q][qq].field === xyzCol) {
                                        d.columns[q][qq].hidden = xyzCols[xyzCol].hidden;
                                        d.columns[q][qq].width = xyzCols[xyzCol].width;
                                        d.columns[q][qq].title = xyzIsNull(xyzCols[xyzCol].title) ? d.columns[q][qq].title : xyzCols[xyzCol].title;
                                        var _index = sort - d.frozenColumns[0].length;
                                        if (d.columns.length === 1 && sort !== 100 && qq !== _index) {//判断表头有单元格合并的情况不给，兼容以前没有设置index的情况，顺序不一致时执行，移动编辑功能
                                            var c = d.columns[q][_index];
                                            d.columns[q][_index] = d.columns[q][qq];
                                            d.columns[q][qq] = c;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    if (d.url) {
        d.url = d.url.indexOf('../') === 0 ? xyzGetFullUrl(d.url.replace('../', '')) : xyzGetFullUrl(d.url);
    }

    /*2017.8.29pls数据表格高度自适应*/
    var heightinit = $("#" + d.table + '_toolbar').outerHeight(true);
    heightinit += $('.xyz_search').outerHeight(true);
    heightinit += $('#moduleTile').outerHeight(true);
    var winHeight = window.parent.document.body.clientHeight; // 2017.9.14更改 获取浏览器的内容高度
    var num = 0;

    var $page = 0;
    var $pageSize = 0;
    var $table = $("#" + d.table);
    var $isPaging = true;
    $table.datagrid({
        pageNumber: d.pageNumber === undefined ? 1 : d.pageNumber,
        pageSize: d.pageSize === undefined ? 10 : d.pageSize,
        title: d.title,
        sortName: d.sortName === undefined ? '' : d.sortName,
        sortOrder: d.sortOrder === undefined ? '' : d.sortOrder,
        collapsible: d.collapsible === undefined ? true : d.collapsible,//默认有折叠按钮
        collapsed: d.collapsed === undefined ? false : d.collapsed,//定义初始化的时候是否折叠
        url: d.url,
        data: d.data === undefined ? undefined : d.data,
        showFooter: d.showFooter === undefined ? undefined : d.showFooter,
        view: d.view ? detailview : undefined,
        detailFormatter: d.detailFormatter !== undefined ? d.detailFormatter : function (rowIndex, rowData) {
            var tableId = d.table;
            var fields1 = $table.datagrid('getColumnFields', true);
            var fields2 = $table.datagrid('getColumnFields');
            var fields = [];
            for (var i = 0; i < fields1.length; i++) {
                var field = fields1[i];
                var col = $('#' + tableId).datagrid('getColumnOption', field);
                if (col.hidden === true && col.checkbox !== true) {
                    fields[fields.length] = field;
                }
            }
            for (i = 0; i < fields2.length; i++) {
                field = fields2[i];
                col = $('#' + tableId).datagrid('getColumnOption', field);
                if (col.hidden === true && col.checkbox !== true) {
                    fields[fields.length] = field;
                }
            }

            // 2017/9/18二级表格调整
            var resultStr = "<div class='divTable'><ul class='ulTable'>";
            for (i = 0; i < fields.length; i++) {
                field = fields[i];
                col = $('#' + tableId).datagrid('getColumnOption', field);
                resultStr += "<li><div class='liDivContent1'>" + col.title + "</div><hr><div class='liDivContent2'>";
                resultStr += col.formatter ? col.formatter(rowData[col.field], rowData) : rowData[col.field];
                resultStr += "</div></li>";
            }
            resultStr += "</ul></div>";
            return resultStr;
        },
        onExpandRow: d.onExpandRow !== undefined ? d.onExpandRow : undefined,
        toolbar: '',
        loadFilter: d.loadFilter,
        nowrap: d.nowrap === undefined ? true : d.nowrap,//是否不换行，true不换行
        border: d.border === undefined ? true : d.border,//边框
        height: d.height === undefined ? xyzGetHeight(heightinit) : d.height,//高度
        width: d.width === undefined ? "100%" : d.width,//高度2017.8.11修改
        rowStyler: d.rowStyler === undefined ? undefined : d.rowStyler,//row样式2019.3.12修改
        singleSelect: d.singleSelect === undefined ? true : d.singleSelect,//单选
        fitColumns: d.fitColumns === undefined ? false : d.fitColumns,//自适应
        striped: d.striped === undefined ? false : d.striped,//斑马线
        pagination: d.pagination === undefined ? true : d.pagination,//分页
        pagePosition: d.pagePosition === undefined ? "bottom" : d.pagePosition,//分页条文职
        rownumbers: d.rownumbers === undefined ? true : d.rownumbers,//行号
        checkOnSelect: d.checkOnSelect === undefined ? true : d.checkOnSelect,//点行选框
        selectOnCheck: d.selectOnCheck === undefined ? true : d.selectOnCheck,//点框选行
        pageList: d.pageList === undefined ? [3, 5, 8, 10, 15, 20, 30, 50] : d.pageList,//分页
        idField: d.idField === undefined ? 'numberCode' : d.idField,
        columns: d.columns,
        frozenColumns: d.frozenColumns === undefined ? undefined : d.frozenColumns,//冻结列
        queryParams: d.queryParams === undefined ? undefined : d.queryParams,//查询条件
        onCheck: d.onCheck === undefined ? undefined : d.onCheck,
        onUncheck: d.onUncheck === undefined ? undefined : d.onUncheck,
        onUnselect: d.onUnselect === undefined ? undefined : d.onUnselect,
        onCheckAll: d.onCheckAll === undefined ? undefined : d.onCheckAll,
        onUncheckAll: d.onUncheckAll === undefined ? undefined : d.onUncheckAll,
        onSelectAll: d.onSelectAll === undefined ? undefined : d.onSelectAll,
        onUnselectAll: d.onUnselectAll === undefined ? undefined : d.onUnselectAll,
        onDblClickCell: d.onDblClickCell === undefined ? undefined : d.onDblClickCell,
        onClickCell: d.onClickCell === undefined ? undefined : d.onClickCell,
        onLoadSuccess: function (data) {
            if (d.onLoadSuccess !== undefined) {
                d.onLoadSuccess(data);
            }
            if (self.frameElement.getAttribute('id')) {
                var id = self.frameElement.getAttribute('id');
                if (mxApi.isPc()) {
                    top.mangerLaoding.remove(id.substring(id.indexOf('_') + 1));
                } else {
                    top.progressBar.finish();
                }
            }

            //表格初始化分页栏 如果没有分页栏 详情也不展示分页
            $isPaging = $table.datagrid("options").pagination;
            if ($isPaging) {
                createDatagridPage(d.table);
            }

            if (top && top.progressBar) {
                top.progressBar.finish();
            }
            let $thisTable=$("#"+d.table)
            $thisTable.parent('.datagrid-view').find("table.datagrid-btable tr").show()
//            重新计算高度
            let $rows1=$thisTable.parent('.datagrid-view').find(".datagrid-view1 table.datagrid-btable tr")
            $rows1.each((idx,ele)=>{
                ele.style.height=document.getElementById(ele.id.replace(/-1-/,'-2-')).offsetHeight + "px"
            })
            //给表里所有 tr 设置长按事件
            var btable = $('.datagrid-btable');
            var trList = $(btable[btable.length - 1]).find('tr');
            var longClick = 0;
            var timeOutEvent = 1;
            var dataList = $table.datagrid('getRows');
            for (var i = 0; i < trList.length; i++) {
                var tr = $(trList[i]);
                tr.on('touchstart', {rowIndex: i, rowData: dataList[i]}, function (e) {
                    // if(e.target)
                    longClick = 0;//设置初始为0
                    timeOutEvent = 0;
                    timeOutEvent = setTimeout(function () {
                        longClick = 1;//假如长按，则设置为1
                        //此处为长按事件-----在此显示遮罩层及删除按钮

                        var rowIndex = e.data.rowIndex;
                        var rowData = e.data.rowData;

                        var selectList = $table.datagrid('getSelections');
                        var check = false;
                        for (var j = 0; j < selectList.length; j++) {
                            var selectObj = selectList[j];
                            if (selectObj.iidd && rowData.iidd) {
                                if (selectObj.iidd === rowData.iidd) {
                                    $table.datagrid('unselectRow', rowIndex);
                                    check = true;
                                    break
                                }
                            } else if (selectObj.numberCode && rowData.numberCode) {
                                if (selectObj.numberCode === rowData.numberCode) {
                                    $table.datagrid('unselectRow', rowIndex);
                                    check = true;
                                    break
                                }
                            }
                        }

                        if (!check) {
                            var contents = $table.datagrid("getData");
                            window.$datagrid_detail.show($isPaging, rowIndex, $page, $pageSize, contents.total, [rowData]);
                        }

                    }, 500);
                });
                tr.on('touchmove', function (e) {
                    clearTimeout(timeOutEvent);
                    timeOutEvent = 0;
                    longClick = 1;
                    // e.preventDefault();
                });
                tr.on('touchend', {rowIndex: i, rowData: dataList[i]}, function (e) {
                    clearTimeout(timeOutEvent);
                    if (timeOutEvent !== 0 && longClick === 0) {//点击
                        //此处为点击事件----在此处添加跳转详情页
                        // var target = e.target;
                        // if (target.className.indexOf('switchbutton') > -1) {
                        //     return true;
                        // } else if (typeof target.onclick === 'function') {
                        //     return true;
                        // } else if (target.type === 'checkbox') {
                        //     return true;
                        // }

                        // return false;
                    }
                });
            }
        },
        onLoadError: function () {
            $table.datagrid("options").pagination === true && createDatagridPage(d.table, false);

            if (top && top.progressBar) {
                top.progressBar.begin();
            }
        },
        onBeforeLoad: function (param) {
            if (d.onBeforeLoad !== undefined) {
                param = d.onBeforeLoad(param);
            }

            var paramQ = {};
            if (param.q) {
                if (typeof param.q === 'string') {
                    paramQ = JSON.parse(param.q);
                } else {
                    paramQ = param.q
                }
            }

            if (paramQ.flagDefaultFastForQuery) {
                if (num > 0) {
                    paramQ.flagDefaultFastForQuery = 'flagDefaultFastForQueryNo';
                    paramQ = JSON.stringify(paramQ);
                    param.q = paramQ;
                } else {
                    param.q = JSON.stringify(paramQ);
                }
                num++;
            }

            $table.datagrid("clearChecked");
            $table.datagrid("clearSelections");
            $.each($(' .datagrid-toolbar a[group=' + d.table + '_sanjianke]'), function (i, e) {
                $(e).parent().css({
                    'position': 'absolute',
                    'right': ((i * 26 + 3)) + 'px',
                    'top': "2px",
                    'background-color': '#F3F3F3'
                });
            });

            $page = param.page ? param.page : 1;
            $pageSize = param.rows ? param.rows : 1;

            if (top && top.progressBar) {
                top.progressBar.begin();
            }
        },
        onSelect: function (rowIndex, rowData) {
            $("input[name='checkboxTemp']").eq(rowIndex).attr("checked", "checked");
            if (rowData.remark !== undefined) {
                var span = '';
                if (rowData.remark !== '') {
                    span = "<span class='remark-span'>" + rowData.remark + "</span>";
                }
                top.$("#remarkTop").html(span);
            } else {
                top.$("#remarkTop").html('');
            }
            if (!xyzIsNull(d.onSelect)) {
                d.onSelect(rowIndex, rowData);
            }
            floatingWindow();
        },
        onClickRow: function (rowIndex, rowData) {
        },
        onDblClickRow: function (index, row) {

        },
        onResizeColumn: function (field, width) {		//调整列大小的时候触发
            /* console.log(width);*/
        }
    });

    /*2017.8.29pls数据表格高度自适应*/
    if (mxApi.isPc()) {
        $(window).resize(function () {
            if ($table.length !== 0) {
                // 当浏览器的内容高度变化时才从新定义数据表格的高度
                if (winHeight !== window.parent.document.body.clientHeight) {
                    winHeight = window.parent.document.body.clientHeight;
                    heightinit = $table.datagrid("getPanel").position().top;
                    $table.datagrid("resize", {
                        height: d.height === undefined ? xyzGetHeight(heightinit) : d.height

                    });  //加个分号 解决 eclipse 报警告
                    console.log('resize', d.height === undefined ? xyzGetHeight(heightinit) : d.height);
                }
            }
        });

        //页面变化后，刷新datagrid
        if ((parent.$(".window.easyui-fluid")[0] || $(".window.easyui-fluid")[0]) && (d.width === undefined || d.width === "100%" || d.width === "auto")) {
            if ($table.datagrid("getPanel")[0] && $(".datagridBox")[0]) {
                var t = setInterval(function () {
                    if (Boolean(parent.$(".window.easyui-fluid")[0]) === false && Boolean($(".window.easyui-fluid")[0]) === false) {
                        clearInterval(t);
                        return
                    }
                    var datagridBoxWidth = $(".datagridBox").width();
                    var datagridWidth = $table.datagrid("getPanel").width() + 2;
                    if (datagridBoxWidth !== datagridWidth) {
                        $table.datagrid("resize");
                    }
                }, 50)
            }
        }
    }

    return $table;
};
let xyzgridConfigbak = null;

//pc表格
function xyzgridPc(d) {
    // 获取表单虚拟系统屏蔽字段
    getxyzgridVrData(d)
    xyzgridConfigbak = mxApi.clone(d);
    if (top.skinVersion) {
        setTimeout(function () {
            watchSkinCssStyle(d);
        }, 1);
    }
    //是否显示表单右边的默认工具
    var showDefaultTool = d.showDefaultTool == undefined ? true : d.showDefaultTool;

    // 重写表格CheckBox
    var hasCheckboxTemp = false; // 是否存在复选框
    for (var i = 0; i < d.columns.length; i++) {
        for (var j = 0; j < d.columns[i].length; j++) {
            if (d.columns[i][j].field == "checkboxTemp") {
                hasCheckboxTemp = true;
                d.columns[i][j].checkbox = false;
                d.columns[i][j].hidden = false;
                d.columns[i][j].width = 30;
                d.columns[i][j].align = 'center';
                d.columns[i][j].title = '<input id="checkAll" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>',
                    d.columns[i][j].formatter = function (value, rowData, rowIndex) {
                        return '<input name="checkboxTemp" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>';
                    }
                // break;
            } else {
                // 移动端zoom: .7影响datagrid单元格内容展示不全
                if (!mxApi.isPc() && typeof d.columns[i][j].width === 'number') d.columns[i][j].width = d.columns[i][j].width / 0.6;
            }
        }
    }
    // 设置冻结列 复选框
    var checkbox_obj = {
        field: 'checkboxTemp',
        checkbox: false,
        hidden: false,
        width: 30,
        align: 'center',
        title: '<input id="checkAll" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>',
        formatter: function (value, rowData, rowIndex) {
            return '<input name="checkboxTemp" type="checkbox"><span class="inputSpan"><span class="iconfont icon-check"></span></span>';
        }
    };
    if (Object.prototype.toString.call(d.frozenColumns) === '[object Array]') {
        // 冻结列 是否有复选框 判断
        for (var i = 0; i < d.frozenColumns.length; i++) {
            for (var j = 0; j < d.frozenColumns[i].length; j++) {
                if (d.frozenColumns[i][j].field == "checkboxTemp") {
                    hasCheckboxTemp = true;
                    break;
                }
            }
        }
        if (showDefaultTool == true) {
            !hasCheckboxTemp && d.frozenColumns[0].unshift(checkbox_obj)
        }
    } else {
        if (showDefaultTool == true) {
            d.frozenColumns = hasCheckboxTemp ? [[]] : [[checkbox_obj]];
        }
    }

    var pathName = window.location.host + window.location.pathname;

    var tab;
    if (mxApi.isPc()) {
        //判断是否新版
        if (top.window.maiframeInfo.versions == "2.0") {
            tab = top.$("#iframeContainer iframe")[top.window.app.tabsSelected];
        } else {
            var selectedTab = top.$('#centerContentTabs').tabs("getSelected");
            tab = selectedTab.panel('options');
        }
    }
    tab = self.frameElement;
    var keyCode = tab.id + "_" + pathName + "_" + d.table;
    /**重新规划显示、隐藏**/
    {
        d.frozenColumns = xyzIsNull(d.frozenColumns) || d.frozenColumns == [] ? [[]] : d.frozenColumns;
        d.columns = xyzIsNull(d.columns) || d.columns == [] ? [[]] : d.columns;

        for (var q = 0; q < d.columns.length; q++) {
            //判断是否有设置行渲染，如果没有，给一个最低46px的行高度
            var isDefaultStyler = false;

            for (var qq = 0; qq < d.columns[q].length; qq++) {
                if (d.columns[q][qq].styler) {
                    var test = stringify(d.columns[q][qq].styler);

                    if (test.indexOf('d.') > -1) {
                        isDefaultStyler = false;
                        delete d.columns[q][qq].styler
                    } else {
                        isDefaultStyler = true;
                    }
                }
            }
            if (!isDefaultStyler) {
                for (i = 0; i < d.columns[q].length; i++) {
                    if (!d.columns[q][i].hidden) {
                        d.columns[q][i].styler = function (value, row, index) {
                            return "height:" + (xyzIsNull(d.rowHeight) || d.rowHeight <= 46 ? 46 : d.rowHeight) + "px;";
                        }
                        break
                    }
                }
            }
        }
        {
            var userOpersValue = getDefaultHabit(keyCode);
            if (!xyzIsNull(userOpersValue)) {
                userOpersValue = xyzHtmlDecode(userOpersValue);
                userOpersValue = JSON.parse(userOpersValue);
                d.pageSize = !xyzIsNull(userOpersValue.pageSize) ? userOpersValue.pageSize : d.pageSize;
                d.sortName = !xyzIsNull(userOpersValue.sortName) ? userOpersValue.sortName : d.sortName;
                d.sortOrder = !xyzIsNull(userOpersValue.sortOrder) ? userOpersValue.sortOrder : d.sortOrder;
                var xyzCols = userOpersValue.columns;
                var objlength = Object.keys(xyzCols).length + 1;
                if ((objlength <= d.frozenColumns[0].length + d.columns[0].length || d.columns.length > 1) || d.forzenChangeFlag === '1') {
                    //|| d.forzenChangeFlag === '1'兼容数据中心冻结列情况
                    for (var xyzCol in xyzCols) {
                        var sort = xyzIsNull(xyzCols[xyzCol].index) ? 100 : xyzCols[xyzCol].index;
                        for (var q = 0; q < d.frozenColumns.length; q++) {
                            for (var qq = 0; qq < d.frozenColumns[q].length; qq++) {
                                if (d.frozenColumns[q][qq].field == xyzCol) {
                                    d.frozenColumns[q][qq].hidden = xyzCols[xyzCol].hidden;
                                    d.frozenColumns[q][qq].width = xyzCols[xyzCol].width;
                                    d.frozenColumns[q][qq].title = xyzIsNull(xyzCols[xyzCol].title) ? d.frozenColumns[q][qq].title : xyzCols[xyzCol].title;
                                    if (d.frozenColumns.length === 1 && sort !== 100 && qq !== sort) {//判断表头有单元格合并的情况不给，兼容以前没有设置index的情况，顺序不一致时执行，移动编辑功能
                                        var c = d.columns[q][sort];
                                        //d.columns[q][sort] = d.columns[q][qq];
                                        //d.columns[q][qq] = c;
                                    }
                                }

                            }
                        }

                        for (var q = 0; q < d.columns.length; q++) {
                            for (var qq = 0; qq < d.columns[q].length; qq++) {
                                if (xyzIsNull(d.columns[q][qq])) {
                                    continue
                                }
                                if (d.columns[q][qq].field == xyzCol) {
                                    d.columns[q][qq].hidden = xyzCols[xyzCol].hidden;
                                    d.columns[q][qq].width = xyzCols[xyzCol].width;
                                    d.columns[q][qq].title = xyzIsNull(xyzCols[xyzCol].title) ? d.columns[q][qq].title : xyzCols[xyzCol].title;

                                    var _index = sort - d.frozenColumns[0].length;
                                    if (d.columns.length === 1 && sort !== 100 && qq !== _index && _index > 0) {
                                        //判断表头有单元格合并的情况不给，兼容以前没有设置index的情况，顺序不一致时执行，移动编辑功能,改变了冻结列
                                        var c = d.columns[q][_index];
                                        if (c) { // 兼容冻结列减少情况
                                            d.columns[q][_index] = d.columns[q][qq];
                                            d.columns[q][qq] = c;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        // 如果有屏蔽字段
        xyzgridVrSetData(d)
    }
    if (!d.toolbar || (typeof d.toolbar === 'string')) {
        if (showDefaultTool) {
            d.toolbar = ['-'];
        }
    }

    if ($.isArray(d.toolbar) && showDefaultTool) {

        d.toolbar[d.toolbar.length] = {
            text: '<i class="datagrid-data-compare-icon iconfont icon-fangwu" title="恢复表格默认排版"></i>',
            group: d.table + '_sanjianke',
            handler: function () {
                DataGridBackDefaultToolFunction(d.table, keyCode);
            }
        };

        //编辑表格
        d.toolbar[d.toolbar.length] = {
            text: '<i  class="datagrid-data-compare-icon iconfont icon-suo" title="编辑当前表格"></i>',
            group: d.table + '_sanjianke',
            handler: function () {
                SwEditeTable(d, keyCode)
            }
        };

        //查看行详情
        d.toolbar[d.toolbar.length] = {
            text: '<i id="SwEditeTableBtn" class="datagrid-data-compare-icon iconfont icon-yanjing " title="查看选中行详情"></i>',
            group: d.table + '_sanjianke',
            handler: function () {
                datagridCompare(d.table)
            }
        };

    }
    if (d.url) {
        d.url = d.url.indexOf('../') === 0 ? xyzGetFullUrl(d.url.replace('../', '')) : xyzGetFullUrl(d.url);
    }

    // 2019.8.19 wuxuegang  编辑表格开始
    /**
     * 开启/关闭 表格编辑功能
     * @d 表格配置JSON
     * @selector 选择器
     * */
    window.tableEditor = [];

    function SwEditeTable(table, keyCode) {
        tableEditor[table.table] = tableEditor[table.table] || new createTableEditor(table);
        tableEditor[table.table].active ? tableEditor[table.table].show() : tableEditor[table.table].hide(keyCode);
    }

    /**
     * 生成显示隐藏表单元素的多选框
     * @d 表格配置JSON
     * */
    class createTableEditor {
        constructor(table, ctrlBtn) {
            this.active = true;
            this.baseData = this.getBaseData(table);
            this.$body = $('body');
            this.moveing = false;
            this.mousein = null;
        }

        // 保存分页相关数据
        savePageInfo(tableId) {
            let _table = $('#' + tableId)
            _table.parents('.datagrid-wrap').eq(0).find('.datagrid-pagination').remove(); // 开始编辑时，移除分页
            let data = _table.datagrid("getData");
            window.datagridPageInfo = window.datagridPageInfo || {}
            window.datagridPageInfo[tableId] = {
                enable: true, // 启用
                total: data.total || (data.rows && data.rows.length) || 0
            }
        }

        getBaseData(table) {
            let tableObj = $('#' + table.table); //获取table对象
            return {
                tableid: table.table,
                tableObj: tableObj,//获取table对象
                tableConfig: tableObj.datagrid('options'),
                tableContainer: tableObj.parents('.datagridBox'),
                columns: tableObj.datagrid('options').columns
            }
        }

        //生成编辑器
        show() {
            let $this = this;
            this.active = false;
            this.$tableContainer = this.baseData.tableContainer;//表格容器
            this.$tableObj = this.baseData.tableObj; //获取table对象
            this.$ctrlBtn = this.$tableContainer.find('.datagrid-toolbar .icon-suo');
            this.$ctrlBtn.parents('td').tooltip('update', '关闭编辑并保存');
            this.tableConfig = this.baseData.tableConfig;
            this.$cheakContainer = $('<div class="checkContainer"></div>');//创建显示隐藏cloum的容器
            $this.$tableContainer.attr('id', this.baseData.tableid + "datagridBox");
            this.$ctrlBtn.addClass('icon-jiesuo');
            this.createCheckboxBox();
            this.savePageInfo(this.baseData.tableid)
            this.$tableObj.datagrid('resize')
        }

        //多选框和title联动功能
        createCheckboxBox() {
            let $this = this;
            this.$tableContainer.find('.checkContainer').html('');
            this.tableConfig.columns.forEach(colarr => {
                //生成显/隐按钮
                colarr.forEach((col, idx) => {
                    if (col.field === "checkboxTemp") {
                        //第一行默认的多选框不计入编辑
                        return
                    }
                    //生成checkbox
                    let $checkBtn = $(`<span class="checkEle ${col.hidden ? "" : "active"}"  field="${col.field}" idx="${idx}"></span>`),
                        $checkEleIcon = $(` <i class="checkEleIcon iconfont icon-fuxuankuang1 ${col.hidden ? "" : "icon-fuxuankuangxuanzhong"} "></i>`),
                        $checkBtntxtSpan = $(`<span class="txtSpan" title="${col.detail||col.title}">${col.title}</span>`);
                        $checkBtn.append($checkEleIcon, $checkBtntxtSpan);
                        $checkEleIcon.on('click', function () {
                            if ($checkBtn.hasClass('active')) {
                                $this.hideColumn(col.field)
                            } else {
                                $this.showColumn(col.field)
                            }
                        });
                    this.$cheakContainer.append($checkBtn);
                    //通过checkbox联动列表修改

                    $checkBtntxtSpan.mousedown(event => {
                        //按下鼠标获取位置
                        let defaultPosition = $checkBtn.offset();
                        let $ClonecheckBtn = $checkBtn.clone();
                        $this.$cheakContainer.append($ClonecheckBtn);
                        $ClonecheckBtn.css({
                            position: 'fixed',
                            left: defaultPosition.left + "px",
                            top: defaultPosition.top + "px",
                            zIndex: 99,
                            border: '1px solid rgb(172, 166, 166)',
                            background: 'rgb(255, 255, 255)',
                            borderRadius: '4px',
                            opacity: '0.8',
                            boxShadow: '0 0 4px #5c5c5c',
                        });
                        $ClonecheckBtn.addClass('clonecheckBtn');
                        // 计算最大可用移动区间
                        let checkBtnMoveLimit = {xmin: 0, xmax: 0, ymin: 0, ymax: 0,};
                        let $cheakContainerOffset = $this.$cheakContainer.offset();
                        checkBtnMoveLimit.xmin = $cheakContainerOffset.left;
                        checkBtnMoveLimit.ymin = $cheakContainerOffset.top;
                        checkBtnMoveLimit.xmax = $this.$cheakContainer.width() - $ClonecheckBtn.width();
                        checkBtnMoveLimit.ymax = $cheakContainerOffset.top - $ClonecheckBtn.height() + $this.$cheakContainer.height();

                        //移动鼠标
                        let lastClientX = event.clientX, lastClientY = event.clientY;
                        $this.$body.mousemove(e => {
                            let xdir = e.clientX - lastClientX;
                            lastClientX = e.clientX;
                            let ydir = e.clientY - lastClientY;
                            lastClientY = e.clientY;
                            let leftadr = $ClonecheckBtn.offset().left + xdir;
                            let topadr = $ClonecheckBtn.offset().top + ydir;
                            leftadr = leftadr < checkBtnMoveLimit.xmin ? checkBtnMoveLimit.xmin : leftadr > checkBtnMoveLimit.xmax ? checkBtnMoveLimit.xmax : leftadr;
                            topadr = topadr < checkBtnMoveLimit.ymin ? checkBtnMoveLimit.ymin : topadr > checkBtnMoveLimit.ymax ? checkBtnMoveLimit.ymax : topadr;
                            $ClonecheckBtn.css({
                                left: leftadr + "px",
                                top: topadr + "px",
                            })
                        });
                        $this.$body.mouseup(e => {
                            // 计算拖动到哪个元素上了
                            let $targetEle;
                            $this.$cheakContainer.find('span.checkEle:not(.clonecheckBtn)').each((e, ele) => {
                                    let $this = $(ele);
                                    // 计算元素的中心点;
                                    let eleLeft = $ClonecheckBtn.offset().left + $ClonecheckBtn.width() / 2;
                                    let eletop = $ClonecheckBtn.offset().top + $ClonecheckBtn.height() / 2;
                                    if ($this.offset().left <= eleLeft && $this.offset().top <= eletop) {
                                        $targetEle = $this;
                                    }
                                }
                            );
                            //备用 判断是不是到最后了
                            // let lastCheckEle=  $this.$cheakContainer.find('span.checkEle:not(.clonecheckBtn):last');
                            // if( $ClonecheckBtn.offset().left > lastCheckEle.offset().left + lastCheckEle.find('.txtSpan').width() + 10 &&
                            //     $ClonecheckBtn.offset().top +    $ClonecheckBtn.height() - 5> lastCheckEle.offset().top
                            // ){
                            //
                            // }
                            if ($targetEle) {
                                $this.changCol($targetEle.attr('field'), $ClonecheckBtn.attr('field'))
                            } else {

                            }

                            $ClonecheckBtn.remove();
                        })
                    });


                    //给每一个td绑定hover事件,表格上直接修改
                    let $gridCell = this.$tableContainer.find(`.datagrid-header-inner td[field=${col.field}] .datagrid-cell`);
                    let $txtSpan = $gridCell.find(`span`).eq(0);
                    $gridCell.hover(mousein, mouseout);

                    function mousein(event) { //鼠标悬停
                        if ($gridCell.find('.colTileEditor').get(0)) {
                            return
                        }
                        event.stopPropagation();
                        let $colTileEditor = $(`<div class="colTileEditor"></div>`), //标题编辑容器
                            $ipt = $(`<input type="text">`),     //输入框
                            $delColBtn = $(`<i class="iconfont icon-yincang delColBtn" field="${col.field}"></i>`);//隐藏按钮
                        $colTileEditor.append($ipt);
                        $gridCell.append($colTileEditor).find('span').hide();
                        $ipt.focus().val($txtSpan.html());
                        $ipt.bind("input propertychange", function (event) {
                            let val = $ipt.val();
                            $checkBtn.find('.txtSpan').html(val);
                            $gridCell.find('span').eq(0).html(val);
                        });
                        $delColBtn.on('mousedown', function (event) {
                            event.stopPropagation();
                            $this.hideColumn(col.field)
                        });
                        $delColBtn.tooltip({
                            position: 'top',
                            content: '隐藏当前列',
                        });

                        //手写拖拽标题编辑容器
                        let addr = $colTileEditor.offset();
                        $colTileEditor.css({
                            left: addr.left + 'px',
                            position: "fixed",
                            top: addr.top + "px",
                            width: $colTileEditor.width(),
                            zIndex: 9999,
                        });
                        // 备用
                        //按下鼠标
                        // let tdArr = [];
                        // $colTileEditor.mousedown(function () {
                        //     $gridCell.hover(mousein, function () {
                        //     });
                        //     $colTileEditor.css({
                        //         'cursor': 'move',
                        //         'background': '#E2EBF4 ',
                        //         'border': '1px solid  #B3C7CD ',
                        //     });
                        //     let ipt = $colTileEditor.find('input');
                        //     ipt.css({
                        //         cursor: 'move',
                        //     });
                        //     let last = 0;
                        //
                        //     // 整理所有可见td的距离;
                        //     tdArr = [];
                        //     document.querySelectorAll(`#${$this.baseData.tableid}datagridBox .datagrid-view2 .datagrid-header td`).forEach(e => {
                        //         let $e = $(e);
                        //         if ($e.attr('field') === 'checkboxTemp') return;
                        //         if ($e.offset().left !== 0) {
                        //             tdArr.push({
                        //                 ele: $e,
                        //                 left: $e.offset().left + $e.width()
                        //             });
                        //         }
                        //     });
                        //
                        //     //计算可用移动距离
                        //     let maxDis = $gridCell.parents('.datagrid-header-row').width() - $gridCell.width() + 30;
                        //     let minDis = 63;
                        //
                        //     //移动鼠标
                        //     $this.$body.mousemove(e => {
                        //         $this.moveing = true;
                        //         if (last === 0) {
                        //             last = e.clientX;
                        //             return;
                        //         }
                        //         let dir = e.clientX - last;
                        //         last = e.clientX;
                        //         let l = $colTileEditor.css('left');
                        //         l = l.replace(/px/g, '');
                        //         let useDir = (l - 0 + dir);
                        //         useDir = useDir < minDis ? minDis : useDir > maxDis ? maxDis : useDir;
                        //         $colTileEditor.css('left', useDir + "px")
                        //     })
                        //
                        // });
                        //
                        // //松开鼠标
                        // $this.$body.mouseup(function (event) {
                        //     $this.$body.unbind('mousemove');
                        //     $this.$body.unbind('mouseup');
                        //     $this.moveing = false;
                        //     $gridCell.hover(mousein, mouseout);
                        //     $colTileEditor.unbind('mousemove');
                        //     $colTileEditor.css({
                        //         cursor: 'default',
                        //     });
                        //     let ipt = $colTileEditor.find('input');
                        //     ipt.css({
                        //         cursor: 'text',
                        //     });
                        //     // 计算在哪个元素上放开的鼠标
                        //     let res;
                        //     tdArr.some(ele => {
                        //         if (event.clientX < ele.left) {
                        //             res = ele;
                        //             return ele
                        //         }
                        //     });
                        //     //找到元素开始换位
                        //     if (res) {
                        //         $this.changCol($(res.ele).attr('field'), col.field)
                        //     }
                        //     $('.colTileEditor').remove();
                        //
                        // })
                    }

                    function mouseout() { //鼠标离开
                        let $colTileEditor = $gridCell.find('.colTileEditor');
                        if (!$this.moveing) {
                            $colTileEditor.remove();
                            $gridCell.find('span:first-child').show();
                            $gridCell.hasClass('datagrid-sort') && $gridCell.find('span').show()
                        }
                    }
                });
            });
            this.$tableContainer.find('.datagrid-view').before(this.$cheakContainer);

        }

        //隐藏编辑器
        hide(keycode) {
            this.active = true;
            this.$cheakContainer.html('');
            this.$tableContainer.find(`.datagrid-cell`).unbind('hover');
            this.$ctrlBtn.removeClass('icon-jiesuo');
            keycode && xyzDataGridSaveFormatToolFunction(d.table, keyCode);
            this.$ctrlBtn.parents('td').tooltip('update', '编辑当前表格');
            this.$tableObj.datagrid('resize')
            let pageParam = window.datagridPageInfo[this.baseData.tableid]
            pageParam.enable = false
            createDatagridPage(this.baseData.tableid, true, pageParam)
        }

        //显示列
        showColumn(col) {
            this.$tableObj.datagrid('showColumn', col);
            let $this= this;
            let olddata = mxApi.clone($this.$tableObj.datagrid('getData'));
            this.$tableObj.datagrid('loadData', {content: olddata.rows, status: 1});
            this.$tableContainer.find(`.checkContainer span[field="${col}"]`)
                .addClass('active')
                .find('.checkEleIcon')
                .addClass('icon-fuxuankuangxuanzhong');
        }

        //隐藏列
        hideColumn(col) {
            this.$tableObj.datagrid('hideColumn', col);
            this.$tableContainer.find(`.checkContainer span[field="${col}"]`)
                .removeClass('active')
                .find('.checkEleIcon')
                .removeClass('icon-fuxuankuangxuanzhong');

        }

        //列换位
        changCol(target, present) {
            if (target === present) {
                return
            }
            //元素换位
            let $presentEle = this.$tableContainer.find(`.datagrid-header-row td[field="${present}"]`),
                $targetEle = this.$tableContainer.find(`.datagrid-header-row td[field="${target}"]`);
            //数据换位
            let $this = this;
            let targetIdx = 0,
                presentObj = {},
                presentObjIdx = 0;
            this.baseData.columns.forEach(columns => {
                columns.forEach(function (e, idx) {
                    if (e.field === present) {
                        presentObj = e;
                        presentObjIdx = idx
                    }
                });
                columns.splice(presentObjIdx, 1);
                columns.forEach(function (e, idx) {
                    if (e.field === target) {
                        targetIdx = idx
                    }
                });
                if (presentObjIdx > targetIdx) {
                    columns.splice(targetIdx, 0, presentObj);
                } else {
                    columns.splice(targetIdx + 1, 0, presentObj);
                }
            });
            let oldData = $this.$tableObj.datagrid('getData');
            $this.$tableObj.datagrid('loadData', {content: oldData.rows, status: 1});
            let ele = $presentEle.clone();
            $presentEle.remove();
            if (presentObjIdx > targetIdx) {
                $targetEle.before(ele);
            } else {
                $targetEle.after(ele);
            }
            ele.find('span:first-child').show();
            ele.find(`div.datagrid-cell`).hasClass('datagrid-sort') && ele.find('span').show();
            this.createCheckboxBox();
        }
    }


    //编辑表格结束


    /*2017.8.29pls数据表格高度自适应*/
    var heightinit = $("#" + d.table).position().top;
    var winHeight = window.parent.document.body.clientHeight; // 2017.9.14更改 获取浏览器的内容高度
    var num = 0;

    $("#" + d.table).datagrid({
        pageNumber: d.pageNumber == undefined ? 1 : d.pageNumber,
        pageSize: d.pageSize == undefined ? 10 : d.pageSize,
        title: d.title,
        sortName: d.sortName == undefined ? '' : d.sortName,
        sortOrder: d.sortOrder == undefined ? '' : d.sortOrder,
        collapsible: d.collapsible == undefined ? true : d.collapsible,//默认有折叠按钮
        collapsed: d.collapsed == undefined ? false : d.collapsed,//定义初始化的时候是否折叠
        url: d.url,
        data: d.data == undefined ? undefined : d.data,
        showFooter: d.showFooter == undefined ? undefined : d.showFooter,
        // autoRowHeight:false,
        view: d.view ? detailview : undefined,
        detailFormatter: d.detailFormatter != undefined ? d.detailFormatter : function (rowIndex, rowData) {
            var tableId = d.table;
            var fields1 = $('#' + tableId).datagrid('getColumnFields', true);
            var fields2 = $('#' + tableId).datagrid('getColumnFields');
            var fields = [];
            for (var i = 0; i < fields1.length; i++) {
                var field = fields1[i];
                var col = $('#' + tableId).datagrid('getColumnOption', field);
                if (col.hidden == true && col.checkbox != true) {
                    fields[fields.length] = field;
                }
            }
            for (var i = 0; i < fields2.length; i++) {
                var field = fields2[i];
                var col = $('#' + tableId).datagrid('getColumnOption', field);
                if (col.hidden == true && col.checkbox != true) {
                    fields[fields.length] = field;
                }
            }

            // 2017/9/18二级表格调整
            var resultStr = "<div class='divTable'><ul class='ulTable'>";
            for (var i = 0; i < fields.length; i++) {
                var field = fields[i];
                var col = $('#' + tableId).datagrid('getColumnOption', field);
                resultStr += "<li><div class='liDivContent1'>" + col.title + "</div><hr><div class='liDivContent2'>";
                resultStr += col.formatter ? col.formatter(rowData[col.field], rowData) : rowData[col.field];
                resultStr += "</div></li>";
            }
            resultStr += "</ul></div>";
            return resultStr;
        },
        onExpandRow: d.onExpandRow != undefined ? d.onExpandRow : undefined,
        toolbar: d.toolbar == undefined ? '' : $.isArray(d.toolbar) ? d.toolbar : "#" + d.toolbar,
        loadFilter: d.loadFilter == undefined ? function (data) {
            if (data.status == 1) {
                if (data.content instanceof Array) {
                    return {total: data.content.length, rows: data.content};
                } else {
                    return data.content;
                }
            } else {
                top.$.messager.alert("<span class='iconfont icon-messagerIcon03'></span>警告", data.msg, "warning");
                return {total: 0, rows: []};
            }
        } : d.loadFilter,
        nowrap: d.nowrap == undefined ? true : d.nowrap,//是否不换行，true不换行
        border: d.border == undefined ? true : d.border,//边框
        height: d.height == undefined ? xyzGetHeight(heightinit) : d.height,//高度
        width: d.width == undefined ? "100%" : d.width,//高度2017.8.11修改
        rowStyler: d.rowStyler == undefined ? undefined : d.rowStyler,//row样式2019.3.12修改
        singleSelect: d.singleSelect == undefined ? true : d.singleSelect,//单选
        fitColumns: d.fitColumns == undefined ? false : d.fitColumns,//自适应
        striped: d.striped == undefined ? false : d.striped,//斑马线
        pagination: d.pagination == undefined ? true : d.pagination,//分页
        pagePosition: d.pagePosition == undefined ? "bottom" : d.pagePosition,//分页条文职
        rownumbers: d.rownumbers == undefined ? true : d.rownumbers,//行号
        checkOnSelect: d.checkOnSelect == undefined ? true : d.checkOnSelect,//点行选框
        selectOnCheck: d.selectOnCheck == undefined ? true : d.selectOnCheck,//点框选行
        pageList: d.pageList == undefined ? [3, 5, 8, 10, 15, 20, 30, 50] : d.pageList,//分页
        idField: d.idField == undefined ? 'numberCode' : d.idField,
        columns: d.columns,
        frozenColumns: d.frozenColumns == undefined ? undefined : d.frozenColumns,//冻结列
        queryParams: d.queryParams == undefined ? undefined : d.queryParams,//查询条件
        onCheck: d.onCheck == undefined ? undefined : d.onCheck,
        onUncheck: d.onUncheck == undefined ? undefined : d.onUncheck,
        onUnselect: d.onUnselect == undefined ? undefined : d.onUnselect,
        onCheckAll: d.onCheckAll == undefined ? undefined : d.onCheckAll,
        onUncheckAll: d.onUncheckAll == undefined ? undefined : d.onUncheckAll,
        onSelectAll: d.onSelectAll == undefined ? undefined : d.onSelectAll,
        onUnselectAll: d.onUnselectAll == undefined ? undefined : d.onUnselectAll,
        onDblClickCell: d.onDblClickCell == undefined ? undefined : d.onDblClickCell,
        onClickCell: d.onClickCell == undefined ? undefined : d.onClickCell,
        /*tools:'#toolsDiv_'+d.table,*/
        onLoadSuccess: function (data) {
            if (self.frameElement.getAttribute('id')) {
                var id = self.frameElement.getAttribute('id');
                if (mxApi.isPc()) {
                    top.mangerLaoding.remove(id.substring(id.indexOf('_') + 1));
                } else {
                    top.progressBar.finish();
                }
            }
            $("#" + d.table).datagrid("options").pagination === true && createDatagridPage(d.table);
            $(".xyzgridMask").remove();
            let $thisTable=$("#"+d.table)
            //先展示全部列
            $thisTable.parent('.datagrid-view').find("table.datagrid-btable tr").show()
//            重新计算高度
            let $rows1=$thisTable.parent('.datagrid-view').find(".datagrid-view1 table.datagrid-btable tr")
            $rows1.each((idx,ele)=>{
                ele.style.height=document.getElementById(ele.id.replace(/-1-/,'-2-')).offsetHeight + "px"
            })

            $("#"+d.table).resize();
            if (d.onLoadSuccess != undefined) {
                      d.onLoadSuccess(data);
            }

        },
        onLoadError: function () {
            $("#" + d.table).datagrid("options").pagination === true && createDatagridPage(d.table, false);
            $(".xyzgridMask").remove();
        },
        onBeforeLoad: function (param) {
            var paramQ = param.q ? JSON.parse(param.q) : {};

            if (paramQ.flagDefaultFastForQuery) {
                if (num > 0) {
                    paramQ.flagDefaultFastForQuery = 'flagDefaultFastForQueryNo';
                    paramQ = JSON.stringify(paramQ);
                    param.q = paramQ;
                }
                num++;
            }

            $("#" + d.table).datagrid("clearChecked");
            $("#" + d.table).datagrid("clearSelections");
            $.each($(' .datagrid-toolbar a[group=' + d.table + '_sanjianke]'), function (i, e) {
                let $tragetEle = $(e).parent();
                let $icon = $tragetEle.find('.datagrid-data-compare-icon')
                $tragetEle.css({
                    'position': 'absolute',
                    'right': ((i * 38 + 16)) + 'px',
                    'background-color': '#F3F3F3',
                    "transform": " translate(2px)"
                }).tooltip({
                    position: 'bottom',
                    content: $icon.attr('title')
                });
                $icon.removeAttr('title')
            });

            // 2019-12-23 给表格的列标签添加title
            var allTarget = $('#' + d.table).datagrid("getPanel").find(".datagrid-view2 .datagrid-htable td")
            for (var i = 0; i < allTarget.length; i++) {
                if(!('detail' in d.columns[0][i])){
                    break;
                    return false
                }
                var detail = d.columns[0][i].detail
                if (!detail){
                   detail = d.columns[0][i].title
                }
                var target = allTarget.eq(i).find('span').eq(0)
                if (target.html() === d.columns[0][i].title) {
                    target.attr("title", detail)
                }
            }

            if (d.data == undefined && Object.keys(param).length !== 0) {
                var loading = "<div class='xyzgridMask'><div class='spinner'><span>加载中</span><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
                $(".xyzgridMask").remove();
                $("#" + d.table).parent().parent().append(loading);
            }
        },
        onSelect: function (rowIndex, rowData) {
            $("input[name='checkboxTemp']").eq(rowIndex).attr("checked", "checked");
            if (rowData.remark != undefined) {
                var span = '';
                if (rowData.remark != '') {
                    span = "<span class='remark-span'>" + rowData.remark + "</span>";
                }
                top.$("#remarkTop").html(span);
            } else {
                top.$("#remarkTop").html('');
            }
            if (!xyzIsNull(d.onSelect)) {
                d.onSelect(rowIndex, rowData);
            }
            floatingWindow();
        },
        onResizeColumn: function (field, width) {		//调整列大小的时候触发

        },
        onSortColumn: function (sort, order) {
            /* 2019.07.10 lmq更改 获取 排序的列和值 */
            var pathName = window.location.host + window.location.pathname;
            var tab = self.frameElement;
            var datagridCn = '#'+tab.id + '_'+pathName+'_'+d.table;
            setLocalSortVal('sort', sort, datagridCn);
            setLocalSortVal('order', order, datagridCn);
        }
    });//datagrid()  end

    /*2017.8.29pls数据表格高度自适应*/
    $(window).resize(function () {
        if ($("#" + d.table).length !== 0) {
            // 当浏览器的内容高度变化时才从新定义数据表格的高度
            if (winHeight != window.parent.document.body.clientHeight) {
                winHeight = window.parent.document.body.clientHeight;
                heightinit = $("#" + d.table).datagrid("getPanel").position().top;
                $("#" + d.table).datagrid("resize", {
                    height: d.height == undefined ? xyzGetHeight(heightinit) : d.height
                });  //加个分号 解决 eclipse 报警告
            }
        }
    });

    //页面变化后，刷新datagrid
    if ((parent.$ && parent.$(".window.easyui-fluid")[0] || $(".window.easyui-fluid")[0]) && (d.width == undefined || d.width == "100%" || d.width == "auto")) {
        if ($("#" + d.table).datagrid("getPanel")[0] && $(".datagridBox")[0]) {
            var t = setInterval(function () {
                if (Boolean(parent.$ && parent.$(".window.easyui-fluid")[0]) == false && Boolean($(".window.easyui-fluid")[0]) == false) {
                    clearInterval(t);
                    return
                }
                var datagridBoxWidth = $(".datagridBox").width();
                var datagridWidth = $("#" + d.table).datagrid("getPanel").width() + 2;
                if (datagridBoxWidth != datagridWidth) {
                    $("#" + d.table).datagrid("resize");
                }
            }, 50)
        }
    }

    return $("#" + d.table);
};
//设置本地用户信息
function setLocalSortVal(key, value, name) {
    if (localStorage.sortVal) {
        let array = JSON.parse(localStorage.sortVal), unfind = true;
        array.some(e => {
            if (name && e.datagridCn === name) {
                e[key] = value;
                unfind = false;
                return true
            }
        });
        if (unfind) {
            array[array.length] = {
                datagridCn: name,
            };
            array[array.length - 1][key] = value
        }
        localStorage.sortVal = JSON.stringify(array)
    } else {
        let obj = [{
            datagridCn: name,
        }];
        obj[0][key] = value;
        localStorage.sortVal = JSON.stringify(obj)
    }
}

//获取本地用户信息
function getLocalSortVal(key, name) {
    let str = null;
    if (localStorage.sortVal) {
        let array = JSON.parse(localStorage.sortVal);
        array.some(e => {
            if (name && e.datagridCn === name) {
                str = e[key];
                return true
            }
        })
    }
    return str
}

function xyzGetHeight(height) {
    var heightT = $(window).height();
    var zoomValue = $("body").css('zoom');
    if (!mxApi.isPc()) {
        zoomValue = $(".datagridBox").css('zoom');
        if (zoomValue && zoomValue < 1) {
            heightT = heightT / zoomValue;
            height = height + 42;
        }
    } else {
        if (zoomValue && zoomValue < 1) {
            heightT = heightT / zoomValue
        }
    }

    return heightT - height;
}

// datagrid表格对比信息
(function () {
    var datagridCompare = function (tableId) {
        this.id = tableId;
        this.slide_y = 0; // 滚动条偏移量
        this.wrap_y = 0; // 容器偏移量wrap-content
        this.slide_max_y = 0; // 最大偏移量
        this.wrap_max_y = 0;
        this.datas = [];

        var _this = this;
        this.render = function (_data) {
            this.datas = _data || $('#' + this.id).datagrid('getSelections').concat();
            if (this.datas.length === 0) return top.$.messager.alert("提示", "至少选择一条数据", "info");
            if (this.datas.length > 3) return top.$.messager.alert("提示", "最多只能选择三条数据", "info");
            var title = this.datas.length === 1 ? '详细信息' : '对比信息';
            if ($('.datagrid-data-compare')) $('.datagrid-data-compare').remove();
            var tem = '<div class="datagrid-data-compare"><div class="compare-box">' +
                '<div class="header">' +
                '<span>' + title + '</span>' +
                '<i class="iconfont icon-toolClose"></i>' +
                '</div>' +
                '<div class="data-wrap""><ul></ul></div>' +
                '<div class="slider-wrap"><div style="position: relative;"><span class="slider"></span></div></div>' +
                '</div></div>';
            $('body').append(tem);
            this.update();
            this.addEvent();
        }
        this.update = function () {
            var datas = this.datas,
                _id = this.id;
            var ul_box = $('.datagrid-data-compare .data-wrap ul');
            ul_box.empty();
            var column_config = $('#' + _id).datagrid('options').columns[0];
            column_config.forEach(function (val, inx) { // 获取数据key
                var counts = datas.length;
                $('.datagrid-data-compare .compare-box').width(counts * 250 + 140)

                var html = '',
                    btn_str = '',
                    info_str = '';
                val.title = val.title || '';
                for (var i = 0; i < counts; i++) {
                    if (inx === 0 && val.title.match(/id="checkAll"/) === null && counts > 1) btn_str = '<span class="iconfont icon-close-b delete-icon" index="' + i + '"></span>';
                    if (inx === 1 && column_config[0].title.match(/id="checkAll"/) !== null && counts > 1) btn_str = '<span class="iconfont icon-close-b delete-icon" index="' + i + '"></span>';

                    var className = 'content content' + i;
                    var __index = $('#' + _id).datagrid('getRowIndex', datas[i]);
                    var con_str = val.title.match(/id="checkAll"/) !== null ? '' : (val.formatter ? val.formatter(datas[i][val.field], datas[i], __index) : datas[i][val.field]);
                    info_str += (con_str == undefined ? '<div class="' + className + '">' + btn_str + '</div><div class="line"></div>' : '<div class="' + className + '">' + con_str + btn_str + '</div><div class="line"></div>');
                }
                html = val.title.match(/id="checkAll"/) === null ? '<li><div class="wrap-title">' + val.title + '</div><div class="wrap-content">' + info_str + '</div></li>' : '';
                ul_box.append(html);
            });
            $('#' + _id).datagrid('options').onLoadSuccess($('#' + _id).datagrid('getData'));
            this.update_scroll();
        }
        this.removeItem = function (index) {
            this.datas.splice(index, 1);
            this.render(this.datas);
        }
        this.update_scroll = function () {
            // 根据弹窗最大高度，设置滚动容器及滚动条高度
            var box_height = $('.datagrid-data-compare .compare-box').css('maxHeight') + '';
            var max_height = (box_height.indexOf('%') > -1 ? box_height.slice(0, -1) / 100 * $('.datagrid-data-compare').height() : box_height.slice(0, -2) / 1) - 130;
            $('.datagrid-data-compare .compare-box .slider-wrap').height(max_height);
            $('.datagrid-data-compare .compare-box .data-wrap').height(max_height);
            if ($('.datagrid-data-compare .data-wrap > ul').height() > max_height) {
                $('.datagrid-data-compare .data-wrap').height(max_height);
                $('.datagrid-data-compare .slider-wrap').show();
                //设置滑块的高度
                var h = max_height * max_height / $('.datagrid-data-compare .data-wrap > ul').height();
                $('.datagrid-data-compare .slider-wrap .slider').height(h < 50 ? 50 : h)
            } else {
                $('.data-wrap').height($('.data-wrap > ul').height());
                $('.slider-wrap').hide();
                $('.data-wrap > ul > li').width($('.data-wrap').width())
                return;
            }
            this.slide_max_y = max_height - $('.datagrid-data-compare .slider-wrap .slider').height();
            this.wrap_max_y = $('.datagrid-data-compare .data-wrap > ul').height() - max_height;
            /*监听鼠标滚动事件
            * 1.火狐的是：DOMMouseScroll;
            * 2.IE/Opera/Chrome：直接添加事件*/
            if (document.addEventListener) { //W3C
                document.querySelector('.datagrid-data-compare').addEventListener('DOMMouseScroll', this.scrollFunc, false);
            }
            document.querySelector('.datagrid-data-compare').addEventListener('mousewheel', this.scrollFunc, false);//IE/Opera/Chrome
            // 鼠标拖动滚动条
            $('.datagrid-data-compare .slider-wrap .slider').on('mousedown', function (e) {
                e = e || window.event;
                // 保存滚动初始y坐标和滑块位置
                _this.start_pos_y = e.pageY;
                _this.start_top = _this.slide_y;
                document.addEventListener('mousemove', _this.handle, false);
                document.addEventListener('mouseup', function () {
                    document.removeEventListener('mousemove', _this.handle, false);
                })
            })
        }
        // 鼠标拖动滚动条 事件
        this.handle = function (e) {
            e = e || window.event;
            var val = _this.start_top + e.pageY - _this.start_pos_y;
            _this.clearSelect();
            _this.slide_y = val >= 0 ? (val <= _this.slide_max_y ? val : _this.slide_max_y) : 0;
            // 更新位置
            _this.wrap_y = _this.slide_y * _this.wrap_max_y / _this.slide_max_y;
            $('.datagrid-data-compare .slider-wrap .slider').css('top', _this.slide_y);
            $('.datagrid-data-compare .data-wrap > ul').css('top', -_this.wrap_y);
        }
        // 滚轮 事件
        this.scrollFunc = function (e) {
            e = e || window.event;
            // 阻止系统默认的行为
            e.preventDefault();
            if (e.wheelDelta) {//IE/Opera/Chrome
                //自定义事件：编写具体的实现逻辑
                _this.slide_y = e.wheelDelta > 0 ? _this.slide_y - 10 : _this.slide_y + 10;
            } else if (e.detail) {//Firefox
                _this.slide_y = e.detail < 0 ? _this.slide_y - 10 : _this.slide_y + 10;
            }
            // 极端条件判断
            _this.slide_y = _this.slide_y <= 0 ? 0 : _this.slide_y;
            _this.slide_y = _this.slide_y >= _this.slide_max_y ? _this.slide_max_y : _this.slide_y;
            // 更新位置
            _this.wrap_y = _this.slide_y * _this.wrap_max_y / _this.slide_max_y;
            $('.datagrid-data-compare .slider-wrap .slider').css('top', _this.slide_y);
            $('.datagrid-data-compare .data-wrap > ul').css('top', -_this.wrap_y);
        }
        // 拖动过程中禁止选中
        this.clearSelect = function () {
            if (window.getSelection) {
                // 获取选中
                var selection = window.getSelection();
                // 清除选中
                selection.removeAllRanges();
            } else if (document.selection && document.selection.empty) {
                // 兼容 IE8 以下，但 IE9+ 以上同样可用
                document.selection.empty();
                // 或使用 clear() 方法
                // document.selection.clear();
            }
        }
        this.addEvent = function () {
            // 关闭 --- btn
            $('.datagrid-data-compare .header i').on('click', function () {
                $('.datagrid-data-compare').remove()
            })
            $('.datagrid-data-compare .delete-icon').off().on('click', function () {
                _this.removeItem($(this).attr('index'));
            })
            window.onresize = function (ev) {
                _this.update_scroll()
            }
        }
        this.render();
    }

    window.datagridCompare = function (tableId) {
        new datagridCompare(tableId);
    }
})();
// datagrid表格分页
(function () {
    var create = function (id, status, pageParam) {
        var _this = this;
        _this.id = id;
        _this.status = status;
        _this.pageParam = pageParam || {};
        _this.showcount = mxApi.isPc() ? 5 : 1;
        var _table = $("#" + _this.id);
        _this.render = function () {
            this.el.find('.datagrid-pagination').remove();
            var page = $('' +
                '<div class="datagrid-pagination custom-table-pagination">' +
                '   <form action="javascript:return false;" class="pagination-content">' +
                (mxApi.isPc() ? '           <div class="blank"></div>' : '') +
                '       <div class="search-list">' +
                '           <span class="page-total"></span>' +
                '           <i class="iconfont icon-spinnerArrowDown"></i>' +
                '       </div>' +
                '       <div class="totalpages"></div>' +
                '       <div class="pages">' +
                (mxApi.isPc() ? '           <i class="pa-first iconfont icon-zuiqianyema"></i>' : '') +
                '           <i class="pa-prev iconfont icon-shangyiyeyema"></i>' +
                '           <div class="selectlist"></div>' +
                '           <i class="pa-next iconfont icon-xiayiyeyema"></i>' +
                (mxApi.isPc() ? '           <i class="pa-last iconfont icon-zuihouyema"></i>' : '') +
                '       </div>' +
                '       <div class="searchpage">第<input maxlength="4" type="number">页</div>' +
                '       <div class="reflash">' +
                (mxApi.isPc() ? '           <span class="btn-go">跳转</span>' : '') +
                '           <span class="btn-refresh iconfont icon-shuaxin1"></span>' +
                (mxApi.isPc() ? '           <span class="message"></span>' : '') +
                '       </div>' +
                '   </form>' +
                '   <div class="pagination-info"></div>' +
                '</div>');
            this.el.find('.datagrid-pager').html('');
            let _obj = window.datagridPageInfo && window.datagridPageInfo[_this.id] ? window.datagridPageInfo[_this.id] : {}
            if (_obj.enable) return; // 在编辑列时  不渲染分页
            this.el.find('.datagrid-pager').append(page);

            for (var i = 0; i < this.showcount; i++) {
                var $sp = '<span>' + (i + 1) + '</span>';
                this.el.find('.datagrid-pagination .selectlist').append($sp);
            }
            var $UL = $('<ul></ul>');
            this.pageList.forEach(function (_val) {
                $UL.append('<li>' + _val + '</li>');
                _val === _this.rows && _this.el.find('.page-total').html(_val)
            });
            this.el.find('.datagrid-pagination .search-list').append($UL);
            this.updatePagination();
            this.addEvents();
        };
        _this.addEvents = function () {
            // 每页显示条数
            _this.el.find('.datagrid-pagination .search-list').on('click', function (e) {
                // 没有数据时，点击无效
                var options = _table.datagrid("options");
                var contents = _table.datagrid("getData");
                var totals = contents.total || 0;
                if (totals === 0) return;
                e.preventDefault();
                var ch_i = $(this).children('i');
                if (e.target.tagName === 'LI') {
                    var counts = Number($(e.target).html());
                    _this.rows = counts;
                    var maxPage = totals % counts !== 0 ? Math.floor(totals / counts) + 1 : totals / counts;
                    // _this.selectPage(options.pageNumber > maxPage ? maxPage : options.pageNumber)
                    options.pageSize = counts;
                    options.pageNumber = options.pageNumber > maxPage ? maxPage : options.pageNumber;
                    $("#" + _this.id).datagrid(options);
                    // 更新视图
                    _this.el.find('.datagrid-pagination .page-total').html(counts);
                    ch_i.attr('class', 'iconfont icon-spinnerArrowDown');
                    $(this).children('ul').hide()
                } else {
                    if (ch_i.hasClass('icon-spinnerArrowDown')) {
                        ch_i.attr('class', 'iconfont icon-spinnerArrowUp');
                        $(this).children('ul').show()
                    } else {
                        ch_i.attr('class', 'iconfont icon-spinnerArrowDown');
                        $(this).children('ul').hide()
                    }
                }
            });
            // 前后，首尾页 图标
            _this.el.find('.pages i').on('click', function () {
                var options = _table.datagrid("options");
                var contents = _table.datagrid("getData");
                var totals = contents.total || 0;
                var counts = options.pageSize;
                var maxPage = totals % counts !== 0 ? Math.floor(totals / counts) + 1 : totals / counts;
                if ($(this).attr('disabled')) return;
                var type = $(this).attr('class').split(' ')[0];
                switch (type) {
                    case 'pa-first':
                        _this.selectPage(1);
                        break;
                    case 'pa-last':
                        _this.selectPage(maxPage);
                        break;
                    case 'pa-prev':
                        _this.page = _this.page === 1 ? 1 : _this.page - 1;
                        _this.selectPage(_this.page);
                        break;
                    case 'pa-next':
                        _this.page = _this.page === maxPage ? maxPage : _this.page + 1;
                        _this.selectPage(_this.page);
                        break;
                }
            });
            // 选择具体页数
            _this.el.find('.datagrid-pagination .pages span').on('click', function () {
                if ($(this).hasClass('active')) return;
                _this.el.find('.datagrid-pagination .pages span.active').removeClass('active');
                $(this).addClass('active');
                _this.selectPage(Number($(this).html()))
            });
            // 输入页数
            _this.el.find('.searchpage input').on('input', function () {
                var contents = _table.datagrid("getData");
                var options = _table.datagrid("options");
                var totals = contents.total || 0;
                var counts = options.pageSize;
                var maxPage = totals % counts !== 0 ? Math.floor(totals / counts) + 1 : totals / counts;
                var _val = $(this).val().replace(/\D/g, '');
                _val = _val > maxPage ? maxPage : (_val < 1 && _val !== '' ? 1 : _val);
                maxPage === 0 && (_val = '');
                $(this).val(_val)
            });
            _this.el.find('.searchpage input').on('keydown', function (event) {
                if (event.keyCode === 13 && $(this).val() !== '') {
                    _this.selectPage($(this).val())
                }
                if (!mxApi.isPc() && event.keyCode === 9 && $(this).val() !== '') {
                    _this.selectPage($(this).val())
                }
            });
            // 跳转按钮
            _this.el.find('.btn-go').on('click', function () {
                var _val = _this.el.find('.datagrid-pagination .searchpage input').val();
                if (_val === '') {
                    return;
                }
                _this.selectPage(Number(_val))
            });
            // 刷新按钮
            _this.el.find('.pagination-content .reflash').on('click', function () {
                var contents = _table.datagrid("getData");
                var totals = contents.total || 0;
                _this.selectPage(totals === 0 ? 1 : _this.page);
            })
        };
        _this.updatePagination = function () {
            var contents = _table.datagrid("getData");
            var options = _table.datagrid("options");
            var totals = _this.pageParam.total || contents.total || 0;
            var counts = options.pageSize;
            var maxPage = totals % counts !== 0 ? Math.floor(totals / counts) + 1 : totals / counts;
            _this.page = _this.page < 1 ? 1 : (_this.page > maxPage ? maxPage : _this.page);
            _this.el.find('.datagrid-pagination .totalpages').html('共' + maxPage + '页');

            // 加载 可选页列表
            var order = _this.page % _this.showcount !== 0 ? Math.floor(_this.page / _this.showcount) : (_this.page / _this.showcount) - 1;
            order = order < 0 ? 0 : order;
            _this.el.find('.datagrid-pagination .selectlist span.active').removeClass('active');
            for (var i = 0; i < _this.showcount; i++) {
                var con = order * _this.showcount + i + 1;
                var _span = _this.el.find('.datagrid-pagination .selectlist span').eq(i);
                _this.page === con && _span.addClass('active');
                con <= maxPage ? _span.html(con).css('display', 'inline-block') : _span.html(con).hide();
            }
            // 渲染图标
            _this.el.find('.datagrid-pagination .pages i.pa-first').attr('disabled', _this.page === 1 || totals === 0);
            _this.el.find('.datagrid-pagination .pages i.pa-prev').attr('disabled', _this.page === 1 || totals === 0);
            _this.el.find('.datagrid-pagination .pages i.pa-next').attr('disabled', _this.page === maxPage);
            _this.el.find('.datagrid-pagination .pages i.pa-last').attr('disabled', _this.page === maxPage);
            // 数据信息
            var _pa = _this.page - 1,
                startCount = _pa * counts + 1,
                endCount = (_pa + 1) * counts <= totals ? (_pa + 1) * counts : totals;
            var msg = totals === 0 || !mxApi.isPc() ? '共' + totals + '记录' : '显示' + startCount + '到' + endCount + '，共' + totals + '记录';
            _this.el.find('.datagrid-pagination .pagination-info').html(msg);
        };
        _this.selectPage = function (page) {
            var _this = this;
            _this.page = page ? Number(page) : _this.page;

            _this.el.find('.searchpage input').val('');
            $("#" + this.id).datagrid("gotoPage", {page: _this.page});
            // this.showMessage('加载中...', 1);
            // 调用table loading
            if (mxApi.isPc()) {
                var loading = "<div class='xyzgridMask'><div class='spinner'><span>加载中</span><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
                $(".xyzgridMask").remove();
                this.el.append(loading);
            } else {
                if (top && top.progressBar) {
                    top.progressBar.begin();
                }
            }
        };
        _this.init(status);
    };
    create.prototype.init = function () {
        var _this = this;
        var _table = $("#" + _this.id);
        if (!_table || !_table.parents('.datagrid-wrap')) return;
        this.el = _table.parents('.datagrid-wrap').eq(0);
        // 清除easyUi原生分页，保留.datagrid-pager元素，避免再次渲染表格 高度不对
        this.el.find('.datagrid-pager table').remove();

        // if(this.status === false){ // 加载失败
        //     return this.showMessage('加载失败', 0);
        // }
        var options = _table.datagrid("options");
        // this.showMessage('加载成功', 0);
        _this.page = options.pageNumber || 1;
        _this.page = _this.page < 1 ? 1 : _this.page;
        _this.rows = options.pageSize || 10;
        _this.pageList = options.pageList || [3, 5, 10, 15, 20, 30, 50];
        _this.render()
    };
    /**
     * @method showMessage  pagenation
     * @param msg：string 显示文本  type: 0 2.5s后自动隐藏  1: 一直显示，不隐藏
     * @return {}
     */
    create.prototype.showMessage = function (msg, type) {
        var _this = this;
        clearTimeout(_this.timeco);
        _this.el.find('.message').removeClass('trans-ani');
        var className = type === 1 ? '' : 'trans-ani';
        _this.el.find('.message').html(msg).addClass(className);
        type === 1 && (_this.timeco = setTimeout(function () {
            _this.el.find('.message').html('');
        }, 2500))
    };
    /**
     * @method createDatagridPage
     * @param {id: String} datagrid table id
     * @param {status: Bollean} 加载状态，成功or失败
     * @param {pageParam: Object} 分页相关参数，包含字段 total：总条数
     * @return {}
     */
    window.createDatagridPage = function (id, status, pageParam) {
        new create(id, status, pageParam)
    };
})();

//cgrid end
/**************************************remark悬浮框*********************************************/
function floatingWindow(el) {
    var $remarkList, $tipBox;
    $remarkList = el ? top.$(el + " span.remark-span") : top.$("span.remark-span");
    $remarkList.each(function () {
        if ($(this).attr('data-title')) {
            $(this).on('mouseenter', function (e) {
                var width = el ? top.$(el + " #remarkTop").width() : top.$("#remarkTop").width();
                var e = e || event;
                var y = e.clientY, offsetY = e.offsetY;
                if (top.$("#remarkTitleTips").length < 1) {
                    var tipBox = '<div id="remarkTitleTips" style="width: ' + width + 'px;">' + $(this).attr('data-title') + '<div></div></div>';
                    top.$("body").append(tipBox);
                }
                $tipBox = top.$("#remarkTitleTips");
                var remarkTitleHeight = top.$(".remarktitle").height();
                var height = $tipBox.height();
                var tipsTop = y - height - offsetY;
                if (tipsTop >= remarkTitleHeight * 2) {
                    top.$("#remarkTitleTips>div").removeClass("remarkTitleTipsDown").addClass("remarkTitleTipsUp");
                    if (top.window.maiframeInfo.versions == "2.0") {
                        $tipBox.fadeIn(300).css({
                            right: 20,
                            top: tipsTop - 20
                        });
                    } else {
                        $tipBox.fadeIn(300).css({
                            right: 20,
                            top: tipsTop - 20
                        });
                    }
                } else {
                    top.$("#remarkTitleTips>div").removeClass("remarkTitleTipsUp").addClass("remarkTitleTipsDown");
                    tipsTop = y + $(this).height() + 28 - offsetY;
                    if (top.window.maiframeInfo.versions == "2.0") {
                        $tipBox.fadeIn(300).css({
                            right: 20,
                            top: tipsTop - 20
                        });
                    } else {
                        $tipBox.fadeIn(300).css({
                            right: 20,
                            top: tipsTop - 20
                        });
                    }
                }
            })
                .on('mouseleave', function (e) {
                    top.$("#remarkTitleTips").remove();
                });
        }
    });
}

// small  300  400
// big  450  600
// large  600  800
// max 800 1200
function xyzdialog(d) {
    $("body").append("<div id='" + d.dialog + "'></div>");
    var height, width;
    // d.fit = d.width > 1200 ? true : false;
    if (!d.fit && d.title != "进度") {
        var total = d.height + d.width;
        if (total <= 700) {
            height = 400;
            width = 460;
        } else if (700 < total && total <= 1050) {
            height = 550;
            width = 660;
        } else if (1050 < total && total <= 1400) {
            height = 700;
            width = 860;
        } else {
            height = 850;
            width = 1260;
        }
    }
    if (d.title != "进度") {
        if (parent.$(".window")[0] || $(".window")[0]) {
            if ($("body").width() > (parent.$(".window").width() || $(".window").width()) && (d.fit == undefined || d.fit == true)) {
                $("body").removeClass("iframeBodyMinwidth");
            }
            window.onresize = function () {
                if ($("body").width() > (parent.$(".window").width() || $(".window").width()) && (d.fit == undefined || d.fit == true)) {
                    $("body").removeClass("iframeBodyMinwidth");
                }
            }
        }
    }
    height = height > $(window).height() - 40 ? $(window).height() - 40 : height - 12;
    width = width > $(window).width() - 20 ? $(window).width() - 20 : width;
    var isIframe = false;
    var content = d.content == undefined ? undefined : d.content;
    if (d.content == undefined && d.href == undefined && !xyzIsNull(d.iframeUrl)) {
        isIframe = true;
        content = "<iframe id='" + d.dialog + "Iframe' frameborder='0'></iframe>";
        //检查当前页面是否需要做远程跨项目读取，若需要，就在接下来的页面请求中挂上远程应用的ID，配合MySystemFilter使用
        var params = getUrlParameters();
        var _remoteAppId = (params && params['_remoteAppId']) ? params['_remoteAppId'] : '';
        if (_remoteAppId) {
            d.iframeUrl = d.iframeUrl + (d.iframeUrl.indexOf('?') > -1 ? '&' : '?');
            d.iframeUrl = d.iframeUrl + '_remoteAppId=' + _remoteAppId;
        }
    }

    $("#" + d.dialog).dialog({
        title: d.title == undefined ? '对话框' : d.title,
        id: d.id == undefined ? undefined : d.id,
        headerCls: d.headerCls == undefined ? undefined : d.headerCls,
        bodyCls: d.bodyCls == undefined ? undefined : d.bodyCls,
        height: height,
        width: width,
        modal: d.modal == undefined ? true : d.modal,//锁住当前页面
        closable: d.closable == undefined ? false : d.closable,//关
        cache: d.cache == undefined ? false : d.cache,//缓存
        fit: d.fit == undefined ? true : d.fit,//全屏
        href: d.href == undefined ? undefined : d.href,
        content: content,
        buttons: d.buttons == undefined ? undefined : d.buttons,
        onLoad: d.onLoad == undefined ? undefined : d.onLoad,
        onOpen: d.onOpen == undefined ? undefined : d.onOpen,
        onClose: d.onClose == undefined ? undefined : d.onClose,
        onDestroy: d.onDestroy == undefined ? undefined : d.onDestroy,
        resizable: d.resizable == undefined ? false : d.resizable,
        draggable: d.draggable == undefined ? false : d.draggable
    });
    //set center
    // if (d.center != undefined || d.center == true) {
    //     $("#" + d.dialog).dialog("center");
    // }
    $("#" + d.dialog).dialog("center");

    if (isIframe) {
        $("#" + d.dialog + "Iframe").css({"width": "100%"});
        $("#" + d.dialog + "Iframe").css({"height": "100%"});
        $("#" + d.dialog + "Iframe").attr("src", d.iframeUrl);
    }
};//cdialog end

/*
 * combobox必须
 * url必须
 * lazy可选:延迟加载,默认延迟
 * valueField可选
 * textField可选
 */
function xyzCombobox(c) {
    var xyzComboboxData = {};
    xyzComboboxData.groupField = c.groupField == undefined ? 'group' : c.groupField;
    xyzComboboxData.valueField = c.valueField == undefined ? 'value' : c.valueField;
    xyzComboboxData.textField = c.textField == undefined ? 'text' : c.textField;
    xyzComboboxData.loadFilter = function (data) {
        if (data instanceof Array) {
            return data;
        } else {
            if (data.status == 1) {
                return data.content;
            } else {
                return [];
            }
            ;
        }
        ;
    };

    xyzComboboxData.onShowPanel = c.onShowPanel == undefined ? undefined : c.onShowPanel;
    var xyzComboboxLazy = c.lazy == undefined ? true : c.lazy;
    if (c.url) {
        xyzComboboxData.url = xyzComboboxLazy ? '' : xyzGetFullUrl(c.url);
    }

    if (c.mode == 'remote') {
        xyzComboboxData.onShowPanel = function () {
            $(this).next().addClass("now");
            initShowPanelsroll($('#' + c.combobox));
            if (c.url) {
                $('#' + c.combobox).combobox("reload", xyzGetFullUrl(c.url));
            }

            if (c.onShowPanel != undefined) {
                c.onShowPanel();
            }
        };
        /* xyzComboboxData.onClickIcon = function(index){ //曾经的remote设置
             var ttps = $('#'+c.combobox).combobox("getIcon",index).attr("class");
             if(ttps.indexOf("combo-arrow")>-1){
                 $('#'+c.combobox).combobox("reload",xyzGetFullUrl(c.url));
             };
         };*/
    } else {
        xyzComboboxData.onShowPanel = function () {
            $(this).next().addClass("now");
            initShowPanelsroll($('#' + c.combobox));
            if (c.url) {
                if ($('#' + c.combobox).combobox("getData").length == 0) {
                    $('#' + c.combobox).combobox("reload", xyzGetFullUrl(c.url));
                }
            }

            if (c.onShowPanel != undefined) {
                c.onShowPanel();
            }
        };
    }


    xyzComboboxData.onBeforeLoad = c.onBeforeLoad == undefined ? undefined : c.onBeforeLoad;
    xyzComboboxData.onLoadSuccess = function (data) {
        initShowPanelsroll($('#' + c.combobox));
        if (typeof c.onLoadSuccess == 'function') {
            c.onLoadSuccess(data);
        }
    };
    xyzComboboxData.width = c.width == undefined ? undefined : c.width;
    xyzComboboxData.height = c.height == undefined ? undefined : c.height;
    xyzComboboxData.queryParams = c.queryParams == undefined ? undefined : c.queryParams;
    xyzComboboxData.data = c.data == undefined ? undefined : c.data;
    xyzComboboxData.onSelect = c.onSelect == undefined ? function () {
    } : c.onSelect;
    xyzComboboxData.onClick = c.onClick == undefined ? undefined : c.onClick;
    xyzComboboxData.onChange = c.onChange == undefined ? undefined : c.onChange;
    xyzComboboxData.onHidePanel = c.onHidePanel == undefined ? undefined : c.onHidePanel;
    xyzComboboxData.required = c.required == undefined ? false : c.required;
    xyzComboboxData.editable = c.editable == undefined ? true : c.editable;
    xyzComboboxData.multiple = c.multiple == undefined ? false : c.multiple;
    xyzComboboxData.disabled = c.disabled == undefined ? false : c.disabled;
    xyzComboboxData.readonly = c.readonly == undefined ? false : c.readonly;
    xyzComboboxData.limitToList = c.limitToList == undefined ? true : c.limitToList;
    xyzComboboxData.mode = c.mode == undefined ? 'local' : c.mode;
    xyzComboboxData.icons = c.icons == undefined ? undefined : c.icons;
    xyzComboboxData.panelWidth = c.panelWidth == undefined ? undefined : c.panelWidth;
    xyzComboboxData.panelHeight = c.panelHeight == undefined ? 'auto' : c.panelHeight;
    xyzComboboxData.panelMaxHeight = c.panelMaxHeight == undefined ? 500 : c.panelMaxHeight;
    xyzComboboxData.value = c.value == undefined ? '' : c.value;
    xyzComboboxData.delay = c.delay == undefined ? 200 : c.delay;
    xyzComboboxData.icons = c.icons == undefined ? [{
        iconCls: 'iconfont icon-clear',
        handler: function (e) {
            $(e.data.target).combobox('clear');
            $(e.currentTarget.nextElementSibling).focus();
        }
    }] : c.icons;
    xyzComboboxData.formatter = c.formatter == undefined ? undefined : c.formatter;
    $('#' + c.combobox).combobox(xyzComboboxData);
}

function xyzTextbox(id) {
    $("#" + id).textbox({
        icons: [{
            iconCls: 'iconfont icon-clear',
            handler: function (e) {
                $(e.data.target).textbox('setValue', '');
                $(e.currentTarget.nextElementSibling).focus();
            }
        }]
    });
}

$.extend($.fn.validatebox.defaults.rules, {
    trim: {
        validator: function (value, param) {
            if (param[0] == true) {
                if (/(^\s+)|(\s+$)/.test(value)) {
                    return false;
                }
            }
            return true;
        },
        message: '请删除前后空白'
    }
});

function xyzGetCurrentRow(table, field, value) {
    var rows = $("#" + table).datagrid("getRows");
    var rowT = [];
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        if (row[field] == value) {
            rowT [rowT.length] = row;
        }
    }
    if (rowT.length != 1) {
        return null;
    } else {
        return rowT[0];
    }
}

function xyzAddComboboxRow(div, record) {
    var dataT = $("#" + div).combobox("getData");
    dataT.splice(0, 0, record);
    $("#" + div).combobox("loadData", dataT);
}

function xyzDeleteComboboxRow(div, value) {
    var dataT = $("#" + div).combobox("getData");
    var dataN = [];
    for (var ppp in dataT) {
        if (dataT[ppp].value != value) {
            dataN[dataN.length] = dataT[ppp];
        }
    }
    $("#" + div).combobox("loadData", dataN);
}

function xyzOnChangeGetText(div, value) {
    var result = "";
    var dataT = $("#" + div).combobox("getData");
    for (var ppp in dataT) {
        if (dataT[ppp].value == value) {
            result = dataT[ppp].text;
        }
    }
    return result;
}

function xyzDataGridShowCellToolFunction(tableId, onXyzResizeCell) {
    //window.event适用于IE chrome 内核的浏览器 arguments.callee.caller.arguments[0]适用于FF
    var e = window.event || arguments.callee.caller.arguments[0];
    //e.pageX适用于FF chrome 内核的浏览器 e.x适用于IE
    var pageX = e.pageX || e.x;
    var pageY = e.pageY || e.y;

    if ($('#columnMenuAdd_' + tableId).attr("id")) {
        $('#columnMenuAdd_' + tableId).menu("destroy");
    }
    $('body').append('<div id="columnMenuAdd_' + tableId + '"/>');
    var cmenu = $('#columnMenuAdd_' + tableId);
    cmenu.menu({
        onClick: function (item) {
            var $table = $('#' + tableId)
            $table.datagrid('showColumn', item.name);
            cmenu.menu("destroy");
            if (typeof onXyzResizeCell == 'function') {
                onXyzResizeCell();
            }
            $table.datagrid('resize');
        }
    });
    var fields = $('#' + tableId).datagrid('getColumnFields', true);
    var fields2 = $('#' + tableId).datagrid('getColumnFields');
    for (var p = 0; p < fields2.length; p++) {
        fields[fields.length] = fields2[p];
    }
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var col = $('#' + tableId).datagrid('getColumnOption', field);
        if (col.hidden == true && !xyzIsNull(col.title)) {
            cmenu.menu('appendItem', {
                text: col.title,
                name: field,
                iconCls: 'iconfont icon-empty'
            });
        }
    }
    $('#columnMenuAdd_' + tableId).menu('show', {
        left: pageX,
        top: pageY
    });
}

function xyzDataGridHideCellToolFunction(tableId, onXyzResizeCell) {
    //window.event适用于IE chrome 内核的浏览器 arguments.callee.caller.arguments[0]适用于FF
    var e = window.event || arguments.callee.caller.arguments[0];
    //e.pageX适用于FF chrome 内核的浏览器 e.x适用于IE
    var pageX = e.pageX || e.x;
    var pageY = e.pageY || e.y;

    if ($('#columnMenuSub_' + tableId).attr("id")) {
        $('#columnMenuSub_' + tableId).menu("destroy");
    }
    $('body').append('<div id="columnMenuSub_' + tableId + '"/>');
    var cmenu = $('#columnMenuSub_' + tableId);
    cmenu.menu({
        onClick: function (item) {
            var $table = $('#' + tableId)
            $table.datagrid('hideColumn', item.name);
            cmenu.menu("destroy");
            if (typeof onXyzResizeCell == 'function') {
                onXyzResizeCell();
            }
            $table.datagrid('resize');
        }
    });
    var fields = $('#' + tableId).datagrid('getColumnFields', true);
    var fields2 = $('#' + tableId).datagrid('getColumnFields');
    for (var p = 0; p < fields2.length; p++) {
        fields[fields.length] = fields2[p];
    }
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var col = $('#' + tableId).datagrid('getColumnOption', field);
        if (col.hidden != true && !xyzIsNull(col.title)) {
            cmenu.menu('appendItem', {
                text: col.title,
                name: field,
                iconCls: 'iconfont icon-ok'
            });
        }
    }
    $('#columnMenuSub_' + tableId).menu('show', {
        left: pageX,
        top: pageY
    });
}

function DataGridBackDefaultToolFunction(tableId, keyCode) {

    customEasyuiConfirm({
        ok: '恢复',
        cancel: '取消',
    });

    $.messager.confirm('提示', "您确定要恢复表格【默认排版】吗?", function (r) {
        if (r) {
            let content = '';
             addHabit(keyCode, content, '', function () {
                updateUserOper(keyCode, content);
                if (tableEditor[tableId]) {
                    tableEditor[tableId].hide();
                }
                // $('#' + tableId).datagrid('reload')
                let tableDefaultConfig = TableArr.filter(e => {
                    if (e.table === tableId) {
                        return e
                    }
                })[0];
                let $datagrid = $('#' + tableId);
                let datagridoption = $datagrid.datagrid('options');
                datagridoption.columns = tableDefaultConfig.columns;
                tableDefaultConfig.height = $datagrid.datagrid('options').height;
                xyzgrid(mxApi.clone(tableDefaultConfig));
            });
        }
    });
}

function xyzDataGridSaveFormatToolFunction(tableId, keyCode, info) {
    var pathName = window.location.host + window.location.pathname;
    var tab = self.frameElement;
    var datagridCn = '#'+tab.id + '_'+pathName+'_'+tableId;
    var sortCn = getLocalSortVal('sort', datagridCn);
    var order = getLocalSortVal('order', datagridCn);

    var content = {
        "pageSize": "",
        "columns": {},
        "sortName": sortCn,
        "sortOrder": order,
    };
    var fields = $('#' + tableId).datagrid('getColumnFields', true);//获取冻结列
    fields.forEach(function (t, index) {
        if (t == "_expander") {
            fields.splice(index, 1);
        }
    });
    var fields2 = $('#' + tableId).datagrid('getColumnFields');//获取解冻结列
    for (var p = 0; p < fields2.length; p++) {
        fields[fields.length] = fields2[p];
    }
    for (var i = 0; i < fields.length; i++) {
        var field = fields[i];
        var col = $('#' + tableId).datagrid('getColumnOption', field);
        var title = $("#" + tableId).parents(".datagrid-wrap").find("td[field='" + field + "'] .datagrid-cell span").eq(0).html();
        if (col.hidden == true) {
            content.columns[field] = {"hidden": true, "width": col.width, "title": title, index: i};
        } else {
            content.columns[field] = {"hidden": false, "width": col.width, "title": title, index: i};
        }
    }
    var pageSize = $('#' + tableId).datagrid("options").pageSize;
    if (pageSize != 10) {
        content.pageSize = pageSize;
    }
    delete content.columns['checkboxTemp'];
    content = JSON.stringify(content);

    if (info == "pencil") {
      addHabit(keyCode, content, "");
    } else {
      addHabit(keyCode, content, true, function () {
            top.$.messager.alert("提示", '保存成功');
            updateUserOper(keyCode, content)
        });
    }
}


/*列选项左右换位*/
function changePosition(id, keyCode) {
    var code = $("#" + id).datagrid('options');
    var headerArr = [];
    for (var i = 0; i < code.columns.length; i++) {
        for (var j = 0; j < code.columns[i].length; j++) {
            var headerTd = code.columns[i][j];
            if (headerTd.field == "checkboxTemp" || xyzIsNull(headerTd.title) || headerTd.hidden == true) {
                continue
            }
            var replaceList = {
                value: headerTd.field,
                text: xyzIsNull(headerTd.title) ? "" : headerTd.title,
                width: headerTd.width,
                index: j
            };
            headerArr.push(replaceList);
        }
    }
    var headerMin = headerArr[0].index;
    var headerMax = headerArr[headerArr.length - 1].index;

    $("#" + id).parents(".datagrid-wrap").find(".icon-editDatagrid").addClass(" icon-editDadagridIng");

    var html = "<div class='changePosition'>" +
        "        <div><label>标题</label><div id='replaceList'></div></div>" +
        "        <div><label>修改</label><input type='text' id='replaceInput'></div>" +
        "        <div><label>宽度</label><button id='widthMoveL'>-</button><input type='text' id='replaceWidth'><button id='widthMoveR'>+</button></div>" +
        "        <div><label>位置</label><button id='siteMoveL'>-</button><input type='text' id='serialNum'><button id='siteMoveR'>+</button></div>" +
        "        <div><a id='programmer'>程序code</a><a id='preview' >预览</a></div>" +
        "</div>";

    xyzdialog({
        dialog: 'changePosition',
        title: '修改配置',
        fit: false,
        closable: true,
        width: 300,
        height: 200,
        content: html,
        buttons: [{
            text: '确定',
            handler: function () {
                //重新刷新数据
                var field = $("#replaceList").maytekFcombobox("getValue");
                var title = $("#replaceInput").textbox("getText");
                var width = $("#replaceWidth").val();
                var index = $("#serialNum").val();
                width = xyzIsNull(width) ? undefined : width.indexOf("%") > 0 ? width : Number(width);
                index = Number(index) > headerMax ? headerMax : index < headerMin ? headerMin : index;
                var changeItem = {field: field, title: title, width: width, index: index}
                gridTitleMove(id, changeItem);
                //保存到服务器
                xyzDataGridSaveFormatToolFunction(id, keyCode, "pencil");
                //销毁表单
                $("#changePosition").dialog("destroy");
            }
        }, {
            text: '取消',
            handler: function () {
                $("#" + id).parents(".datagrid-wrap").find(".icon-editDatagrid").removeClass(" icon-editDadagridIng");
                $("#changePosition").dialog("destroy");
            }
        }],
        onOpen: function () {

            $("#replaceInput").textbox({
                width: 200,
                height: 30,
                icons: [{
                    iconCls: 'iconfont icon-clear',
                    handler: function (e) {
                        $(e.data.target).textbox('setValue', '');
                    }
                }]
            });

            $('#replaceList').maytekFcombobox({
                width: 200,
                panelHeight: 150,
                data: headerArr,
                onSelect: function (record) {
                    $("#replaceInput").textbox("setText", record.text);
                    $("#replaceWidth").val(record.width);
                    $("#serialNum").val(record.index);
                }
            });
            $('#replaceList').maytekFcombobox("select", headerArr[0].value);

            $("#widthMoveL,#widthMoveR").on("click", function () {
                var $this = $(this);
                var numStr = $("#replaceWidth").val();
                var isNum = true;

                if (numStr.indexOf("%") > 0) {
                    isNum = false;
                }
                var num = isNum ? Number(numStr) : Number(numStr.substring(0, numStr.length - 1));

                if ($this.attr("id") == "widthMoveL") {
                    num = isNum ? num - 10 : num - 1;
                } else {
                    num = isNum ? num + 10 : num + 1;
                }

                if (isNum) {
                    num = num > 300 ? 300 : num;
                    num = num < 0 ? 0 : num;
                    $("#replaceWidth").val(num);
                } else {
                    num = num > 100 ? 100 : num;
                    num = num < 0 ? 0 : num;
                    $("#replaceWidth").val(num + "%");
                }

            });

            $("#siteMoveL,#siteMoveR").on("click", function () {
                var $this = $(this);
                var num = Number($("#serialNum").val());
                if ($this.attr("id") == "siteMoveL") {
                    num -= 1;
                } else {
                    num += 1;
                }
                num = num > headerMax ? headerMax : num;
                num = num < headerMin ? headerMin : num;
                $("#serialNum").val(num);
            });

            $("#preview").on("click", function () {
                var field = $("#replaceList").maytekFcombobox("getValue");
                var title = $("#replaceInput").textbox("getText");
                var width = $("#replaceWidth").val();
                var index = $("#serialNum").val();
                width = xyzIsNull(width) ? undefined : width.indexOf("%") > 0 ? width : Number(width);
                index = Number(index) > headerMax ? headerMax : index < headerMin ? headerMin : index;
                var changeItem = {field: field, title: title, width: width, index: index};
                gridTitleMove(id, changeItem);
            });

            $("#programmer").on("click", function () {
                createEditer(id);
            });

        },
        onClose: function () {
            $("#" + id).parents(".datagrid-wrap").find(".icon-editDatagrid").removeClass(" icon-editDadagridIng");
            $("#changePosition").dialog("destroy");
        }
    });
}

function gridTitleMove(id, changeItem) {
    var code = $("#" + id).datagrid('options');
    for (var i = 0; i < code.columns.length; i++) {
        for (var j = 0; j < code.columns[i].length; j++) {
            var item = code.columns[i][j];
            if (item.field !== changeItem.field) {
                continue
            }
            item.title = xyzIsNull(changeItem.title) ? item.title : changeItem.title;
            if (!xyzIsNull(changeItem.width)) {
                item.auto = false;
                item.width = changeItem.width;
            } else {
                item.auto = true;
            }
            var index = Number(changeItem.index);
            var c = Object.assign({}, code.columns[i][j]);
            code.columns[i].splice(j, 1);
            code.columns[i].splice(index, 0, c);
            /*      if(index > j){
                      code.columns[i].splice(index+1,0,code.columns[i][j]);
                      code.columns[i].splice(j,1);
                  } else {
                      code.columns[i].splice(index,0,code.columns[i][j]);
                      code.columns[i].splice(j+1,1);
                  }*/
            $("#" + id).datagrid({columns: code.columns});
            return
        }

    }
}

function createEditer(id) {
    //生成代码
    xyzdialog({
        dialog: 'dialogFormDiv_xyzProgressBar_' + id,
        title: '查看代码',
        fit: false,
        width: 700,
        height: 700,
        content: '<textarea id="xyzProgressBar_' + id + '" class="createEditerTextarea"></textarea>',
        buttons: [
            {
                text: '关闭',
                handler: function () {
                    $('#dialogFormDiv_xyzProgressBar_' + id).dialog("destroy");
                }
            },
        ],
        onOpen: function () {
            var textCode = document.getElementById("xyzProgressBar_" + id);
            var jsonStr = $("#" + id).datagrid("options").columns[0];
            // json对象转换成字符串
            jsonStr = stringify(jsonStr);
            jsonStr = jsonStr.replace(/\\r|\\n|\\t/g, '')

            textCode.innerHTML = jsonStr;
        }
    });
}


function xyzProgressBar(id, time) {
    xyzdialog({
        dialog: 'dialogFormDiv_xyzProgressBar_' + id,
        title: '进度',
        fit: false,
        width: 400,
        height: 85,
        content: '<div id="xyzProgressBar_' + id + '" style="width:400px;"></div>',
        onOpen: function () {
            $('#xyzProgressBar_' + id).progressbar({
                width: 400,
                height: 34,
                value: 0
            });

            var functionTimeout = null;
            functionTimeout = function () {
                try { //防止dialog已摧毁, 获取值时 报错!
                    var value = $('#xyzProgressBar_' + id).progressbar('getValue');
                    value += Math.floor(Math.random() * (100 / time) / 5);
                    if (value <= 99) {
                        $('#xyzProgressBar_' + id).progressbar('setValue', value);
                        setTimeout(functionTimeout, 100);
                    }
                } catch (e) {
                    ;
                }
            };
            functionTimeout();
        }
    });
}

function xyzCloseProgressBar(id) {
    $('#xyzProgressBar_' + id).progressbar('setValue', 100);
    setTimeout(function () {
        $("#dialogFormDiv_xyzProgressBar_" + id).dialog("destroy");
    }, 200);
}

/**
 * 将资源加入到部门的工具
 * @param type 资源类型
 * @param resource 资源编号
 * @param resourceNameCn 资源名称
 * @param possessor 资源机构(机构端可以不传 后台会自动获取, 平台端必传)
 * @param oldAuthorityFines 资源以前的部门
 * @returns
 */
function xyzSetResourceAuthorityFine(type ,resource ,resourceNameCn ,possessor ,oldAuthorityFines){
	
	var result = false;
	
	MaytekF.init({
		id : "dialogFormDiv_xyzSetResourceAuthorityFine",
		title : "将资源【"+resourceNameCn+"】加入到部门",
		col : 2,
		buttons : [
			{
				text : '确定',
				handler : function(data) {
					
					var authorityFines = data.authorityFines;
					possessor = xyzIsNull(possessor)?'':possessor;
					
					xyzAjax({
						url : '../AuthorityFineWS/setResourceToAuthorityFines.do',
						data : {
							type : type,
							resource : resource,
							resourceNameCn : resourceNameCn,
							authorityFines : authorityFines,
							possessor : possessor
						},
						success : function(data){
							if(data.status == 1){
								MaytekF.destroy('dialogFormDiv_xyzSetResourceAuthorityFine');
								top.$.messager.alert("提示", "操作成功!", "info");
							}else{
								top.$.messager.alert("警告", data.msg, "warning");
							}
						}
					});
					
				}
			},
			{
				text : '取消',
				handler : function(data) {
					MaytekF.destroy('dialogFormDiv_xyzSetResourceAuthorityFine');
				}
			}
		],
		tabs : [{
			title : '表单一',
			show : 'fullscreen',
			content : [[
				{
					mxkey : 'authorityFine',
					label : '部门',
					type : 'combotree',
					required : false,
					options : {
						multiple : true,
						url : '../ListWS/getAuthorityFineTreeList.do',
						checkbox : true,
                		cascadeCheck : false,
						value : oldAuthorityFines
					}
				}
			]]
		}],
		onLoad : function(data) {
			
		}
	});
}

(function (window) {

    var yqqQueryPlugin = {}; //查询对象

    yqqQueryPlugin.data = {}; //存放数据的地方

    //关闭的图片
    yqqQueryPlugin.imgBase64 = "data:image/gif;base64,R0lGODlhCAAIANUAAP8HB/8NDf8MDP8eHv/S0v97e//a2v/h4f/l5f8KCv/Z2f+9vf+/v/9UVP/Hx/+wsP8YGP+oqP8REf/f3/9hYf8nJ/9gYP/g4P/k5P8GBv+iov+Vlf8fH/+MjP+rq/8vL/+urv8lJf+2tv8DA//o6P8BAf9tbf+Zmf8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M2IChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo1N0EzOTBFODFDQkExMUU2QUMyMjk4MDk0MEE0NzE3MSIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo1N0EzOTBFOTFDQkExMUU2QUMyMjk4MDk0MEE0NzE3MSI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjU3QTM5MEU2MUNCQTExRTZBQzIyOTgwOTQwQTQ3MTcxIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjU3QTM5MEU3MUNCQTExRTZBQzIyOTgwOTQwQTQ3MTcxIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAAAAAAAsAAAAAAgACAAABjJATwZFRDVIIFGCaEF8RhpGwHSpEEubg4JTLHVIBAhxdHJICoYBKrIQEE2T0ANQRFEwQQA7";

    yqqQueryPlugin.create = function (data) {

        var query = {
            autoId: (data.autoId == null ? undefined : data.autoId), //定义区域参数
            leftId: (data.leftId == null ? "query_Id" : data.leftId), //自定义摆放参数  -- 左边ID参数
            rightId: (data.rightId == null ? "query_rightId" : data.rightId), //自定义摆放参数  -- 右边ID参数
            selectId: (data.selectId == null ? "query_selectId" : data.selectId), //自定义摆放参数  -- 选中值区域参数
            pluginId: (data.pluginId == null ? undefined : data.pluginId), //标识id  //必传
            showSearch: (data.showSearch == null ? "all" : data.showSearch), //展示那个选择框  default展示文本框  tool展示工具
            data: data.data == null ? [{}] : data.data, //查询数据
            defaultText: (data.defaultText == null ? '快捷' : data.defaultText), //快捷查询框的提示字符
        };
        if (query.pluginId == null || query.pluginId == "" || query.pluginId == undefined) { //判断是否传参数
            alert("pluginId必传！请填写pluginId参数");
            return false;
        }
        yqqQueryPlugin.data[query.pluginId] = {}; // 创建全局变量  以pluginId 作为识别
        yqqQueryPlugin.data[query.pluginId].q = query; //将query存入全局变量中  以json的形式   pluginId 为key

        //控制展示某个搜索框
        if (query.showSearch == "all") {
            yqqQueryPlugin.searchTool(query);
        } else if (query.showSearch == "tool") {
            yqqQueryPlugin.searchTool(query);
        } else if (query.showSearch == "default") {
            yqqQueryPlugin.searchDefault(query);
        }

    };

    //生成工具
    yqqQueryPlugin.searchTool = function (query) {
        //将用户传入的参数带上表示符
        if (yqqQueryPlugin.data[query.pluginId].q.autoId != null && "" != yqqQueryPlugin.data[query.pluginId].q.autoId && yqqQueryPlugin.data[query.pluginId].q.autoId != undefined) {  //自动化

            yqqQueryPlugin.data[query.pluginId].leftId = query.leftId + "_" + query.pluginId; //左侧id
            yqqQueryPlugin.data[query.pluginId].rightId = query.rightId + "_" + query.pluginId; //右侧id
            yqqQueryPlugin.data[query.pluginId].selectId = query.selectId + "_" + query.pluginId; //选中id

            $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId).append("<div id='selectId_left' class='selectId_left'></div>");

            var ati_html = '<input type="text" id="' + yqqQueryPlugin.data[query.pluginId].leftId + '"/>';
            ati_html += '&nbsp;<div style="display:inline;" id="' + yqqQueryPlugin.data[query.pluginId].rightId + '">';
            ati_html += '</div>';
            $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId + " > div").append(ati_html);

            if (query.showSearch == "all") {
                yqqQueryPlugin.searchDefault(query);
            }

            var selectWidth = $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId).width() - 520;
            var abs_html = '<div class="selectsCss" style="width:' + selectWidth + 'px;" id="' + yqqQueryPlugin.data[query.pluginId].selectId + '"></div>';
            $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId).append(abs_html);
        } else {
            yqqQueryPlugin.data[query.pluginId].leftId = yqqQueryPlugin.data[query.pluginId].q.leftId; //左侧id
            yqqQueryPlugin.data[query.pluginId].rightId = yqqQueryPlugin.data[query.pluginId].q.rightId; //右侧id
            yqqQueryPlugin.data[query.pluginId].selectId = yqqQueryPlugin.data[query.pluginId].q.selectId; //选中id
        }

        var right_html = '<div style="display:inline" id="' + yqqQueryPlugin.data[query.pluginId].rightId + '_left"><input style="width : 140px;" type="text" id="' + yqqQueryPlugin.data[query.pluginId].rightId + '_text"/></div><div style="display:inline" id="' + yqqQueryPlugin.data[query.pluginId].rightId + '_right"></div>';

        $("#" + yqqQueryPlugin.data[query.pluginId].rightId).append(right_html);// 创建右侧input

        $('#' + yqqQueryPlugin.data[query.pluginId].rightId + '_text').textbox({
            icons: [{
                iconCls: 'iconfont icon-clear',
                handler: function (e) {
                    $(e.data.target).textbox('clear');
                }
            }],
            onChange: function (newValue, oldValue) {
                if (newValue == null || newValue == "" || newValue == undefined) {
                    return false;
                }
                yqqQueryPlugin.changeListener(query.pluginId);
            }
        });
        //初始化  创建一个文本框
        $('#' + yqqQueryPlugin.data[query.pluginId].rightId + '_combo').combobox({
            limitToList: true,
            panelHeight: 'auto',
            panelMaxHeight: 500
        });
        //初始化  创建一个下拉框
        $("#" + yqqQueryPlugin.data[query.pluginId].rightId + "_right").hide();

        var clearCss0 = "width: 30px;float:left;padding-left: 5px;padding-right: 5px; background: #fafafa;border-right:1px solid #dcdcdc; display: inline-block;color: #f00;cursor: pointer;";

        var save_select_html = "";
        save_select_html += '<span style="' + clearCss0 + '" onclick="yqqQueryPlugin.emptyValues(\'' + query.pluginId + '\')">清空</span>';
        save_select_html += '<input type="hidden" id="' + yqqQueryPlugin.data[query.pluginId].selectId + '_save" />';
        save_select_html += '<div id="' + yqqQueryPlugin.data[query.pluginId].selectId + '_sp" style="height: 16px; float:left;">';
        save_select_html += '<ul style="margin : 0; height : 0; padding: 0; padding-left: 3px;padding-right: 7px;"></ul>';
        save_select_html += '</div>';
        save_select_html += '<div style="clear:both;"></div>';

        $("#" + yqqQueryPlugin.data[query.pluginId].selectId).append(save_select_html); //添加隐藏域和展示选中的值

        (function (query) {  //创建左侧下拉框
            var comboboxArr = [];
            var dv = "";

            for (var i = 0; i < query.data.length; i++) {
                var list = query.data[i];
                comboboxArr[comboboxArr.length] = {"id": list.key, "text": list.value};
            }

            if (comboboxArr.length > 0) {
                dv = comboboxArr[0].id;
            }

            $("#" + yqqQueryPlugin.data[query.pluginId].leftId).combobox({    //创建easyui combobox
                data: comboboxArr,
                limitToList: true,
                valueField: 'id',
                textField: 'text',
                width: '110',
                panelHeight: 'auto',
                panelMaxHeight: 500,
                icons: [{
                    iconCls: 'iconfont icon-clear',
                    handler: function (e) {
                        $(e.data.target).combobox('clear');
                    }
                }],
                onSelect: function () {
                    var value = $("#" + yqqQueryPlugin.data[query.pluginId].leftId).combobox("getValue");
                    var l = {};
                    for (var i = 0; i < query.data.length; i++) {
                        var list = query.data[i];
                        if (list.key == value) {
                            l = list;
                        }
                    }
                    ;

                    yqqQueryPlugin.data[query.pluginId].list = l; //将选中的值赋给对象中list属性

                    $('#' + yqqQueryPlugin.data[query.pluginId].rightId + '_text').textbox("clear");

                    yqqQueryPlugin.createRight(query.pluginId);
                }
            });

            $("#" + yqqQueryPlugin.data[query.pluginId].leftId).combobox("select", dv);

        })(yqqQueryPlugin.data[query.pluginId].q);
    };

    yqqQueryPlugin.searchDefault = function (query) {
        var default_html = '&nbsp;<input style="width : 150px;" type="text" id="' + yqqQueryPlugin.data[query.pluginId].q.autoId + '_default" />';

        $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId + " > div").append(default_html);

        $("#" + yqqQueryPlugin.data[query.pluginId].q.autoId + "_default").textbox({
            prompt: query.defaultText,
            icons: [{
                iconCls: 'iconfont icon-clear',
                handler: function (e) {
                    $(e.data.target).textbox('clear');
                }
            }]
        });
    };

    yqqQueryPlugin.createRight = function (pluginId) {  //生成右侧文本框
        if (yqqQueryPlugin.data[pluginId].list.type == 'combobox') {  //下拉框 进入这个判断

            var combobox = document.getElementById(yqqQueryPlugin.data[pluginId].rightId + '_combo');

            if (combobox != null && combobox != undefined) {
                $('#' + yqqQueryPlugin.data[pluginId].rightId + '_combo').combobox("destroy");
            }

            //生成combobox所需的html
            var combobox_input = '<input style="width : 140px;" type="text" id="' + yqqQueryPlugin.data[pluginId].rightId + '_combo" />';
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_right").append(combobox_input);

            if (yqqQueryPlugin.data[pluginId].list.data == null || yqqQueryPlugin.data[pluginId].list.data == "" || yqqQueryPlugin.data[pluginId].list.data == undefined) {
                alert("请传入combobox的参数！");
                return false;
            }

            yqqQueryPlugin.data[pluginId].list.data.combobox = yqqQueryPlugin.data[pluginId].rightId + '_combo';

            yqqQueryPlugin.data[pluginId].list.data.icons = [{
                iconCls: 'iconfont icon-clear',
                handler: function (e) {
                    $(e.data.target).combobox('clear');
                }
            }];

            yqqQueryPlugin.data[pluginId].list.data.onChange = function () { // 使参数绑定值选中事件  将值赋给结果集中去
                yqqQueryPlugin.changeListener(pluginId);
            };

            //隐藏普通文本框 显示下拉框
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_left").hide();
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_right").show();

            yqqQueryPlugin.xyzCombobox(yqqQueryPlugin.data[pluginId].list.data); //调用customUi.js 里面的方法

            if (!(yqqQueryPlugin.data[pluginId].list.defaultValue == null || yqqQueryPlugin.data[pluginId].list.defaultValue == "" || yqqQueryPlugin.data[pluginId].list.defaultValue == undefined)) {
                $('#' + yqqQueryPlugin.data[pluginId].rightId + '_combo').combobox("setValue", yqqQueryPlugin.data[pluginId].list.defaultValue);
            }

        } else {
            //隐藏下拉框  显示文本框
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_left").show();
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_right").hide();
        }
    };

    yqqQueryPlugin.changeListener = function (pluginId) {

        var val = $("#" + yqqQueryPlugin.data[pluginId].selectId + "_save").val();

        var selects = [];

        if (val == undefined || val == null || (val + "".trim()) === "" || (val + "".trim()) === '') {
        } else {
            selects = JSON.parse(val); //存值的对象
        }

        var list = yqqQueryPlugin.data[pluginId].list;

        if (list == null || list == undefined || yqqQueryPlugin.isEmptyObject(list)) {
            top.$.messager.alert("提示", "请选择查询类型！", "info");
            return;
        }

        if (list.type == "combobox") {

            var k = $("#" + yqqQueryPlugin.data[pluginId].rightId + "_combo").combobox("getValues");
            var v = $("#" + yqqQueryPlugin.data[pluginId].rightId + "_combo").combobox("getText");

            if (v.trim() == "" || v.trim() == null) {
                return;
            }

            var f = true;
            for (var i = 0; i < selects.length; i++) {
                if (list.key == selects[i].leftKey) {
                    selects[i] = {  //将这次选中的值存入集合中
                        leftKey: list.key,
                        leftValue: list.value,
                        rightKey: k.join(","),
                        rightValue: v
                    };
                    f = false;
                }
            }
            ;

            if (f) {
                selects[selects.length] = {  //将这次选中的值存入集合中
                    leftKey: list.key,
                    leftValue: list.value,
                    rightKey: k.join(","),
                    rightValue: v
                };
            }

        } else {

            var v = $("#" + yqqQueryPlugin.data[pluginId].rightId + "_text").textbox("getValue");

            if (v == null || v == undefined || v.replace(/(^\s*)|(\s*$)/g, "") == "") {
                return false;
            }

            var f = true;

            for (var i = 0; i < selects.length; i++) {
                if (list.key == selects[i].leftKey) {
                    selects[i] = {
                        leftKey: list.key,
                        leftValue: list.value,
                        rightKey: v,
                        rightValue: v
                    };
                    f = false;
                }
            }

            if (f) {
                selects[selects.length] = {  //将这次选中的值存入集合中
                    leftKey: list.key,
                    leftValue: list.value,
                    rightKey: '',
                    rightValue: v
                };
            }
        }

        $("#" + yqqQueryPlugin.data[pluginId].selectId + "_save").val(JSON.stringify(selects)); //存入隐藏域中

        /**
         * 改变文本的值
         */
        $("#" + yqqQueryPlugin.data[pluginId].selectId + "_sp > ul").html("");//清空文本

        yqqQueryPlugin.createShowValuesHtml(pluginId, selects); //生成展示值的方法
    };

    yqqQueryPlugin.getValue = function (pluginId) {

        if (pluginId == null || pluginId == "" || pluginId == undefined) {
            alert("请传入pluginId!!!");
            return false;
        }

        var rev = {};

        var getToolValues = function (pluginId) {
            var sArr = yqqQueryPlugin.data[pluginId].s;

            if (sArr == null || sArr.length < 1) {
                return "";
            }

            var toolJson = {};

            for (var i = 0; i < sArr.length; i++) {
                var list = sArr[i];

                toolJson[list.leftKey] = {
                    "id": list.leftKey,
                    "text": list.leftValue,
                    "queryId": ((list.rightKey == null || list.rightKey == "") ? list.rightValue : list.rightKey).trim().replace(/\"/g, ""),
                    "queryText": list.rightValue.trim().replace(/\"/g, "")
                };
            }
            return toolJson;
        };

        var getDefaultValues = function (pluginId) {
            var defaultValue = $("#" + yqqQueryPlugin.data[pluginId].q.autoId + "_default").textbox("getValue");
            if (xyzIsNull(defaultValue)) {
                return "";
            } else {
                return {
                    "id": "queryCore",
                    "text": "",
                    "queryId": defaultValue.trim(),
                    "queryText": defaultValue.trim()
                };
            }
        };
        if (xyzIsNull(yqqQueryPlugin.data[pluginId].q.showSearch) || yqqQueryPlugin.data[pluginId].q.showSearch == "all") {
            var dp = getToolValues(pluginId);
            if (!xyzIsNull(dp)) {
                rev = dp;
            }
            var dj = getDefaultValues(pluginId);
            if (!xyzIsNull(dj)) {
                rev.queryCore = dj;
            }
        } else if (yqqQueryPlugin.data[pluginId].q.showSearch == "tool") {
            rev = getToolValues(pluginId);
        } else if (yqqQueryPlugin.data[pluginId].q.showSearch == "default") {
            rev.queryCore = getDefaultValues(pluginId);
        }
        if (yqqQueryPlugin.isEmptyObject(rev)) {
            return "";
        } else {
            return JSON.stringify(rev);
        }
    };

    yqqQueryPlugin.emptyValues = function (pluginId) { //清空所选项
        yqqQueryPlugin.data[pluginId].s = [];
        $("#" + yqqQueryPlugin.data[pluginId].selectId + "_save").val(yqqQueryPlugin.data[pluginId].s); //清空值

        $("#" + yqqQueryPlugin.data[pluginId].selectId + "_sp > ul > li").remove(); //下面所有的li标签删除掉
        $("#" + yqqQueryPlugin.data[pluginId].selectId).hide();
        $("#" + yqqQueryPlugin.data[pluginId].q.autoId + '_default').textbox("clear");
        if (yqqQueryPlugin.data[pluginId].list.type == "combobox") {
            $("#" + yqqQueryPlugin.data[pluginId].rightId + "_combo").combobox("clear");
        } else {
            $("#" + yqqQueryPlugin.data[pluginId].rightId + '_text').textbox("clear");
        }
    };

    yqqQueryPlugin.isEmptyObject = function (e) {
        for (var t in e) {
            t;
            return false;
        }
        return true;
    };

    yqqQueryPlugin.removeFiled = function (pluginId, i) {  //删除元素

        var currentValue = $("#hiddenValue_" + i).val().split("&");

        var index = i;

        var sArr = yqqQueryPlugin.data[pluginId].s;

        if (xyzIsNull(sArr) || sArr.length < 1) {
            alert("未发现该pluginId");
            return false;
        }

        for (var i = 0; i < sArr.length; i++) {  //获取当前元素的下标
            if (sArr[i].rightValue == currentValue[1] && sArr[i].leftKey == currentValue[0]) {
                sArr.splice(i, 1); //根据下标删除元素
                $("#" + yqqQueryPlugin.data[pluginId].selectId + "_save").val(JSON.stringify(sArr));
                break;
            }
        }
        $("#liValue_" + index).remove();

        var count = 60;
        var totalWidth = $("#" + yqqQueryPlugin.data[pluginId].selectId).width();

        var findHide = false;
        var displayCount = 0;

        $("#" + yqqQueryPlugin.data[pluginId].selectId + "_sp > ul li").each(function () {
            var current = $(this).width();
            count += current;
            var display = $(this).attr("style").indexOf("display: none");
            if (display > 0) {
                displayCount += 1;
                if (count < totalWidth) {
                    findHide = true;
                    $(this).show();
                }
            }
        });

        if (findHide && (displayCount - 1) <= 0) {
            $("#" + yqqQueryPlugin.data[pluginId].selectId + "_ellipsis").remove();
        }
        ;
    };

    yqqQueryPlugin.xyzCombobox = function (c) {
        var xyzComboboxData = {};
        xyzComboboxData.valueField = c.valueField == undefined ? 'value' : c.valueField;
        xyzComboboxData.textField = c.textField == undefined ? 'text' : c.textField;
        if (c.url != null && c.url != undefined && c.url != "") {

            if (c.url) {
                c.url = c.url.indexOf('../') == 0 ? xyzGetFullUrl(c.url.replace('../', '')) : c.url;
            }
            xyzComboboxData.url = c.url;
        } else {
            xyzComboboxData.data = c.data;
        }
        xyzComboboxData.loadFilter = function (data) {
            if (data instanceof Array) {
                return data;
            } else {
                if (data.status == 1) {
                    return data.content;
                } else {
                    return [];
                }
            }
        };
        var xyzComboboxLazy = c.lazy == undefined ? true : c.lazy;
        if (xyzComboboxLazy || c.mode == 'remote') {
            xyzComboboxData.onClickIcon = function (index) {
                var ttps = $('#' + c.combobox).combobox("getIcon", index).attr("class");
                if (ttps.indexOf("combo-arrow") > -1) {
                    $('#' + c.combobox).combobox("reload", c.url);

                }
                ;
            };
        }
        ;

        if (xyzComboboxLazy && c.mode != 'remote') {
            xyzComboboxData.onShowPanel = function () {
                $(this).next().css({"border-color": "#80c3e2", "box-shadow": "0 0 5px #80c3e2"});
                if ($('#' + c.combobox).combobox("getData").length == 0) {
                    $('#' + c.combobox).combobox("reload", c.url);
                }
                if (c.onShowPanel != undefined) {
                    c.onShowPanel();
                }
            };
        } else {
            if (c.url) {
                c.url = c.url.indexOf('../') == 0 ? xyzGetFullUrl(c.url.replace('../', '')) : c.url;
            }
            xyzComboboxData.url = c.url;
            xyzComboboxData.onShowPanel = c.onShowPanel == undefined ? undefined : c.onShowPanel;
        }
        xyzComboboxData.onBeforeLoad = c.onBeforeLoad == undefined ? undefined : c.onBeforeLoad;
        xyzComboboxData.onLoadSuccess = c.onLoadSuccess == undefined ? undefined : c.onLoadSuccess;
        xyzComboboxData.onSelect = c.onSelect == undefined ? undefined : c.onSelect;
        xyzComboboxData.onChange = c.onChange == undefined ? undefined : c.onChange;
        xyzComboboxData.onHidePanel = c.onHidePanel == undefined ? undefined : c.onHidePanel;
        xyzComboboxData.required = c.required == undefined ? false : c.required;
        xyzComboboxData.editable = c.editable == undefined ? true : c.editable;
        xyzComboboxData.multiple = c.multiple == undefined ? false : c.multiple;
        xyzComboboxData.icons = c.icons == undefined ? undefined : c.icons;
        xyzComboboxData.mode = c.mode == undefined ? 'local' : c.mode;
        xyzComboboxData.panelHeight = 'auto';
        xyzComboboxData.panelMaxHeight = 500;
        $('#' + c.combobox).combobox(xyzComboboxData);
    };

    yqqQueryPlugin.createShowValuesHtml = function (pluginId, data) {
        yqqQueryPlugin.data[pluginId].s = data;  //将最新的的值赋给对象 方便后面取值

        var rightValue = [];

        var count = 60;
        var totalWidth = $("#" + yqqQueryPlugin.data[pluginId].selectId).width();

        for (var i = 0; i < data.length; i++) {
            rightValue[rightValue.length] = data[i].rightValue;

            var str = data[i].rightValue;
            if (data[i].rightValue.length > 9) { //判断字符串是否大于10  大于10 出现省略号
                str = data[i].rightValue.substring(0, 9) + "...";
            }
            var ml = "margin-left: 12px;";
            if (i == 0) {
                ml = "margin-left: 0px;";
            }
            var spanHtml = "";
            spanHtml += '<li id="liValue_' + i + '" style="float: left;list-style-type:none;' + ml + '" >';
            spanHtml += '<input type="hidden" id="hiddenValue_' + i + '" value="' + (data[i].leftKey + '&' + data[i].rightValue) + '"/>';
            spanHtml += '<span style="font-size: 13px;float: left;">' + data[i].leftValue + ' :</span>&nbsp;<span id="tool_' + pluginId + '_' + i + '">' + str + '</span>';
            spanHtml += '<span style="position:relative;top:-7px;left : 5px;"><img onclick="yqqQueryPlugin.removeFiled(\'' + pluginId + '\',\'' + i + '\')" src="' + yqqQueryPlugin.imgBase64 + '" height="8" width="8" /></span>';
            spanHtml += '</li>';
            $("#" + yqqQueryPlugin.data[pluginId].selectId + "_sp > ul").append(spanHtml);

            var current = $("#liValue_" + i).width(); //当前标签宽度
            count = count + current;
            if (count > totalWidth) {
                $("#liValue_" + i).css("display", "none"); //隐藏掉超出部分
                if ($("#" + yqqQueryPlugin.data[pluginId].selectId + "_ellipsis").length > 0) {
                    $("#" + yqqQueryPlugin.data[pluginId].selectId + "_ellipsis").remove();
                }
                var ellipsisHtml = '<li id="' + yqqQueryPlugin.data[pluginId].selectId + '_ellipsis" style="float: left;list-style-type:none;margin-left: 4px;" >';
                ellipsisHtml += '<span style="font-size: 13px;float: left;">.....</span>';
                ellipsisHtml += '</li>';
                $("#" + yqqQueryPlugin.data[pluginId].selectId + "_sp > ul").append(ellipsisHtml);
            }
        }
        $("#" + yqqQueryPlugin.data[pluginId].selectId).show();
        $("#" + yqqQueryPlugin.data[pluginId].selectId).css("display", "inline-flex");
        for (var i = 0; i < data.length; i++) {
            $('#tool_' + pluginId + '_' + i).tooltip({  //绑定tooltip
                position: 'bottom',
                content: '<span style="color:#fff">' + data[i].rightValue + '</span>',
                onShow: function () {
                    $(this).tooltip('tip').css({
                        backgroundColor: '#666',
                        borderColor: '#666',
                    });
                }
            });
        }
    };

    yqqQueryPlugin.setValue = function (data) {
        var values = yqqQueryPlugin.data[data.pluginId];

        if (values == null || values == undefined || values == "") {
            alert("未发现该pluginId！不能设置默认值");
        }

        var d = $("#" + values.selectId + "_save").val();
        if (!xyzIsNull(d)) {
            var dj = xyzJsonToObject(d);
            var temp = [];

            for (var j = 0; j < data.values.length; j++) {
                var t = true;
                for (var i = 0; i < dj.length; i++) {
                    if (data.values[j].leftKey == dj[i].leftKey) {
                        dj[i] = data.values[j];
                        t = false;
                    }
                }
                if (t) {
                    temp[temp.length] = data.values[j];
                }
            }

            for (var k in temp) {
                dj[dj.length] = temp[k];
            }
            $("#" + yqqQueryPlugin.data[data.pluginId].selectId + "_sp > ul > li").remove(); //下面所有的li标签删除掉
            data.values = dj;
        }
        $("#" + values.selectId + "_save").val(JSON.stringify(data.values)); //赋值
        yqqQueryPlugin.createShowValuesHtml(data.pluginId, data.values);
    };

    window.yqqQueryPlugin = yqqQueryPlugin;

})(window);

function customEasyuiConfirm(message) {
    var defaults = {
        ok: $.messager.defaults.ok,
        cancel: $.messager.defaults.cancel,
        onClose: $.messager.defaults.onClose
    };
    $.extend($.messager.defaults, {
        ok: message.ok,
        cancel: message.cancel,
        onClose: function () {
            $.extend($.messager.defaults, defaults);
        }
    });
}

/**
 * 下拉选择
 * Created by cl on 2018/6/13.
 */
;(function ($) {
    //初始化参数
    var combobox = function (ele, options) {
        this.ele = ele;
        this.defaults = {
            valueField: 'value',
            textField: 'text',
            multiple: false, // 是否多选
            width: 300, // 整体容器宽度
            height: 38,
            panelHeight: 170,
            fixedHeight: true,
            fontSize: 12,
            readOnly: false,
            prompt: '',
            limitToList: true, // 设置为true时，输入的值只能是列表框中的内容
            lazy: false,
            url: '',
            async: true, // 请求是否异步
            method: 'GET',
            isMxSet: false,
            mode: 'local', // 关键词 检索方式 local:本地筛选, remote: url请求筛选
            queryParams: {}, // 请求参数
            value: '', // 初始值，String
            hasSearch: true,// 是否支持查询
            hasDownArrow: true, // 是否显示向下箭头
            clearIcon: false, // 是否显示清除图标
            data: [],
            formatterShowText: true, // 是否解析展示区域的值
            formatter: function (obj, textField) { // 定义如何显示text
                return obj[textField];
            },
            onBeforeLoad: function () {
            },
            onSelect: function () {
            },
            onUnselect: function () {
            },
            onChange: function () {
            },
            onLoadSuccess: function () {
            },
            onLoadError: function () {
            },
        };
        this.isGetListing = false; // 是否正在请求数据
        this.ajaxObj = null;
        this.options = $.extend({}, this.defaults, options);
        this.selectList = []; // 选项列表
        this.result = []; // 结果集
        var that = this;

        this.renderIcon = function () {
            var iconLength = 0;
            var $icons = that.ele.find('.inputWrapIcons');
            if (that.options.clearIcon) {
                iconLength++;
                $icons.append('<i class="maytekficon icon-delete2"></i>');
                $icons.find('.icon-delete2').on('click', function (e) {
                    e.stopPropagation();
                    that.clear();
                })
            }
            if (that.options.hasDownArrow) {
                iconLength++;
                $icons.append('<i class="maytekficon icon-zhankai"></i>');
            }
            that.ele.find('.inputWrap').css('paddingRight', iconLength * 20 + 'px')
        };
        // 根据result update 展示项
        this.refreshInput = function () {
            that.ele.find('.inputWrap').removeClass('empty');
            that.ele.find(".inputWrap ul").empty();
            if (that.options.multiple) {
                that.result.forEach(function (_result) {
                    var renderContent = that.options.formatterShowText ? that.options.formatter(_result, that.options.textField) || _result[that.options.textField] : _result[that.options.textField];
                    _result[that.options.textField] && that.ele.find(".inputWrap ul").append('<li><span>' + renderContent + '</span>&nbsp;&nbsp;<i data-value="' + _result[that.options.valueField] + '" class="maytekficon icon-delete2 mulicon"></i></li>')
                });
                that.result.length == 0 && that.ele.find('.inputWrap').addClass('empty');
                that.delItem();
            } else {
                // 添加文本溢出class
                var className = that.options.fixedHeight ? 'text-overflow' : '';
                var renderContent = that.options.formatterShowText ? that.options.formatter(that.result, that.options.textField) || that.result[that.options.textField] : that.result[that.options.textField];
                if ($.isEmptyObject(that.result)) {
                    that.ele.find('.inputWrap').addClass('empty');
                    that.ele.find(".inputWrap ul").empty()
                } else {
                    that.ele.find(".inputWrap ul").addClass(className).append('<li class="singleList"><span>' + renderContent + '</span>&nbsp;&nbsp;</li>')
                }
            }
            this.ele.find('.inputWrap li').css({
                'minHeight': this.options.height - 14 + 'px',
                'lineHeight': this.options.height - 14 + 'px'
            })
        };
        // 展示项 delete icon event
        this.delItem = function () {
            var that = this;
            this.ele.find(".inputWrap ul li i").on("click", function (event) {
                if (that.options.readOnly) return;
                event.stopPropagation();
                var old_result = that.deepClone(that.result);
                var valueField = $(this).attr("data-value"), index = '';
                that.result.forEach(function (val, ins) {
                    if (val[that.options.valueField] === valueField) {
                        return index = ins;
                    }
                });

                that.result.splice(index, 1);
                that.refreshInput();
                that.removeStyle($(this).attr("data-value"));

                that.changeResult(old_result);
            })
        };
        // result change
        this.changeResult = function (old_result) {
            if (old_result instanceof Array && !this.options.multiple) {
                old_result.length === 0 && (old_result = {});
            }
            this.updateListPosi(this.ele);
            this.options.onChange(this.result, old_result)
        };
        // 根据valueField 移除选中class
        this.removeStyle = function (val) {
            $(".mySelect-option").find("div").each(function () {
                if ($(this).attr("data-value") === val) {
                    $(this).removeClass("selected")
                }
            })
        };
        // 发起请求，获取数据
        this.getList = function (cb) {
            var params = this.deepClone(this.options.queryParams);
            var that = this;
            var result = [];
            that.options.onBeforeLoad(params, that);

            if (this.result.value && this.options.isMxSet) {
                params.q = this.result.value; //有选中
            } else if (this.options.isMxSet) {
                params.q = this.options.mxValue;  //mxSetValue 给过来了参数
            }
            that.isGetListing = true;
            xyzAjax({
                url: that.options.url,
                type: this.options.method,
                data: params,
                async: this.options.async ? true : false,
                dataType: 'json',
                success: function (data) {
                    result = data.content || [];
                    // mxSetValue 重置查询q参数
                    if (result.length == 0) that.options.mxValue = '';
                    that.isGetListing = false;
                    cb(result)
                    that.ajaxComplete();
                    that.options.onLoadSuccess();
                },
                error: function () {
                    that.isGetListing = false;
                    cb(result)
                    that.ajaxComplete();
                    that.options.onLoadError()
                }
            });
            // return result;
        };
        this.showList = function () {
            // 隐藏并清空所有选项列表
            $(".mySelect-option").removeClass('active');
            var $items = $('body').find(".mySelect-option .maytekFcombo-items");
            $items.empty();
            var $mask = $('.mySelect-mask');
            $mask.hide();
            $(".maytekFcombo .inputWrapIcons>i.icon-shouqi").removeClass("icon-shouqi").addClass("icon-zhankai");
            $('.mySelect-option .addCustom').hide();
            that.updateListPosi(that.ele);
            $mask.show();
            $(".mySelect-option").addClass('active');
            if (this.options.url !== '') {
                this.getList(callback);
            } else {
                callback();
            }

            function callback(data) {
                that.options.data = data || that.options.data;
                that.selectList = that.options.data;
                that.updateList(true);
                // 显示当前选项列表
                that.ele.find(".inputWrapIcons>i.icon-zhankai").removeClass("icon-zhankai").addClass("icon-shouqi");
                var searchBox = $('body').find(".mySelect-option input.maytekFcombo-search");
                searchBox.val('');
                mxApi.isPc() && searchBox.focus();
            }
        }
        this.hideList = function () {
            var $mask = $('.mySelect-mask');
            $(".mySelect-option").removeClass('active');
            $mask.hide();
            this.ele.find(".inputWrapIcons>i.icon-shouqi").removeClass("icon-shouqi").addClass("icon-zhankai");
        }
        this.updateListPosi = function (el) {
            var dom = el[0];
            var pos = dom.getBoundingClientRect();
            var that = this;
            var $panel = $(".mySelect-option");
            this.updateSearchBox();
            if (mxApi.isPc()) {
                // 下方高度不足
                if (pos.top + pos.height + this.options.panelHeight + 10 > document.body.getBoundingClientRect().height) {
                    // 上方高度是否不足
                    var top_enough = pos.top - this.options.panelHeight - 10 < 0 ? true : false;
                    $panel.css({
                        left: pos.left,
                        top: top_enough ? 0 : pos.top - this.options.panelHeight - 10,
                        width: pos.width,
                        height: top_enough ? (pos.top - 10 > this.options.panelHeight ? this.options.panelHeight : pos.top - 10) : this.options.panelHeight
                    })
                } else {
                    $panel.css({
                        left: pos.left,
                        top: pos.top + pos.height,
                        width: pos.width,
                        height: 'auto'
                    })
                }
            } else {
                $panel.css({
                    left: 0,
                    bottom: 0,
                    width: '100%'
                })
            }
            // 搜索search
            $panel.find("input.maytekFcombo-search").off().on("input", function () {
                var in_value = $(this).val().trim();
                if (that.options.url !== '' && that.options.mode === 'remote') {
                    var params = that.deepClone(that.options.queryParams);
                    that.options.onBeforeLoad(params, that);
                    typeof in_value === 'string' && (params.q = in_value);
                    clearTimeout(that.ajaxObj);
                    that.ajaxObj = setTimeout(function () {
                        xyzAjax({
                            url: that.options.url,
                            type: that.options.method,
                            data: params,
                            // async: false,
                            dataType: 'json',
                            success: function (data) {
                                that.options.data = data.content || [];
                                that.selectList = that.options.data;
                                _callback(in_value);
                                that.options.onLoadSuccess();
                            },
                            error: function () {
                                that.options.onLoadError()
                            }
                        });
                    }, 1000)
                } else {
                    that.selectList = that.matchData($(this).val());
                    _callback(in_value)
                }

            });
            // add icom
            $('.mySelect-option .addCustom').off().on("click", function (event) {
                event.stopPropagation();
                var obj = {};
                var input_dom = $('body').find(".mySelect-option input.maytekFcombo-search");
                var key = input_dom.val().trim();
                obj[that.options.valueField] = key;
                obj[that.options.textField] = key;
                var old_result = that.deepClone(that.result);
                that.options.multiple ? that.result.push(obj) : that.result = obj;
                that.refreshInput();
                $(this).hide();
                input_dom.val('');
                that.selectList = that.options.data;
                that.updateList();
                that.options.onChange(that.result, old_result)
            })

            function _callback(in_value) {
                if (in_value === '' || that.options.limitToList) { // 输入的值为空
                    $('.mySelect-option').find('.addCustom').hide();
                    that.updateList();
                    return;
                }
                var hasSame = false;// 判断当前输入值是否已存在
                if (that.options.multiple) {
                    that.result.forEach(function (val) {
                        val[that.options.textField] === in_value && (hasSame = true);
                    })
                } else {
                    that.result[that.options.textField] === in_value && (hasSame = true);
                }
                hasSame ? $('.mySelect-option').find('.addCustom').hide() : $('.mySelect-option').find('.addCustom').show();
                that.updateList();
            }
        }
        this.updateSearchBox = function () {
            $('.mySelect-option .maytekFcombo-search').removeClass('hide');
            !this.options.hasSearch && $('.mySelect-option .maytekFcombo-search').addClass('hide');
            var searchHeight = this.options.hasSearch ? 49 : 0;
            var _attr = mxApi.isPc() ? 'maxHeight' : 'height';
            $('.mySelect-option').css(_attr, this.options.panelHeight + 'px');
            $('.mySelect-option .maytekFcombo-items').css({'maxHeight': this.options.panelHeight - searchHeight + 'px'});
        }
        // update 选项列表
        this.updateList = function (isRender) {
            var $items = $('body').find(".mySelect-option .maytekFcombo-items");
            $items.empty()
            if (that.selectList.length == 0) {
                $items.append('<div>暂无数据</div>')
            } else {
                !isRender && that.ele.find(".inputWrapIcons>i.icon-zhankai").removeClass("icon-zhankai").addClass("icon-shouqi");
            }
            for (var i = 0; i < that.selectList.length; i++) {
                var add_class = '';
                if (that.isType(that.result) === 'Array') {
                    that.result.forEach(function (val) {
                        if (that.selectList[i][that.options.valueField] === val[that.options.valueField]) {
                            add_class = 'selected';
                            return;
                        }
                    })
                } else {
                    that.result[that.options.valueField] === that.selectList[i][that.options.valueField] && (add_class = 'selected')
                }
                if (that.selectList[i][that.options.valueField] === undefined || that.selectList[i][that.options.textField] === undefined) {
                    console.log('未找到');
                    continue;
                }
                var renderText = that.options.formatter(that.selectList[i], that.options.textField) || that.selectList[i][that.options.textField];
                $items.append('<div class="maytekFcombo-item ' + add_class + '" data-value="' + that.selectList[i][that.options.valueField] + '"><span>' + renderText + '</span></div>')
                // 选项列表
                $(".mySelect-option .maytekFcombo-items > div").off().on("click", function (event) {
                    event.stopPropagation();
                    var clone_result = that.deepClone(that.result);
                    var obj = that.serchInfo($(this).attr("data-value"));
                    if ($(this).hasClass("selected")) {
                        if (that.options.multiple) {
                            var valueField = $(this).attr("data-value"), index = '';
                            that.result.forEach(function (val, ins) {
                                if (val[that.options.valueField] === valueField) {
                                    return index = ins;
                                }
                            });
                            that.result.splice(index, 1);
                        } else {
                            that.result = {};
                            if (that.options.isMxSet) {
                                that.options.mxValue = '';
                                that.getList(function (data) {
                                    that.options.data = data;
                                    that.selectList = that.options.data;
                                    that.updateList(true);
                                });
                            }
                        }
                        $(this).removeClass("selected");
                        that.options.onUnselect(obj);
                    } else {
                        if (that.options.multiple) {
                            that.result.push(obj);
                        } else {
                            $('body').find(".mySelect-option").find("div").removeClass("selected");
                            that.ele.find(".inputWrapIcons>i.icon-shouqi").removeClass("icon-shouqi").addClass("icon-zhankai");
                            that.result = that.deepClone(obj);
                            that.hideList();
                        }
                        $(this).addClass("selected");
                        that.options.onSelect(obj);
                    }
                    that.refreshInput();
                    that.changeResult(clone_result);
                });
            }
        }
        // 绑定相应事件
        this.addEvent = function () {
            var that = this;
            // 显示框
            this.ele.find(".inputWrap").on("click", function (event) {
                event.stopPropagation();
                if (that.options.readOnly !== true) {
                    !$(".mySelect-option").hasClass('active') ? that.showList() : that.hideList()
                    that.options.data.length == 0 && console.log('没有数据')
                }
            });
            // 点击其它元素 隐藏选项列表
            $('.mySelect-mask').on('click', function (e) {
                that.hideList();
            })
            top.addEventListener('resize', function () {
                that.hideList()
            })
            // 滑轮滚动 隐藏选项列表
            /*注册事件*/
            if (document.addEventListener) {
                document.addEventListener('DOMMouseScroll', scrollFunc, false);
            }//W3C
            window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome/Safari
            function scrollFunc(e) {
                !$(e.target).parents('.mySelect-option')[0] && that.hideList();
            }
        };

        this.ajaxComplete = function () {
        };
        // 根据valueField 查找相应数据
        this.serchInfo = function (valueField) {
            var that = this;
            var serchResult = {};
            this.options.data.forEach(function (val) {
                if (val[that.options.valueField] === valueField) {
                    serchResult = val;
                }
            });
            return serchResult;
        };
        // 关键词 本地筛选
        this.matchData = function (val) {
            var that = this;
            var matchResult = [];
            if (val === '') {
                return that.options.data;
            }
            that.options.data.forEach(function (_data) {
                if (_data[that.options.textField].toLowerCase().indexOf(val.toLowerCase()) > -1) {
                    matchResult.push(_data);
                }
            });
            return matchResult;
        };
        //  ---- 深度克隆
        this.deepClone = function (obj) {
            // 先检测是不是数组和Object
            // let isArr = Object.prototype.toString.call(obj) === '[object Array]';
            let isArr = Array.isArray(obj);
            let isJson = Object.prototype.toString.call(obj) === '[object Object]';
            if (isArr) {
                // 克隆数组
                let newObj = [];
                for (let i = 0; i < obj.length; i++) {
                    newObj[i] = this.deepClone(obj[i]);
                }
                return newObj;
            } else if (isJson) {
                // 克隆Object
                let newObj = {};
                for (let i in obj) {
                    newObj[i] = this.deepClone(obj[i]);
                }
                return newObj;
            }
            // 不是引用类型直接返回
            return obj;
        };
        // tools ---- 判断类型
        this.isType = function (o) {
            if (o === null) return "Null";
            if (o === undefined) return "Undefined";
            return Object.prototype.toString.call(o).slice(8, -1);
        };
        this.init();
    };
    combobox.prototype = {
        init: function () {
            this.ele.empty().addClass('maytekFcombo');
            this.ele.addClass(this.options.multiple ? 'multiple' : 'single');

            var _attr = this.options.readOnly === true ? 'disabled' : '';
            var _prompt = this.options.prompt;
            this.ele.append('<div class="inputWrap empty" ' + _attr + ' placeholder="' + _prompt + '"><ul></ul><div class="inputWrapIcons"></div></div>');

            var _class = mxApi.isPc() ? '' : 'phone';
            $('.mySelect-option').length === 0 &&
            $('body').append('<div class="mySelect-option ' + _class + '">' +
                '<div class="maytekFcombo-search"><div><input class="maytekFcombo-search" type="text"><span class="addCustom">+</span><span class="search-icon iconfont icon-chaxun"></span></div></div>' +
                '<div class="maytekFcombo-items"></div>' +
                '</div>' +
                '<div class="mySelect-mask ' + _class + '"></div>');
            var wrapWidth = typeof this.options.width === 'number' ? this.options.width + 'px' : this.options.width;
            fontSize = typeof this.options.fontSize === 'number' ? this.options.fontSize + 'px' : this.options.fontSize;
            this.ele.css({'width': wrapWidth, 'fontSize': fontSize});
            this.ele.find('.inputWrap').css('minHeight', this.options.height + 'px')
                .find('.inputWrapIcons').css('lineHeight', this.options.height - 6 + 'px');

            this.result = this.options.multiple ? [] : {};

            this.renderIcon();
            // this.updateList(true);
            this.addEvent();
            var that = this;
            if (!this.options.lazy && this.options.url !== '') {
                this.getList(callback);
            } else {
                callback()
            }

            function callback(data) {
                that.options.data = data || that.options.data;
                that.selectList = that.options.data;
                if (that.options.value || that.options.value === 0) that.setValue(that.options.value, true);
            }
        },
        reload: function (url, _param, cb) {
            if (typeof url !== 'string' || !url) return;
            this.clear();
            this.isType(_param) === 'Object' && (this.options.queryParams = _param);
            this.options.url = url || '';
            var that = this;
            this.getList(function (data) {
                that.options.data = data;
                that.selectList = that.options.data;
                that.updateList(true);
                typeof cb === 'function' && cb();
            });
        },
        getData: function () {
            return this.options.data;
        },
        resetData: function (data) {
            if (this.isType(data) !== 'Array' || this.options.url !== '') return;

            this.clear();
            this.options.data = data;
            this.selectList = this.options.data;
            this.updateList(true);
        },
        clear: function () {
            this.setValue('');
        },
        setValue: function (res, isRender) {
            var that = this;
            if (typeof res === 'number') res += '';
            if (typeof res !== 'string') return;

            // 在初始渲染，请求未响应时(异步)就调用setvalue设值失败，因后台普遍都是这种用法，so...
            that.isGetListing ? this.ajaxComplete = callback : callback();

            function callback() {
                var old_result = that.deepClone(that.result);
                if (that.options.multiple) {
                    res = res.split(',');
                    var arr = [];
                    res.forEach(function (val) {
                        var isExist = false;
                        that.options.data.forEach(function (_val) {
                            val === _val[that.options.valueField] && arr.push(_val) && (isExist = true);
                        })
                        // limitToList false；添加自定义值
                        var obj = {};
                        obj[that.options.valueField] = obj[that.options.textField] = val;
                        !isExist && !that.options.limitToList && arr.push(obj);
                    })
                    that.result = arr;
                    that.refreshInput();
                    $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                    $('body').find(".mySelect-option").find("div").each(function () {
                        for (var i = 0; i < res.length; i++) {
                            $(this).attr("data-value") === res[i] && $(this).addClass("selected");
                        }
                    });
                    !isRender && that.changeResult(old_result);
                } else {
                    that.result = {};
                    // 先进行清空操作
                    that.ele.find(".inputWrap ul").empty();
                    $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                    var isExist = false;
                    that.options.data.forEach(function (_val) {
                        if (res === _val[that.options.valueField]) {
                            isExist = true;
                            that.result = _val;
                            that.refreshInput();
                            return;
                        }
                    });
                    $('body').find(".mySelect-option").find("div").each(function () {
                        $(this).attr("data-value") === res && $(this).addClass("selected");
                    });
                    var obj = {};
                    obj[that.options.valueField] = obj[that.options.textField] = res;
                    !isExist && !that.options.limitToList && (that.result = obj) && (that.refreshInput());
                    !isRender && that.changeResult(old_result);
                }
                this.ajaxComplete = function () {
                };
            }
        },
        getValue: function () {
            var that = this;
            var result = [];
            if (that.options.multiple) {
                that.result.forEach(function (val) {
                    result.push(val[that.options.valueField])
                })
            } else {
                result = that.result[that.options.valueField] || '';
            }
            return that.options.multiple ? result.join(',') : result;
        },
        mxSetValue: function (value) {
            var that = this;
            if (typeof value !== 'string') return;
            var mote = this.options.mode;
            if (!xyzIsNull(value) && mote == 'remote') {
                this.options.isMxSet = true;
                this.options.mxValue = value;

                var queryParams = this.options.queryParams;
                this.reload(this.options.url, queryParams, function () {
                    that.setValue(value)
                })
            } else {
                this.setValue(value)
            }
            ;
        },
        setText: function (res, isRender) {
            var that = this;
            if (typeof res === 'number') res += '';
            if (typeof res !== 'string') return;
            var old_result = that.deepClone(that.result);
            if (that.options.multiple) {
                res = res.split(',');
                var arr = [];
                res.forEach(function (val) {
                    var isExist = false;
                    that.options.data.forEach(function (_val) {
                        val === _val[that.options.textField] && arr.push(_val) && (isExist = true);
                    })
                    // limitToList false；添加自定义值
                    var obj = {};
                    obj[that.options.valueField] = obj[that.options.textField] = val;
                    !isExist && !that.options.limitToList && arr.push(obj);
                })
                that.result = arr;
                that.refreshInput();
                $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                $('body').find(".mySelect-option").find("div").each(function () {
                    for (var i = 0; i < res.length; i++) {
                        $(this).attr("data-value") === res[i] && $(this).addClass("selected");
                    }
                });
                !isRender && that.changeResult(old_result);
            } else {
                that.result = {};
                // 先进行清空操作
                that.ele.find(".inputWrap ul").empty();
                $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                var isExist = false;
                that.options.data.forEach(function (_val) {
                    if (res === _val[that.options.textField]) {
                        isExist = true;
                        that.result = _val;
                        that.refreshInput();
                        return;
                    }
                });
                $('body').find(".mySelect-option").find("div").each(function () {
                    $(this).attr("data-value") === res && $(this).addClass("selected");
                });
                var obj = {};
                obj[that.options.valueField] = obj[that.options.textField] = res;
                !isExist && !that.options.limitToList && (that.result = obj) && (that.refreshInput());
                !isRender && that.changeResult(old_result);
            }
        },
        getText: function () {
            var that = this;
            var result = [];
            if (that.options.multiple) {
                that.result.forEach(function (val) {
                    result.push(val[that.options.textField])
                })
                result = result.join(',');
            } else {
                result = that.result[that.options.textField] || '';
            }
            return result;
        },
        getRecode: function () {
            return this.result;
        },
        select: function (value) {
            var that = this;
            var targetObj = null;
            this.options.data.forEach(function (val) {
                val[that.options.valueField] === value && (targetObj = val);
            });
            var old_result = this.deepClone(this.result);
            if (that.options.multiple) {
                that.result.forEach(function (_val, index) {
                    if (_val[that.options.valueField] === value) {
                        return targetObj = null;
                    }
                })
                if (!targetObj) return;
                that.result.push(targetObj);
                that.refreshInput();
                $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                $('body').find(".mySelect-option").find("div").each(function () {
                    for (var i = 0; i < that.result.length; i++) {
                        $(this).attr("data-value") === that.result[i] && $(this).addClass("selected");
                    }
                });
                that.options.onSelect(targetObj);
                that.changeResult(old_result);
            } else {
                that.result[that.options.valueField] === value && (targetObj = null);
                if (!targetObj) return;
                that.result = targetObj;
                that.ele.find(".inputWrap ul").empty();
                $('body').find(".mySelect-option").find("div.selected").removeClass('selected');
                that.refreshInput(targetObj[that.options.textField]);
                $('body').find(".mySelect-option").find("div").each(function () {
                    $(this).attr("data-value") === value && $(this).addClass("selected");
                });
                that.options.onSelect(targetObj);
                that.changeResult(old_result);
            }
        },
        unselect: function (value) {
            var that = this;
            var old_result = that.deepClone(that.result);
            if (that.options.multiple) {
                var index = null;
                that.result.forEach(function (_val, _ins) {
                    if (_val[that.options.valueField] === value) {
                        that.options.onUnselect(_val);
                        index = _ins;
                    }
                });
                if (index === null) return;
                that.result.splice(index, 1);
                that.refreshInput();
                that.removeStyle(value);
                that.changeResult(old_result);
            } else {
                if (that.result[that.options.valueField] !== value) return;
                that.options.onUnselect(old_result);
                that.clear();
            }
        },
        destroy: function () {
            this.ele.empty();
        }
    };
    $.fn.maytekFcombobox = function (type, options, _param) {
        if (Object.prototype.toString.call(type) === '[object Object]' && options === undefined) {
            if (window.maytekFcombobox === undefined) window.maytekFcombobox = [];
            this.attr('combobox_id', window.maytekFcombobox.length);
            window.maytekFcombobox.push(new combobox(this, type));
            return window.maytekFcombobox[window.maytekFcombobox.length];
        }
        var _id = Number(this.attr('combobox_id'));
        if (maytekFcombobox[_id] == undefined) return;
        if (this.attr('combobox_id') == undefined) return;
        switch (type) {
            case 'reload':
                maytekFcombobox[_id].reload(options, _param);
                break;
            case 'clear':
            case 'destroy':
                maytekFcombobox[_id][type]();
                break;
            case 'setValue':
            case 'setText':
            case 'select':
            case 'unselect':
            case 'resetData':
            case 'mxSetValue':
                maytekFcombobox[_id][type](options);
                break;
            case 'getValue':
            case 'getText':
            case 'getRecode':
            case 'getData':
                return maytekFcombobox[_id][type]();
            default:
                break;
        }
    };

})(jQuery)
/**
 * @name: MxComplex插件
 * @author: pls
 * @update: 2019-4-18
 * @descript:
 * 插件为maytef的组件插件
 * 插件
 *
 */
;(function ($) {
    var typeTrans = {
        "text": "textbox",
        "number": "numberbox",
        "date": "datebox",
        "datetime": "datetimebox",
        "time": "clockTimePicker",
        "combobox": "maytekFcombobox",
        "selectInput": "mxSelectInput",
        "numberVerify": "createVerify",
        "checkbox": "checkbox",
    };
    //创建插件对象
    $.fn.mxComplex = function (arg1, arg2) {
        if (typeof arg1 == "string") {
            var method = $.fn.mxComplex.methods[arg1];
            if (method) {
                return method(this, arg2);
            } else {
                console.log("mxComplex没有这个方法");
                return;
            }
        }
        var params = arg1 || {};
        return this.each(function () {
            //获取数据
            var data = $.data(this, "mxComplex");
            if (data) {
                //把params合并到data.options上
                $.extend(data.options, params);
            } else {
                data = $.data(this, "mxComplex", {
                    options: $.extend({}, params),
                    data: []
                });
            }
            //渲染数据
            render(this, data);
        })
    };

    $.fn.mxComplex.methods = {
        options: function (jq) {
        },
        getData: function (jq) {
            return $.data(jq[0], "mxComplex").data;
        },
        getValue: function (jq) {
            return getValue(jq[0]);
        },
        getText: function (jq) {
            return getText(jq[0]);
        },
        setValue: function (jq, param) {
            return jq.each(function () {
                setValue(this, param);
            });
        },
        setText: function (jq, text) {
            return jq.each(function () {
                setText(this, text);
            });
        }
    };


    function render(el, d) {
        //绑定元素数据
        var bind = $.data(el, "mxComplex");
        bind.data = d.options;
        //创建dom元素
        var dom = "";
        $.each(bind.data, function (key, data) {
            data.mxkey = el.id + "_" + data.mxkey;
            if (!data.options) {
                data.options = {};
            }
            var width = data.width || '100%';
            var _pdr = data.paddingRight || 0;

            if (typeof width == "number") width += "px";
            if (typeof _pdr == "number") _pdr += 'px';

            switch (data.type) {
                case "text":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><input type="text" id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '" ></div>';
                    break
                case "number":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><input type="text" id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '" ></div>';
                    break
                case "date":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><input type="text" id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '" ></div>';
                    break
                case "datetime":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><input type="text" id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '" ></div>';
                    break
                case "time":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><input type="text" id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '" ></div>';
                    break
                case "combobox":
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><div id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '"  type="combobox" style="height: 40px"></div></div>';
                    break
                case 'selectInput':
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><div id="' + data.mxkey + '" complexKey="' + data.mxkey + '" complexType="' + data.type + '"  type="selectInput"></div></div>';
                    break;
                case 'numberVerify':
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><div id="' + data.mxkey + '"  complexKey="' + data.mxkey + '" complexType="' + data.type + '" enable="' + data.options.enable + '"></div></div>';
                    break;
                case 'custom':
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '"><div id="' + data.mxkey + '"  complexKey="' + data.mxkey + '" complexType="' + data.type + '" >' + data.html + '</div></div>';
                    break;
                case 'checkbox':
                    dom += '<div style="width:' + width + ';padding-right: ' + _pdr + '">' +
                        '<div id="' + data.mxkey + '"  complexKey="' + data.mxkey + '" complexType="' + data.type + '" >';

                    Object.keys(data.options.data).length > 0 && data.options.data.forEach(function (t) {
                        if (!Array.isArray(t)) {
                            dom += '<div class="isQForQueryDiv">' +
                                '<input name="' + data.mxkey + '" id="' + data.mxkey + t.value + '" type="checkbox" value="' + t.value + '"/><span class="inputSpan"><span class="iconfont icon-check"></span></span>' +
                                '</div><label style="cursor: pointer;" title="" for="' + data.mxkey + t.value + '">' + t.text + '</label>';
                        } else {
                            t.forEach(function (t1) {
                                dom += '<div class="isQForQueryDiv">' +
                                    '<input name="' + data.mxkey + '" id="' + data.mxkey + t1.value + '" type="checkbox" value="' + t1.value + '"/><span class="inputSpan"><span class="iconfont icon-check"></span></span>' +
                                    '</div><label style="cursor: pointer;" title="" for="' + data.mxkey + t1.value + '">' + t1.text + '</label>';
                            });
                            dom += '<br/>';
                        }
                    });
                    dom += '</div>';
                    break;
            }
        });

        $("#" + el.id).append(dom);
        //渲染dom元素
        $.each(bind.data, function (key, data) {
            var options = data.options;
            var com_height = 38;
            options.width = "100%";
            switch (data.type) {
                case "text":
                    options.height = com_height;
                    options.icons = [{
                        iconCls: 'iconfont icon-clear',
                        handler: function (e) {
                            $(e.data.target).textbox('setValue', '');
                        }
                    }];
                    $("#" + data.mxkey).textbox(options);
                    break
                case "number":
                    options.height = com_height;
                    options.icons = [{
                        iconCls: 'iconfont icon-clear',
                        handler: function (e) {
                            $(e.data.target).textbox('setValue', '');
                        }
                    }];
                    $("#" + data.mxkey).numberbox(options);
                    break
                case "date":
                    options.height = com_height;
                    $("#" + data.mxkey).datebox(options);
                    break
                case "datetime":
                    options.height = com_height;
                    $("#" + data.mxkey).datetimebox(options);
                    break
                case "time":
                    options.value && $("#" + data.mxkey + " input").val(options.value);
                    $("#" + data.mxkey).clockTimePicker(options);
                    break
                case "combobox":
                    $("#" + data.mxkey).maytekFcombobox(options);
                    break
                case 'selectInput':
                    $("#" + data.mxkey).mxSelectInput('init', options);
                    break;
                case 'numberVerify':
                    options.id = data.mxkey;
                    createVerify(options);
                    break;
                case 'custom':
                    break;
                case 'checkbox':
                    if (!xyzIsNull(data.options.value)) {
                        var v = [];

                        typeof data.options.value === 'string' ? v = data.options.value.split(',') : v = data.options.value;

                        v.forEach(function (t) {
                            $('#' + data.mxkey + ' input[name="' + data.mxkey + '"][value="' + t + '"]').attr('checked', 'checked');
                        });
                    }

                    if (data.options["onChange"] !== undefined) {
                        var oldvalue = data.options.value;

                        $('#' + data.mxkey + ' input[name="' + data.mxkey + '"]').on("change", function (a, b) {
                            let newvalue = getValue(el)
                            data.options["onChange"](newvalue, oldvalue);
                            oldvalue = getValue(el);
                        });
                    }
                    break;
            }
        });

    }

    function getValue(el) {
        var result = {};
        var data = $("#" + el.id).mxComplex("getData");

        for (var key in data) {
            var value = "";
            if (data[key].type == "custom") {
                continue
            }
            if (data[key].type == "time") {
                value = $("#" + data[key].mxkey).val();
                result[data[key].mxkey] = value;
                continue
            }

            if (data[key].type == "numberVerify") {
                value = numberVerifyObj[data[key].mxkey].getResult();
                result[data[key].mxkey] = value;
                continue
            }

            if (data[key].type == "checkbox") {
                value = $.map($('#' + data[key].mxkey + ' input[name="' + data[key].mxkey + '"]:checked'), function (p) {
                    return $(p).val();
                }).join(",");
                result[data[key].mxkey] = value;
                continue
            }

            value = $("#" + data[key].mxkey)[typeTrans[data[key].type]]("getValue");

            result[data[key].mxkey] = value;
        }

        return result
    }

    function getText(el) {
        var result = {};
        var data = $("#" + el.id).mxComplex("getData");
        for (var key in data) {
            var text = "";
            if (data[key].type == "custom") {
                continue
            }
            if (data[key].type == "time") {
                value = $("#" + data[key].mxkey).val();
                result[data[key].mxkey] = value;
                continue
            }
            if (data[key].type == "numberVerify") {
                text = numberVerifyObj[data[key].mxkey].getResult();
                result[data[key].mxkey] = text;
                continue
            }

            if (data[key].type == "checkbox") {
                text = getValue(el)
                result[data[key].mxkey] = text;
                continue
            }

            text = $("#" + data[key].mxkey)[typeTrans[data[key].type]]("getText");
            result[data[key].mxkey] = text;

        }
        ;
        return result
    }

    function setValue(el, param) {
        var data = $("#" + el.id).mxComplex("getData");
        var clear = false;
        //清空值
        if (param == "") {
            clear = true;
            param = data;
        }
        for (var key in param) {
            var text = param[key];
            //清空
            if (clear) {
                text = "";
            }
            for (var d in data) {
                if (key == d) {
                    if (data[d].type == "custom") {
                        continue
                    }
                    if (data[d].type == "time") {
                        $("#" + data[key].mxkey).val(text);
                        continue
                    }
                    if (data[d].type == "numberVerify") {
                        // createVerify({id:data[key].mxkey}).getResult();
                        continue
                    }
                    if (data[d].type == "checkbox") {
                        $('#' + data[key].mxkey + ' input[name="' + data[key].mxkey + '"]').attr('checked', false);
                        if (!xyzIsNull(value)) {
                            var v = [];

                            typeof value === 'string' ? v = value.split(',') : v = value;

                            v.forEach(function (t) {
                                $('#' + data[key].mxkey + ' input[name="' + data[key].mxkey + '"][value="' + t + '"]').attr('checked', 'checked');
                            });
                        }
                        continue
                    }
                    $("#" + data[key].mxkey)[typeTrans[data[d].type]]("setValue", text);
                }
            }
        }
    }

    function setText(el, param) {
        var data = $("#" + el.id).mxComplex("getData");
        for (var key in param) {
            var value = param[key];
            for (var d in data) {
                if (key == d) {
                    if (data[d].type == "custom") {
                        continue
                    }
                    if (data[d].type == "numberVerify") {
                        // createVerify({id:data[key].mxkey}).getResult();
                        continue
                    }
                    if (data[d].type == "checkbox") {
                        continue
                    }
                    $("#" + data[key].mxkey)[typeTrans[data[d].type]]("setText", value);
                }
            }
        }
    }
})(jQuery)

/**
 * 日历 展示
 * Created by cl on 2018/11/12.
 */
;(function () {
    Date.prototype.format = function (fmt) {
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }
        return fmt;
    };

    function createDOM(label, classList, id) {
        var _dom = document.createElement(label);
        if (id) _dom.id = id;
        _dom.className = classList;
        // _dom.classList.add(classList);
        return _dom;
    }

    function setStyle(dom, style, value) {
        dom.style[style] = value;
    }

    function calendar(params) {
        params.date = !params.date ? undefined : params.date;
        params.cur_month = isNaN(new Date(params.date).getMonth()) ? new Date().getMonth() : new Date(params.date).getMonth();
        params.cur_year = isNaN(new Date(params.date).getFullYear()) ? new Date().getFullYear() : new Date(params.date).getFullYear();
        params.cur_date = isNaN(new Date(params.date).getDate()) ? new Date().getDate() : new Date(params.date).getDate();
        params.time = new Date(params.cur_year, params.cur_month, params.cur_date).format("yyyy-MM-dd");
        var defaultOpts = {
            id: '',
            weekStart: 0, // 周次排列顺序，默认从周日开始
            date: '',
            isOnlyCurrentMonth: false, // 是否只显示当前月份
            hasDetail: true, // 是否开启详情面板
            detailPanelWidth: 175,
            detailPanelHeight: 150,
            url: '',
            key: 'date',
            methods: 'post',
            data: [],
            queryParams: {},

            minDate: "1970-1-1", // 日期选择范围 default
            maxDate: "3000-12-28",
            onClick: function () {
            },
            onChangeDate: function () {
            },
            formatter: function () {
                return '';
            },
            detailFormatter: function () {
                return '';
            },
            onBeforeLoad: function () {
            },
            onLoadSuccess: function () {
            },
            onLoadError: function () {
            },
            cur_year: 2018,
            cur_month: 10, // 0-11
            cur_date: 1,
        }
        this.options = Object.assign(defaultOpts, params)
        this.dateList = []; // 当月日期列表
        this.datasList = []; // ajax data list
        this.hasEl = document.querySelector('#' + this.options.id) == null ? false : true;
        var _this = this;

        this.render = function () {
            var _h = typeof this.options.height === 'number' ? this.options.height : '',
                _w = typeof this.options.width === 'number' ? this.options.width : '';
            if (this.hasEl) {
                this.el = document.querySelector('#' + this.options.id);
                this.el.setAttribute('class', 'mx-calendar');
                this.el.innerHTML = '<div class="calendar-box"></div>';
                setStyle(this.el, 'width', _w + 'px');
                setStyle(this.el, 'height', _h + 'px');
            } else {// 不存在挂载点 以弹窗形式生成
                // create mask
                document.body.appendChild(createDOM('div', 'mx-calendar-mask'))
                // create content
                var _container = createDOM('div', 'mx-calendar', this.options.id);
                _container.innerHTML = '<div class="container">' +
                    '<div class="calendar-box"></div>' +
                    '<div class="btn-box"><a class="closeBtn">关闭</a></div>' +
                    '</div>';
                document.body.appendChild(_container)
                setStyle(_container.querySelector('.container'), 'width', _w + 'px');
                setStyle(_container.querySelector('.container'), 'height', _h + 'px');
            }
            // header select year/month
            var calendarDom = document.querySelector('.calendar-box');
            calendarDom.innerHTML = '<div class="select-box">' +
                '<div class="year"><span class="prev-year">&lt;</span><input class="show-year"><span class="next-year">&gt;</span></div>' +
                '<div class="month">' +
                (mxApi.isPc() ? '<span class="active">1月</span><span>2月</span><span>3月</span><span>4月</span><span>5月</span><span>6月</span><span>7月</span><span>8月</span><span>9月</span><span>10月</span><span>11月</span><span>12月</span>' :
                    '<span class="active">1</span><span>2</span><span>3</span><span>4</span><span>5</span><span>6</span><span>7</span><span>8</span><span>9</span><span>10</span><span>11</span><span>12</span>') +
                '</div>' +
                '<div class="back-current-month"><i></i></div>' +
                '</div>' +
                '<div class="week-list"></div>' +
                '<div class="date-box"></div>';
            this.getDatas();
            this.addEvents();
        }
        this.updateView = function (data) {
            if (this.options.url) {
                if (!data) {
                    return this.getDateDatas(this.updateView);
                }
                this.datasList = data;
            } else {
                this.datasList = this.options.data;
            }
            var _weekBoxDom = document.querySelector('.calendar-box .week-list');
            var _dateBoxDom = document.querySelector('.calendar-box .date-box');
            _weekBoxDom.innerHTML = '';
            _dateBoxDom.innerHTML = '';

            document.querySelector('#' + this.options.id + ' .show-year').value = this.options.cur_year;
            document.querySelector('#' + this.options.id + ' .month span.active').classList.remove('active');
            document.querySelectorAll('#' + this.options.id + ' .select-box .month span').forEach(function (val) {
                if (parseInt(val.innerHTML) == _this.options.cur_month + 1) {
                    val.className = 'active';
                }
            })
            // 周几 排列顺序
            var week_str = '';
            for (var i = this.options.weekStart; i < this.options.weekStart + 7; i++) {
                switch (i % 7) {
                    case 0:
                        week_str += '<span>日</span>';
                        break;
                    case 1:
                        week_str += '<span>一</span>';
                        break;
                    case 2:
                        week_str += '<span>二</span>';
                        break;
                    case 3:
                        week_str += '<span>三</span>';
                        break;
                    case 4:
                        week_str += '<span>四</span>';
                        break;
                    case 5:
                        week_str += '<span>五</span>';
                        break;
                    case 6:
                        week_str += '<span>六</span>';
                        break;
                }
            }
            var week_dom = createDOM('div', 'week-show');
            week_dom.innerHTML = week_str;
            _weekBoxDom.appendChild(week_dom);
            // 日期 显示
            this.dateList.forEach(function (val, index) {
                var dateBoxDom = createDOM('div', 'date-show');
                var dom_str = '';
                // dom_str
                val.forEach(function (_obj) {
                    var _date = _obj.date == ' ' ? '' : _obj.date.split('-')[2];
                    var _class = _obj.date == _this.options.time ? 'selected' : '';
                    var datainfo = {};
                    var select_cur_month = new Date(_obj.date).getMonth() == _this.options.cur_month ? true : false;

                    for (var i = 0; i < _this.datasList.length; i++) {
                        if (_this.datasList[i][_this.options.key] && _this.datasList[i][_this.options.key].indexOf(_obj.date) > -1) {
                            datainfo = _this.datasList[i];
                            break;
                        }
                    }
                    var isDisabled = _obj.curMonthDay == 'true' ? '' : 'disabled';
                    dom_str += '<div class="date-show-box ' + _class + '" date="' + _obj.date + '" ' + isDisabled + '>' +
                        '<div class="detail-panel">' +
                        '<div class="detail-title" date="' + _obj.date + '">' + (_obj.date == _this.options.time ? '今日' : _date) + '</div>' +
                        '<div class="content-info">' + (_date == '' ? '' : _this.options.formatter(_obj.date, datainfo, select_cur_month)) + '</div>' +
                        '<div class="detail-content">' + (_date == '' ? '' : _this.options.detailFormatter(_obj.date, datainfo, select_cur_month)) + '</div>' +
                        '<div class="close-detail"><span class="btn-close-detail">收起</span></div>' +
                        '</div>' +
                        '</div>';
                })
                dateBoxDom.innerHTML = dom_str;
                _dateBoxDom.appendChild(dateBoxDom);
            })
            var _date_show_box = document.querySelector('#' + this.options.id + ' .date-show-box');
            this.itemHeight = _date_show_box.clientHeight;
            this.itemWidth = _date_show_box.clientWidth;

            this.options.detailPanelWidth = this.options.detailPanelWidth < 230 ? 230 : this.options.detailPanelWidth > 500 ? 500 : this.options.detailPanelWidth;
            this.options.detailPanelHeight = this.options.detailPanelHeight < 200 ? 200 : this.options.detailPanelHeight > 300 ? 300 : this.options.detailPanelHeight;

            // 查看 详细内容
            document.querySelectorAll('#' + this.options.id + ' .date-show-box').forEach(function (_div) {
                var etr_h = $(_div.parentNode).index() == 5 ? 10 : 0; // 最后一排 date-show 要高10px
                // setStyle(_div.querySelector('.content-info'), 'width', _this.itemWidth - 16 + 'px');
                // setStyle(_div.querySelector('.content-info'), 'height', _this.itemHeight - 30 + etr_h + 'px');
                _div.addEventListener('click', function (e) {
                    var _par = _this.getParents(e.target, 'date-show-box');
                    var _detail_panel = _par.querySelector('.detail-panel');
                    var _detail_dom = _par.querySelector('.detail-panel .detail-content');
                    var select_date = _par.getAttribute('date');
                    var select_cur_month = new Date(select_date).getMonth() == _this.options.cur_month ? true : false;
                    _this.options.onClick(select_date, e);
                    var datainfo = {};

                    if (_detail_panel.getAttribute('class').indexOf('active') > -1) return; // 当前已是展开状态
                    document.querySelectorAll('#' + _this.options.id + ' .detail-panel').forEach(function (_vvv) { // 关闭详情面板
                        var _detail_content = _vvv.querySelector('.detail-panel .detail-content');
                        _vvv.classList.remove('active')
                        setStyle(_vvv, 'width', 'calc(~"100% - 3px")');
                        setStyle(_vvv, 'height', 'calc(~"100% - 3px")');
                        setStyle(_vvv, 'zIndex', 4);
                        setStyle(_vvv, 'boxShadow', 'none');
                        setStyle(_detail_content, 'overflow', 'hidden');
                        _vvv.querySelector('.content-info').style.display = 'block';
                        var _dd = _vvv.querySelector('.detail-title').getAttribute('date');
                        _vvv.querySelector('.detail-title').innerHTML = _dd == _this.options.time ? '今日' : _dd.slice(-2);
                    })
                    for (var i = 0; i < _this.datasList.length; i++) {
                        if (_this.datasList[i][_this.options.key] && _this.datasList[i][_this.options.key].indexOf(select_date) > -1) {
                            datainfo = _this.datasList[i];
                            break;
                        }
                    }
                    if (_this.options.detailFormatter(select_date, datainfo, select_cur_month) == '') return; // 返回内容为空
                    if (!_this.options.hasDetail) return; // 未开启
                    if (_this.options.isOnlyCurrentMonth && select_date == ' ') return; // 只展示当月时，取消详情行为

                    _par.querySelector('.detail-panel').style.zIndex = 11;
                    _div.querySelector('.content-info').style.display = 'none';
                    _div.querySelector('.detail-title').innerHTML = select_date;
                    _detail_panel.classList.add('active');

                    _detail_dom.innerHTML = _this.options.detailFormatter(select_date, datainfo, select_cur_month); // 设置详情内容
                    // setStyle(_detail_dom, 'height', _this.options.detailPanelHeight - _this.itemHeight - 8 - etr_h + 'px');
                    setStyle(_detail_dom, 'height', _this.options.detailPanelHeight - 68 - etr_h + 'px');
                    setStyle(_detail_panel, 'boxShadow', '0 0 10px 5px rgba(224,228,233,0.6)');

                    $(_par.querySelector('.detail-panel'))
                        .animate({height: '110%', width: '110%'}, 0)
                        .animate({
                            height: _this.options.detailPanelHeight + "px", width: _this.options.detailPanelWidth + "px"
                        }, 400, function () {
                            setStyle(_detail_dom, 'overflow', 'auto')
                        });
                })
            })
            // close icon
            document.querySelectorAll('#' + this.options.id + ' span.btn-close-detail').forEach(function (_span) {
                _span.addEventListener('click', function (e) {
                    e.stopPropagation();
                    var t = document.querySelector('#' + _this.options.id + ' .detail-panel.active');
                    t.querySelector('.detail-title').innerHTML = t.querySelector('.detail-title').getAttribute('date').slice(-2)
                    t.querySelector('.content-info').style.display = 'block';
                    t.classList.remove('active');
                    setStyle(t, 'width', '100%');
                    setStyle(t, 'height', '100%');
                    setStyle(t, 'zIndex', 4);
                    setStyle(t, 'boxShadow', 'none');
                })
            })
        }
        this.getDatas = function () {
            var year = this.options.cur_year,
                month = this.options.cur_month,
                fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
                startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
                total = (fullDay + startWeek) % 7 === 0 ? fullDay + startWeek : fullDay + startWeek + (7 - (fullDay + startWeek) % 7), //元素总个数
                total = 42;// 固定显示6周
            lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
                eleTemp = [];
            this.dateList = [];
            for (var i = 0; i < total; i++) {
                if (i < startWeek) { // 上月
                    this.options.isOneMonth ? eleTemp.push(" ") : eleTemp.push(new Date(year, month - 1, lastMonthDay - startWeek + 1 + i).format("yyyy-MM-dd"));
                } else if (i < startWeek + fullDay) { // 当前月份
                    var _day = i + 1 - startWeek;
                    eleTemp.push(new Date(year, month, _day).format("yyyy-MM-dd"));
                } else { // 下月
                    this.options.isOneMonth ? eleTemp.push(" ") : eleTemp.push(new Date(year, month + 1, i + 1 - (startWeek + fullDay)).format("yyyy-MM-dd"));
                }
            }
            eleTemp = eleTemp.map(function (val, index, arr) {
                var e_year = new Date(val).getFullYear();
                var e_month = new Date(val).getMonth();
                var e_day = new Date(val).getDate();
                return new Date(e_year, e_month, e_day - 7 + _this.options.weekStart).format('yyyy-MM-dd');
            })
            // 保证当月1号 始终处于第一排
            if (new Date(eleTemp[20]).getMonth() != new Date(eleTemp[6]).getMonth()) {
                eleTemp = eleTemp.map(function (val, index, arr) {
                    var e_year = new Date(val).getFullYear();
                    var e_month = new Date(val).getMonth();
                    var e_day = new Date(val).getDate();
                    return new Date(e_year, e_month, e_day + 7).format('yyyy-MM-dd');
                })
            }
            // console.log('当月总日：',eleTemp);
            for (var row = 0; row < 6; row++) {
                var _week = [];
                eleTemp.forEach(function (val, ins, arr) {
                    if (ins < 7 && arr[ins + row * 7]) {
                        var _obj = {};
                        _obj.date = arr[ins + row * 7];
                        _obj.curMonthDay = _this.judgeDate(arr[ins + row * 7]) ? "true" : "false";
                        _week.push(_obj);
                    }
                });
                _week.length !== 0 && this.dateList.splice(this.dateList.length, 0, _week);
            }
            // console.log("dateList:", this.dateList);
            this.updateView();
        }
        this.addEvents = function () {
            // 关闭按钮
            !this.hasEl && document.querySelector('#' + this.options.id + ' .closeBtn').addEventListener('click', function () {
                _this.close();
            })
            // 选择月份
            document.querySelectorAll('#' + this.options.id + ' .select-box .month span').forEach(function (_span) {
                _span.addEventListener('click', function (e) {
                    if (e.target.className == 'active') {
                        return
                    }
                    _this.changeDate(new Date(_this.options.cur_year, parseInt(_span.innerHTML) - 1, _this.options.cur_date).format('yyyy-MM-dd'))
                    _this.options.cur_month = parseInt(_span.innerHTML) - 1;
                    _this.getDatas();
                })
            })
            // 切换年份 icon
            var dom_year = document.querySelector('#' + this.options.id + ' input.show-year');
            dom_year.addEventListener('input', function (e) {
                e.target.value = e.target.value.replace(/[^\d]/g, "").slice(0, 4);
            })
            dom_year.addEventListener('focus', function (e) {
                window.addEventListener('keydown', function (event) {
                    switch (event.keyCode) {
                        case 13: // ENTER
                            var _value = e.target.value;
                            var _year = _value.length == 4 ? _value : new Date().getFullYear();
                            e.target.value = _year;
                            if (_year != _this.options.cur_year) {
                                _this.changeDate(new Date(_year, _this.options.cur_month, _this.options.cur_date).format('yyyy-MM-dd'))
                                _this.options.cur_year = _year;
                                _this.getDatas();
                                e.target.blur();
                            }
                            break;
                        default:
                            break;
                    }
                }, false);
            })
            dom_year.addEventListener('blur', function (e) {
                var _value = e.target.value;
                var _year = _value.length == 4 ? _value : new Date().getFullYear();
                e.target.value = _year;
                if (_year != _this.options.cur_year) {
                    _this.changeDate(new Date(_year, _this.options.cur_month, _this.options.cur_date).format('yyyy-MM-dd'))
                    _this.options.cur_year = _year;
                    _this.getDatas();
                }
            })
            document.querySelector('#' + this.options.id + ' .next-year').addEventListener('click', function () {
                _this.changeDate(new Date(_this.options.cur_year + 1, _this.options.cur_month, _this.options.cur_date).format('yyyy-MM-dd'))
                _this.options.cur_year += 1;
                _this.getDatas();
            })
            document.querySelector('#' + this.options.id + ' .prev-year').addEventListener('click', function () {
                _this.changeDate(new Date(_this.options.cur_year - 1, _this.options.cur_month, _this.options.cur_date).format('yyyy-MM-dd'))
                _this.options.cur_year -= 1;
                _this.getDatas();
            })
            // detail close event
            document.querySelector('#' + this.options.id).addEventListener('click', function (e) {
                if (e.target.parentNode == document.querySelector('#' + _this.options.id)) {
                    document.querySelectorAll('#' + _this.options.id + ' .detail-panel').forEach(function (_vvv) {
                        setStyle(_vvv, 'width', '100%');
                        setStyle(_vvv, 'height', '100%');
                        setStyle(_vvv, 'zIndex', 4);
                        setStyle(_vvv, 'boxShadow', 'none');
                    })
                }
            })
            document.querySelector('#' + this.options.id + ' .back-current-month i').addEventListener('click', function () {
                var __year = Number(_this.options.time.slice(0, 4)),
                    __month = Number(_this.options.time.slice(5, 7)) - 1,
                    __day = Number(_this.options.time.slice(-2));
                _this.changeDate(new Date(__year, __month, __day).format('yyyy-MM-dd'));
                _this.options.cur_year = __year;
                _this.options.cur_month = __month;
                _this.options.cur_date = __day;
                _this.getDatas();
            })
        }

        // ------------tools-------
        // 判断该天是否在所选择范围内
        this.judgeDate = function (date) {
            let _year = new Date(date).getFullYear(),
                _month = new Date(date).getMonth(),
                _day = new Date(date).getDate();
            if (date === " " || _year !== this.options.cur_year || _month !== this.options.cur_month) {
                return false;
            }
            let min_date = new Date(this.options.minDate);
            let max_date = new Date(this.options.maxDate);
            // 默认时间比对 参考为当天 00:00:00
            let nowTime = new Date(min_date.getFullYear(), min_date.getMonth(), min_date.getDate(), 0, 0, 0).getTime();
            let endTime = new Date(max_date.getFullYear(), max_date.getMonth(), max_date.getDate(), 0, 0, 0).getTime();
            let comTime = new Date(_year, _month, _day).getTime();
            return comTime >= nowTime && comTime <= endTime;
        }
        // 查找相应class的祖先元素
        this.getParents = function (dom, _class) {
            if (dom.parentNode.className.indexOf(_class) > -1) {
                return dom.parentNode;
            } else {
                return this.getParents(dom.parentNode, _class);
            }
        }
        // 获取数据
        this.getDateDatas = function (cb) {
            var _starttime = this.options.isOnlyCurrentMonth ? new Date(this.options.cur_year, this.options.cur_month).getTime() : new Date(this.dateList[0][0].date).getTime();
            var _endtime = this.options.isOnlyCurrentMonth ? new Date(this.options.cur_year, this.options.cur_month + 1, 0).getTime() : new Date(this.dateList[5][6].date).getTime();
            params = Object.assign({
                startTime: parseInt(_starttime / 1000),
                endTime: parseInt(_endtime / 1000)
            }, this.options.queryParams);
            this.options.onBeforeLoad(params);
            var result = [];
            xyzAjax({
                url: this.options.url,
                type: this.options.method,
                data: params,
                // async: false,
                dataType: 'json',
                success: function (data) {
                    result = data.content || [];
                    typeof cb === 'function' && cb.call(_this, result);
                    _this.options.onLoadSuccess();
                },
                error: function () {
                    typeof cb === 'function' && cb.call(_this, result);
                    _this.options.onLoadError()
                }
            });
            return result;
        }
        // 触发onchangedate event
        this.changeDate = function (_new) {
            _this.options.onChangeDate(_new, new Date(this.options.cur_year, this.options.cur_month, this.options.cur_date).format('yyyy-MM-dd'));
        }

        this.init();
    }

    calendar.prototype.init = function () {
        this.render()
    }
    calendar.prototype.close = function () {
        if (this.hasEl) {
            document.querySelector('#' + this.options.id).innerHTML = '';
        } else {
            document.querySelector('.mx-calendar-mask').remove();
            document.querySelector('#' + this.options.id).remove();
        }
        delete calenderObj[this.options.id];
    }
    calendar.prototype.reload = function (url, params) {
        this.options.url = url;
        this.options.queryParams = params;
        this.getDatas();
    }
    calendar.prototype.load = function () {
        this.getDatas();
    }
    calendar.prototype.resetData = function (data) {
        this.options.data = data;
        this.getDatas();
    }

    var calenderObj = {};
    var mxCalender = {};
    mxCalender.init = function (param) {
        if (!param.id) {
            return console.error('id error, init function fail');
        }
        calenderObj[param.id] = new calendar(param);
    }
    mxCalender.close = function (id) {
        if (!calenderObj[id]) {
            return console.error('id error, close function fail')
        }
        calenderObj[id].close();
    }
    mxCalender.reload = function (id, url, params) {
        if (!calenderObj[id]) {
            return console.error('id error, reload function fail')
        }
        calenderObj[id].reload(url, params);
    }
    mxCalender.load = function (id) {
        if (!calenderObj[id]) {
            return console.error('id error, load function fail')
        }
        calenderObj[id].load();
    }
    mxCalender.resetData = function (id, data) {
        if (!calenderObj[id]) {
            return console.error('id error, resetData function fail')
        }
        calenderObj[id].resetData(data);
    }
    // 将插件暴露给全局对象
    var _global = (function () {
        return this || (0, eval)('this');
    }());
    // 检测 模块机制calendar
    if (typeof module !== "undefined" && module.exports) {
        module.exports = mxCalender;
    } else if (typeof define === "function" && define.amd) {
        define(function () {
            return mxCalender;
        });
    } else {
        !('mxCalender' in _global) && (_global.mxCalender = mxCalender);
    }
})()
/**
 * 选择 输入框
 * Created by cl on 2018/11/20.
 */
;(function ($) {
    function SelectInput(el, options) {
        var that = this;
        this.$el = el[0];
        this.$el.classList.add('mx-select-input');
        var default_opt = {
            selectWidth: 140,
            data: [],
            selectValue: '',
            disabled: false,
            value: '',
            formatter: function (obj, text) {
                var _s = obj.text == undefined ? '' : obj.text;
                return _s + text;
            },
            onSelect: function () {
            },
            onUnselect: function () {
            },
            onChange: function () {
            },
        }
        this.$option = Object.assign(default_opt, options);
        this.result = {}; // 下拉 选择结果集
        this.res_str = ''; // 保存formatter解析后的结果


        this.render = function () {
            var isDisabled = this.$option.disabled ? 'disabled' : '';
            this.$el.innerHTML = '<div class="select-box" style="width: ' + this.$option.selectWidth + 'px" ' + isDisabled + '>' +
                '<div class="text-wrap"></div>' +
                '<div class="select-list"></div>' +
                '<i class="select-icon selectInputIcon icon-zhankai"></i>' +
                '</div>' +
                '<div class="input-box" style="width: calc(100% - ' + this.$option.selectWidth + 'px)" ' + isDisabled + '>' +
                '<input type="text" ' + isDisabled + ' value="' + this.$option.value + '">' +
                '<i class="input-icon selectInputIcon icon-delete2"></i>' +
                '</div>';
            if (this.$option.selectWidth == 0) {
                getDOM('.select-box').style.display = 'none';
                getDOM('input').style.borderRadius = '5px';
            }
            this.updateData();
            this.addEvents();
        }
        this.updateData = function () {
            var str = '';
            this.$option.data.forEach(function (val, index, arr) {
                str += '<p class="item" data="' + val.value + '" itemindex="' + index + '">' + val.text + '</p>';
            });
            getDOM('.select-list').innerHTML = str;

        }
        this.addEvents = function () {
            // 下拉 event
            getDOM('.select-box').addEventListener('click', function (e) {
                if (that.$option.disabled) return;
                var _classname = e.target.className;
                if (_classname.indexOf('item') === -1) {
                    that.selecting ? closeList() : openList();
                } else {
                    var in_val = that.$el.querySelector('input').value;
                    if (_classname.indexOf('selected') > -1) {
                        getDOM('.text-wrap').innerHTML = '';
                        e.target.classList.remove('selected');
                        that.$option.onUnselect(that.result);
                        that.$option.onChange(that.$option.formatter({}, in_val), that.res_str)
                        that.result = {};
                        that.res_str = that.$option.formatter(that.result, in_val);
                        closeList();
                        return;
                    }
                    getDOM('.selected') && getDOM('.selected').classList.remove('selected');
                    e.target.classList.add('selected');
                    getDOM('.text-wrap').innerHTML = e.target.innerHTML;
                    var unselect = that.$option.data[Number(e.target.getAttribute('itemindex'))];
                    var new_res = that.$option.formatter(unselect, in_val);
                    that.$option.onSelect(unselect);
                    that.$option.onChange(new_res, that.res_str)
                    that.result = unselect;
                    that.res_str = new_res;
                    closeList();
                }
            })
            // input clear icon event
            getDOM('.input-icon').addEventListener('click', function () {
                if (that.$option.disabled) return;
                getDOM('input').value = '';
            })
            // input event
            getDOM('input').addEventListener('focus', function () {
                closeList();
            })
            getDOM('input').addEventListener('change', function (e) {
                that.$option.onChange(that.$option.formatter(that.result, e.target.value), that.res_str)
                that.res_str = that.$option.formatter(that.result, e.target.value);
            })
        }
        this.render();

        function openList() {
            getDOM('.select-icon').setAttribute('style', 'transform: rotate(180deg)');
            getDOM('.select-list').style.display = 'block';
            that.selecting = true;
        }

        function closeList() {
            getDOM('.select-icon').setAttribute('style', 'transform: rotate(0deg)');
            getDOM('.select-list').style.display = 'none';
            that.selecting = false;
        }

        function getDOM(selector) {
            return that.$el.querySelector(selector);
        }
    }

    SelectInput.prototype.getValue = function () {
        return this.res_str;
    }
    SelectInput.prototype.setSelectValue = function (value) {
        var _selected = this.$el.querySelector('.selected'),
            _list = this.$el.querySelectorAll('.select-list p.item'),
            that = this,
            isExit = false,
            reObj = {};
        _selected && _selected.classList.remove('selected');
        this.$option.data.forEach(function (val) {
            if (val.value == value) {
                isExit = true;
                reObj = val;
            }
        })
        isExit && _list.forEach(function (val) {
            if (val.getAttribute('data') == value) {
                val.classList.add('selected');
                that.$el.querySelector('.text-wrap').innerHTML = val.innerHTML;
                that.result = val;
                that.res_str = that.$option.formatter(reObj, that.$el.querySelector('input').value);
            }
        })
    }
    SelectInput.prototype.setValue = function (value) {
        this.$el.querySelector('input').value = value;
        this.res_str = this.$option.formatter(this.result, value);
    }
    SelectInput.prototype.resetData = function (data) {
        var _selected = this.$el.querySelector('.selected');
        _selected && _selected.classList.remove('selected');
        this.$el.querySelector('.text-wrap').innerHTML = '';
        this.result = {};
        this.res_str = this.$option.formatter({}, this.$el.querySelector('input').value);
        this.$option.data = data;
    }
    SelectInput.prototype.clear = function () {
        var _selected = this.$el.querySelector('.selected');
        _selected && _selected.classList.remove('selected');
        this.$el.querySelector('.text-wrap').innerHTML = '';
        this.$el.querySelector('input').value = '';
        this.result = {};
        this.res_str = this.$option.formatter({}, '');
    }
    SelectInput.prototype.destroy = function () {
        this.$el.innerHTML = '';
    }


    $.fn.mxSelectInput = function (type, options) {
        window.mxslectInputBox = window.mxslectInputBox === undefined ? [] : window.mxslectInputBox;
        if (type === 'init') {
            this.attr('select_index', window.mxslectInputBox.length);
            window.mxslectInputBox.push(new SelectInput(this, options))
            return window.mxslectInputBox[window.mxslectInputBox.length];
        }
        var _id = Number(this.attr('select_index'));
        if (this.attr('select_index') == undefined) return;
        switch (type) {
            case 'getValue':
                return window.mxslectInputBox[_id].getValue();
            case 'setSelectValue':
            case 'setValue':
            case 'resetData':
                window.mxslectInputBox[_id][type](options);
                break;
            case 'clear':
            case 'destroy':
                window.mxslectInputBox[_id][type]();
                break;
            default:
                break;
        }
    }
})($)
/**
 * 下拉 菜单
 *
 */
;(function () {
    var contains = document.documentElement.contains ? function (parent, node) {
        return parent !== node && parent.contains(node)
    } : function (parent, node) {
        while (node && (node = node.parentNode))
            if (node === parent) return true;
        return false
    };

    function createDiv(el, opt) {
        this.$el = el;
        this.$options = Object.assign({
            menuWidth: 120,
            menuHeight: 200,
            width: '',
            height: '',
            text: '',
            icon: '',
            url: '',
            async: false,
            arguments: {},
            data: [],
            formatter: '',
            btnClick: function () {
            },
            menuClick: function () {
            }
        }, opt);
        var that = this;
        this.start = function () {

            if (this.$options.url) {
                let exceldata = $(el).attr('exceldata');
                if (exceldata) {
                    that.$options.data = JSON.parse(exceldata)
                } else {
                    xyzAjax({
                        url: that.$options.url,
                        data: that.$options.arguments,
                        async: that.$options.async,
                        success: function (data) {
                            if (data.status === 1) {
                                if (that.$options.formatter) {
                                    that.$options.data = that.$options.formatter(data)
                                } else {
                                    that.$options.data = data.content
                                }
                                $(el).attr('exceldata', JSON.stringify(that.$options.data))
                            }
                        }
                    });
                }
            }
        };
        this.render = function () {
            var _className = this.$options.icon ? ' drop-menu-box has-icon' : ' drop-menu-box';
            _className += mxApi.isPc() ? '' : ' phone';
            this.$el.innerHTML = '<span class="text-icon iconfont ' + this.$options.icon + '"></span>' +
                '<span>' + this.$options.text + '</span>' +
                '<span class="drop-icon iconfont icon-xitongxuankuangxiala"></span>';
            this.$el.className = this.$el.className + _className;
            
            var _dom = document.createElement('div');
            _dom.className = 'drop-wrap-box';
            _dom.innerHTML = '<div style="position:relative;width: 100%;height:100%;">' +
                '<div class="level-box level1"></div>' +
                '<i class="icon"></i>' +
                '<div class="level-box level2"></div>';
            '</div>';
            this.$el.appendChild(_dom);
            this.$box2 = this.$el.querySelector('.level2');
            this.$icon = this.$el.querySelector('.icon');
            this.updateLevel1()
        };
        this.setPosi = function () {
            if (this.$options.width) this.$el.style.width = this.$options.width + 'px';
            if (this.$el.style.height) {
                this.$el.style.height = this.$options.height + 'px';
                this.$el.style.lineHeight = this.$options.height + 'px';
            }
            var _width = this.$options.menuWidth;
            this.$icon.style.left = this.$options.menuWidth + 6 + 'px';
            var $box = this.$el.querySelector('.drop-wrap-box');
            $box.style.top = this.$el.getBoundingClientRect().height + 'px';
            $box.style.width = _width + 'px';
            $box.style.height = this.$options.menuHeight + 'px';
            this.$el.querySelector('.level1').style.width = _width + 'px';
            this.$el.querySelector('.level2').style.width = _width + 'px';
        };
        this.updateLevel1 = function () {
            this.$el.querySelector('.level1').innerHTML = '';
            var str = '';
            this.$options.data.forEach(function (val, index) {
                var _span = val.icon ? '<span class="usericon iconfont ' + val.icon + '"></span>' : '';
                var _icon = val.children && val.children.length > 0 ? '<span class="iconnext iconfont icon-xiayiyeyema"></span>' : '';
                var icon_class = _span ? 'hasicon' : '';
                str += '<p class="text-overflow ' + icon_class + '">' + _span + val.text + _icon + '</p>';
                !mxApi.isPc() && val.children && val.children.forEach(function (_val) {
                    var child_span = _val.icon ? '<span class="iconfont ' + _val.icon + '"></span>' : '';
                    str += '<p class="text-overflow level_2">' + child_span + _val.text + '</p>'
                })
            })
            this.$el.querySelector('.level1').innerHTML = str;
            this.$el.querySelectorAll('.level1 p').forEach(function (dom, index) {
                $(dom).attr('title', $(dom).text())
            })
        }
        this.updateLevel2 = function () {
            this.$el.querySelector('.level2').innerHTML = '';
            this.level2Index = this.level2Index || 0;
            var str = '';
            if (!this.$options.data[this.level2Index].children) return;
            this.$options.data[this.level2Index].children.forEach(function (val) {
                var _span = val.icon ? '<span class="iconfont ' + val.icon + '"></span>' : '';
                str += '<p class="text-overflow">' + _span + val.text + '</p>'
            })
            this.$el.querySelector('.level2').innerHTML = str;
            this.$el.querySelectorAll('.level2 p').forEach(function (dom, index) {
                dom.addEventListener('click', function () {
                    that.clickItem(that.$options.data[that.level2Index].children[index])
                })
            })
        }
        this.showBox2 = function () {
            this.$el.querySelector('.drop-wrap-box').style.width = this.$options.menuWidth * 2 + 20 + 'px';
            this.$box2.style.display = 'inline-block';
            this.$icon.style.display = 'block';
        }
        this.hideBox2 = function () {
            this.$el.querySelector('.drop-wrap-box').style.width = this.$options.menuWidth + 'px';
            this.$box2.style.display = 'none';
            this.$icon.style.display = 'none';
        }
        this.clickItem = function (data) {
            this.$options.menuClick(data);
            this.hideMenu()
        }
        this.showMenu = function () {
            this.$el.querySelector('.drop-wrap-box').style.display = 'inline-block';
            this.$el.querySelector('.drop-icon.icon-xitongxuankuangxiala').style.transform = 'rotate(180deg)';
            this.$el.querySelector('.drop-icon.icon-xitongxuankuangxiala').style.top = '-1px';
            this.hideBox2()
        }
        this.hideMenu = function () {
            var $box = this.$el.querySelector('.drop-wrap-box');
            if ($box.style.display !== 'inline-block') return;
            $box.style.display = 'none';
            this.$el.querySelector('.drop-icon.icon-xitongxuankuangxiala').style.transform = 'rotate(360deg)';
            this.$el.querySelector('.drop-icon.icon-xitongxuankuangxiala').style.top = '1px';
        }
        this.addEvents = function () {
            this.$el.addEventListener('click', function (e) {
                if (e.target.tagName == 'DIV' && e.target.className.indexOf('drop-menu-box') > -1) that.$options.btnClick();
                if (e.target.tagName && e.target.parentNode.className.indexOf('drop-menu-box') > -1) that.$options.btnClick();
            });
            this.$el.addEventListener('mouseenter', function () {
                that.showMenu();
            });
            this.$el.addEventListener('mouseleave', function () {
                that.hideMenu();
            })
            // 选项 event
            this.$el.querySelectorAll('.level1 p').forEach(function (element, index) {
                element.addEventListener('click', function () {
                    that.clickItem(that.$options.data[index]);
                })
                element.addEventListener('mouseenter', function (e) {
                    that.$el.querySelector('.icon').style.top = e.target.offsetTop + 10 + 'px';
                    that.level2Index = index;
                    that.updateLevel2();
                    that.$options.data[index].children && that.$options.data[index].children.length > 0 && that.showBox2();
                })
                element.addEventListener('mouseleave', function (e) {
                    var el_left = that.$el.getBoundingClientRect().left
                    var s_wi = e.target.offsetWidth;
                    if (e.pageX <= e.target.offsetLeft + s_wi + el_left - 20) {
                        that.hideBox2()
                    }
                    ;
                })
            });
        }
        this.addEventsMobile = function () {
            this.$el.addEventListener('click', function (e) {
                e = e || window.event;
                e.stopPropagation();
                !$(e.target).parents('.level-box.level1').length && that.showMenu();
            });
            this.$el.querySelectorAll('.level1 p').forEach(function (element, index) {
                element.addEventListener('click', function (e) {
                    e = e || window.event;
                    e.stopPropagation();
                    that.clickItem(that.$options.data[index]);
                    that.hideMenu();
                })
            });
            document.addEventListener('click', function (e) {
                !contains(that.$el, e.target) && that.hideMenu()
            })
        }
        this.init();
    }

    createDiv.prototype.init = function () {
        this.start();
        this.render();
        this.setPosi();
        mxApi.isPc() ? this.addEvents() : this.addEventsMobile();
    }
    createDiv.prototype.destroy = function () {
        this.$el.parentNode.removeChild(this.$el);
    }

    $.fn.dropMenu = function (opt) {
        new createDiv(this[0], opt)
    };
})()


/*
* @name: MxCheckbox插件
* @author: pls
* @update: 2019-1-23
* @descript:
* 插件为单选，多选组件框。
* 插件使用js原生代码
* 插件提供:init,setValue,getValue,getData,clear,checkRequired 6个方法
*
MxCheckbox.init({
id: 'demo', //插件id
width: "", //插件宽，可以不设置，css有最小值，以及自适应父级宽度
height: "", //插件高，可以不设置，css有最小值，以及自适应子元素高度
labelWidth: 80, //插件左边label宽度，可以不设置，默认值80，textalign为左
data: [{
  key: "sku1",
  keyLabel: "sku1英文",
  multiple: true,    //插件默认为false，单选
  required: true,   //必选，默认值false
  onSelect: function (data) {
  },
  data: [{
    text: "尺寸",
    value: "size"
  },{
    text: "尺寸备注",
    value: "size1"
  },]
}, {
  key: "sku2",
  keyLabel: "sku1英文",
  data: [{
    text: "尺寸备注",
    value: "size"
  }, {
    text: "尺寸1",
    value: "size1"
  },]
}],
});
MxCheckbox.setValue("demo", [
{key: "sku2", value: "size,size1"},
{key: "sku1", value: "size"}]
);
MxCheckbox.getValue("demo", "sku2")
MxCheckbox.getData("demo")
MxCheckbox.clear("demo")
MxCheckbox.checkRequired("demo")
*
* */
;(function () {
    //创建插件对象
    var MxCheckbox = {};
    //创建插件对象的集合
    var map = {};

    //创建插件的工厂对象
    function createCheckbox(option) {
        var vm = this;
        //浅拷贝传入值，以及设置默认值
        vm.$options = Object.assign({
            id: 'demo', //插件id
            width: "", //插件宽，可以不设置，css有最小值，以及自适应父级宽度
            height: "", //插件高，可以不设置，css有最小值，以及自适应子元素高度
            labelWidth: 80, //插件左边label宽度，默认值80，textalign为左
            data: [], //插件数据
        }, option);
        vm.$options.checkboxId = vm.$options.id + "_MxCheckbox";
        //初始化
        vm.init = function () {
            //创建插件外框
            vm.createBox();

            if (vm.$options.data.length == 0) {
                return
            }

            //创建插件组内分组
            vm.$options.data.forEach(function (data) {
                vm.createLi(data, "");
            });

        };

        //创建插件外框
        vm.createBox = function () {
            var parentNode = document.getElementById(vm.$options.id);
            var mxCheckBox = document.createElement("div");
            var ul = document.createElement("ul");
            mxCheckBox.id = vm.$options.checkboxId;
            mxCheckBox.className = "mxCheckBox";
            if (!!vm.$options.width) {
                mxCheckBox.style.width = vm.$options.width + "px";
            }
            if (!!vm.$options.height) {
                mxCheckBox.style.height = vm.$options.height + "px";
            }

            if (vm.$options.add) {
                var addGroupBox = document.createElement("a");
                var icoNode = document.createElement("i");
                var textNode = document.createTextNode("SKU选项缺失？点我新增");
                addGroupBox.className = "addGroup";
                addGroupBox.appendChild(icoNode);
                addGroupBox.appendChild(textNode);
                mxCheckBox.appendChild(addGroupBox);

                addGroupBox.onclick = function () {
                    vm.createAddGroupBox(vm.$options);
                };
            }
            mxCheckBox.appendChild(ul);
            parentNode.appendChild(mxCheckBox);
        };
        //创建增加组弹出框
        vm.createAddGroupBox = function (data) {
            var addGroupBox = document.createElement("div");
            var ul = document.createElement("ul");
            var liheader = document.createElement("li");
            var liLable = document.createElement("li");
            var liValue = document.createElement("li");
            var libutton = document.createElement("li");
            var spanLable = document.createElement("span");
            var spanValue = document.createElement("span");
            var spanInput = document.createElement("input");
            var valueInput = document.createElement("input");
            var buttonSure = document.createElement("button");
            var buttonCancel = document.createElement("button");
            var headerNode = document.createTextNode("新增SKU选项");
            var labelNode = document.createTextNode("选项名称");
            var valueNode = document.createTextNode("选项值");
            var sureNode = document.createTextNode("确定");
            var cancelNode = document.createTextNode("取消");

            addGroupBox.className = "addGroupBox";
            liLable.className = "groupLable";
            liValue.className = "groupValue";
            libutton.className = "button";

            spanLable.appendChild(labelNode);
            liheader.appendChild(headerNode);
            liLable.appendChild(spanLable);
            liLable.appendChild(spanInput);

            spanValue.appendChild(valueNode);
            liValue.appendChild(spanValue);
            liValue.appendChild(valueInput);

            buttonSure.appendChild(sureNode);
            buttonCancel.appendChild(cancelNode);
            libutton.appendChild(buttonSure);
            libutton.appendChild(buttonCancel);

            ul.appendChild(liheader);
            ul.appendChild(liLable);
            ul.appendChild(liValue);
            ul.appendChild(libutton);

            addGroupBox.appendChild(ul);

            /*   html结构如下
                 var addGroupBox = "<div class='addGroupBox'>" +
                                     "<ul>" +
                                      "<li class='groupLable'><span>文本</span><input type='text'></li>"   +
                                      "<li class='groupValue'><span>值</span><input type='text'></li>"   +
                                      "<li class='groupRequired'><span>是否必选</span>" +
                                     "<label><input type='radio' name='required' value='0'>否</label>>"   +
                                     "<label><input type='radio' name='required' value='1'>是</label></li>"   +
                                      "<li class='button'><button>确定</button><button>取消</button></li>"   +
                                     "</ul></div>";*/

            var mxCheckBox = document.querySelector("#" + vm.$options.id + " .mxCheckBox");
            mxCheckBox.appendChild(addGroupBox);

            buttonCancel.onclick = function () {
                mxCheckBox.removeChild(addGroupBox);
            };
            buttonSure.onclick = function () {
                //获取值
                var text = document.querySelector(".mxCheckBox .addGroupBox .groupLable input").value;
                var value = document.querySelector(".mxCheckBox .addGroupBox .groupValue input").value;
                //判断是否重复
                var more = false;
                vm.$options.data.forEach(function (data) {
                    if (data.keyLabel == text) {
                        more = true;
                    }
                });

                if (more == true) {
                    vm.creatAlert("【" + text + "】重复，请您重新输入。");
                    document.querySelector(".mxCheckBox .addGroupBox .groupLable input").value = "";
                    return
                }
                if (text == "" || text == " ") {
                    vm.creatAlert("【选项名称】为空，请您输入值。");
                    return
                }
                var d = {
                    key: text,
                    keyLabel: text,
                    required: true,
                    add: true,
                    data: [{
                        text: value,
                        value: ""
                    }]
                };

                data.data.push(d);
                vm.createLi(d, "remove");
                //移除创建框
                mxCheckBox.removeChild(addGroupBox);
            };
        };
        //创建alert弹框
        vm.creatAlert = function (msg) {
            var addGroupBox = document.createElement("div");
            var ul = document.createElement("ul");
            var liheader = document.createElement("li");
            var liLable = document.createElement("li");
            var libutton = document.createElement("li");
            var spanLable = document.createElement("span");
            var buttonSure = document.createElement("button");
            var headerNode = document.createTextNode("提示");
            var labelNode = document.createTextNode(msg);
            var sureNode = document.createTextNode("确定");

            addGroupBox.className = "mxCheckboxAlert";
            liLable.className = "groupLable";
            libutton.className = "button";

            spanLable.appendChild(labelNode);
            liheader.appendChild(headerNode);
            liLable.appendChild(spanLable);

            buttonSure.appendChild(sureNode);
            libutton.appendChild(buttonSure);

            ul.appendChild(liheader);
            ul.appendChild(liLable);
            ul.appendChild(libutton);

            addGroupBox.appendChild(ul);

            var mxCheckBox = document.querySelector("#" + vm.$options.id + " .mxCheckBox");
            mxCheckBox.appendChild(addGroupBox);

            buttonSure.onclick = function () {
                //移除创建框
                mxCheckBox.removeChild(addGroupBox);
            };
        };
        //创建插件组内分组
        vm.createLi = function (data, remove) {
            var ul = document.querySelector("#" + vm.$options.id + " ul");
            var li = document.createElement("li");
            var label = document.createElement("div");
            var labelText = document.createTextNode(data.keyLabel);
            var checkData = document.createElement("div");

            checkData.className = "checkData";
            checkData.setAttribute("mxKey", data.key);
            //全部为必选
            data.required = true;
            label.className = data.required == true || data.required == "true" ? "label required" : "label";

            if (!!vm.$options.labelWidth) {
                label.style.width = vm.$options.labelWidth + "px";
            }
            label.appendChild(labelText);

            li.appendChild(label);
            li.appendChild(checkData);

            li.setAttribute("mxKey", data.key);
            ul.appendChild(li);

            var d = data.data || [];

            if (d.length !== 0 && remove !== "remove") {
                d.forEach(function (t) {
                    vm.createSpan(checkData, t, data);
                });
            }

            if (!!data.add) {
                var t = {text: "", value: ""};
                var checkSpan = document.createElement("span");
                var checkInput = document.createElement("input");
                var checkDefalt = document.createElement("input");
                var checkLabel = document.createElement("label");
                var defaultNode = document.createTextNode("默认");

                checkInput.setAttribute("type", "text");
                checkInput.setAttribute("mxValue", t.text);
                checkInput.setAttribute("mxKey", data.key);

                checkDefalt.setAttribute("type", "checkbox");
                checkDefalt.className = "mxCheckbox";

                checkLabel.appendChild(checkDefalt);
                checkLabel.appendChild(defaultNode);

                checkSpan.appendChild(checkInput);
                checkSpan.appendChild(checkLabel);

                checkData.appendChild(checkSpan);
                checkSpan.setAttribute("mxValue", "");
                checkSpan.setAttribute("mxKey", "addSpan");


                checkInput.readOnly = true;
                checkDefalt.onclick = function () {
                    checkInput.onfocus();
                    if (checkInput.readOnly == true) {
                        checkDefalt.checked = false;
                        return
                    }

                    if (checkDefalt.checked == true) {
                        checkInput.value = "默认";

                    } else {
                        checkInput.value = "";
                    }
                };

                checkInput.oninput = function (el) {
                    var that = this;
                    vm.$options.data.forEach(function (t, index) {
                        if (t.key == that.getAttribute("mxkey")) {
                            vm.$options.data[index].text = that.value;
                        }
                    });
                    that.setAttribute("mxvalue", that.value);
                };
                checkInput.onblur = function () {
                    if (checkDefalt.checked == true) {
                        checkDefalt.checked = false;
                    }
                    var that = this;
                    var text = that.value;
                    var data = d || [];
                    data.forEach(function (t, index) {
                        if (t.text == text) {
                            vm.creatAlert("【" + text + "】重复，请您重新输入。");
                            that.value = "";
                        }
                    });
                    vm.$options.data.forEach(function (t, index) {
                        if (t.key == that.getAttribute("mxkey")) {
                            vm.$options.data[index].text = that.value;
                        }
                    });
                    that.setAttribute("mxvalue", that.value);
                };
                checkInput.onfocus = function () {
                    var $el = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + data.key + "'] .checkData .checked");

                    if ($el.length > 0) {
                        checkInput.readOnly = true;
                    } else {
                        checkInput.readOnly = false;
                    }
                };

                if (remove == "remove") {
                    var remove = document.createElement("i");
                    checkInput.value = data.data[0].text;

                    remove.className = "iconfont icon-delete";
                    remove.onclick = function () {
                        vm.$options.data.forEach(function (t, index) {
                            if (t.key == checkInput.getAttribute("mxkey")) {
                                vm.$options.data.splice(index, 1)
                            }
                        });
                        ul.removeChild(li);
                    };

                    checkData.appendChild(remove);
                }

            }


        };
        //创建插件分组内数据
        vm.createSpan = function (el, data, parentData) {
            var $checkData = el;
            var checkSpan = document.createElement("span");
            var checkTextNode = document.createTextNode(data.text);

            checkSpan.appendChild(checkTextNode);
            checkSpan.setAttribute("mxValue", data.value);
            checkSpan.setAttribute("mxKey", parentData.key);
            data['from'] = data['from'] || [];
            checkSpan.setAttribute("from", data['from'].join(","));
            $checkData.appendChild(checkSpan);

            checkSpan.onclick = function () {
                var $span = this;

                //判断input框是否有值
                if (!!parentData.add) {
                    var addSpan = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + parentData.key + "'] [mxkey='addSpan'] input[type='text']")[0];
                    var addSpanValue = addSpan.value;

                    if (addSpanValue.length > 0) {
                        return
                    }
                }

                if ($span.className == "disable") {
                    return
                }

                var checked = false; //判断是否被选中

                if ($span.className == "checked") {
                    $span.className = "";
                    checked = true; //判断为被选中，取消选中状态，不执行选中操作
                }

                if (!checked) {
                    var $el = document.querySelectorAll("#" + vm.$options.id + " [mxkey='" + parentData.key + "'] .checkData span");
                    var length = $el.length;

                    for (var i = 0; i < length; i++) {
                        $el[i].className = $el[i].className == "disable" ? "disable" : "";
                    }

                }

                var all = document.querySelectorAll("#" + vm.$options.id + " .checkData span[from]");
                //判断是否禁用
                var isCheck = false;
                all.forEach(function (t) {
                    if (t.className == "checked") {
                        isCheck = true;
                    }
                });

                if (!isCheck) {
                    var from = $span.getAttribute("from");
                    all.forEach(function (t) {
                        var fromList = t.getAttribute("from");
                        var spanFrom = from.split(",") || [];
                        var match = false;
                        spanFrom.forEach(function (f) {
                            if (fromList.indexOf(f) > -1) {
                                match = true
                            }
                        });
                        if (match) {
                            t.className = t.className == "checked" ? "checked" : "";
                        } else {
                            t.className = "disable";
                        }
                    });
                }

                if (!checked) {
                    $span.className = "checked";
                } else {
                    $span.className = "";
                    if (!isCheck) {
                        all.forEach(function (t) {
                            if (t.className == "disable") {
                                t.className = "";
                            }
                        });
                    }
                }

                if (typeof parentData.onSelect == "function") {
                    var allData = vm.getData(vm.$options.id);
                    parentData.onSelect(allData, {
                        key: parentData.key,
                        keyLabel: parentData.keyLabel,
                        value: $span.getAttribute("mxvalue"),
                        text: $span.innerText
                    });
                }

            }
        };
        //设置插件默认值方法
        vm.setValue = function (el, data) {
            var data = data;
            if (typeof data == 'string') {
                alert("请传入数组结构")
                return
            }

            data.forEach(function (d) {
                var key = d.key;
                var value = d.value;

                if (typeof value == "string") {
                    value = value.split(",")
                }

                value.forEach(function (t) {
                    var tt = t;
                    vm.$options.data.forEach(function (data) {
                        if (key == data.keyLabel) {
                            key = data.key;

                            var spanData = data.data || [];
                            spanData.forEach(function (arr) {
                                if (tt.replace(/\s/g, '') == arr.text.replace(/\s/g, '')) {
                                    tt = arr.value;
                                }
                            });
                        }
                    });
                    var $el = document.querySelector("#" + el + " [mxkey='" + key + "'] .checkData [mxvalue='" + tt + "']");
                    if ($el !== null) {
                        $el.className = "checked";
                    }
                });
            });
        };
        //获取插件组内选中值
        vm.getValue = function (el, key) {
            var $el = document.querySelectorAll("#" + el + " [mxkey='" + key + "'] .checkData .checked");
            var length = $el.length;
            var arr = [];

            if (length == 0) {
                var $el = document.querySelectorAll("#" + el + " [mxkey='" + key + "'] input[type='text']");
                var value = "";
                var text = "";

                if ($el.length > 0) {
                    value = "";
                    text = $el[0].value;
                }

                arr.push({
                    value: value,
                    text: text
                });

                return arr
            }

            for (var i = 0; i < length; i++) {
                var value = $el[i].getAttribute("mxvalue");
                var text = $el[i].innerText;
                arr.push({
                    value: value,
                    text: text
                })
            }

            return arr
        };
        //获取插件所有选中值
        vm.getData = function (el) {
            var $el = document.querySelectorAll("#" + el + " li");
            var length = $el.length;
            var arr = [];

            for (var i = 0; i < length; i++) {
                var mxkey = $el[i].getAttribute("mxkey");
                var data = vm.getValue(el, mxkey);
                var value = "";
                var text = "";
                var keyLabel = "";

                data.forEach(function (t, index) {
                    value = value + t.value + (data.length == index + 1 ? "" : ",");
                    text = text + t.text + (data.length == index + 1 ? "" : ",");
                });

                vm.$options.data.forEach(function (t) {
                    if (t.key == mxkey) {
                        keyLabel = t.keyLabel;
                    }
                });

                if (mxkey == "labelAdd") {
                    continue
                }
                arr.push({
                    key: mxkey,
                    keyLabel: keyLabel,
                    value: value,
                    text: text
                })
            }
            ;
            return arr
        };
        //清空插件所有选中值
        vm.clear = function (el) {
            var $el = document.querySelectorAll("#" + el + " .checkData span");
            var length = $el.length;

            for (var i = 0; i < length; i++) {
                $el[i].className = "";
            }
            var spaninput = document.querySelectorAll("#" + el + " .checkData [mxkey='addSpan'] input[type='text']");
            var spanCheckbox = document.querySelectorAll("#" + el + " .checkData [mxkey='addSpan'] input[type='checkbox']");

            for (var i = 0; i < spaninput.length; i++) {
                spaninput[i].value = "";
                spaninput[i].setAttribute("mxvalue", "");
                spanCheckbox[i].checked = false;
            }
        };

        //检查必选
        vm.checkRequired = function (el) {
            var data = vm.getData(el);
            var text = "";
            vm.$options.data.forEach(function (t) {
                data.forEach(function (d) {
                    if (t.key == d.key && (t.required == true || t.required == "true")) {
                        text = text + (d.text == "" ? t.keyLabel + "的值为必选。" : "");
                    }
                })
            });
            return text
        };

        //销毁插件
        vm.destroy = function (el) {
            delete map[el];
            var child = document.querySelectorAll("#" + el + " #" + el + "_MxCheckbox")[0];
            document.querySelectorAll("#" + el)[0].removeChild(child);
        };
    }

    //初始化插件
    MxCheckbox.init = function (data) {
        if (!data || Object.keys(data).length == 0) {
            alert("请您传入配置数据。");
            return
        }

        var parentNode = document.querySelector("#" + data.id);
        if (!parentNode) {
            alert("未找到插件挂载元素。");
            return
        }

        if (!map[data.id]) {
            map[data.id] = new createCheckbox(data);
            map[data.id].init();
        } else {
            alert("您已经创建过相同id的插件。")
        }
    };
    //设置插件选中值
    MxCheckbox.setValue = function (el, data) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        map[el].setValue(el, data);
    };
    //获取插件组内数据的选中值
    MxCheckbox.getValue = function (el, key) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。");
            return
        }
        return map[el].getValue(el, key);
    };
    //获取插件全部选中值
    MxCheckbox.getData = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].getData(el);
    };
    //清除插件的选中值
    MxCheckbox.clear = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].clear(el);
    };
    //检查必选
    MxCheckbox.checkRequired = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        return map[el].checkRequired(el);
    };
    //销毁插件
    MxCheckbox.destroy = function (el) {
        if (!map[el]) {
            alert("您没有创建id为" + el + "的mxcheckBox组件。")
            return
        }
        map[el].destroy(el);
    };
    //插件外抛
    window.MxCheckbox = MxCheckbox;
})();
/**
 * createVerify 数字加运算 验证
 * Created by cl on 2019/4/9.
 * @param{
 *      enable: true   是否开启验证
 * }
 * @method{
 *      getResult(id?) return Boolean; // 返回验证结果
 * }
 */
;(function () {
    // tool function
    function match(val1, val2, result) {
        if (isNaN(val1) || isNaN(val2) || !result) return false;
        if (!isNaN(result)) return Number(val1) + Number(val2) == result; // 结果为数字
        var suc_res = val1 + '+' + val2;
        var str = result.replace(/ /g, '');
        return str === suc_res || str === suc_res + '=';
    }

    function createVerify(option) {
        this.$option = Object.assign({}, {
            enable: true,
            number1: 0,
            number2: 0,
            min: 0,
            max: 100,
        }, option)
        this.$el = document.querySelector('#' + this.$option.id);
        this.$el.classList.add('verify-box');
        if (!this.$el) return console.error('createVerify id不存在');
        this.init();

        this.updateStatus = function () {
            var target = document.querySelector('#' + this.$option.id).querySelector('input');
            var value = target.getAttribute('data');
            var enable = target.getAttribute('enable') === 'true'; // 是否开启 验证

            var result = match(this.$option.number1, this.$option.number2, value);
            var $icon = this.$el.querySelector('span.status');
            var _className = 'status iconfont ';
            if (enable) {
                _className += result ? 'icon-ok' : 'icon-no';
            }
            $icon.className = _className;
        }
        this.clearStatus = function () {
            var $icon = this.$el.querySelector('span.status');
            $icon.className = 'status iconfont ';
        }
    }

    createVerify.prototype.init = function () {
        var max_n = this.$option.max,
            min_n = this.$option.min;
        this.$option.number1 = Math.floor(Math.random() * (max_n - min_n)) + min_n;
        this.$option.number2 = Math.floor(Math.random() * (max_n - min_n)) + min_n;
        this.text_str = this.$option.number1 + ' + ' + this.$option.number2 + ' =';

        this.render();
    }
    createVerify.prototype.render = function () {
        var that = this;
        var $div = document.createElement('span');
        $div.className = 'text';
        $div.innerHTML = this.text_str;
        this.$el.innerHTML = '';
        this.$el.appendChild($div);

        var $input = document.createElement('input');
        $input.className = 'verify-input';
        $input.setAttribute('enable', this.$option.enable);
        $input.addEventListener('input', function (e) {
            e.target.setAttribute('data', e.target.value);
        })
        $input.addEventListener('focus', function (e) {
            that.clearStatus();
        })
        $input.addEventListener('blur', function (e) {
            that.updateStatus();
        })
        this.$el.appendChild($input);

        // status icon
        var $span = document.createElement('span');
        $span.className = 'status iconfont';
        this.$el.appendChild($span);
    }
    // get result: Boolean
    createVerify.prototype.getResult = function () {
        var target = document.querySelector('#' + this.$option.id).querySelector('input');
        var value = target.getAttribute('data');
        var enable = target.getAttribute('enable');
        if (!enable) return true; // 验证 未开启
        var result = match(this.$option.number1, this.$option.number2, value);
        // console.log('验证结果：', result,this.$option.number1, this.$option.number2, value);
        return result;
    }
    // refresh number
    createVerify.prototype.reload = function () {
        this.init();
        that.clearStatus();
    }
    // numberVerifyObj: Object  保存实例对象
    window.createVerify = function (opt) {
        window.numberVerifyObj = window.numberVerifyObj || {};
        window.numberVerifyObj[opt.id] = new createVerify(opt);
        return window.numberVerifyObj[opt.id];
    };
})();

//初始化当前iframe标题和收藏功能
class moduleTileConstructor {
    constructor() {
        let $this = this;
        this.config = mxApi.getUrlArgument();
        this.container = document.createElement('div');
        this.container.style.display = 'none';
        this.container.id = "moduleTile";
        this.leftPart = document.createElement('div');
        this.leftPart.innerHTML = this.config.mxgroupCn + '一' + this.config.mxnameCn;
        this.rightPart = document.createElement('div');
        this.txt = document.createElement('span');
        this.icon = document.createElement('span');
        this.rightPart.addEventListener('click', function () {
            $this.changeCollection($this)
        });
        this.botherele = document.querySelector('.datagridBox');
        if (this.botherele) {
            this.botherele.parentElement.insertBefore(this.container, this.botherele);
            this.container.style.display = 'flex';
        }
    }

    //初始化
    init(obj) {
        if (!('mxnumberCode' in this.config && 'mxnameCn' in this.config)) {
            this.container.innerHTML === '' && (this.container.style.display = 'none');
            return
        }
        this.container.innerHTML = '';
        this.container.appendChild(this.leftPart);
        this.container.appendChild(this.rightPart);
        //判断是否在收藏内
        let collection = obj.some(e => {
            if (e.numberCode === this.config.mxnumberCode) {
                return true
            }
        });
        this.txt.innerText = collection ? '取消收藏' : '加入收藏';
        this.icon.classList.add('iconfont');
        this.icon.classList.add(collection ? 'icon-shoucang1' : 'icon-shoucang');
        this.rightPart.appendChild(this.txt);
        this.rightPart.appendChild(this.icon);
        this.container.innerHTML === '' && (this.container.style.display = 'none');
    }

    //改变收藏
    changeCollection(e) {
        let $this = e;
        if ($this.txt.innerText === "加入收藏") {
            xyzAjax({
                url: 'MySystemWS/addMySystem.do',
                async: true,
                data: {
                    fun: $this.config.mxnumberCode,
                    nameCn: $this.config.mxnameCn,
                    appId: $this.config.mxappId
                },
                success: data => {
                    if (data.status === 1) {
                        top.app.getMyCollection(top.app.mxSys);
                        $this.txt.innerText = '取消收藏';
                        $this.icon.classList.remove('icon-shoucang');
                        $this.icon.classList.add('icon-shoucang1');
                        top.$.messager.alert("提示", '已添加到收藏夹', "warning");
                    }
                }
            })
        } else {
            xyzAjax({
                url: 'MySystemWS/deleteMySystem.do',
                async: true,
                data: {
                    numberCode: $this.config.mxnumberCode,
                    appId: $this.config.mxappId
                },
                success: data => {
                    if (data.status === 1) {
                        top.app.getMyCollection(top.app.mxSys);
                        $this.txt.innerText = '加入收藏';
                        $this.icon.classList.remove('icon-shoucang1');
                        $this.icon.classList.add('icon-shoucang');
                        top.$.messager.alert("提示", '已从收藏夹移除', "warning");
                    }
                }
            })
        }
    }
}

window.onload = function () {
    autoAddMeta();

    if (!mxInfo.isMainFrame && !mxApi.isPc()) {
        let moduleTile = new moduleTileConstructor();
        moduleTile.init(top.userCollection);
        initRem()
        weChatInputBug()
    }
    if (top.userBaseInfo) {
        //配置自定义缩放
        let res = top.getLocalUserInfo('zoom', top.userBaseInfo.securityUser.username);
        if (res === "close") {
            $('body').css('zoom', '1')
        }
    }
}

// fixed 微信内容 软键盘收起，页面未回滚bug
function isWeiXinAndIos() {
    let ua = '' + window.navigator.userAgent.toLowerCase()
    let isWeixin = /MicroMessenger/i.test(ua)
    let isIos = /\(i[^;]+;( U;)? CPU.+Mac OS X/i.test(ua)
    return isWeixin && isIos
}

function weChatInputBug() {
    let myFunction
    let isWXAndIos = isWeiXinAndIos();
    if (isWXAndIos) {
        document.body.addEventListener('focusin', () => {
            clearTimeout(myFunction)
        })
        document.body.addEventListener('focusout', () => {
            clearTimeout(myFunction)
            myFunction = setTimeout(function () {
                top.scrollTo({top: 0, left: 0, behavior: 'smooth'})
            }, 200)
        });
    }
    // 原生alert携带网址信息在移动端体验不友好
    window.alert = function (name) {
        var iframe = document.createElement("IFRAME");
        iframe.style.display = "none";
        iframe.setAttribute("src", 'data:text/plain,');
        document.documentElement.appendChild(iframe);
        window.frames[0].window.alert(name);
        iframe.parentNode.removeChild(iframe);
    }
}

function initRem() {
    var maxWidth = 768;
    var minWidth = 320;
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth;
    if (width > maxWidth) {
        width = maxWidth;
    } else if (width < minWidth) {
        width = minWidth;
    }

    var fontSize = (width / maxWidth) * 100;
    document.getElementsByTagName('html')[0].style.fontSize = fontSize + 'px';
    if (document.getElementsByTagName('body').length > 0) {
        document.getElementsByTagName('body')[0].style.fontSize = '0.14rem';
    }

    window.addEventListener('orientationchange' in window ? 'orientationchange' : 'resize', initRem, false);
    document.addEventListener('DOMContentLoaded', initRem, false);
}

// 注入缓存meta
// <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
// <meta http-equiv="Pragma" content="no-cache" />
// <meta http-equiv="Expires" content="0" />
function autoAddMeta() {
    // 插入 meta 标签
    var oMeta1 = document.createElement('meta');
    oMeta1.httpEquiv = 'Cache-Control';
    oMeta1.content = 'no-cache, no-store, must-revalidate';

    var oMeta2 = document.createElement('meta');
    oMeta2.httpEquiv = 'Pragma';
    oMeta2.content = 'no-cache';

    var oMeta3 = document.createElement('meta');
    oMeta3.httpEquiv = 'Expires';
    oMeta3.content = '0';

    var _head = document.getElementsByTagName('head')[0];
    _head.appendChild(oMeta1);
    _head.appendChild(oMeta2);
    _head.appendChild(oMeta3);
}

/**
 * previewPDF
 */
(function () {
    // 创建元素
    function element(ele, className, text) {
        var $dom = document.createElement(ele);
        $dom.className = className || '';
        $dom.innerHTML = text || '';
        return $dom
    }

    function previewPDF(opt) {

        this.option = opt;
        this.$options = Object.assign({
            title: '',
            width: 'calc(100% - 20px)',
            height: 'calc(100% - 20px)',
            receipt: '',
            mainKey: '',
            queryJson: '',
            buttons: [],
            url: '',
        }, opt);
        // 默认按钮列表
        var _this = this;
        if (this.$options.modelSourceType !== 'jasper' && this.$options.modelSourceType !== '') {
            this.default_btns = [{
                type: 'backup',
                text: '单据备份'
            }, {
                type: 'PDF',
                text: '下载Pdf'
            }, {
                type: 'docx',
                text: '下载word(docx)'
            }, {
                type: 'doc',
                text: '下载word(doc)'
            }, {
                type: 'HTML',
                text: '打印'
            }];
        } else if (this.$options.modelSourceType === 'jasper' || this.$options.modelSourceType === '') {
            this.default_btns = [{
                type: 'backup',
                text: '单据备份'
            }, {
                type: 'PDF',
                text: '下载Pdf'
            }, {
                type: 'EXCEL',
                text: '下载Excel'
            }, {
                type: 'doc',
                text: '下载word(doc)'
            }, {
                type: 'HTML',
                text: '打印'
            }];
        }
        this.init = function () {
            // 蒙层 panel
            var $panel = element('div', 'preview-panel-box');
            document.body.appendChild($panel);
            this.ele = $panel;
            // content容器
            var $box = element('div', 'preview-box');
            $box.style.width = typeof this.$options.width === 'number' ? this.$options.width + 'px' : this.$options.width;
            $box.style.height = typeof this.$options.height === 'number' ? this.$options.height + 'px' : this.$options.height;
            $panel.appendChild($box);
            // header
            var $header = element('div', 'preview-header', this.$options.title);
            $box.appendChild($header);
            // back icon
            var $icon = element('span', 'close-icon', 'x');
            $header.appendChild($icon);
            $icon.addEventListener('click', function () {
                _this.destroy()
            });
            // pdf show box
            var $section = element('div', 'preview-section');
            $box.appendChild($section);

            // footer buttons
            var $footer = element('div', 'preview-footer');
            $box.appendChild($footer);
            this.createButtons();
            this.getData({
                type: 'pdf',
                receipt: this.$options.receipt,
                mainKey: this.$options.mainKey
            }, function (data) {
                _this.$options.url = data.url;
                let $section = _this.ele.querySelector('.preview-section');
                var $pdfbox = element('embed', 'content');
                $pdfbox.src = data.url;
                $pdfbox.type = "application/pdf";
                $section.appendChild($pdfbox)
            })
        };
        this.createButtons = function () {
            var $btn = this.ele.querySelector('.preview-footer');
            // 默认按钮
            this.default_btns.forEach(function (obj) {
                var $a = element('a', '', obj.text);
                $a.addEventListener('click', function () {
                    if (obj.type === 'backup') {  //单据备份
                        xyzAjax({
                            url: '/datasup_ReceiptBackUpWS/addReceiptBackUp.do ',
                            data: {
                                type: obj.type,
                                receipt: _this.$options.receipt,
                                mainKey: _this.$options.mainKey,
                                queryJson: _this.$options.queryJson,
                                modelSourceType: _this.$options.modelSourceType,
                                url: _this.$options.url,
                            },
                            async: true,
                            success: function (dataJson) {
                                if (dataJson.status === 1) {
                                    top.$.messager.alert("提示", '单据备份成功！', "warning", 'success');
                                } else {
                                    top.$.messager.alert("警告", dataJson.msg, "warning");
                                }
                            }
                        });
                    } else {
                        {
                            _this.getData({
                                type: obj.type,
                                receipt: _this.$options.receipt,
                                mainKey: _this.$options.mainKey,
                                queryJson: _this.$options.queryJson,
                                modelSourceType: _this.$options.modelSourceType,
                            }, function (data) {
                                if (obj.type === 'HTML' || obj.type === 'html') {
                                    _this.createiframe(data.url)
                                } else {
                                    // data.url && window.open(data.url);
                                    var el1 = document.createElement('a');
                                    el1.setAttribute("target", "_blank");
                                    el1.setAttribute("id", "openWin");
                                    el1.setAttribute("href", data.url);
                                    document.body.appendChild(el1);
                                    document.getElementById("openWin").click();//点击事件
                                    document.body.removeChild(el1);
                                }
                            })
                        }
                    }
                });
                $btn.appendChild($a)
            });
            // 用户按钮
            this.$options.buttons.forEach(function (obj) {
                var $a = element('a', '', obj.text);
                typeof obj.handle === 'function' && $a.addEventListener('click', obj.handle);
                $btn.appendChild($a)
            })
        };
        this.init();
    }

    previewPDF.prototype.getOption = function () {
        return this.option;
    };
    previewPDF.prototype.getType = function () {
        return [
            {text: 'PDF', value: 'PDF'},
            {text: 'WORD', value: 'WORD'},
            {text: 'EXCEL', value: 'EXCEL'},
            {text: 'HTML', value: 'HTML'}
        ]
    };
    previewPDF.prototype.getData = function (data, cb) {
        let result;
        //加载动画
        let loading = "<div class='xyzgridMask'><div class='spinner'><span>加载中</span><div class='bounce1'></div><div class='bounce2'></div><div class='bounce3'></div></div></div>";
        $(".xyzgridMask").remove();
        $(".preview-section").append(loading);
        xyzAjax({
            url: '/datasup_ReceiptWS/downloadReceipt.do',
            data: data,
            async: true,
            success: function (dataJson) {
                if (dataJson.status === 1) {
                    $(".xyzgridMask").remove();
                    typeof cb === 'function' && cb(dataJson.content);
                    result = dataJson.content;
                } else {
                    top.$.messager.alert("警告", dataJson.msg, "warning");
                    $(".xyzgridMask").remove();
                }
            }
        });

        return result;
    };
    previewPDF.prototype.destroy = function () {
        this.ele.parentNode.removeChild(this.ele);
    };
    previewPDF.prototype.createiframe = function (url) {
        $('.print-content').remove();
        let $section = this.ele.querySelector('.preview-section');
        let $printiframe = element('iframe', 'print-content');
        $section.appendChild($printiframe);
        $printiframe.style.display = 'none';

        $.ajax({
            url: url,
            success: function (data) {
                $printiframe.contentDocument.write(data);
                let $table = $(".print-content").contents().find("table");
                let $td = $(".print-content").contents().find("td");
                $table.css('max-width', '100%');
                $td.css('position', 'relative');
                let time = setTimeout(function () {
                    $printiframe.contentWindow.print();
                    clearTimeout(time);
                }, 500)
            }
        });
    };
    window.previewPDF = previewPDF;
})();

/**
 * @name: 配置机构用户习惯
 * @author: pls
 * @update: 2019-12-5
 * @descript:
 */
function isSetVrSystem() {
    if (!top.app || (top.app && !top.app.setVirtualAppStatus) ) {
      return
    }
    window.virtualData = []
    let p = document.createElement('p')
    p.setAttribute('style','position: fixed;right: 20px;bottom: 42px;z-index: 30;width:104px;height:70px;text-align:center;')
    let h3 = document.createElement('h3')
    let node = document.createTextNode('设置屏蔽字段')
    h3.setAttribute('style','user-select: none;margin:0;padding:0;cursor: move;')
    h3.onmousedown = function (e) {
        var e = e || window.event;
        let x = e.clientX - p.offsetLeft
        let y = e.clientY - p.offsetTop
        document.onmousemove = function(e){
            //拖拽时距离文档left与top距离 减去 距离拖拽物的left与top距离 = 拖拽物的位置
            p.style.right = 'initial'
            p.style.bottom = 'initial'
            p.style.left = e.clientX - x + 'px';
            p.style.top = e.clientY - y + 'px';
        }
        document.onmouseup = function(){
            //清除事件
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    h3.appendChild(node)
    p.appendChild(h3)

    let ico = document.createElement('span')
    ico.id = 'setVirtual';
    ico.className = 'iconfont icon-xian-buguize-bianjibiaoge'
    ico.setAttribute('style','font-size: 50px;color: #369ef6;background: #fff;cursor: pointer;')
    ico.onclick = function (e) {
        setOpitionsBasic()
    }
    p.appendChild(ico)

    $('body').append(p)
}
function setOpitionsBasic() {
  if (window.virtualData.length === 0){
    top.$.messager.alert("警告", '该页面没有查询条件或者表格', "warning");
    return
  }

  let setStyle = '<style>'
  setStyle += ' #basicConfig .MForm-input>div {display: grid;grid-template-columns: 27px auto;}'
  setStyle += ' #basicConfig { width: initial !important;height: 100% !important;left:0;right:0;top:0;transform:initial}'
  setStyle += ' #basicConfig .MForm-label{font-weight: bold;}'
  setStyle += '</style>'
  $("body").append(setStyle)

  // 获取title
  let title = top.app.iframeGroup[top.app.tabsSelected].iframe.config.nameCn
  // 获取virtualApp
  let virtualApp  = top.app.iframeGroup[top.app.tabsSelected].iframe.config.appId
  // 获取virtualAppFunctionSettings
  let virtualAppFunctionSettings = []
  let tab = parent.document.getElementsByTagName('iframe')[0].id;
  let pathName = window.location.host + window.location.pathname;
  let keyCode = tab + "_" + pathName

  window.virtualData.forEach(function (item,index) {
      item[0].options.value = getVirtualAppSetting(item[0].mxkey)
  })

  MaytekF.init({
    id:'basicConfig',
    title:'管理【'+title+'】模块屏蔽字段',
    buttons: [
      {
        text: '配置',
        handler: function (data) {
            for (let c in data) {
              updateVirtualAppSetting(c,data[c])
              send(c,data[c])
            }

        }
      },{
        text: '关闭',
        handler: function (data) {

        }
      }
    ],
    tabs:[
      {
        title: '查询条件配置项',
        content: window.virtualData
      }],
    onLoad:function (data) {
      $("#basicConfig .MaytekF-headerTool").hide();
    }
  });

  function send(id,data) {
    xyzAjax({
      url: '/VirtualAppWS/setVirtualAppFunctionSettings.do',
      data: {
        virtualApp: virtualApp,//
        keyCode: keyCode + id,
        content: data,
      },
      async: true,
      success: function(data){
          if (data.status === 1 ){
              top.$.messager.alert("提示",'配置成功,重新刷新生效')
              MaytekF.destroy('basicConfig');

         /*     let virtualData = window.virtualData.concat()
              window.virtualData = []
              virtualData.forEach(function(item){
                  if (item[0].mxkey.indexOf('_xyzgrid_')){
                      console.log(item[0].orginOptions)
                      xyzgrid(item[0].orginOptions)
                  } else {
                      console.log(item[0].orginOptions)
                      MaytekQ.init(item[0].orginOptions)
                  }
              })*/
          } else {
              top.$.messager.alert("提示",data.msg,'warning')
          }
      }
    })
  }
}
// 获取表单虚拟系统屏蔽字段
function getxyzgridVrData(gridData) {
    if (!top.app || (top.app && !top.app.setVirtualAppStatus) ) {
      return
    }
    let data = []
    gridData.columns.forEach(function(arr,index1) {
        arr.forEach(function (item, index2) {
            if (item.field !== 'checkboxTemp') {
                data.push({value: item.field, text: item.title})
            }
        })
    })

    // 获取virtualAppFunctionSettings.maytekQ
    window.virtualData.push([{
        mxkey: "_xyzgrid_" + gridData.table,
        label: '配置：表格列表',
        type: 'checkbox',
        options:{
            data: data,
        },
        orginOptions:gridData
    }])
}
// 获取查询条件虚拟系统屏蔽字段
function getmaytekQVrData(maytekQData) {
    if (!top.app || (top.app && !top.app.setVirtualAppStatus) ) {
        return
    }
    let data = []
    for (let item in maytekQData.data) {
        if (maytekQData.data[item].key !== 'AIquery') {
            data.push({
                value:maytekQData.data[item].key,
                text:maytekQData.data[item].keyLabel
            })
        }
    }

    // 获取virtualAppFunctionSettings.maytekQ
    window.virtualData.push([{
        mxkey: '_maytekQ_' + maytekQData.uniqueId,
        label: '配置：查询条件',
        type: 'checkbox',
        options: {
            // value: '',
            data: data,
        },
        orginOptions:maytekQData
    }])
}

function getVirtualAppSetting(itemKeyCode) {
    let operArr = top.virtualAppSettingsList;
    let tab = parent.document.getElementsByTagName('iframe')[0].id;
    let pathName = window.location.host + window.location.pathname;
    let keyCode = tab + "_" + pathName;

    if (xyzIsNull(operArr)) {
        return
    }

    for (var i = 0; i < operArr.length; i++) {
        if (operArr[i].keyCode == keyCode + itemKeyCode) {
            return operArr[i].settings;
        }
    }
    return null;
}
function updateVirtualAppSetting(itemKeyCode, content) {
    let operArr = top.virtualAppSettingsList;
    let tab = parent.document.getElementsByTagName('iframe')[0].id;
    let pathName = window.location.host + window.location.pathname;
    let keyCode = tab + "_" + pathName;
    let hasVirtualAppSetting = false;
    if (!xyzIsNull(operArr)) {
        for (var i = 0; i < operArr.length; i++) {
            if (operArr[i].keyCode === keyCode + itemKeyCode) {
                operArr[i].settings = content;
                hasVirtualAppSetting = true
            }
        }
    }
    if (!hasVirtualAppSetting) {
        top.virtualAppSettingsList[operArr.length] = {
            keyCode: keyCode + itemKeyCode,
            settings: content
        }
    }
}
// 设置表单虚拟系统屏蔽字段
function xyzgridVrSetData (gridData) {
  let data = getVirtualAppSetting("_xyzgrid_" + gridData.table)
  if (!data) {
    return
  }
  data = data.split(',')
  for (var q = 0; q < gridData.columns.length; q++) {
    for (var qq = 0; qq < gridData.columns[q].length; qq++) {
      if (xyzIsNull(gridData.columns[q][qq])) {
        continue
      }

      for (var d = 0 ; d < data.length; d++) {
        if (gridData.columns[q][qq].field == data[d]) {
          gridData.columns[q].splice(qq, 1)
          qq--
          break
        }
      }
    }
  }
}
// 设置查询条件虚拟系统屏蔽字段
function maytekQVrSetData (maytekQData) {
  let data = getVirtualAppSetting('_maytekQ_' + maytekQData.pluginData.uniqueId)
  if (!data) {
    return
  }
  data = data.split(',')
  data.forEach(function(item,index){
    delete maytekQData.pluginData.data[item]
  })

  for (let list in maytekQData.pluginData.group) {
    var groupData = maytekQData.pluginData.group[list];

    for(var i = 0; i < groupData.data.length;i++){
      for (var d = 0 ; d < data.length; d++) {
        if (groupData.data[i].key == data[d]) {
          groupData.data.splice(i, 1)
          i--
          break
        }
      }
    }
  }
}

/**
 * 重新登录弹窗
 * */
window.reLogin = function (userName, mainUserName) {
    createContainer();
    let $marsk = $('#reLoginMarsk', parent.document);
    let options = {
        reLoginMarsk: $marsk,
        reUserPwd: $marsk.find("#reUserPwd"),  //密码框
        reUserName: $marsk.find("#reuserName"), //用户名输入框
        reloginBtn: $marsk.find("#reLoginBtn"), //登录按钮
        language: getCookie("iiiiiiiiiiiiiiiiiiiiiiiiiiiiii") || "zh",
        username: "",   //账号
        password: "",   //密码
        url: location.port && location.port === "8080" ? "../zsyc_cloud" : "",
    };
    setTimeout(function () {
        options.reUserPwd.focus();
    }, 1); //密码框自动获取焦点

    mainUserName ? options.username = mainUserName : options.username = userName;
    options.reUserName.val(options.username);
    options.reloginBtn.on('click', function () {
        options.password = options.reUserPwd.val();
        if (!options.password) {
            top.$.messager.alert("提示", "请输入密码", "warning", "error");
            return;
        }
        ajax({
            type: "POST",
            url: options.url + "/LoginWS/login.xyz",
            dataType: "json",
            async: false,
            data: {
                username: options.username,
                password: $.md5(options.password).substr(8, 16),
                loginUsername: userName,
                phoneType: 'pc',
                phoneCode: 'pc',
                loginLang: options.language,
            },
            success: function (response) {
                // 此处放成功后执行的代码
                let data = JSON.parse(response);
                if (data.status === 1) {
                    let key = data.content.apikey;
                    exdate = new Date();
                    exdate.setDate(exdate.getDate() + 7);
                    let apikey = "zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc=" + key + ";expires=" + exdate.toGMTString() + ";path=/";
                    document.cookie = apikey;
                    options.reLoginMarsk.css('display', 'none');
                    ajax({
                        url: options.url + "/LoginWS/decideLogin.do",
                        type: "POST",
                        data: {},
                        async: false,
                        dataType: "json",
                        success: function (response) {
                            let data2 = JSON.parse(response);
                            if (data2.status === 1) {
                                sessionStorage.isLogined = true;
                                sessionStorage.userApiKey = key;
                                window.currentUserFunctions = data2.content.securityFunctionList;
                                window.currentUserButtons = data2.content.buttonList;
                                window.currentChargeCoinMap = data2.content.chargeCoinMap;
                                window.currentUserOpers = data2.content.userOperList;
                                window.currentUserUsername = data2.content.securityLogin.username;
                                window.currentUserNickname = data2.content.securityLogin.nickName;
                                window.currentUserType = data2.content.securityLogin.securityUserType;
                                window.currentPossessor = data2.content.securityLogin.possessor;
                                window.currentAuthorityFine = data2.content.securityLogin.authorityFine;
                                window.currentSystemBrand = data2.content.securityLogin.possessorLogo;
                                window.appList = data2.content.appList; //系统列表
                                window.userList = data2.content.userList;
                            } else {
                                top.$.messager.alert("提示", data2.msg, "warning", "error");
                            }
                        }
                    })
                } else {
                    top.$.messager.alert("提示", data.msg, "warning", "error");
                }

            },
            fail: function (status) {
                // 此处放失败后执行的代码
            }
        });
    });
    options.reUserPwd.on('keydown', function (e) {
        let theEvent = e || window.event;
        // 兼容FF和IE和Opera
        let code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            //回车执行查询
            d.reloginBtn.click();

        }
    });

    //创建dom
    function createContainer(){
        $('#reLoginMarsk').remove();
        let wrapper = $('#app', parent.document);
        let container = $(`<div id='reLoginMarsk'><div class='innerBox'>
                        <div class='titleBox'><img src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIQAAAAPCAYAAAAlM2e8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAHaElEQVRYw63Za4xdVRUH8N+dB30OlIdg5B2FKKAkvkAP8gof0EhAFD0ooIgRQVE8QBAwkqA8gnIsKCaASlQaj4QoCCLEBDBwFIIQRQmWFoikFgGlhdJCy3TGD+vczJkzZ+69U/gnJ+3dj7X3Xnut/1prTyfJiv1wMQ7HYoF/YmmZp9cYEElWnIRzsF+t+Y+4tMzTO5OsmIccJ2LDoHJr6OBVrESB68s8Ha/WvgRfxGaM4hpcVObpKwPs+wJ8A+uruVdX65yCrSuZrxfz8GucXebpmiQrtsXp+Cj2wBAmB5RT4ktlnq5KsmJv/N7Uvb2EM8o8vaPHHZ2J3Wq66uAKXF3m6ZoRXCmMoY6347IkK14u83TZAEo9HN/Fjo2uQ7AwyYon8BSWYKz6thS74b3YJsmKpZVR7IDta2OWVAcdBGOVQhfX5m7CLtjqdeyziR0rXY1hKT6D4S2Qs7O4SNX+3oL51e/FWNCckGTFIpyL0ypddbEB38GPyzxdQ1jm4dqxBOcnWfHOXrurDniZmcbQxXtwVJmnXYt8I7A1zhMeBhON/vUG8zjY2Pi9STDE+Bu01y46eE2w6EmmG8MknscLPb7/VXt7tpLTPXd9/69oMFqSFXviOsGCdWN4HJ/DZWWePt9tHOlziH1wWpIVZ5d5OhvNn4H39ZAxhL2r/+e4FetqSuqHCeHFR+MTtfbt8HHcbCat72jwC2161DzcgD8Jz6vLnhRGfQKOacx7FD8QF9ZklvlYXunixMbZ/oDLxcUO9dnrVvivMJ6+SLLiIMHcBza67sYFZZ7+uTmnaRDPVwd7V6Vw1SX8FjPiUsUeX2g0Lxe0Xlf0MJR5ej/uH+QwLWvdKyz80Frz7klWLDDTII7Ch3BXH5mH4dhG8yhWlHn611nmDImQ1cQG/KbM0+d6rLcDFtWaNuKqMk977nOOmEiyoiNC0sXiLuq4AReWefpk2+SmQTwmLvgrIvmAN+HkJCseqlNLhbOwe+33XYIxrsQRtfbJSiELcBwOqtoGSdhGhFfcJ2ju0FrfsDC8FYJOu565BD9LsuIOrDWTiSYEixzWorCNerPLiJmxfz3uNDP8NNFpnHkEJyRZcbD++cSkCJUP4sYyT9e1jJkQYePdIlGsh/FNgi2u6OYLsx2uidX4uaDEPaq2YwRDXN8dlGTF0fiIKZp7Cd/Hk9rjMpHUXCi8ZNAYr1LiySJ2bm4ob6za7wl4f619FxEjJ2aROTzLJfyttt82dEw3sGdxi6gi+lY1DYwKBh5UF0PVuX5nKuy27W/b6uviOZyPZWWevtpvgaaSxiqlXFtr3wqfTbLibZBkxTb4qmCPLm4TRjO/RdHdJOhAYeXDwhgH/ebhzdi1Rfb8Mk9fFMna442+kWrvbV+bMfwUt5R5OugFrRUU/KDIDbYdcF4doz322Pza2KkNk6Y7wpioRib6TWxjiOEyTyeSrLgJHxaxWPXvx5Ks+B6ONz2R/I+IheNJVrQuVL1DNBO4zSJ73mD2BHMSC0VZ2UsZ94rc4RRROS3Q3/M6lczV+KWg4pcGUPiICBPXCSM8AhdVZ5kLNuPvlf76JZSTwuAeElVQr3HrBGN3HXYBvol9kqw4t8zTp3sdrBVlnq5IsuJaHCCsc0jQ9mqcavpbwi/wlzkqg3hUOR3P9Bm3Pa7CJ3vsdxKPJ1lxnsHfIOqYGJAZOlhV7ecFkYDfXenkEhFCZkNT/iZRst9ksLDRwWSZp7N5+pC4/LvwdVwqWJW4w09hryQrzsJ91VPANPQrO2/DjSJj7eAdorRaWBvzBK5sE95UuJmUNYb9sZPZ3yi6D0+LDYC6spKs2FV4SXPdYbxY5unKQWQ2sBG3Cybavjr/B/BDkfz2wjrT85NRUU6vwMv6s0RHVBGryjxdP8uYocqwlyVZsVKU+gdUZ+6Id6Ff4VtJVixryulpEGWerk2y4idIsGfVXI+Tm8VLVz8PV+bpa0lWvNZoPkR4WL+QsRjb9Fujjqo8PA2pmd63EPckWfHpOeQLdZ3tLyh5XLwcPiIS7Kf0CBtlnm5MsuJ2wSadStbxOBhr9DeIEWGQXxOs1HPvZZ4+kGTFceKd41hTIXsn/Ah7J1lxRZmnz9QXqKMtRt8nLOqclv57cHMLhQ3N8rutnGtmxHNBM+Nv9u1iypCb2LXa11z/VtF9VdxfJMvrRcL2sN6xvYvL8UHhCF3sXH2DovtM3zz/UFMfZZ6uTrLi8+J96ExT70vD4tlg3yrM/qPM0/HmxY22CBwXCdcjjbEbRU27tuUimvTfDTEPVAp8o9DNbbYEWzqPKU8bFew1LkJTvxCszNOnRLgpDWZAbeg6YJdluhjV4tRlnm4q8/Tb+DL+1eg+UuRyRyVZsd2ISJDWVcIe016DPyFKyq2FVywSpemjLWM3i79I7i6MZh7+XfXdKqqTQ6txc6XrOhbh6T5KXV0pYKhl7qotXH9YUO5yUWLvJZK444RxvDiAjIdFqD0V+xqsIuqu/aoIV8S7x3JTBrpGJLqz4Wa8VeSEQ8KQR6vvEKz8P5bEM1JRpXf5AAAAAElFTkSuQmCC' alt=''></div>
                        <div class='msgBox'><i></i><span>登录超时，请重新登录</span></div>
                        <div class='formBox'><ul>
                            <li><span>账号</span><input type='text' id='reuserName' readonly></li>
                            <li><span>密码</span><input type='password' id='reUserPwd' autofocus></li>
                        </ul></div>
                        <button id='reLoginBtn'>登　录</button>
                    </div></div>`);
        wrapper.append(container);
    }

    //获取cookie
    function getCookie(key) {
        let cookie = document.cookie;
        let arr = cookie.split("; ");
        for (let i = 0; i < arr.length; i++) {
            let newArr = arr[i].split("=");
            if (key === newArr[0]) {
                return newArr[1];
            }
        }
    }

    //ajax
    function ajax(options) {
        options = options || {};
        options.type = (options.type || "GET").toUpperCase();
        options.dataType = options.dataType || "json";
        var params = formatParams(options.data);

        //创建 - 非IE6 - 第一步
        if (window.XMLHttpRequest) {
            var xhr = new XMLHttpRequest();
        } else { //IE6及其以下版本浏览器
            var xhr = new ActiveXObject('Microsoft.XMLHTTP');
        }
        //接收 - 第三步
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                var status = xhr.status;
                if (status >= 200 && status < 300) {
                    options.success && options.success(xhr.responseText, xhr.responseXML);
                } else {
                    options.fail && options.fail(status);
                }
            }
        };
        //连接 和 发送 - 第二步
        if (options.type == "GET") {
            xhr.open("GET", options.url + "?" + params, true);
            xhr.send(null);
        } else if (options.type == "POST") {
            xhr.open("POST", options.url, true);
            //设置表单提交时的内容类型
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.send(params);
        }
    }

    //格式化参数
    function formatParams(data) {
        let arr = [];
        for (let name in data) {
            arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
        }
        arr.push(("v=" + Math.random()).replace(".", ""));
        return arr.join("&");
    }
};