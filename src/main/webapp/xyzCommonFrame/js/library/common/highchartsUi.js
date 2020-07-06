/**
 * 
var chartOpt = Highcharts.getOptions();//获取已配置的options
chartOpt.chart.renderTo = 'container';//将要绘制chart的DIV的id
chartOpt.title.text = '我的high charts图表标题';//high charts标题
chartOpt.xAxis.categories = ["2014-09-01","2014-09-02","2014-09-03","2014-09-04","2014-09-05",];//定义横轴（X轴）
chartOpt.yAxis.title = '价格（元）';//定义竖轴（Y轴）的标题
chartOpt.tooltip.valueSuffix = '元';//定义鼠标指向某个数据点时跟随数值后面的单位
chartOpt.tooltip.pointFormat = '';//定义鼠标经过时展示的效果

chartOpt.labels.items = [{
				 html : '<b>开始日期:'+dateStart.substring(0,10)+'</b>',
				 style: {
					'left': '20px',
					'top': '20px'
				 }
			 },{
				 html : '<b>结束日期:'+dateEnd.substring(0,10)+'</b>',
				 style: {
					'left': '20px',
					'top': '50px'
				 }
			 },{
				 html : '<b>订单总数:'+totalCount+'</b>',
				 style: {
					'left': '20px',
					'top': '80px'
				 }
			 },{
				 html : '<b>总金额:'+totalPrice.toFixed(2)+'</b>',
				 style: {
					'left': '20px',
					'top': '110px'
				 }
			 },{
				 html : '<b>产品总数:'+totalCountPtview+'</b>',
				 style: {
					'left': '20px',
					'top': '140px'
				 }
			 },{
				 html : '<b>单品总数:'+totalCountTkview+'</b>',
				 style: {
					'left': '20px',
					'top': '170px'
				 }
			 }];

//饼图专用
chartOpt.plotOptions.pie.dataLabels.format = '';//定义鼠标经过时展示的效果
chartOpt.chart.plotBackgroundColor = null;
chartOpt.chart.plotBorderWidth = null;
chartOpt.chart.plotShadow = false;

new Highcharts.Chart(chartOpt);//传入修改好的options并创建High charts
 * 				
 *  如需更多配置请参照api文档：http://www.hcharts.cn/api/index.php#chart
 *  中的配置选项中提供的层级模式，在如下：Highcharts.theme中进行配置。
 *  示例:
 *  chartOpt.series = [{
			 name:'总收款',
			 data: totalMoneyArray,
			 yAxis : 0,
			 type : 'column',
			 visible : true
		 },{//数据设计
			 name:'第三方担保',
			 data: thirdMoneyArray,
			 yAxis : 0,
			 type : 'column',
			 visible : true
		 },{
			 name:'订单数',
			 data: orderCountArray,
			 yAxis : 1,
			 type : 'column',
			 visible : false
		 },{
			 name:'总利润',
			 data: totalProfitArray,
			 yAxis : 0,
			 type : 'spline',
			 visible : true
		 },{
			 name:'房费利润',
			 data: roomProfitArray,
			 yAxis : 0,
			 type : 'spline',
			 visible : false
		 },{
			 name:'其他利润',
			 data: otherProfitArray,
			 yAxis : 0,
			 type : 'spline',
			 visible : false
		 }]
 *  
 *  
 */

//主题代码
Highcharts.theme = {
		colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
		chart: {
			backgroundColor: {
				linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
				stops: [
					[0, 'rgb(255, 255, 255)'],
					[1, 'rgb(240, 240, 255)']
				]
			},
			borderWidth: 2,
			plotBackgroundColor: 'rgba(255, 255, 255, .9)',
			plotShadow: true,
			plotBorderWidth: 1
		},
		title: {
			text:'分析图表',
			style: {
				color: '#000',
				font: 'bold 16px "Trebuchet MS", Verdana, sans-serif'
			}
		},
		subtitle: {
			text : '',
			style: {
				color: '#666666',
				font: 'bold 12px "Trebuchet MS", Verdana, sans-serif'
			}
		},
		credits: {
			enabled: false
		},
		tooltip : {//鼠标效果
			 enabled: true,
			 //formatter: function() {},
			 useHTML : true
		 },
		xAxis: {
			gridLineWidth: 1,
			lineColor: '#000',
			tickColor: '#000',
			labels: {
				style: {
					color: '#6D869F',
					font: '11px Trebuchet MS, Verdana, sans-serif',
					fontWeight:'bold'
				},
				align : 'center'
				//rotation : 0,//旋转
//				formatter: function() {return '<a href="www.12.com">'+this.value+'</a>'},
//				useHTML : false,
				//step : 3
			},
			title: {
				style: {
					color: '#333',
					fontWeight: 'bold',
					fontSize: '12px',
					fontFamily: 'Trebuchet MS, Verdana, sans-serif'

				}
			}
		},
		yAxis: {//y轴是数组
			minorTickInterval: 'auto',
			lineColor: '#000',
			lineWidth: 1,
			tickWidth: 1,
			tickColor: '#000',
			labels: {
				style: {
					color: '#000',
					font: '11px Trebuchet MS, Verdana, sans-serif'
				},
				step: 1,
				enabled: true,
				//formatter: function() {},
	            useHTML : false
			},
			title: {
				text:'值',
				style: {
					color: '#333',
					fontWeight: 'bold',
					fontSize: '12px',
					fontFamily: 'Trebuchet MS, Verdana, sans-serif'
				}
			},
            gridLineColor: '#bbbbbb'
		},
		legend: {
			itemStyle: {
				font: '9pt Trebuchet MS, Verdana, sans-serif',
				color: 'black'

			},
			itemHoverStyle: {
				color: '#039'
			},
			itemHiddenStyle: {
				color: 'gray'
			}
		},
		labels: {
			style: {
				color: '#black'
			}
		    /*items : [{
			    style: {
			   	   'left': '20px',
				   'top': '5px'
			    }
		    }]*/
		},
		plotOptions: {
            line: {
                dataLabels: {
                    enabled: true,
                    style: {
                        textShadow: '0 0 3px white, 0 0 3px white'
                    }
                },
                enableMouseTracking: true
            },
            pie: {
            	//点击后的效果
                allowPointSelect: true,
                //手型图标
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    color: '#000000',
                    connectorColor: '#000000',
                    format:''							                   
                },
                //下面的选项可以不看某快数据
               showInLegend: true
            },
            column : {
            	allowPointSelect: true,
            	cursor: 'pointer',
				dataLabels: {  
					enabled: false,
					//formatter: function() {},
		            useHTML : true,
		            distance : 50,
		            color : 'black'
				},
				enableMouseTracking: true
			 }
        },
		navigation: {
			buttonOptions: {
				theme: {
					stroke: '#CCCCCC'
				}
			}
		}
};

//设置options
Highcharts.setOptions(Highcharts.theme);