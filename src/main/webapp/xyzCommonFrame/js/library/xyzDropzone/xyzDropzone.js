/**
 上传控件封装
 xyzDropzone.js
 v0.0.15
 20180502
 **/
(function (window) {
    var uploadToken = '';
    var xyzDropzone = {};//xyzDropzone对象
    xyzDropzone.version = 'v0.0.15';
    xyzDropzone.versionTime = '20180502';
    //default callback functions
    var xyzFuc = {};
    xyzFuc.complete = function (result) {
        if (result.status == 1) {//上传成功
            xyzFuc['success'](result);
        } else {//上传失败
            xyzFuc['error'](result);
        }
    };
    xyzFuc.progress = function (result) {
        //console.log("文件"+result.fileName+" 已上传"+result.progress+"%");
    };
    //上传成功的回调
    xyzFuc.success = function (result) {
        alert("文件" + result.content.fileName + "上传成功，url=" + result.content.url);
    };
    //上传出错或失败的回调
    xyzFuc.error = function (result) {
        alert(result.msg);
    };
    xyzFuc.invalidFileFail = function (result) {
        alert(result.msg);
    };
    //使用者自定义对文件做特殊验证
    xyzFuc.invalidFile = function (file) {
        return true;
    };
    /**
     *在页面创建一个xyzDropzone控件
     {
         xyzDropzone:"myXyzDropzone",//必填 字符串 这个xyzDropzone的唯一标识，针对这个xyzDropzone的所有操作都需要填写这个索引。
         uploadButtonDiv:"uploadButtonDiv",//上传按钮展示的div的ID  默认使用xyzDropzone的值
         dropElement:document.body,//拖拽有小区域的元素标签
         xyzDropzoneServer:"http://file.duanyi.com.cn:30004/index.html",//提供xyzDropzone服务的页面地址
         params:{"derictoryCode":"mydirectory"},//上传时需要同时post到服务器的参数键值对(json格式)
         maxFiles:10,//本控件最多允许上传的文件数量 默认10
         acceptedExtName:".png,.jpg,.jpeg",//允许文件类型
         maxFilesize:"20kb",//允许上传的单个文件大小（单位kb）
         imageSize:{"minWidth":100,"maxWidth":100,"minHeight":100,"maxHeight":100},//图片类文件宽高尺寸限制 （此参数暂时无效）
         btnText:"点击或拖拽文件至此",//上传按钮上显示的文字
         //complete:function(result){},//上传完成的回调处理（作废）
         progress:function(result){},//文件上传进度回调处理（文件上传过程会持续回调该函数）
         success:function(result){},//上传成功status==1，该函数是对complete的进一步处理，若自己实现complete函数则success函数失效
         error:function(result){},//上传失败或错误status==0，该函数是对complete的进一步处理，若自己实现complete函数则error函数失效
         invalidFileFail:function(result){},//文件验证不通过的回调，result中包含失败原因
         invalidFile:function(file){},//使用者自定义对文件做特殊验证，返回boolean类型的true表示验证通过，返回字符串类型的任何信息表示验证不通过，且给出字符串的提示
     }
     **/
    xyzDropzone.create = function (config) {
        if (!('xyzDropzone' in config) || config.xyzDropzone == null || config.xyzDropzone == '') {
            throw 'xyzDropzone.create方法必须传入xyzDropzone';
        }
        //初始化上传控件
        init({
            xyzDropzone: config.xyzDropzone,
            xyzDropzoneServer: 'https://up.qiniup.com',
            uploadButtonDiv: config.xyzDropzone,
            params: ('params' in config) ? config.params : {"derictoryCode": "default"},
            maxFiles: 1000,
            acceptedExtName: ('acceptedExtName' in config) ? config.acceptedExtName : '.gif,.doc,.docx,.xls,.xlsx,.rar,.zip,.pdf,.txt,.jpg,.jpeg,.png',
            maxFilesize: ('maxFilesize' in config) ? config.maxFilesize : "1024kb",
            imageSize: ('imageSize' in config) ? config.imageSize : {"minWidth": 300, "maxWidth": 300, "minHeight": 300, "maxHeight": 300},
            btnText: ('btnText' in config) ? config.btnText : "点击/拖拽/粘贴文件至此",
            complete: ('complete' in config) ? config.complete : xyzFuc.complete,
            progress: ('progress' in config) ? config.progress : xyzFuc.progress,
            success: ('success' in config) ? config.success : xyzFuc.success,
            error: ('error' in config) ? config.error : xyzFuc.error,
            invalidFileFail: ('invalidFileFail' in config) ? config.invalidFileFail : xyzFuc.invalidFileFail,
            dropElement: ('dropElement' in config) ? config.dropElement : null,
            invalidFile: ('invalidFile' in config) ? config.invalidFile : xyzFuc.invalidFile,
            afterAllUpload: ('afterAllUpload' in config) ? config.afterAllUpload : null

        });
    };

    function browserInfo() {
        var ua = navigator.userAgent.toLowerCase();
        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
            /(webkit)[ \/]([\w.]+)/.exec(ua) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
            /(msie) ([\w.]+)/.exec(ua) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
            [];
        return {browser: match[1] || "", version: match[2] || "0"};
    }

    function nonuse(xyzDropzoneId) {
        document.getElementById('btnText_' + xyzDropzoneId).innerHTML = '浏览器不支持';
        document.getElementById('fileinput_button_' + xyzDropzoneId).style.backgroundColor = '#FF3030';
        document.getElementById('fileinput_button_' + xyzDropzoneId).onclick = function () {
            alert('您的浏览器不支持我们的上传功能。您可以使用IE10+,Chrome7+,Firefox4+,Opera12+,Safari6+等浏览器~');
        };
    }

    function init(config) {
        var xyzDropzoneId = config.xyzDropzone;
        var html = '';
        html += '<style type="text/css">';
        html += '.xyzDropzone_css_upload_btn {position:relative;width: 100%;background-color:#73b6e5;font-size: 14px;font-weight:bold;float: right;height: 100%;line-height: 38px;text-align: center;border-radius: 3px;color:#fff;box-shadow:inset;cursor:pointer;}';
        html += '.xyzDropzone_css_progress_bar{width:0%;background-color: #0d84d7;height:100%;float:left;border-top-left-radius: 3px;border-bottom-left-radius: 3px;}';
        html += '.xyzDropzone_css_btn_text{position:absolute;text-align:center;height:100%;width:100%;background:#52b0ff}';
        html += '.xyzDropzone_css_clearfix:after{content:".";display:block;height:0;visibility:hidden;clear:both;}';
        html += '.xyzDropzone_css_clearfix{*zoom:1; }';
        html += '</style>';
        html += '<div id="fileinput_button_' + xyzDropzoneId + '" class="xyzDropzone_css_upload_btn xyzDropzone_css_clearfix" style="width:100%;height:38px;">';
        html += '     <div id="progressBar_' + xyzDropzoneId + '" class="xyzDropzone_css_progress_bar"></div>';
        html += '     <div id="btnText_' + xyzDropzoneId + '" class="xyzDropzone_css_btn_text">' + config["btnText"] + '</div>';
        html += '</div>';
        var contianerDiv = document.getElementById(xyzDropzoneId);
        contianerDiv.innerHTML = html;
        var uploadBtn = document.getElementById("fileinput_button_" + xyzDropzoneId);
        uploadBtn.style.height = contianerDiv.style.height;
        uploadBtn.style.width = contianerDiv.style.width;
        uploadBtn.style.lineHeight = contianerDiv.style.height;
        var htmlPreviewTemplate = '<div style="display:none;"><div id="mypreviewdiv" style="display:none;"><div style="display:none;"><div style="display:none;"><div  style="display:none;"><span data-dz-name style="display:none;"></span></div><div data-dz-size style="display:none;"></div><img data-dz-thumbnail style="display:none;"/></div><div style="display:none;"><span data-dz-uploadprogress style="display:none;"></span></div><div style="display:none;"><span style="display:none;">YES</span></div><div style="display:none;"><span style="display:none;">NO</span></div><div style="display:none;"><span data-dz-errormessage style="display:none;"></span></div></div></div></div>';
        var myDropzone = new Dropzone('#' + xyzDropzoneId, {
            url: config.xyzDropzoneServer,
            paramName: "file",
            parallelUploads: 20,
            previewTemplate: htmlPreviewTemplate,
            autoProcessQueue: true, // 自动上传，添加一张图片向服务器发送一次请求
            uploadMultiple: false,//允许多文件同时上传 这会导致dropzone在paramName上自动追加[]
            createImageThumbnails: false,//压缩图片
            previewsContainer: null,
            clickable: '#fileinput_button_' + xyzDropzoneId,
            dictDefaultMessage: '',
            dictFallbackMessage: '',
            dictFallbackText: '',
            dictInvalidFileType: '',
            dictFileTooBig: '',
            dictCancelUpload: '',
            dropElement: config.dropElement,
            dictCancelUploadConfirmation: '',
            dictRemoveFile: '',
            dictMaxFilesExceeded: '',
            acceptedFiles: config.acceptedExtName,
            maxFiles: ('maxFiles' in config) ? config.maxFiles : 100,
            fallback: function () {//浏览器不支持
                nonuse(xyzDropzoneId);
            }
        });
        // 粘贴上传 2018/11/21 吴雪钢新增--------------------------------------------------------------
        function bindPaste(e) {
            var ipt = document.createElement('input');
            var body = document.querySelector('body');
            ipt.className = 'opcityIpt';
            body.appendChild(ipt);
            ipt.focus();
            ipt.addEventListener("paste", function (e) {
                if (!(e.clipboardData && e.clipboardData.items)) {
                    return;
                }
                for (var i = 0, len = e.clipboardData.items.length; i < len; i++) {
                    var item = e.clipboardData.items[i];
                    if (item.kind === "string") {
                        item.getAsString(function (str) {
                            // str 是获取到的字符串
                        })
                    } else if (item.kind === "file") {

                        var file = item.getAsFile();
                        uploadImg(file)
                    }
                }
            });
        }
        function unbindPaste() {
            var arr = document.querySelectorAll('.opcityIpt');
            for (var k = 0; k < arr.length; k++) {
                arr[k].remove()
            }
        }
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
        function uploadImg(file) {
            getToken(function () {
                if (!uploadToken || uploadToken == '' || uploadToken == 'error:002') {
                    config["error"]({"msg": '凭证过期，请【刷新页面】后重试'});
                }
                var extName = (file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length)).toLowerCase();
                if (config.acceptedExtName.indexOf('.' + extName) < 0) {//文件后缀名验证
                    config["invalidFileFail"]({"fileName": file.name, "msg": "这里允许上传的文件类型有" + config.acceptedExtName});
                    return
                }
                if ('maxFilesize' in config) {//单个文件最大文件尺寸限制 kb
                    //配置传递的单位是b
                    var bsize = 0;
                    if (!isNaN(config.maxFilesize)) {
                        bsize = config.maxFilesize;//传入的是单位是b
                    } else if (config.maxFilesize.toLowerCase().indexOf('kb') > 0) {
                        bsize = new Number(config.maxFilesize.toLowerCase().split('kb')[0]) * 1024;
                    } else if (config.maxFilesize.toLowerCase().indexOf('m') > 0) {
                        bsize = new Number(config.maxFilesize.toLowerCase().split('m')[0]) * 1024 * 1024;
                    } else if (isNaN(config.maxFilesize)) {
                        config["invalidFileFail"]({
                            "fileName": file.name,
                            "msg": "无效的maxFilesize配置参数：" + config.maxFilesize
                        });
                        return;
                    }
                    //文件超过最大配置大小
                    if (file.size > bsize) {
                        config["invalidFileFail"]({
                            "fileName": file.name,
                            "msg": "单个文件最大允许" + (bsize / 1024 / 1024).toFixed(2) + "M"
                        });
                        return;
                    }
                }
                //自定义的特殊验证
                var validResult = config["invalidFile"](file);
                if (validResult !== true) {
                    myDropzone.removeFile(file);
                    config["invalidFileFail"]({"fileName": file.name, "msg": validResult});
                    return;
                }

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

                //构建xhr上传表单参数
                var form = new FormData();
                form.append('file', file);
                form.append('token', uploadToken);
                form.append('x:folder', 'editorImg');
                //优化自定义文件名模式

                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
                form.append('key', 'editorImg/' + dd + '/' + getUUID() + ".jpg");
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
                            config['success'](resultData);
                            res.push(resultData.content.url);
                            config.afterAllUpload(res)
                        } else {
                            var resultData = {
                                status: 0,
                                msg: errCodeMsg['code' + xhr.status] ? errCodeMsg['code' + xhr.status] : xhr.statusText
                            };
                            config["error"](resultData);

                        }
                    }
                };
                xhr.send(form);//发射
            })
        }
        uploadBtn.onmouseover = bindPaste;
        uploadBtn.onmouseleave = unbindPaste;
        //粘贴上传功能结束---------------------------------------------------------------------------
        var timestr = null;
        function getToken(fn) {
            var xhr = new XMLHttpRequest();
            if (!xhr) {
                return;
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        uploadToken = xhr.responseText;
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
        myDropzone.on("addedfile", function (file) {
            getToken(function () {
                if (!uploadToken || uploadToken == '' || uploadToken == 'error:002') {
                    myDropzone.removeFile(file);
                    config["error"]({"msg": '凭证过期，请【刷新页面】后重试'});
                }
                var extName = (file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length)).toLowerCase();
                /*if(myDropzone.getQueuedFiles().length>=1){
                    myDropzone.removeFile(file);
                    config["invalidFileFail"]({"fileName":file.name,"msg":"请单个拖入/选择文件"});
                }*/
                if (config.acceptedExtName.indexOf('.' + extName) < 0) {//文件后缀名验证
                    myDropzone.removeFile(file);
                    config["invalidFileFail"]({"fileName": file.name, "msg": "这里允许上传的文件类型有" + config.acceptedExtName});
                    return
                }
                if ('maxFilesize' in config) {//单个文件最大文件尺寸限制 kb
                    //配置传递的单位是b
                    var bsize = 0;
                    if (!isNaN(config.maxFilesize)) {
                        bsize = config.maxFilesize;//传入的是单位是b
                    } else if (config.maxFilesize.toLowerCase().indexOf('kb') > 0) {
                        bsize = new Number(config.maxFilesize.toLowerCase().split('kb')[0]) * 1024;
                    } else if (config.maxFilesize.toLowerCase().indexOf('m') > 0) {
                        bsize = new Number(config.maxFilesize.toLowerCase().split('m')[0]) * 1024 * 1024;
                    } else if (isNaN(config.maxFilesize)) {
                        myDropzone.removeFile(file);
                        config["invalidFileFail"]({
                            "fileName": file.name,
                            "msg": "无效的maxFilesize配置参数：" + config.maxFilesize
                        });
                        return;
                    }
                    //文件超过最大配置大小
                    if (file.size > bsize) {
                        myDropzone.removeFile(file);
                        config["invalidFileFail"]({
                            "fileName": file.name,
                            "msg": "单个文件最大允许" + (bsize / 1024 / 1024).toFixed(2) + "M"
                        });
                        return;
                    }
                }
                //自定义的特殊验证
                var validResult = config["invalidFile"](file);
                if (validResult !== true) {
                    myDropzone.removeFile(file);
                    config["invalidFileFail"]({"fileName": file.name, "msg": validResult});
                    return;
                }
            })
        });
        //当文件数量已达到maxFiles最大数量
        myDropzone.on("maxfilesexceeded", function (file) {
            myDropzone.removeFile(file);
            config["invalidFileFail"]({"msg": "这里最多允许上传" + (('maxFiles' in config) ? config.maxFiles : 100) + "个文件"});
        });
        //进度条
        myDropzone.on("uploadprogress", function (file, progress) {
            document.getElementById('progressBar_' + xyzDropzoneId).style.width = progress + '%';
            if (progress == 100) {
                document.getElementById('progressBar_' + xyzDropzoneId).style.width = '0%';
            }
            config["progress"]({"fileName": file.name, "progress": progress});
        });
        //邦定参数一起发送到服务器
        myDropzone.on("sending", function (file, xhr, formData) {
            formData.append('token', uploadToken);
            formData.append('x:folder', config.params['derictoryCode'] ? config.params['derictoryCode'] : 'default');
            //优化自定义文件名模式
            if (config.params["key"]) {
                var date = new Date();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
                formData.append('key', (config.params['derictoryCode'] ? config.params['derictoryCode'] : 'default') + '/' + dd + '/' + (config.params["key"] === 'fileName' ? file.name : config.params["key"]));
            }
            for (key in config.params) {
                if ('key' !== key) {
                    formData.append(key, config.params[key]);
                }
            }
        });
        //上传成功
        var res=[];
        var filenum = 0;
        myDropzone.on("success", function (file, xhr) {
            var resultData = xhr;
            filenum = this.files.length;
            if ((typeof xhr.responseText) === 'string') {
                try {
                    resultData = eval('(' + xhr + ')');
                } catch (e) {
                    resultData = {
                        status: 0,
                        msg: xhr
                    };
                }
            }
            if (resultData.content && resultData.content.suffix) {//qiniu处理
                resultData.content.suffix = resultData.content.suffix.replace('.', '');
            }
            config["success"](resultData);
            res.push(resultData.content.url);
            if(res.length === filenum && config.afterAllUpload){
                config.afterAllUpload(res)
            }
        });
        //上传出错
        myDropzone.on("error", function (file, errorMsg, xhr) {
            var msg = errorMsg;
            if (xhr != null && xhr != '' && xhr != undefined) {
                msg = '凭证过期，请【刷新页面】后重试' + xhr;
            }
            config["error"]({"msg": msg});
        });

    }

    window.xyzDropzone = xyzDropzone;
})(window);

/**
 图片展示控件封装
 xyzPicPreview
 **/
(function (window) {
    /***
     展示小图的命名规则
     说明：
     url字符串中，包含：file.duanyi.com.cn字符串的，并以png,jpg,jpeg后缀结尾的展示小图片
     //原图url：http://file.duanyi.com.cn/accessory/mydirectory/20150827/201508271713356051997.jpg
     //小图url：http://file.duanyi.com.cn/accessory/mydirectory/20150827/small_201508271713356051997.jpg
     //转换方式为，在原图url中自动拼接small_字符串
     **/
    var smallImgServer = [{'file.duanyi.com.cn': 'png,jpg,jpeg'}];
    var xyzPicPreview = {};
    var xyzFuc = {};
    var leftBtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAXpJREFUeNqUlblOw1AQRccBUeKKjhryBaQn0LFLLDVBhD9A4QNY/gAQoWaRwtoF6EPnLlCncxXKSCjcke6TRhGJx5ZOMU/P1+/N3BlHSZJIjucQnJr4rJDj5V1wYuJrUPMKrIBLEDF+Bvug7xGYB/dgjPEH2AS/GmQJzIEGmGD8CTZAL2wYJTADXkHM+Bssga7dNExgGryDKcYdUAbp4Mb/BPSlJkWELy1SRLIEJsELKDL+AcugPeyeVkAT9QBKjDVR66A1KstBQEt0w5IJS7TDkkmWgJrjnF/Tpw8OeBrxCByDPbN2BK68/i4Ye4o5geQRqIG6WdOGqeQR0C9WwRPX9EQXYNUrELK+ZbKuVbkzVRGPD3pslJbxRcP4QjxO7NJ5X4xjOnPWKxC8v2C8r73xZnpDPN3YYQOlpjubpjvFMw/avE7o/yKvE3sFhAm1E6g0MKHEMxO1tNthBrK0t2FGeqfyI80WbL5Gs0XjOWxfZxLDv0Htnv4JMABUnkm4a0U2GAAAAABJRU5ErkJggg==';
    var rightBtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAaCAYAAAC+aNwHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAW5JREFUeNqUlLlOw2AQhNcBUSZVutSQJyA9kA4CROKoAQFvwPEAJLwBQYSaQwpnx9FD5y6hpksVSiRkZqWxWLn4WY/0FftLHtu7s38Ux3FbRPbkT/vgWJwqgAPQNWctsJnHIAE74I5nEeiARa+B6gesglfWY+AKzHgNVN+gCd5YT4AeqHkNVCOwAAasS+ABTHkNVEMwBz5Zl8EzqHgNhA/XaSZ8+IlmLgNVn78zYl3l75S8BsKGNtlgYUN7bLDLQDjaNY5aONpLjtploLpl2BLWSwxbNC5+ddnEFmuN+7Ag+ZRk6iiPwYZ5u+pcF9Fr0ACnXDTVPdjWL/IYaNev065zKivpVP4zmM7M/T2Ti6DBJHg0yfsA8yaZQQPN/ovJvu7GrNmNoEGZi1Mx21k32xk0KHJhqqy/uFB9z32gjboxN5A2atncUEEDHdGFuQN1ROvmjgwaaDhO+LY0rrv8GtetfAS2zNkhOPPm+1eAAQBNTkowo43VhQAAAABJRU5ErkJggg==';
    var base64Doc = 'data:image/png;base64,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';
    var base64File = 'data:image/png;base64,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';
    var base64Pdf = 'data:image/png;base64,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';
    var base64Txt = 'data:image/png;base64,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';
    var base64Xls = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFYAAABVCAYAAADTwhNZAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAxxSURBVHhe7ZxZV1pZFsd96KesfurVq7vrS/Tq+gK9Ut1rlT2891M/9ReorkpVTKLGEVCIQ0Qt45CqUlOppCIOIKCCoNGyo2AQkzhgAOchGg1oHKL8e58LKCooB7DKxEvWXmruGbi/u88+e+9zzk1aXV39jfeN5+OFhdm/NptUn5Z1KpJLzXnJZeb8CyO3O6WfNg3Xf+qYHrzsm5//Y1JS0m9JfkUS+wdr+NPUlCtDNVzfUNlTpL3TW6i7aFLRc0tb01/SanJrHo67LZJ5m+1vRPQPccHVaDSXm00NP1T2FM8pzXneMrN8/aJJqSl/veJxgfeevXq506W2jbmtSt/U1D/iglv+WPaXcpNCRVq6SkB3SXwXTQis705P4V7906rd+qEqD8G1j7otSsAVO1wGttSc30hg1wjoHgkumhBYEFjcs1X76gYrGVyv0dViH5uyKH3j438nzf09t1lgYAmkCNYPFqS1QbgeI2ku2VwlnoEfrghWjhCNZWBD4FYLcEfd1hJYLHxwRbBhwR6BS2bBNVACE5i3EJ1ZEMFGBBsKV7C5owwuooQrgj0R7D7ce0NkFpxq+8gB3N+dOKGJYE8FGwqXNJdsrstyuuaKYKMCe0RzW0I1N7zNFcFGDfaI5p4CVwTLBTYELkVoZHMjmgVesMzney/EnB91BBnGjw36s5F+CkGEMKH5w9/jNpcXrNKUB6VJ9h5I3lmCPRShsdzCiKufgogQVyxasKUElOUQHEujWPTMn3vpd/egyJATFdwYNPZIhFbl7XQzs0BwIYS/HyXxgvVuvaG65/8zsTSCgo7MKMHK8XX3LdRay08zAeGu7+cWBM119pcSnX8lXWn7N0vCBNOGEbNbQY19vbF8/qnSNxxdGCawWVGBZSORMnyo+qkI39tq4oBbTZqreUFmoTFJP9z4SUmnrCGQj+UG2zmmxwPrd1A9/Z5LHli+weSK89BDsk334/7AN1ztsH7vD9yFbXrgUFu8YBncEpqYlT0K1A1+LWS6OMTHUo4sn3tvuGbD5G5dSqoyNV8uNUkfEdjXJ+VjI2nsvf5q5LWlC/aMR2T6VLyYHzoEwziqhUR3nasd1qdEdw3GUV3cYEsJbpExF7f0GShoy+YVX2Fbtu9WW9ZeiUmymyRX3b9cZpbFDPahtVb4MrzJ8UJDNg3XZ4dgdI234xbH8A32eYtsadd4R9xgywNJ/gJ9NnKbUkiu8YqP6vjyWlN9ItgjKyblXQowKWqnkdB8HdKWG9wi16VDBBtmKSoItzAIt5kPrgj2hPU9AS6zuQYJ8sjmSjngJgTshzR5HZ0nGFgGuJgiTZkANzrTkBCwM6tTmKBozPlqnEtYHe+W59CEs+xdFCI73rYcFAwse5finrzCTcACXBIeuAkBe16jhVj82EieTdBb8MPNPFVzRbAx7KEoppyJ3+ZGNgsJAdvn7EbrMxXaXrRwSetwA2bXpg8p/It5O9T2R1ztsH7V9h8p2LCfiSkIp8W3A3AjuWMJAVv/pIqGR6oQl/OIlCKs53OHIy/DSCtytNe42mF95mivwjCi/dnAlpkVKKHcQmFbeF83IWA/pMiLJ3rc93UFuIf9XBFsDDY2FL7f11WABRKhEZoINk6wDDIDGwyBg3BFsAkAexzudeQnIldQR5OXVH+De8Jhqb7wk1cKd1s//+QVbqvrgebm69LiT8KwqOcpJZntM1YueTrVj9cbK4dm8lmK4gannnC1w/pldVjd0E8iAwTeSU1pliHptlYbVz72IkRePGBZ2Upa4hHBJsjOhsKn1Zj4wQ7NWNDtMKD3pYlLuh0dWPIsHFL4l5TIYSsBvG2xlQdW9zyYAgY4IWDrnlRCqrtBSyqZXCKhCOv5nO0QDMOIBtmtKVztsH6zW7+iyKv1wwJ7USOvk+xuUGP/TIuJP9Afy4FVWnYc6djiYKRVWhHscVZBsB8T2GL6w0VA3wXOeIlg45jUgmA/IrD/oT/6COqmCDb+c25BsL8msP+kP9oJ6gYvWHHyimwKLhHYZHYwmaCyc7RcNlZ0t84IrBh5JQjsxvb6eWV5JNgYE/xh3nA0EeWDNjZKU+Dfev4/WuPiTbj8EuU7KNgoNkrOP9jgk2Sb2XjWtn6pssW0UY8loROhgbxtcGksb+MXubwINo4gIJqQNiobe5E1kPfeRY0VNTb+MJNX6+IpL2qsqLGixv4ifmM8w/Ys6oqmQDQF76kpKO/KS6a1cB3tQVon8QV30ok//btbeEXYVyBXqS4VG3KSy7rydbcN0nUSHwlEiZ0BsURSzv1vL+U2X03O16bpaIfyOomP7VQWJXYGxNIPVtKSkkxbD3W0DXGdxBfLaTyxzsHmY2EbpwiW79RhNArEDTar8StkNl5BTuPVYyf1cpqv0rUvwcocPfSQ3cSuUT06+BvNF2NlWNlM1ZfIUH0hSKbqCrX9JVcb0faV6HIcYP1Hb+4YilBjVNJpbymkanrSgSM57JR0sUaKqo7bqO4sgqL15j5cBrmsTY67nWW43SaBjNU75eBvTnMKCrVZuGsqQW1PBWofV9DvZaik/gv1WZCoozsheFo/Z3U9arCS5muQtaTC6Z7A27UNWJetKKQMPdNcYZLTXEOfrRerr9YwN+skAIWC5rIvzrR4aMKC7TfbMIyqka9PE46qR7qpbNVXKDXI0T9hwvbmwfra3pYPa8uL6B3pILgS5NJ3Oisw8bbLAdavIY+Hu+Db9QmLdvrhZtKca8igIf7D4DfwbtO7YvYAi92KIrUUzDSwOhk0hCcWx4Q6PZOdBPZmRLDsIWVprqLf2SuU39newas3S1jwzOH11go174N3aQMPOuqQ2fTF+w+WAWI3LSMoI3PDwk1vvt1CrakSxR1yzK74D8K5Zl1Q6uXIJi0NPnUG1rEwKlx/7DaeCDaLbGrt0xos7rwSHpL1+RMoWiS0FT8Nd+hFmE/mfsLYxCi+M1Qhq+mgj3g1LNH1o9bYYMdsCFfQm4FXvP59rc6XTkxNTmFvz4f1HS/u9lWQJtENhxyH5AF7U/U5Op/SK0h2gN2tXbQNqGmyuipAzGj4AtkEXqpNFx5wtCexEw0tmva4wTKtZXA7h1qwub2xv46/824LLc8fQKq5cWyY84DNJPv6Y99deNb9ZxNWFl/DPNyO2v5yfN1eAIUmU/AMJCfY6Ghu/KzLcIMNmoRcfTpcixP7YGfmHWQCpMJEdfRL84AV3LTW6+geN2BjywsyqfufLe8Weke7UNolpzKpH5bGCv4luULFRhlmlw9OqSwvr6C6vRRZpHGSI64UD1jhwZE2ZpE71TBQi3G3HfOv5+DZ8WCX/rHP9NYMqkmDmT0+a82LtX1ujWUaldeUDpujF769XWxubmJ3x3/D1uEBFKpzkR3wBsJNXt1uA/LoDFROY8qhXEToDcjInOSoU8CCCgkrp0lFOU1cg3MW7G5TXzSpGYa0SG/474cBVtJynaCloLmrAW/fvhXAtvdp0TfUi3e77wS4WnsjaSx7pdJBhBWqsb1OM+T0IoVcKiMjYEyYs8/aDkZbVT1FqLdUURAiQy65cyziSmv8DA/NdYKfzD4/jZmR9uizDwMsCzGVpgJ6RYj/FXxjMzYU63LoSHsqJub8J1a8b7yoM1eTu0XaFoDl92P97pZ7cho6uxqqF9+j+cUDtIw8pLfMfYsifa7g8DOvwGRrg29jD+OeMTwauY8KYwFqepX7B0F2372DxtqAmw2fv/9gWeSV35oOh5sA0YTi2VhFVW8ZsmjYM5tbq6/GyioBp2sOxwRKtQrSbn/kJYCd99djw5iJj9wzJuz3Le9bPOz5ToDKcgJt1hbskI8cOnEJT4WKb5P30T/VDUV7+onRW6y2MVH1oraxTPvu0Dv/njttmJxyocF2DzKamZmWsWtMm02kia6pcYw4ragwENhASMt+PrYbMT3jhnNyHK5JB8lEQF5iYnIYtV1lQsJFyDl05sDwrAEO5zMsvJqHd9OD5bVXcE+7oR1sQh7lOs9zOMseTtRgWWGZOhX5mnTkq9OPDUEGV7hO11gZllcIffp56jT/tQjC6gbL+9u6EWjrJuSU0JFrbgb6JZt8jnMEwXs4AKuOLtHNNEXQ0jAvmhGCh8D1o0OKwQheC/czaI/34Ya0JbxjkMxNpH4TNXwT2Y4frOr+JbkxM1muzxBXEGJ4j2G4ByKANQ70XKq3VCYr2jN1ZOPEpZk44bJ5QtGegaTNtbVL466x5LrBGh39xzrR9jHiosTGgEGtHazG/wEAB1AvuO6Q+gAAAABJRU5ErkJggg==';
    var base64Zip = 'data:image/png;base64,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';
    //var removeBtn = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYlJREFUeNpi/P//PwMy+MAmoQWkUoDYE4gVocL3gHgHEM8R+PXiGrJ6RpgBQI1sQKoPiDNZrM2ZWP08GJjUlMFy/27fY/i9aTvDnyMn/wG5s4G4EGjQd7AkyID3rOJsQLz7o5z+/997D/3HBX7vO/wfpAaodi9ID9hyqAFTQRJ/Hz35TwiA1EANmQI2AMjQBuI/v3cf+E8sAKkF6QHpBRnQ/9nRD0XBu6C4/7/OXoTzQWyQGDIA6QHpBRlw/cfEmSiSv85c+P9S0RBMgzTD2Mjgx4QZIAOugwz4+WvLTgxngjS8kNL+/xKI0TWD5YF6QHqZGPAARlAsMeAFv0AG3Pt39wGK6O+zFxnehyYyCG5ayiAExO/DksBiyODfnfsg6iEkEJ38UQMxMBbF2SA2jkCcADJAh4Jo1EEkJHmD/38fPyUuIQHVgvQgp0REUgYmV5w27z+CkZSxZyYbYGby92JgUlGCBhgwM23chjUzMWLJztpAKhWIPYAYZMIvIAZF0x5odr6CrB4gwAC9V1YwqlWwIwAAAABJRU5ErkJggg==';
    xyzPicPreview.create = function (config) {
        if (!('xyzPicPreview' in config)) {
            alert('必须传入xyzPicPreview参数');
            return;
        }
        if ('imageUrls' in config) {
            if (config.imageUrls == '' || config.imageUrls == null || config.imageUrls == 'null') {
                config.imageUrls = [];
            } else if ((typeof config.imageUrls) == 'string') {
                config.imageUrls = config.imageUrls.split(',');
            } else if (config.imageUrls instanceof Array) {
            } else {
                config.imageUrls = [];
            }
        } else {
            config.imageUrls = [];
        }
        xyzPicPreview[config.xyzPicPreview] = {
            xyzPicPreview: config.xyzPicPreview,
            imageUrls: config.imageUrls,
            deleteImg: config.deleteImg || function(){},
            imgClick: ('imgClick' in config) ? config['imgClick'] : xyzFuc['imgClick'],
            maxCount: ('maxCount' in config) ? config['maxCount'] : 100, /**最多允许展示的图片数量**/
            maxCountFuc: ('maxCountFuc' in config) ? config['maxCountFuc'] : xyzFuc['maxCountFuc'],
            tipFuc: ('tipFuc' in config) ? config['tipFuc'] : xyzFuc['tipFuc'],
            moveWidth: 110
        };
        var container = '';
        container += '<div class="xyzPicPreview-img-container">';
        /*container+='<div>';*/
        container += '<div class="xyzPicPreview-img-group-windon"><div class="xyzPicPreview-tips" id="xyzPicPreview-tips-' + config.xyzPicPreview + '">' + ((config.dropTextName == 'undefined' || config.dropTextName == undefined) ? '' : config.dropTextName) + '</div>';
        container += '<div class="xyzPicPreview-img-group" id="imgGroup_' + config.xyzPicPreview + '">';
        container += '';
        container += '</div>';
        container += '</div>';
        /*container+='</div>';*/
        container += '<div style="clear:both;"></div>';
        container += '<a href="javascript:void(0);" class="xyzPicPreview-left-move"  id="leftBtn_' + config.xyzPicPreview + '" onclick="xyzPicPreview.leftBtnClick(\'' + config.xyzPicPreview + '\')"><img src="' + leftBtn + '" alt="left-click" style="border:0px;"/></a>';
        container += '<a href="javascript:void(0);" class="xyzPicPreview-right-move"  id="rightBtn_' + config.xyzPicPreview + '" onclick="xyzPicPreview.rightBtnClick(\'' + config.xyzPicPreview + '\')"><img src="' + rightBtn + '" alt="right-click" style="border:0px;"/></a>';
        container += '</div>';

        $('#' + config.xyzPicPreview).html(container);
        //校正浏览器对宽度渲染的问题
        var containerWidth = Math.round($('#' + config.xyzPicPreview).width());
        //强制适配宽度符合公式：(110*(允许可见图片张数))+40
        containerWidth = (Math.round((containerWidth - 40) / xyzPicPreview[config.xyzPicPreview]['moveWidth']) * xyzPicPreview[config.xyzPicPreview]['moveWidth']) + 40;
        $('#' + config.xyzPicPreview).width(containerWidth);
        $('#imgGroup_' + config.xyzPicPreview).parent().parent().parent().css('width', containerWidth + 'px');
        $('#imgGroup_' + config.xyzPicPreview).parent().css('width', (containerWidth - 40) + 'px');
        $("#leftBtn_" + config.xyzPicPreview).hide();
        $("#rightBtn_" + config.xyzPicPreview).hide();
        var curOffset = $('#imgGroup_' + config.xyzPicPreview).css("left").split("px")[0];
        xyzPicPreview[config.xyzPicPreview]['initOffsetLeft'] = curOffset == 'auto' ? 0 : parseFloat(curOffset);

        var count = config.imageUrls.length > config.maxCount ? config.maxCount : config.imageUrls.length;
        for (var i = 0; i < count; i++) {
            xyzFuc.addPic(config.xyzPicPreview, config.imageUrls[i]);
        }
    };
    /**
     *添加一张图片到xyzPicPreview（内部调用）
     *@param xyzPicPreviewId
     *@param url 单个url字符串
     **/
    xyzFuc.addPic = function (xyzPicPreviewId, url) {
        if (url == undefined || url == null || url == '' || url == 'null') {
            return;
        }
        var showUrl = url;
        //得到文件后缀名
        var fileTypeExt = (url.substring(url.lastIndexOf(".") + 1, url.length)).toLowerCase();
        var flag = 0;//0原图 1小图 2文件
        for (var j = 0; j < smallImgServer.length; j++) {//遍历规则
            for (var k in smallImgServer[j]) {
                if (url.indexOf(k) > -1) {//符合规则key值
                    if (smallImgServer[j][k].indexOf(fileTypeExt) > -1) {//符合规则value值
                        flag = 1;//变更flag
                        //将showUrl变成小图的url
                        if (k == 'file.maytek.cn') {
                            showUrl = url + '-small';
                        } else {
                            var urlStart = url.substring(0, url.lastIndexOf('/'));
                            var urlEnd = url.substring(url.lastIndexOf('/') + 1, url.length);
                            showUrl = urlStart + "/small_" + urlEnd;
                        }
                    }
                }
            }
        }
        if (flag == 0) {
            if (('doc,docx'.indexOf(fileTypeExt) > -1)) {//如果flag还是没有发生变化，则检查是否为文件
                showUrl = base64Doc;
            } else if (('xls,xlsx'.indexOf(fileTypeExt) > -1)) {
                showUrl = base64Xls;
            } else if (('pdf'.indexOf(fileTypeExt) > -1)) {
                showUrl = base64Pdf;
            } else if (('txt'.indexOf(fileTypeExt) > -1)) {
                showUrl = base64Txt;
            } else if (('zip,rar'.indexOf(fileTypeExt) > -1)) {
                showUrl = base64Zip;
            } else if (('zip,rar,txt,pdf,xls,xlsx,doc,docx,jpg,jpeg,png'.indexOf(fileTypeExt) <= -1)) {
                showUrl = base64File;
            }
        }
        var imgCover = '';
        imgCover += '<div class="xyzPicPreview-img-cover">';
        imgCover += '<i class="xyzPicPreview-icon-remove" onclick="xyzPicPreview.removePic(this,\'' + xyzPicPreviewId + '\');"></i>';
        imgCover += '<img class="xyzPicPreview-imgs" title="' + url + '" src="' + showUrl + '" onclick="xyzPicPreview[\'' + xyzPicPreviewId + '\'].imgClick(this.title);" />';
        imgCover += '</div>';
        $('#imgGroup_' + xyzPicPreviewId).append(imgCover);
        var curImgCount = $('#imgGroup_' + xyzPicPreviewId).children().length;
        var imgGroupWidth = $('#imgGroup_' + xyzPicPreviewId).parent().width();
        var allowShowPic = parseInt(imgGroupWidth / xyzPicPreview[xyzPicPreviewId]['moveWidth']);
        //console.log("curImgCount="+curImgCount+";;curOffsetLeft="+curOffsetLeft+";;imgGroupWidth="+imgGroupWidth+";;moveWidth="+xyzPicPreview[xyzPicPreviewId]['moveWidth']+";;allowShowPic="+allowShowPic);
        if (curImgCount >= allowShowPic) {
            //移动到最右边，使刚添加的图片处于可见范围内
            var pxValue = xyzPicPreview[xyzPicPreviewId]['initOffsetLeft'] - ((curImgCount - allowShowPic) * xyzPicPreview[xyzPicPreviewId]['moveWidth']);
            $('#imgGroup_' + xyzPicPreviewId).css("left", pxValue + "px");
        } else {
            //现有图片总量少于或等于允许可见图片总量时，保持所有图片靠左对其排列
            $('#imgGroup_' + xyzPicPreviewId).css("left", xyzPicPreview[xyzPicPreviewId]['initOffsetLeft'] + "px");
        }
        if (curImgCount > allowShowPic) {
            $("#leftBtn_" + xyzPicPreviewId).show();
            $("#rightBtn_" + xyzPicPreviewId).show();
        }
        //xyzPicPreview[xyzPicPreviewId]['imageUrls'][xyzPicPreview[xyzPicPreviewId]['imageUrls'].length]=url;
        //console.log(xyzPicPreview[xyzPicPreviewId]['imageUrls']);
    };
    /**
     *添加一张图片到xyzPicPreview
     *@param xyzPicPreviewId
     *@param url 单个url字符串
     **/
    xyzPicPreview.addPic = function (xyzPicPreviewId, url) {
        if (!(xyzPicPreviewId in xyzPicPreview)) {
            alert(xyzPicPreviewId + "没有在xyzPicPreview中初始化");
            return;
        }
        if (url == undefined || url == null || url == '' || url == 'null') {
            return;
        }
        //console.log((url in xyzPicPreview[xyzPicPreviewId]['imageUrls']));
        var urlArr = url.split(',');
        var array = xyzPicPreview[xyzPicPreviewId]['imageUrls'];
        if (array.length + urlArr.length > xyzPicPreview[xyzPicPreviewId]['maxCount']) {//超过最大数量
            xyzPicPreview[xyzPicPreviewId]['maxCountFuc'](xyzPicPreview[xyzPicPreviewId]['maxCount']);
        }
        var c = xyzPicPreview[xyzPicPreviewId]['maxCount'] - array.length;
        c = c > urlArr.length ? urlArr.length : c;
        for (var k = 0; k < c; k++) {
            for (var i = 0; i < array.length; i++) {
                if (array[i] == urlArr[k]) {
                    xyzPicPreview[xyzPicPreviewId]['tipFuc']("禁止重复添加同源文件~");
                    return;
                }
            }
            xyzFuc.addPic(xyzPicPreviewId, urlArr[k]);
            xyzPicPreview[xyzPicPreviewId]['imageUrls'][array.length] = urlArr[k];
        }
        $("#xyzPicPreview-tips-" + xyzPicPreviewId).hide();
    };
    /**删除一张图*/
    xyzPicPreview.removePic = function (thiz, xyzPicPreviewId) {
        // console.log(xyzPicPreview[xyzPicPreviewId]['imageUrls']);
        $(thiz).parent().remove();
        var url = $(thiz).parent().find('img').attr('title');
        //console.log(url);
        var curImgCount = $('#imgGroup_' + xyzPicPreviewId).children().length;
        var curOffsetLeft = parseFloat($('#imgGroup_' + xyzPicPreviewId).css("left").split("px")[0]);
        var imgGroupWidth = $('#imgGroup_' + xyzPicPreviewId).parent().css('width').toLowerCase().split('px')[0];
        var allowShowPic = parseInt(imgGroupWidth / xyzPicPreview[xyzPicPreviewId]['moveWidth']);
        //判断当前容器中总图片数量是否超过容器最大可见图片数量
        if (curImgCount <= allowShowPic) {
//			$('#imgGroup_'+xyzPicPreviewId).offset({top:$('#imgGroup_'+xyzPicPreviewId).offset().top,left:xyzPicPreview[xyzPicPreviewId]['initOffsetLeft']});
            $('#imgGroup_' + xyzPicPreviewId).css("left", xyzPicPreview[xyzPicPreviewId]['initOffsetLeft'] + "px");
            $("#leftBtn_" + xyzPicPreviewId).hide();
            $("#rightBtn_" + xyzPicPreviewId).hide();
        } else {
            //如果当前偏移量小于初始偏移量就向右位移一个偏移量位置
            if (curOffsetLeft < xyzPicPreview[xyzPicPreviewId]['initOffsetLeft']) {
//				$('#imgGroup_'+xyzPicPreviewId).offset({top:$('#imgGroup_'+xyzPicPreviewId).offset().top,left:curOffsetLeft+xyzPicPreview[xyzPicPreviewId]['moveWidth']});
                $('#imgGroup_' + xyzPicPreviewId).css("left", (curOffsetLeft + xyzPicPreview[xyzPicPreviewId]['moveWidth']) + "px");
            }
            $("#leftBtn_" + xyzPicPreviewId).show();
            $("#rightBtn_" + xyzPicPreviewId).show();
        }
        if (curImgCount == 0) {
            $("#xyzPicPreview-tips-" + xyzPicPreviewId).show();
        }
        //从imageUrls中删除该url
        var array = xyzPicPreview[xyzPicPreviewId]['imageUrls'];
        var arrayTemp = [];
        for (var i = 0; i < array.length; i++) {
            if (array[i] == url) {
                continue;
            } else {
                arrayTemp[arrayTemp.length] = array[i];
            }
        }
        xyzPicPreview[xyzPicPreviewId]['imageUrls'] = arrayTemp;
        xyzPicPreview[xyzPicPreviewId].deleteImg(url);
    };
    //点击左边箭头按钮
    xyzPicPreview.leftBtnClick = function (xyzPicPreviewId) {
        var curOffsetLeft = parseFloat($('#imgGroup_' + xyzPicPreviewId).css("left").split("px")[0]);
//		var curOffsetLeft = $('#imgGroup_'+xyzPicPreviewId).offset().left;
        //左边界限判断
        if (curOffsetLeft + xyzPicPreview[xyzPicPreviewId]['moveWidth'] <= xyzPicPreview[xyzPicPreviewId]['initOffsetLeft']) {
//		   $('#imgGroup_'+xyzPicPreviewId).offset({top:$('#imgGroup_'+xyzPicPreviewId).offset().top,left:curOffsetLeft+xyzPicPreview[xyzPicPreviewId]['moveWidth']});
            $('#imgGroup_' + xyzPicPreviewId).css("left", (curOffsetLeft + xyzPicPreview[xyzPicPreviewId]['moveWidth']) + "px");
        }
    };
    //点击右边箭头按钮
    xyzPicPreview.rightBtnClick = function (xyzPicPreviewId) {
        var curImgCount = $('#imgGroup_' + xyzPicPreviewId).children().length;
        var curOffsetLeft = parseFloat($('#imgGroup_' + xyzPicPreviewId).css("left").split("px")[0]);
//		var curOffsetLeft = $('#imgGroup_'+xyzPicPreviewId).offset().left;
        var imgGroupWidth = $('#imgGroup_' + xyzPicPreviewId).parent().css('width').toLowerCase().split('px')[0];
        var allowShowPic = parseInt(imgGroupWidth / xyzPicPreview[xyzPicPreviewId]['moveWidth']);
        //右边界限判断
        if (curOffsetLeft > (xyzPicPreview[xyzPicPreviewId]['initOffsetLeft'] - ((curImgCount - allowShowPic) * xyzPicPreview[xyzPicPreviewId]['moveWidth']))) {
//		    $('#imgGroup_'+xyzPicPreviewId).offset({top:$('#imgGroup_'+xyzPicPreviewId).offset().top,left:curOffsetLeft-xyzPicPreview[xyzPicPreviewId]['moveWidth']});
            $('#imgGroup_' + xyzPicPreviewId).css("left", curOffsetLeft - xyzPicPreview[xyzPicPreviewId]['moveWidth'] + "px");
        }
    };
    //图片点击事件
    xyzFuc.imgClick = function (url) {
        window.open(url);
    };
    //超出最大限制数量的回调
    xyzFuc.maxCountFuc = function (maxCount) {
        alert('这里最多允许' + maxCount + '个文件');
    };
    xyzFuc.tipFuc = function (msg) {
        alert(msg);
    };
    /**获取所有图片URL
     *@param xyzPicPreview
     *@return Array
     **/
    xyzPicPreview.getAllPic = function (xyzPicPreviewId) {
        return (xyzPicPreviewId in xyzPicPreview) ? xyzPicPreview[xyzPicPreviewId]['imageUrls'] : [];
    };
    window.xyzPicPreview = xyzPicPreview;
})(window);