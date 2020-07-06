/**
 * maytekF
 */
top.ueditor_style = '';
// 获取ueditor原生style,传入后台
$.ajax({
    type: "get",
    url: "/xyzCommonFrame/js/library/ueditor/themes/default/css/ueditor.min.css",
    dataType: "text",
    async: true
}).done(function (data) {
    top.ueditor_style = '<style>' + data + '</style>'
});
(function () {
    window.editorObj = {}; // 富文本对象
    var slider_wid = 320; // pc 分区宽度(px)
    var com_height = mxApi.isPc() ? 38 : 0.8 * mxApi.getRem(); // 单组件 height
    
    // define plugin
    function define_plugin(){
        var _plugin = function(_type){
            this.type = _type;
            // 组建该组件所需dom
            this.html = function(mxkey, type, options, multiple){
                if(!this.type) return;
                var isDivBox = mxApi.isPc() ? ['maytekFcombobox','mxSelectInput', 'mxComplex','MxEditor','uEditor'] : ['maytekFcombobox', 'mxComplex'];
                var hasMultiple = ['textbox', 'combotree', 'datebox', 'datetimebox'];
                //combobox可以选择渲染两种
                if(this.type == "maytekFcombobox"){
                    if(options.type == "easyui"){
                        isDivBox.splice(0,1);
                        hasMultiple.push("combobox");
                    }
                }
                var _attr = this.type == 'uEditor' && options.hasStyle ? 'hasStyle' : '';
                if(isDivBox.includes(this.type)) return '<div id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '" ' + _attr + '></div>';

                var _mul = hasMultiple.includes(this.type) ? ' ismultiple="' + multiple + '"' : '';
                return '<div><input type="text" id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '"' + _mul + '></div>';
            };
            // 根据组件类型，渲染各类型组件
            this.render = function(form_id, mxkey, opt){
                mxApi.isPc() ? this.render_pc(form_id, mxkey, opt) : this.render_phone(form_id, mxkey, opt);
            };
            this.render_pc = function(form_id, mxkey, opt){
                if(!this.type) return;
                var isNoNeed = ['custom', 'radio', 'checkbox', 'textarea', 'iframe']; // 不需要渲染
                var setList = ['datebox', 'datetimebox', 'maytekFcombobox', 'mxComplex']; // 需要设置宽高

                if(setList.includes(this.type)){
                    this.setFullWidth(form_id, mxkey);
                    opt.height = com_height;
                    opt.width = (this.isFullScreen ? this.fullWidth : opt.width) || '100%';
                    opt.width = this.type === 'maytekFcombobox'|| this.type === 'mxComplex'? '100%' : opt.width;
                }
                if(!isNoNeed.includes(this.type) && this.type === 'mxComplex'){
                    var options = {};
                    opt.complexList.forEach(function (t) {
                        options[t.mxkey] = t;
                    })
                    $("#" + form_id + ' #' + mxkey)[this.type](options);
                    return
                }

                //combobox可以选择渲染两种
                if(this.type == "maytekFcombobox" && opt.type == "easyui"){
                    opt.combobox = mxkey;
                    var width = $("#" + form_id + ' #' + mxkey).parent().width();
                    // opt.panelWidth = 600;
                    // opt.panelMaxWidth = 600;
                    opt.onShowPanel = function(){
                        var target = $("#" + form_id + ' #' + mxkey).combobox("panel").parent();
                        target.addClass("MaytekF-combobox");
                    }
                    xyzCombobox(opt);
                } else{
                    !isNoNeed.includes(this.type) && $("#" + form_id + ' #' + mxkey)[this.type](opt);
                }
            }
            this.render_phone = function(form_id, mxkey, opt){
                if (!this.type) return;
                var isNoNeed = ['custom', 'radio', 'checkbox', 'textarea'];
                opt.width = opt.width || '100%';
                opt.height = opt.height || com_height;
                if(this.type === 'mxComplex'){
                    var options = {};
                    opt.complexList.forEach(function (t) {
                        options[t.mxkey] = t;
                    })
                    $("#" + form_id + ' #' + mxkey)[this.type](options);
                    return
                }
                //combobox可以选择渲染两种
                if(this.type == "maytekFcombobox" && opt.type == "easyui"){
                    opt.combobox = mxkey;
                    var width = $("#" + form_id + ' #' + mxkey).parent().width();
                    // opt.panelWidth = 600;
                    // opt.panelMaxWidth = 600;
                    opt.onShowPanel = function(){
                        var target = $("#" + form_id + ' #' + mxkey).combobox("panel").parent();
                        target.addClass("MaytekF-combobox mxMobilePanel");
                    }
                    xyzCombobox(opt);
                } else{
                    !isNoNeed.includes(this.type) && $("#" + form_id + ' #' + mxkey)[this.type](opt);
                }
            };
            // 部分控件 全屏需设置相应宽度  pc
            this.setFullWidth = function(id, mxkey){
                var $wrap = $('#' + id + ' #' + mxkey).parents('.MForm-tableWrap');
                this.isFullScreen = $wrap.find('.fullscreen').length !== 0 ? true : false;
                this.fullWidth = $wrap.width() - 40;
            }
        }
        var text = new _plugin('textbox');
        var number = new _plugin('numberbox');
        var textarea = new _plugin('textarea');
        var combotree = new _plugin('combotree');
        var date = new _plugin('datebox');
        var datetime = new _plugin('datetimebox');
        var time = new _plugin('time');
        var combobox = new _plugin('maytekFcombobox');
        var complex = new _plugin('mxComplex');
        var radio = new _plugin('radio');
        var checkbox = new _plugin('checkbox');
        var selectInput = new _plugin('mxSelectInput');
        var numberVerify = new _plugin();
        var _MxEditor = new _plugin('MxEditor');
        var uEditor = new _plugin('uEditor');
        var iframe = new _plugin('iframe');
        var custom = new _plugin();
        // rewrite method html
        textarea.html = function (mxkey, type, options) {
            // 最少2行,一行高30
            options.row = options.row || 3;
            var _height = options.row < 2 ? 2 : options.row;
            var _value = options.value || '';
            var readonly = xyzIsNull(options.readonly) || options.readonly == false ? "" : 'readonly';
            var maxlength = xyzIsNull(options.maxlength)? "" : options.maxlength;
            var hei_str = 'min-height:' + _height * 30 + 'px;max-height:' + _height * 30 + 'px;';
            var prompt = xyzIsNull(options.prompt) ? "" : options.prompt;
            var _html = '<textarea id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '" style="' + hei_str + '"' + readonly +' maxlength="'+maxlength+'"' + ' placeholder="' + prompt + '">' + _value + '</textarea>';
            return _html
        }
        radio.html = function (mxkey, type, options) {
            var _html = '<div id="' + mxkey + '" mxkey="' + mxkey + '" maytekf="' + type + '">';
            Object.keys(options).length > 0 && options.data.forEach(function (t) {
                if (!Array.isArray(t)) {
                    _html += '<div class="commonRadioDiv">' +
                        '<input name="' + mxkey + '"  id="' + mxkey + t.value + '" type="radio" value="' + t.value + '" /><span class="radioSpan"><span></span></span>' +
                        '</div><label style="cursor: pointer;margin-right: 20px;" title="" for="' + mxkey + t.value + '">' + t.text + '</label>';
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
                if(!Array.isArray(t)){
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
        numberVerify.html = function (mxkey, type, options) {
            var _wid = typeof options.columns === 'number' ? options.columns * slider_wid - 26 + 'px' : '100%';
            _wid = !mxApi.isPc() ? '100%' : _wid;
            return '<div id="' + mxkey + '"  mxkey="' + mxkey + '" maytekf="' + type + '" style="width:'+_wid+'" enable="'+ (options.enable || true) +'"></div>';
        }
        iframe.html = function (mxkey, type, options) {
            var _attr = '';
            options.width = options.width === undefined ? '100%' : options.width;
            options.height = options.height === undefined ? '300' : options.height;
            for(var key in options){
                var str = ' ' + key + '="' + options[key] + '"';
                _attr += str;
            }
            return '<iframe ' + _attr + '><p>Your browser does not support iframes.</p></iframe>'
        }
        // rewrite method render
        text.render = function (id, mxkey, opt) {
            if(mxApi.isPc()){
                this.setFullWidth(id, mxkey);
                opt.width = (this.isFullScreen ? this.fullWidth : opt.width) || '100%';
            }else{
                opt.width = opt.width || '100%';
            }
            opt.height = com_height;
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
            if(mxApi.isPc()){
                this.setFullWidth(id, mxkey);
                opt.width = (this.isFullScreen ? this.fullWidth : opt.width) || '100%';
            }else{
                opt.width = opt.width || '100%';
            }
            opt.height = com_height;
            opt.icons = [{
                iconCls: 'iconfont icon-clear',
                handler: function (e) {
                    $(e.data.target).textbox('setValue', '');
                }
            }];
            var change = opt.onChange;
            opt.onChange = function (a, b) {
                var re = new RegExp(opt.reg);
                if(!re.test(a)){
                    var tips = xyzIsNull(opt.regTips) ? "您输入的字段不符合标准" : opt.regTips;
                    $("#" + id).find('div[mxkey = '+mxkey+']').children('.MForm-tips').html(tips);
                    $("#" + id).find('div[mxkey = '+mxkey+'] .MForm-input').off('click').on('click', function () {
                        $("#" + id).find('div[mxkey = '+mxkey+']').children('.MForm-tips').html('');
                    });
                    return
                }

                if(typeof change == 'function'){
                    change(a,b);
                }
            };
            $("#" + id + ' input[mxkey="' + mxkey + '"]').numberbox(opt);
        }
        combotree.render = function (id, mxkey, opt) {
            this.setFullWidth(id, mxkey);
            opt.height = com_height;
            opt.width = (this.isFullScreen ? this.fullWidth : opt.width) || '100%';
            opt.width = opt.width;

            opt.url = xyzGetFullUrl(opt.url)
            opt.loadFilter = function (data, parent) {
                if(parent){
                    return null;
                }

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

            $("#" + id + ' #' + mxkey)[this.type](opt);
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
        time.render = function (id, mxkey, opt) {
            // opt.value && $("#" + id + ' input[mxkey="' + mxkey + '"]').val(opt.value);
            // $("#" + id + ' input[mxkey="' + mxkey + '"]').clockTimePicker(opt);
            $("#" + id + ' input[mxkey="' + mxkey + '"]').datetimepicker({
                value: opt.value,
                datepicker:false,
                step:5,
                format:'H:i'
            })
        }
        selectInput.render = function (id, mxkey, opt) {
            $("#" + id + ' #' + mxkey).mxSelectInput('init', opt);
        }
        numberVerify.render = function (id, mxkey, opt) {
            opt.id = mxkey;
            createVerify(opt);
        }
        _MxEditor.render = function (id, mxkey, opt) {
            this.setFullWidth(id, mxkey);
            MxEditor.init(mxkey, function (data) {
                if (!data.status || data.status != 1) {
                    top.$.messager.alert("提示", data.msg, "msg");
                }
            });
            var _wid = this.isFullScreen ? this.fullWidth : $('#' + id + ' #' + mxkey).parents('.MForm-tr').width();
            var width = !opt.width || opt.width === '100%' ? _wid : opt.width;
            var height = !opt.height ? 400 : opt.height;
            MxEditor.setSize(mxkey, width, height);
        }
        uEditor.render = function (id, mxkey, opt) {
            this.setFullWidth(id, mxkey);
            var editor_opt = {
                //这里可以选择自己需要的工具按钮名称,此处仅选择如下七个
                // toolbars:['undo redo bold italic underline forecolor fontfamily fontsize', '| justifyleft justifycenter justifyright justifyjustify |'],
                hasStyle: false,
                toolbars: [[
                    'source', 'undo', 'redo', '|',
                    'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
                    'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
                    'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
                    'directionalityltr', 'directionalityrtl', 'indent', '|',
                    'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
                    'horizontal', 'date', 'time', 'spechars', '|',
                    'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
                    'help', 'customimg'
                ]],
                //focus时自动清空初始化时的内容
                zIndex: 97002,
                // 是否自动长高,默认true
                autoHeightEnabled: false,
                // autoClearinitialContent:true,
                //启用自动保存
                enableAutoSave: false,
                //自动保存间隔时间， 单位ms
                saveInterval: 50000,
                //关闭字数统计
                wordCount: true,
                // 关闭工具栏浮动
                autoFloatEnabled: false,
                //关闭elementPath
                elementPathEnabled: false,
                //默认的编辑区域高度
                initialFrameHeight: 380
                //更多其他参数，请参考umeditor.config.js中的配置项
            }
            editorObj[mxkey] = UE.getEditor(mxkey, $.extend(true, editor_opt, opt));
            editorObj[mxkey].ready(function() {
                editorObj[mxkey].setContent(opt.value ? opt.value.replace(/^<html>/,'').replace(/<\/html>$/, '') : '')
            });
        }

        // Components instance object
        var plugins_pc = {
            text,
            number,
            textarea,
            date,
            datetime,
            time,
            combobox,
            combotree,
            complex,
            radio,
            checkbox,
            selectInput,
            numberVerify,
            MxEditor: _MxEditor,
            uEditor,
            custom,
            iframe
        };
        var plugins_phone = {
            text,
            number,
            textarea,
            date,
            datetime,
            combobox,
            complex,
            radio,
            checkbox,
            numberVerify,
            custom
        }
        return mxApi.isPc() ? plugins_pc : plugins_phone;
    }
    var plugins = define_plugin();

    // 所有控件类型 及渲染api
    var type_phone = {
        'text': 'textbox',
        'number': 'numberbox',
        'textarea': 'textarea',
        'date': 'datebox',
        'datetime': 'datetimebox',
        'combobox': 'maytekFcombobox',
        'complex': 'mxComplex',
        'radio': 'radio',
        'checkbox': 'checkbox',
        'numberVerify': 'numberVerify',
    }
    var type_pc = {
        'text': 'textbox',
        'number': 'numberbox',
        'textarea': 'textarea',
        'date': 'datebox',
        'combotree': 'combotree',
        'datetime': 'datetimebox',
        'time': "time",
        'combobox': 'maytekFcombobox',
        'complex': 'mxComplex',
        'radio': 'radio',
        'checkbox': 'checkbox',
        'numberVerify': 'numberVerify',
        'selectInput': 'mxSelectInput',
        'MxEditor': 'MxEditor',
        'uEditor': 'uEditor',
        'iframe': 'iframe'
    };
    var allTypes = mxApi.isPc() ? type_pc : type_phone;


    // -----------init maytekF
    function MaytekFPlugin(opt){
        mxApi.isPc() ? init_pc.call(this, opt) : init_phone.call(this, opt);
    }
    function init_pc(MaytekFPlugin) {
        var num = 100; // 默认id 初始值
        var that = this;

        that.start = function(opt) {
            opt = opt || MaytekFPlugin;
            this.init(opt);
            this.creatDialog();
            this.creatForm();
            this.addEvents();

            setTimeout(function(){
                that.onLoad(opt)
            }, 0);
        }
        that.init = function(opt) {
            var defaults_opt = {
                title: '新建表单',
                tabs: [],
                height: 600,
                openReadCheck: true
            };
            that.form_id = opt.id;
            that.pluginData = $.extend(true, defaults_opt, opt);
            isType(that.pluginData.tabs) !== 'Array' && (that.pluginData.tabs = []);
            if(xyzIsNull(that.pluginData.col)){
                var _col = 1;
                that.pluginData.tabs.forEach(function (val) {
                    val.content = val.content || [];
                    if(val.content.length > _col){ _col = val.content.length;}
                });
                _col = _col > 3 ? 3 : _col;
                that.pluginData.col = _col;
            }
        }
        // render dialog panel
        that.creatDialog = function() {
            var style = '<style id="maytekstyle">html,body{height:100%;}</style>';
            $('#maytekstyle').length == 0 && $('body').append(style);
            var zindex = that.pluginData.zIndex || 97000; // 表单层级

            //创建遮罩层
            if ($('.MaytekF-mask.'+ that.form_id).length > 0) {
                $('.MaytekF-mask.'+ that.form_id).show();
            } else {
                var html = '<div class="MaytekF-mask '+ that.form_id + '" style="display:block; z-index:'+zindex+'"></div>';
                $('body').append(html);
            }
            var tab_width = that.pluginData.tabs.length > 1 ? 140 : 0;
            // 计算适合的显示列数
            that.parsewidth(that.pluginData.col);
            //创建datagrid框架
            var panel_width = that.pluginData.col * slider_wid + tab_width + 40,
                panel_height = that.pluginData.height;
            var css_str = 'z-index:'+(zindex+1)+';width:'+panel_width+'px;height:'+panel_height+'px';
            var html = '<div class="MaytekF-panel" id="' + that.form_id + '" style="'+css_str+'">' +
                            '<div class="MaytekF-header">' +
                                '<div class="MaytekF-headerTitle">' + that.pluginData.title + '</div>' +
                                '<div class="MaytekF-headerTool"><a href="#" class="close" ><span class="iconfont icon-no"></span></a></div>' +
                            '</div>' +
                            '<aside class="MaytekF-aside"><ul></ul></aside>' +
                            '<div class="MForm-wrap"></div>' +
                            '<div class="MForm-footer"></div>' +
                        '</div>';
            $('body').append(html);

            if(that.pluginData.tabs.length <= 1){
                $("#" + that.form_id + ' .MForm-wrap').css({left: '50px'});
                $("#" + that.form_id + ' .MaytekF-aside').css({left: '60px'});
                $("#" + that.form_id + ' .MForm-footer').css({left: '20px'});
            }

            //创建下方按钮
            if(!that.pluginData.buttons || that.pluginData.buttons.length === 0){
                that.pluginData.buttons = [{
                    text: '确定'
                }, {
                    text: '关闭'
                }]
            }
            that.pluginData.buttons.forEach(function (val) {
                var bgColor = val.backgroundColor ? val.backgroundColor : '';
                var color = val.color ? val.color : '';
                var btn_str = '<a href="javascript:void(0)" style="background-color:'+bgColor+';color:'+color+';"><span class="iconfont '+val.icon+'"></span>' + (val.text ? val.text : '按钮') + '</a>';
                $("#" + that.form_id + ' .MForm-footer').append(btn_str);
            });
        }
        // render tab list
        that.creatForm = function() {
            var _data = that.pluginData;
            var isShowCheckPoint = _data.openReadCheck === false && _data.isShowCheckPoint === false ? false : true; // 是否显示未读检测icon
            _data.tabs.forEach(function (key, index) {
                var _title = key.title || '信息';
                key.tabkey = key.tabkey || that.form_id + 'tabkey' + index;
                var _className = key.checkPointStatus ? 'saw' : ''; // 每个tab 可以单独指定初始阅读状态，默认为false
                var aside = '<li class="'+_className+'" tabkey="' + key.tabkey + '" isShowCheckPoint="' + isShowCheckPoint + '"><p>' + _title + '</p><i class="iconfont icon-cuowu"></i></li>';
                var form = '<div class="MaytekForm" tabkey="' + key.tabkey + '">' +
                    '<div class="MForm-content"><div class="MForm-tableWrap"></div></div>' +
                    '</div>';

                $("#" + that.form_id + ' .MaytekF-aside ul').append(aside);
                $("#" + that.form_id + ' .MForm-wrap').append(form);
                $("#" + that.form_id + " .MaytekF-aside li").eq(0).addClass('active saw');
                that.creatTable(key);
            });
            that.tabEvent();
        }
        // render tab 分区
        that.creatTable = function(form) {
            var $wrap = $("#" + that.form_id + ' div[tabkey="' + form.tabkey + '"] .MForm-tableWrap');
            // tab iframe
            if(form.type === 'iframe'){
                $wrap.css('marginRight', 0)
                var opt = $.extend(true, {}, form.options);
                opt.height = opt.height === undefined ? $wrap.parents('.MaytekForm').height() - 4 : opt.height
                var _ifm = plugins.iframe.html('', '', opt, false);
                $wrap.append(_ifm);
                return
            }
            if(xyzIsNull(form.content)) return;
            form.content.forEach(function (d, index) {
                if(!$.isEmptyObject(d)) {
                    var wid_str = form.col < that.pluginData.col ? form.col * slider_wid : that.pluginData.col * slider_wid;
                    var show = form.show ? form.show : "";
                    var lin_span = show != 'fullscreen' ? '<span class="s_line" style="left: ' + (index * 320 + 303) + 'px"></span>' : '';
                    var table = '<div class="MForm-table '+show+' " ></div>';
                    if(index + 1 < (form.col < that.pluginData.col ? form.col : that.pluginData.col) && show != 'fullscreen'){ // add 分区分割线
                        table += lin_span;
                    }
                    $wrap.append(table).css('width',wid_str +'px');
                    if(isType(d) === 'Array'){
                        d.forEach(function (val) {
                            that.creatTr(form, val, index);
                        })
                    }
                }
            });
        }
        // render 分区组件
        that.creatTr = function(form, data, index) {
            var _mxkey = data.mxkey; // dom mxkey|id
            var td1 = '', td2 = '', td3 = '', td4 = '';

            td1 = !data.label ? '' : data.label;

            if ($('#MaytekF_' + _mxkey).length > 0 || !_mxkey) {
                _mxkey = _mxkey + '' + num++;
            }
            _mxkey = 'MaytekF_' + _mxkey;

            var multiple = data.options && data.options.multiple ? data.options.multiple : 'false';
            var options = !data.options ? {} : data.options;

            if(data.type == "relationSelector"){
                //此处给非第一个，做发起请求前的
                var selectIndex = 0;
                data.options.selectList.forEach(function (d, selectIndex) {
                    d.type = "combobox";
                    // d.options.lazy = true;
                    var selectOnBeforeLoad = d.options.onBeforeLoad;
                    d.options.onBeforeLoad = function (param) {
                        for (var i = 0; i < selectIndex; i++) {
                            var selectMxkey = data.options.selectList[i].mxkey.replace(/MaytekF_/g,"");
                            if(options.type == "easyui"){
                                param[selectMxkey] = $('#MaytekF_' + selectMxkey).combobox('getValue');
                            } else {
                                param[selectMxkey] = $('#MaytekF_' + selectMxkey).maytekFcombobox('getValue');
                            }
                        }
                        selectOnBeforeLoad && selectOnBeforeLoad(param);
                    };
                    that.creatTr(form, d, index);
                });
                return
            }
            // 插入相应类型组件所需dom，错误类型  默认为text
            var plu_type = plugins[data.type] ? data.type : 'text';
            td2 = plugins[plu_type].html(_mxkey, plu_type, options, multiple);
            td3 = xyzIsNull(data.btn) ? "" : data.btn;
            data.hasDeleteIcon && (td3 = '<i class="iconfont icon-close-b" style="font-size: 14px;"></i>');


            td4 = !data.other ? '' : data.other;

            var tr = '', iconClss = '';
            var details = xyzIsNull(data.details) ? '' : data.details;
            details = !details ? '' : '(' + details + ')';
            data.help && (iconClss = 'iconfont icon-help');

            tr = $('<div class="MForm-tr "  mxkey="' + _mxkey + '">'+
                        '<div class="MForm-td MForm-label" valign="top">' + td1 +
                            '<i class="' + iconClss + '"></i>'+
                            '<span class="maytek-detail">' + details + '</span>'+
                        '</div>'+
                    '</div>');
            var _con = ''
            if(plu_type === "custom"){
                _con = '<div class="MForm-td MForm-custom" id="'+ _mxkey +'">' + data.html + '</div>';
            }else if(plu_type === 'iframe'){
                _con = td2;
            }else{
                var isRequired = data.required ? true : false; // 是否必填项
                _con = '<div class="MForm-td MForm-input" valign="top">' + td2 + '</div>' +
                        '<div class="MForm-td MForm-button" valign="top">' + td3+ '</div>' +
                        '<div class="MForm-td MForm-tips" valign="top"></div>' +
                        '<div class="MForm-td MForm-custom" valign="top">' + td4 + '</div>';
                tr.attr('isRequired', isRequired);
            }
            tr.append(_con);

            if(typeof form === 'string'){ // additem method
                if($('#' + that.form_id + ' #' + _mxkey).length > 0){
                    return console.warn('Method additem fails to execute，because the id ' + _mxkey + ' already exists')
                }
                if(form === 'update'){ // update 单个组件对象
                    $("#" + that.form_id + " #maytekF_mark_edit").after(tr);
                }else{
                    var api = index == 'before' ? 'before' : 'after';
                    $("#" + that.form_id + " #" + form).parents(".MForm-tr")[api](tr);
                }
                that.deleteItemEvent();
            } else { // render
                var $table = $("#" + that.form_id + ' div[tabkey="' + form.tabkey + '"] .MForm-table').eq(index);
                $table.append(tr);
            }
            // save data
            var _tr = $("#" + that.form_id + ' .MForm-tr[mxkey="'+_mxkey+'"]');
            _tr.data('mxObj', data)

            // 渲染相应类型组件
            if(plu_type === 'radio'){
                if (!xyzIsNull(data.options.value)) {
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"][value="' + data.options.value + '"]').attr('checked', 'checked');
                }
                if(data.options["onChange"] !== undefined){
                    var oldvalue = data.options.value;
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"]').on("change",function (a,b){
                        data.options["onChange"](that.getValue(data.mxkey), oldvalue);
                        oldvalue = that.getValue(data.mxkey);
                    });
                }
            }
            if(plu_type === 'checkbox'){
                if (!xyzIsNull(data.options.value)) {
                    var v = [];

                    typeof data.options.value === 'string' ? v = data.options.value.split(',') : v = data.options.value;

                    v.forEach(function (t) {
                        $('#' + that.form_id + ' input[name="' + _mxkey + '"][value="' + t + '"]').attr('checked', 'checked');
                    });
                }
                if(data.options["onChange"] !== undefined){
                    var oldvalue = data.options.value;
                    $('#' + that.form_id + ' input[name="' + _mxkey + '"]').on("change",function (a,b){
                        data.options["onChange"](that.getValue(data.mxkey),oldvalue);
                        oldvalue = that.getValue(data.mxkey);
                    });
                }
            }
            plugins[plu_type].render(that.form_id, _mxkey, options)

            // tip 提示
            data.help = !data.help ? '' : data.help;
            if (data.help) {
                var tipBox = '<div class="remarkTitleHelp" mxkey="'+_mxkey+'">'+
                                '<div>' + data.help + '</div>'+
                                '<span class="iconfont icon-tabsClose"></span>'+
                                '<div class="remarkTitleHelpUp"></div>'+
                            '</div>';
                $("body").append(tipBox);
            }

        }
        // 左侧tab events
        that.tabEvent = function(){
            $("#" + that.form_id + " .MaytekF-aside li").off().on("click", function () {
                var index = $(this).index();
                $("#" + that.form_id + " .MaytekF-aside li").removeClass('active');

                $(this).addClass('active').addClass("saw");
                // $("#" + that.form_id+" .MForm-wrap .MaytekForm").eq(index).show().siblings().hide();
                $("#" + that.form_id+" .MForm-wrap .MaytekForm").eq(index).addClass('active').siblings().removeClass('active');

                $tabsClose = $('.icon-tabsClose');
                $tabsClose && $tabsClose.click();
                $("#" + that.form_id+' .MForm-content').get(index).scrollTop > 0 && $("#" + that.form_id+' .MForm-content').get(index).scrollTo(0,0);
            });
        }
        // emit onload callback
        that.onLoad = function(){
            that.pluginData.onLoad && that.pluginData.onLoad(that.pluginData);
        }
        // 绑定相关事件
        that.addEvents = function(){
            that.deleteItemEvent();
            // 右上角close icon
            $("#" + that.form_id + ' .MaytekF-header a').on('click', function () {
                var btn = $(this).attr('class');
                if (btn === 'close') {
                    // $("#" + that.form_id).hide();
                    // $(".MaytekF-mask").hide();
                    that.destroy();
                }
            });
            // help icon event
            $("#" + that.form_id + " .MForm-table ").on('click', '.icon-help', function (e) {
                var e = e || event;

                var $input = $(this).parents('.MForm-tr');
                var index = $input.attr('mxkey');
                var left = e.clientX;
                var top = $input.offset().top;

                $tipBox = $(".remarkTitleHelp[mxkey='"+index +"']");
                var height = $tipBox.height();

                if($tipBox.is(":hidden")){
                    $(".remarkTitleHelp").hide();
                    $tipBox.fadeIn(300).css({
                        left: left - 128,
                        top: top - height
                    });
                } else {
                    $(".remarkTitleHelp").hide();
                }
            });
            $("#" + that.form_id + ' .MForm-content').scroll(function () {
                $(".remarkTitleHelp").hide();
            });
            // button区事件
            $("#" + that.form_id + ' .MForm-footer a').on('click', function () {
                var $form = $("#" + that.form_id);
                var $tab = $form.find('.MaytekF-aside li');
                var _btns = that.pluginData.buttons;
                var _index = $(this).index();
                var data = that.getAllValue(true);

                if(_btns.length == 1 || _index == _btns.length - 1){// 最后一个按钮，默认绑定销毁事件
                    var a = _btns[_index].handler && _btns[_index].handler();
                    if(a !== false){
                        that.destroy();
                    }
                }else{
                    $form.find('.MaytekF-aside li').removeClass('noInfo');
                    var sawN = $("#" + that.form_id + " .saw").length;
                    var tabN = $tab.length;
                    if(that.pluginData.openReadCheck && sawN !== tabN){ // 是否阅读检测
                        var msg = $tab.not(".saw").find("p").html();
                        top.$.messager.alert("提示","您还没有阅读"+msg, "warning");
                    }else{ // 必填检测
                        if(isType(data)  == 'Array'){
                            data.forEach(function (t) {
                                var tips = t.maytekResultType == "required" ? '该项为必填项' : t.regTips ;
                                var $box = $form.find('.MForm-tr[mxkey = ' + t.id + ']');

                                $box.children('.MForm-tips').html(tips);
                                $box.children('.MForm-input').off('click').on('click', function () {
                                    $box.children('.MForm-tips').html('');
                                });

                                var index = $box.parents(".MaytekForm").index();
                                $tab.eq(index).addClass('noInfo');

                                // console.log('必填：',t);
                            });
                        }
                        if($form.find('.MaytekF-aside li.noInfo').length > 0) return;

                        _btns[_index].handler && _btns[_index].handler(data);
                    }
                }
            });
            $('body').on('click', '.icon-tabsClose', function () {
                $(".remarkTitleHelp").hide();
            })
        }
        // 根据实际屏幕宽度，设置相应的分区个数
        that.parsewidth = function(col) {
            var allWidth = $('.MaytekF-mask ').width();
            var tab_width = that.pluginData.tabs.length > 1 ? 140 : 0;
            if(col * slider_wid + tab_width + 40 < allWidth){
                that.pluginData.col = col;
            }else{
                that.parsewidth(col-1)
            }
        }
        that.start(MaytekFPlugin);
    }
    function init_phone(MaytekFPlugin) {
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
        that.initMobile = function (opt) {
            var defaults_opt = {
                title: '新建表单',
                tabs: [],
                height: 600,
                openReadCheck: true
            };
            that.form_id = opt.id;
            that.pluginData = $.extend(true, defaults_opt, opt);
            // document.querySelector('body').style.overflow = "hidden";
            document.querySelector('html').classList.add('hide');
            isType(that.pluginData.tabs) !== 'Array' && (that.pluginData.tabs = []);
            var zindex = that.pluginData.zIndex || 97000; // 表单层级
            var $panel = $('<div class="maytekF-mobile-panel ' + that.form_id + '" id="' + that.form_id + '" style="z-index: ' + zindex + '"></div>');
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
            var td1 = '', td2 = '';

            td1 = !data.label ? '' : data.label;
            if ($('#MaytekF_' + _mxkey).length > 0 || !_mxkey) {
                _mxkey = _mxkey + '' + num++;
            }
            _mxkey = 'MaytekF_' + _mxkey;

            var multiple = data.options && data.options.multiple ? data.options.multiple : 'false';
            var options = !data.options ? {} : data.options;
            // 插入相应类型组件所需dom，错误类型  默认为text,移动端会把MxEditor默认解析为textarea类型
            var plu_type = plugins[data.type] ? data.type : data.type == 'MxEditor' ? 'textarea' : 'text';
            td2 = plugins[plu_type].html(_mxkey, plu_type, options, multiple);

            td3 = xyzIsNull(data.btn) ? "" : data.btn;
            data.hasDeleteIcon && (td3 = '<i class="iconfont icon-close-b" style="font-size: 14px;"></i>');

            var $cell = $('<div class="MForm-tr" mxkey="' + _mxkey + '"></div>');
            var _con = ''
            if (plu_type === "custom") {
                var _label_str = '<div class="MForm-label">' +
                                    '<span class="form-cell-text" required="' + isRequired + '">' + td1 + '</span>' +
                                '</div>';
                var _content_str = '<div class="MForm-input custom-box" id="' + _mxkey + '">' + data.html + '</div>';
                _con = data.label ? _label_str + _content_str : _content_str;
            } else {
                var isRequired = data.required ? true : false; // 是否必填项
                var width_class = plu_type === "complex" && !data.label ? 'pull-width' : '';
                var _label_str = '<div class="MForm-label">' +
                                    '<span class="form-cell-text" required="' + isRequired + '">' + td1 + '</span>' +
                                '</div>';
                var _content_str = '<div class="MForm-input ' + width_class + '">' + td2 + '</div>' +
                                    '<div class="MForm-button">' + td3 + '</div>' +
                                    '<div class="MForm-tips"></div>';
                _con = plu_type === "complex" && !data.label ? _content_str : _label_str + _content_str;
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
                    $("#" + that.form_id + " #" + form).parents(".MForm-tr")[api]($cell);
                }
                that.deleteItemEvent();
            } else { // render
                var tabkey = form.tabkey || that.form_id + 'tabkey' + index;
                var $table = $("#" + that.form_id + ' div[tabkey="' + tabkey + '"]');
                $table.append($cell);
            }

            // save data
            var _tr = $("#" + that.form_id + ' .MForm-tr[mxkey="' + _mxkey + '"]');
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
            $('.maytekF-mobile-panel.' + that.form_id).addClass('active');
            that.pluginData.onLoad && that.pluginData.onLoad(that.pluginData);
        }
        // 绑定相关事件
        that.addEvents = function () {
            that.deleteItemEvent();
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
                            var $box = $form.find('.MForm-tr[mxkey = ' + t.id + ']');

                            $box.children('.MForm-tips').html(tips);
                            $box.children('.MForm-input').off('click').on('click', function () {
                                $box.children('.MForm-tips').html('');
                            });
                        });
                        return;
                    }
                    _btns[_index].handler && _btns[_index].handler(data);
                }
            });
        }

        that.start(MaytekFPlugin);
    }
    // 外抛 methods
    function _proto_methods(){
       // delete icon event
       this.deleteItemEvent = function(){
            var that = this;
            $('#' + that.form_id + ' .icon-close-b').off().on('click', function () {
                var _id = $(this).parents('div[mxkey]').attr('mxkey');
                that.removeItem(_id.slice(8));
            });
        }
        /**
         * @method render 根据参数重新渲染表单
         * @param Object opt 缺省值为当前表单初始参数
         */
        this.render = function(opt){
            this.destroy(false);
            this.start(opt)
        };
        /**
         * @method addItem|removeItem 新增/删除某个组件
         * @param Array|String data是具体mxkey值或是一个mxkey列表
         */
        this.addItem = function(mxkey, data, pos){
            var dom_id = 'MaytekF_' + mxkey;
            var _data = $.extend(true, isType(data) === 'Array' ? [] : {}, data);
            var that = this;
            if(isType(_data) === 'Array'){
                var arr = pos === 'before' ? _data : _data.reverse();
                arr.forEach(function(item){
                    that.creatTr(dom_id, item, pos);
                })
            }else if(isType(_data) === 'Object'){
                that.creatTr(dom_id, _data, pos);
            }
        };
        this.removeItem = function(data){
            var that = this;
            if(isType(data) === 'Array'){
                data.forEach(function(mxkey){
                    deleteItem(mxkey);
                })
            }
            if(isType(data) === 'String'){
                deleteItem(data);
            }
            function deleteItem(mxkey){
                var dom_id = 'MaytekF_' + mxkey;
                var $this = $("#" + that.form_id + " #" +dom_id);
                var _parent = $this.parents('[mxkey]');
                var _type = $this.attr('maytekf');
                if (_type === 'date' || _type === 'datetime') $this[allTypes[_type]]('destroy');
                _parent.remove();
            }
        };
        this.removeTab = function(data){
            var that = this;
            if(isType(data) === 'Array'){
                data.forEach(function(index){
                    deleteTab(index);
                })
            }
            if(isType(data) === 'Number'){
                deleteTab(data);
            }
            function deleteTab(index){
                var tabkey = that.form_id + 'tabkey' + index;
                // clear 组件相关dom
                $('#' + that.form_id + ' [tabkey="' + tabkey + '"] [maytekf]').each(function () {
                    var _type = $(this).attr('maytekf');
                    $('.remarkTitleHelp[mxkey="' + this.id + '"]').remove();
                    if (_type === 'date' || _type === 'datetime') {
                        $(this)[allTypes[_type]]('destroy')
                    }
                });

                $('#' + that.form_id + ' [tabkey="' + tabkey + '"]').remove()
            }
        };
        // set|get methods
        this.setValue = function(mxkey, value){
            value = xyzIsNull(value) ? '' : value;
            var dom_id = 'MaytekF_' + mxkey;
            var _dom = $('#' + dom_id),
                multiple = _dom.attr('ismultiple') || 'false',
                _type = allTypes[_dom.attr('maytekf')] || '';
            if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

            switch(_type){
                case 'numberVerify': return;
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
                case 'uEditor':
                    return editorObj[dom_id].setContent(value);
                case 'datebox':
                case 'datetimebox':
                case 'textbox':
                    return multiple !== 'false' ? _dom[_type]('setValues', value) : _dom[_type]('setValue', value);
                case 'time':
                case 'textarea':
                    return  _dom.val(value);
                case 'mxSelectInput':
                case 'maytekFcombobox':
                    var type = "";
                    this.pluginData.tabs.forEach(function (d1, index) {
                        d1.content.forEach(function (d2) {
                            d2.forEach(function (d3) {
                                if(d3.mxkey == mxkey && !!d3.options && d3.options.type == "easyui"){
                                    type = "easyui";
                                }
                            })
                        })
                    });
                    if(type !== ""){
                        return _dom["combobox"]('setValue', value);
                    }
                case 'mxComplex':
                case 'numberbox':
                case 'combotree':
                    return _dom[_type]('setValue', value);
                case 'relationSelector':
                    var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                    if( typeof value == "object"){
                        for(var v in value){
                            list.forEach(function (t) {
                                var key = t.mxkey.replace(/MaytekF_/g,"");
                                if(v == key){
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
        this.getValue = function(mxkey){
            var dom_id = 'MaytekF_' + mxkey;
            var _dom = $('#' + dom_id);
            var multiple = _dom.attr('ismultiple') || 'false';
            var _type = allTypes[_dom.attr('maytekf')] || '';
            if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

            switch (_type){
                case 'numberVerify': return;
                case 'radio':
                    return $('#' + dom_id + ' input[name="' + dom_id + '"]:checked').val();
                case 'checkbox':
                    return $.map($('#' + dom_id + ' input[name="' + dom_id + '"]:checked'), function (p) {
                        return $(p).val();
                    }).join(",");
                case 'MxEditor':
                    return MxEditor.getValue(dom_id);
                case 'uEditor':
                    var css_str = _dom.attr('hasStyle') !== undefined ? top.ueditor_style : '';
                    return '<html>' + css_str + editorObj[dom_id].getContent() + '</html>';
                case 'datebox':
                case 'datetimebox':
                case 'textbox':
                    return multiple !== 'false' ? _dom[_type]('getAllValue') : _dom[_type]('getValue');
                case 'combotree':
                    return multiple !== 'false' ? _dom[_type]('getValues').join(',') : _dom[_type]('getValue');
                case 'time':
                case 'textarea':
                    return _dom.val()
                case 'mxSelectInput':
                case 'maytekFcombobox':
                    var value = "";
                    this.pluginData.tabs.forEach(function (d1, index) {
                        d1.content.forEach(function (d2) {
                            d2.forEach(function (d3) {
                                if(d3.mxkey == mxkey && d3.options && d3.options.type == "easyui"){
                                    value = _dom["combobox"]('getValue');
                                }
                            })
                        })
                    });
                    if(value !== ""){
                        return value;
                    }
                case 'mxComplex':
                case 'numberbox':
                    return _dom[_type]('getValue');
                case 'relationSelector':
                    var value = {};
                    var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                    list.forEach(function (t) {
                        var key = t.mxkey.replace(/MaytekF_/g,"");
                        value[key] = $('#' + t.mxkey).maytekFcombobox('getValue');
                    });
                    return value;
                default:
                    return _dom.textbox('getValue')
            }
        };
        this.getText = function(mxkey){
            var dom_id = 'MaytekF_' + mxkey;
            var _dom = $('#' + dom_id);
            var _type = allTypes[_dom.attr('maytekf')] || '';
            if (_dom.length === 0) return console.warn('The element id "' + dom_id + '" does not exist');

            switch (_type){
                case 'numberVerify': return;
                case 'radio':
                case 'checkbox':
                case 'MxEditor':
                case 'datebox':
                case 'datetimebox':
                case 'textbox':
                    return this.getValue(mxkey)
                case 'time':
                case 'textarea':
                    return  _dom.val()
                case 'mxSelectInput':
                    return _dom[_type]('getValue');
                case 'uEditor':
                    return editorObj[dom_id].getContentText();
                case 'maytekFcombobox':
                    var text = "";
                    this.pluginData.tabs.forEach(function (d1, index) {
                        d1.content.forEach(function (d2) {
                            d2.forEach(function (d3) {
                                if(d3.mxkey == mxkey && d3.options && d3.options.type == "easyui"){
                                    text = _dom["combobox"]('getText');
                                }
                            })
                        })
                    });
                    if(text !== ""){
                        return text;
                    }
                case 'mxComplex':
                case 'numberbox':
                case 'combotree':
                    return _dom[_type]('getText');
                case 'relationSelector':
                    var text = {};
                    var list = this.pluginData.tabs[index[0]].content[index[1]][index[2]].options.selectList;
                    list.forEach(function (t) {
                        var key = t.mxkey.replace(/MaytekF_/g,"");
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
        this.getAllValue = function(checkRequire){
            var that = this;
            checkRequire = checkRequire === true ? true : false;
            $("#" + that.form_id).find('.MForm-tips').html('');

            var result = {};
            var requireId = []; // 检测通过失败的id
            $('#' + that.form_id + ' [maytekf]').each(function () {
                var required = $(this).parents('.MForm-tr').attr('isrequired');
                var v_type = $(this).attr('maytekf');
                var _mxkey = this.id.slice(8);
                var _value = that.getValue(_mxkey);
                result[_mxkey] = that.getValue(_mxkey) || '';

                if (checkRequire && required == 'true' &&  v_type == 'complex') {
                    var complexValues = "";
                    for (var v in result[_mxkey]) {
                        complexValues += result[_mxkey][v];
                    }
                    if (complexValues == "") result[_mxkey] = "";
                }
                if (checkRequire && required == 'true' && result[_mxkey] == '' && v_type !== 'numberVerify') {
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
                    if(v_type == 'numberVerify'){
                        var enable = $('#' + that.form_id +' #'+ this.id).attr('enable') === 'true';
                        if(enable && !numberVerifyObj[this.id].getResult()){
                            requireId[requireId.length] =  {id: this.id, maytekResultType: 'reg', regTips:"验证不通过"} ;
                        }
                        delete result[_mxkey];
                    }
                }
            });
            result = checkRequire && requireId.length > 0 ? requireId : result;
            return result;
        };
        /**
         * @method clear 清空该表单所有内置组件值
         */
        this.clear = function(){
            var that = this;
            $('#' + that.form_id + ' [maytekf]').each(function () {
                var _mxkey = this.id.slice(8);
                that.setValue(_mxkey, '');
            });
        };
        /**
         * @method getTarget 获取该组件配置对象
         * @param String mxkey
         */
        this.getTarget = function(mxkey){
            var data = $('#MaytekF_' + mxkey).parents('[mxkey]').data('mxObj');
            var _data = $.extend(true, new mxOpt(), data)
            return _data;
        };
        /**
         * @method update 更新某个组件(实际上是先销毁，再重新渲染)
         * @param allTypes mxkey no use
         * @param Object data 组件配置对象
         */
        this.update = function(mxkey, data){
            var $mark = $('<div id="maytekF_mark_edit"></div>');
            var $target = $('#MaytekF_' + data.mxkey);
            var $formTr = $target.parents('[mxkey]');
            if($target.length === 0 || $target.parents.length === 0) return;
            $formTr.after($mark);
            this.removeItem(data.mxkey);
            this.creatTr('update', data);
            $('#maytekF_mark_edit').remove();
        }
    }
    function _proto_pc(){
        this.initData = function(index,data){
            var that = this;
            // that.creatTable
            if(typeof index !== "object"){
                return
            }
            that.pluginData.tabs[index[0]].tabkey = that.pluginData.tabs[index[0]].tabkey ?
                                                    that.pluginData.tabs[index[0]].tabkey : that.form_id + 'tabkey' + index[0];
            data.forEach(function (val) {
                that.creatTr(that.pluginData.tabs[index[0]], val, index[1]);
            });
        };
        /**
         * @method addTab | removeTab 新增/删除tab页
         * @param Number | Array data 索引值或包含索引的数组
         */
        this.addTab = function(data){
            var that = this;
            if(isType(data) === 'Array'){
                data.forEach(function(tabObj){
                    createNewTab(tabObj);
                })
            }
            if(isType(data) === 'String'){
                createNewTab(data);
            }
            function createNewTab(tabObj){
                var _title = tabObj.title || '信息';
                var index = $("#" + that.form_id + ' .MaytekF-aside ul li').length;
                tabObj.tabkey = tabObj.tabkey || that.form_id + 'tabkey' + index;
                var aside = '<li tabkey="' + tabObj.tabkey + '"><p>' + _title + '</p><i class="iconfont icon-cuowu"></i></li>';
                var form = '<div class="MaytekForm" tabkey="' + tabObj.tabkey + '">' +
                                '<div class="MForm-content"><div class="MForm-tableWrap"></div></div>' +
                            '</div>';

                $("#" + that.form_id + ' .MaytekF-aside ul').append(aside);
                $("#" + that.form_id + ' .MForm-wrap').append(form);
                that.creatTable(tabObj);
                that.tabEvent();
            }
        };
        this.setDetail = function(mxkey, val){
            var _key = 'MaytekF_' + mxkey;
            var msg = val ? '('+val+')' : '';
            var target = $("#" + this.form_id + ' [mxkey="' + _key + '"] .maytek-detail');
            target.html(msg);
        };
        this.clearData = function(index){
            if(typeof index !== "object") return;
            $('#' + this.form_id + ' .MaytekForm').eq(index[0]).find(".MForm-table").eq(index[1]).html("");
        };
        /**
         * @method destroy 销毁表单
         */
        this.destroy = function(isClearMap){
            isClearMap = isClearMap === false ? false : true;
            $('#' + this.form_id + ' [maytekf]').each(function () {
                var _type = $(this).attr('maytekf');
                $('.remarkTitleHelp[mxkey="' + this.id + '"]').remove();
                if (_type === 'date' || _type === 'datetime') {
                    $(this)[allTypes[_type]]('destroy')
                }
                if(_type == 'uEditor'){
                    editorObj[this.id].destroy();
                }
            });
            isClearMap && delete map[this.form_id];
            $('#maytekstyle').remove();
            $('#' + this.form_id).remove();
            $(".MaytekF-mask."+ this.form_id).hide();
        };
    }
    function _proto_phone(){
        /**
         * @method addTab | removeTab 新增/删除tab页
         * @param Number | Array data 索引值或包含索引的数组
         */
        this.addTab = function(data){
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
        };
        /**
         * @method destroy 销毁表单
         */
        this.destroy = function (isClearMap) {
            $('.maytekF-mobile-panel.' + this.form_id).removeClass('active');
            document.querySelector('html').classList.remove('hide');
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
    }
    _proto_pc.prototype = new _proto_methods();
    _proto_phone.prototype = new _proto_methods();
    MaytekFPlugin.prototype = mxApi.isPc() ? new _proto_pc() : new _proto_phone();

    // 组件配置 init
    var mxOpt = function(){
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
    ];
    mxMethodsList.forEach(function(method_name){
        mxOpt.prototype[method_name] = function(opt){
            var mxkey = this.mxkey;
            if(!mxkey) return;
            var panel_class = mxApi.isPc() ? '.MaytekF-panel' : '.maytekF-mobile-panel';
            var form = $('#MaytekF_' + mxkey).parents(panel_class).attr('id');
            return MaytekF[method_name](form, mxkey, opt)
        }
    })

    // 注入全局对象MaytekF,注册相应事件
    var MaytekF = {};
    var map = {};
    // form id check, throw error
    function checkForm(form_id){
        if (!map[form_id]){
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
    var pc_m = ['initData', 'setDetail', 'clearData']; // pc 特有方法
    _methods = mxApi.isPc() ? _methods.concat(pc_m) : _methods;
    _methods.forEach(function(method){
        if(method === 'init'){
            // init method
            MaytekF.init = function (data) {
                if (xyzIsNull(data) || xyzIsNull(data.id)) return;
                if (!map[data.id]) {
                    map[data.id] = new MaytekFPlugin(data);
                } else {
                    $(".MaytekF-mask."+ data.id).show();
                    $("#" + data.id).show();
                }
            };
            return;
        }
        MaytekF[method] = function(form_id){
            if(!checkForm(form_id)) return;
            return map[form_id][method](arguments[1], arguments[2], arguments[3]);
        }
    })

    window.MaytekF = MaytekF;
})();
