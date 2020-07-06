/***
 * 自动引入css、js等文件到html页面
 * USEAGE:
 <script type="text/javascript" src="../xyzCommonFrame/js/mxImport.js"></script>
 <script>
 //按需定义
 window.mxImport(['baseCSS','baseJS','mxeditor','ckeditor','uploader','../js/js_core/logicManager.js'],'http://www.other.com/other.js');
 </script>
 *
 * 有关baseCSS、baseJS、ckeditor、mxeditor、uploader五个分组标签所定义的具体css和js文件请参见下面的代码定义
 *
 * create time：2018-03-23
 * author：ivan_xie
 */

(function (files) {
    // 当前资源版本（与正式服更新时间同步）
    sessionStorage.currentVersion = sessionStorage.currentVersion || new Date().getTime();
    let currentVersion = top.currentVersion = sessionStorage.currentVersion;
    // let urlres=getUrlArgument()
    // if(urlres.hasOwnProperty('cctv')){
    //     currentVersion =urlres.cctv;
    // }else {
    //     currentVersion =' ';
    // }
    // top.currentVersion=currentVersion;
    //当前是否在mainFrame页面中
    let isMainFrame = window.location.pathname.indexOf('mainFrame') > -1;
    let fontIcon = 'font_403956_zr5ay0tggk';
    if (isMainFrame) {
        top.currentFontIcon = fontIcon;
        // top.currentCacheTime = "1.1"
    }
    let cloudName = "zsyc_cloud";
    //默认规则，在开发环境时需要带以zsyc_cloud项目名字作为跟请求路径的起点
    let isDev = window.location.pathname.indexOf('/' + cloudName + '/') === 0 || window.location.href.indexOf('clouddev') !== -1;
    // let isDev = window.location.pathname.indexOf('/' + cloudName + '/') === 0 || window.location.href.indexOf('clouddev') !== -1 || window.location.href.indexOf('192.168.') !== -1;
    let isYs = window.location.host.indexOf('ys') === 0;
    let isPre = window.location.host.indexOf('pre') === 0;
    //根路径，host属性中是带有端口号的
    let basePath = '//' + window.location.host + (isDev ? ('/' + cloudName) : '');
    // if (window.location.href.indexOf('clouddev') !== -1 || window.location.href.indexOf('192.168.') !== -1) {
    //     basePath = '//' + window.location.host
    // }
    if (window.location.href.indexOf('clouddev') !== -1) {
        basePath = '//' + window.location.host
    }
    //字体图标
    let currentFontIcon = top.currentFontIcon ? top.currentFontIcon : fontIcon;
    //easyui语言
    let currentEasyuiLang = top.currentEasyuiLang ? top.currentEasyuiLang : 'zh_CN';
    /**
     * 加一个十五分钟的时间戳版本
     */
    // let currentCacheTime = top.currentCacheTime ? top.currentCacheTime :"1.1";

    //构建全局共享的页面基础信息对象
    window.mxInfo = {
        'isMainFrame': isMainFrame,//当前是否在mainFrame页面
        'fontIcon': fontIcon,//字体图标
        'cloudName': cloudName,//zsyc_cloud名称
        'isDev': isDev,//当前是否处于开发环境
        'basePath': basePath,//根路径
        'currentFontIcon': currentFontIcon,//当前字体图标
        'currentEasyuiLang': currentEasyuiLang//当前应用于easyui的语言
    };
    /**文件路径定义**/
    let allFiles = {
        /**baseCSS**/
        'fontIcon.css': '//at.alicdn.com/t/' + currentFontIcon + '.css',
        'eayui-xyz.css': getHost('basecss') + '/static/easyui1.4.5_b/themes/bootstrap/easyui-xyz.css',
        'xieyaozhong.css': getHost('basecss') + '/xyzCommonFrame/css/xieyaozhong.css',
        'jquery.datetimepicker.css': getHost('basecss') + '/xyzCommonFrame/mxplug/datepicker/jquery.datetimepicker.css',
        'uploadImg.css': getHost('basecss') + '/xyzCommonFrame/mxplug/uploadImg/uploadImg.css',
        /**baseJS**/
        'jquery-1.7.2.js': getHost('jq172') + '/static/jquery-1.7.2.js',
        'clockTimePicker.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/jquery-clock-timepicker.min.js', // jq时分选择器
        'jquery.easyui.min.js': getHost('basejs') + '/static/easyui1.4.5_b/jquery.easyui.min.js',
        'easyui-lang.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/locale/easyui-lang-' + currentEasyuiLang + '.js',
        'common.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/common.js',
        'customUi.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/customUi.js',
        'MaytekQ.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/MaytekQ.js',
        'Sortable.js': getHost('basejs') + '/xyzCommonFrame/js/library/common/Sortable.js',
        /**ckeditor**/
        'ckeditor.js': getHost('ckeditor') + '/static/ckeditor/ckeditor.js',
        'ckeditor/adapters/jquery.js': getHost('ckeditor') + '/static/ckeditor/adapters/jquery.js',
        'dropzone.min.js': getHost('ckeditor') + '/static/xyzDropzone/dropzone.min.js',
        'xyzPicPreview.css': getHost('ckeditor') + '/xyzCommonFrame/js/library/xyzDropzone/xyzPicPreview.css',
        'xyzDropzone.js': getHost('ckeditor') + '/xyzCommonFrame/js/library/xyzDropzone/xyzDropzone.js',
        'xyzCkeditorUploadPlug.js': getHost('ckeditor') + '/xyzCommonFrame/js/library/common/xyzCkeditorUploadPlug.js',
        'MxEditor.js': getHost('ckeditor') + '/xyzCommonFrame/js/library/common/MxEditor.js',

        'mxInfoCore.js': getHost('infocore') + '/xyzCommonFrame/mxplug/mxInfoCore.js',
        // uEditor
        // 'uEditor.css': getHost('ueditor') + '/xyzCommonFrame/js/library/ueditor/themes/default/_css/ueditor.min.css',
        'uEditor.js': getHost('ueditor') + '/xyzCommonFrame/js/library/ueditor/ueditor.config.js',
        // 'uEditor.all.js': getHost('ueditor') + '/xyzCommonFrame/js/library/ueditor/ueditor.all.min.js',
        'uEditor.all.js': getHost('ueditor') + '/xyzCommonFrame/js/library/ueditor/ueditor.all.js',
        'uEditor.lang.js': getHost('ueditor') + '/xyzCommonFrame/js/library/ueditor/lang/zh-cn/zh-cn.js',

        /** html2canvas **/
        'html2canvas.js': getHost('html2canvas') + '/static/html2canvas/html2canvas.js',
        /** html2pdf **/
        "html2pdf.min.js": getHost('basejs') + '/xyzCommonFrame/mxplug/html2pdf/js/html2pdf.min.js',

        /**mxeditor**/
        'wangEditor.js': getHost('mxeditor') + '/static/mxeditor/wangEditor.js',
        // 'MxEditor.js' : getHost('mxeditor') + '/static/mxeditor/MxEditor.js',
        /**cropper**/
        'cropper.js': getHost('cropper') + '/static/cropper/cropper.js',
        'cropper.css': getHost('cropper') + '/static/cropper/cropper.css',
        'my-cropper.js': getHost('cropper') + '/static/cropper/my-cropper.js',
        /** MD5*/
        'jquery.md5.js': getHost('md5') + '/static/md5/jquery.md5.js',
        /**form**/
        'MaytekF.js': getHost('form') + '/xyzCommonFrame/js/library/common/MaytekF.js',
        /**Cookie**/
        'jquery.cookie.js': getHost('cookie') + '/static/cookie/jquery.cookie.js',
        'cookie.js': getHost('cookie') + '/xyzCommonFrame/js/library/common/cookie.js',
        'cookie2.js': getHost('cookie') + '/xyzCommonFrame/js/library/common/cookie2.js',
        /** 审核插件 **/
        'approvalPlugin.js': getHost('approval') + '/xyzCommonFrame/js/js_approval/approvalPlugin.js',
        /**qrcode**/
        'jquery.qrcode.js': getHost('qrcode') + '/static/qrcode/jquery.qrcode.js',
        'qrcode.js': getHost('qrcode') + '/static/qrcode/qrcode.js',
        /**数据中心下载EXCEL**/
        'datasupDownloadExcel.js': getHost('qrcode') + '/xyzCommonFrame/js/library/common/downloadExcel.js',
        /**美匣公用样式库**/
        'mxCommonStyle.css': getHost('qrcode') + '/xyzCommonFrame/css/mxCommonStyle.css',
        /**vue**/
        "vue.js": getHost('basejs') + '/xyzCommonFrame/js/vue.js',
        'jquery.datetimepicker.full.js': getHost('basecss') + '/xyzCommonFrame/mxplug/datepicker/jquery.datetimepicker.full.js',
        'ImgPlug.js': getHost('basecss') + '/xyzCommonFrame/mxplug/uploadImg/ImgPlug.js',
        'spiritIcon.js': getHost('basecss') + '/xyzCommonFrame/mxplug/spiritIcons/spiritIcon.js',
    };
    /**文件分组**/
    let group = {
        'baseCSS': ['fontIcon.css', 'eayui-xyz.css', "xieyaozhong.css","jquery.datetimepicker.css","uploadImg.css"],
        'baseJS': ['jquery-1.7.2.js','jquery.md5.js', 'jquery.easyui.min.js', 'easyui-lang.js', 'common.js', 'customUi.js', 'MaytekQ.js', 'clockTimePicker.js','Sortable.js','html2pdf.min.js','jquery.datetimepicker.full.js','ImgPlug.js','spiritIcon.js'],
        'ckeditor': ['ckeditor.js', 'ckeditor/adapters/jquery.js', 'dropzone.min.js', 'xyzPicPreview.css', 'xyzDropzone.js', 'xyzCkeditorUploadPlug.js'],
        'uploader': ['dropzone.min.js', 'xyzPicPreview.css', 'xyzDropzone.js'],
        'mxeditor': ['wangEditor.js', 'MxEditor.js'],
        'cropper': ['cropper.js', 'cropper.css', 'my-cropper.js'],
        'md5': ['jquery.md5.js'],
        'MaytekF': ['wangEditor.js', 'MxEditor.js', 'uEditor.js', 'uEditor.all.js', 'uEditor.lang.js', 'MaytekF.js'],
        'cookie': ['jquery.cookie.js', 'cookie.js'],
        'cookie2': ['jquery.cookie.js', 'cookie2.js'],
        'qrcode': ['jquery.qrcode.js', 'qrcode.js'],
        'datasupDownloadExcel': ['datasupDownloadExcel.js', 'mxCommonStyle.css'],
        'vue': ['vue.js'],
    };

    let tempcss = '<link rel="stylesheet" type="text/css" href="urlvalue">';
    let tempjs = '<script type="text/javascript" src="urlvalue"></scr' + 'ipt>';
    let suffixcss = ".css";
    let suffixjs = ".js";

    function getHost(key) {
        let host = basePath;
        if (isDev || key === 'ueditor') {
            host = basePath;
        } else if (isYs) {
            host = '//ys-static-' + key + '.maytek.cn';
        } else if(isPre){
            host = '//pre-static-' + key + '.maytek.cn';
        }else {
            host = '//static-' + key + '.maytek.cn';
        }

        return host;
    }

    function writedoc(url) {
        var isBaseFile = false;
        for (var key in allFiles) {
            if (allFiles[key] === url) {
                isBaseFile = true;
                break;
            }
        }
        let content = "";
        // let file_suffix = isBaseFile ? currentVersion : currentCacheTime;
        let file_suffix = currentVersion;

        if (url.lastIndexOf(suffixcss) == (url.length - suffixcss.length)) {
            content = tempcss.replace("urlvalue", url + '?cctv=' + file_suffix);
        } else if (url.lastIndexOf(suffixjs) == (url.length - suffixjs.length)) {
            content = tempjs.replace("urlvalue", url + '?cctv=' + file_suffix);
        } else {
            return;
        }
        document.write(content);
    }

    /**
     驱动函数
     **/
    window.mxImport = function (files) {
        if (!Array.isArray(files)) {
            return;
        }

        let tempCurrentAppId = ''
        if (!isMainFrame) {
            let url = location.pathname.replace(/\/zsyc_cloud/, "").substring(1);
            tempCurrentAppId = "/" + url.substring(0, url.indexOf('/'))
        }
        let readyKeys = new Array();
        for (let y in files) {
            let groupNames = group[files[y]];
            if (Array.isArray(groupNames)) {
                for (let k in groupNames) {
                    readyKeys.push(groupNames[k]);
                }
            } else {
                readyKeys.push(files[y]);
            }
        }

        for (let i = 0; i < readyKeys.length; i++) {
            let url = readyKeys[i];
            if (allFiles[readyKeys[i]]) {
                url = allFiles[readyKeys[i]];
            } else if (url.indexOf('../') == 0) {//以../打头的相对路径处理转换为绝对路径
                url = basePath + tempCurrentAppId + (url.replace('..', ''));
            } else if (url.indexOf('/') == 0 && url.indexOf('//') != 0) {//以/打头的相对路径处理转换为绝对路径
                url = basePath + tempCurrentAppId + url;
            }
            writedoc(url);
        }
    };
    if (Array.isArray(files)) {
        window.mxImport(files);
    }
})();
function getUrlArgument() {
    let url = top.location.search; //获取url中"?"符后的字串
    let theRequest = {};
    if (url.indexOf("?") !== -1) {
        let str = url.substr(url.indexOf("?") + 1);
        let strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest
}
