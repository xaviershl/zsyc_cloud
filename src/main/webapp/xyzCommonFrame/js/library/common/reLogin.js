document.write(
    "<style>" +
    "#reLoginMarsk{"+
    "width: 100%;"+
    "height: 100%;"+
    "background: rgba(0, 0, 0, 0.5);"+
    "position: fixed;"+
    "top: 0;"+
    "z-index: 21;"+
    "display: none;}"+
    "#reLoginMarsk .innerBox{"+
    "height: 340px;"+
    "width: 320px;"+
    "background: #fff;"+
    "border-radius: 6px;"+
    "position: absolute;"+
    "top: 50%;"+
    "left: 50%;"+
    "transform: translate(-50%, -50%);"+
    "padding: 12px 20px;}"+
    "#reLoginMarsk .innerBox .titleBox {"+
    "width: 100%;"+
    "text-align: center;"+
    "border-bottom: 1px solid #e6e6e6;"+
    "padding: 15px 0;}"+
    "#reLoginMarsk .innerBox .msgBox {"+
    "width: 100%;"+
    "border: 1px solid #ff9731;"+
    "background-color: #fff8f1;"+
    "height: 36px;"+
    "line-height: 36px;"+
    "border-radius: 20px;"+
    "margin: 20px 0;"+
    "text-align: center;"+
    "font-size: 13px;"+
    "color: #ff9731;}"+
    "#reLoginMarsk .innerBox .msgBox i {"+
    "width: 13px;"+
    "height: 13px;"+
    "display: inline-block;"+
    "background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABMklEQVQoz23RvUtcURAF8N99aKUIYiEEs/9EFmKnpYUYNYWCRRoRQYLcKp0fje2CEgI2sbMJWFoJCQhpbmERkkI0YJfFQkENMeKzyF14vniaYc6ZM8xHUEHZak7gDZ6hQIlLfAkxbXTqQsWwi2F8wF6I6bhsNbsxjSU8x8sQUztkw0eMoxFi+p25tzgIMX3P+TamMFSUreYY5jBYMTSwmfl/I8W0gG9434UVrIeY7ivrXeZ44jFmcFigFzs18TbHmyoZYmrja4E7/KqZ/uICf/yPk85Z+2od79Cdz15Hf4eceEKcxefaHwuMFHmf1ZrYwBpe1xpt4KoIMW3hvGw1P1XE63yMm0qjSbzDfOe5PfkHZ1gOMR1VigfyJIt4FWLaD7WxtjCKH/iJfrxAG0shplN4AJLuZNLsQOymAAAAAElFTkSuQmCC') no-repeat center;"+
    "margin-right: 10px;"+
    "vertical-align: middle;}"+
    "#reLoginMarsk .innerBox .msgBox span {"+
    "vertical-align: middle;}"+
    "#reLoginMarsk .formBox li {"+
    "font-size: 14px;"+
    "color: #555;"+
    "margin-bottom: 20px;"+
    "padding-left: 10px;}"+
    "#reLoginMarsk .formBox li input {"+
    "width: 220px;"+
    "height: 36px;"+
    "line-height: 36px;"+
    "border-radius: 6px;"+
    "border: 1px solid #ccc;"+
    "padding: 0 16px;}"+
    "#reLoginMarsk .formBox li input[type='text'] {"+
    "background-color: #f4f5f7;}"+
    "#reLoginMarsk .formBox li span {"+
    "margin-right: 18px;"+
    "}"+
    "#reLoginMarsk button {"+
    "width: 100%;"+
    "background: #3b72a8;"+
    "height: 40px;"+
    "color: #fff;"+
    "font-size: 14px;"+
    "margin-top: 40px;"+
    "border-radius: 6px;"+
    "border: 0;"+
    "cursor: pointer;}"+
    "</style>"
);
document.write(
    "<div id='reLoginMarsk'>"+
    "<div class='innerBox'>"+
    "<div class='titleBox'>"+
    "<img src='data:image/png;base64,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' alt=''>"+
    "</div>"+
    "<div class='msgBox'>"+
    "<i></i>"+
    "<span>登录超时，请重新登录</span>"+
    "</div>"+
    "<div class='formBox'>"+
    "<ul>"+
    "<li>"+
    "<span>账号</span>"+
    "<input type='text' id='reuserName' readonly>"+
    "</li>"+
    "<li>"+
    "<span>密码</span>"+
    "<input type='password' id='reUserPwd' autofocus>"+
    "</li>"+
    "</ul>"+
    "</div>"+
    "<button id='reLoginBtn'>登　录</button>"+
    "</div>"+
    "</div>"
);

var d = {
    reLoginMarsk : document.getElementById("reLoginMarsk"),
    reUserPwd : document.getElementById("reUserPwd"),  //密码框
    reUserName : document.getElementById("reuserName"), //用户名输入框
    reloginBtn : document.getElementById("reLoginBtn"), //登录按钮
    language: getCookie("iiiiiiiiiiiiiiiiiiiiiiiiiiiiii") || "zh",
    username : "",   //账号
    password : "",   //密码
    url : location.port && location.port==="8080" ? "../zsyc_cloud" : "",
};

window.reLogin = function(userName,mainUserName) {  //name:用户名  mainUserName:所属主账号名称
    d.reLoginMarsk.style.display = "block";
    setTimeout(function() {
        d.reUserPwd.focus();
    },1); //密码框自动获取焦点
    if (mainUserName) {
        d.username = mainUserName;
    } else {
        d.username = userName;
    }
    d.reUserName.value = d.username;
    d.reloginBtn.onclick = function () {
        d.password = d.reUserPwd.value;
        if (!d.password) {
            top.$.messager.alert("提示", "请输入密码", "warning", "error");
            return;
        }
        ajax({
            type:"POST",
            url:d.url + "/LoginWS/login.xyz",
            dataType:"json",
            async: false,
            data:{
                username: d.username,
                password: $.md5(d.password).substr(8, 16),
                loginUsername: userName,
                phoneType: 'pc',
                phoneCode: 'pc',
                loginLang: d.language,
            },
            success: function (response) {
                // 此处放成功后执行的代码
               var data = JSON.parse(response);
               if(data.status ===  1){
                   var key = data.content.apikey;
                   exdate = new Date();
                   exdate.setDate(exdate.getDate() + 7);
                   var apikey = "zsyczsyczsyczsyczsyczsyczsyczsyczsyczsyc=" + key + ";expires=" + exdate.toGMTString() + ";path=/";
                   document.cookie = apikey;
                   d.reLoginMarsk.style.display = "none";
                   ajax({
                       url:"../LoginWS/decideLogin.do",
                       type: "POST",
                       data: {},
                       async: false,
                       dataType: "json",
                       success: function(response){
                           var data2 = JSON.parse(response);
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
               }else{
                   top.$.messager.alert("提示", data.msg, "warning", "error");
               }

            },
            fail: function (status) {
                // 此处放失败后执行的代码
            }
        });
    };
    d.reUserPwd.onkeydown = function (e) {
        var theEvent = e || window.event;
        // 兼容FF和IE和Opera
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code === 13) {
            //回车执行查询
            d.reloginBtn.click();
        }
    }
};

//获取cookie
function getCookie(key){
    var cookie = document.cookie;
    var arr = cookie.split("; ");
    for(var i=0;i<arr.length;i++){
        var newArr = arr[i].split("=");
        if(key === newArr[0]){
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
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".",""));
    return arr.join("&");
}