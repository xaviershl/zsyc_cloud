var insertImg = {
    src: '',
    width: '',
    height: ''
}
var insertList = []

// switch tab
var tab_list = document.querySelectorAll('.header span');
for (var i = 0; i < tab_list.length; i++) {
    tab_list[i].addEventListener('click', function (e) {
        if (this.className === 'active') return;
        document.querySelector('.header span.active').className = '';
        this.className = 'active';
        var div_con = document.querySelector('.con-box')
        var div_sigle = document.querySelector('.con-local-box')
        var div_mutiple = document.querySelector('.con-multiple')
        var _type = this.getAttribute('type')
        if (_type === 'local') { // 本地上传
            div_sigle.style.display = 'block';
            div_con.style.display = 'none';
            div_mutiple.style.display = 'none';
        } else if (_type === 'internet') { // 插入图片
            div_sigle.style.display = 'none';
            div_con.style.display = 'block';
            div_mutiple.style.display = 'none';
        } else if (_type === 'multiple') { // 多图上传
            div_sigle.style.display = 'none';
            div_con.style.display = 'none';
            div_mutiple.style.display = 'block';
        }
    })
}
// handle img info
// 网络图片
function setInternetImg(src) {
    insertImg.src = src;
    document.querySelector('.img-preview').style.backgroundImage = 'url("' + src + '")';
}
function clearInternetImg() {
    insertImg.src = '';
    document.querySelector('.input-width').value = '';
    document.querySelector('.input-height').value = '';
    document.querySelector('.img-preview').style.backgroundImage = '';
}
// 本地图片
function setLocalImg(src) {
    insertImg.src = src;
    document.querySelector('.img-area').style.backgroundImage = 'url("' + src + '")';;
}
function clearLocalImg() {
    insertImg.src = '';
    document.querySelector('.img-area').style.backgroundImage = '';
}
// 多图上传
function setMutipleImg(url){
    insertList.push(url)
    var _index = insertList.length - 1
    var _div = document.createElement('div')
    _div.className = 'block-box'
    _div.innerHTML = '<i onclick="clearMutipleImg(' + _index + ')">x</i><img src="' + url + '">'
    document.querySelector('.multiple-box').appendChild(_div)
}
function clearMutipleImg(index){
    insertList.splice(index, 1)
    document.querySelectorAll('.block-box')[index].remove()
}
// 网络图片
document.querySelector('.input-src').addEventListener('change', function () {
    this.value ? setInternetImg(this.value) : clearInternetImg();
})
document.querySelector('.input-width').addEventListener('change', function () {
    if (isNaN(this.value)) {
        this.value = '';
        insertImg.width = '';
    } else {
        insertImg.width = this.value;
    }
})
document.querySelector('.input-height').addEventListener('change', function () {
    if (isNaN(this.value)) {
        this.value = '';
        insertImg.height = '';
    } else {
        insertImg.height = this.value;
    }
})
var dom_single_input = document.querySelector('#singleupload')
var dom_mutiple_input = document.querySelector('#mutipleupload')
// 本地上传
document.querySelector('.img-area').addEventListener('click', function () { dom_single_input.click() })
// 多图上传
document.querySelector('.add-span').addEventListener('click', function () { dom_mutiple_input.click() })

dom_single_input.addEventListener('change', function () { uploadCallback(this.files, false) })
dom_mutiple_input.addEventListener('change', function () { uploadCallback(this.files, true) })
function uploadCallback(files, isMultiple){
    if (isMultiple && insertList.length >= 8) return
    var length = files.length > 8 ? 8 : files.length;
    for (var i = 0; i < length; i++) {
        uploadImg(files[i], function (result) {
            if (result.status) {
                var imgUrl = result.content.url;
                isMultiple ? setMutipleImg(imgUrl) : setLocalImg(imgUrl);
            } else {
                alert('图片上传失败,请重试');
                return;
            }
        });
    }
}
dialog.onok = function () {
    var type = document.querySelector('.header span.active').getAttribute('type')
    if (type === 'multiple') {
        insertList.forEach(function(url){
            editor.execCommand('insertimage', {
                src: url,
                width: '',
                height: ''
            })
        })
    } else if(type === 'local'){
        insertImg.src && editor.execCommand('insertimage', {
            src: insertImg.src,
            width: '',
            height: ''
        });
    }else {
        insertImg.src && editor.execCommand('insertimage', insertImg);
    }
};


// image upload
function uploadImg(file, callback) {
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
        form.append('token', MxEditorToken);
        form.append('x:folder', 'editorImg');
        //优化自定义文件名模式

        var date = new Date();
        var month = date.getMonth() + 1;
        var day = date.getDate();
        var dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
        form.append('key', 'editorImg/' + dd + '/' + getUUID());

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

// uuid
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

// 获取token
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