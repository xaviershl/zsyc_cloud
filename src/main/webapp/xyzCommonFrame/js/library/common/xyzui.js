/***
*
*xyzuiCombobox组件
*v20160420
*修复combobox下拉层宽度问题
*1、初始化组件
*$("#id").xyzuiCombobox({
	valueField:'value',//对应需要翻译的value（与数据中的字段名对应）
	textField:'text',//对应需要翻译的text（与数据中的字段名对应）
	editable:true,//是否允许input可输入
	disabled:false,//是否禁用（禁用优先级高于editable）
	placeholder:'请选择',
	data:[{value:"myValue1",text:"myText1"},{value:"myValue2",text:"myText2"},{value:"myValue3",text:"myText3"}],//数据必须是json对象数组
	onSelect:function(id, itemObject){//当被选中时需要额外做的处理
		alert(JSON.stringify("控件id="+id+";;;item="+itemObject));
	},
	onBlur:function(id, text){//控件中的input框失去焦点后触发，返回input框中显示的文本。（注意：onBlur在editable=false时不被触发）
		alert("控件id="+id+";;;text="+text);
	}
});
*2、取值
*$("#id").xyzuiCombobox('getValue');
*3、取输入框中显示的内容
*$("#id").xyzuiCombobox('getText');
*4、赋值：有匹配的值将被选中
*$("#id").xyzuiCombobox('setValue');
*5、赋文本：将添加到文本框（有匹配文本的将被选中）
*$("#id").xyzuiCombobox('setText');
*6、重新加载数据（覆盖）
*$("#id").xyzuiCombobox('loadData',[{value:"myValue1",text:"myText1"},{value:"myValue2",text:"myText2"},{value:"myValue3",text:"myText3"}]);
*7、追加数据（在末尾追加）
*$("#id").xyzuiCombobox('appendData',[{value:"myValue1",text:"myText1"},{value:"myValue2",text:"myText2"},{value:"myValue3",text:"myText3"}]);
*8、设置是否禁用组件
*$('#id').xyzuiCombobox('setDisabled',true);
*9、设置组件input框是否允许编辑
*$('#id').xyzuiCombobox('setEditable',false);
*
**/
(function($){
	function isNull(obj){
		if(obj==undefined || obj==null || (obj+"".trim())==="" ||  (obj+"".trim())===''){
			return true;
		}else{
			return false;
		}
	}
	function findMaxZindex(selector){
		var arr = $(selector);
		var max = 0;
		for(var i=0;i<arr.length;i++){
			var zindex = $(arr[i]).css("z-index");
			zindex = isNaN(zindex)?-1:zindex;
			if(zindex>max){
				max = zindex;
			}
		}
		return max;
	}
	function insertStyle(css){
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		if(style.styleSheet){
			style.styleSheet.cssText = css;
		}else{
			style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	}
	var combobox = {};
	combobox.css = '.xyzui-dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:60px;padding:5px 0;margin:0 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-top:0;height:200px;overflow:auto;overFlow-x:hidden}.xyzui-dropdown-menu-right{right:0;left:auto}.xyzui-combobox-item{font-size:14px;padding:3px;padding-right:0;text-align:left}.xyzui-combobox-item-hover{background-color:#e6e6e6;color:#00438a}.xyzui-combobox-item-selected{background-color:#0081c2;color:#fff}';
	//combobox默认配置
	combobox.DEFAULT = {
		multiple:false,
		editable:true,
		disabled:false,
		valueField:'value',
		textField:'text',
		placeholder:''
	};
	//插入combobox的css
	insertStyle(combobox.css);
	//点击combobox控件以外任意位置隐藏所有combobox的item区域
	$(document).on('mousedown',function(ev){
		if($(ev.target).closest('div[xyzui="combobox"]').length==0){
			$('div[id^="xyzui_combobox_itemcontianer_"]').css('display','none');
		}
	});
	//检查容器是否已经纯在了
	combobox.checkContianer = function (id){
		return $('#xyzui_combobox_btn_'+id).next().attr('id')==('xyzui_combobox_itemcontianer_'+id);
	};
	//初始化绘制combobox
	combobox.init = function (config){
		var ph = ('placeholder' in config)?('placeholder="'+config.placeholder+'"'):'';
		var html = '<input type="text" class="form-control" id="xyzui_combobox_input_'+config.id+'" '+ph+'/>';
		html+='<div class="input-group-btn">';
		html+='<button type="button" class="btn btn-default dropdown-toggle" id="xyzui_combobox_btn_'+config.id+'" ><span class="caret"></span></button>';
		html+='</div>';
		$('#'+config.id).html(html);
		$('#'+config.id).addClass('input-group');
		$('#'+config.id).attr({
			'isMultiple' : config.multiple,
			'valueField' : config.valueField,
			'textField' : config.textField,
			'xyzui' : 'combobox',
			'editable' : config.editable,
			'isDisabled' : config.disabled
		});
		if(config.disabled){
			combobox['setDisabled'](config.id, true);
		}else{
			if(!config.editable){
				combobox['setEditable'](config.id, false);
			}
		}
		//$('#'+config.id).attr('isMultiple',config.multiple);
		//$('#'+config.id).attr('valueField',config.valueField);
		//$('#'+config.id).attr('textField',config.textField);
		//$('#'+config.id).attr('xyzui','combobox');//添加识别属性
		//$('#'+config.id).attr('editable',config.editable);
		if('onSelect' in config){
			combobox['onSelect_'+config.id]=config.onSelect;
		}
		if('onBlur' in config){
			combobox['onBlur_'+config.id]=config.onBlur;
		}
		$('#xyzui_combobox_input_'+config.id).keyup(function(){
			combobox['inputKeyup'](config.id);
		});
		$('#xyzui_combobox_input_'+config.id).blur(function(){
			var editable = $('#'+config.id).attr('editable');
			editable = (editable=='true'||editable==true)?true:false;
			if(!editable){//不可编辑状态下不触发
				return;
			}
			if(('onBlur_'+config.id) in combobox){
				combobox['onBlur_'+config.id](config.id, combobox['getText'](config.id));
			}
		});
		$('#xyzui_combobox_btn_'+config.id).click(function(){
			combobox['btnClick'](config.id);
		});
		combobox['loadData'](config.id, config.data);
	};
	//输入框输入响应
	combobox.inputKeyup = function(id){
		var editable = $('#'+id).attr('editable');
		editable = (editable=='true'||editable==true)?true:false;
		if(!editable){
			return;
		}
		var multiple = $('#'+id).attr('isMultiple');
		multiple = (multiple=='true'||multiple==true)?true:false;
		var isDisplay = $('#xyzui_combobox_itemcontianer_'+id).css('display');
		if(isDisplay=='none'){
			$('#xyzui_combobox_itemcontianer_'+id).css('display','block');
		}
		var val = $.trim($('#xyzui_combobox_input_'+id).val());
		if(!multiple && val==''){
			$('#xyzui_combobox_itemcontianer_'+id+' >div').css("display","block");
			$('#xyzui_combobox_itemcontianer_'+id+' >div').removeClass('xyzui-combobox-item-selected');
		}else{
			//$('#xyzui_combobox_itemcontianer_'+id+' >div[combobox-search]:contains("'+val+'")').css("display","block");
			//$('#xyzui_combobox_itemcontianer_'+id+' >div[combobox-search]:not(:contains("'+val+'"))').css("display","none");
			$.each($('#xyzui_combobox_itemcontianer_'+id+' >div'),function(i, n){
				var item = $(n);
				if(item.attr('combobox-search').indexOf(val)>-1){
					item.css("display","block");
				}else{
					item.css("display","none");
				}
			});
		}
	};
	//右侧箭头按钮点击事件
	combobox.btnClick = function (id){
		var isDisplay = $('#xyzui_combobox_itemcontianer_'+id).css('display');
		if(isDisplay=='block'){
			$('#xyzui_combobox_itemcontianer_'+id).css('display','none');
		}else if(isDisplay=='none'){
			var maxZindex = findMaxZindex('div[id^="xyzui_combobox_itemcontianer_"]');
			var version = $.browser.version;
			var width = parseInt($('#'+id).css('width'));
			//IE9特殊处理
			if($.browser.msie==true && version=="9.0" && $('#xyzui_combobox_itemcontianer_'+id+" div").length>5){
				width += 17;
			}
			$('#xyzui_combobox_itemcontianer_'+id).css('width',width);
			$('#xyzui_combobox_itemcontianer_'+id).css({
				'display':'block',
				'z-index':++maxZindex,
			});
		}
	};
	//item点击事件
	combobox.itemClick = function(id,thiz){
		var multiple = $('#'+id).attr('isMultiple');
		multiple = (multiple=='true'||multiple==true)?true:false;
		if(!multiple){//单选
			$('#xyzui_combobox_itemcontianer_'+id+' >div').removeClass('xyzui-combobox-item-selected');
			$(thiz).addClass('xyzui-combobox-item-selected');
			$('#xyzui_combobox_input_'+id).val($(thiz).text());
			$('#xyzui_combobox_itemcontianer_'+id).css('display','none');
			if(('onSelect_'+id) in combobox){
				var valueField = $('#'+id).attr('valueField');
				var textField = $('#'+id).attr('textField');
				var value = $(thiz).attr('combobox-value');
				var text = $(thiz).text();
				var d = {};
				if(value!=undefined){
					d[valueField]=value;
				}
				d[textField]=text;
				combobox['onSelect_'+id](id, d);
			}
			return;
		}
		var c = $(thiz).attr('class');
		if(c.indexOf('xyzui-combobox-item-selected')>-1){
			$(thiz).removeClass('xyzui-combobox-item-selected');
			var array = [];
			$.each($('#xyzui_combobox_itemcontianer_'+id+' >div[class*="xyzui-combobox-item-selected"]'),function(i, n){
				array[array.length]=$(n).text();
			});
			$('#xyzui_combobox_input_'+id).val(array.join(','));
		}else{
			$(thiz).addClass('xyzui-combobox-item-selected');
			var array = [];
			$.each($('#xyzui_combobox_itemcontianer_'+id+' >div[class*="xyzui-combobox-item-selected"]'),function(i, n){
				array[array.length]=$(n).text();
			});
			$('#xyzui_combobox_input_'+id).val(array.join(','));
			if(('onSelect_'+id) in combobox){
				var valueField = $('#'+id).attr('valueField');
				var textField = $('#'+id).attr('textField');
				var value = $(thiz).attr('combobox-value');
				var text = $(thiz).text();
				var d = {};
				if(value!=undefined){
					d[valueField]=value;
				}
				d[textField]=text;
				combobox['onSelect_'+id](id, d);
			}
		}
	};
	//创建item容器
	combobox.createContianer = function(id){
		$('#xyzui_combobox_btn_'+id).after('<div class="xyzui-dropdown-menu xyzui-dropdown-menu-right" id="xyzui_combobox_itemcontianer_'+id+'"></div>');
	};
	//初始化加载数据
	combobox.loadData = function (id, data){
		if(!combobox.checkContianer(id)){
			combobox.createContianer(id);
		}
		var multiple = $('#'+id).attr('isMultiple');
		multiple = (multiple=='true'||multiple==true)?true:false;
		var valueField = $('#'+id).attr('valueField');
		var textField = $('#'+id).attr('textField');
		var len = data.length;
		var items = '';
		for(var i=0;i<len;i++){
			var o = data[i];
			var html = '<div class="xyzui-combobox-item" ';
			if(valueField in o){
				html+='combobox-value="'+o[valueField]+'"';
			}
			if((typeof xyzToPinyin)==='function'){
				var py = xyzToPinyin(o[textField]);
				html+=' combobox-search="'+((o[textField]==py)?o[textField]:(o[textField]+py))+'" title="'+o[textField]+'" ';
			}else{
				html+=' combobox-search="'+o[textField]+'" title="'+o[textField]+'" ';
			}
			html+='>';
			if(textField in o){
				html+=o[textField];
			}
			html+='</div>';
			items+=html;
		}
		$('#xyzui_combobox_itemcontianer_'+id).html(items);
		$('#xyzui_combobox_itemcontianer_'+id+' >div').hover(
			function(){
				$(this).addClass('xyzui-combobox-item-hover');
			},
			function(){
				$(this).removeClass('xyzui-combobox-item-hover');
			}
		);
		$('#xyzui_combobox_itemcontianer_'+id+' >div').click(function(){
			combobox['itemClick'](id, this);
		});
	};
	//在末尾追加item
	combobox.appendData = function (id, data){
		if(!combobox.checkContianer(id)){
			combobox.createContianer(id);
		}
		var multiple = $('#'+id).attr('isMultiple');
		multiple = (multiple=='true'||multiple==true)?true:false;
		var valueField = $('#'+id).attr('valueField');
		var textField = $('#'+id).attr('textField');
		var len = data.length;
		for(var i=0;i<len;i++){
			var o = data[i];
			var html = '<div class="xyzui-combobox-item" ';
			if(valueField in o){
				html+='combobox-value="'+o[valueField]+'"';
			}
			if((typeof xyzToPinyin)==='function'){
				var py = xyzToPinyin(o[textField]);
				html+=' combobox-search="'+((o[textField]==py)?o[textField]:(o[textField]+py))+'" ';
			}else{
				html+=' combobox-search="'+o[textField]+'" ';
			}
			html+='>';
			if(textField in o){
				html+=o[textField];
			}
			html+='</div>';
			$('#xyzui_combobox_itemcontianer_'+id).append(html);
			$('#xyzui_combobox_itemcontianer_'+id+' >div').last().hover(
				function(){
					$(this).addClass('xyzui-combobox-item-hover');
				},
				function(){
					$(this).removeClass('xyzui-combobox-item-hover');
				}
			);
			$('#xyzui_combobox_itemcontianer_'+id+' >div').last().click(function(){
				combobox['itemClick'](id, this);
			});
		}
	};
	//获取当前选中item的值（单选）
	combobox.getValue = function (id){
		return $($('#xyzui_combobox_itemcontianer_'+id+' >div[class*="xyzui-combobox-item-selected"]')[0]).attr('combobox-value');
	};
	//获取当前选中item的值（多选）
	combobox.getValues = function (id){
		var array = [];
		$.each($('#xyzui_combobox_itemcontianer_'+id+' >div[class*="xyzui-combobox-item-selected"]'),function(i, n){
			array[array.length]=$(n).attr('combobox-value');
		});
		return array;
	};
	//获取当前文本框中的值（单选）
	combobox.getText = function (id){
		return $('#xyzui_combobox_input_'+id).val();
	};
	//获取当前文本框中的值（单选）
	combobox.getTexts = function (id){
		return combobox['getText'](id);
	};
	//设置默认选中值（单选：值匹配）
	combobox.setValue = function(id,value){
		$('#xyzui_combobox_itemcontianer_'+id+' >div').removeClass('xyzui-combobox-item-selected');
		$('#xyzui_combobox_itemcontianer_'+id+' >div[combobox-value="'+value+'"]').first().click();
		var v = $('#xyzui_combobox_itemcontianer_'+id+' >div[combobox-value="'+value+'"]').first().text();
		$('#xyzui_combobox_input_'+id).val(v);
	};
	//设置默认选中值（单选：文本匹配）
	combobox.setText = function(id,text){
		$('#xyzui_combobox_itemcontianer_'+id+' >div').removeClass('xyzui-combobox-item-selected');
		$('#xyzui_combobox_itemcontianer_'+id+' >div:contains("'+text+'")').first().addClass('xyzui-combobox-item-selected');
		$('#xyzui_combobox_input_'+id).val(text);
	};
	//设置禁用属性
	combobox.setDisabled = function(id, disable){
		if(disable){
			$('#xyzui_combobox_input_'+id).attr("readonly","readonly");
			$('#xyzui_combobox_btn_'+id).attr("disabled","disabled");
			$('#'+id).attr('editable', false);
		}else{
			$('#xyzui_combobox_input_'+id).removeAttr("readonly");
			$('#xyzui_combobox_btn_'+id).removeAttr("disabled");
			$('#'+id).attr('editable', true);
		}
		$('#'+id).attr('isDisabled', disable);
	};
	//设置输入框可编辑属性
	combobox.setEditable = function(id, editable){
		if(!editable){
			$('#xyzui_combobox_input_'+id).attr("readonly","readonly");
			$('#'+id).attr('editable', false);
		}else{
			var disabled = $('#'+id).attr('isDisabled');
			if(disabled=='true' || disabled==true){
				$('#'+id).attr('editable', false);;
			}else{
				$('#xyzui_combobox_input_'+id).removeAttr("readonly");
				$('#'+id).attr('editable', true);
			}
		}
	};
	//获取控件所有item数据
	combobox.getData = function(id){
		var array = [];
		var valueField = $('#'+id).attr('valueField');
		var textField = $('#'+id).attr('textField');
		var items = $('#xyzui_combobox_itemcontianer_'+id+' >div');
		var len = items.length;
		for(var i=0;i<len;i++){
			var div = $(items[i]);
			var value = div.attr('combobox-value');
			var text = div.text();
			var d = {};
			if(value!=undefined){
				d[valueField]=value;
			}
			d[textField]=text;
			array[array.length]=d;
		}
		return array;
	};
	//扩展到jQuery
	$.fn.xyzuiCombobox=function(param1,param2){
		for(var i=0;i<this.length;i++){
			var id = $(this[i]).attr('id');
			if(!isNull(id)){
				if(param1==undefined){
					var config = {
						id:id,
						multiple:false,
						editable:combobox.DEFAULT.editable,
						disabled:combobox.DEFAULT.disabled,
						valueField:combobox.DEFAULT.valueField,
						textField:combobox.DEFAULT.textField,
						data:[]
					};
					combobox['init'](config);
				}else if((typeof param1)==='string'){
					return combobox[param1](id,param2);
				}else if(param1 instanceof Object){
					var config = {
						id:id,
						multiple:combobox.DEFAULT.multiple,
						editable:('editable' in param1)?param1.editable:combobox.DEFAULT.editable,
						disabled:('disabled' in param1)?param1.disabled:combobox.DEFAULT.disabled,
						valueField:('valueField' in param1)?param1.valueField:combobox.DEFAULT.valueField,
						textField:('textField' in param1)?param1.textField:combobox.DEFAULT.textField,
						placeholder:('placeholder' in param1)?param1.placeholder:combobox.DEFAULT.placeholder,
						data:('data' in param1)?param1.data:[]
					};
					if('onSelect' in param1){
						config['onSelect'] = param1.onSelect;
					}
					if('onBlur' in param1){
						config['onBlur'] = param1.onBlur;
					}
					combobox['init'](config);
				}
			}
		}
	};
})(jQuery);

Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt)){
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o){
		if (new RegExp("(" + k + ")").test(fmt)){
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
};

/***
*
*xyzuiDatebox日期组件
*xyzuiDatebox依赖bootstrap-datepicker.js
*v20151013

1、初始化 （这里是全配置，使用时根据自己情况初始化）
$('#id').xyzuiDatebox({
	format:'yyyy-MM-dd', //日期格式 （默认yyyy-MM-dd）
	current:'2015-10-15', //初始化时赋一个初始值 （默认为空）
	editable:true,//是否允许input可输入
	disabled:false,//是否禁用（禁用优先级高于editable）
	onSelect:function(id, date){ //当用户点选某个日期时触发 （参数为Date类型）
		alert('控件id='+id+'你选中了'+date);
	},
	validator:function(date){ //禁选匹配 return true;//不可选  return false;//正常可选 （注意：被禁选的日期即使强制赋值('setValue')也是无效的）
		（参数为Date类型）
		return (date.valueOf() < new Date().valueOf()-86400000) || (date.valueOf() > new Date().valueOf()+864000000);
	}
});
2、取值 
$('#id').xyzuiDatebox('getValue');//return String
3、赋值
$('#id').xyzuiDatebox('setValue', '2015-10-15');//参数为日期字符串类型（不支持Date类型）
4、设置控件是否禁用
$('#id').xyzuiDatebox('setDisabled',false);
5、设置控件是否允许input框可编辑
$('#id').xyzuiDatebox('setEditable',false);
*
**/
(function($){
	function isNull(obj){
		if(obj==undefined || obj==null || (obj+"".trim())==="" ||  (obj+"".trim())===''){
			return true;
		}else{
			return false;
		}
	}
	function findMaxZindex(selector){
		var arr = $(selector);
		var max = 0;
		for(var i=0;i<arr.length;i++){
			var zindex = $(arr[i]).css("z-index");
			zindex = isNaN(zindex)?-1:zindex;
			if(zindex>max){
				max = zindex;
			}
		}
		return max;
	}
	function insertStyle(css){
		var head = document.getElementsByTagName('head')[0];
		var style = document.createElement('style');
		style.type = 'text/css';
		if(style.styleSheet){
			style.styleSheet.cssText = css;
		}else{
			style.appendChild(document.createTextNode(css));
		}
		head.appendChild(style);
	}

	//点击非datebox区域隐藏所有打开的datebox
	$(document).on('mousedown', function(ev){
		if ($(ev.target).closest('div[xyzui="datebox_container"]').length == 0) {
			var dp = $('div[xyzui="datebox"]');
			if(dp!=undefined && dp.length>0){
				$('div[xyzui="datebox"]').datepicker('hide');
			}
		}
	});
	//宿主对象
	var datebox = {};
//	insertStyle('.datepicker{top:0;left:0;border-radius:0;background:#fff;-webkit-box-shadow:0 0 10px #ccc;box-shadow:0 0 10px #ccc;padding-bottom:10px;width:238px;color:#555;display:none}.am-datepicker{top:0;left:0;border-radius:0;background:#fff;-webkit-box-shadow:0 0 10px #ccc;box-shadow:0 0 10px #ccc;padding-bottom:10px;margin-top:10px;width:238px;color:#555;display:none}.datepicker>div{display:none}.datepicker table{width:100%;margin:0}.datepicker td,.datepicker th{text-align:center;font-weight:400;cursor:pointer}.datepicker th{height:48px}.datepicker td{font-size:1.4rem}.datepicker td.day{height:34px;width:34px}.datepicker td.day:hover{background:#F0F0F0;height:34px;width:34px}.datepicker td.day.disabled{cursor:no-drop;color:#999;background:#fafafa}.datepicker tr.header,.datepicker tr.header:hover{font-size:1.6rem;color:#fff;background:#3bb4f2}.datepicker td.new,.datepicker td.old{color:#89d7ff}.datepicker td.active,.datepicker td.active:hover{border-radius:0;color:#0084c7;background:#F0F0F0}.datepicker td span{display:block;width:69px;height:40px;line-height:40px;float:left;cursor:pointer}.datepicker td span:hover{background:#F0F0F0}.datepicker td span.active{color:#0084c7;background:#F0F0F0}.datepicker td span.disabled{cursor:no-drop;color:#999;background:#fafafa}.datepicker td span.old{color:#89d7ff}.datepicker .dow{height:40px;color:#0c80ba;font-weight:700}.datepicker th.switch{width:145px}.datepicker th.next,.datepicker th.prev{font-size:21px}.datepicker thead tr:first-child th{cursor:pointer}.input-append.date .add-on i,.input-prepend.date .add-on i{display:block;cursor:pointer;width:16px;height:16px}');
	insertStyle('.datepicker{top:0;left:0;border-radius:0;background:#fff;-webkit-box-shadow:0 0 10px #ccc;box-shadow:0 0 10px #ccc;padding-bottom:10px;width:238px;color:#555;display:none}.xyzui-dropdown-menu-datebox{top:100%;left:0;z-index:1000;display:none;float:left;min-width:200px;padding:5px 0;margin:0 0 0;font-size:14px;text-align:left;list-style:none;background-color:#fff;-webkit-background-clip:padding-box;background-clip:padding-box;border:1px solid #ccc;border:1px solid rgba(0,0,0,.15);border-top:0;overflow:hidden}.datepicker>div{display:none}.datepicker table{width:100%;margin:0}.datepicker td,.datepicker th{text-align:center;font-weight:400;cursor:pointer}.datepicker th{height:48px}.datepicker td{font-size:1.4rem}.datepicker td.day{height:34px;width:34px}.datepicker td.day:hover{background:#F0F0F0;height:34px;width:34px}.datepicker td.day.disabled{cursor:no-drop;color:#999;background:#eee}.datepicker tr.header,.datepicker tr.header:hover{font-size:1.6rem;color:#fff;background:#3bb4f2}.datepicker td.new,.datepicker td.old{color:#89d7ff}.datepicker td.active,.datepicker td.active:hover{border-radius:0;color:#0084c7;background:#F0F0F0}.datepicker td span{display:block;width:69px;height:40px;line-height:40px;float:left;cursor:pointer}.datepicker td span:hover{background:#F0F0F0}.datepicker td span.active{color:#0084c7;background:#F0F0F0}.datepicker td span.disabled{cursor:no-drop;color:#999;background:#fafafa}.datepicker td span.old{color:#89d7ff}.datepicker .dow{height:40px;color:#0c80ba;font-weight:700}.datepicker th.switch{width:145px}.datepicker th.next,.datepicker th.prev{font-size:21px}.datepicker thead tr:first-child th{cursor:pointer}.input-append.date .add-on i,.input-prepend.date .add-on i{display:block;cursor:pointer;width:16px;height:16px}');
	datebox.DEFAULT = {
		format : 'yyyy-mm-dd',
		editable : true,
		placeholder:''
	};
	dateFormat = function (date, fmt) { // author: meizz
		var o = {
			"m+" : date.getMonth() + 1, // 月份
			"d+" : date.getDate(), // 日
			"h+" : date.getHours(), // 小时
			"M+" : date.getMinutes(), // 分
			"s+" : date.getSeconds(), // 秒
			"q+" : Math.floor((date.getMonth() + 3) / 3), // 季度
			"S" : date.getMilliseconds()// 毫秒
		};
		if (/(y+)/.test(fmt)){
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		for (var k in o){
			if (new RegExp("(" + k + ")").test(fmt)){
				fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			}
		}
		return fmt;
	};
	//初始化datebox
	datebox.init = function (config){
		var ph = ('placeholder' in config)?('placeholder="'+config.placeholder+'"'):'';
		var html = '<div class="input-group">';
		html+='<input type="text" class="form-control" id="xyzui_datebox_input_'+config.id+'" '+ph+' '+(config.editable ? '' : 'readonly="readonly"')+' style="background-color:#FFFFFF">';
		html+='<div class="input-group-btn">';
		html+='<button type="button" class="btn btn-default dropdown-toggle" id="xyzui_datebox_btn_'+config.id+'"><span class="glyphicon glyphicon-calendar" style="position: static;"></span></button>';
		html+='</div>';
		html+='</div>';
		html+='<div id="xyzui_datebox_'+config.id+'" style="float:left;position:absolute;z-index:10000;"  xyzui="datebox"></div>';
		$('#'+config.id).html(html);
		$('#'+config.id).attr({
				'xyzui':'datebox_container',
				'format':config.format,
				'editable':config.editable
			});
		if(config.disabled){
			datebox['setDisabled'](config.id, true);
		}else{
			if(!config.editable){
				datebox['setEditable'](config.id, false);
			}
		}
		if('validator' in config){
			datebox['validator_'+config.id] = config.validator;
		}
		if('onSelect' in config){
			datebox['onSelect_'+config.id] = config.onSelect;
		}
		$('#xyzui_datebox_'+config.id).datepicker({
			format : config.format,
			viewMode: 'years',
			onRender : function(date){
				return ( (('validator_'+config.id) in datebox) ? datebox['validator_'+config.id](config.id,date) : false ) ? 'disabled' : '';
			}
		})
			.on("show", function(ev){
					$('#'+config.id).attr("showing","showing");
					//关闭其他打开着的datebox
					$.each($('div[xyzui="datebox"]'), function(i, n){
						var $n = $(n);
						if($n.attr('id')!=('xyzui_datebox_'+config.id)){
							$('#'+$n.attr('id')).datepicker('hide');
						}
					});
				})
			.on("hide", function(ev){
					$('#'+config.id).removeAttr("showing");
				})
			.on("changeDate", function(ev){
					$('#xyzui_datebox_input_'+config.id).val(dateFormat(new Date(ev.date), config.format));
					if(('onSelect_'+config.id) in datebox){
						datebox['onSelect_'+config.id](config.id, ev.date);
					}
				});
		$('#xyzui_datebox_btn_'+config.id).click(function(){
			if($('#'+config.id).attr("showing")){
				$('#xyzui_datebox_'+config.id).datepicker('hide');
			}else{
				$('#xyzui_datebox_'+config.id).datepicker('show');
			}
		});
		$('#xyzui_datebox_input_'+config.id).focus(function(){
			var editable = $('#'+config.id).attr('editable');
			if(!(editable=='true'||editable==true)){
				return;
			}
			if(!$('#'+config.id).attr("showing")){
				$('#xyzui_datebox_'+config.id).datepicker('show');
			}else{
				var maxZindex = findMaxZindex('div[id^="xyzui_datebox_"] >.dropdown-menu');
				$('#xyzui_datebox_'+config.id+' >.dropdown-menu').css('z-index',++maxZindex);
			}
		});
		$('#xyzui_datebox_input_'+config.id).blur(function(){
			var reg = /^(\d{4})[-|.|\/](0\d{1}|1[0-2])[-|.|\/](0\d{1}|[12]\d{1}|3[01])$/;
			var value = $('#'+config.id).xyzuiDatebox('getValue');
			if(!reg.test(value)){
				$('#'+config.id).xyzuiDatebox('setValue','');
			}
		});
		$('#xyzui_datebox_input_'+config.id).keyup(function(){
			var editable = $('#'+config.id).attr('editable');
			if(!(editable=='true'||editable==true)){
				return;
			}
			if(!$('#'+config.id).attr("showing")){
				$('#xyzui_datebox_'+config.id).datepicker('show');
			}
			if(!$('#'+config.id).attr("readonly")){
				var val = $.trim($('#xyzui_datebox_input_'+config.id).val());
				var separator = val.match(/[.\/\-\s].*?/),
					parts = val.split(/\W+/);
				if (!separator || !parts || parts.length < 3){
					return;
				}
				if(parts[2]!=null && parts[2]!="" && parts[2]!=0){
					val = new Date(parts[0],parts[1]-1,parts[2]).Format('yyyy-MM-dd');
					$('#'+config.id).xyzuiDatebox('setValue',val);
				}
			}
		});
		//赋初值
		if('current' in config){
			var m = config.current;
			if(config.current instanceof Date ){
				m = dateFormat(config.current, config.format);
			}
			datebox['setValue'](config.id, m);
		}
	};

	//取值
	datebox.getValue = function (id){
		return $('#xyzui_datebox_input_'+id).val();
	};

	//赋值
	datebox.setValue = function (id, value){
		if(value=="" || value==null){
			$('#xyzui_datebox_input_'+id).val("");
			return;
		}
		var format = $('#'+id).attr('format');
		var d;
		//只允许"-"和"/"两种模式
		if(value.indexOf('-')>-1){
			d = new Date(value.replace(/-/g,"/"));
		}else if(value.indexOf('/')>-1){
			d = new Date(value);
		}else{
			return;
		}
		if(('validator_'+id) in datebox){
			if(!datebox['validator_'+id](id,d)){
				$('#xyzui_datebox_input_'+id).val(dateFormat(d, format));
				$('#xyzui_datebox_'+id).datepicker('setValue',dateFormat(d, format));
			}
		}else{
			$('#xyzui_datebox_input_'+id).val(dateFormat(d, format));
			$('#xyzui_datebox_'+id).datepicker('setValue',dateFormat(d, format));
		}
	};

	//设置禁用属性
	datebox.setDisabled = function(id, disable){
		if(disable){
			$('#xyzui_datebox_input_'+id).attr("readonly","readonly");
			$('#xyzui_datebox_btn_'+id).attr("disabled","disabled");
			$('#'+id).attr('editable', false);
		}else{
			$('#xyzui_datebox_input_'+id).removeAttr("readonly");
			$('#xyzui_datebox_btn_'+id).removeAttr("disabled");
			$('#'+id).attr('editable', true);
		}
		$('#'+id).attr('isDisabled', disable);
	};

	//设置输入框可编辑属性
	datebox.setEditable = function(id, editable){
		if(!editable){
			$('#xyzui_datebox_input_'+id).attr("readonly","readonly");
			$('#'+id).attr('editable', false);
		}else{
			var disabled = $('#'+id).attr('isDisabled');
			if(disabled=='true' || disabled==true){
				$('#'+id).attr('editable', false);;
			}else{
				$('#xyzui_datebox_input_'+id).removeAttr("readonly");
				$('#'+id).attr('editable', true);
			}
		}
	};

	//扩展到jQuery
	$.fn.xyzuiDatebox=function( option , param ){
		for(var i=0;i<this.length;i++){
			var id = $(this[i]).attr('id');
			if(!isNull(id)){
				if(option==undefined){
					var config = {
						id:id,
						format:datebox.DEFAULT.format,
						editable:datebox.DEFAULT.editable,
						disabled:datebox.DEFAULT.disabled
					};
					datebox['init'](config);
				}else if((typeof option)==='string'){
					return datebox[option](id,param);
				}else if(option instanceof Object){
					var config = {
						id:id,
						format:('format' in option) ? option.format.toLowerCase() : datebox.DEFAULT.format,
						editable:('editable' in option) ? option.editable : datebox.DEFAULT.editable,
						disabled:('disabled' in option) ? option.disabled : datebox.DEFAULT.disabled,
						placeholder:('placeholder' in option) ? option.placeholder : datebox.DEFAULT.placeholder
					};
					if('current' in option){
						config.current = option.current;
					}
					if('validator' in option){
						config.validator = option.validator;
					}
					if('onSelect' in option){
						config.onSelect = option.onSelect;
					}
					datebox['init'](config);
				}
			}
		}
	};
})(jQuery);