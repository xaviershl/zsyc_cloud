//大日历  
$(document).ready(function() {
	var jshtml = "";
	jshtml+='<link rel="stylesheet" type="text/css" href="https://file.maytek.cn/static/fullcalendar/css/jquery-ui.min.css"/>';
	jshtml+='<link rel="stylesheet" type="text/css" href="https://file.maytek.cn/static/fullcalendar/fullcalendar/fullcalendar.css"/>';
	jshtml+=	'<script type="text/javascript" src="https://file.maytek.cn/static/fullcalendar/fullcalendar/fullcalendar.min.js"></script>';
	$("head").append(jshtml);
});
/**
 * //获取日历    
 * 参数1 id                      容器的ID
 * 参数2 startDate          初始化日期   第一个显示在日历控件上的时间 日历控件会自动跳到这一天   传null 取默认值当前日期
 * 参数3 height              日历控件的高  传null 取默认值500
 * 参数4 isMouseColor  是否鼠标移上去变色                    true    false   纯展示可以使用false 如要绑定事件 建议true   传null 取默认值true
 * 参数5 functionData    展示数据回调函数                       function(start,end){return[stockData[],priceData[],....}    固定写法，使用start,end2个参数 取得新的数据
 * 参数5 functionClick 	  点击回调函数                              function(data, allDay, jsEvent, view){alert(data);}    固定写法
 *  
 * functionData 测试数据 ：
	var stockData = [];
	var jsonStockData1 ={};
	jsonStockData1.title = "库存30(格子里第二行展示的数据)";
	jsonStockData1.start = "2016-03-01";
	jsonStockData1.xx1 = "随意";
	jsonStockData1.xx2 = "随意";
	stockData[0] = jsonStockData1;
	
	var priceData = [];
	var jsonPriceData ={};
	jsonPriceData.title = "价格¥700(格子里第一行展示的数据)";
	jsonPriceData.start = "2016-03-01";
	jsonStockData1.xx1 = "随意";
	jsonStockData1.xx2 = "随意";
	priceData[0] = jsonPriceData;
	// 测试数据 格式：  [[{"title":"库存30(格子里第二行展示的数据)","start":"2016-03-01","sid":"唯一标示(可为空)"}],[{"title":"价格¥700(格子里第一行展示的数据)","start":"2016-03-01","sid":"唯一标示(可为空)"}]] 
 */
function getMyfullCalendar(xyzData){
	//id,startDate,height,isMouseColor,functionData,functionClick
	$('#'+xyzData.id).fullCalendar('destroy');
	
	if(xyzIsNull(xyzData.height)){
		xyzData.height = 500;
	}
	
	if(xyzIsNull(xyzData.isMouseColor)){
		xyzData.isMouseColor = true;
	}
	
	var date = "";
	if(xyzIsNull(xyzData.startDate)){
		date = new Date();
	}else{
		date = new Date(xyzData.startDate);
	}
	var m = date.getMonth();
	var y = date.getFullYear();
	
	$('#'+xyzData.id).fullCalendar({
		header : {
			left : 'prev,next,today,title',
			right : 'month'
		},
		// 鼠标移上去的操作。
		eventMouseover : function(event,jsEvent, view){
			if(xyzData.isMouseColor){
				$(this).css('background-color', '#ff9c01');
				$(this).css('cursor', 'pointer');
			}
		},
		// 鼠标离开的操作。
		eventMouseout : function(event,jsEvent, view){
			if(xyzData.isMouseColor){
				//取消日历控件变色和取消手掌图标
				$(this).css('background-color', '#5bc0de');
				$(this).css('cursor', '');
				//移除弹出层DIV
		        $(".ui-ios-overlay").remove();
			}
		},
		
		//鼠标点击操作
		eventClick: function(data, allDay, jsEvent, view) {
			xyzData["functionClick"](data, allDay, jsEvent, view);
	    },
		theme : true,//能否和jquery-ui合作配置皮肤
		allDay:true,//指定是否是全天事件
		
		//liquid : true,
		height : xyzData.height,
//		contentHeight : 330,
		aspectRatio : 1.5,
		editable : false,
		month : m,
		year : y,
		firstDay : 1,
//		aspectRatio : 1.35, 宽度和高度的比例
		titleFormat : {month: 'yyyy MMMM '}, //
		dayNamesShort : [ "周日", "周一", "周二","周三", "周四", "周五", "周六" ],
		monthNames : [ '1月', '2月', '3月', '4月','5月', '6月', '7月', '8月', '9月','10月', '11月', '12月' ],
		buttonText : {
			prev : '上月',
			next : '下月',
			prevYear : '去年',
			nextYear : '明年',
			today : '本月',
			month : '月',
			week : '周',
			day : '日'
		},
		weekends : true,//是否显示周末
		events : function(start, end, callback) {
				var functionResult = xyzData["functionData"](start,end);
				var events = [];
				for(var xyzi in functionResult){
					var xyzFullCalendarData = functionResult[xyzi];
					if(!xyzIsNull(xyzFullCalendarData)){
						for(var xyzp in xyzFullCalendarData){
							var xyzpDate = xyzFullCalendarData[xyzp];
							events.push(xyzpDate);
						}
					}
				}
				callback(events);
		}
	});	
}