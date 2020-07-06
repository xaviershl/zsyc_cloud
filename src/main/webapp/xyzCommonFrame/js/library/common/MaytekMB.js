(function () {

    var url;
    var ws;
    var MaytekMB = {};
    MaytekMB.actionCallback = function (msg) {
    }
    var t;
    var ht;
    
    MaytekMB.init = function (groups, actionCallback) {
        if (location.port) {
            //本地开发模式关闭ws功能
            return false
        }
        if (ws) {//先关闭再重连
            ws.close();
        }
        if (t) {
            clearTimeout(t);
        }
        if (typeof actionCallback === 'function') {
            MaytekMB.actionCallback = actionCallback;
        }
        //构建WebSocket连接地址
        var wsUri = '';
        if ('https:' === window.location.protocol) {
            wsUri = 'wss:' + mxInfo.basePath;
        } else {
            wsUri = 'ws:' + mxInfo.basePath;
        }
        var apikey = getCookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc');
        url = wsUri + '/MBWebSocket?apikey=' + apikey + ((groups ? ('&groups=' + groups) : ''));
        //前端开发环境不连接ws
        if (location.href.indexOf('clouddev') !== -1) {
            return
        }
        ws = new WebSocket(url);
        ws.onopen = function (evt) {
            console.log('实时消息已启动。');
        };
        ws.onclose = function (evt) {
            //wsError('由于网络波动，实时消息服务已断开，已停止服务。您可以刷新当前页面系统将自动尝试重新连接实时消息服务。');
            console.log('实时消息已关闭。尝试30秒后重连');
            t = setTimeout(function () {
                MaytekMB.init(groups, actionCallback);
            }, 30 * 1000);
        };
        ws.onmessage = function (evt) {
            if (!evt || !evt.data) {
                return;
            }
            if (evt.data.indexOf('{') != 0 || evt.data.lastIndexOf('}') != evt.data.length - 1) {
                console.log('收到格式异常的实时消息：' + evt.data);
                return;
            }
            var msg = JSON.parse(evt.data);
            if (!msg) {
                return;
            }
            action_systemUpdateNotice(msg);
            MaytekMB.actionCallback(msg);
            /*var mtitle = new MxTitleController();
            mtitle.setValue('您有新消息');
            mtitle.startFlashing();
            new MxMessageBox(msg.title, msg.content, function(){
            	mtitle.stopFlashing();
            	
            });*/
        };
        ws.onerror = function (evt) {
            //wsError('由于网络波动，实时消息服务出错了，已停止服务。您可以刷新当前页面系统将自动尝试重新连接实时消息服务。');
            console.log('实时消息出错了。尝试30秒后重连');
            console.log(evt);
            t = setTimeout(function () {
                MaytekMB.init(groups, actionCallback);
            }, 30 * 1000);
        };
        
        heartbeat();
    };
    
    function heartbeat() {
        ht = setTimeout(function () {
            ws.send('heartbeat=' + getCookie('zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc'));
            clearTimeout(ht);
            heartbeat();
        }, 231 * 1000);
    }
    
    function wsError(content) {
        new MxMessageBox({
            title: '实时消息已停止服务',
            content: content,
            confirmBtn: '好的',
            fn: function (res) {
                console.log(res);
            }
        });
    }
    
    /**
     * 加入指定的组
     */
    MaytekMB.joinGroups = function (groups) {
        if (!ws || !groups) {
            return false;
        }
        ws.send('joinGroups=' + groups);
    };
    
    /**
     * 退出指定的组
     */
    MaytekMB.exitGroups = function (groups) {
        if (!ws || !groups) {
            return false;
        }
        ws.send('exitGroups=' + groups);
        return true;
    };
    
    //网页标题栏特效开始
    window.MxTitleController = function () {
        var oldText, text, timer;
        oldText = text = document.title;
        this.setValue = function (e) { //设置值
            text = document.title = e
        };
        this.startScroll = function () { //开始滚动
            if (text.length >= 15) {
                timer = setInterval(function () {
                    document.title = text.substring(1, text.length) + text.substring(0, 1);
                    text = document.title.substring(0, text.length);
                }, 100);
            }
        };
        this.stopScroll = function (e) { //停止滚动
            clearInterval(timer);
            if (e === 'old') {
                document.title = oldText;
            } else if (typeof  e === 'string') {
                document.title = e;
            }
        };
        this.startFlashing = function (txt) { //开始闪烁
            if (txt) {
                this.setValue(txt)
            }
            timer = setInterval(function () {
                document.title = document.title !== oldText ? oldText : text
            }, 100)
        };
        this.stopFlashing = function () {// 停止闪烁
            clearInterval(timer);
            timer = null;
            document.title = oldText;
        }
    };
    //网页标题栏特效结束
    
    
    //messageBox开始
    window.MxMessageBox = function (obj) {
        var t = obj.title;                                                                //标题文字
        var b = obj.content;                                                       //自定义内容
        var $this = this;                                                              //留住this
        var insertPiont = document.querySelector('body');  //挂载点
        var container = document.createElement('div');       //消息盒子主容器
        var outContainer = document.createElement('div');       //消息盒子主容器
        var head = document.createElement('header');           //标题栏
        var closeBtn = document.createElement('span');    //关闭按钮
        var msgBody = document.createElement('div');       //内容
        var footer = document.createElement('footer');      //底部
        var confirmBtn = document.createElement('div');    //底部确认按钮
        var cancelBtn = document.createElement('div');    //底部关闭按钮
        head.innerText = t || '消息';
        container.className = 'MxMessageBoxContainer';
        closeBtn.className = 'iconfont icon-guideClose';
        outContainer.className = 'MxMessageOutContainer';
        confirmBtn.innerHTML = obj.confirmBtn || '确定';
        msgBody.innerHTML = b || '消息内容';
        outContainer.appendChild(container);
        container.appendChild(head);
        head.appendChild(closeBtn);
        container.appendChild(msgBody);
        container.appendChild(footer);
        footer.appendChild(confirmBtn);
        if (obj.cancelBtn) {
            cancelBtn.innerHTML = obj.cancelBtn;
            footer.appendChild(cancelBtn);
            cancelBtn.onclick = this.close
        }
        insertPiont.appendChild(outContainer);
        this.destory = function () {                                              //摧毁消息盒子
            outContainer.remove();
        };
        this.close = function (res) {                                              //关闭消息盒子
            obj.fn && obj.fn(res)
            var t = setTimeout(function () {
                outContainer.remove();
                clearTimeout(t);
                t = null;
            }, 450);
            container.style = 'animation: hideMegBox 0.5s linear;'
        };
        confirmBtn.onclick = function () {  //点击取消回调
            $this.close('confirm')
        };
        cancelBtn.onclick = function () {  //点击取消回调
            $this.close('cancel')
        };
        closeBtn.onclick = function () { //点击关闭按钮
            $this.close('close')
        }
    };
    //messageBox结束
    //noticeBox开始
    window.MxNoticeBox = function (obj) {
        var canvas = document.createElement('div');//创建遮罩层
        var body = document.createElement('div');//创建容器
        var title = document.createElement('div');//创建标题栏
        var content = document.createElement('div');//创建内容
        var insetPoint = document.querySelector('body'); //找到挂载点
        var footer = document.createElement('footer'); //找到挂载点
        var confirmBtn = document.createElement('div'); //找到挂载点
        var cancelBtn = document.createElement('div'); //找到挂载点
        var link = document.createElement('a');
        canvas.className = 'MxNoticeBox';
        body.className = 'MxNoticeBoxbody';
        title.className = 'MxNoticeBoxtitle';
        content.className = 'MxNoticeBoxcontent';
        link.className = 'MxNoticeAttachment';
        content.innerHTML = obj.content;
        title.innerHTML = obj.title;
        confirmBtn.innerHTML = obj.confirmBtn;
        body.appendChild(title);
        body.appendChild(content);
        body.appendChild(footer);
        body.appendChild(link);
        footer.appendChild(confirmBtn);
        if (obj.cancelBtn) {
            cancelBtn.innerHTML = obj.cancelBtn;
            footer.appendChild(cancelBtn);
        }
        if (obj.url) {
            link.innerHTML = '附件：' + obj.linkName;
            if (navigator.userAgent.indexOf("Chrome") > -1) {
                link.download = obj.linkName;
                link.href = obj.url;
            } else {
                link.onclick = function () {
                    window.open(obj.url);
                }
            }
            
        }
        canvas.appendChild(body);
        insetPoint.appendChild(canvas);
        body.onclick = function (ev) { //阻止事件冒泡
            ev.stopPropagation();
        };
        this.close = function (res) {
            obj.fn && obj.fn(res);
            canvas.style = '  animation: hideNoticeBox 0.5s linear;';
            var t = setTimeout(function () {
                canvas.remove();
                clearTimeout(t);
                t = null;
            }, 450);
        };
        canvas.onclick = function () {  //点击取消回调
            $this.close('close')
        };
        var $this = this;
        confirmBtn.onclick = function () {  //点击取消回调
            $this.close('confirm')
        };
        cancelBtn.onclick = function () {  //点击取消回调
            $this.close('cancel')
        };
        
    };
    
    //noticeBox结束
    
    /**
     * 默认处理系统通知的动作
     */
    function action_systemUpdateNotice(msg) {
        if (!msg || msg.action != 'systemUpdateNotice' || !msg.actionData) {
            return;
        }
        var noticeBox = new MxNoticeBox({
            title: msg.title,
            content: msg.content,
            confirmBtn: '知道了',
            cancelBtn: '下次登录再提醒我',
            fn: function (confirm) {
                if (confirm != 'confirm') {
                    return;
                }
                xyzAjax({
                    url: "../SystemNoticeWS/iHaveKnownOper.do",
                    type: "POST",
                    data: {
                        numberCode: msg.actionData
                    },
                    async: true,
                    dataType: "json",
                    success: function (data) {
                        if (data.status === 1) {
                        } else {
                            top.$.messager.alert("警告", data.msg, "warning");
                        }
                    }
                });
            }
        });
    }
    
    window.MaytekMB = MaytekMB;
})();