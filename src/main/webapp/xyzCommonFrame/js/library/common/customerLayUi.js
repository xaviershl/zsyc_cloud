/**
 * 初始化配置（需要做两根分页条联动效果的请使用xyzLayGridDouble方法）
 * @param pagerid 分页条容器div的id 必填
 * @param url 请求数据的链接地址 必填
 * @param method 默认default 
 * 							   强制加载到第一页 load 
 * 							   强制刷新当前页 reload 
 *  						   获取当前页码可直接调用 xyzLayGrid({pagerid:'pagerdivid',method:'currpage'})返回当前页码
 * @param page 当前页，默认1
 * @param rows 每页显示行数，默认10
 * @param queryParams 查询条件， 默认无
 * @param successFuc 执行成功的回调函数（status==1），可接收参数data 默认不做任何操作
 * @param errorFuc 执行失败的回调函数（status==0），可接收单数data  默认弹出提示框msg
 * 以下参数详细说明见：http://sentsin.com/layui/laypage/doc.html
 * @param skip 是否开启跳页 默认false
 * @param skin 
 * @param groups
 * @param first
 * @param last
 * @param prev
 * @param next
 */
function xyzLayGrid(d){
	if(d.pagerid==undefined || ''==d.pagerid){
		alert('需要pageid参数');
		return ;
	}
	d.method = ('method' in d)?d.method:'default';
	if('default'==d.method){
		;
	}else if('load'==d.method){//强制加载第一页
		d.page = 1;
	}else if('reload'==d.method){//强制重新加载当前页
		var currpage = xyzLayGrid({pagerid:d.pagerid,method:'currpage'});
		d.page = currpage;
	}else if('currpage'==d.method){
		var currpage = $('#'+d.pagerid).attr('currpage');
		currpage = (currpage==undefined||currpage==null||currpage==''||isNaN(currpage))?1:currpage;
		return currpage;
	}
//	var port = window.location.port==""?"":":"+window.location.port;
//	var targetServer = window.location.protocol+"//"+window.location.hostname+port+"/ebmb2b/";
	d.page = d.page==undefined?1:d.page;
	d.rows = d.rows==undefined?10:d.rows;
	$('#'+d.pagerid).attr('currpage',d.page);
	var queryParams = d.queryParams==undefined?{}:d.queryParams;
	queryParams['page'] = d.page;
	queryParams['rows'] = d.rows;
	$.ajax({
		url : d.url.indexOf('../')==0?d.url:xyzGetFullUrl(d.url),
		type : "POST",
		data : queryParams,
		async : true,
		dataType : "json",
		success : function(data) {
			if(data.status==1){
				if(typeof d.successFuc=='function'){
					d['successFuc'](data);//执行
				}
				var pages = Math.floor((data.content.total-1)/d.rows+1);
				laypage({
				    cont: d.pagerid, //容器。值支持id名、原生dom对象，jquery对象,
				    pages: pages, //总页数
				    skip: d.skip==undefined?false:d.skip, //是否开启跳页
				    skin: d.skin==undefined?'default':d.skin, //主题色
				    curr:d.page,//当前页
				    groups:d.groups==undefined?5:d.groups,//连续分页数
				    first:d.first==undefined?1:d.first,
				    last:d.last==undefined?pages:d.last,
				    prev:d.prev==undefined?'上一页':d.prev,
				    next:d.next==undefined?'下一页':d.next,
				    jump: function(e,first){
				    	if(!first){
				    		d.page = e.curr;
				    		d.method = 'default';
				    		xyzLayGrid(d);
				    	}
				    }
				});
			}else{
				if(typeof d.errorFuc=='function'){
					d['errorFuc'](data);
				}else{
					top.$.messager.alert("警告",data.msg,"warning");
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}

/**
 * 两条分页条联动（你需要在页面写好两个分页条容器div）
 * 在单条基础上增加了参数pagerid2
 * @param d
 * @returns
 */
function xyzLayGridDouble(d){
	if(d.pagerid==undefined || ''==d.pagerid){
		alert('需要pagerid参数');
		return ;
	}
	if(d.pagerid2==undefined || ''==d.pagerid2){
		alert('需要pagerid2参数');
		return ;
	}
	d.method = ('method' in d)?d.method:'default';
	if('default'==d.method){
		;
	}else if('load'==d.method){//强制加载第一页
		d.page = 1;
	}else if('reload'==d.method){//强制重新加载当前页
		var currpage = xyzLayGrid({pagerid:d.pagerid,pagerid2:d.pagerid2,method:'currpage'});
		d.page = currpage;
	}else if('currpage'==d.method){
		var currpage = $('#'+d.pagerid).attr('currpage');
		currpage = (currpage==undefined||currpage==null||currpage==''||isNaN(currpage))?1:currpage;
		return currpage;
	}
//	var port = window.location.port==""?"":":"+window.location.port;
//	var targetServer = window.location.protocol+"//"+window.location.hostname+port+"/ebmb2b/";
	d.page = d.page==undefined?1:d.page;
	d.rows = d.rows==undefined?10:d.rows;
	$('#'+d.pagerid).attr('currpage',d.page);
	$('#'+d.pagerid2).attr('currpage',d.page);
	var queryParams = d.queryParams==undefined?{}:d.queryParams;
	queryParams['page'] = d.page;
	queryParams['rows'] = d.rows;
	$.ajax({
		url : d.url.indexOf('../')==0?d.url:xyzGetFullUrl(d.url),
		type : "POST",
		data : queryParams,
		async : true,
		dataType : "json",
		success : function(data) {
			if(data.status==1){
				if(typeof d.successFuc=='function'){
					d['successFuc'](data);//执行
				}
				var pages = Math.floor((data.content.total-1)/d.rows+1);
				var config = {
					cont:d.pagerid,
				    pages: pages, //总页数
				    skip: d.skip==undefined?false:d.skip, //是否开启跳页
				    skin: d.skin==undefined?'default':d.skin, //主题色
				    curr:d.page,//当前页
				    groups:d.groups==undefined?5:d.groups,//连续分页数
				    first:d.first==undefined?1:d.first,
				    last:d.last==undefined?pages:d.last,
				    prev:d.prev==undefined?'上一页':d.prev,
				    next:d.next==undefined?'下一页':d.next,
				    jump: function(e, first){
				    	if(!first){
				    		d.page = e.curr;
				    		d.method = 'default';
				    		xyzLayGridDouble(d);
				    	}
				    }
				};
				config.cont = d.pagerid;
				laypage(config);
				//第二个
				config.cont = d.pagerid2;
				laypage(config);
			}else{
				if(typeof d.errorFuc=='function'){
					d['errorFuc'](data);
				}else{
					xyzShowAjaxMessage(data);
				}
			}
		},
		error : function(XMLHttpRequest, textStatus, errorThrown) {
			top.window.AjaxError(XMLHttpRequest, textStatus, errorThrown);
		}
	});
}


/**
 * 表单验证不通过的提示信息
 * @param message  提示内容
 * @param elementId 需要提示的input、textarea、select、等等任意元素的id
 */
function xyzLaytips(message,elementId,needScroll){
	elementId = elementId.indexOf('#')!=0?'#'+elementId:elementId;
	needScroll = needScroll==undefined?true:needScroll;
	if(needScroll){
		var bodyOffset = $('html,body').offset().top;
		var targetOffset = $(elementId).offset().top;
		
		if(bodyOffset+targetOffset!=0){
			$('html,body').animate({scrollTop: targetOffset-50}, 300);
		}
	}
	layer.tips(message,elementId);
}