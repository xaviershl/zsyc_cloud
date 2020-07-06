"use strict";

(function initRem() {
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
})();
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
            method: 'GET',
            isMxSet: false,
            mode: 'local', // 关键词 检索方式 local:本地筛选, remote: url请求筛选
            queryParams: {}, // 请求参数
            value: '', // 初始值，String
            hasSearch: true,// 是否支持查询
            hasDownArrow: true, // 是否显示向下箭头
            clearIcon: false, // 是否显示清除图标
            data: [],
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
        this.ajaxObj = null;
        this.options = $.extend({}, this.defaults, options);
        this.selectList = [];
        this.result = [];
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
                    var renderContent = that.options.formatter(_result, that.options.textField) || _result[that.options.textField];
                    _result[that.options.textField] && that.ele.find(".inputWrap ul").append('<li><span>' + renderContent + '</span>&nbsp;&nbsp;<i data-value="' + _result[that.options.valueField] + '" class="maytekficon icon-delete2 mulicon"></i></li>')
                });
                that.result.length == 0 && that.ele.find('.inputWrap').addClass('empty');
                that.delItem();
            } else {
                // 添加文本溢出class
                var className = that.options.fixedHeight ? 'text-overflow' : '';
                var renderContent = that.options.formatter(that.result, that.options.textField) || that.result[that.options.textField];
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
            that.options.onBeforeLoad(params);

            if (this.result.value && this.options.isMxSet) {
                params.q = this.result.value; //有选中
            } else if (this.options.isMxSet) {
                params.q = this.options.mxValue;  //mxSetValue 给过来了参数
            }

            xyzAjax({
                url: that.options.url,
                type: this.options.method,
                data: params,
                async: true,
                dataType: 'json',
                success: function (data) {
                    result = data.content || [];
                    cb(result)
                    that.options.onLoadSuccess();
                },
                error: function () {
                    cb(result)
                    that.options.onLoadError()
                }
            });
            return result;
        };
        this.showList = function () {
            var $mask = $('.mySelect-mask');
            // 隐藏所有选项列表
            $(".mySelect-option").removeClass('active');
            $mask.hide();
            $(".maytekFcombo .inputWrapIcons>i.icon-shouqi").removeClass("icon-shouqi").addClass("icon-zhankai");
            $('.mySelect-option .addCustom').hide();
            if (this.options.url !== '') {
                this.getList(callback);
            }else{
                callback();
            }
            function callback(data){
                that.options.data = data || that.options.data;
                that.selectList = that.options.data;
                that.updateList(true);
                // 显示当前选项列表
                that.updateListPosi(that.ele);
                $mask.show();
                $(".mySelect-option").addClass('active');
                that.ele.find(".inputWrapIcons>i.icon-zhankai").removeClass("icon-zhankai").addClass("icon-shouqi");
                $('body').find(".mySelect-option input.maytekFcombo-search").val('');
    
                // 选项列表
                $('body').off().on("click", ".mySelect-option .maytekFcombo-items > div", function (event) {
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
                                that.getList(function(data){
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
            $panel.css({
                // left: pos.left,
                // top: pos.top + pos.height,
                // width: pos.width
                left: 0,
                bottom: 0,
                width: '100%'
            })
            // 搜索search
            $panel.find("input.maytekFcombo-search").off().on("input", function () {
                var in_value = $(this).val().trim();
                if (that.options.url !== '' && that.options.mode === 'remote') {
                    var params = that.deepClone(that.options.queryParams);
                    that.options.onBeforeLoad(params);
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
        this.updateSearchBox = function(){
            $('.mySelect-option .maytekFcombo-search').removeClass('hide');
            !this.options.hasSearch && $('.mySelect-option .maytekFcombo-search').addClass('hide');
            var searchHeight = this.options.hasSearch ? 49 : 0;
            $('.mySelect-option').css('height', this.options.panelHeight + 'px');
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
        // tools ---- 深度克隆
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


            $('.mySelect-option').length === 0 &&
            $('body').append('<div class="mySelect-option">' +
                '<div class="maytekFcombo-search"><div><input class="maytekFcombo-search" type="text"><span class="addCustom">+</span><span class="search-icon iconfont icon-chaxun"></span></div></div>' +
                '<div class="maytekFcombo-items"></div>' +
                '</div>' +
                '<div class="mySelect-mask"></div>');
            var wrapWidth = this.options.width + 'px',
                fontSize = this.options.fontSize + 'px';
            this.ele.css({'width': wrapWidth.indexOf('%') > -1 ? this.options.width : wrapWidth, 'fontSize': fontSize});
            this.ele.find('.inputWrap').css('minHeight', this.options.height + 'px')
                .find('.inputWrapIcons').css('lineHeight', this.options.height - 6 + 'px');

            this.result = this.options.multiple ? [] : {};
            
            this.renderIcon();
            this.updateList(true);
            this.addEvent();
            if (!this.options.lazy && this.options.url !== '') this.getList(callback);
            var that = this;
            function callback(data){
                that.options.data = data;
                that.selectList = that.options.data;
                if (that.options.value || that.options.value === 0) that.setValue(that.options.value, true);
            }
        },
        reload: function (url, _param) {
            if (typeof url !== 'string' || !url) return;
            this.clear();
            this.isType(_param) === 'Object' && (this.options.queryParams = _param);
            this.options.url = url || '';
            var that = this;
            this.getList(function(data){
                that.options.data = data;
                that.selectList = that.options.data;
                that.updateList(true);
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
            if (typeof value !== 'string') return;
            var mote = this.options.mode;
            if (!xyzIsNull(value) && mote == 'remote') {
                this.options.isMxSet = true;
                this.options.mxValue = value;

                var queryParams = this.options.queryParams;

                this.reload(this.options.url, queryParams)
                this.setValue(value)
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
 * maytekF 移动端
 */
;(function () {
    // tools functions-----start
    // json对象转换成字符串
    var stringify = function (s) {
        var data = s;
        data = JSON.stringify(data, function (key, val) {
            if (typeof val === 'function') {
                return val + '';
            }
            return val;
        });
        return data
    };
    // json字符串转换成对象
    var parseJson = function (s) {
        var data = s;
        data = JSON.parse(data, function (k, v) {
            if (xyzIsNull(v)) {
                v = '';
            }
            if (v.indexOf && v.indexOf('function') > -1) {
                return eval("(function(){return " + v + " })()")
            }
            return v;
        });
        return data
    };
    // 判断为空
    var xyzIsNull = function (obj) {
        if (obj == undefined || obj == null || obj === "" || obj === '') {
            return true;
        } else {
            return false;
        }
    };
    // 判断类型
    var isType = function (o) {
        if (o === null) return "Null";
        if (o === undefined) return "Undefined";
        return Object.prototype.toString.call(o).slice(8, -1);
    };

    function IsPC() {
        var userAgentInfo = navigator.userAgent;
        var Agents = ["Android", "iPhone",
            "SymbianOS", "Windows Phone",
            "iPad", "iPod"];
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    // 计算html  fs
    function getRem(_value) {
        let value = _value || 750;
        let width = document.documentElement.clientWidth;
        let height = document.documentElement.clientHeight;
        let devWidth = height > width ? width : height;
        if (devWidth > value) devWidth = value; //取短后是否会大于750
        // document.documentElement.style.fontSize = devWidth / (value / 100) + 'px';
        return devWidth / (value / 100);
    }

    // tools functions----end

    // 所有控件类型
    var allTypes = {
        'text': 'textbox',
        'number': 'numberbox',
        'textarea': 'textarea',
        'date': 'datebox',
        'datetime': 'datetimebox',
        'combobox': 'maytekFcombobox',
        'radio': 'radio',
        'checkbox': 'checkbox',
    };
    // define plugin----start
    // var html_fs = parseFloat($('html').css('fontSize')); // 根元素fontsize
    var com_height = 0.8 * getRem(); // 单组件 height
    var _plugin = function (_type) {
        this.type = _type;
        // 组建该组件所需dom
        this.html = function (mxkey, type, options, multiple) {
            if (!this.type) return;
            var isDivBox = ['maytekFcombobox'];
            var hasMultiple = ['textbox', 'datebox', 'datetimebox'];

            var _classname = '';
            if (isDivBox.includes(this.type)) return '<div id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '" class="' + _classname + '"></div>';

            var _mul = hasMultiple.includes(this.type) ? ' ismultiple="' + multiple + '"' : '';
            return '<div><input type="text" id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '"' + _mul + '></div>';
        };
        // 根据组件类型，渲染各类型组件
        this.render = function (form_id, mxkey, opt) {
            if (!this.type) return;
            var isNoNeed = ['custom', 'radio', 'checkbox', 'textarea'];
            opt.width = opt.width || '100%';
            opt.height = opt.height || com_height;
            !isNoNeed.includes(this.type) && $("#" + form_id + ' #' + mxkey)[this.type](opt);
        };
    }
    var text = new _plugin('textbox');
    var number = new _plugin('numberbox');
    var textarea = new _plugin('textarea');
    var date = new _plugin('datebox');
    var datetime = new _plugin('datetimebox');
    var combobox = new _plugin('maytekFcombobox');
    var radio = new _plugin('radio');
    var checkbox = new _plugin('checkbox');
    var custom = new _plugin();
    // rewrite method html
    textarea.html = function (mxkey, type, options) {
        // 最少2行,一行高30
        options.row = options.row || 2;
        var _height = options.row < 2 ? 2 : options.row;
        var _value = options.value || '';
        var readonly = xyzIsNull(options.readonly) || options.readonly == false ? "" : 'readonly';
        var hei_str = 'min-height:' + _height * 30 + 'px;max-height:' + _height * 30 + 'px;';
        var prompt = xyzIsNull(options.prompt) ? "" : options.prompt;
        var _html = '<textarea id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '" style="' + hei_str + '"' + readonly + ' placeholder="' + prompt + '">' + _value + '</textarea>';
        return _html
    }
    radio.html = function (mxkey, type, options) {
        var _html = '<div id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '">';
        Object.keys(options).length > 0 && options.data.forEach(function (t) {
            if (!Array.isArray(t)) {
                _html += '<div class="commonRadioDiv">' +
                    '<input name="' + mxkey + '"  id="' + mxkey + t.value + '" type="radio" value="' + t.value + '" /><span class="radioSpan"><span></span></span>' +
                    '</div><label style="cursor: pointer;margin: 0 .2rem 0 .1rem;" title="" for="' + mxkey + t.value + '">' + t.text + '</label>';
            } else {
                t.forEach(function (t1) {
                    _html += '<div class="commonRadioDiv">' +
                        '<input name="' + mxkey + '"  id="' + mxkey + t1.value + '" type="radio" value="' + t1.value + '" /><span class="radioSpan"><span></span></span>' +
                        '</div><label style="cursor: pointer;margin-right: 20px;" title="" for="' + mxkey + t1.value + '">' + t1.text + '</label>';
                });
                _html += '<br/>';
            }
        });
        _html += '</div>';
        return _html;
    }
    checkbox.html = function (mxkey, type, options) {
        var _html = '<div id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '">';
        Object.keys(options).length > 0 && options.data.forEach(function (t) {
            if (!Array.isArray(t)) {
                _html += '<div class="isQForQueryDiv">' +
                    '<input name="' + mxkey + '" id="' + mxkey + t.value + '" type="checkbox" value="' + t.value + '"/><span class="inputSpan"><span class="iconfont icon-check"></span></span>' +
                    '</div><label style="cursor: pointer;" title="" for="' + mxkey + t.value + '">' + t.text + '</label>';
            } else {
                t.forEach(function (t1) {
                    _html += '<div class="isQForQueryDiv">' +
                        '<input name="' + mxkey + '" id="' + mxkey + t1.value + '" type="checkbox" value="' + t1.value + '"/><span class="inputSpan"><span class="iconfont icon-check"></span></span>' +
                        '</div><label style="cursor: pointer;" title="" for="' + mxkey + t1.value + '">' + t1.text + '</label>';
                });
                _html += '<br/>';
            }

        });
        _html += '</div>';
        return _html;
    }
    // rewrite method render
    text.render = function (id, mxkey, opt) {
        opt.height = com_height;
        opt.width = opt.width || '100%';
        opt.icons = [{
            iconCls: 'iconfont icon-clear',
            handler: function (e) {
                $(e.data.target).textbox('setValue', '');
            }
        }];

        var change = opt.onChange;
        opt.onChange = function (a, b) {
            var re = new RegExp(opt.reg);
            if (!re.test(a) && !xyzIsNull(a)) {
                var tips = xyzIsNull(opt.regTips) ? "您输入的字段不符合标准" : opt.regTips;
                $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html(tips);
                $("#" + id).find('div[mxkey = ' + mxkey + '] .MForm-input').off('click').on('click', function () {
                    $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html('');
                });
                return
            }
            if (typeof change == 'function') {
                change(a, b);
            }
        };

        $("#" + id + ' input[mxkey="' + mxkey + '"]').textbox(opt);
    }
    number.render = function (id, mxkey, opt) {
        opt.height = com_height;
        opt.width = opt.width || '100%';
        opt.icons = [{
            iconCls: 'iconfont icon-clear',
            handler: function (e) {
                $(e.data.target).textbox('setValue', '');
            }
        }];
        var change = opt.onChange;
        opt.onChange = function (a, b) {
            var re = new RegExp(opt.reg);
            if (!re.test(a)) {
                var tips = xyzIsNull(opt.regTips) ? "您输入的字段不符合标准" : opt.regTips;
                $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html(tips);
                $("#" + id).find('div[mxkey = ' + mxkey + '] .MForm-input').off('click').on('click', function () {
                    $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html('');
                });
                return
            }

            if (typeof change == 'function') {
                change(a, b);
            }
        };
        $("#" + id + ' input[mxkey="' + mxkey + '"]').numberbox(opt);
    }
    textarea.render = function (id, mxkey, opt) {
        var $textarea = $("#" + id + ' textarea[mxkey="' + mxkey + '"]');
        var textarea = $textarea[0];
        $.data(textarea, 'redata', {
            reg: opt.reg,
            regTips: opt.regTips
        });

        $textarea.blur(function () {
            var re = new RegExp(opt.reg);
            if (!re.test($textarea.val()) && !xyzIsNull($textarea.val())) {
                var tips = xyzIsNull(opt.regTips) ? "您输入的字段不符合标准" : opt.regTips;
                $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html(tips);
                $("#" + id).find('div[mxkey = ' + mxkey + '] .MForm-input').off('click').on('click', function () {
                    $("#" + id).find('div[mxkey = ' + mxkey + ']').children('.MForm-tips').html('');
                });
                return
            }
        });
    }

    // Components instance object
    var plugins = {
        text: text,
        number: number,
        textarea: textarea,
        date: date,
        datetime: datetime,
        combobox: combobox,
        radio: radio,
        checkbox: checkbox,
        custom: custom,
    };

    // define plugin----end

    function MaytekFPlugin(MaytekFPlugin) {
        var num = 100; // 默认id 初始值
        var that = this;

        that.start = function (opt) {
            opt = opt || MaytekFPlugin;
            this.initMobile(opt);
            setTimeout(function () {
                that.onLoad(opt)
            }, 0);
        }
        // 移动端渲染
        this.initMobile = function (opt) {
            var defaults_opt = {
                title: '新建表单',
                tabs: [],
                height: 600,
                openReadCheck: true
            };
            that.form_id = opt.id;
            that.pluginData = $.extend(true, defaults_opt, opt);
            // document.querySelector('body').style.overflow = "hidden";
            document.querySelector('body').classList.add('hide');
            isType(that.pluginData.tabs) !== 'Array' && (that.pluginData.tabs = []);
            var zindex = that.pluginData.zIndex || 97000; // 表单层级
            var $panel = $('<div class="maytekF-mobile-panel" id="' + that.form_id + '" style="z-index: ' + zindex + '"></div>');
            $panel.append('<div class="form-title"><span class="back-icon iconfont icon-calendarPrevmonth"></span>' + that.pluginData.title + '</div>' +
                '<div class="form-wrap"></div>' +
                '<div class="form-footer"></div>')

            $('body').append($panel);
            //创建下方按钮
            if (!that.pluginData.buttons || that.pluginData.buttons.length === 0) {
                that.pluginData.buttons = [{
                    text: '确定'
                }, {
                    text: '关闭'
                }]
            }
            that.pluginData.buttons.forEach(function (val) {
                var bgColor = val.backgroundColor ? val.backgroundColor : '';
                var color = val.color ? val.color : '';
                var btn_str = '<a href="javascript:void(0)" style="background-color:' + bgColor + ';color:' + color + ';"><span class="iconfont ' + val.icon + '"></span>' + (val.text ? val.text : '按钮') + '</a>';
                $("#" + that.form_id + ' .form-footer').append(btn_str);
            });

            that.pluginData.tabs.forEach(function (part, tab_index) {
                var _title = part.title || '信息';
                var tabkey = part.tabkey || that.form_id + 'tabkey' + tab_index;
                var $part = $('<div class="form-part" tabkey="' + tabkey + '"><div class="form-part-title">' + _title + '</div></div>')
                $panel.find('.form-wrap').append($part)
                that.creatTable(part, tab_index);
            })
            that.addEvents()
        }
        // render tab
        that.creatTable = function (part, tab_index) {
            if (xyzIsNull(part.content)) return;
            part.content.forEach(function (d) {
                if (!$.isEmptyObject(d)) {
                    if (isType(d) === 'Array') {
                        d.forEach(function (val) {
                            that.creatTr(part, val, tab_index);
                        })
                    }
                }
            });
            // 只有一个tab页时。不显示title
            var $parts = $('#' + that.form_id + ' .form-part');
            $parts.find('.form-part-title')[($parts.length > 1 ? 'show' : 'hide')]();
        }
        // render component
        that.creatTr = function (form, data, index) {
            var _mxkey = data.mxkey; // dom mxkey|id
            var td1 = '', td2 = '', td3 = '', td4 = '';

            td1 = !data.label ? '' : data.label;
            if ($('#MaytekF_' + _mxkey).length > 0 || !_mxkey) {
                _mxkey = _mxkey + '' + num++;
            }
            _mxkey = 'MaytekF_' + _mxkey;

            var multiple = data.option && data.option.multiple ? data.option.multiple : 'false';
            var options = !data.options ? {} : data.options;
            // 插入相应类型组件所需dom，错误类型  默认为text
            var plu_type = plugins[data.type] ? data.type : 'text';
            td2 = plugins[plu_type].html(_mxkey, data.type, options, multiple);

            var $cell = $('<div class="form-cell" mxkey="' + _mxkey + '"></div>');
            var _con = ''
            if (data.type === "custom") {
                $cell.addClass('form-cell-custom');
                _con = '<div class="form-custom-box" id="' + _mxkey + '">' + data.html + '</div>';
            } else {
                var isRequired = data.required ? true : false; // 是否必填项
                _con = '<div class="form-cell-label">' +
                    '<span class="form-cell-text" required="' + isRequired + '">' + td1 + '</span>' +
                    '</div>' +
                    '<div class="form-cell-value">' + td2 + '</div>' +
                    '<div class="form-cell-info"></div>';
                $cell.attr('isRequired', isRequired);
            }
            $cell.append(_con);

            if (typeof  form === 'string') { // additem method
                if ($('#' + that.form_id + ' #' + _mxkey).length > 0) {
                    return console.warn('Method additem fails to execute，because the id ' + _mxkey + ' already exists')
                }
                if (form === 'update') { // update 单个组件对象
                    $("#" + that.form_id + " #maytekF_mark_edit").after($cell);
                } else {
                    var api = index == 'before' ? 'before' : 'after';
                    $("#" + that.form_id + " #" + form).parents(".form-cell")[api]($cell);
                }
            } else { // render
                var tabkey = form.tabkey || that.form_id + 'tabkey' + index;
                var $table = $("#" + that.form_id + ' div[tabkey="' + tabkey + '"]');
                $table.append($cell);
            }

            // save data
            var _tr = $("#" + that.form_id + ' .form-cell[mxkey="' + _mxkey + '"]');
            _tr.data('mxObj', data)

            // 渲染相应类型组件
            if (plu_type === 'radio') {
                if (!xyzIsNull(data.options.value)) {
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"][value="' + data.options.value + '"]').attr('checked', 'checked');
                }
                if (data.options["onChange"] !== undefined) {
                    var oldvalue = data.options.value;
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"]').on("change", function (a, b) {
                        data.options["onChange"](that.getValue(data.mxkey), oldvalue);
                        oldvalue = that.getValue(data.mxkey);
                    });
                }
            }
            if (plu_type === 'checkbox') {
                if (!xyzIsNull(data.options.value)) {
                    var v = [];

                    typeof data.options.value === 'string' ? v = data.options.value.split(',') : v = data.options.value;

                    v.forEach(function (t) {
                        $('#' + that.form_id + ' input[name="' + _mxkey + '"][value="' + t + '"]').attr('checked', 'checked');
                    });
                }
                if (data.options["onChange"] !== undefined) {
                    var oldvalue = data.options.value;
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"]').on("change", function (a, b) {
                        data.options["onChange"](that.getValue(data.mxkey), oldvalue);
                        oldvalue = that.getValue(data.mxkey);
                    });
                }
            }
            plugins[plu_type].render(that.form_id, _mxkey, options)
        }
        // emit onload callback
        that.onLoad = function () {
            $('.maytekF-mobile-panel').addClass('active');
            that.pluginData.onLoad && that.pluginData.onLoad(that.pluginData);
        }
        // 绑定相关事件
        that.addEvents = function () {
            $('#' + that.form_id + ' input').on('focus', function () {
                $('#' + that.form_id + ' .form-footer').hide();
            })
            $('#' + that.form_id + ' input').on('blur', function () {
                $('#' + that.form_id + ' .form-footer').show();
            })
            // title back icon
            $('#' + that.form_id + ' .form-title .back-icon').on('click', function () {
                that.destroy();
            })
            // button区事件
            $("#" + that.form_id + ' .form-footer a').on('click', function () {
                var $form = $("#" + that.form_id);
                var _btns = that.pluginData.buttons;
                var _index = $(this).index();
                var data = that.getAllValue(true);

                if (_btns.length == 1 || _index == _btns.length - 1) {// 最后一个按钮，默认绑定销毁事件
                    var a = _btns[_index].handler && _btns[_index].handler();
                    if (a !== false) {
                        that.destroy();
                    }
                } else {
                    // 必填检测
                    if (isType(data) == 'Array') {
                        data.forEach(function (t) {
                            var tips = t.maytekResultType == "required" ? '该项为必填项' : t.regTips;
                            var $box = $form.find('.form-cell[mxkey = ' + t.id + ']');

                            $box.children('.form-cell-info').html(tips);
                            $box.children('.form-cell-value').off('click').on('click', function () {
                                $box.children('.form-cell-info').html('');
                            });

                            // var index = $box.parents(".MaytekForm").index();
                            // $tab.eq(index).addClass('noInfo');

                            // console.log('必填：',$box,t);
                        });
                    }
                    // if($form.find('.MaytekF-aside li.noInfo').length > 0) return;

                    _btns[_index].handler && _btns[_index].handler(data);
                }
            });
        }


        that.start(MaytekFPlugin);
    }

    /**
     * @method render 根据参数重新渲染表单
     * @param Object opt 缺省值为当前表单初始参数
     */
    MaytekFPlugin.prototype.render = function (opt) {
        this.destroy(false);
        this.start(opt)
    }
    /**
     * @method addItem|removeItem 新增/删除某个组件
     * @param Array|String data是具体mxkey值或是一个mxkey列表
     */
    MaytekFPlugin.prototype.addItem = function (mxkey, data, pos) {
        var dom_id = 'MaytekF_' + mxkey;
        var _data = $.extend(true, {}, data);
        var that = this;
        if (isType(_data) === 'Array') {
            var arr = pos === 'before' ? _data : _data.reverse();
            arr.forEach(function (item) {
                that.creatTr(dom_id, item, pos);
            })
        } else if (isType(_data) === 'Object') {
            that.creatTr(dom_id, _data, pos);
        }
    };
    MaytekFPlugin.prototype.removeItem = function (data) {
        var that = this;
        if (isType(data) === 'Array') {
            data.forEach(function (mxkey) {
                deleteItem(mxkey);
            })
        }
        if (isType(data) === 'String') {
            deleteItem(data);
        }

        function deleteItem(mxkey) {
            var dom_id = 'MaytekF_' + mxkey;
            var $this = $("#" + that.form_id + " #" + dom_id);
            var _parent = $this.parents(".form-cell");
            var _type = $this.attr('maytekf');
            if (_type === 'date' || _type === 'datetime') $this[allTypes[_type]]('destroy');
            _parent.remove();
        }
    };
    /**
     * @method addTab | removeTab 新增/删除tab页
     * @param Number | Array data 索引值或包含索引的数组
     */
    MaytekFPlugin.prototype.addTab = function (data) {
        var that = this;
        if (isType(data) === 'Array') {
            data.forEach(function (tabObj) {
                createNewTab(tabObj);
            })
        }
        if (isType(data) === 'String') {
            createNewTab(data);
        }

        function createNewTab(tabObj) {
            var _title = tabObj.title || '信息';
            var index = $("#" + that.form_id + ' .form-part').length;
            tabObj.tabkey = tabObj.tabkey || that.form_id + 'tabkey' + index;
            var form = '<div class="form-part" tabkey="' + tabObj.tabkey + '">' +
                '<div class="form-part-title">' + _title + '</div>' +
                '</div>';

            $("#" + that.form_id + ' .form-wrap').append(form);
            that.creatTable(tabObj);
            // that.tabEvent();
        }
    }
    MaytekFPlugin.prototype.removeTab = function (data) {
        var that = this;
        if (isType(data) === 'Array') {
            data.forEach(function (index) {
                deleteTab(index);
            })
        }
        if (isType(data) === 'Number') {
            deleteTab(data);
        }

        function deleteTab(index) {
            var tabkey = that.form_id + 'tabkey' + index;
            // clear 组件相关dom
            $('#' + that.form_id + ' [tabkey="' + tabkey + '"] [maytekf]').each(function () {
                var _type = $(this).attr('maytekf');
                if (_type === 'date' || _type === 'datetime') {
                    $(this)[allTypes[_type]]('destroy')
                }
            });

            $('#' + that.form_id + ' [tabkey="' + tabkey + '"]').remove()
        }
    }
    // set|get methods
    MaytekFPlugin.prototype.setValue = function (mxkey, value) {
        value = xyzIsNull(value) ? '' : value;
        var dom_id = 'MaytekF_' + mxkey;
        var _dom = $('#' + dom_id),
            multiple = _dom.attr('ismultiple') || 'false',
            _type = allTypes[_dom.attr('maytekf')] || '';
        if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

        switch (_type) {
            case 'numberVerify':
                return;
            case 'radio':
                $('#' + dom_id + ' input[name="' + dom_id + '"]').attr('checked', false);
                if (!xyzIsNull(value)) {
                    $('#' + dom_id + ' input[name="' + dom_id + '"][value="' + value + '"]').attr('checked', 'checked');
                }
                break;
            case 'checkbox':
                $('#' + dom_id + ' input[name="' + dom_id + '"]').attr('checked', false);
                if (!xyzIsNull(value)) {
                    var v = [];

                    typeof value === 'string' ? v = value.split(',') : v = value;

                    v.forEach(function (t) {
                        $('#' + dom_id + ' input[name="' + dom_id + '"][value="' + t + '"]').attr('checked', 'checked');
                    });
                }
                break;
            case 'MxEditor':
                return MxEditor.setValue(dom_id, value);
            case 'datebox':
            case 'datetimebox':
            case 'textbox':
                return multiple !== 'false' ? _dom[_type]('setValues', value) : _dom[_type]('setValue', value);
            case 'time':
            case 'textarea':
                return _dom.val(value);
            case 'mxSelectInput':
            case 'maytekFcombobox':
            case 'mxComplex':
            case 'numberbox':
                return _dom[_type]('setValue', value);
            case 'relationSelector':
                var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                if (typeof value == "object") {
                    for (var v in value) {
                        list.forEach(function (t) {
                            var key = t.mxkey.replace(/MaytekF_/g, "");
                            if (v == key) {
                                $('#' + t.mxkey).maytekFcombobox('setValue', value[v]);
                            }
                        });
                    }
                }
                return;
            default:
                return _dom.textbox('setValue', value);
        }
    };
    MaytekFPlugin.prototype.getValue = function (mxkey) {
        var dom_id = 'MaytekF_' + mxkey;
        var _dom = $('#' + dom_id);
        var multiple = _dom.attr('ismultiple') || 'false';
        var _type = allTypes[_dom.attr('maytekf')] || '';
        if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

        switch (_type) {
            case 'numberVerify':
                return;
            case 'radio':
                return $('#' + dom_id + ' input[name="' + dom_id + '"]:checked').val();
            case 'checkbox':
                return $.map($('#' + dom_id + ' input[name="' + dom_id + '"]:checked'), function (p) {
                    return $(p).val();
                }).join(",");
            case 'MxEditor':
                return MxEditor.getValue(dom_id);
            case 'datebox':
            case 'datetimebox':
            case 'textbox':
                return multiple !== 'false' ? _dom[_type]('getAllValue') : _dom[_type]('getValue');
            case 'time':
            case 'textarea':
                return _dom.val()
            case 'mxSelectInput':
            case 'maytekFcombobox':
            case 'mxComplex':
            case 'numberbox':
                return _dom[_type]('getValue');
            case 'relationSelector':
                var value = {};
                var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                list.forEach(function (t) {
                    var key = t.mxkey.replace(/MaytekF_/g, "");
                    value[key] = $('#' + t.mxkey).maytekFcombobox('getValue');
                });
                return value;
            default:
                return _dom.textbox('getValue')
        }
    };
    MaytekFPlugin.prototype.getText = function (mxkey) {
        var dom_id = 'MaytekF_' + mxkey;
        var _dom = $('#' + dom_id);
        var _type = allTypes[_dom.attr('maytekf')] || '';
        if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

        switch (_type) {
            case 'numberVerify':
                return;
            case 'radio':
            case 'checkbox':
            case 'MxEditor':
            case 'datebox':
            case 'datetimebox':
            case 'textbox':
                return this.getValue(mxkey)
            case 'time':
            case 'textarea':
                return _dom.val()
            case 'mxSelectInput':
                return _dom[_type]('getValue');
            case 'maytekFcombobox':
            case 'mxComplex':
            case 'numberbox':
                return _dom[_type]('getText');
            case 'relationSelector':
                var text = {};
                var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                list.forEach(function (t) {
                    var key = t.mxkey.replace(/MaytekF_/g, "");
                    value[key] = $('#' + t.mxkey).maytekFcombobox('getText');
                });
                return text;
            default:
                return _dom.textbox('getValue');
        }
    };
    /**
     * @method getAllValue 获取所有值
     * @param Boolean checkRequire 是否开启必填项检测
     */
    MaytekFPlugin.prototype.getAllValue = function (checkRequire) {
        var that = this;
        checkRequire = checkRequire === true ? true : false;
        $("#" + that.form_id).find('.form-cell-info').html('');

        var result = {};
        var requireId = []; // 检测通过失败的id
        $('#' + that.form_id + ' [maytekf]').each(function () {
            var required = $(this).parents('.form-cell').attr('isrequired');
            var v_type = $(this).attr('maytekf');
            var _mxkey = this.id.slice(8);
            var _value = that.getValue(_mxkey);

            result[_mxkey] = that.getValue(_mxkey) || '';
            if (checkRequire && required == 'true' && result[_mxkey] == '') {
                requireId[requireId.length] = {id: this.id, required: true, maytekResultType: 'required'};
            } else {
                if (checkRequire && !xyzIsNull(_value) && v_type == 'text') {
                    var options = $('#' + that.form_id + ' #' + this.id).textbox('options');
                    var reg = options.reg;
                    var tips = options.regTips;
                    var re = new RegExp(options.reg);
                    if (!re.test(_value)) {
                        requireId[requireId.length] = {
                            id: this.id,
                            maytekResultType: 'reg',
                            regTips: xyzIsNull(options.regTips) ? "您输入的字段不符合标准" : options.regTips
                        };
                    }
                }
                if (checkRequire && !xyzIsNull(_value) && v_type == 'textarea') {
                    var options = $("#" + that.form_id + ' textarea[id="' + this.id + '"]')[0];
                    var reData = $.data(options, 'redata');
                    var reg = reData.reg;
                    var tips = reData.regTips;
                    var re = new RegExp(reg);
                    if (!re.test(_value)) {
                        requireId[requireId.length] = {
                            id: this.id,
                            maytekResultType: 'reg',
                            regTips: xyzIsNull(tips) ? "您输入的字段不符合标准" : tips
                        };
                    }
                }
            }


        });
        result = checkRequire && requireId.length > 0 ? requireId : result;
        return result;
    }

    /**
     * @method clear 清空该表单所有内置组件值
     */
    MaytekFPlugin.prototype.clear = function () {
        var that = this;
        $('#' + that.form_id + ' [maytekf]').each(function () {
            var _mxkey = this.id.slice(8);
            that.setValue(_mxkey, '');
        });
    };
    /**
     * @method destroy 销毁表单
     */
    MaytekFPlugin.prototype.destroy = function (isClearMap) {
        $('.maytekF-mobile-panel').removeClass('active');
        document.querySelector('body').classList.remove('hide');
        var _this = this;
        setTimeout(function () {
            _handle();
        }, 300)
        var _handle = function () {
            isClearMap = isClearMap === false ? false : true;
            $('#' + _this.form_id + ' [maytekf]').each(function () {
                var _type = $(this).attr('maytekf');
                if (_type === 'date' || _type === 'datetime') {
                    $(this)[allTypes[_type]]('destroy')
                }
            });
            isClearMap && delete map[_this.form_id];
            $('#' + _this.form_id).remove();
        }
    };
    /**
     * @method getTarget 获取该组件配置对象
     * @param String mxkey
     */
    MaytekFPlugin.prototype.getTarget = function (mxkey) {
        var data = $('#MaytekF_' + mxkey).parents('.form-cell').data('mxObj');
        var _data = $.extend(true, new mxOpt(), data)
        return _data;
    }
    /**
     * @method update 更新某个组件(实际上是先销毁，再重新渲染)
     * @param allTypes mxkey no use
     * @param Object data 组件配置对象
     */
    MaytekFPlugin.prototype.update = function (mxkey, data) {
        var $mark = $('<div id="maytekF_mark_edit"></div>');
        var $target = $('#MaytekF_' + data.mxkey);
        var $formTr = $target.parents('.form-cell');
        if ($target.length === 0 || $target.parents.length === 0) return;
        $formTr.after($mark);
        this.removeItem(data.mxkey);
        this.creatTr('update', data);
        $('#maytekF_mark_edit').remove();
    }


    // 组件配置 init
    var mxOpt = function () {
        this.mxkey = '';
        this.label = '';
        this.details = '';
        this.type = '';
        this.html = '';
        this.help = '';
        this.btn = '';
        this.hasDeleteIcon = false;
        this.required = false;
        this.options = {};
    }
    // maytekF getTarget() methods
    var mxMethodsList = [
        'getValue',
        'getText',
        'setValue',
        'clear',
        'update'
    ]
    mxMethodsList.forEach(function (method_name) {
        mxOpt.prototype[method_name] = function (opt) {
            var mxkey = this.mxkey;
            if (!mxkey) return;
            var form = $('#MaytekF_' + mxkey).parents('.MaytekF-panel').attr('id');
            return MaytekF[method_name](form, mxkey, opt)
        }
    })

    // 注入全局对象MaytekF,注册相应事件
    var MaytekF = {};
    var map = {};

    // form id check, throw error
    function checkForm(form_id) {
        if (!map[form_id]) {
            console.warn('The element id: "' + form_id + '" does not exist');
            return false;
        }
        return true;
    }

    // maytekF methods
    var _methods = [
        'init',
        'render',
        // 'initData',
        'addTab',
        'removeTab',
        'addItem',
        'removeItem',
        // 'setDetail',
        'setValue',
        'getValue',
        'getText',
        'getTarget',
        'getAllValue',
        'destroy',
        'clear',
        // 'clearData',
        'update'
    ];
    _methods.forEach(function (method) {
        if (method === 'init') {
            // init method
            MaytekF.init = function (data) {
                if (xyzIsNull(data) || xyzIsNull(data.id)) return;
                if (!map[data.id]) {
                    map[data.id] = new MaytekFPlugin(data);
                } else {
                    $(".MaytekF-mask." + data.id).show();
                    $("#" + data.id).show();
                }
            };
            return;
        }
        MaytekF[method] = function (form_id) {
            if (!checkForm(form_id)) return;
            return map[form_id][method](arguments[1], arguments[2], arguments[3]);
        }
    })

    window.MaytekF = MaytekF;
})();
/*
* @name: MaytekQ移动端
* @author: pls
* @update: 2019-5-14
* 插件使用js,jq原生代码
* */
;(function () {

    //创建插件对象
    var MaytekQ = {};
    //创建插件对象的集合
    var map = {};

    /*--插件对象内的公共方法-开始--*/
    // 判断为空
    var xyzIsNull = function (obj) {
        if (obj == undefined || obj == null || obj === "" || obj === '') {
            return true;
        } else {
            return false;
        }
    };
    /*--插件对象内的公共方法-结束--*/

    //创建插件的工厂对象
    function MaytekQMobile(plsSearchData) {
        /*--全局变量名-开始--*/
        var that = this;

        //浅拷贝传入值，以及设置默认值
        that.defaultPluginData = Object.assign({}, plsSearchData);//保存配置数据
        that.pluginData = Object.assign({}, plsSearchData);//默认数据

        that.pluginData.data = {};//查询总数据
        that.searchData = {};//查询的数据

        //判断是否可以查询
        var canSearch = true;
        //获取local
        var historyQuery = [];
        var historyQueryText = [];
        //拖拽排序插件
        var sortable;

        //添加group数据到主数据的方法名
        that.initData;

        //渲染组件的方法名
        that.render;

        //获取数据的方法名
        that.getSearchData;

        /*--全局变量名-结束--*/

        /*--初始化数据--*/

        //添加group数据到主数据的方法
        that.initData = function () {
            if (xyzIsNull(that.pluginData.id)) {
                return
            }
            that.pluginData.data = {};

            if (xyzIsNull(that.pluginData.group)) {
                that.pluginData.group = {
                    "allQuery": {
                        value: "allQuery",
                        text: '更多',
                        data: []
                    }
                }
            }

            //遍历group一级数据
            for (var group in that.pluginData.group) {
                var groupData = that.pluginData.group[group];

                //遍历group二级数据
                for (var i = 0; i < groupData.data.length; i++) {
                    var key = groupData.data[i].key;
                    //把group数据添加进插件组数据
                    if (!xyzIsNull(key)) {
                        that.pluginData.data[key] = groupData.data[i];
                    }
                }
            }

            //给不规范的数据增加属性
            for (var data in that.pluginData.data) {
                //给不规范的数据增加属性
                if (that.pluginData.data[data].key == "AIquery") {
                    delete that.pluginData.data[data]
                    continue
                }
                if (xyzIsNull(that.pluginData.data[data].type)) {
                    that.pluginData.data[data].type = "textbox";
                }
                if (xyzIsNull(that.pluginData.data[data].options)) {
                    that.pluginData.data[data].options = {};
                }
                if (xyzIsNull(that.pluginData.data[data].options.data)) {
                    that.pluginData.data[data].options.data = [];
                }
                if (xyzIsNull(that.pluginData.data[data].options.value)) {
                    that.pluginData.data[data].options.value = "";
                }
                if (xyzIsNull(that.pluginData.data[data].options.text)) {
                    that.pluginData.data[data].options.text = "";
                }
                if (xyzIsNull(that.pluginData.data[data].options.html)) {
                    that.pluginData.data[data].options.html = "";
                }
            }
        };

        //初始化数据
        that.init = function () {
            //初始化数据
            that.initData();

            //是否有默认查询条件
            if (!!localStorage.historyQuery) {
                historyQuery = JSON.parse(localStorage.historyQuery);
            }
            if (!!localStorage.historyQueryText) {
                historyQueryText = JSON.parse(localStorage.historyQueryText);
            }
        };
        that.init();

        /*--创建插件的搜索框的方法--*/
        function creatSearchBox() {
            var mxSearch = document.getElementById(that.pluginData.id);
            //创建查询框
            var mxSearchBox = document.createElement("div");
            var mxSearchBoxDiv = document.createElement("div");
            mxSearchBoxDiv.id = that.pluginData.id + "searchBox";
            mxSearchBox.className = "searchBox";
            var ico = document.createElement("i");
            ico.className = "iconfont icon-search";
            mxSearchBoxDiv.appendChild(ico);
            var searchInput = document.createElement("input");
            searchInput.id = that.pluginData.id + "searchBoxInput";
            searchInput.readOnly = true;
            // searchInput.className = "text-overflow";
            mxSearchBoxDiv.appendChild(searchInput);
            var clear = document.createElement("i");
            clear.className = "iconfont icon-clear";
            mxSearchBoxDiv.appendChild(clear);

            mxSearch.appendChild(mxSearchBox);
            mxSearchBox.appendChild(mxSearchBoxDiv);
        };

        /*--创建插件外框的方法--*/
        function createBox() {
            //创建第一层
            var mask = document.createElement("div");
            var box = document.createElement("div");
            box.id = that.pluginData.id + "MaytekQMobile";
            box.className = "MaytekQMobile";
            mask.id = that.pluginData.id + "mask";
            mask.className = "mask";
            document.getElementsByTagName("body")[0].appendChild(mask);
            document.getElementsByTagName("body")[0].appendChild(box);
            //创建第二层
            var header = document.createElement("header");
            var history = document.createElement("section");
            var queryInput = document.createElement("section");
            var button = document.createElement("section");

            history.className = "history";
            queryInput.className = "queryInput";
            button.className = "button-mainWrap";
            box.appendChild(header);
            box.appendChild(history);
            box.appendChild(queryInput);
            box.appendChild(button);

            //创建第三层
            //header
            var headerIco = document.createElement("i");
            headerIco.className = "iconfont icon-navdown";
            header.appendChild(headerIco);
            var headerSpan = document.createElement("span");
            var headerNode = document.createTextNode("查询");
            header.appendChild(headerSpan);
            headerSpan.appendChild(headerNode);
            //history
            var historyH2 = document.createElement("h2");
            var historyNode = document.createTextNode("历史查询");
            history.appendChild(historyH2);
            historyH2.appendChild(historyNode);

            var historyUl = document.createElement("ul");
            historyUl.className = "historyList";
            history.appendChild(historyUl);

            //queryInput
            var queryH2 = document.createElement("h2");
            var queryNode = document.createTextNode("新建查询");
            queryInput.appendChild(queryH2);
            queryH2.appendChild(queryNode);
            var queryI = document.createElement("i");
            queryI.className = "iconfont icon-suo";
            queryH2.appendChild(queryI);

            var queryUl = document.createElement("ul");
            queryUl.className = "queryInputBoxs";
            queryInput.appendChild(queryUl);

            //button-mainWrap
            var buttonClear = document.createElement("div");
            buttonClear.className = "search-clearLablel";
            var buttonClearNode = document.createTextNode("清空条件");
            button.appendChild(buttonClear);
            buttonClear.appendChild(buttonClearNode);

            var buttonSearch = document.createElement("div");
            buttonSearch.id = 'searchBtn-' + that.pluginData.id;
            buttonSearch.className = "search";
            var buttonSearchNode = document.createTextNode("开始查找");
            button.appendChild(buttonSearch);
            buttonSearch.appendChild(buttonSearchNode);
        };

        /*--创建历史的方法--*/
        function createHistory() {
            //初始没有本地储存返回
            if (xyzIsNull(localStorage.historyQueryText)) {
                return
            }
            var $historyList = document.querySelectorAll("#" + that.pluginData.id + "MaytekQMobile .historyList")[0];
            //每次进入查询页面都会创建一次历史查询，清空重新渲染
            $($historyList).html("");
            //创建html，li
            historyQueryText.forEach(function (value) {
                var li = document.createElement("li");
                var p = document.createElement("p");
                p.className = "text-overflow";
                var i = document.createElement("i");
                i.className = "iconfont icon-clear";
                li.appendChild(p);
                li.appendChild(i);

                var text = JSON.parse(value);
                var showText = "";
                for (var t in text) {
                    showText += text[t] + ",";
                }
                var textNode = document.createTextNode(showText);
                p.appendChild(textNode);

                $historyList.appendChild(li);
            })
        };

        /*--生成搜索选框的方法--*/
        function createInput() {
            for (var input in that.pluginData.data) {//遍历总数据
                var queryInput = that.pluginData.data[input];
                var queryInputBox = document.createElement("li");
                queryInputBox.setAttribute("data-id", queryInput.key + that.pluginData.id);
                var label = document.createElement("div");
                var labelText = document.createTextNode(queryInput.keyLabel);
                label.className = "label text-overflow";
                label.appendChild(labelText);
                queryInputBox.appendChild(label);

                var query = document.createElement("div");
                query.className = "query";
                queryInputBox.appendChild(query);
                var $queryInputBoxs = document.querySelectorAll("#" + that.pluginData.id + "MaytekQMobile" + " .queryInputBoxs")[0];
                $queryInputBoxs.appendChild(queryInputBox);
                //生成自定义
                if (queryInput.type == 'customSearch') {
                    var customSearch = document.createElement("div");
                    customSearch.id = 'custom-' + queryInput.key + that.pluginData.id;
                    customSearch.className = 'customInputBox';
                    customSearch.innerHTML = queryInput.options.customHtml;
                    var customInput = document.createElement("input");
                    customInput.id = 'search-' + queryInput.key + that.pluginData.id;
                    customInput.type = 'hidden';
                    customInput.disabled = true;
                    customInput.setAttribute("queryValue", queryInput.key);
                    customInput.setAttribute("customsearch", "");

                    query.appendChild(customSearch);
                    query.appendChild(customInput);

                    that.pluginData.data[queryInput.key].options.id = 'custom-' + queryInput.key + that.pluginData.id;

                    if (!xyzIsNull(queryInput.options.customOnload)) {
                        queryInput.options.customOnload(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customSetValue)) {
                        queryInput.options.customSetValue(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customSetText)) {
                        queryInput.options.customSetText(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetValue)) {
                        queryInput.options.customGetValue(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetText)) {
                        queryInput.options.customGetText(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetHtml)) {
                        queryInput.options.customGetHtml(queryInput.options);
                    }
                    continue
                }

                //生成doubledate
                if (queryInput.type == "doubleDate") {
                    var dateStart_input = document.createElement("input");
                    dateStart_input.id = 'dateStart-' + queryInput.key + that.pluginData.id;
                    dateStart_input.setAttribute("queryValue", "dateStr");
                    dateStart_input.setAttribute("dateStr", queryInput.key);
                    dateStart_input.setAttribute("dateStart", "");

                    var dateEnd_input = document.createElement("input");
                    dateEnd_input.id = 'dateEnd-' + queryInput.key + that.pluginData.id;
                    dateEnd_input.setAttribute("queryValue", "dateStr");
                    dateEnd_input.setAttribute("dateStr", queryInput.key);
                    dateEnd_input.setAttribute("dateEnd", "");

                    query.appendChild(dateStart_input);
                    query.appendChild(dateEnd_input);

                    var dateValue = queryInput.options.value;
                    var dateStartValue = '';
                    var dateEndValue = '';

                    if (!xyzIsNull(dateValue)) {
                        if (dateValue.lastIndexOf('^') == 0) {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                        } else if (dateValue.indexOf('^') == 0) {
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        } else {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        }
                    }

                    $('#dateStart-' + queryInput.key + that.pluginData.id).datebox({
                        width: 118,
                        value: dateStartValue
                    });
                    $('#dateEnd-' + queryInput.key + that.pluginData.id).datebox({
                        width: 118,
                        value: dateEndValue
                    });
                    continue
                }

                //创建输入框
                var id = "search-" + queryInput.key + that.pluginData.id;
                var input = document.createElement("input");
                query.className = "query";
                input.className = "maytekQinput";
                input.type = "text";
                input.id = id;
                input.setAttribute("queryValue", queryInput.key);
                query.appendChild(input);

                // 生成日历
                if (queryInput.type == "datebox") {
                    var dateValue = queryInput.options.value;
                    $('#' + id).datebox({
                        value: dateValue
                    });
                    continue
                }
                // 生成日期时间输入框
                if (queryInput.type == "datetimebox") {
                    var dateValue = queryInput.options.value;
                    $('#' + id).datetimebox({
                        value: dateValue
                    });
                    continue
                }
                //生成combobox[id]
                if (queryInput.type == 'combobox') {
                    var xyzComboboxData = Object.assign({}, queryInput.options);
                    xyzComboboxData.width = undefined;
                    xyzComboboxData.groupField = queryInput.options.groupField == undefined ? 'group' : queryInput.options.groupField;
                    xyzComboboxData.valueField = queryInput.options.valueField == undefined ? 'value' : queryInput.options.valueField;
                    xyzComboboxData.textField = queryInput.options.textField == undefined ? 'text' : queryInput.options.textField;
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
                    var xyzComboboxLazy = queryInput.options.lazy == undefined ? true : queryInput.options.lazy;
                    if (queryInput.options.url) {
                        xyzComboboxData.url = xyzComboboxLazy ? '' : xyzGetFullUrl(queryInput.options.url);
                    }
                    if (queryInput.options.mode == 'remote') {
                        xyzComboboxData.onShowPanel = function () {
                            var id = $(this)[0].id;
                            $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");
                            if (queryInput.options.url) {
                                $('#' + id).combobox("reload", xyzGetFullUrl(queryInput.options.url));
                            }

                            if (queryInput.options.onShowPanel != undefined) {
                                queryInput.options.onShowPanel();
                            }
                        };
                    } else {
                        xyzComboboxData.onShowPanel = function () {
                            var id = $(this)[0].id;
                            $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");
                            if (queryInput.options.url) {
                                if ($('#' + id).combobox("getData").length == 0) {
                                    $('#' + id).combobox("reload", xyzGetFullUrl(queryInput.options.url));
                                }
                            }

                            if (queryInput.options.onShowPanel != undefined) {
                                queryInput.options.onShowPanel();
                            }
                        };
                    }
                    xyzComboboxData.mode = queryInput.options.mode == undefined ? 'local' : queryInput.options.mode;
                    xyzComboboxData.icons = queryInput.options.icons == undefined ? [{
                        iconCls: 'iconfont icon-clear',
                        handler: function (e) {
                            $(e.data.target).combobox('clear');
                        }
                    }] : queryInput.icons;
                    $('#' + id).combobox(xyzComboboxData);
                } else {
                    //生成textbox
                    $("#" + id).textbox({
                        prompt: queryInput.options.data.prompt,
                        value: queryInput.options.value,
                        icons: [{
                            iconCls: 'iconfont icon-clear',
                            handler: function (e) {
                                $(e.data.target).textbox('setValue', '');
                                $(e.currentTarget.nextElementSibling).focus();
                            }
                        }]
                    });
                }

            }
        };

        /*--sortQueryInput--*/
        function sortQueryInput() {
            var queryUl = $("#" + that.pluginData.id + "MaytekQMobile .queryInputBoxs")[0];
            //设置排序
            sortable = new Sortable(queryUl, {
                group: "sortable",
                animation: 150,
                disabled: true,
                handle: ".label.text-overflow",
                store: {
                    get: function (sortable) {
                        var order = localStorage.getItem(sortable.options.group.name);
                        return order ? order.split('|') : [];
                    },
                    set: function (sortable) {
                        var order = sortable.toArray();
                        localStorage.setItem(sortable.options.group.name, order.join('|'));
                    }
                }
            });
        }

        /*--渲染条件的方法--*/
        that.render = function () {
            creatSearchBox();
            createBox();
            createHistory();
            createInput();
            sortQueryInput();
        };
        that.render();

        /* --执行onLoad方法 --*/
        if (typeof that.pluginData.onLoad == "function") {
            $("#" + that.pluginData.id + "MaytekQMobile").on("ajaxStop", function () {
                plsSearchData.onLoad();
                $("#" + that.pluginData.id + "MaytekQMobile").off("ajaxStop");
            });
        }

        /*--获取查询数据的方法--*/
        function finish(key) {
            //默认canSearch;
            canSearch = true;
            // var key = $(this).attr('queryKey');
            var value;
            var text = '';
            var html = '';
            var $this = $('input[queryvalue="' + key + '"]');

            if (that.pluginData.data[key].type == 'combobox') {
                var htmlData = $this.combobox("getData");

                if (that.pluginData.data[key].options.multiple == true) {
                    value = $this.combobox("getValues");
                    value = value.join(',');
                } else {
                    value = $this.combobox("getValue");
                }
                text = $this.combobox("getText");

                if (value.substring(0, 1) == ",") {
                    value = value.substring(1, value.length);
                    text = text.substring(1, text.length);
                }
                if (text.indexOf(',') > -1) {
                    text.split(',').forEach(function (v) {
                        var htmlitem = '';
                        htmlData.forEach(function (t) {
                            if (t.text == v) {
                                htmlitem = !xyzIsNull(t.html) ? t.html : '';
                            }
                        });
                        html = xyzIsNull(htmlitem) ? html + v + ',' : html + htmlitem;
                    });
                }
            }

            if (that.pluginData.data[key].type == 'textbox') {
                text = $this.textbox("getText");
                value = text;
            }

            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/;
            if (that.pluginData.data[key].type == 'datebox') {
                value = $this.datebox("getValue");

                if (pattern.test(value)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? value = value.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : value;
                    value = value;
                    text = value;
                } else {
                    value = '';
                    text = '';
                }
            }
            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
            if (that.pluginData.data[key].type == 'datetimebox') {
                value = $this.datetimebox("getValue");
                if (pattern.test(value)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? value = value.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : value;
                    value = value;
                    text = value;
                } else {
                    value = '';
                    text = '';
                }
            }

            if (that.pluginData.data[key].type == 'doubleDate') {
                var $dateStart = $('input[datestr="' + key + '"][datestart]');
                var $dateEnd = $('input[datestr="' + key + '"][dateend]');
                var startValue = $dateStart.datebox("getValue");
                var endValue = $dateEnd.datebox("getValue");
                var startText = '';
                var endText = '';
                //解决双日期，鼠标选择删除，没有清空值的清空。
                if ($dateStart.next("span").find("input").eq(0).val() == "") {
                    $dateStart.datebox("clear");
                    startValue = "";
                }

                //解决结束日期>开始日期
                if (new Date(startValue) > new Date(endValue)) {
                    $dateStart.datebox("clear");
                    $dateEnd.datebox("clear");
                    startValue = "";
                    endValue = "";
                    $.messager.alert('警告', '开始日期大于结束日期');
                    canSearch = false;
                }

                if (pattern.test(startValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? startValue = startValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : startValue;
                    startValue = startValue;
                    startText = '起' + startValue;
                } else {
                    startValue = '';
                    startText = '';
                }

                if (pattern.test(endValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? endValue = endValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : endValue;
                    endValue = endValue;
                    endText = '止' + endValue;
                } else {
                    endValue = '';
                    endText = '';
                }

                value = xyzIsNull(startValue) ? xyzIsNull(endValue) ? '' : '^doubleDate^' + endValue : xyzIsNull(endValue) ? startValue + '^doubleDate^' : startValue + '^doubleDate^' + endValue;
                text = xyzIsNull(startText) ? xyzIsNull(endText) ? '' : endText : xyzIsNull(endText) ? startText : startText + '<br>' + endText;
            }

            if (that.pluginData.data[key].type == 'customSearch') {
                value = that.pluginData.data[key].options.customGetValue(that.pluginData.data[key].options);
                that.pluginData.data[key].options.value = value;
                text = that.pluginData.data[key].options.customGetText(that.pluginData.data[key].options);
                that.pluginData.data[key].options.text = text;
                if (!xyzIsNull(that.pluginData.data[key].options.customGetHtml)) {
                    html = that.pluginData.data[key].options.customGetHtml(that.pluginData.data[key].options);
                }
            }

            that.pluginData.data[key].options.value = value;
            that.pluginData.data[key].options.text = text;
            that.pluginData.data[key].options.html = html;

            if (!canSearch) {
                return
            }
        };

        function createSearchData() {
            that.searchData = {};//搜索的数据的基本数据
            that.searchDataText = {};//搜索的数据的基本数据
            for (var getData in that.pluginData.data) {
                var key = that.pluginData.data[getData].key;
                finish(key);
            }
            for (var data in that.pluginData.data) {//遍历总数据
                var searchData = that.pluginData.data[data];
                if (typeof searchData.options.value === 'object') {
                    if (!xyzIsNull(searchData.options.value[0]) || searchData.options.value.length > 1) {
                        that.searchData[searchData.key] = searchData.options.value.join(',');
                        that.searchDataText[searchData.key] = searchData.options.text.join(',');

                    }
                } else {
                    if (!xyzIsNull(searchData.options.value)) {
                        that.searchData[searchData.key] = searchData.options.value;
                        that.searchDataText[searchData.key] = searchData.options.text;

                    }
                }
            }
        };

        var num = 0;
        that.getSearchData = function () {
            createSearchData();
            if (num == 0) {
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryYes';
            } else {
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryNo';
            }
            num++;
            return that.searchData
        };

        /*--其他设置-点击设置--*/
        /*--点击查询框--*/
        $("#" + that.pluginData.id + "searchBox i.icon-search").click(function () {
            plsSearchData.onQuery(JSON.stringify(that.searchData));
        });
        /*--清除查询框--*/
        $("#" + that.pluginData.id + "searchBox i.icon-clear").click(function () {
            $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click();
            that.searchData = {"flagDefaultFastForQuery": "flagDefaultFastForQueryNo"};
            that.searchDataText = {};
            $("#" + that.pluginData.id + "searchBoxInput").val("");
        });
        /*--点击弹出查询框--*/
        $("#" + that.pluginData.id + "searchBox input").click(function () {
            //设置document，overflow：hidden 防止外部document超高页面滚动，关闭时再auto
            $("body").css({"overflow": "hidden"});
            //重新填写历史记录
            createHistory();
            $("#" + that.pluginData.id + "mask").show();
            $("#" + that.pluginData.id + "MaytekQMobile").show();
        });
        /*--点击删除历史查询--*/
        $("#" + that.pluginData.id + "MaytekQMobile .historyList").on("click", "i", function (e) {
            var index = $(this).parent().index();
            $(this).parent().remove();
            historyQueryText.splice(index, 1);
            historyQuery.splice(index, 1);

            if (historyQuery.length < 1) {
                localStorage.removeItem('historyQuery');
                localStorage.removeItem('historyQueryText');
            } else {
                localStorage.historyQuery = JSON.stringify(historyQuery);
                localStorage.historyQueryText = JSON.stringify(historyQueryText);
            }
        });
        /*--点击添加查询条件--*/
        $("#" + that.pluginData.id + "MaytekQMobile .historyList").on("click", "p", function (e) {
            $("body").css({"overflow": "auto"});
            if (!canSearch) {
                canSearch = true;
                return
            }
            $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click();
            var index = $(this).parent().index();
            var data = Object.assign({"flagDefaultFastForQuery": "flagDefaultFastForQueryNo"}, JSON.parse(historyQuery[index]))
            plsSearchData.onQuery(JSON.stringify(data));
            that.searchData = data;
            that.searchDataText = historyQueryText[index];

            //摧毁
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
            //展示收藏
            var showData = "";
            var text = JSON.parse(historyQueryText[index]);
            for (var i in text) {
                showData += text[i] + ",";
            }

            $("#" + that.pluginData.id + "searchBoxInput").val(showData);
        });
        /*--点击排序--*/
        $("#" + that.pluginData.id + "MaytekQMobile .queryInput h2 i").click(function () {
            if ($(this).parents(".queryInput").hasClass("set")) {
                $(this).parents(".queryInput").removeClass("set");
                sortable.option("disabled", true);
            } else {
                $(this).parents(".queryInput").addClass("set");
                sortable.option("disabled", false);
            }

        });
        /*--返回--*/
        $("#" + that.pluginData.id + "MaytekQMobile header>i").click(function () {
            $("body").css({"overflow": "auto"});
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
        });
        /*--点击清空选值--*/
        $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click(function () {
            //清除选择值
            for (var input in that.pluginData.data) {//遍历总数据
                var queryInput = that.pluginData.data[input];

                if (queryInput.defaultQuery == "true") {//判断显示的搜索选项
                    queryInput.options.value = '';
                    queryInput.options.text = '';
                    queryInput.options.html = '';
                }
            }

            //清除input框值
            var $queryInputBoxs = $("#" + that.pluginData.id + 'MaytekQMobile .queryInputBoxs');
            $queryInputBoxs.find("a.icon-clear").click();
            $queryInputBoxs.find(".datebox-f,.datetimebox-f").datebox('clear');
            $queryInputBoxs.find('input[customsearch]').map(function (t) {
                var key = $(this).attr('queryvalue');
                if (!xyzIsNull(that.pluginData.data[key].options.customSetValue)) {
                    that.pluginData.data[key].options.customSetValue(that.pluginData.data[key].options);
                }
                if (!xyzIsNull(that.pluginData.data[key].options.customSetText)) {
                    that.pluginData.data[key].options.customSetText(that.pluginData.data[key].options);
                }
            });
        });
        //点击查询按钮
        $('#searchBtn-' + that.pluginData.id).click(function () {
            $("body").css({"overflow": "auto"});
            if (!canSearch) {
                canSearch = true;
                return
            }
            var data = that.getSearchData();
            //保存查询
            var searchData = Object.assign({}, data);
            delete searchData.flagDefaultFastForQuery;
            if (Object.keys(searchData).length > 0) {
                //判断是否有重复
                var isRepeat = false;
                historyQuery.forEach(function (value) {
                    if (value == JSON.stringify(searchData)) {
                        isRepeat = true;
                    }
                });
                if (!isRepeat) {
                    historyQuery.unshift(JSON.stringify(searchData));
                    historyQueryText.unshift(JSON.stringify(that.searchDataText));

                    if (historyQuery.length > 3) {
                        historyQuery.pop();
                        historyQueryText.pop();
                    }
                    localStorage.historyQuery = JSON.stringify(historyQuery);
                    localStorage.historyQueryText = JSON.stringify(historyQueryText);
                }
            }
            //摧毁
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
            //展示收藏
            var showData = "";
            for (var i in that.searchDataText) {
                showData += that.searchDataText[i] + ",";
            }


            $("#" + that.pluginData.id + "searchBoxInput").val(showData);

            if (typeof that.pluginData.onQuery === 'function') {
                plsSearchData.onQuery(JSON.stringify(data));
            } else {
                return JSON.stringify(data);
            }
        });

        that.setValue = function (data) {
            var $queryInputBoxs = $("#" + that.pluginData.id + 'MaytekQMobile .queryInputBoxs');
            if (!that.pluginData.data[data.key]) {
                return
            }
            var type = that.pluginData.data[data.key].type;

            if (type == 'customSearch') {
                if (typeof data.value == "object") {
                    data.value = data.value.join(',');
                }
                that.pluginData.data[data.key].options.value = data.value;
                if (!xyzIsNull(that.pluginData.data[data.key].options.customSetValue)) {
                    that.pluginData.data[data.key].options.customSetValue(that.pluginData.data[data.key].options);
                }
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]').parent().find('.finish').click();
                return

            }
            if (type == 'doubleDate') {
                var dateStartValue = '';
                var dateEndValue = '';
                if (!xyzIsNull(data.value)) {
                    if (data.value.lastIndexOf('^') == 0) {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                    } else if (data.value.indexOf('^') == 0) {
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    } else {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    }
                }
                $('#dateStart-' + data.key + that.pluginData.id).datebox({
                    value: dateStartValue
                });
                $('#dateEnd-' + data.key + that.pluginData.id).datebox({
                    value: dateEndValue
                });
                $queryInputBoxs.find('input[datestr="' + data.key + '"]').parent().find('.finish').click();
                return
            }

            if (that.pluginData.data[data.key].options.multiple == true) {
                if (typeof data.value == "string") {
                    data.value = data.value.split(',');
                }
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]')[type]('setValues', data.value);
            } else {
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]')[type]('setValue', data.value);
            }
            var key = $queryInputBoxs.find(">div:visible").find(">input").attr("queryvalue");
            if (key != data.key) {
                $queryInputBoxs.find('input[queryValue="' + key + '"]').parent().find('.finish').click();
            }
            $queryInputBoxs.find('input[queryValue="' + data.key + '"]').parent().find('.finish').click();
        };
        that.getValue = function (data) {
            return that.pluginData.data[data.key].options.value
        };
        that.getText = function (data) {
            return that.pluginData.data[data.key].options.text
        };
        that.getHtml = function (data) {
            return that.pluginData.data[data.key].options.html
        };
    }

    //初始化插件
    MaytekQ.init = function (data) {
        if (xyzIsNull(data) || xyzIsNull(data.id)) {
            return
        }
        if ($("#" + data.id).length < 1) {
            return
        }

        if (!map[data.id]) {
            map[data.id] = new MaytekQMobile(data);
        } else {
            for (var k in data) {
                if (k == 'group') {
                    var group = data[k];
                    for (var g in group) {
                        map[data.id].pluginData.group[g] = group[g];
                    }

                    continue
                }
                map[data.id].pluginData[k] = data[k];
            }

            map[data.id].init();
            map[data.id].render();
        }
    };
    //设置插件选中值
    MaytekQ.setValue = function (id, key, value) {
        if (!map[id]) {
            return '';
        }
        if (typeof key == "string") {
            var data = {key: key, value: value};
            map[id].setValue(data);
            return
        }
        if (typeof key == "object") {
            for (var item in key) {
                map[id].setValue({key: item, value: key[item]});
            }
        }
    };
    //获取插件组内数据的选中值
    MaytekQ.getValue = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getValue(data);
    };
    //获取插件组内数据的文本
    MaytekQ.getText = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getText(data);
    };
    //获取插件组内数据的html
    MaytekQ.getHtml = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getHtml(data);
    };
    //获取插件全部选中值
    MaytekQ.getData = function (id) {
        if (!map[id]) {
            return {};
        }
        return map[id].getSearchData();
    };
    //获取插件id
    MaytekQ.getId = function (id, key) {
        if (!map[id]) {
            return {};
        }
        var inputId = "";

        var type = map[id].pluginData.data[key].type;

        if (type == 'customSearch') {
            inputId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[queryvalue="' + key + '"]').prev().attr('id');
        }

        if (type == 'doubleDate') {
            var startId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[datestr="' + key + '"]').eq(0).attr('id');
            var endId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[datestr="' + key + '"]').eq(1).attr('id');
            inputId = [startId, endId];
        } else {
            inputId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[queryvalue="' + key + '"]').attr('id');
        }

        return inputId;
    };
    //清除插件的选中值
    MaytekQ.clear = function (id) {
        if (!map[id]) {
            return {};
        }
        $('#' + id + 'MaytekQMobile .search-clearLablel').click();
    };

    //插件外抛
    window.MaytekQ = MaytekQ;
})();
//初始化当前iframe标题和收藏功能
let $this;

class moduleTileConstructor {
    constructor() {
        this.config = mxApi.getUrlArgument();
        this.container = document.getElementById('moduleTile');
        this.leftPart = document.createElement('div');
        this.leftPart.innerHTML = this.config.groupCn + '一' + this.config.nameCn;
        this.rightPart = document.createElement('div');
        this.txt = document.createElement('span');
        this.icon = document.createElement('span');
        this.rightPart.addEventListener('click', this.changeCollection);
        $this = this;
    }

    //初始化
    init(obj) {
        this.container.innerHTML = '';
        this.container.appendChild(this.leftPart);
        this.container.appendChild(this.rightPart);
        //判断是否在收藏内
        let collection = obj.some(e => {
            if (e.numberCode === this.config.numberCode) {
                return true
            }
        });
        this.txt.innerText = collection ? '取消收藏' : '加入收藏';
        this.icon.classList.add('iconfont');
        this.icon.classList.add(collection ? 'icon-shoucang1' : 'icon-shoucang');
        this.rightPart.appendChild(this.txt);
        this.rightPart.appendChild(this.icon)
    }

    //改变收藏
    changeCollection() {
        if ($this.txt.innerText === "加入收藏") {
            xyzAjax({
                url: 'MySystemWS/addMySystem.do',
                async: true,
                data: {
                    fun: $this.config.numberCode,
                    nameCn: $this.config.nameCn,
                    appId: $this.config.appId
                },
                success: data => {
                    if (data.status === 1) {
                        top.app.querySecurityFunctionList({async: true});
                        $this.txt.innerText = '取消收藏';
                        $this.icon.classList.remove('icon-shoucang');
                        $this.icon.classList.add('icon-shoucang1');
                    }
                }
            })
        } else {
            xyzAjax({
                url: 'MySystemWS/deleteMySystem.do',
                async: true,
                data: {
                    numberCode: $this.config.numberCode,
                    appId: $this.config.appId
                },
                success: data => {
                    if (data.status === 1) {
                        top.app.querySecurityFunctionList({async: true});
                        $this.txt.innerText = '加入收藏';
                        $this.icon.classList.remove('icon-shoucang1');
                        $this.icon.classList.add('icon-shoucang');
                    }
                }
            })
        }
    }
}

$(document).ready(function () {
    if (!mxInfo.isMainFrame) {
        let moduleTile = new moduleTileConstructor();
        moduleTile.init(top.userCollection)
    }
});

//弹框
function xyzdialog(d) {
    $("body").append("<div id='" + d.dialog + "'></div>");
    var height, width;
    // d.fit = d.width > 1200 ? true : false;
    if (!d.fit && d.title != "进度") {
        var total = d.height + d.width;
        if (total <= 700) {
            height = 400;
            width = 460;
        }
        else if (700 < total && total <= 1050) {
            height = 550;
            width = 660;
        }
        else if (1050 < total && total <= 1400) {
            height = 700;
            width = 860;
        }
        else {
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
    height = height > $(window).height() - 20 ? $(window).height() - 20 : height - 12;
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
        resizable: d.resizable == undefined ? false : d.resizable,
        draggable: d.draggable == undefined ? false : d.draggable
    });
    //set center
    if (d.center != undefined || d.center == true) {
        $("#" + d.dialog).dialog("center");
    }

    if (isIframe) {
        $("#" + d.dialog + "Iframe").css({"width": "100%"});
        $("#" + d.dialog + "Iframe").css({"height": "100%"});
        $("#" + d.dialog + "Iframe").attr("src", d.iframeUrl);
    }
};

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
    $ul.parent().find('.sbar').css({"height": scrollBoxHeight - 20 + "px"});
    // 监听高度
    $ul.scroll(function () {
        if ($ul.children()[0]) {
            if ($ul.children()[0].offsetWidth == 0 || $ul.children()[0].offsetWidth + 4 >= $ul[0].offsetWidth) {
                $ul.parent().find('.sbarbox').hide();
            } else {
                $ul.parent().find('.sbarbox').show();
            }
            var scrolltop = $ul.scrollTop();
            scrolltop = (scrolltop / scrollContentHeight) * (scrollBoxHeight - 20);
            $span.css({"top": scrolltop + "px"});
        }
    });
}