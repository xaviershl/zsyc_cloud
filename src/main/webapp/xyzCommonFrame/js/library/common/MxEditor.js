/**
 * Created by Administrator on 2018/4/18.
 * ！！！！！使用前，请一定先引入 wangEditor.js ,否则无法使用！！！！！
 * version: 1.4.2
 * 调用示例：
 *  MxEditor.init(id,function (result) {                // 参数1：容器id，容器为 div，容器的宽高尽量不要小于 350 * 250 过小可能会引起问题
		if (!result.status) {                           // 参数2：回调函数，用于错误提示
			alert(result.msg);                          // 需要几个 就调用 init 方法 初始化几个
		}
	});

 MxEditor.setValue(id,value);    //参数：对应的容器ID and 需要设置的内容(string) 功能：设置内容
 MxEditor.clearValue(id);        //参数：对应的容器ID 功能：清除内容
 MxEditor.getValue(id);          //参数：对应的容器ID 功能：获取内容，带有样式
 MxEditor.getText(id);           //参数：对应的容器ID 功能：获取纯文本，无样式,无法获取到图片的src链接
 MxEditor.disabled(id, value);           //参数：对应的容器ID 类型：Boolean 功能：禁用/开启编辑功能
 MxEditor.setSize(id,width,height);  //参数: 对应的容器ID 、宽度 、高度
 */

(function (window) {
    var MxEditor = new Object();
    var MxEditorMap = new Object();

    //初始化方法
    MxEditor.init = function (wrapId, callback) {
        MxEditorMap[wrapId] = new MxEditorFn(wrapId, callback);
    }

    //设置内容，该方法会清除之前的内容,然后重新设置
    MxEditor.setValue = function (id, value) {
        MxEditorMap[id].setValue(value);
    }

    //清除全部内容
    MxEditor.clearValue = function (id) {
        MxEditorMap[id].clearValue();
    }

    //获取内容，该内容带有样式
    MxEditor.getValue = function (id) {
        return MxEditorMap[id].getValue();
    }

    //获取text，该内容没有样式
    MxEditor.getText = function (id) {
        return MxEditorMap[id].getText();
    }

    //禁用编辑功能
    MxEditor.disabled = function (id, value) {
        value = value || false;
        MxEditorMap[id].instanceEditor.$textElem.attr('contenteditable', !value)
    }

    //主动设置编辑器大小
    MxEditor.setSize = function (id, width, height) {
        var realWidth = width;
        var realHeight = height;
        if (typeof width === "number") {
            document.querySelector('#' + id).style.width = realWidth + 'px';
        } else {
            realWidth = document.querySelector('#' + id).style.width.split('px')[0];
        }
        if (typeof height === "number") {
            document.querySelector('#' + id).style.height = realHeight + 'px';
        } else {
            realHeight = document.querySelector('#' + id).style.height.split('px')[0];
        }


        var row = Math.floor((parseInt(realWidth) - (5 * 2)) / 36);
        var col = Math.ceil(15 / row);
        var toolbarHeight = col * 31 + 2;
        var textHeight = parseInt(realHeight) - toolbarHeight;
        document.querySelector('#' + id + ' .w-e-text-container').style.height = textHeight + 'px';
    }

    function MxEditorFn(wrapId, callback) {
        this.callback = callback;
        this.instanceEditor = null;
        this.start(wrapId, this.callback);
    };

    MxEditorFn.prototype.start = function (id, callback) {
        //容器id
        var self = this;
        var editorId = '#' + id;

        //回调函数
        if (callback) {
            if (callback && typeof callback !== 'function') {
                alert('富文本编辑器的回调必须是一个函数！');
                return;
            }
        }

        //实例富文本
        var editorWrap = document.getElementById(id);
        var editorPanel = '';
        if (!editorWrap) {
            this.sendResult('容器ID【' + id + '】错误，找不到对应元素');
            return;
        } else {
            if (!editorWrap.style.position) editorWrap.style.position = 'relative';
            var editorPanel = document.createElement("div");
            editorPanel.style.width = '100%';
            editorPanel.style.height = '100%';
            editorPanel.style.fontSize = '16px';
            editorPanel.style.position = 'absolute';
            editorPanel.className = 'mx-editor-panel';
            editorPanel.style.left = '0';
            editorPanel.style.top = '0';
            editorWrap.appendChild(editorPanel);

            //处理被屏蔽掉的回退和回车按钮
            try {
                if (banBackSpace && typeof banBackSpace === 'function') {
                    this.keyHandle('keypress', banBackSpace);
                    this.keyHandle('keydown', banBackSpace);
                }
            } catch (e) {

            }

        }

        try {
            var constructionEditor = window.wangEditor;
            if (!constructionEditor) {
                this.sendResult('请先引入<WangEditor.js>!!');
                return;
            }
            this.instanceEditor = new constructionEditor(editorPanel);
        } catch (e) {
            this.sendResult('富文本编辑器实例化失败，请刷新页面重试。');
            return;
        }

        // 自定义菜单配置
        this.instanceEditor.customConfig.menus = setMenus();

        //获取焦点时清除初始提示内容
        this.instanceEditor.customConfig.onfocus = function () {
            self.clearPlaceholder();
        };

        //自定义上传图片到七牛云
        this.instanceEditor.customConfig.customUploadImg = function (files, insert) {
            self.clearPlaceholder();
            for (var i = 0; i < files.length; i++) {
                self.uploadImg(files[i], function (result) {
                    if (result.status) {
                        var imgUrl = result.content.url;
                        insert(imgUrl);
                    } else {
                        self.sendResult('图片上传失败,请重试');
                        return;
                    }
                });
            }

        }

        // 自定义配置颜色（字体颜色、背景色）
        this.instanceEditor.customConfig.colors = [
            '#000000',
            '#ff0000',
            '#fc5252',
            '#fb8585',
            '#ff00ed',
            '#f97af0',
            '#f7b3f2',
            '#2500ff',
            '#6d56f5',
            '#c7bdfe',
            '#00f6ff',
            '#79d4d7',
            '#c5f9fb',
            '#07cb5b',
            '#5add92',
            '#c5fcdc',
            '#e6ff00',
            '#dbe673',
            '#f0f8a9',
            '#ff6400',
            '#faa56e',
            '#ffd5ba',
            '#cccccc',
            '#ffffff',
        ]

        //创建
        this.instanceEditor.create();

        //设置zIndex
        this.instanceEditor.customConfig.zIndex = 800;

        //设置提示
        this.instanceEditor.txt.html('<p style="color: #ccc">请在此输入内容...</p>');

        //设置全屏
        // setScreenBtn(editorId);
    }

    //设置内容，该方法会清除之前的内容,然后重新设置
    MxEditorFn.prototype.setValue = function (value) {
        this.instanceEditor.txt.html(value);
    }

    //清除全部内容
    MxEditorFn.prototype.clearValue = function () {
        this.instanceEditor.txt.clear();
    }

    //获取内容，该内容带有样式
    MxEditorFn.prototype.getValue = function () {
        return this.handleValue('html');
    }

    //获取text，该内容没有样式
    MxEditorFn.prototype.getText = function () {
        return this.handleValue('text');
    }

    //处理value
    MxEditorFn.prototype.handleValue = function (type) {
        var value = '';
        if (type === 'html') {
            value = this.instanceEditor.txt.html();
        } else {
            value = this.instanceEditor.txt.text();
        }
        if (value === '<p style="color: #ccc">请在此输入内容...</p>' || value === '请在此输入内容...' || value === '<p><br></p>') {
            return '';
        } else {
            return value;
        }
    }

    //清除 placeholder
    MxEditorFn.prototype.clearPlaceholder = function () {
        if (this.instanceEditor.txt.text() === '请在此输入内容...') {
            this.instanceEditor.txt.clear();
        }
    }

    //错误提示
    MxEditorFn.prototype.sendResult = function (msg) {
        var result = {
            status: 0,
            msg: msg
        };
        this.callback(result);
        return;
    }

    //按键处理
    MxEditorFn.prototype.keyHandle = function (type, Fn) {
        document.addEventListener(type, function (e) {
            var ev = e || window.event;
            var obj = ev.target || ev.srcElement;
            var className = obj.className;
            var fn = 'on' + type;
            if (className === 'w-e-text') {
                document[fn] = function () {
                    return true;
                };
            } else {
                document[fn] = Fn;
            }
        })
    }

    function setMenus() {
        var menus = [
            'head',  // 标题
            'bold',  // 粗体
            'fontSize',  // 字号
            'fontName',  // 字体
            'italic',  // 斜体
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'backColor',  // 背景颜色
            'link',  // 插入链接
            'list',  // 列表
            'justify',  // 对齐方式
            'image',  // 插入图片
            'table',  // 表格
        ]
        return menus;
    }

    MxEditorFn.prototype.uploadImg = function (file, callback) {
        var qiniuUrl = 'https://upload.qiniup.com';
        var errCodeMsg = {
            'code400': '报文构造不正确或者没有完整发送。',
            'code401': '上传凭证无效。',
            'code403': '上传文件格式不正确。',
            'code413': '上传文件过大。',
            'code579': '回调业务服务器失败。',
            'code599': '服务端操作失败。',
            'code614': '目标资源已存在。'
        };
        getToken(function () {
            if (MxEditorToken.indexOf('error') > -1 || MxEditorToken == '') {
                this.sendResult('token获取失败，请联系管理员');
                return;
            }

            //构建xhr上传表单参数
            var form = new FormData();
            form.append('file', file);
            var typeName = file.name.substring(file.name.lastIndexOf(','))
            form.append('token', MxEditorToken);
            form.append('x:folder', 'editorImg');
            //优化自定义文件名模式
            var date = new Date();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
            form.append('key', 'editorImg/' + dd + '/' + getUUID() + typeName);

            //构建xhr对象
            var xhr = new XMLHttpRequest();
            xhr.open('POST', qiniuUrl, true);
            xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01');
            //上传进度回调
            xhr.upload.onprogress = function (event) {
                //console.log();
            };
            if (xhr.ontimeout) {//暂时不用
                xhr.ontimeout = function (event) {
                    //console.log('上传已超时');
                };
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        var resultData = xhr.responseText;
                        try {
                            resultData = eval('(' + xhr.responseText + ')');
                        } catch (e) {
                            resultData = {
                                status: 0,
                                msg: '上传失败，返回数据异常'
                            };
                        }
                        if (resultData.content && resultData.content.suffix) {//qiniu处理
                            resultData.content.suffix = resultData.content.suffix.replace('.', '');
                        }
                        callback(resultData);
                    } else {
                        var resultData = {
                            status: 0,
                            msg: errCodeMsg['code' + xhr.status] ? errCodeMsg['code' + xhr.status] : xhr.statusText
                        };
                        callback(resultData);
                    }
                }
            };
            xhr.send(form);//发射
        })
    }
    //全屏图标
    var fullScreenIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABcklEQVRYR+2Xv1XEMAzG5cYpOSYBJuBuAmZIZY9kV1mBDQgbhElIGzfiiRfnBWNH/lNckyvPjr5fPjmSLODOP3FnfTgBNgeMMZMQ4olJyaSUeontsdaOAPBa+vwGYK1F7jwg4pfW+rkBAJRSf9KeApiklLe+72cO6mh9GIaLc+4DADZoFoDeck1FE8RefBeTd0BK+bgsy9gCEYp3XXd1zn2TW6wDtIEC1ELExCmV/oxlARBpDURKnOIVA5RCHIlXA4QQiDhqrW+xk2+MeRdCvNGBo5yHXxDrABUiChz7znfpmJVS11QdQMRLTHx1YKT1MP7ZC04HTgfCeQBj/d4XGUScU3VgnQceUl3Ur4fx/7XjsFYHLfUzVQd8IQKAaBdlC1FsA1de9wWJ6x3FACXiHuQIogigRpyDyAaggcSPUanGwo1pMSeyBxI6RDTD1YqnnPBzITuQUIBW8QTE799ZAAcWt94L0gA5F5PWe0Hs+bMX/ACckLkwMCnqsQAAAABJRU5ErkJggg==';
    var fullScreenIconHover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABQUlEQVRYR+2XzRECIQyF31agVqJWoFZgq3agdqCVaAc6b8bMsJiQAIe9wHE3JB8J+WHCwmta2D4GQOqBB4CtExLK7A2ZG4BD7f4U4BO4D08Auw4Abp2F3QLgSU8A3gGoksgawDWDdgF4SoaiFyI1LjpDHtgAYDx7IHLjRwCvn6tcD1CAClohNOMMpdyxEABhWyAs49RXDVALUTLeDJBDMCzMDm1dAJwB8MIx5nkGuR7grefS8lzCQaVUri3CUU4zTnn5P9M/esHwwPBAPg8wV7V+L0WGaWjVAabZqtBF5f9Mv9aO87CkFe5eqANSiKwu6hYiTcArr2lB8npHNUCNcQEpQVQBtBj3IMIAHEhkjLIaizepaZ4IDyS8RGwYrcYtT0gTcgcSKug1rkHItxCA5eLed0FxKI08THrfBX/7Ry/4AojZeyHFobBSAAAAAElFTkSuQmCC';

    //关闭全屏图标
    var ScreenIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABj0lEQVRYR+2XvVHFMAzH5cYpeUwCTMB7EzBDKnsku8oKbEDYIExC2rgRJy7JBUfyx7vj0sRlZEc/y7L0t4KDhzrYP5wAawS89z0APGitb23bjvHRLHZjzAt3bM65QSmFnL3ruksI4QMRR2vtbbt+BXDOvSul3gBg4CC890gLjTHssUn2xTkAPAPApzHmygLQxGmaeqXUEwdxD8DWOSJ+NU1zjaP7ZzcpiFqAEucUiV04JYgagFLnLAB95CBCCN8lOaC1fqSEozOXws7mQJzZMcScRNkkpPwpdS5GYIGJIH4/524BzSnZ+eIjrgOvudJcApD4xxDXiSoA2pm1lu7zbsyFiK6wOLj1Zy84I3BGoOoaUpXL6IHkNeTW1wIUVUKpEFTXgUhMFJdiSdRwYGISxi11FirZCNAuJVFTDMD185p2nFJWMQQrSLh+XitISiF2kkwSEzUAkqjh1PYKkJNRtQClEDtZLomJewBiCETsxXcBPTwQ8cJJZ/rRYk/pAZrH2TfKahTfBTkl9F/2w5vRD4oLuTAqLmHGAAAAAElFTkSuQmCC';
    var ScreenIconHover = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABWklEQVRYR+2X3RHCIBCENxWolagVqBXYqh2oHWgl2oHOzgSHkFs4YmbyAo8S7z7uj6XDwqtb2D8aQByBG4AVgBOAt5GasL8XaXsA+ACw9tcArr1d2v+tGOAC4AyAhiwIGudSaVP7wfkOwB3AUQHwQ55yKyCmAMTOn73zQXTT0+QgagGKzlU4FUQNgMt5Lp8WxMtZA5u+4JhzM+yqBtLiTiFo0FOELGKX85yxABNDhN9KXcDviie3jLEDDo7R7AFQZhidwZxIB1EJgCcLqUid0DhbOLdG/293QYtAi0BtG476OOo5Txv+PQc8o3jWORDfajWjWImaEVyuCNMrNUy50ijmtFOixg1g3ec113FOWQ0grNMoMVErSFwQliSjerXu8xoAnrKkMUfioiSjagFcEJYsV2JiCkAKwbTIdwE3GQXqdvUw4X5OD9ChtR/SQbvyXeAQQ/N/svhl9AXZJHsh0WULygAAAABJRU5ErkJggg==';

    //设置全屏按钮
    function setScreenBtn(id) {
        var editorDom = document.querySelector(id);
        var editorId = id;
        var editorPanel = document.querySelector(id + ' .mx-editor-panel');
        var toolbar = document.querySelector(id + ' .w-e-toolbar');
        var textWrap = document.querySelector(id + ' .w-e-text-container');
        var fullScreenBtn = document.createElement("div");
        var icon = document.createElement("div");
        var editorWdith = editorDom.offsetWidth;
        var editorHeight = editorDom.offsetHeight;
        var textHeight = textWrap.offsetHeight;

        fullScreenBtn.className = 'w-e-menu full-screen';
        fullScreenBtn.style.width = '36px';
        fullScreenBtn.style.height = '31px';
        icon.style.width = '16px';
        icon.style.height = '16px';
        icon.style.marginTop = '1px';
        icon.style.backgroundImage = 'url(' + fullScreenIcon + ')';
        icon.style.backgroundSize = '100% 100%';
        fullScreenBtn.appendChild(icon);
        toolbar.appendChild(fullScreenBtn);

        fullScreenBtn.onmouseenter = function () {
            var className = this.className;
            var url = className.indexOf('full-screen') > -1 ? fullScreenIconHover : ScreenIconHover;
            icon.style.backgroundImage = 'url(' + url + ')';
        }
        fullScreenBtn.onmouseleave = function () {
            var className = this.className;
            var url = className.indexOf('full-screen') > -1 ? fullScreenIcon : ScreenIcon;
            icon.style.backgroundImage = 'url(' + url + ')';
        }

        fullScreenBtn.onclick = function () {
            var className = this.className;
            var url = '';
            if (className.indexOf('full-screen') > -1) {
                this.className = 'w-e-menu screen';
                url = ScreenIconHover;
                fullScreenHandle(true);
            } else {
                this.className = 'w-e-menu full-screen';
                url = fullScreenIconHover;
                fullScreenHandle(false);
            }
            icon.style.backgroundImage = 'url(' + url + ')';
        }

        //开启全屏
        function fullScreenHandle(flag) {
            if (flag) {
                document.documentElement.style.height = '100%';
                document.body.style.height = '100%';
                document.body.style.overflow = 'hidden';
                getParent(editorPanel, 'inherit');
                editorPanel.style.background = '#fff';
                editorPanel.style.position = 'fixed';
                editorPanel.style.top = '0';
                editorPanel.style.left = '0';
                editorPanel.style.zIndex = '9999999';
                var bodyWidth = document.body.clientWidth;
                var bodyHeight = document.body.clientHeight;
                editorPanel.style.width = bodyWidth + 'px';
                editorPanel.style.height = bodyHeight + 'px';
                textWrap.style.height = (bodyHeight - 33) + 'px';
            } else {
                editorDom = document.querySelector(editorId);
                textWrap = document.querySelector(id + ' .w-e-text-container');
                document.body.style.overflow = 'auto';
                editorPanel.style.position = 'absolute';
                editorPanel.style.width = editorDom.offsetWidth + 'px';
                editorPanel.style.height = editorDom.offsetHeight + 'px';
                var realId = id.split('#')[1];
                MxEditor.setSize(realId, editorDom.offsetWidth, editorDom.offsetHeight);
                editorPanel.style.zIndex = '0';
                getParent(editorPanel, 'hidden');
            }
        }

        function getParent(container, type) {
            if (container.parentNode == document.documentElement) {
                return;
            }
            if (container.parentNode) {

                if (type == 'inherit') {
                    container.parentNode.classList.add('overflow-inherit');
                } else {
                    container.parentNode.classList.remove('overflow-inherit');
                }
            }
            getParent(container.parentNode, type);
        }
    }

    //uuid
    function getUUID() {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [];
        var i;
        var r;
        for (i = 0; i < 32; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    }

    //获取token
    // getToken();
    var MxEditorToken = '';
    var timestr = null;

    function getToken(fn) {
        var xhr = new XMLHttpRequest();
        if (!xhr) {
            return;
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    MxEditorToken = xhr.responseText;
                    if (xhr.responseText && xhr.responseText.indexOf('error') === -1) {
                        timestr = new Date().getTime();
                    }
                    if (fn) {
                        fn()
                    }
                }
            }
        };
        xhr.open("POST", 'https://toolapi.maytek.cn/qt2', false);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
        if (timestr && (new Date().getTime() - timestr < 7100000) && fn) {
            fn()
        } else {
            xhr.send();
        }
    }

    window.MxEditor = MxEditor;
})(window);