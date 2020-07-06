$(document).ready(function(){
	MaytekQ.init({
        id:"onlineDemandManagerAutoId",
        group:{
        	'allQuery' : {
				value : 'allQuery',
				text : '更多',
                data:[
                    {	key: "AIquery",
                        keyLabel: "智能",
                        defaultQuery: "true",
                        options: {
                            data: {prompt:"编号"}
                        },
                        AIMatch: [{key:"numberCode", re:""}]
                    },
                    {
                        key : "numberCode",
                        keyLabel : "编号"
                    },
                    {
                        key : "appId",
                        keyLabel : "系统应用",
                        type:'combobox',
                        defaultQuery: "true",
                        options : {
                            mode:'remote',
                            lazy : false,
                            url : '../ListWS/getSecurityAppInfoList.do',
                            valueField: 'value',
                            textField: 'text'
                        }
                    },
                    {
                        key : "flag",
                        keyLabel : "状态",
                        type:'combobox',
                        defaultQuery: "true",
                        options : {
                            multiple : true,
                            data:[{value: 'yesIsHandle',text: '已处理'},
                            	{value: 'noIsHandle',text: '未处理'},
                            	{value: 'yesCheck',text: '已审核'},
                                {value: 'noCheck',text: '未审核'},
                                {value: 'yesValid',text: '建议'},
                                {value: 'noValid',text: '非建议'},
                                {value: 'yesAccept',text: '已采纳'},
                                {value: 'noAccept',text: '未采纳'},
                                {value: 'yesFlagStart',text: '已开工'},
                                {value: 'noFlagStart',text: '未开工'},
                                {value: 'yesFlagFinish',text: '已完成'},
                                {value: 'noFlagFinish',text: '未完成'},
                                {value: 'yesIsFrozen',text: '已冻结'},
                                {value: 'noIsFrozen',text: '未冻结'}]
                        }
                    },
                    {
                        key : "title",
                        defaultQuery: "true",
                        keyLabel : "标题"
                    },{
                    	key : "content",
                        defaultQuery: "true",
                        keyLabel : "需求"
                    	
                    },{
                        key : "level",
                        keyLabel : "参考价值",
                        type:'combobox',
                        defaultQuery: "true",
                        options : {
                            data : [ {
            					value : '1',
            					text : "★"
            				},{
            					value : '2',
            					text : "★★"
            				},{
            					value : '3',
            					text : "★★★"
            				},{
            					value : '4',
            					text : "★★★★"
            				},{
            					value : '5',
            					text : "★★★★★"
            				}]
                        }
                    },
                    {
                        key : "username",
                        keyLabel : "账号",
                        type:'combobox',
                        options : {
                            mode:'remote',
                            lazy : false,
                            url : '../ListWS/getSecurityUserList.do',
                            valueField: 'value',
                            textField: 'text'
                        }
                    
                    }
                    
                ]
            }
        },
        onQuery:function (data) {
            $("#onlineDemandManagerTable").datagrid('load',{q:data});
        }
    });
	
	initTable();
	$("#onlineDemandQueryButton").click(function(){
		loadTable();
	});
	
});

function loadTable(){
	$("#onlineDemandManagerTable").datagrid("load",{q:MaytekQ.getData('onlineDemandManagerAutoId')});

}

function initTable(){
	
	var toolbar = [];
	
		if(xyzControlButton("buttonCode_s20180710150802")){
			toolbar[toolbar.length]='-';
			toolbar[toolbar.length]={
				text: '修改需求',
				border:'1px solid #bbb',
				iconCls: 'iconfont icon-edit',
				handler: function(){
					editOnlineDemandButton();
				}
			};
		}
		
		if(xyzControlButton("buttonCode_s20180710150802")){
			toolbar[toolbar.length]='-';
			toolbar[toolbar.length]={
				text: '删除需求',
				border:'1px solid #bbb',
				iconCls: 'iconfont icon-remove',
				handler: function(){
					deleteOnlineDemandButton();
				}
			};
		}
	
	xyzgrid({
		table : 'onlineDemandManagerTable',
		url : '../OnlineDemandWS/queryOnlineDemand.do',
		idField : "numberCode",
		toolbar : toolbar,
		nowrap:false,
		columns : [[
			{field:'checkboxTemp',checkbox:true},
			{field:'numberCode',title:'需求编号',align:'center',hidden:true},
			{field:'appNameCn',title:'系统应用',width:200,
		    	formatter : function(value, row, index) {
		    		return xyzGetDiv(value, 0 , 100);
		    	}
		    },
		    {field:'title',title:'标题',width:280,
		    	formatter : function(value, row, index) {
		    		return xyzGetDiv(value, 0 , 100);
		    	}
		    },
		    {field:'isHandle',title:'处理',width:45,align:'center',
		    	formatter : function(value, row, index){
					if(value == 1){
						return "√";
					}else{
						return "×";
					}
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else{
						return "background-color:green";
					}
				}
	 		},
		    {field:'content',title:'需求说明',
		    	formatter : function(value, row, index) {
		    		return xyzGetA('查看详情','showContent',row.numberCode,'点我查看需求详情','');
		    	}
		    },
		    {field:'username',title:'提出者',width:110,
				formatter : function(value, row, index) {
					return xyzGetDiv(value);
			   	}
			},
			{field:'isCheck',title:'审核',align:'center',width:45,
				formatter : function(value, row, index){
					var html = '<span title="'+ row.checkReason +'" style="cursor:pointer;display:block;height:100%;word-wrap:break-word;">';
					if(value == 1){
						html += '√'
					}else{
						html += '×'
					}
					html += '</span>';
					return html;
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else if(value == 1){
						return "background-color:green";
					}else {
						return "background-color:yellow";
					}
				}
		    },
			{field:'level',title:'参考价值',
				formatter : function(value, row, index){
					var text = '';
					for(var i = 1; i <= value; i++){
						text += '★';
					}
					return text;
				}
		    },
		    {field:'flagValid',title:'好建议',align:'center',width:45,
				formatter : function(value, row, index){
					var html = '<span title="'+ row.validReason +'" style="cursor:pointer;display:block;height:100%;word-wrap:break-word;">';
					if(value == 1){
						html += '√'
					}else{
						html += '×'
					}
					html += '</span>';
					return html;
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else if(value == 1){
						return "background-color:green";
					}else {
						return "background-color:yellow";
					}
				}
		    },
		    {field:'rebateValidAmount',title:'奖励积分1',align:'right'},
		    {field:'flagAccept',title:'采纳',align:'center',width:45,
		    	formatter : function(value, row, index){
		    		var html = '<span title="'+ row.acceptReason +'" style="cursor:pointer;display:block;height:100%;word-wrap:break-word;">';
					if(value == 1){
						html += '√';
					}else{
						html += '×';
					}
					html += '</span>';
					return html;
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else if(value == 1){
						return "background-color:green";
					}else {
						return "background-color:yellow";
					}
				}
		    },
		    {field:'rebateAcceptAmount',title:'奖励积分2',align:'right'},
		    {field:'flagStart',title:'开工',align:'center',width:45,
		    	formatter : function(value, row, index){
					if(value == 1){
						return "√";
					}else{
						return "×";
					}
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else{
						return "background-color:green";
					}
				}
		    }, 
		    {field:'startDate',title:'开工时',width:90,
		    	formatter : function(value, row, index) {
		    		return xyzGetDivDate(value, 0 , 16);
		    	}
		    },
		    {field:'flagFinish',title:'完成',align:'center',width:45,
		    	formatter : function(value, row, index){
					if(value == 1){
						return "√";
					}else{
						return "×";
					}
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else{
						return "background-color:green";
					}
				}
		    },
		    {field:'finishDate',title:'完成时',width:90,  
		    	formatter : function(value, row, index) {
		    		return xyzGetDivDate(value, 0 , 16);
		    	}
		    },
		    {field:'isFrozen',title:'冻结',width:44,align:'center',width:45,
	 			formatter : function(value, row, index){
					if(value == 1){
						return "√";
					}else{
						return "×";
					}
				},
				styler:function(value, row, index) {
					if(value == 0) {
						return "background-color:red";
					}else{
						return "background-color:green";
					}
				}
	 		},
		    {field:'addDate',title:'创建时',width:90,
		    	formatter : function(value, row, index) {
		    		return xyzGetDivDate(value, 0 , 100);
		    	}
		    },
		    {field:'alterDate',title:'修改时',width:90,
		    	formatter : function(value, row, index) {
		    		return xyzGetDivDate(value, 0 , 100);
		    	}
		    }
		]],
		queryParams: {q:MaytekQ.getData('onlineDemandManagerAutoId')},
		onSelect : function(rowIndex, rowData) {
			var _numberCode = rowData.numberCode;
			setDemandRemark(_numberCode, rowData.isFrozen);
		}
	});
}

function addOnlineDemandButton(){

	xyzdialog({
		dialog : 'dialogFormDiv_addOnlineDemandButton',
		title : '新增需求',
	    href : '../jsp_onlineDemand/addOnlineDemand.html',
	    fit : true,
	    buttons:[{
			text:'确定',
			handler:function(){
				addOnlineDemandSubmit();
			}
		},{
			text:'取消',
			handler:function(){
				$("#dialogFormDiv_addOnlineDemandButton").dialog("destroy");
			}
		}],
		onLoad : function() {
			xyzCombobox({
				combobox:'appIdForm',
				limitToList : true,
				url : '../ListWS/getSecurityAppInfoList.do',
				mode: 'remote',
				lazy : false
			});
			
			
			$("#titleForm").textbox({
				required : true
			});
			MxEditor.init('contentForm' ,function (data) {
				if (!data.status || data.status != 1) {
					top.$.messager.alert("提示", data.msg, "msg");
				}
			});
		}
	});
}

function addOnlineDemandSubmit(){
	
	if(!$("form").form('validate')) {
		return false;
	}
	
	var title = $("#titleForm").val();
	var content = MxEditor.getValue('contentForm');
	var appId = $("#appIdForm").combobox('getValue');
	
	xyzAjax({
		url : "../OnlineDemandWS/addOnlineDemand.do",
		data : {
			title : title,
			content : content,
			appId : appId
		},
		success : function(data) {
			if(data.status==1){
				$("#dialogFormDiv_addOnlineDemandButton").dialog("destroy");
				$("#onlineDemandManagerTable").datagrid("reload");
				top.$.messager.alert("提示", "操作成功!", "info");
			}else{
				top.$.messager.alert("警告",data.msg,"warning");
			}
		}
	});
}

function editOnlineDemandButton(){

	var onlineDemand = $("#onlineDemandManagerTable").datagrid("getChecked");
	if(onlineDemand.length != 1){
		top.$.messager.alert("提示", "请先选中单个对象!", "info");
		return false;
	}
	var row = onlineDemand[0];

	if(top.currentUserUsername != row.username){
		top.$.messager.alert("提示", "只能编辑自己的数据!", "info");
		return false;
	}
	if(row.flagValid == 1){
		top.$.messager.alert("提示", "该需求已被审核!", "info");
		return false;
	}
	xyzdialog({
		dialog : 'dialogFormDiv_editOnlineDemandButton',
		title : '编辑需求',
	    href : '../jsp_onlineDemand/editOnlineDemand.html',
	    fit : true,
	    buttons:[{
			text:'确定',
			handler:function(){
				editOnlineDemandSubmit(row.numberCode);
			}
		},{
			text:'取消',
			handler:function(){
				$("#dialogFormDiv_editOnlineDemandButton").dialog("destroy");
			}
		}],
		onLoad : function() {
			var content = xyzHtmlDecode(row.content);
			$("#titleForm").textbox({
				required : true
			});
			
			MxEditor.init('contentForm' ,function (data) {
				if (!data.status || data.status != 1) {
					top.$.messager.alert("提示", data.msg, "msg");
				}
			});
			MxEditor.setValue('contentForm' ,content);
			$("#titleForm").textbox('setValue', row.title)
			
			xyzCombobox({
				combobox:'appIdForm',
				limitToList : true,
				url : '../ListWS/getSecurityAppInfoList.do',
				mode: 'remote',
				lazy : false
			});
			
			$("#appIdForm").combobox('setValue',row.appId);
		}
	});
}

function editOnlineDemandSubmit(numberCode){
	
	if(!$("form").form('validate')) {
		return false;
	}
	
	var title = $("#titleForm").val();
	var content = MxEditor.getValue('contentForm');	
	var appId = $("#appIdForm").combobox('getValue');
	
	xyzAjax({
		url : "../OnlineDemandWS/editOnlineDemand.do",
		data : {
			numberCode:numberCode,
			title:title,
			appId : appId,
			content : content
		},
		success : function(data) {
			if(data.status==1){
				$("#dialogFormDiv_editOnlineDemandButton").dialog("destroy");
				$("#onlineDemandManagerTable").datagrid("reload");
				top.$.messager.alert("提示", "操作成功!", "info");
			}else{
				top.$.messager.alert("警告",data.msg,"warning");
			}
		}
	});
}

function deleteOnlineDemandButton(){
	var onlineDemand = $("#onlineDemandManagerTable").datagrid("getChecked");
	if(onlineDemand.length != 1){
		top.$.messager.alert("提示", "请先选中单个对象!", "info");
		return false;
	}
	var row = onlineDemand[0];

	if(top.currentUserUsername != row.username){
		top.$.messager.alert("提示", "只能编辑自己的数据!", "info");
		return false;
	}
	
	if(row.flagValid == 1){
		top.$.messager.alert("提示", "该需求已被审核!", "info");
		return false;
	}
	
	var numberCode = row.numberCode;

	if(!confirm("彻底删除选中的记录，确定？")){
		return;
	}
	
	xyzAjax({
		url : "../OnlineDemandWS/deleteOnlineDemand.do",
		data : {
			numberCode : numberCode
		},
		success : function(data) {
			if(data.status == 1){
				$("#onlineDemandManagerTable").datagrid("reload");
				top.$.messager.alert("提示", "操作成功!", "info");
			}else{
				top.$.messager.alert("警告",data.msg,"warning");
			}
			
		}
	});
}
function showContent(numberCode){
	var rows = $("#onlineDemandManagerTable").datagrid("uncheckAll").datagrid("selectRecord" ,numberCode).datagrid("getChecked");
	var row = rows[0];
	
	var html = row.content;
	html = xyzHtmlDecode(html);
	
	xyzdialog({
		dialog : 'dialogFormDiv_showContent',
		title : '需求详情',
	    content : html,
	    fit : false,
	    width : 600,
	    height : 800,
	    buttons:[{
			text:'关闭',
			handler:function(){
				$("#dialogFormDiv_showContent").dialog("destroy");
			}
		}]
	});
}

function setDemandRemark(numberCode, isFrozen){
	
	var orderCoreRemarkTopDiv = '<input type="hidden" id="customerDemandTop"/>';
	orderCoreRemarkTopDiv += '<div><span id="demandRemarkTop" style="line-height: 18px;word-spacing: 10px;"></span></div>';
	orderCoreRemarkTopDiv += '<div style="margin-left: 3px;">';
	if(isFrozen == 0){
		orderCoreRemarkTopDiv += '<textarea style="width: 150px" id="demandRemarkNewTop" rows="5" cols="12" class="easyui-validatebox" data-options="required:true,validType:\'length[0,1000]\'"></textarea>';
		orderCoreRemarkTopDiv += '</div>';
		orderCoreRemarkTopDiv += '<div style="margin-left: 3px;"><span style="margin-top:0;" class="orderNum" id="demandRemarkNum"></span></div>';
		orderCoreRemarkTopDiv += '<a href="#" class="remark-btn" onclick="addDemandRemark(\'0\');">提交新增备注</a>'; 
	}else{
		orderCoreRemarkTopDiv += '<div style="margin-left: 3px;"><span style="margin-top:0;" class="orderNum" id="demandRemarkNum"></span></div>';
	}
	top.$('#remarkTop').html(orderCoreRemarkTopDiv);
	var result = "";
	
	xyzAjax({
		url : "../DemandRemarkWS/queryDemandRemarkList.do",
		data : {
			customerDemand : numberCode
		},
		success : function(data) {
			if(data.status==1){
				result = data.content;
				
				if(xyzIsNull(result)){
					top.$("#demandRemarkTop").html("");
				}else{
					var remarkHtml = "";
					for(var i = 0;i < result.length; i++){
						var temp = result[i];
						if(temp.content != ''){
		                    remarkHtml += '<span class="remark-span" style="word-wrap:break-word;" title="操作人:'+temp.userName+', 操作时间:'+temp.addDate+'">'+temp.content+'</span><br/>';
		                }
					}
					top.$("#demandRemarkTop").html(remarkHtml);
			    }
			}else{
				top.$.messager.alert("警告",data.msg,"warning");
			}
		}
	});
	top.$("customerDemandTop").val(numberCode);
	top.$("#demandRemarkNum").html(numberCode);
	
}
