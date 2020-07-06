/**
 * 参数说明
 1、id  容器唯一标示
 2、data  数据 skuDetailList
 3、isShowOldDate 是否显示当前日期以前的库存价格  默认不显示   内部使用需要设置成true 用于删除之前的库存或者看之前的库存
 4、functionClick  点击事件，参数date 返回点击的日期  
 5、functionValidator 验证事件 ，参数date 
 * */


function xyzGetCalendar(xyzData){
	//数据
	var skuDetailList = xyzData.data;
	var currerentDate = new Date().Format("yyyy-MM-dd");
	//是否显示当天之前的库存价格
	var isShowOldDate = "";
	if(!xyzIsNull(xyzData.isShowOldDate)){
		isShowOldDate = xyzData.isShowOldDate;
	}else{
		isShowOldDate = false;
	}
	$('#'+xyzData.id).calendar({
		firstDay : 1,
		current : new Date(),
		months : ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"],
		formatter: function(date){
			//Date 为了解决啃爹的火狐
			date = date.Format("yyyy-MM-dd");
			var tempDate = new Date(date);
			var result ="<span style='color:#333;float:left;'>";
			if(isShowOldDate){
				for(var indexP in skuDetailList){
					if(date== (skuDetailList[indexP].dateInfo).substring(0,10)){
						result += tempDate.getDate()+"</span><br/>";
						result += "<input type='hidden' id='"+tempDate.getTime()+"_price' value='"+skuDetailList[indexP].price+"'/>";
						result += "<input type='hidden' id='"+tempDate.getTime()+"_stock' value='"+skuDetailList[indexP].stockCount+"'/>";
						result += "<span  style='color:#ff6000;float:left;font-size:12px;'>"+skuDetailList[indexP].price+"</span><br/>";
						result += "<span  style='color:#ff6000;float:left;font-size:12px;'>余"+skuDetailList[indexP].stockCount+"</span>";
						return result;
					}
				}
			}else{
				if(date>=currerentDate){
					for(var indexP in skuDetailList){
						if(date == (skuDetailList[indexP].dateInfo).substring(0,10)){
							result += tempDate.getDate()+"</span><br/>";
							result += "<input type='hidden' id='"+tempDate.getTime()+"_price' value='"+skuDetailList[indexP].price+"'/>";
							result += "<input type='hidden' id='"+tempDate.getTime()+"_stock' value='"+skuDetailList[indexP].stockCount+"'/>";
							result += "<span  style='color:#ff6000;float:left;font-size:12px;'>"+skuDetailList[indexP].price+"</span><br/>";
							result += "<span  style='color:#ff6000;float:left;font-size:12px;'>余"+skuDetailList[indexP].stockCount+"</span>";
							return result;
						}
					}
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
		}
	});
	
}

