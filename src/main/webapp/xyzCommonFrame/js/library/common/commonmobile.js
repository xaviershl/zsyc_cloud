
//三标准色
var baseColor = {
    r: '#ff7474',
    g: '#59cd6f',
    y: '#ffb351'
};

function xyzGetColorByFlag(e) {
    if (e && baseColor.hasOwnProperty(e)) {
        return baseColor[e];
    } else {
        top.$.messager.alert("警告", 'xyzGetColorByFlag函数参数错误', "warning");
    }
}



function pxTool(value) {
    var screenWidth = window.screen.width;
    return value * screenWidth / 1500;
}

function chinaDate(date) {
    var year = date.split("-")[0];
    var month = parseInt(date.split("-")[1]);
    var day = parseInt(date.split("-")[2]);
    var result = year + "年" + month + "月" + day + "日";
    return result;
}

/**
 * 清除富文本编辑器里面的前后回车
 * @param str
 */
function ckeditorTrim(str) {
    /*
     * 先清空后面的回车
     */
    var allArr = str.split("</p>");
    var endIndex = 0;
    for (var i = (allArr.length - 1); i > 0; i--) {
        if ((/^\n{2}<p>&nbsp;$/g.exec(allArr[i]) != null) || (/^\n{1}$/g.exec(allArr[i]) != null)) {
            endIndex = i;
        } else {
            break;
        }
    }
    var endArr = allArr.splice(0, endIndex);
    /*
     * 在清空前面的回车
     */
    var startIndex = 0;
    for (var i = 0; i < endArr.length; i++) {
        if ((/^\n{2}<p>&nbsp;$/g.exec(endArr[i]) != null) || (/^<p>&nbsp;$/g.exec(endArr[i]) != null)) {
        } else {
            startIndex = i;
            break;
        }
    }
    var startArr = endArr.splice(startIndex, endArr.length);
    return startArr.join("</p>");
}


function AjaxError(XMLHttpRequest, textStatus, errorThrown) {
    var ErrorInfo = new Array();
    ErrorInfo["parsererror"] = "解析出错！1.请10秒钟后再试；2.可能与数据类型有关。";
    ErrorInfo["timeout"] = "请求超时！1.核查网络状况；2.请1分钟后再试。";
    ErrorInfo["error"] = "请求出错！1.请检查网络；2.请10秒钟后再试。";
    ErrorInfo["notmodified"] = "网络异常！1.核查浏览器配置；2.关闭浏览器重试。";
    top.$.messager.alert("错误", ErrorInfo[textStatus] + "（提示：这是一个良性错误！）", "error");
}

function xyzIsNull(obj) {
    if (obj == undefined || obj == null || obj === "" || obj === '') {
        return true;
    } else {
        return false;
    }
}

String.prototype.trim = function () {
    return this.replace(/(^\s*)|(\s*$)/g, "");
};

Date.prototype.Format = function (fmt) { // author: meizz
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds()
        // 毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

/**
 * 按钮控制方法
 */
function xyzControlButton(key) {
    var authArr = top.currentUserButtons;
    for (var i = 0; i < authArr.length; i++) {
        if (authArr[i] == key) {
            return true;
        }
    }
    return false;
}

/**
 * 显示定价的方法
 * @param key
 * @returns
 */
function xyzChargeText(key) {
    var map = top.currentChargeCoinMap;
    if (!map) {
        return '-';
    }
    var chargeCoin = map[key];
    if (chargeCoin == undefined || '' == chargeCoin) {
        return '-';
    }
    return chargeCoin + '积分';
}

function xyzAddUserOper(keyCode, content, info) {
    xyzAjax({
        url: "../UserOperWS/addUserOper.do",
        type: "POST",
        data: {
            keyCode: keyCode,
            content: content
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                if (!xyzIsNull(info)) {
                    customEasyuiConfirm({
                        ok: '刷新',
                        cancel: '取消',
                    });
                    
                    top.$.messager.confirm('提示', info, function (r) {
                        if (r) {
                            top.window.location.reload();
                        }
                    });
                }
            } else {
                top.$.messager.alert("警告", data.msg, "warning");
            }
        },
    });
}

function xyzGetUserOpers(keyCode) {
    var operArr = top.currentUserOpers;
    if (!xyzIsNull(operArr)) {
        for (var i = 0; i < operArr.length; i++) {
            if (operArr[i].keyCode == keyCode) {
                return operArr[i].content;
            }
        }
    }
    return null;
}

function xyzJsonToObject(str) {
    if (xyzIsNull(str) || xyzIsNull(str.trim())) {
        return "";
    } else {
        str = str.replace(/\n/g, " ");
        str = str.replace(/\r/g, " ");
        str = str.replace(/\t/g, " ");
        return JSON.parse(str);
    }
}

function xyzCK(d) {
    if (d.id == undefined) {
        alert("xyz say : 初始化ckeditor 竟敢不传ID");
        return;
    }
    $("#" + d.id).ckeditor({
        width: d.width == undefined ? 1000 : d.width,
        height: d.height == undefined ? 200 : d.height,
        toolbarStartupExpanded: d.toolbarStartupExpanded == undefined ? true : d.toolbarStartupExpanded,//显示工具栏，默认显示
        toolbarCanCollapse: d.toolbarCanCollapse == undefined ? true : d.toolbarCanCollapse,//折叠按钮，默认有
        toolbar: d.toolbar == undefined ? 'Full' : d.toolbar, //工具栏，默认是Full   可选Basic(简洁)
        skin: d.skin == undefined ? 'office2013' : d.skin, //主题  可选 bootstrapck   office2013  moono
        baseFloatZIndex: d.baseFloatZIndex == undefined ? '10000' : d.baseFloatZIndex //编辑器的z-index值
    });
}

function xyzGetChannelTypeNameCn(channelType) {
    try {
        xyzErpChannelTypes;
    } catch (e) {
        xyzErpChannelTypes = null;
    }
    if (xyzIsNull(xyzErpChannelTypes)) {
        xyzAjax({
            url: "../ListWS/getPlatformList.do",
            type: "POST",
            data: {},
            async: false,
            dataType: "json",
            success: function (data) {
                if (data instanceof Array) {
                    xyzErpChannelTypes = data;
                } else {
                    if (data.status == 1) {
                        xyzErpChannelTypes = data.content;
                    } else {
                        xyzErpChannelTypes = [];
                    }
                }
            }
        });
    }
    for (var xyzErpChannelTypeIndex in xyzErpChannelTypes) {
        if (xyzErpChannelTypes[xyzErpChannelTypeIndex].value == channelType) {
            return xyzErpChannelTypes[xyzErpChannelTypeIndex].text;
        }
    }
    return channelType;
}

function xyzLog(fmt) {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        alert(JSON.stringify(fmt));
    } else {
        console.info(fmt);
    }
}

function getUrlParameters(urlstr) {
    var url = '';
    if (xyzIsNull(urlstr)) {
        url = location.search;
    } else {
        url = '?' + urlstr.split("?")[1];
    }
    
    var result = {};
    var q = url.substr(1);
    var qs = q.split("&");
    if (qs) {
        for (var i = 0; i < qs.length; i++) {
            var key = qs[i].substring(0, qs[i].indexOf("="));
            result[key] = qs[i].substring(qs[i].indexOf("=") + 1);
        }
    }
    return result;
}


/**
 * 长耗时请求AJAX，后台需配合LongtimeRequestThread使用
 * 后端参数需接受一个字符串参数LONG_TIME_REQUEST_KEY
 * 单个请求超过20秒的可认定为长耗时请求，可使用此方法
 * @param p
 * @param LONG_TIME_REQUEST_KEY
 * @returns
 */
function xyzAjaxLongtimeRequest(p, LONG_TIME_REQUEST_KEY) {
    if (p) {
        //超长耗时请求强制异步请求
        p['async'] = true;
    }
    if (LONG_TIME_REQUEST_KEY && p) {
        if (!p.data) {
            p.data = {};
        }
        //在参数中注入一个参数名字叫LONG_TIME_REQUEST_KEY的参数，这个参数由后端LongtimeRequestThread类产生，初始请求不需要这个参数
        p.data['LONG_TIME_REQUEST_KEY'] = LONG_TIME_REQUEST_KEY;
    } else {
        //初次调用时拦截回调结果
        var tempsuccess = p.success;
        p.success = function (data) {
            if (!data || !data.content) {
                var e_msg = (data && data.msg) ? data.msg : '长耗时请求返回结果集不正确，请截图联系运营方。';
                tempsuccess({
                    'status': 0,
                    'msg': e_msg
                });
                return;
            }
            var content = data.content;
            var r_status = content['LONG_TIME_REQUEST_STATUS'];
            var r_key = content['LONG_TIME_REQUEST_KEY'];
            var r_msg = content['LONG_TIME_REQUEST_MSG'];
            var r_content = content['LONG_TIME_REQUEST_CONTENT'];
            if (r_status == 3) {//3表示正常执行完成且未超时
                tempsuccess(r_content);//将方法返回的结果集传递给原始回调
            } else if (r_status == 1 && r_content) {//1表示执行超时，且可能有执行结果
                tempsuccess(r_content);//将方法返回的结果集传递给原始回调
            } else if (r_status == 2 && r_key) {//2表示任务正在执行中，未超时，需要继续轮询（15秒一次）
                setTimeout(function () {
                    xyzAjaxLongtimeRequest(p, r_key);
                }, 15 * 1000);
            } else {//退出轮询提示错误
                tempsuccess({
                    'status': 0,
                    'msg': r_msg
                });
            }
        };
    }
    xyzAjax(p);
}

function xyzAjax(p) {
    var url = xyzGetFullUrl(p.url);
    $.ajax({
        url: url,
        type: ('type' in p) ? p.type : "POST",
        data: ('data' in p) ? p.data : {},
        async: ('async' in p) ? p.async : false,
        dataType: ('dataType' in p) ? p.dataType : "json",
        success: p.success,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown, ('errorTip' in p) ? p.errorTip : "layer");
        }
    });
};

function xyzGetFullUrl(url) {
    if (!url) {
        return '';
    } else if (url.indexOf('http') == 0) {
        return url;
    } else if (url.indexOf('../') == 0) {
        url = url.replace('../', '/');
    } else if (url.indexOf('/') != 0) {
        url = '/' + url;
    }
    return xyzGetDomain() + url;
};

function xyzGetDomain() {
    return window.location.protocol + mxInfo.basePath;
}

//判断当前浏览器和版本
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

//身份证验证
function xyzCheckCard(card) {
    var Y, JYM, S, M;
    var idcard_array = new Array();
    var idcard = card;
    var area = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外",
    };
    var Errors = new Array("true", "身份证号码校验错误!", "身份证非法地区!");
    if (area[parseInt(idcard.substr(0, 2))] == null) {
        return Errors[2];
    }
    switch (idcard.length) {
        case 15:
            if ((parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0 || ((parseInt(idcard.substr(6, 2)) + 1900) % 100 == 0 && (parseInt(idcard.substr(6, 2)) + 1900) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; //测试出生日期的合法性
            } else {
                ereg = /^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; //测试出生日期的合法性
            }
            if (ereg.test(idcard)) {
                return Errors[0];
            } else {
                return Errors[1];
            }
            break;
        case 18:
            if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                ereg = /^[1-9][0-9]{5}19|20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
            } else {
                ereg = /^[1-9][0-9]{5}19|20[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
            }
            if (ereg.test(idcard)) {
                for (var i = 0; i < idcard.length; i++) {
                    idcard_array[i] = idcard.substr(i, 1);
                }
                S = parseInt(idcard_array[0]) * 7 + parseInt(idcard_array[1]) * 9 + parseInt(idcard_array[2]) * 10 + parseInt(idcard_array[3]) * 5 + parseInt(idcard_array[4]) * 8 + parseInt(idcard_array[5]) * 4 + parseInt(idcard_array[6]) * 2 + parseInt(idcard_array[7]) * 1 +
                    parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3 +
                    parseInt(idcard_array[10]) * 7 + parseInt(idcard_array[11]) * 9 + parseInt(idcard_array[12]) * 10 + parseInt(idcard_array[13]) * 5 + parseInt(idcard_array[14]) * 8 + parseInt(idcard_array[15]) * 4 + parseInt(idcard_array[16]) * 2;
                
                Y = S % 11;
                JYM = "10X98765432";
                M = JYM.substr(Y, 1);
                if (M == idcard_array[17]) {
                    return Errors[0];
                } else {
                    return Errors[1];
                }
                ;
            } else {
                return Errors[1];
            }
        default:
            return Errors[1];
            break;
    }
}

function xyzlentth(strings, a, b) {
    var re = "^[\\s\\S]{" + a + "," + b + "}$";
    var regex = new RegExp(re);
    return regex.test(strings);
}

function xyzIsPhone(phone) {
    if ((/^1[0-9]{10}$/g).test(phone)) {
        return true;
    }
    //台湾手机号码
    if ((/^0[0-9]{9}$/g).test(phone)) {
        return true;
    }
    return false;
}

function xyzIsEmail(email) {
    var emailReg = /^\w+([-\.]\w+)*@\w+([\.-]\w+)*\.\w{2,4}$/;
    if (emailReg.test(email)) {
        return true;
    } else {
        return false;
    }
}

function xyzGetDiv(content, start, length) {
    if (xyzIsNull(content)) {
        return "";
    } else {
        content = content + "";
        return "<span title='" + content + "' style='cursor:pointer;display:block;height:100%;word-wrap:break-word;'>" + content.substr(start, length) + "</span>";
    }
}

function xyzGetDivDate(content) {
    if (xyzIsNull(content)) {
        return "";
    } else {
        content = content + "";
        var week = new Date(content.replace(/-/g, '/')).getDay();
        var weekStr = "";
        if (week == 0) {
            weekStr += " 星期日";
        } else if (week == 1) {
            weekStr += " 星期一";
        } else if (week == 2) {
            weekStr += " 星期二";
        } else if (week == 3) {
            weekStr += " 星期三";
        } else if (week == 4) {
            weekStr += " 星期四";
        } else if (week == 5) {
            weekStr += " 星期五";
        } else if (week == 6) {
            weekStr += " 星期六";
        }
        var showContent = "";
        if (content.substr(0, 4) != new Date().Format("yyyy")) {
            showContent += content.substr(2, 8);
        } else {
            showContent += content.substr(5, 5);
        }
        if (content.substr(11, 8) != "00:00:00") {
            showContent += " " + content.substr(11, 5);
        }
        return "<span title='" + (content + weekStr) + "' style='cursor:pointer;'>" + showContent + "</span>";
    }
}

function xyzGetDate(content) {
    if (xyzIsNull(content)) {
        return "";
    } else {
        content = content + "";
        var week = new Date(content.replace(/-/g, '/')).getDay();
        var weekStr = "";
        if (week == 0) {
            weekStr += " 星期日";
        } else if (week == 1) {
            weekStr += " 星期一";
        } else if (week == 2) {
            weekStr += " 星期二";
        } else if (week == 3) {
            weekStr += " 星期三";
        } else if (week == 4) {
            weekStr += " 星期四";
        } else if (week == 5) {
            weekStr += " 星期五";
        } else if (week == 6) {
            weekStr += " 星期六";
        }
        var showContent = "";
        if (content.substr(0, 4) != new Date().Format("yyyy")) {
            showContent += content.substr(2, 8);
        } else {
            showContent += content.substr(5, 5);
        }
        if (content.substr(11, 8) != "00:00:00") {
            showContent += " " + content.substr(11, 5);
        }
        return showContent + weekStr;
    }
}

function xyzGetA(text, functionName, param, title, color) {
    var result;
    if (text == 0) {
        result = "<span style='text-decoration:underline;cursor:pointer;";
    } else if ((typeof text === 'string') && text.indexOf("icon-square") > -1) {
        result = "<span style='cursor:pointer;";
    } else {
        result = "<span style='text-decoration:underline;cursor:pointer;";
    }
    ;
    if (!xyzIsNull(color)) {
        result += "color:" + color + ";' ";
    }
    result += "'";
    if (!xyzIsNull(title)) {
        result += " title='" + title + "' ";
    }
    
    result += "onclick='" + functionName + "(";
    if (param instanceof Array) {
        for (var p = 0; p < param.length; p++) {
            if (p != 0) {
                result += ",";
            }
            if (param[p] instanceof Number) {
                result += param[p];
            } else {
                result += "\"" + param[p] + "\"";
            }
        }
    } else if (param instanceof Number) {
        result += param;
    } else {
        result += "\"" + param + "\"";
    }
    result += ")'>";
    result += text;
    result += "</span>";
    return result;
}

function xyzRemoveRe(t) {
    if ((typeof t) == "string" || t instanceof String) {
        var strs = t.split(",");
        var newStr = xyzRemoveRe(strs);
        return newStr.join(",");
    } else if (t instanceof Array) {
        var result = [];
        for (var p1 in t) {
            var p3 = false;
            for (var p2 in result) {
                if (t[p1] == result[p2]) {
                    p3 = true;
                    break;
                }
            }
            if (p3 == false) {
                result[result.length] = t[p1];
            }
        }
        return result;
    } else {
        return t;
    }
}

function xyzRemoveItem(array, value, item) {
    if (array instanceof Array) {
        for (var a in array) {
            if (xyzIsNull(item)) {
                if (array[a] == value) {
                    array.splice(a, 1);
                    break;
                }
            } else {
                if (array[a][item] == value) {
                    array.splice(a, 1);
                    break;
                }
            }
        }
    }
    return array;
}

function xyzSetPossessor(resourceType, resource, possessor, resourceNameCn, reLoadTable) {
    $('head').append('<script type="text/javascript" src="../js/js_base/resourcePossessorManager.js"></script>');
    xyzSetPossessorForResource(resourceType, resource, possessor, resourceNameCn, reLoadTable);
}

/**
 * 通过用户名获取用户昵称
 */
function getNickNameByUsername(username) {
    var result = "";
    xyzAjax({
        url: "../AdminUserWS/getNickNameByUsername.do",
        type: "POST",
        data: {
            username: username,
        },
        async: false,
        dataType: "json",
        success: function (data) {
            result = data.content;
        },
    });
    return result;
}

function xyzGetExchangeRate(nameEg) {
    var result = null;
    xyzAjax({
        url: '../CurrencyWS/getExchangeRateByNameEg.do',
        type: "POST",
        data: {
            nameEg: nameEg
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                result = data.content;
            } else {
                top.$.messager.alert("警告", data.msg, "warning");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return result;
}

function xyzGetSuperOrderExchangeRate(nameEg) {
    var result = null;
    xyzAjax({
        url: '../Super_CurrencyWS/getExchangeRateByNameEg.do',
        type: "POST",
        data: {
            nameEg: nameEg
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                result = data.content;
            } else {
                top.$.messager.alert("警告", data.msg, "warning");
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return result;
}

/**
 * 来自预约系统
 * @param obj
 * @returns objCopy
 */
function clone(obj) {
    var o;
    if (typeof obj == 'object') {
        if (obj === null) {
            o = null;
        } else {
            if (obj instanceof Array) {
                o = [];
                for (var i in obj) {
                    o.push(clone(obj[i]));
                }
            } else {
                o = {};
                for (var j in obj) {
                    o[j] = clone(obj[j]);
                }
            }
        }
    } else {
        o = obj;
    }
    return o;
}

/**
 * html字符转义
 * @param str
 * @returns
 */
function xyzHtmlDecode(str) {
    if (xyzIsNull(str)) {
        return str;
    }
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&acute;/g, "'");
    str = str.replace(/&#45;&#45;/g, "--");
    str = str.replace(/&bksh;/g, "\\");
    str = str.replace(/\\n/g, '\n');
    return str;
}

function xyzOrderContentStateDetail(titleKeyArray, titleValueArray) {
    if (typeof titleKeyArray == "object") {
        ;
    } else {
        if (!xyzIsNull(titleKeyArray)) {
            titleKeyArray = titleKeyArray.split(",");
        }
    }
    if (typeof titleValueArray == "object") {
        ;
    } else {
        if (!xyzIsNull(titleValueArray)) {
            titleValueArray = titleValueArray.split(",");
        }
    }
    
    var contentHtml = "";
    contentHtml += "<form>";
    contentHtml += "<table align='center'>";
    for (var i = 0; i < titleKeyArray.length; i++) {
        contentHtml += "<tr>";
        contentHtml += "<td style='width:auto' >";
        contentHtml += titleKeyArray[i];
        contentHtml += "</td>";
        contentHtml += "<td>";
        if (titleValueArray[i] == 0) {
            contentHtml += "<span class='iconfont icon-square square_0'></span>";
        } else if (titleValueArray[i] == 1) {
            contentHtml += "<span class='iconfont icon-square square_1'></span>";
        } else if (titleValueArray[i] == 2) {
            contentHtml += "<span class='iconfont icon-square square_2'></span>";
        }
        contentHtml += "</td>";
        contentHtml += "</tr>";
    }
    
    contentHtml += "</table>";
    contentHtml += "</form";
    xyzdialog({
        dialog: 'dialogFormDiv_xyzOrderContentStateDetail',
        title: "订单状态",
        content: contentHtml,
        fit: false,
        height: 300,
        width: 400,
        buttons: [{
            text: '取消',
            handler: function () {
                $("#dialogFormDiv_xyzOrderContentStateDetail").dialog("destroy");
            }
        }]
    });
}


function checkNameCnIsSafe(nameCn) {
    var check = /^[\u4E00-\u9FA5a-zA-Z0-9【（]+[\u4E00-\u9FA5a-zA-Z0-9_+.【】&、\/（） ]*[\u4E00-\u9FA5a-zA-Z0-9】）]+$/;
    if (!check.test(nameCn)) {
        top.$.messager.alert("提示", "请勿填写[中文、英文、数字、小数点、下划线、加号、【】、（）、&、/、空格]以外的字符!且必须以[中文、英文、数字、【】、（）]作为开头和结尾！", "info");
        return false;
    }
    return true;
}

/**
 * 将ckeditor中添加的 <img src="xxx.jpg"/>的元素转换成标准的input标签 <input type="image" src="xxx.jpg"/>
 * @param content
 * @returns
 */
function replaceImgToInput(content) {
    content = '<div>' + content + '</div>';
    var ttt = $(content);
    var mageInputArr = ttt.find("img");
    $.each(mageInputArr, function (i, e) {
        var url = $(e).attr('src');
        var style = $(e).attr('style');
        var alt = $(e).attr('alt');
        $(e).replaceWith('<input type="image" src="' + url + '" alt="' + alt + '" style="' + style + '"/>');
    });
    return ttt.html();
}


function setApikey(apikey, i18n, callbackName) {
    var ajaxPath = 'cookie';
    var securityurl = xyzGetSecurityUrl();
    if (securityurl) {
        ajaxPath = securityurl + '/' + ajaxPath;
    }
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: ajaxPath,
        data: {
            method: "set",
            apikey: apikey,
            lang: i18n
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
            window[callbackName](data);
        }
    });
}

function getApikey(callbackName) {
    var ajaxPath = 'cookie';
    var securityurl = xyzGetSecurityUrl();
    if (securityurl) {
        ajaxPath = securityurl + '/' + ajaxPath;
    }
    $.ajax({
        async: false,
        cache: false,
        type: "POST",
        url: ajaxPath,
        data: {
            method: "get"
        },
        dataType: "jsonp",
        jsonp: "callback",
        success: function (data) {
            window[callbackName](data);
        },
        error: function (e) {
            var securityurl = xyzGetSecurityUrl();
            if (securityurl) {
                window.location.href = securityurl;
            }
        }
    });
}

//验证输入的全是英文
function decideEnglish(data) {
    var englishReg = /^[a-zA-Z]+$/;
    return englishReg.test(data) ? true : false;
}

//验证输入的为英文名字,中间可有空格
function decideEnglishName(data) {
    var englishReg = /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/;
    return englishReg.test(data) ? true : false;
}

//验证输入的手机号
function decidePhone(data) {
    var telphoneReg = /^([0-9]{3,4}-[0-9]{8})|1[0-9]{10}$/;
    return telphoneReg.test(data) ? true : false;
}

//验证区号
function decideArea(data) {
    var areaReg = /^0[0-9]{2,3}$/;
    return areaReg.test(data) ? true : false;
}

//验证固定
function decideLandline(data) {
    var landlineaReg = /^[1-9][0-9]{6,7}$/;
    return landlineaReg.test(data) ? true : false;
}

//验证输入的邮箱
function decideEmail(data) {
    var emailReg = /^(\w)+@(\w)+(\.[A-Za-z]{2,3}){1,3}$/;
    return emailReg.test(data) ? true : false;
}

//验证数字
function decideshu(data) {
    var shu = /^[0-9]*$/;
    return shu.test(data) ? true : false;
}

//验证中文
function decideChinese(data) {
    var chinese = /[^\u0000-\u00FF]/;
    return chinese.test(data) ? true : false;
}

//自定义验证
function decideCustom(ding, data) {
    var custom = eval(ding);
    return custom.test(data) ? true : false;
}

//验证身份证
function decideIdcard(data) {
//	var idcard =/^([1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3})|([1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X))$/;
    if (data.length == 15) {
        var reg = /^[1-9][0-9]{5}[2-9][0-9](0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])[0-9]{3}$/;
        return reg.test(data);
    } else if (data.length == 18) {
        var xiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
        var yuShu = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var xiShu = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var cardArray = data.split("");
        
        var sum = 0;
        for (var i = 0; i < cardArray.length - 1; i++) {
            sum += parseInt(cardArray[i]) * xiShu[i];
        }
        var yu = sum % 11;
        for (var i = 0; i < yuShu.length; i++) {
            if (yu == yuShu[i]) {
                if (data.substring(data.length - 1).toUpperCase() == xiaoYan[i]) {
                    return true;
                }
            }
        }
    }
    return false;
}

//验证护照
function decidePassport(data) {
    var passport = /^G[0-9]{8}$|L[0-9]{8}$|E[A-Z0-9]{1}[0-9]{7}$|1[45][0-9]{7}$|P[0-9]{7}$|S[0-9]{7,8}$|D[0-9]+|T[0-9]{8}$/;
    return passport.test(data) ? true : false;
}

function Trim(str, is_global) {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}

//获取该工作流是否被当前用户锁定
function getVisaflowIsOrNotLockByHolder(visaflowCode) {
    var pd = false;
    xyzAjax({
        url: "../VisaFlowWS/getVisaflowIsOrNotLockByHolder.do",
        type: "POST",
        data: {
            visaflowCode: visaflowCode,
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                pd = true;
            } else {
                top.$.messager.alert("警告", data.msg, "warning");
                pd = false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return pd;
}


//锁住或者释放当前工作流(如用户操作与工作流有关的东西会暂时锁住该工作流的所有操作，10分钟后释放)
function updateVisaflowLockOrRelease(visaflowCode, operate) {
    var pd = false;
    xyzAjax({
        url: "../VisaFlowWS/updateVisaflowLockOrRelease.do",
        type: "POST",
        data: {
            visaflowCode: visaflowCode,
            operate: operate
        },
        async: false,
        dataType: "json",
        success: function (data) {
            if (data.status == 1) {
                pd = true;
            } else {
                top.$.messager.alert("警告", data.msg, "warning");
                pd = false;
            }
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    return pd;
}

function isPositiveNum(s) {//是否为正整数
    var re = /^[0-9]*[1-9][0-9]*$/;
    return re.test(s);
}

function checkStrIsOk(str) {
    var check = /^[\u4E00-\u9FA5a-zA-Z0-9【]+[\u4E00-\u9FA5a-zA-Z0-9_+.【】&、\/ ]*[\u4E00-\u9FA5a-zA-Z0-9】]+$/;
    if (!check.test(str)) {
        return false;
    }
    return true;
}

function replaceInputToImg(content) {
    content = '<div>' + content + '</div>';
    var ttt = $(content);
    var inputImageArr = ttt.find("input[type='image']");
    $.each(inputImageArr, function (i, e) {
        var url = $(e).attr('src');
        var style = $(e).attr('style');
        var alt = $(e).attr('alt');
        $(e).replaceWith('<img onclick="window.open(\'' + url + '\')" src="' + url + '" alt="' + alt + '" style="' + style + '"/>');
    });
    return ttt.html();
}

function xyzGetSecurityUrl() {
    if (window.top._security_url_) {
        return window.top._security_url_;
    }
    xyzAjax({
        url: "security.xyz",
        type: "POST",
        data: {},
        async: false,
        dataType: "json",
        success: function (data) {
            if (data && data.content) {
                window.top._security_url_ = data.content;
            }
        },
    });
    return window.top._security_url_;
}

// json对象转换成字符串
function stringify(s) {
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
function parseJson(s) {
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

function columnsEditor(s) {
    var s = stringify(s);
    s = parseJson(s);
    return s
}

/**
 * 希望睡眠时间不要过长. 1S 以上慎重考虑
 * @param delay 睡眠时间
 * @returns
 */
function sleep(delay) {
    var time = Date.now();
    while (Date.now() - time <= delay) ;
}

//全局错误捕捉机制
window.onerror = function (msg, url, line, col, error) {
    var obj = {};
    obj.url = location.href; //浏览器地址
    if (error) {
        obj.stack = error.stack; //报错内容
    }
    obj.userAgent = navigator.userAgent;//浏览器版本
    obj.vendor = navigator.vendor;//浏览器开发商
    obj.cookie = document.cookie;//所有cookie
    obj.localStorge = window.localStorage;//所有localStorge
    obj.sessionStorage = window.sessionStorage;//所有sessionStorage
    if (top.currentAppInfo) {
        obj.appId = top.currentAppInfo.appId;
    }
    if (location.port) {
        return false  //开发环境不管
    }
    xyzAjax({
        type: 'post',
        url: "../UIExceptionInfoWS/addUIExceptionInfo.do",
        data: {
            msg: JSON.stringify(obj)
        }
    });
};



function htmlDecode(html) {
    return html.replace(/(\&|\&)gt;/g, ">")
        .replace(/(\&|\&)lt;/g, "<")
        .replace(/(\&|\&)quot;/g, "\"");
}
//美匣公用API开始-----2019/04/11 wxg
window.mxApi = {
    /**--将字符串写入粘贴板,快速复制,一键复制
     * @text 写入剪切板的文字
     * @fn 写入成功后的回调函数
     **/
    writeIntoClipBoard: function (text, fn) {
        var textArea = document.createElement("textarea");
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.width = '2em';
        textArea.style.height = '2em';
        textArea.style.padding = '0';
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';
        textArea.style.background = 'transparent';
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                fn && fn(text)
            } else {
                alert('复制失败')
            }
        } catch (err) {
            alert('该浏览器不支持点击复制到剪贴板');
        }
        document.body.removeChild(textArea);
    },
    
    /**获取URl参数
     */
    getUrlArgument: function () {
        let url = location.search; //获取url中"?"符后的字串
        let theRequest = {};
        if (url.indexOf("?") !== -1) {
            let str = url.substr(url.indexOf("?") + 1);
            let strs = str.split("&");
            for (let i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
            }
        }
        return theRequest;
    },
    
    /**解码html*/
    htmlDecode: function (html) {
        return html.replace(/(\&|\&)gt;/g, ">")
            .replace(/(\&|\&)lt;/g, "<")
            .replace(/(\&|\&)quot;/g, "\"");
    },
    /**
     * 对象克隆，将返回新的对象副本，不再影响原始对象
     * @param obj
     * @returns objCopy
     */
    clone: function (obj) {
        let o;
        if (typeof obj == 'object') {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (let i in obj) {
                        o.push(clone(obj[i]));
                    }
                } else {
                    o = {};
                    for (let j in obj) {
                        o[j] = clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },
    
    /** 处理对象数组去重
     * @param array
     * @returns
     */
    distinctObjArray: function (array) {
        if (array.length <= 0)
            return array;
        let n = {}, r = []; //n为hash表，r为临时数组
        for (let i = 0; i < array.length; i++) {
            if (array[i] instanceof Array) {
                array[i] = distinctObjArray(array[i]);
            }
            let pp = array[i];
            pp = (pp instanceof Object || pp instanceof Array) ? JSON.stringify(pp) : pp;
            if (!n[pp]) {
                n[pp] = true; //存入hash表
                r.push(array[i]); //把当前数组的当前项push到临时数组里面
            }
        }
        return r;
    },
    /**
     * 转译特殊符号
     * @param str 输入字符串
     * @return str 处理后的字符串
     * */
    escape: function (str) {
        if (this.isEmpty(str)) {
            return str;
        }
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&gt;/g, ">");
        str = str.replace(/&acute;/g, "'");
        str = str.replace(/&#45;&#45;/g, "--");
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&lt;/g, "<");
        str = str.replace(/&quot;/g, '\"');
        str = str.replace(/&acute;/g, "\'");
        return str;
    },
    /**
     * 护照格式验证
     * @param value 护照格式字符串
     * @return boolean
     * */
    decidePossport: function (value) {
        value = value.toUpperCase();
        let dlReg = /^G[0-9]{8}$/; //大陆护照
        let eReg = /^E[0-9]{8}$/; //
        let nReg = /^1[45][0-9]{7}$/; //大陆护照
        let pReg = /^P[0-9]{7}$/; //
        let sReg = /^S[0-9]{7,8}$/; //
        let dReg = /^D[0-9]+$/; //
        let rtzReg = /^T[0-9]{8}$/; //入台证
        let LReg = /^L[0-9]{8}$/;
        return (dlReg.test(value) || eReg.test(value) || nReg.test(value) || pReg.test(value) || sReg.test(value) || dReg.test(value) || rtzReg.test(value) || LReg.test(value));
    },
    /**
     * 身份证格式验证
     * @param value 护照格式字符串
     * @return boolean
     * */
    decideIdcard: function (value) {
        if (value.length === 15) {
            let reg = /^[1-9][0-9]{5}[2-9][0-9](0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])[0-9]{3}$/;
            return reg.test(value);
        } else if (value.length === 18) {
            let xiaoYan = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"];
            let xiao = ["1", "0", "x", "9", "8", "7", "6", "5", "4", "3", "2"];
            let yuShu = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            let xiShu = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            let cardArray = value.split("");
            
            let sum = 0;
            for (let i = 0; i < cardArray.length - 1; i++) {
                sum += parseInt(cardArray[i]) * xiShu[i];
            }
            let yu = sum % 11;
            for (let i = 0; i < yuShu.length; i++) {
                if (yu === yuShu[i]) {
                    if (value.substring(value.length - 1).toUpperCase() === xiaoYan[i]) {
                        return true;
                    }
                }
            }
        }
        return false;
    },
    /**
     * 中文验证
     * @param value
     * @return boolean
     * */
    decideChinese: function (value) {
        let reg = /^[\u4E00-\u9FA5]{0,}$/;
        return !reg.test(value);
    },
    /**
     * 手机验证
     * @param value 护照格式字符串
     * @return boolean
     * */
    decidePhone: function (value) {
        let reg = /^0?1[34758]\d{9}$/;
        return !reg.test(value);
    },
    /**
     * 邮箱验证
     * @param value 护照格式字符串
     * @return boolean
     * */
    decideEmail(value) {
        let reg = /^(\w)+@(\w)+(\.[A-Za-z]{2,3}){1,3}$/;
        return !reg.test(value);
    },
    
    /**指定日期的前几天或后几天
     *date 指定日期
     *num 前几天或者后几天
     */
    getThatDate(date, num) {
        let trans_day = "";
        let cur_date = new Date(date);
        let cur_year = new Date(date).getFullYear();
        let cur_month = cur_date.getMonth() + 1;
        let real_date = cur_date.getDate();
        cur_month = cur_month > 9 ? cur_month : ("0" + cur_month);
        real_date = real_date > 9 ? real_date : ("0" + real_date);
        let eT = cur_year + "-" + cur_month + "-" + real_date;
        trans_day = this.transDate(eT, num);
        return trans_day;
    },
    transDate(dateParameter, num) {
        let translateDate = "",
            dateString = "",
            monthString = "",
            dayString = "";
        translateDate = dateParameter.replace("-", "/").replace("-", "/");
        let newDate = new Date(translateDate);
        newDate = newDate.valueOf();
        newDate = newDate + num * 24 * 60 * 60 * 1000;
        newDate = new Date(newDate);
        if ((newDate.getMonth() + 1).toString().length === 1) {
            monthString = 0 + "" + (newDate.getMonth() + 1).toString();
        } else {
            monthString = (newDate.getMonth() + 1).toString();
        }
        if (newDate.getDate().toString().length === 1) {
            dayString = 0 + "" + newDate.getDate().toString();
        } else {
            dayString = newDate.getDate().toString();
        }
        dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
        return dateString;
    },
    
    /**
     * 对JSON根据某一对象的属性进行排序
     * @param json JSON 数组
     * @param attr 排序依据的属性
     * @param type  默认从高到低,'down'从高到低
     * */
    orderby: function (json, attr, type) {
        return json.sort(function (a, b) {
            let value1 = a[attr];
            let value2 = b[attr];
            return type === "down" ? value1 - value2 : value2 - value1;
        })
    },
    /**
     * 根据传入时间计算当前时间是该月份的第几周,以周日作为节点;
     * @param d 时间对象,
     * **/
    calcWeek: function (d) {
        let now = d.getTime(); //当前时间戳
        let res = {now: d.getTime()}; //组装返回数据
        let oneDayLong = 24 * 60 * 60 * 1000; //一天时间长度
        //根据当前时间获取周日
        let monthHead = new Date(d.getFullYear(), d.getMonth(), 1).getTime(); //月初时间戳
        let monthEnd = new Date(d.getFullYear(), d.getMonth() + 1, 1).getTime() - 24 * 3600 * 1000; //月末时间戳
        let wd;//根据传入时间计算传入日期对应的截止时间戳
        if (d.getDay() === 0) {
            wd = now
        } else {
            wd = now + (7 - d.getDay()) * oneDayLong
        }
        
        if (wd > monthEnd) {
            //截止大于月底就是下月的第一周
            res.week = 1;
            res.month = new Date(d).getMonth() + 2;
        } else if (new Date(wd).getDate() <= 7) {
            //截止小于7号就是本月第一周
            res.week = 1;
            res.month = new Date(d).getMonth() + 1;
        } else if (new Date(monthHead).getDay() === 1) {
            //本月一号是周一的情况下,截止除以7就是第几周
            res.week = new Date(wd).getDate() / 7;
            res.month = new Date(d).getMonth() + 1;
        } else {
            //截止 日期 减去第一周天数 除以7再加一就是第几周
            let weekDayDate = new Date(wd).getDate(); //截止日期
            let firstWeekDays = new Date(monthHead).getDay(); //当月第一周长度
            if (new Date(monthHead).getDay() === 0) {
                firstWeekDays = 1
            } else {
                firstWeekDays = 8 - new Date(monthHead).getDay()
            }
            res.week = (weekDayDate - firstWeekDays) / 7 + 1;
            res.month = new Date(d).getMonth() + 1;
        }
        return res
    },
    /*
     * 判断登录设备是手机还是pc
     * */
    isPc: function () {
        let userAgentInfo = navigator.userAgent;
        let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  //判断用户代理头信息
        let flag = true;
        for (let v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) !== -1) {
                flag = false;
                break;
            }
        }
        return flag;   //true为pc端，false为非pc端
    },
    /**
     * 根据传入时间计算当前日期所在周的开始日期和结束日期
     * **/
    getTimeSlot: function (date) {
        let sWeek;  //开始的星期
        let eWeek;  //结束的星期
        if (date.getDay() === 0) {
            sWeek = date.getDay() + 6;
            eWeek = date.getDay();
        } else {
            sWeek = date.getDay() - 1;
            eWeek = 7 - date.getDay();
        }
        //获取开始日期
        let sTime = date.getTime() - sWeek * 24 * 60 * 60 * 1000;  //获取开始星期的时间戳
        let startDate = new Date(sTime);  //转换时间戳
        let sDate = startDate.getFullYear() + "年" + (startDate.getMonth() + 1) + "月" + startDate.getDate() + "日";
        //获取结束日期
        let eTime = date.getTime() + eWeek * 24 * 60 * 60 * 1000;
        let endDate = new Date(eTime); //时间戳转换
        let eDate = endDate.getFullYear() + "年" + (endDate.getMonth() + 1) + "月" + endDate.getDate() + "日";
        return {
            startDate: startDate,
            endDate: endDate,
            sDate: sDate,
            eDate: eDate
        }
    },
    /**上传文件
     * @fn 上传完成后的回调函数
     * */
    uploadImgFN: function (fn) {
        function getUUID() {
            let chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
            let uuid = [];
            let i;
            let r;
            for (i = 0; i < 32; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
            return uuid.join('');
        }
        
        //获取token
        function getToken(callback) {
            //获取token
            let uploadToken;
            let ieFlag = navigator.userAgent.indexOf("MSIE") !== -1;
            let xhr = new XMLHttpRequest();
            if (ieFlag) {
                xhr = new XDomainRequest();
            }
            if (!xhr) {
                return;
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        uploadToken = xhr.responseText;
                    } else {
                        uploadToken = '';
                    }
                    if (callback) {
                        callback(uploadToken)
                    }
                }
            };
            let paramArray = new Array();
            let param = paramArray.join('&').replace('%20', '+');
            xhr.open("POST", 'https://toolapi.maytek.cn/qt2', true);
            if (!ieFlag) {
                xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8");
                xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
                xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            }
            xhr.send(param);
        }
        
        //上传图片
        function uploadImg(file, MxEditorToken, callback) {
            let qiniuUrl = 'https://upload.qiniup.com';
            let errCodeMsg = {
                'code400': '报文构造不正确或者没有完整发送。',
                'code401': '上传凭证无效。',
                'code403': '上传文件格式不正确。',
                'code413': '上传文件过大。',
                'code579': '回调业务服务器失败。',
                'code599': '服务端操作失败。',
                'code614': '目标资源已存在。'
            };
            
            if (MxEditorToken.indexOf('error') > -1 || MxEditorToken == '') {
                top.$.messager.alert("提示", 'token获取失败,请联系管理员', "warning");
                return;
            }
            
            //构建xhr上传表单参数
            let form = new FormData();
            form.append('file', file);
            form.append('token', MxEditorToken);
            form.append('x:folder', 'editorImg');
            //优化自定义文件名模式
            
            let date = new Date();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let dd = date.getFullYear() + (month >= 10 ? (month) : ('0' + month)) + (day >= 10 ? (day) : ('0' + day));
            form.append('key', 'editorImg/' + dd + '/' + getUUID());
            
            //构建xhr对象
            let xhr = new XMLHttpRequest();
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
                        let resultData = xhr.responseText;
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
                        let resultData = {
                            status: 0,
                            msg: errCodeMsg['code' + xhr.status] ? errCodeMsg['code' + xhr.status] : xhr.statusText
                        };
                        callback(resultData);
                    }
                }
            };
            xhr.send(form);//发射
        }
        
        let ipt = document.createElement('input');
        ipt.style = 'display:none';
        ipt.type = 'file';
        ipt.accept = "image/*";
        let body = document.querySelector('body');
        body.appendChild(ipt);
        ipt.onchange = function (event) {
            if (!event.target || !event.target.files) {
                return
            }
            let files = event.target.files[0];
            getToken(function (token) {
                uploadImg(files, token, fn)
            })
        };
        ipt.click();
    },
    /** 在一个日期区间内获取某个月份的所有日期
     * @month需要获取日期的月份
     * @st 开始日期
     * @et 结束日期
     * **/
    getMonthDate: function (month, st, et) {
        var iscontinue = 1;
        let stime, etime;
        if (st) {
            stime = new Date(st.replace(/-/g, '/')).getTime();
        }
        if (et) {
            etime = new Date(et.replace(/-/g, '/')).getTime()
        }
        if (!st && !et) {
            console.warn('开始或者结束日期至少填写一个');
            iscontinue = 0
        } else if (!month) {
            console.log.warn('请填写月份');
            iscontinue = 0
        }
        if (st && et) {
            if (etime === stime) {
                console.warn('开始日期与结束日期相同');
                iscontinue = 0
            } else if (stime > etime) {
                console.warn('开始日期不能大于结束日期');
                iscontinue = 0
            }
        }
        
        //没有开始日期的情况把结束日期所在月的第一天当做开始日期
        if (!stime) {
            stime = new Date(new Date(etime).getFullYear() + '/' + (new Date(etime).getMonth() + 1) + '/1').getTime();
        }
        
        //没有结束日期的情况下把传入月份的最后一天当做结束日期
        if (!etime) {
            etime = new Date(new Date(stime).getFullYear() + '/' + (month - 0 + 1) + '/1').getTime() - 24 * 60 * 60 * 1000;
        }
        let dateArr = [etime];
        //如果传入的开始日期月份大于传入的月份报错
        if (new Date(stime).getMonth() + 1 > month - 0 || new Date(etime).getMonth() + 1 < month - 0) {
            console.warn('月份不在可用区间内')
            iscontinue = 0
        }
        if (!iscontinue) {
            return
        }
        //组装日期区间数组
        while (etime > stime) {
            etime -= 24 * 60 * 60 * 1000;
            dateArr.unshift(etime)
        }
        //循环dateArr匹配可用日期
        dateArr = dateArr.filter(function (date) {
            if ((new Date(date).getMonth() + 1).toString() === month.toString()) {
                return true
            }
        });
        stime = new Date(dateArr[0]);
        etime = new Date(dateArr[dateArr.length - 1])
        return stime.getFullYear() + '-' + (stime.getMonth() + 1) + '-' + stime.getDate() + '~' + etime.getFullYear() + '-' + (etime.getMonth() + 1) + '-' + etime.getDate()
    },
    /** 多个日期求交集
     * @d1 日期1
     * @d2 日期2
     * **/
    dateIntersection: function (d1, d2) {
        let resobj = {
            intersectionArr: [],
            intersectionStr: ''
        };
        
        function intersection(d) {
            let obj = {
                content: []
            };
            let arr = d.split('~');
            if (arr[0]) {
                arr[0] = new Date(arr[0].replace(/-/g, '/'));
            }
            if (arr[1]) {
                arr[1] = new Date(arr[1].replace(/-/g, '/'));
            }
            obj.st = arr[0];
            obj.et = arr[1];
            if (!obj.et || !obj.st) {
                return obj
            }
            let st = obj.st.getTime();
            let et = obj.et.getTime();
            while (st <= et) {
                obj.content.push(st);
                st += 24 * 60 * 60 * 1000
            }
            return obj
        }
        
        let date1 = intersection(d1);
        let date2 = intersection(d2);
        let res = date2.content.filter(function (v) {
            return date1.content.indexOf(v) !== -1 // 利用filter方法来遍历是否有相同的元素
        });
        res.forEach(function (e) {
            let str = new Date(e);
            str = str.getFullYear() + '-' + (str.getMonth() + 1) + '-' + str.getDate();
            resobj.intersectionArr.push(str)
        });
        resobj.intersectionStr = resobj.intersectionArr[0] + '~' + resobj.intersectionArr[resobj.intersectionArr.length - 1];
        return resobj
    }
};
//美匣共用API结束
