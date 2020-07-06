/**
 *
 * @param btnId 审核按钮id
 * @param title 标题
 * @param detail 审核详情
 * @param scode 美匣定义的审核项 编号
 * @param yType 业务类型 eg:OrderContent
 * @param yTypeNameCn 业务类型名称 eg:订单
 * @param yKey 业务编号 eg:ABC123645897
 * @param before 在审核功能初始化后自动调用的函数, 可以用来初始化页面上关于审核的一些状态等等功能
 * @param finish 在审核完成后 调用的函数
 * @returns
 */
window.ApprovalPlugin = function (obj) {
    var $this = this;
    $this.xyzApprovalData = {}; //审批数据对象
    $this.xyzApprovalProcessList = [];//审批流程数据集合
    $this.xyzApprovalLogAllList = [];
    $this.xyzApprovalDetail = {};//审批业务对象
    $this.xyzApprovalLogList = [];//审批详情数据集合
    
    $this.xyzApprovalStatus = 0; //审批状态 0未开始, 1进行中, 2完成,3=0失败
    $this.xyzCurrentStep = 0; //当前完成到第几步了
    $this.xyzApprovalParam = {};
    $this.xyzStartApprovalDetail = '';
    $this.xyzApprovalYTypeNameCn = '';
    $this.xyzApprovalMainWindow;
    $this.onClose;
    $this.onOpen;
    $this.onStartApproval;
    $this.onApproval;
    $this.formInfo = ''; //发起审核的表单信息
    $this.flagConfig = false; //是否配置了 审核流程
    $this.msgWindow = null;  //弹出来的消息提示框
    
    this.xyzInitApprovalPlugin=function (obj) {
        
        $this.xyzApprovalParam = obj;
        var btnId = $this.xyzApprovalParam.btnId;
        var title = $this.xyzApprovalParam.title;
        var scode = $this.xyzApprovalParam.scode;
        var yType = $this.xyzApprovalParam.yType;
        $this.xyzApprovalYTypeNameCn = $this.xyzApprovalParam.yTypeNameCn;
        var yKey = $this.xyzApprovalParam.yKey;
        var before = $this.xyzApprovalParam.before;
        
        if(obj.hasOwnProperty('finish')){
            $this.xyzApprovalParam.finish.data = $this.xyzApprovalParam.data;
        }
        
        if(obj.hasOwnProperty('onOpen')){
            $this.onOpen = $this.xyzApprovalParam.onOpen;
        }
        if(obj.hasOwnProperty('onClose')){
            $this.onClose = $this.xyzApprovalParam.onClose;
        }
        if(obj.hasOwnProperty('onStartApproval')){
        	$this.onStartApproval = $this.xyzApprovalParam.onStartApproval;
        }
        if(obj.hasOwnProperty('onApproval')){
        	$this.onApproval = $this.xyzApprovalParam.onApproval;
        }
        
        $this.initApprovalData(scode, yType, yKey);
        
        if (!xyzIsNull(before)) {
            before($this.xyzApprovalStatus ,$this.flagConfig);
        }
        $('#' + btnId).click(function () {
            $this.showApprovalWindow();
        });
    }
    
    this.reloadApprovalWindow=function () {
        
        if ((!$this.xyzApprovalProcessList || $this.xyzApprovalProcessList.length <= 0)
            && $this.xyzApprovalStatus == 2) {
            
            $('#xyzApprovalBeforeDiv').html('该项无需审核!');
            return false;
        }
        
        var approvalBeforeHtml = '<table  id="txt"><tr>'
            + '<td style="width: 852px"><textarea  id="xyzStartApprovalDetailForm"></textarea></td>'
            + '<td style="text-align: center"><div style="color: #3B72A8">审批详情</div> <p    class="statusBtn fqbtn" id="btn_startApproval"></p></td>'
            + '</tr></table>';
        $('#xyzApprovalBeforeDiv').html(approvalBeforeHtml);
        
        //显示表格初始化
        var formJson = [];
        if($this.formInfo){
        	formJson = xyzJsonToObject($this.formInfo)
        }
        if($this.xyzApprovalStatus == 0 || $this.xyzApprovalStatus == 3){
            if($this.onOpen){
                formJson = $this.onOpen();
            }
        }
        
        var fjHtml = '';
        for(var fj in formJson){
            var fjObj = formJson[fj];
            
            fjHtml += '<tr><td style="width:300px;">'+fjObj.text+'<input type="hidden" id="formJson_'+fjObj.key+'" name="'+fjObj.text+'" value="'+fjObj.value+'"/></td><td>'+fjObj.value+'</td></tr>';
        }
        $('#xyzApprovalBeforeDiv').prepend('<div id="fjHtml"><div><span>审批信息</span></div><table >'+fjHtml+'</table></div>');
        
        $('#xyzStartApprovalDetailForm').val((!$this.xyzStartApprovalDetail?$this.xyzApprovalParam.detail:$this.xyzStartApprovalDetail));
        
        if ($this.xyzApprovalStatus == 0 || $this.xyzApprovalStatus == 3) {
            $('#btn_startApproval').html('<a href="javascript:;" id="startApprovalBtn">发起审核</a>');
            $('#startApprovalBtn').click(function () {
                var detail = $('#xyzStartApprovalDetailForm').val();
                $this.startApprovalOper(detail);
            });
        } else if ($this.xyzApprovalStatus == 1) {
            $('#btn_startApproval').html('审核中...');
            $('#btn_startApproval').attr('class','statusBtn shzbtn')
        } else if ($this.xyzApprovalStatus == 2) {
            $('#btn_startApproval').html('审核已通过');
            $('#btn_startApproval').attr('class','statusBtn ytgbtn')
        }
        
        var mainTableHtml = '<table id="approvalTable" class="approvalTable" style="margin-top: 20px;"><tr style="background: #E2EBF4;color: #3b72a8" id="titleTr"><th style="width:150px;">说明</th><th style="width:100px;">特性</th><th style="width:350px;">操作人</th><th style="width:150px;position: relative">操作 ↓ </th></tr></table>';
        $('#xyzApprovalMainDiv').html(mainTableHtml);
        var scode = $this.xyzApprovalParam.scode;
        var yType = $this.xyzApprovalParam.yType;
        var yKey = $this.xyzApprovalParam.yKey;
        
        var maxStep = 0;
        
        //初始化弹窗页面
        var step = -1;
        for (var api in $this.xyzApprovalProcessList) {
            var ap = $this.xyzApprovalProcessList[api];
            
            if(maxStep < ap.step){
                maxStep = ap.step;
            }
            
            if (ap.step == step) {
                var personStr = $('#personTd_' + step).html();
                personStr += ',' + ap.personNameCn;
                $('#personTd_' + step).html(personStr);
            } else {
                step = ap.step;
                var tempHtml = '<tr ><td id="stepTd_' + step + '">' + ap.detail + '</td><td id="flagAllOk_' + step + '">' + (ap.flagAllOk == 1 ? '需全部通过' : '至少一人通过') + '</td><td id="personTd_' + step + '">' + ap.personNameCn + '</td><td id="operTd_' + step + '"><span id="oper_' + step + '"></span></td>';
                $('#approvalTable').append(tempHtml);
            }
        }
        
        //已经通过的打√
        if($this.xyzApprovalStatus == 1){
            trueStepIndex = $this.xyzCurrentStep;
        }
        if($this.xyzApprovalStatus == 2){
            trueStepIndex = maxStep + 1; //最后一个也要打√
        }
        if($this.xyzApprovalStatus == 0 || $this.xyzApprovalStatus == 3){
            trueStepIndex = 0;
        }
        
        for(var i = 0; i < trueStepIndex; i++){
            $('#oper_' + i).html('<span style="color:#1EA85A">已通过</span>');
        }
        
        //改变审核备注 并绑定按钮事件 为了拼接个numberCode 上去 所以采用循环处理.
        if ($this.xyzApprovalStatus == 1) {
            for (var api in $this.xyzApprovalProcessList) {
                var ap = $this.xyzApprovalProcessList[api];
                var flagCheck = false;
                
                for (var adi in $this.xyzApprovalLogList) {
                    var ad = $this.xyzApprovalLogList[adi];
                    
                    if (ad.step == ap.step) {
                        if (ad.person == ap.person) {
                            flagCheck = true;
                            break;
                        }
                    }
                }
                
                if (!flagCheck) {
                    if (ap.step == $this.xyzCurrentStep) {
                        if (top.currentUserUsername == ap.person) {
                            var operHtml = '<a href="javascript:;" id="approvalOperBtn" name="' + ap.numberCode + '">审核</a>';
                            $('#oper_' + ap.step).html(operHtml);
                        }
                    }
                }
            }
            
            $('#approvalOperBtn').click(function () {
                var apStr = $(this).attr('name');
                $this.approvalOper(apStr);
            });
        }
        
        //日志显示
        var logHtml = '<div id="opreatingdataContainer"><div class="showDate">操作日志<span class="iconfont icon-xitongxuankuangxiala"></span></div><table class="approvalTable"  id="opreatingdata"><thead><tr style="background: #EEEEEE;"><th style="width:150px;border-radius: 0">步骤说明</th><th style="width:100px;">操作人</th><th style="width:100px;">状态</th><th style="width:250px;">说明</th><th style="width:100px;border-radius: 0">操作时间</th></tr></thead>';
        for (var adai in $this.xyzApprovalLogAllList) {
            var ada = $this.xyzApprovalLogAllList[adai];
            var stepDetail = ada.stepDetail;
            if(xyzIsNull(stepDetail) && ada.step < 0){
                stepDetail = '发起审核';
            }
            logHtml += '<tr><td>' + stepDetail + '</td><td>' + ada.personNameCn + '</td><td>' + (ada.step == -1 ? '<span style="color:#F19926">发起</span>' :
                ((ada.flagOk == 1) ? '<span style="color: #1EA85A">通过</span>' : '<span style="color: #F27F7F">拒绝</span>'))
                + '</td><td>' + ada.detail + '</td><td>' + ada.addDate + '</td></tr>';
        }
        logHtml += '</table></div>';
        $('#xyzApprovalLogDiv').html(logHtml);
        var n=true;
        $('.showDate').click(function () {
            if(n){
                $('#opreatingdataContainer').css('height',$('#opreatingdata').height() - 0 + 24 +'px');
                $('.showDate span').css('transform','rotate(180deg)');
            }else {
                $('#opreatingdataContainer').css('height','24px');
                $('.showDate span').css('transform','rotate(0)')
            }
            n=!n;
        })
    };
    
    
    this.showApprovalWindow= function () {
        
        var scode = $this.xyzApprovalParam.scode;
        var yType = $this.xyzApprovalParam.yType;
        var yKey = $this.xyzApprovalParam.yKey;
        var title = $this.xyzApprovalParam.title;
        
        title = !title?($this.xyzApprovalYTypeNameCn + '【' + yKey + '】审核'):title;
        
        var html = '<div id="xyzApprovalBeforeDiv"></div><div id="xyzApprovalMainDiv"></div><div id="xyzApprovalLogDiv"></div>';
        
        $this.xyzApprovalMainWindow = new approvalWindow({
            title: title,
            content: html,
            width: 1000, //宽
            height: 700, //高
            canvasClose: false, //背景关闭功能禁用
            btns: [
                {
                    content: '下一步',
                    callback: function () {
                        $this.nextOper();
                    }
                },
                {
                    content: '关闭',
                    callback: function () {
                        $this.close();
                    }
                }
            ]
        });
        
        $this.reloadApprovalWindow();
    }
    
    this.startApprovalOper= function (detail) {
        
        var scode = $this.xyzApprovalParam.scode;
        var yType = $this.xyzApprovalParam.yType;
        var yKey = $this.xyzApprovalParam.yKey;
        
        var formInfoStr = '';
        if($this.onOpen){
        	var formInfoJson = $this.onOpen();
        	var formInfoStr = JSON.stringify(formInfoJson);
        }
        
        xyzAjax({
            url: "../ApprovalPluginWS/startApprovalOper.do",
            data: {
                approval: scode,
                yType: yType,
                yTypeNameCn : $this.xyzApprovalYTypeNameCn,
                yKey: yKey,
                detail: detail,
                formInfo : formInfoStr
            },
            success: function (data) {
                if (data.status == 1) {
                    
                    $this.initApprovalData($this.xyzApprovalParam.scode, $this.xyzApprovalParam.yType, $this.xyzApprovalParam.yKey);
                    $this.reloadApprovalWindow();
                    $this.msgWindow = new approvalWindow({
                        title: '提示',
                        content: '操作成功!',
                        width: 300, //宽
                        height: 200, //高
                        canvasClose: false, //背景关闭功能禁用
                        btns: [
                            {
                                content: '我知道了',
                                callback: function () {
                                	$this.msgWindow.close();
                                }
                            }
                        ]
                    });
                } else {
                	$this.msgWindow = new approvalWindow({
                        title: '错误',
                        content: data.msg,
                        width: 300, //宽
                        height: 200, //高
                        canvasClose: false, //背景关闭功能禁用
                        btns: [
                            {
                                content: '我知道了',
                                callback: function () {
                                	$this.msgWindow.close()
                                }
                            }
                        ]
                    });
                }
                
                if($this.onStartApproval){
                    $this.onStartApproval();
                }
            }
        });
    }
    
    this.approvalOper=function (ap) {
        var yKey = $this.xyzApprovalParam.yKey;
        
        var html = '<table><tr><td>状态</td><td><input class="xyzApprovalCheckFlag" style="opacity: 1;" type="radio" value="1" checked="checked" name="flag"/>通过<input class="xyzApprovalCheckFlag" style="opacity: 1;" type="radio" value="0" name="flag"/>拒绝</td></tr>';
        html += '<tr><td>说明</td><td><textarea style="width:300px;height:100px;" id="xyzApprovalDetailForm"></textarea></td></tr></table>';
        
        var approvalOperWindow = new approvalWindow({
            title: '审核' + $this.xyzApprovalYTypeNameCn + '【' + yKey + '】',
            content: html,
            width: 400, //宽
            height: 300, //高
            canvasClose: false, //背景关闭功能禁用
            btns: [
                {
                    content: '确定',
                    callback: function () {
                        $this.approvalOperSubmit(ap, approvalOperWindow);
                    }
                },
                {
                    content: '取消',
                    callback: function () {
                        approvalOperWindow.close();
                    }
                }
            ]
        });
    }
    
    this.approvalOperSubmit=function (ap, approvalOperWindow) {
        
        var yType = $this.xyzApprovalParam.yType;
        var yKey = $this.xyzApprovalParam.yKey;
        
        var flag = $(".xyzApprovalCheckFlag:checked").val();
        var detail = $("#xyzApprovalDetailForm").val();
        
        xyzAjax({
            url: "../ApprovalPluginWS/approvalOper.do",
            data: {
                approvalProcess: ap,
                approvalDetail : $this.xyzApprovalDetail.numberCode,
                detail: detail,
                flagOk: flag
            },
            success: function (data) {
                if (data.status == 1) {
                    approvalOperWindow.close();
                    $this.initApprovalData($this.xyzApprovalParam.scode, $this.xyzApprovalParam.yType, $this.xyzApprovalParam.yKey);
                    $this.reloadApprovalWindow();
                    $this.msgWindow = new approvalWindow({
                        title: '提示',
                        content: '操作成功!',
                        width: 300, //宽
                        height: 200, //高
                        canvasClose: false, //背景关闭功能禁用
                        btns: [
                            {
                                content: '我知道了',
                                callback: function () {
                                	$this.msgWindow.close();
                                }
                            }
                        ]
                    });
                } else {
                	$this.msgWindow = new approvalWindow({
                        title: '错误',
                        content: data.msg,
                        width: 300, //宽
                        height: 200, //高
                        canvasClose: false, //背景关闭功能禁用
                        btns: [
                            {
                                content: '我知道了',
                                callback: function () {
                                	$this.msgWindow.close()
                                }
                            }
                        ]
                    });
                }
                
                $this.onApproval({
                	
                	formInfo : $this.formInfo,//调起审核的表单信息
                	currentStep : $this.xyzCurrentStep,//当前步骤
                    detail : detail,//本次审核备注
                    flagOk : flag,//本次审核状态
                    status : $this.xyzApprovalStatus,//总状态
                    result : data //审核返回内容
                    
                });
            }
        });
    }
    
    //执行审核完成的后续操作
    this.nextOper=function () {
        
        if ($this.xyzApprovalStatus == 2) {
            $this.xyzApprovalParam.finish();
        } else {
        	$this.msgWindow = new approvalWindow({
                title: '错误',
                content: '该审核还未完成,不能执行下一步操作!',
                width: 300, //宽
                height: 200, //高
                canvasClose: false, //背景关闭功能禁用
                btns: [
                    {
                        content: '我知道了',
                        callback: function () {
                        	$this.msgWindow.close()
                        }
                    }
                ]
            });
        }
    }
    
    this.initApprovalData=function (scode, yType, yKey) {
        
        $this.xyzApprovalData = [];
        $this.xyzApprovalProcessList = [];
        $this.xyzApprovalDetail = {};
        $this.xyzApprovalLogList = [];
        $this.xyzApprovalLogAllList = [];
        
        $this.xyzApprovalStatus = 0; //审批状态 0未开始, 1进行中, 2完成,3=0失败
        $this.xyzCurrentStep = 0; //当前完成到第几步了
        $this.xyzStartApprovalDetail = '';
        
        xyzAjax({
            url: "../ApprovalPluginWS/getApprovalData.do",
            data: {
                scode: scode,
                yType: yType,
                yKey: yKey
            },
            success: function (data) {
                if (data.status == 1) {
                    
                    $this.xyzApprovalData = data.content.approval; //审批数据对象
                    $this.xyzApprovalProcessList = data.content.processList;//审批流程数据集合
                    
                    $this.xyzApprovalDetail = data.content.approvalDetail;//审批业务对象
                    $this.xyzApprovalLogAllList = data.content.approvalLogList;//审批详情数据集合
                    
                    $this.xyzApprovalData = !$this.xyzApprovalData ? {} : $this.xyzApprovalData;
                    $this.xyzApprovalProcessList = !$this.xyzApprovalProcessList ? [] : $this.xyzApprovalProcessList;
                    $this.xyzApprovalLogAllList = !$this.xyzApprovalLogAllList ? [] : $this.xyzApprovalLogAllList;
                    
                    if($this.xyzApprovalDetail){
                    	$this.xyzApprovalStatus = $this.xyzApprovalDetail.currentFlag;
                    	$this.formInfo = $this.xyzApprovalDetail.formInfo;
                    	$this.xyzStartApprovalDetail = $this.xyzApprovalDetail.detail;
                    	$this.xyzCurrentStep = $this.xyzApprovalDetail.currentStep;
                    }
                    
                    if($this.xyzApprovalProcessList){
                    	if($this.xyzApprovalProcessList.length > 0){
                    		$this.flagConfig = true;
                    	}
                    }
                    
                    //把重置的数据排除出去.
                    for (var adai in $this.xyzApprovalLogAllList) {
                        var ada = $this.xyzApprovalLogAllList[adai];
                        if (ada.flagReset == 0) {
                            $this.xyzApprovalLogList[$this.xyzApprovalLogList.length] = ada;
                        }
                    }
                } else {
                	console.error(data.msg);
                    /*$this.msgWindow = new approvalWindow({
                        title: '错误',
                        content: data.msg,
                        width: 300, //宽
                        height: 200, //高
                        canvasClose: false, //背景关闭功能禁用
                        btns: [
                            {
                                content: '我知道了',
                                callback: function () {
                                    $this.msgWindow.close()
                                }
                            }
                        ]
                    });*/
                }
            }
        });
    }
    
    /**
     * 提供到外部 获取 之前的审核表单信息 方法
     */
    this.getFormInfo = function(){
        return $this.formInfo;
    }
    
    /**
     * 关闭主窗口
     */
    this.close = function(){
        
    	//把弹出消息的窗口也关闭掉
    	if($this.msgWindow){
    		$this.msgWindow.close();
    	}
    	
        if($this.onClose){
            $this.onClose();
        }
        
        $this.xyzApprovalMainWindow.close();
    }
    
    //如果使用构造函数实例化 则 自动调用一下初始化
    if(obj){
        $this.xyzInitApprovalPlugin(obj);
    }
};

window.approvalWindow = function (obj) {
    var canvas = document.createElement('div');//创建遮罩层
    var body = document.createElement('div');//创建容器
    var title = document.createElement('div');//创建标题栏
    var content = document.createElement('div');//创建内容
    var insetPoint = document.querySelector('body'); //找到挂载点
    var footer = document.createElement('footer'); //找到挂载点
    var link = document.createElement('a');
    var close = document.createElement('i'); //找到挂载点
    close.className="iconfont icon-tabsClose";
    canvas.className = 'MxNoticeBox';
    body.className = 'MxNoticeBoxbody';
    title.className = 'MxNoticeBoxtitle';
    content.className = 'MxNoticeBoxcontent';
    link.className = 'MxNoticeAttachment';
    if (obj.width) {
        body.style.width = obj.width + "px"
    }
    if (obj.height) {
        body.style.height = obj.height + "px"
    }
    content.innerHTML = obj.content;
    title.innerHTML = obj.title;
    title.appendChild(close);
    body.appendChild(title);
    body.appendChild(content);
    body.appendChild(footer);
    body.appendChild(link);
    if (obj.hasOwnProperty('btns')) {
        obj.btns.forEach(function (e) {
            var confirmBtn = document.createElement('div'); //找到挂载点
            confirmBtn.innerHTML = e.content;
            if (e.hasOwnProperty('callback')) {
                confirmBtn.onclick = e.callback
            }
            footer.appendChild(confirmBtn);
        })
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
        canvas.remove();
        obj.fn && obj.fn(res);
    };
    
    var $this = this;
    canvas.onclick = function () {  //点击取消回调
        if (!(obj.hasOwnProperty('canvasClose') && !obj.canvasClose)) {
            $this.close('close')
        }
    };
    close.onclick=function () {
        $this.close('close')
    };
    
    var css = ".MxNoticeBox {\n" +
        "                  position: fixed;\n" +
        "                  top: 0;\n" +
        "                  left: 0;\n" +
        "                  width: 100%;\n" +
        "                  height: 100vh;\n" +
        "                  background: rgba(0, 0, 0, 0.1);\n" +
        "                  animation: showNoticeBox 0.5s linear;\n" +
        "                  animation-fill-mode: forwards;\n" +
        "                  z-index: 999999;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox .MxNoticeBoxbody {\n" +
        "                  width: 700px;\n" +
        "                  height: 650px;\n" +
        "                  background: #fff;\n" +
        "                  box-shadow: 0 0 5px #999;\n" +
        "                  position: absolute;\n" +
        "                  top: 50%;\n" +
        "                  left: 50%;\n" +
        "                  transform: translate(-50%, -50%);\n" +
        "                  border-radius: 5px;\n" +
        "                  max-width: 100vw;\n" +
        "                  max-height: 100vh;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox .MxNoticeBoxtitle {\n" +
        "                  font-size: 16px;\n" +
        "                  letter-spacing: 3px;\n" +
        // "                  width: calc(100% - 40px);\n" +
        "                  position: relative;\n" +
        // "                  margin-left: 20px;\n" +
        // "                  height: 40px;\n" +
        // "                  line-height: 40px;\n" +
        // "                  border-bottom: 2px solid #3B72A9;\n" +
        // "                  text-align: left;\n" +
        // "                  color: #3B72A8;\n" +
        // "                  margin-top: 10px;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBoxtitle > .icon-tabsClose {\n" +
        "                  position: absolute;\n" +
        "                  color: #fff;\n" +
        "                  right: 0;\n" +
        "                  top: 2px;\n" +
        "                  font-size: 24px;\n" +
        "                  cursor: pointer;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox .MxNoticeBoxcontent {\n" +
        "                  height: calc(100% - 150px);\n" +
        "                  margin-bottom: 10px;\n" +
        "                  overflow-y: auto;\n" +
        "                  padding: 20px\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox .MxNoticeAttachment {\n" +
        "                  position: absolute;\n" +
        "                  color: #3c73a8;\n" +
        "                  text-decoration: underline;\n" +
        "                  bottom: 56px;\n" +
        "                  right: 56px;\n" +
        "                  background: #fff;\n" +
        "                  cursor: pointer;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox footer {\n" +
        "                  text-align: center;\n" +
        "              }\n" +
        "              \n" +
        "              .MxNoticeBox footer > div {\n" +
        "                  display: inline-block;\n" +
        "                  background: #3b72a8;\n" +
        "                  color: #fff;\n" +
        "                  padding: 5px 30px;\n" +
        "                  border-radius: 5px;\n" +
        "                  cursor: pointer;\n" +
        "                  margin-right: 10px\n" +
        "              }\n" +
        "              \n" +
        "              @keyframes showNoticeBox {\n" +
        "                  0% {\n" +
        "                      opacity: 0;\n" +
        "                  }\n" +
        "                  100% {\n" +
        "                      opacity: 1;\n" +
        "                  }\n" +
        "              }\n" +
        "              \n" +
        "              @keyframes hideNoticeBox {\n" +
        "                  0% {\n" +
        "                      opacity: 1;\n" +
        "                  }\n" +
        "                  100% {\n" +
        "                      opacity: 0;\n" +
        "                  }\n" +
        "              }\n" +
        "              \n" +
        "              #txt {\n" +
        "                  width: 100%;\n" +
        "                  height: 88px;\n" +
        "                  border-radius: 5px;\n" +
        "                  background: #F4F5F7;\n" +
        "              }\n" +
        "              #txt textarea {\n" +
        "                  width: 850px;\n" +
        "                  border: none;\n" +
        "                  margin-top: 9px;\n" +
        "                  background: #F4F5F7;\n" +
        "                  resize: none;\n" +
        "                  height: 70px;\n" +
        "                  padding: 10px;\n" +
        "                  box-sizing: border-box;\n" +
        "                  border-right: 1px solid #E0E0E0;\n" +
        "                  color: #555;max-width: calc(100vw - 117px);\n" +
        "              }\n" +
        "              \n" +
        "              .statusBtn, #approvalOperBtn {\n" +
        "                  display: inline-block;\n" +
        "                  padding: 0 10px;\n" +
        "                  height: 24px;\n" +
        "                  line-height: 24px;\n" +
        "                  color: #fff;\n" +
        "                  border-radius: 5px;\n" +
        "                  white-space: nowrap;\n" +
        "              }\n" +
        "              \n" +
        "              #approvalOperBtn {\n" +
        "                  text-decoration: none;\n" +
        "                  background: #3c73a8;\n" +
        "              }\n" +
        "              \n" +
        "              .fqbtn {\n" +
        "                  background: #3c73a8;\n" +
        "              }\n" +
        "              \n" +
        "              .fqbtn a {\n" +
        "                  color: #fff;\n" +
        "                  text-decoration: none;\n" +
        "              }\n" +
        "              \n" +
        "              .shzbtn {\n" +
        "                  background: #F19926;\n" +
        "              }\n" +
        "              \n" +
        "              .ytgbtn {\n" +
        "                  background: #1EA85A;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable {\n" +
        "                  border-spacing: 0;\n" +
        "                  overflow: hidden;\n" +
        "                  width: 100%;\n" +
        "                  color: #555;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable td {\n" +
        "                  font-size: 12px;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable th {\n" +
        "                  font-weight: 400;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable td:not(:last-child) {\n" +
        "                  border: 1px solid #E0E0E0;\n" +
        "                  border-top: none;\n" +
        "                  border-right: none;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr td:last-child {\n" +
        "                  border: 1px solid #E0E0E0;\n" +
        "                  border-top: none;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr:first-child th {\n" +
        "                  padding: 10px;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr:first-child th {\n" +
        "                  border: 1px solid #B6CBD1;\n" +
        "              }\n" +
        "              \n" +
        "              #opreatingdata tr:first-child th {\n" +
        "                  border: 1px solid #E0E0E0;\n" +
        "              }\n" +
        "        \n" +
        "              .approvalTable:nth-child(2) tr:first-child th {\n" +
        "                  border: 1px solid #E0E0E0;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable td {\n" +
        "                  padding: 10px;\n" +
        "                  text-align: center;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr:first-child th:not(:last-child) {\n" +
        "                  border-right: none;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable th:first-child {\n" +
        "                  border-radius: 5px 0 0 0;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable th:last-child {\n" +
        "                  border-radius: 0 5px 0 0;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr:last-child td:first-child {\n" +
        "                  border-radius: 0 0 0 5px;\n" +
        "              }\n" +
        "              \n" +
        "              .approvalTable tr:last-child td:last-child {\n" +
        "                  border-radius: 0 0 5px 0;\n" +
        "              }\n" +
        "        \n" +
        "              #opreatingdata tr td:first-child{\n" +
        "                  border-left: none;\n" +
        "              }\n" +
        "              #opreatingdata tr th:first-child{\n" +
        "                  border-left: none;\n" +
        "              }\n" +
        "              .showDate {\n" +
        "                  border-radius: 5px 5px 0 0;\n" +
        "                  color: #555;\n" +
        "                  position: relative;\n" +
        "                  cursor: pointer;\n" +
        "                  height: 24px;\n" +
        "                  line-height: 24px;\n" +
        "                  padding: 0 10px;\n" +
        "              }\n" +
        "              #opreatingdata th{\n" +
        "                  border-right: none!important;\n" +
        "              }\n" +
        "              #opreatingdata tr td:last-child{\n" +
        "                  border-right: none!important;\n" +
        "              }\n" +
        "              #opreatingdata tr:last-child td{\n" +
        "                  border-bottom: none!important;\n" +
        "              }\n" +
        "              .showDate span {\n" +
        "                  position: absolute;\n" +
        "                  right: 10px;\n" +
        "                  /*transform: rotate(180deg);*/\n" +
        "                  font-size: 22px;\n" +
        "                  transition: all 0.5s;\n" +
        "              }\n" +
        "              \n" +
        "              #opreatingdataContainer {\n" +
        "                  margin-top: 20px;\n" +
        "                  height: 24px;\n" +
        "                  transition: all 1s;\n" +
        "                  overflow: hidden;\n" +
        "                  border: 1px solid #E0E0E0;\n" +
        "                  border-radius: 5px\n" +
        "              }\n" +
        "        #fjHtml{\n" +
        "            display: flex;\n" +
        "            border-radius: 5px;\n" +
        "            border: 1px solid #e0e0e0;\n" +
        "            overflow: hidden;\n" +
        "            margin-bottom: 20px;\n" +
        "        }\n" +
        "        #fjHtml>div{\n" +
        "            width: 120px;\n" +
        "            position: relative;\n" +
        "            background: #F4F5F7;\n" +
        "            white-space: nowrap;\n" +
        "        }\n" +
        "        #fjHtml>div>span{\n" +
        "            color: #3b72a8;\n" +
        "            font-size: 14px;\n" +
        "            position: absolute;\n" +
        "            top:50%;\n" +
        "            left: 50%;\n" +
        "            transform: translate(-50%,-50%);\n" +
        "        }\n" +
        "        #fjHtml table{\n" +
        "            width: 100%;\n" +
        "            border-collapse: collapse;\n" +
        "            color: #555;\n" +
        "        }\n" +
        "        #fjHtml table td{\n" +
        "            border: 1px solid #e0e0e0;\n" +
        "            padding: 5px;\n" +
        "        }\n" +
        "        #fjHtml table tr:first-child td{\n" +
        "            border-top:none ;\n" +
        "        }\n" +
        "        #fjHtml table tr:last-child td{\n" +
        "            border-bottom:none ;\n" +
        "        }\n" +
        "        #fjHtml table tr td:last-child{\n" +
        "            border-right:none;\n" +
        "        }";
    
    var cssHtml = '<style>' + css + '</style>';
    $('body').append(cssHtml);
};