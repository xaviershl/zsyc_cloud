/**
 * 参数说明
 1、id  容器唯一标示
 2、data  数据 stock
 4、functionClick  点击事件，参数date 返回点击的日期  
 5、functionValidator 验证事件 ，参数date 
 * */

/**
 * 为calendar增加自定义事件
 * 此处有对源码进行增加代码
 * 请在源码查找关键字 '//X'
 */
/**
 * 事件参数说明
 * cal calendar对象本身
 * year （number）当前显示的年
 * month （number）当前显示的月
 */
function xyzGetCalendar(xyzData){
	//数据
	var stock = xyzData.data;
	$('#'+xyzData.id).calendar({
		months : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
		weeks:["日","一","二","三","四","五","六"],
		formatter: function(date){
			//Date 为了解决啃爹的火狐
			date = date.Format("yyyy-MM-dd");
			var tempDate = new Date(date.replace(/-/g,"/"));
			var result ="<span style='color:#333;float:left;'>";
			for(var indexP in stock){
				if(date== (stock[indexP].dateInfo).substring(0,10)){
					result += tempDate.getDate();
					if(stock[indexP].isEnabled==0 || stock[indexP].isOff==1){
						result += "<i style='width: 8px;' class='iconfont icon-remove'></i>";
					}
					if(stock[indexP].isApply==1){
						result +="<img style='width:10px;position: absolute;right: 15px;' src='../xyzCommonFrame/image/other/icon-hand.png'/>";
					}
					result +="</span><br/>";
					result += "<input type='hidden' id='"+tempDate.getTime()+"_maxPrice' value='"+stock[indexP].maxPrice+"'/>";
					result += "<input type='hidden' id='"+tempDate.getTime()+"_minPrice' value='"+stock[indexP].minPrice+"'/>";
					result += "<span  style='color:#ff6000;float:left;font-size:12px;'>最小价:"+stock[indexP].minPrice+"</span><br/>";
					result += "<span  style='color:#ff6000;float:left;font-size:12px;'>最大价:"+stock[indexP].maxPrice+"</span><br/>";
					result += "<input type='hidden' id='"+tempDate.getTime()+"_stock' value='"+stock[indexP].count+"'/>";
					result += "<span  style='color:#ff6000;float:left;font-size:12px;'>数量:"+(stock[indexP].count-stock[indexP].countUse)+"/"+stock[indexP].count+"</span>";
					return result;
				}
			}
			return result + tempDate.getDate()+"</span><br/><br/><br/>";
		},
		onSelect: function(date){
			xyzData["functionClick"](date);
		},
		validator: function(date){
			var falg = xyzData["functionValidator"](date);
			if(falg){
				return true;
			}else{
				return false;
			}
		},
	});
}


