(function(){
    if(mxApi.isPc()){
        pcMaytekQ();
    } else {
        mobileMaytekQ();
    }
})();

function pcMaytekQ() {
    function PlsSearchPlugin(plsSearchData) {

        // json对象转换成字符串
        var stringify = function (s) {
            var data = s;
            data = JSON.stringify(data, function(key, val) {
                if (typeof val === 'function') {
                    return val + '';
                }
                return val;
            });
            return data
        };

        // json字符串转换成对象
        var parseJson = function (s) {
            var data = s;
            data = JSON.parse( data , function(k,v){
                if(xyzIsNull(v)){
                    v = '';
                }
                if(v.indexOf && v.indexOf('function') > -1){
                    return eval("(function(){return "+v+" })()")
                }
                return v;
            });
            return data
        };

        // 判断为空
        var xyzIsNull = function(obj){
            if(obj==undefined || obj==null || obj==="" || obj===''){
                return true;
            }else{
                return false;
            }
        };

        // 滚动条
        var initscroll = function (e,scrollBoxHeight,scrollContentHeight) {
            var $ul = e;
            var $span = $ul.parent().find('.sbarbox span').eq(0);
            var n = ((scrollBoxHeight / scrollContentHeight) * 100 ) + '%';
            $span.css('height', n);
            $ul.parent().find('.sbarbox').show();
            $ul.parent().find('.sbar').fadeIn();
            scrollBoxHeight = $ul[0].getBoundingClientRect().height; // 设置的理论最大高度和真实渲染的高度有出入
            $ul.parent().find('.sbar').css({"height":scrollBoxHeight-20+"px"});

            // 监听高度
            $ul.scroll(function () {
                if($ul.children()[0]) {
                    if($ul.children()[0].offsetWidth==0||$ul.children()[0].offsetWidth+4>=$ul[0].offsetWidth){
                        $ul.parent().find('.sbarbox').hide();
                    }else{
                        $ul.parent().find('.sbarbox').show();
                    }
                    scrollContentHeight = $ul[0].scrollHeight;
                    var scrolltop = $ul.scrollTop();
                    var box_height = $ul.parent().find('.sbar')[0].getBoundingClientRect().height,
                        scroll_bar_height = $ul.parent().find('.sbar span')[0].getBoundingClientRect().height;

                    // scrolltop=(scrolltop/scrollContentHeight)*(scrollBoxHeight-20);
                    scrolltop = (scrolltop / (scrollContentHeight - scrollBoxHeight)) * (box_height - scroll_bar_height);
                    $span.css({"top":scrolltop+"px"});
                }
            });
        };


        /*变量名*/
        var that = this;
        that.pluginData = stringify(plsSearchData);
        that.pluginData = parseJson(that.pluginData);//原始的数据
        that.defaultPluginData = stringify(that.pluginData);
        that.defaultPluginData = parseJson(that.defaultPluginData);//保存原始的数据

        that.pluginData.data = {};//查询总数据
        that.searchData = {};//查询的数据

        //添加group数据到主数据的方法
        that.initData;
        //判断是否有判断是否有virtualAppFunctionSettings，虚拟系统配置数据
        that.initVrSetData;
        //判断是否有自定义数据的方法
        that.initSelfData;
        var isSelfData = false;
        //渲染组件
        that.render;
        that.creatGroup;
        //获取数据
        that.getSearchData;
        //判断是否可以查询
        var canSearch = true;

        /*--初始化数据--*/

        //添加group数据到主数据的方法
        that.initData = function () {
            if(xyzIsNull(that.pluginData.id)){
                return
            }
            that.pluginData.data = {};

            if(xyzIsNull(that.pluginData.group)){
                that.pluginData.group = {"allQuery":{
                        value: "allQuery",
                        text:'更多',
                        data:[{
                            key: "AIquery",
                            defaultQuery: "true",
                            options: {
                                data: {
                                    prompt:""
                                }
                            },
                            AIMatch: [
                                {key:"", re:""}
                            ]
                        }]
                    }}};

            //遍历group一级数据
            for (var group in that.pluginData.group){
                var groupData = that.pluginData.group[group];

                //遍历group二级数据
                for(var i = 0;i< groupData.data.length; i++){
                    var key = groupData.data[i].key;

                    if(xyzIsNull(groupData.value)||group != groupData.value){
                        that.pluginData.group[group].value = group;
                    }

                    //把group数据添加进插件组数据
                    if(!xyzIsNull(key)){
                        that.pluginData.data[key] = groupData.data[i];
                    }
                }
            }

            //给不规范的数据增加属性
            that.pluginData.uniqueId = xyzIsNull(that.pluginData.uniqueId)? that.pluginData.id : that.pluginData.uniqueId;
            that.pluginData.marginLeft = xyzIsNull(that.pluginData.marginLeft)?0:Number(that.pluginData.marginLeft);
            that.pluginData.marginRight = xyzIsNull(that.pluginData.marginRight)?0:Number(that.pluginData.marginRight);
            that.pluginData.customSearchWidth = xyzIsNull(that.pluginData.customSearchWidth)?0:Number(that.pluginData.customSearchWidth);
            that.pluginData.width = xyzIsNull(that.pluginData.width)?'auto':Number(that.pluginData.width) + 'px';
            that.pluginData.height = xyzIsNull(that.pluginData.height)?68:Number(that.pluginData.height)>54?Number(that.pluginData.height):54;
            for(var data in that.pluginData.data){
                //给不规范的数据增加属性
                if(xyzIsNull(that.pluginData.data[data].type)){
                    that.pluginData.data[data].type = "textbox";
                }
                if(xyzIsNull(that.pluginData.data[data].defaultQuery)){
                    that.pluginData.data[data].defaultQuery = "false";
                }
                if(xyzIsNull(that.pluginData.data[data].options)){
                    that.pluginData.data[data].options = {};
                }
                if(xyzIsNull(that.pluginData.data[data].options.data)){
                    that.pluginData.data[data].options.data = [];
                }
                if(xyzIsNull(that.pluginData.data[data].options.value)){
                    that.pluginData.data[data].options.value = "";
                }
                if(xyzIsNull(that.pluginData.data[data].options.text)){
                    that.pluginData.data[data].options.text = "";
                }
                if(xyzIsNull(that.pluginData.data[data].options.html)){
                    that.pluginData.data[data].options.html = "";
                }
            }

            if(!xyzIsNull(that.pluginData.data.AIquery)){
                that.pluginData.data.AIquery.defaultQuery = "true";
                if(xyzIsNull(that.pluginData.data.AIquery.keyLabel))
                    that.pluginData.data.AIquery.keyLabel = "";
            }
          // 获取查询条件虚拟系统屏蔽字段
          window.getmaytekQVrData(that.pluginData)

          //初始化数据,判断是否有virtualAppFunctionSettings，虚拟系统配置数据
          window.maytekQVrSetData(that)

        };

        //判断是否有自定义数据的方法
        that.initSelfData = function () {
            var currentSelfQuery = getDefaultHabit("searchSelfQuery-"+that.pluginData.id);
            if(!xyzIsNull(currentSelfQuery)&&currentSelfQuery !== "{}") {//判断是否有自定义的搜索
                isSelfData = true;
                var selfQueryData = parseJson(currentSelfQuery);
                let copePluginData = parseJson(stringify(that.pluginData.data))
                for (var key in selfQueryData) {
                    if(!xyzIsNull(selfQueryData[key].defaultQuery)&&!xyzIsNull(that.pluginData.data[key])){
                      copePluginData[key].defaultQuery = selfQueryData[key].defaultQuery;
                      copePluginData[key].options.value = xyzIsNull(selfQueryData[key].value)?'':selfQueryData[key].value;
                      copePluginData[key].options.text = xyzIsNull(selfQueryData[key].text)?'':selfQueryData[key].text;
                      copePluginData[key].options.html = xyzIsNull(selfQueryData[key].html)?'':selfQueryData[key].html;
                      copePluginData[key].index = xyzIsNull(selfQueryData[key].index)? undefined:selfQueryData[key].index;
                    }
                }

                // 调整顺序
              let copePluginDataArr = []

              for (var key in copePluginData){
                  if (key === "AIquery") {
                    copePluginDataArr[0] = copePluginData[key]
                  } else {
                    var indexNumber = copePluginData[key].index

                    if (indexNumber !== undefined && typeof Number(indexNumber) === 'number'&& Number(indexNumber) > -1) {
                      copePluginDataArr[indexNumber+1] = copePluginData[key]
                    }
                  }
              }

              for (var key in copePluginData){
                var indexNumber = copePluginData[key].index
                if (key !== "AIquery" && (indexNumber === undefined || Number(indexNumber) < 0)) {
                  copePluginDataArr.push(copePluginData[key])

                }
              }

              delete  that.pluginData.data
              that.pluginData.data = new Object();

              if (copePluginDataArr.length === Object.keys(copePluginData).length) {
                copePluginDataArr.forEach(function (data,index) {
                  that.pluginData.data[data.key] = data
                })
              } else {
                that.pluginData.data = copePluginData
              }


            }
        }
        //初始化数据
        that.init = function () {
            //初始化数据
            that.initData();
           //初始化数据,判断是否有自定义数据
           that.initSelfData();
        };
        that.init();

        /* var $hasCss = $(document).find('link[href*="MaytekQ.css"]');//解决皮肤和其他系统的差异，以及有.xyz_search_bar的差异
         if($hasCss.length<1) {
             var content = '<link rel="stylesheet" href="../xyzCommonFrame/css/MaytekQ.css">'+
             '<style>.xyz_search_bar'+'{height:'+that.pluginData.height+'px;}'+'</style>';
             $("link").last().before(content);
         }*/
        var style = '<style>' +
            '#' +that.pluginData.id +' .plsSearchPlugin'+'{width:'+that.pluginData.width + ';height:'+that.pluginData.height + 'px;margin-left:'+that.pluginData.marginLeft + 'px;margin-right:'+that.pluginData.marginRight+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-mainWrap'+'{height:'+that.pluginData.height+'px;margin-right:'+(86+that.pluginData.customSearchWidth)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-main'+'{height:'+that.pluginData.height+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-set'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-setSave'+'{height:'+((that.pluginData.height-2)/2-1)+'px;line-height:'+((that.pluginData.height-2)/2-1)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-setRestore'+'{height:'+(that.pluginData.height-2)/2+'px;line-height:'+(that.pluginData.height-2)/2+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-queryLabelWrap'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-queryLabelWrap .lablelNowArrows'+'{top:'+(that.pluginData.height+6)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-queryScrollerLeft'+'{height:'+(that.pluginData.height-2)+'px;line-height:'+(that.pluginData.height-2)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-queryScrollerRight'+'{height:'+(that.pluginData.height-2)+'px;line-height:'+(that.pluginData.height-2)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-aiQuery'+'{height:'+(that.pluginData.height-3)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-aiQuery .queryLabelBox'+'{height:'+(that.pluginData.height-3)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-aiQuery .queryLabelBox a'+'{margin-top:'+((that.pluginData.height-3)/2-21)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-aiQuery .queryLabelBox textarea'+'{height:'+(that.pluginData.height-3)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-aiQuery .queryLabelBox .icon-clear'+'{height:'+(that.pluginData.height-2)+'px;line-height:'+(that.pluginData.height-2)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap ul'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap ul li'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap li > div'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap .queryLabelBox a'+'{height:'+(that.pluginData.height-2)+'px;line-height:'+(that.pluginData.height-2)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-labelsWrap li.select .queryLabelBox a'+'{height:19px;line-height:19px;padding-top:'+(that.pluginData.height/5-10>0?that.pluginData.height/5-10:0)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-selectGroup'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-clearLablel'+'{height:'+(that.pluginData.height-2)+'px;line-height:'+(that.pluginData.height-2)+'px}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .search-selectItem'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .queryInputBoxs'+'{top:'+(that.pluginData.height-5)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .button-mainWrap'+'{height:'+(that.pluginData.height)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .button-custom'+'{width:'+(that.pluginData.customSearchWidth)+'px;height:'+(that.pluginData.height)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .button-self'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '#' +that.pluginData.id +' .plsSearchPlugin .button-self a'+'{height:'+(that.pluginData.height-2)+'px;}'+
            '</style>';
        /*--html结构--*/
        var  plsSearchPluginHtml = '<div class="plsSearchPlugin pluginBox">' +
            '<div class="search-mainWrap">' +
            '<div class="search-main">' +
            '<div class="search-set">' +
            '<div class="search-setSave" title="自定义最适合您的默认查询条件"><span class="iconfont icon-suo"></span><span class="iconfont icon-jiesuo"></span></div>' +
            '<div class="search-setRestore" title="恢复出厂设置"><span class="iconfont icon-fangwu"></span></div>' +
            '</div>' +
            '<div class="search-queryLabelWrap"><span class="lablelNowArrows"></span>' +
            '<div class="search-queryScrollerLeft"><span class="iconfont icon-calendarPrevmonth"></span></div>' +
            '<div class="search-queryScrollerRight"><span class="iconfont icon-calendarNextmonth"></span></div>' +
            '<div class="search-aiQuery"></div>' +
            '<div class="search-labelsWrap">' +
            '<ul></ul></div></div>' +
            '<div class="search-selectGroup"></div>' +
            '<div class="search-clearLablel" title="清除所有已经输入的条件值"><span class="iconfont icon-searchClear"></span></div></div>' +
            '<div class="queryInputBoxs"></div>' +
            '<div class="selectGroupBoxs" >' +
            '<div class="sbarbox"><div class="sbar"><span></span></div></div>' +
            '</div></div>' +
            '<div class="button-mainWrap">' +
            '<div class="button-custom"><div></div></div>' +
            '<div class="button-self"><a id="searchBtn-'+ that.pluginData.id +'"><span class="iconfont icon-chaxun"></span>查询</a></div>' +
            '</div></div>';
        $("#"+that.pluginData.id).prepend(plsSearchPluginHtml);
        $("#"+that.pluginData.id +' .button-custom div').prepend(that.pluginData.customSearch);
        $("link").last().after(style);

        that.scrollMaxHeight = xyzIsNull(that.pluginData.scrollMaxHeight)?520:that.pluginData.scrollMaxHeight;//下拉框滚动条最大高设置

        var $queryInputBoxs = $("#"+that.pluginData.id+" .queryInputBoxs");
        var $queryInputBoxsWidth = $(document).width()-16;
        $queryInputBoxs.css({left:-that.pluginData.marginLeft,width:$queryInputBoxsWidth + 'px'});//解决搜索框被overflow宽度限制

        /*--创建group搜索组件--*/
        var $selectSelectGroup = $("#"+that.pluginData.id+" .search-selectGroup");
        var $selectGroupBoxs = $("#"+that.pluginData.id+" .selectGroupBoxs");
        var $searchQueryLabelWrap = $("#"+that.pluginData.id+" .search-queryLabelWrap");
        var $searchAiQuery = $("#"+that.pluginData.id+" .search-aiQuery");

        //创建组件数据
        that.pluginGroup = that.pluginData.group;


        //创建搜索组件的方法
        that.creatGroup = function () {
            $selectSelectGroup.html("");
            for(var group in that.pluginGroup){
                var groupData = that.pluginGroup[group];

                var selectGroup = '<div class="search-selectItem"><div class="'+ group+'">'+groupData.text+'</div><span class="iconfont icon-comboArrow"></span></div>';
                $selectSelectGroup.append(selectGroup);

                var selectGroupBox = '<ul class="selectGroupBox '+ groupData.value + '"></ul>';
                $selectGroupBoxs.append(selectGroupBox);

                for(var i = 0;i< groupData.data.length;i++){

                    if (groupData.data[i].key == "AIquery") {
                        continue
                    }

                    var selectGroupBoxLi = '<li title="'+groupData.data[i].keyLabel+'" queryValue="'+ groupData.data[i].key +'">'+ groupData.data[i].keyLabel +'</li>';
                    $("#"+that.pluginData.id+" .selectGroupBox." + group).append(selectGroupBoxLi);
                }
            }
        };
        that.creatGroup();
        $searchQueryLabelWrap.css({right:Object.keys(that.pluginGroup).length*47+1+48+'px'});


        /*--创建li,input搜索组件--*/
        var $searchLabelsWrap = $("#"+that.pluginData.id+" .search-labelsWrap");
        var $searchLabelsWrapul = $("#"+that.pluginData.id+" .search-labelsWrap ul");
        var $searchClearLablel = $("#"+that.pluginData.id+" .search-clearLablel");
        var $queryInputBox = $("#"+that.pluginData.id+" .queryInputBox");
        /*--生成搜索选项的方法--*/
        var createQueryLi = function (data) {
            var add = false;
            var num = 0;
            if(data == "default"){
                $searchLabelsWrapul.html("");
            }
            if(data == "clickAdd"){
                add = true;
            }
            for(var li in that.pluginData.data){//遍历总数据
                var queryLi = that.pluginData.data[li];
                if(queryLi.defaultQuery == "true"){//判断显示的搜索选项

                    if($searchQueryLabelWrap.has('a[queryValue="'+queryLi.key+'"]').length !== 0){
                        if(queryLi.key !=='AIquery') {
                            num += 1;
                        }
                        continue
                    }
                    //生成智能
                    var queryLabelLi = '';
                    if(queryLi.key=='AIquery'){
                        queryLabelLi = '<div class="queryLabelBox">' +
                            '<a href="#" queryValue = "' + queryLi.key + '" >' + queryLi.keyLabel + '</a>' +
                            '<textarea>'+queryLi.options.data.prompt+'</textarea><span class="iconfont icon-clear"></span></div>';
                        $searchAiQuery.append(queryLabelLi);

                        continue
                    }

                    if (!xyzIsNull(queryLi.options.text)) {
                        if (queryLi.options.text.indexOf('&lt;br&gt;') > -1) {
                            var title = queryLi.options.text;
                            queryLi.options.text = title.substring(0, title.indexOf('&')) + '<br>' + title.substring(title.lastIndexOf(';') + 1, title.length);
                        }
                        var html ='';
                        if(xyzIsNull(queryLi.options.html)) {
                            html = queryLi.options.text;
                        } else {
                            html = queryLi.options.html;
                            html = html.replace(/&lt;/g,"<");
                            html = html.replace(/&acute;/g,"'");
                            html = html.replace(/&gt;/g,">");
                        }


                        queryLabelLi = "<li class='select'><div class='queryLabelBox'>" +
                            "<a href='#' queryValue = '" + queryLi.key + "' >" + queryLi.keyLabel + "</a>" +
                            "<div title='" + queryLi.options.text + "'><p>" + html + "</p></div></div>" +
                            "<span class='iconfont icon-clear'></span></li>";

                    } else {
                        queryLabelLi = '<li><div class="queryLabelBox">' +
                            '<a href="#" queryValue = "' + queryLi.key + '" >' + queryLi.keyLabel + '</a>' +
                            '<div title=""><p></p></div></div>' +
                            '<span class="iconfont icon-clear"></span></li>';
                    }
                    $searchLabelsWrapul.append(queryLabelLi);
            /*        if(add == false){
                        $searchLabelsWrapul.append(queryLabelLi);
                    } else {
                        if(num - 1 < 0){
                            $searchLabelsWrapul.find('li').eq(0).before(queryLabelLi);
                        } else {
                            $searchLabelsWrapul.find('li').eq(num-1).after(queryLabelLi);
                        }
                    }*/
                }

            }
        };
        /*--生成搜索选框的方法--*/
        var createInput = function (data) {
            var add = false;
            var num = 0;
            if(data == "default"){
                $queryInputBoxs.html("");
            }
            if(data == "clickAdd"){
                add = true;
            }


            for(var input in that.pluginData.data){//遍历总数据
                var queryInput = that.pluginData.data[input];
                //生成智能

                if(queryInput.defaultQuery == "true"){//判断显示的搜索选项

                    if($queryInputBoxs.has('input[queryValue="'+queryInput.key+'"]').length !== 0||$queryInputBoxs.has('input[dateStr="'+queryInput.key+'"]').length !== 0){
                        num += 1 ;
                        continue
                    }

                    if(queryInput.key=='AIquery'){
                        continue
                    }

                    //生成自定义
                    if(queryInput.type == 'customSearch'){

                        var queryInputBox = '<div class="queryInputBox"><div id="custom-'+ queryInput.key + that.pluginData.id +'" class="customInputBox">'+queryInput.options.customHtml + '</div><input  type="hidden" id="search-' + queryInput.key + that.pluginData.id+ '" queryValue ="' + queryInput.key + '" disabled customsearch><div class="inputButton"><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                        $queryInputBoxs.append(queryInputBox);

                      /*  if(add == false){
                            $queryInputBoxs.append(queryInputBox);
                        } else {
                            if(num - 1 < 0){
                                $queryInputBoxs.find(".queryInputBox").eq(num).before(queryInputBox);
                            } else {
                                $queryInputBoxs.find(".queryInputBox").eq(num-1).after(queryInputBox);
                            }
                        }*/

                        that.pluginData.data[queryInput.key].options.id = 'custom-' + queryInput.key + that.pluginData.id;

                        if(!xyzIsNull(queryInput.options.customOnload)){
                            queryInput.options.customOnload(queryInput.options);
                        }
                        if(!xyzIsNull(queryInput.options.customSetValue)){
                            queryInput.options.customSetValue(queryInput.options);
                        }
                        if(!xyzIsNull(queryInput.options.customSetText)){
                            queryInput.options.customSetText(queryInput.options);
                        }
                        if(!xyzIsNull(queryInput.options.customGetValue)){
                            queryInput.options.customGetValue(queryInput.options);
                        }
                        if(!xyzIsNull(queryInput.options.customGetText)){
                            queryInput.options.customGetText(queryInput.options);
                        }
                        if(!xyzIsNull(queryInput.options.customGetHtml)){
                            queryInput.options.customGetHtml(queryInput.options);
                        }
                        continue
                    }

                    //生成doubledate
                    if(queryInput.type == "doubleDate"){
                        var queryInputBox = '<div class="queryInputBox"><input type="text" id="dateStart-' + queryInput.key + that.pluginData.id + '\" queryValue ="dateStr" dateStr = \"' + queryInput.key + '\" dateStart = ""> ~&nbsp;&nbsp; <input type="text" id=\"dateEnd-' + queryInput.key + that.pluginData.id + '\" queryValue ="dateStr" dateStr = \"' + queryInput.key + '\" dateEnd=""><div class="inputButton"><span class="dropClear">清空</span><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                      /*  if(num == 0 && add == false){
                            $queryInputBoxs.append(queryInputBox);
                        } else {
                            if(num - 1 < 0){
                                $queryInputBoxs.find(".queryInputBox").eq(num).before(queryInputBox);
                            } else {
                                $queryInputBoxs.find(".queryInputBox").eq(num-1).after(queryInputBox);
                            }
                        }*/
                        $queryInputBoxs.append(queryInputBox);
                        var dateValue = queryInput.options.value;
                        var dateStartValue ='';
                        var dateEndValue ='';

                        if(!xyzIsNull(dateValue)){
                            if(dateValue.lastIndexOf('^')==0){
                                dateStartValue = dateValue.substring(0,dateValue.indexOf('^'));
                            } else if(dateValue.indexOf('^') == 0){
                                dateEndValue = dateValue.substring(dateValue.lastIndexOf('^')+1,dateValue.length);
                            } else{
                                dateStartValue = dateValue.substring(0,dateValue.indexOf('^'));
                                dateEndValue = dateValue.substring(dateValue.lastIndexOf('^')+1,dateValue.length);
                            }
                        }

                        $('#dateStart-'+ queryInput.key+that.pluginData.id).datebox({
                            width: 118,
                            height:28,
                            panelWidth:276,
                            panelHeight:300,
                            value:dateStartValue
                        });
                        $('#dateEnd-'+ queryInput.key+that.pluginData.id).datebox({
                            width: 118,
                            height:28,
                            panelWidth:276,
                            panelHeight:300,
                            value:dateEndValue
                        });
                        continue
                    }

                    //生成doubleDateTime
                    if(queryInput.type == "doubleDateTime"){
                        var queryInputBox = '<div class="queryInputBox"><input type="text" id="dateStart-' + queryInput.key + that.pluginData.id + '\" queryValue ="dateStr" dateStr = \"' + queryInput.key + '\" dateStart = "" class="datetimebox"> ~&nbsp;&nbsp; <input type="text" id=\"dateEnd-' + queryInput.key + that.pluginData.id + '\" queryValue ="dateStr" dateStr = \"' + queryInput.key + '\" dateEnd="" class="datetimebox"><div class="inputButton"><span class="dropClear">清空</span><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                        $queryInputBoxs.append(queryInputBox);
                        var dateValue = queryInput.options.value;
                        var dateStartValue ='';
                        var dateEndValue ='';

                        if(!xyzIsNull(dateValue)){
                            if(dateValue.lastIndexOf('^')==0){
                                dateStartValue = dateValue.substring(0,dateValue.indexOf('^'));
                            } else if(dateValue.indexOf('^') == 0){
                                dateEndValue = dateValue.substring(dateValue.lastIndexOf('^')+1,dateValue.length);
                            } else{
                                dateStartValue = dateValue.substring(0,dateValue.indexOf('^'));
                                dateEndValue = dateValue.substring(dateValue.lastIndexOf('^')+1,dateValue.length);
                            }
                        }
                        $.datetimepicker.setLocale('zh');
                        $('#dateStart-'+ queryInput.key+that.pluginData.id).datetimepicker({
                            step:5,
                            todayButton:false,
                            value:dateStartValue,
                            format:'Y-m-d H:i'
                        });
                        $('#dateEnd-'+ queryInput.key+that.pluginData.id).datetimepicker({
                            step:5,
                            todayButton:false,
                            value:dateEndValue,
                            format:'Y-m-d H:i'
                        });
                        continue
                    }


                    var queryInputBox = "";
                    if(queryInput.type == "datebox"){
                        queryInputBox = '<div class="queryInputBox"><input type="text" id="search-'  + queryInput.key + that.pluginData.id+ '" queryValue ="' + queryInput.key + '" ><div class="inputButton"><span class="dropClear">清空</span><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                    } else if (queryInput.type == "datetimebox") {
                        queryInputBox = '<div class="queryInputBox"><input type="text" id="search-'  + queryInput.key + that.pluginData.id+ '" queryValue ="' + queryInput.key + '" class="datetimebox"><div class="inputButton"><span class="dropClear">清空</span><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                    }
                    else{
                        queryInputBox = '<div class="queryInputBox"><input type="text" id="search-'  + queryInput.key + that.pluginData.id+ '" queryValue ="' + queryInput.key + '"><div class="inputButton"><span class="finish" queryKey="' + queryInput.key + '">完成</span><span class="plsSearch">查询</span></div></div>';
                    }
                    $queryInputBoxs.append(queryInputBox);

      /*              if(num == 0 && add == false){
                        $queryInputBoxs.append(queryInputBox);
                    } else {
                        if(num - 1 < 0){
                            $queryInputBoxs.find(".queryInputBox").eq(num).before(queryInputBox);
                        } else {
                            $queryInputBoxs.find(".queryInputBox").eq(num-1).after(queryInputBox);
                        }
                    }*/
                    var id = "search-" + queryInput.key + that.pluginData.id;

                    // 生成日历
                    if(queryInput.type == "datebox") {
                        var dateValue = queryInput.options.value;
                        $('#' + id).datebox({
                            width: 118,
                            height:28,
                            panelWidth:276,
                            panelHeight:300,
                            value:dateValue
                        });
                        continue
                    }

                    // 生成combotree
                    if(queryInput.type == "combotree") {

                        let xyzCombotreeData = Object.assign({}, queryInput.options);
                        xyzCombotreeData.width = undefined;


                        var xyzComboboxLazy = queryInput.options.lazy == undefined ? true : queryInput.options.lazy;
                        if (queryInput.options.url) {
                            xyzCombotreeData.url = xyzComboboxLazy ? '' : xyzGetFullUrl(queryInput.options.url);
                        }

                        xyzCombotreeData.url = xyzGetFullUrl(queryInput.options.url);

                        xyzCombotreeData.loadFilter = function (data ,parent) {

                            if(parent){
                                return null;
                            }

                            if (data instanceof Array) {
                                return data;
                            } else {
                                if (data.status == 1) {
                                    return data.content;
                                } else {
                                    return [];
                                }
                            }
                        };

                        /*
                        if (queryInput.options.mode == 'remote') {
                            xyzComboboxData.onShowPanel = function () {
                                var id = $(this)[0].id;
                                var queryvalue = $(this)[0].getAttribute("queryvalue");
                                var queryInput = that.pluginData.data[queryvalue];
                                var url = queryInput.options.url;
                                $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");

                                if (url) {
                                    $('#' + id).combobox("reload", xyzGetFullUrl(url));
                                }

                                if (queryInput.options.onShowPanel != undefined) {
                                    queryInput.options.onShowPanel();
                                }
                            };
                        } else {
                            xyzCombotreeData.onShowPanel = function () {
                                var id = $(this)[0].id;
                                var queryvalue = $(this)[0].getAttribute("queryvalue");
                                var queryInput = that.pluginData.data[queryvalue];
                                var url = queryInput.options.url;

                                $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");
                                if (url) {
                                    if ($('#' + id).combobox("getData").length == 0) {
                                        $('#' + id).combobox("reload", xyzGetFullUrl(url));
                                    }
                                }

                                if (queryInput.options.onShowPanel != undefined) {
                                    queryInput.options.onShowPanel();
                                }
                            };
                        }
                        xyzCombotreeData.mode = queryInput.options.mode == undefined ? 'local' : queryInput.options.mode;
                        */
                        xyzCombotreeData.icons = queryInput.options.icons == undefined ? [{
                            iconCls: 'iconfont icon-clear',
                            handler: function (e) {
                                $(e.data.target).combotree('clear');
                            }
                        }] : queryInput.icons;
                        $('#' + id).combotree(xyzCombotreeData);

                        continue
                    }

                    // 生成日期时间输入框
                    if(queryInput.type == "datetimebox") {
                        var dateValue = queryInput.options.value;
                        $.datetimepicker.setLocale('zh');
                        $('#' + id).datetimepicker({
                            step:5,
                            todayButton:false,
                            value:dateValue,
                            format:'Y-m-d H:i'
                        });
                        continue
                    }
                    //生成comboboxmap[id]
                    if(queryInput.type == 'combobox'){
                        queryInput.options.height=28;
                        queryInput.options.combobox = id;
                        /*console.log($("#"+ id));*/
                        xyzCombobox(queryInput.options);
                        if(queryInput.options.width !== undefined){
                            var width = Number(queryInput.options.width) - 46;
                            var css = "margin-left:0px;margin-right:36px;padding-top:0px;padding-top:0px;padding-bottom:0px;height:26px;line-height:26px;width:"+width+"px!important;";

                            $("#"+ id).combobox("textbox").css("cssText",css);
                        }
                    }else {
                        //生成textbox
                        $("#"+id).textbox({
                            height:28,
                            prompt: queryInput.options.data.prompt,
                            value: queryInput.options.value
                        });
                        xyzTextbox(id);
                    }

                }
            }
        };
        /*--渲染条件的方法--*/
        that.render = function (data) {
            createQueryLi(data);

            createInput(data);
        };
        that.render();
        /* --执行onLoad方法 --*/
        if (typeof that.pluginData.onLoad == "function"){
            $("#"+that.pluginData.id).on("ajaxStop",function () {
                plsSearchData.onLoad();
                $("#"+that.pluginData.id).off("ajaxStop");
            });
        }
        /*--获取查询数据的方法--*/
        that.createSearchData = function (){

            that.searchData = {};//搜索的数据的基本数据
            that.searchAllData = []; //搜索的数据的全部数据

            for(var data in that.pluginData.data) {//遍历总数据
                var searchData = that.pluginData.data[data];
                if(searchData.defaultQuery == "true"){//遍历显示的数据
                    if( typeof searchData.options.value === 'object' ){
                        if(!xyzIsNull(searchData.options.value[0])||searchData.options.value.length > 1){
                            that.searchData[searchData.key] = searchData.options.value.join(',');
                            that.searchAllData.push({key:searchData.key,value:searchData.options.value.join(','),text:searchData.options.text.join(','),html:searchData.options.html.join(',')});
                        }
                    } else {
                        if(!xyzIsNull(searchData.options.value)){
                            that.searchData[searchData.key] = searchData.options.value;
                            that.searchAllData.push({key:searchData.key,value:searchData.options.value,text:searchData.options.text,html:searchData.options.html});
                        }
                    }
                }
            }
            delete that.searchData.AIquery;
        };


        /*--其他设置-点击设置--*/

        /*--点击设置--*/

        var $searchIconLock = $("#"+that.pluginData.id+" .search-main .icon-suo");
        var $searchIconOpenLock = $("#"+that.pluginData.id+" .search-main .icon-jiesuo");
        var $searchSetRestore = $("#"+that.pluginData.id+" .search-setRestore");
        var $searchLablelNowArrows = $("#"+that.pluginData.id+" .lablelNowArrows");



        //点击group组件的数据

        var $searchScrollerLeft = $("#"+that.pluginData.id+" .search-queryScrollerLeft");
        var $searchScrollerRight = $("#"+that.pluginData.id+" .search-queryScrollerRight");
        var queryScroller =  function () {
            var scrollBoxWidth = $searchQueryLabelWrap.width();
            var scrollContentWidth  = $searchLabelsWrapul.children().length*130;//130为li宽度
            if(scrollContentWidth>scrollBoxWidth-130){ //130为search-aiQuery的宽度
                var scrollWidth = scrollContentWidth - scrollBoxWidth + 58 + 130;//58为滚动条左右按钮宽度
                $searchLabelsWrapul.width(scrollContentWidth);
                $searchQueryLabelWrap.addClass("scroll");
                $searchScrollerLeft.show();
                $searchScrollerRight.show();
                if($searchLabelsWrap.find('.icon-clear.now').length>0){
                    $searchLabelsWrapul.css({left:-scrollWidth});
                } else {
                    $searchLabelsWrapul.css({left:0});
                }

                searchScrollerClick(scrollWidth);
            } else {
                $searchLabelsWrapul.width(scrollBoxWidth);
                $searchQueryLabelWrap.removeClass("scroll");
                $searchScrollerLeft.hide();
                $searchScrollerRight.hide();
                $searchLabelsWrapul.unbind("mousewheel");
                $searchLabelsWrapul.css({left:0});
            }
        };
        var searchScrollerClick = function (scrollWidth) {
            var scrollWidth = scrollWidth;
            $searchScrollerLeft.off("click").on("click",function (){
                var left = $searchLabelsWrapul.position().left;
                if(left<-130){
                    $searchLabelsWrapul.css({left:left+130});
                } else {
                    $searchLabelsWrapul.css({left:0});
                }

            });
            $searchScrollerRight.off("click").on("click",function (){
                var left = $searchLabelsWrapul.position().left;
                if(left>-scrollWidth+130) {
                    $searchLabelsWrapul.css({left: left - 130});
                } else {
                    $searchLabelsWrapul.css({left: -scrollWidth});
                }
            });

            $searchLabelsWrapul.bind("mousewheel", function (event, delta) {
                $queryInputBoxs.find('.queryInputBox').has(':visible').find('.finish').click();
                var dir = delta > 0 ? 'Up' : 'Down';
                if (dir === 'Up') {
                    var left = $searchLabelsWrapul.position().left;
                    if(left<-130){
                        $searchLabelsWrapul.css({left:left+130});
                    } else {
                        $searchLabelsWrapul.css({left:0});
                    }
                } else {
                    var left = $searchLabelsWrapul.position().left;
                    if(left>-scrollWidth+130) {
                        $searchLabelsWrapul.css({left: left - 130});
                    } else {
                        $searchLabelsWrapul.css({left: -scrollWidth});
                    }
                }
            });

        };
        queryScroller();

        function isPc() {
            var userAgentInfo = navigator.userAgent;
            var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"];  //判断用户代理头信息
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) !== -1) { flag = false; break; }
            }
            return flag;   //true为pc端，false为非pc端
        }

        $(window).resize(function () {
            if(isPc()){
                $(document).mousedown();
                $queryInputBoxs.find('.finish').click();
            }

            $selectGroupBoxs.hide();
            var timer = setTimeout(function () {
                queryScroller();
                clearTimeout(timer);
            },200);
        })


        //点击group组件
        $selectSelectGroup.on('click',' .search-selectItem',function (item) {
            var num = Object.keys(that.pluginGroup).length;
            $selectGroupBoxs.css({'max-height':that.scrollMaxHeight});
            var scrollContentHeight = 0;

            var index = $(this).index();
            var right = num - index - 1;
            $("#"+that.pluginData.id+" .sbarbox").hide();
            if ($selectGroupBoxs.find('.selectGroupBox').eq(index).is(":hidden")) {
                $selectGroupBoxs.show().css({"right": right * 47});
                $selectGroupBoxs.find('.selectGroupBox').eq(index).addClass('now').siblings().removeClass('now');
            } else {
                $selectGroupBoxs.hide();
                $selectGroupBoxs.find('.selectGroupBox').eq(index).removeClass('now');
            }

            scrollContentHeight =  $selectGroupBoxs.find('.selectGroupBox').eq(index).children().length*29;
            if(scrollContentHeight>that.scrollMaxHeight){//判断是否出现滚动条
                initscroll($selectGroupBoxs.find('.selectGroupBox').eq(index),that.scrollMaxHeight,scrollContentHeight);
            };

            $(document).off(".plsGroupBox").on("mousedown.plsGroupBox mousewheel.plsGroupBox",function(e){
                var p=$(e.target).closest("#"+that.pluginData.id+" .selectGroupBox,#"+that.pluginData.id+" .search-selectGroup");
                if(p.length){
                    return;
                }
                if($selectGroupBoxs.find('.selectGroupBox').is(':visible') == true){
                    $selectGroupBoxs.hide();
                    $(document).off(".plsGroupBox");
                }
            });
        }) ;
        //点击group选项
        $selectGroupBoxs.on('click',' .selectGroupBoxs li',function () {
            $selectGroupBoxs.hide();

            var key = $(this).attr("queryValue");

            if(that.pluginData.data[key].defaultQuery == "true"){
                var $target = $searchLabelsWrapul.find('li').has('a[queryValue="'+key+'"]');
                var index = $target.index();
                $target.click();

            } else {
                that.pluginData.data[key].defaultQuery = "true";

                createQueryLi("clickAdd");
                var $target = $searchLabelsWrapul.find('li').has('a[queryValue="'+key+'"]');
                $target.find('.icon-clear').addClass('now');

                createInput("clickAdd");
                $target.click();
                //判断是否出现超出宽度
                queryScroller();
            }
        });

        //comboboxPanel选中样式重写
        function getComboPanelId(id,type){
            var $query =  $queryInputBoxs.find(".queryInputBox");
            $query.addClass('newQueryBox');
            if(type == "combobox" ||type == "datebox" ||type == "doubleDate"){
                var $panelid = $('#'+id).combobox('panel').parent();
                $panelid.addClass('comboxSelect');
            }else if(type == "combotree"){
                var $panelid = $('#'+id).combobox('panel').parent();
                $panelid.addClass('comboxSelect combotree');
            }
        }
        //点击li搜索选项
        $searchQueryLabelWrap.on('click','li',function () {
            var $this = $(this);
            var $target =  $queryInputBoxs.find(".queryInputBox").eq($this.index());
            var key = $this.find("a").attr("queryValue");
            var maytekQLeft = $("#"+that.pluginData.id).offset().left;
            var documentWidth = $(document).width() - maytekQLeft- 16 ;
            var scrollBoxWidth = $searchLabelsWrap.width();
            var ulLeft = $searchLabelsWrapul.position().left;
            var inputLeft1 = $this.position().left;
            var time = 0;

            $queryInputBoxs.css({width:documentWidth + 'px'});
            if(inputLeft1+130+ulLeft>scrollBoxWidth+1){
                $searchLabelsWrapul.css({left:scrollBoxWidth-inputLeft1-130});
                time = 520;
            }
            if(inputLeft1+ulLeft<0){
                $searchLabelsWrapul.css({left:-inputLeft1});
                time = 520;
            }

            $this.removeClass('now');
            $searchQueryLabelWrap.removeClass('now');

            if($queryInputBoxs.find('.queryInputBox').is(':visible') == true){
                var visiKey = $queryInputBoxs.find('.queryInputBox').has(':visible').find(".finish").attr("querykey");
                $queryInputBoxs.find('.queryInputBox').has(':visible').find('.finish').click();

                if(key == visiKey){
                    return
                }
            }
            if ($target.is(":hidden")) {
                $queryInputBoxs.find('.queryInputBox').hide();
                $queryInputBoxs.show();

                var t = setTimeout(function () {
                    var inputLeft = $this.offset().left-$("#"+that.pluginData.id).offset().left;
                    var $targetWidth = $target.outerWidth();
                    $target.show();

                    $searchLablelNowArrows.css({'left':inputLeft-22+60-that.pluginData.marginLeft});//22为锁的宽度，60为lable框的一半
                    if(documentWidth-inputLeft<$targetWidth){
                        $target.removeAttr('style').css({'right':10});
                    } else {
                        $target.removeAttr('style').css({'left':inputLeft});
                    }

                    $this.addClass("now").siblings().removeClass("now");
                    $searchQueryLabelWrap.addClass('now');
                    $target.show();

                    if(that.pluginData.data[key].type == "combobox"){
                        $target.find('input[queryvalue]').combobox("showPanel");
                    }
                    if(that.pluginData.data[key].type == "datebox"){
                        $target.find('input[queryvalue]').datebox("showPanel");
                    }
                    if(that.pluginData.data[key].type == "datetimebox"){
                        $target.find('input[queryvalue]').datetimepicker("show");
                    }
                    if(that.pluginData.data[key].type == "doubleDate"){
                        $target.on("focus","input",function () {
                            $(this).parent().prev().datebox("showPanel");
                        });
                        $target.find('input[queryvalue]').eq(0).next().find("input").focus();
                    } else if (that.pluginData.data[key].type == "doubleDateTime") {
                        $target.find('input[queryvalue]').eq(0).focus();
                    } else {
                        $target.find("input").focus();
                    }

                    var $targetpanelId = $target.find('input[queryValue]').attr('id');
                    getComboPanelId($targetpanelId,that.pluginData.data[key].type);

                    $(document).off(".plsInputBoxs").on("mousedown.plsInputBoxs",function(e){
                            var p = $(e.target).closest("span.combo,div.combo-p,div.menu,#"+that.pluginData.id+" .queryInputBox,#"+that.pluginData.id+" .search-queryLabelWrap li");
                            if(p.length){
                                return;
                            }
                            if($queryInputBoxs.find('.queryInputBox').is(':visible') == true){

                                $queryInputBoxs.find('.queryInputBox').has(':visible').find('.finish').click();
                                if($queryInputBoxs.find('.queryInputBox').is(':visible') == false){
                                    $(document).off(".plsInputBoxs");
                                }
                            }
                    });
                    $(document).off(".mxkeydown").on("keydown.mxkeydown",function (e) {
                        if(e.which == 13){
                            $(document).mousedown();
                            $target.find(".plsSearch").click();
                        }
                    });
                    $target.find("input").off(".mxkeydown1").on("keydown.mxkeydown1",function (e) {
                        if(e.which == 13){
                            $target.find("input").off(".mxkeydown1");
                            $(document).mousedown();
                            $target.find(".plsSearch").click();
                        }
                    });
                    clearTimeout(t);
                },time);
            } else {
                $queryInputBoxs.hide();
            }
            $selectGroupBoxs.hide();

        });

        //点击aiquery
        $searchAiQuery.find('textarea').on('blur',function () {
            var text = $searchAiQuery.find('textarea').val();
            text = text.replace(/^\s*|\s*$/g,'');//替换字符串，开头和结尾的空格。

            if(text.indexOf(that.pluginData.data.AIquery.options.data.prompt)>-1){
                text = '';
            }

            if(!xyzIsNull(text)){
                var re;
                var key = '';

                if(!xyzIsNull(that.pluginData.data.AIquery.AIMatch)){
                    for(var i=0;i<that.pluginData.data.AIquery.AIMatch.length;i++){
                        if(!xyzIsNull(key)){
                            break
                        }
                        re = new RegExp(that.pluginData.data.AIquery.AIMatch[i].re);

                        if(re.test(text)){
                            key = that.pluginData.data.AIquery.AIMatch[i].key;

                            $searchAiQuery.find('textarea').removeClass('now');
                            $searchAiQuery.find('textarea').val(that.pluginData.data.AIquery.options.data.prompt);
                            $searchAiQuery.find('.icon-clear').removeClass('now');
                        }
                    }
                }

                if(!xyzIsNull(key)){
                    if(!xyzIsNull(that.pluginData.data[key])){

                        if(that.pluginData.data[key].defaultQuery !== "true"){
                            that.pluginData.data[key].options.text = text;
                            that.pluginData.data[key].options.value = text;
                            that.pluginData.data[key].defaultQuery = "true";
                            that.render("clickAdd");

                            $searchLabelsWrap.find('a[queryValue="'+key+'"]').parent().parent().find('.icon-clear').addClass('now');
                            //判断是否出现超出宽度
                            queryScroller();
                        } else {

                            if(that.pluginData.data[key].type == "textbox"){
                                that.pluginData.data[key].options.text = text;
                                that.pluginData.data[key].options.value = text;
                                $("#search-" + key + that.pluginData.id).textbox('setValue',text);
                            }

                            if(that.pluginData.data[key].type == "combobox"){
                                that.pluginData.data[key].options.text = text;
                                that.pluginData.data[key].options.value = text;
                                $("#search-" + key + that.pluginData.id).combobox('setValue',text);
                            }
                            $queryInputBoxs.find('input[queryValue="'+key+'"]').parent().find('.finish').click();

                        }
                    }
                } else {
                    $searchAiQuery.find('textarea').css({color:"red"});
                }


            } else {
                $searchAiQuery.find('textarea').removeClass('now');
                $searchAiQuery.find('textarea').val(that.pluginData.data.AIquery.options.data.prompt);
                $searchAiQuery.find('.icon-clear').removeClass('now');
            }

        });
        $searchAiQuery.find('textarea').on('focus',function () {
            var text = $searchAiQuery.find('textarea').val();
            $searchAiQuery.find('textarea').addClass('now');
            $searchAiQuery.find('.icon-clear').addClass('now');
            $searchAiQuery.find('textarea').removeAttr('style');

            if(text.indexOf(that.pluginData.data.AIquery.options.data.prompt)>-1){
                $searchAiQuery.find('textarea').val('');
            }
        });

        $searchAiQuery.find('textarea').off(".mxkeydown").on("keydown.mxkeydown",function (e) {
            if(e.which == 13){
                $searchAiQuery.find('textarea').blur();
                $('#searchBtn-'+ that.pluginData.id).click();
            }
        });

        //点击清空智能框
        $searchAiQuery.on('click','.icon-clear',function () {
            $searchAiQuery.find('textarea').val('');
            $searchAiQuery.find('textarea').blur();
        });

        //点击完成
        $queryInputBoxs.on('click','.finish',function () {
            //默认canSearch;
            canSearch = true;
            var key = $(this).attr('queryKey');
            var value;
            var text = '';
            var  html = '';
            var $this = $(this).parent().parent().find('input[queryvalue]');

            if(that.pluginData.data[key].type == 'combobox'){
                var htmlData = $this.combobox("getData");

                if(that.pluginData.data[key].options.multiple == true){
                    value = $this.combobox("getValues");
                    value = value.join(',');
                } else {
                    value = $this.combobox("getValue");
                }
                text = $this.combobox("getText");

                //判断是否有resize造成，异步请求数据，取不到text值，text变为value值
                if(that.pluginData.data[key].options.value == value){
                    text = !!that.pluginData.data[key].options.text ? that.pluginData.data[key].options.text : text;
                }

                if(value.substring(0,1) == ","){
                    value = value.substring(1,value.length);
                    text = text.substring(1,text.length);
                }
                if(text.indexOf(',')>-1){
                    text.split(',').forEach(function (v) {
                        var  htmlitem = '';
                        htmlData.forEach(function (t) {
                            if(t.text == v){
                                htmlitem = !xyzIsNull(t.html)?t.html:'';
                            }
                        });
                        html = xyzIsNull(htmlitem)?html+v+',':html+htmlitem;
                    });
                }
            }

            if(that.pluginData.data[key].type == 'textbox'){
                text = $this.textbox("getText");
                value = text;
            }
            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/;
            if(that.pluginData.data[key].type == 'datebox'){
                value = $this.datebox("getValue");
                if(pattern.test(value)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? value = value.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):value;
                    value = value;
                    text = value;
                } else {
                    value = '';
                    text = '';
                }
            }

            //combotree
            if(that.pluginData.data[key].type == 'combotree'){
                var htmlData = $this.combotree('tree');

                if(that.pluginData.data[key].options.multiple == true){
                    value = $this.combotree("getValues");
                    value = value.join(',');
                } else {
                    value = $this.combotree("getValue");
                }
                text = $this.combotree("getText");

                //判断是否有resize造成，异步请求数据，取不到text值，text变为value值
                if(that.pluginData.data[key].options.value == value){
                    text = !!that.pluginData.data[key].options.text ? that.pluginData.data[key].options.text : text;
                }

                if(value.substring(0,1) == ","){
                    value = value.substring(1,value.length);
                    text = text.substring(1,text.length);
                }
                if(text.indexOf(',')>-1){
                    text.split(',').forEach(function (v) {
                        var  htmlitem = '';
                        htmlitem = !xyzIsNull(v.html)?v.html:'';
                        html = xyzIsNull(htmlitem)?html+v+',':html+htmlitem;
                    });
                }
            }

            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
            if(that.pluginData.data[key].type == 'datetimebox'){
                value = $this.val();
                if(pattern.test(value)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? value = value.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):value;
                    text = value;
                    value = !value ? value : value+':00';
                } else {
                    value = '';
                    text = '';
                }
            }

            if(that.pluginData.data[key].type == 'doubleDate'){
                var $dateStart = $(this).parent().parent().find('input[datestart]');
                var $dateEnd = $(this).parent().parent().find('input[dateend]');

                var startValue =$dateStart.datebox("getValue");
                var endValue =$dateEnd.datebox("getValue");
                var startText = '';
                var endText = '';
                //解决双日期，鼠标选择删除，没有清空值的清空。
                if($dateStart.next("span").find("input").eq(0).val() == ""){
                    $dateStart.datebox("clear");
                    startValue = "";
                }
                //解决结束日期>开始日期
                if(new Date(startValue)>new Date(endValue)){
                    $dateStart.datebox("clear");
                    $dateEnd.datebox("clear");
                    startValue = "";
                    endValue = "";
                    $.messager.alert('警告','开始日期大于结束日期');
                    canSearch = false;
                }
                if(pattern.test(startValue)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? startValue = startValue.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):startValue;
                    startValue = startValue;
                    startText = '起'+ startValue ;
                } else {
                    startValue = '';
                    startText = '';
                }

                if(pattern.test(endValue)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? endValue = endValue.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):endValue;
                    endValue = endValue;
                    endText = '止'+ endValue ;
                } else {
                    endValue = '';
                    endText = '';
                }

                value = xyzIsNull(startValue)?xyzIsNull(endValue)?'':'^doubleDate^' + endValue:xyzIsNull(endValue)?startValue + '^doubleDate^':startValue + '^doubleDate^' + endValue;
                text = xyzIsNull(startText)?xyzIsNull(endText)?'':endText:xyzIsNull(endText)?startText:startText + '<br>' + endText;
            }

            if(that.pluginData.data[key].type == 'doubleDateTime'){
                var $dateStart = $(this).parent().parent().find('input[datestart]');
                var $dateEnd = $(this).parent().parent().find('input[dateend]');

                var startValue =$dateStart.val();
                var endValue =$dateEnd.val();
                var startText = '';
                var endText = '';
                //解决双日期，鼠标选择删除，没有清空值的清空。
                if($dateStart.next("span").find("input").eq(0).val() == ""){
                    $dateStart.val("");
                    startValue = "";
                }
                //解决结束日期>开始日期
                if(new Date(startValue)>new Date(endValue)){
                    $dateStart.val("");
                    $dateEnd.val("");
                    startValue = "";
                    endValue = "";
                    $.messager.alert('警告','开始日期大于结束日期');
                    canSearch = false;
                }
                if(pattern.test(startValue)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? startValue = startValue.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):startValue;
                    startValue = startValue;
                    startText = startValue ;
                } else {
                    startValue = '';
                    startText = '';
                }

                if(pattern.test(endValue)){
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value)? endValue = endValue.replace(/(\-|\/|.)(\d{1})/g,"$10$2"):endValue;
                    endValue = endValue;
                    endText = endValue ;
                } else {
                    endValue = '';
                    endText = '';
                }
                startValue = !startValue ? startValue : startValue + ':00';
                endValue = !endValue ? endValue : endValue + ':00';
                value = xyzIsNull(startValue)?xyzIsNull(endValue)?'':'^doubleDate^' + endValue:xyzIsNull(endValue)?startValue + '^doubleDate^':startValue + '^doubleDate^' + endValue;
                text = xyzIsNull(startText)?xyzIsNull(endText)?'':endText:xyzIsNull(endText)?startText:startText + '<br>' + endText;
            }

            if(that.pluginData.data[key].type == 'customSearch'){
                value = that.pluginData.data[key].options.customGetValue(that.pluginData.data[key].options);
                that.pluginData.data[key].options.value = value;
                text = that.pluginData.data[key].options.customGetText(that.pluginData.data[key].options);
                that.pluginData.data[key].options.text = text;
                if(!xyzIsNull(that.pluginData.data[key].options.customGetHtml)){
                    html = that.pluginData.data[key].options.customGetHtml(that.pluginData.data[key].options);
                }
            }

            if(xyzIsNull(text)){
                $searchLabelsWrap.find('a[queryValue="'+key+'"]').parent().parent().removeClass('select');
            } else {
                $searchLabelsWrap.find('a[queryValue="'+key+'"]').parent().parent().addClass('select');
            }

            if(xyzIsNull(html)){
                $searchLabelsWrap.find('a[queryValue="'+key+'"]').next().find('p').html(text);
            } else {
                $searchLabelsWrap.find('a[queryValue="'+key+'"]').next().find('p').html(html);
            }
            $searchLabelsWrap.find('a[queryValue="'+key+'"]').next().attr('title',text) ;

            that.pluginData.data[key].options.value = value;
            that.pluginData.data[key].options.text = text;
            that.pluginData.data[key].options.html = html;

            if(!canSearch){
                return
            }
            $(document).off(".mxkeydown");
            $queryInputBoxs.hide();
            $searchLabelsWrap.find('li').removeClass('now');
            $searchQueryLabelWrap.removeClass('now');
        });
        //点击查询
        $queryInputBoxs.on('click','.plsSearch',function () {
            $(this).prev().click();
            $('#searchBtn-'+ that.pluginData.id).click();
        });
        //点击组件清空
        $queryInputBoxs.on('click','.dropClear',function () {
            $(this).parent().parent().find(".datebox-f").datebox('clear');
            $(this).parent().parent().find(".datetimebox").val('');
        });
        /*--点击可增删设置--*/
        $("#"+that.pluginData.id+" .search-main .search-setSave").toggle(function () {//锁关保存设置，锁开恢复默认设置
            $searchIconLock.hide();
            $searchIconOpenLock.show();
            $searchLabelsWrap.addClass("set");
            $selectGroupBoxs.hide();

        },function () {
            $searchIconLock.show();
            $searchIconOpenLock.hide();
            $searchLabelsWrap.removeClass("set");
            $searchLabelsWrap.find('.icon-clear').removeClass("now");
            $selectGroupBoxs.hide();

            /*设置后上传保存新增减的选项*/
            that.selfQueryContent = {};//搜索的数据的基本数据

            for(var data in that.pluginData.data) {
                var Boole = that.pluginData.data[data].defaultQuery == "true"?"true":"false";
                var value = that.pluginData.data[data].options.value;
                var text = that.pluginData.data[data].options.text;
                var html = that.pluginData.data[data].options.html;

                that.selfQueryContent[data] = {};
                that.selfQueryContent[data].defaultQuery = Boole;

                if( typeof value === 'object' ) {
                    if(!(value.length==1&&xyzIsNull(value[0]))){
                        that.selfQueryContent[data].value = value;
                    }
                } else {
                    if(!xyzIsNull(value)){
                        that.selfQueryContent[data].value = value;
                    }
                }

                if(!xyzIsNull(text)){
                    that.selfQueryContent[data].text = text;
                }

                if(!xyzIsNull(html)){
                    html = html.indexOf('\'')>-1?html:html.replace(/\"/g, '\'');
                    that.selfQueryContent[data].html = html;
                }
                if (Boole === "true" && data !== 'AIquery'){
                    let index = $("#"+that.pluginData.id+" .queryLabelBox a[queryvalue='"+data+"']").parent().parent().index()
                    that.selfQueryContent[data].index = index;
                }
            }
            var keyCode ="searchSelfQuery-" + that.pluginData.id;
            var selfQueryContent = stringify(that.selfQueryContent);
            addHabit(keyCode, selfQueryContent,true);
            top.$.messager.alert("提示","已为您保存默认查询条件<br>下次登录或全页刷新后生效！","info");
        });

        /*--点击删除选择项--*/
        $searchLabelsWrap.on("click",".icon-clear",function (e) {
            var e = e||event;
            e.stopPropagation();
            e.cancelBubble = true;
            var $this = $(this).parent();
            var $target =  $queryInputBoxs.find(".queryInputBox").eq($this.index());
            var key = $this.find("a").attr("queryValue");

            that.pluginData.data[key].defaultQuery = "false";
            that.pluginData.data[key].options.value = "";
            that.pluginData.data[key].options.text = "";

            if(that.pluginData.data[key].type == "combobox"){
                $target.find('input[queryvalue]').combobox("destroy");
            }

            if(that.pluginData.data[key].type == "datebox"){
                $target.find('input[queryvalue]').datebox("destroy");
            }

            if(that.pluginData.data[key].type == "datetimebox"){
                $target.find('input[queryvalue]').datetimepicker("destroy");
            }

            if(that.pluginData.data[key].type == "doubleDate"){
                $target.find('input[queryvalue]').datebox("destroy");
            }

            if(that.pluginData.data[key].type == "doubleDateTime"){
                $target.find('input[queryvalue]').datetimepicker("destroy");
            }

            $queryInputBoxs.find(".queryInputBox").eq($this.index()).remove();
            $this.remove();
            $queryInputBoxs.find('.finish').click();

            queryScroller();
        });

        /*--点击恢复初始选择项--*/
        $searchSetRestore.click(function () {
           top.mangerLaoding && top.mangerLaoding.reload(top.app.iframeGroup[top.app.tabsSelected].numberCode);
           $selectGroupBoxs.hide();
           $searchAiQuery.find('.icon-clear').click();

           var keyCode ="searchSelfQuery-" + that.pluginData.id;
           addHabit(keyCode, "", "",
              function () {
              updateUserOper(keyCode, "")});//清除自定义设置
            that.pluginData = parseJson(stringify(that.defaultPluginData));
            that.init();
            that.render("default");
            queryScroller();
            top.mangerLaoding && top.mangerLaoding.remove(top.app.iframeGroup[top.app.tabsSelected].numberCode);
        });

        /*--点击清空选值--*/
        $searchClearLablel.click(function () {
            //清除选择值
            for(var input in that.pluginData.data){//遍历总数据
                var queryInput = that.pluginData.data[input];

                if(queryInput.defaultQuery == "true") {//判断显示的搜索选项

                    //智能
                    if (queryInput.key == 'AIquery') {
                        continue
                    }
                    queryInput.options.value = '';
                    queryInput.options.text = '';
                    queryInput.options.html = '';
                }
            }

            //清除input框值
            $searchAiQuery.find('textarea').val('');
            $searchAiQuery.find('textarea').blur();
            $queryInputBoxs.find("a.icon-clear").click();
            $queryInputBoxs.find(".datebox-f").datebox('clear');
            $queryInputBoxs.find(".datetimebox").val('');

            $queryInputBoxs.find('input[customsearch]').map(function (t) {
                var key = $(this).attr('queryvalue');
                if(!xyzIsNull(that.pluginData.data[key].options.customSetValue)){
                    that.pluginData.data[key].options.customSetValue(that.pluginData.data[key].options);
                }
                if(!xyzIsNull(that.pluginData.data[key].options.customSetText)){
                    that.pluginData.data[key].options.customSetText(that.pluginData.data[key].options);
                }
            });

            //清除labelli框值
            $searchLabelsWrap.find('div[title]').attr('title','');
            $searchLabelsWrap.find('p').html('');
            $searchLabelsWrap.find('li').removeClass('select');

            $selectGroupBoxs.hide();

        });

        var num = 0;
        /*--点击搜索按钮查询--*/
        that.getSearchData = function () {
            $selectGroupBoxs.hide();
            that.createSearchData();
            if(num == 0 && !isSelfData){
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryYes';
            } else {
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryNo';
            }
            num++;
            that.searchData =  stringify(that.searchData);
            return that.searchData
        };

        //点击查询按钮
        $('#searchBtn-'+ that.pluginData.id).click(function () {
            if(!canSearch){
                canSearch = true;
                return
            }
            var data =  that.getSearchData();
            if( typeof that.pluginData.onQuery === 'function'){
                plsSearchData.onQuery(data);
            } else {
                return data;
            }
        });
        /**/
        that.setValue = function (data) {
            if(!that.pluginData.data[data.key]){
                return
            }
            if(!that.pluginData.data[data.key].defaultQuery || that.pluginData.data[data.key].defaultQuery == "false"){
                that.pluginData.data[data.key].defaultQuery = "true";
                createQueryLi("clickAdd");
                createInput("clickAdd");
                //判断是否出现超出宽度
                queryScroller();
            }
            var type = that.pluginData.data[data.key].type;

            if(type == 'customSearch'){
                if(typeof data.value == "object"){
                    data.value = data.value.join(',');
                }
                that.pluginData.data[data.key].options.value = data.value;
                if(!xyzIsNull(that.pluginData.data[data.key].options.customSetValue)){
                    that.pluginData.data[data.key].options.customSetValue(that.pluginData.data[data.key].options);
                }
                $queryInputBoxs.find('input[queryValue="'+data.key+'"]').parent().find('.finish').click();
                return

            }
            if(type == 'doubleDate') {
                var dateStartValue ='';
                var dateEndValue ='';
                if(!xyzIsNull(data.value)){
                    if(data.value.lastIndexOf('^')==0){
                        dateStartValue = data.value.substring(0,data.value.indexOf('^'));
                    } else if(data.value.indexOf('^') == 0){
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^')+1,data.value.length);
                    } else{
                        dateStartValue = data.value.substring(0,data.value.indexOf('^'));
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^')+1,data.value.length);
                    }
                }
                $('#dateStart-'+ data.key+that.pluginData.id).datebox({
                    value:dateStartValue
                });
                $('#dateEnd-'+ data.key+that.pluginData.id).datebox({
                    value:dateEndValue
                });
                $queryInputBoxs.find('input[datestr="'+data.key+'"]').parent().find('.finish').click();
                return
            }
            if(type == 'doubleDateTime') {
                var dateStartValue ='';
                var dateEndValue ='';
                if(!xyzIsNull(data.value)){
                    if(data.value.lastIndexOf('^')==0){
                        dateStartValue = data.value.substring(0,data.value.indexOf('^'));
                    } else if(data.value.indexOf('^') == 0){
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^')+1,data.value.length);
                    } else{
                        dateStartValue = data.value.substring(0,data.value.indexOf('^'));
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^')+1,data.value.length);
                    }
                }

                // 消除秒
                dateStartValue = dateStartValue.indexOf(":") > 1 ? dateStartValue.substring(0,dateStartValue.length-3) : dateStartValue
                dateEndValue =  dateEndValue.indexOf(":") > 1 ? dateEndValue.substring(0,dateEndValue.length-3) : dateEndValue
                $('#dateStart-'+ data.key+that.pluginData.id).val(dateStartValue);
                $('#dateEnd-'+ data.key+that.pluginData.id).val(dateEndValue);

                $queryInputBoxs.find('input[datestr="'+data.key+'"]').parent().find('.finish').click();
                return
            }

            if(type == 'datetimebox'){
                data.value =  data.value.indexOf(":") > 1 ? data.value.substring(0,data.value.length-3) : data.value

                $queryInputBoxs.find('input[queryValue="'+data.key+'"]').val(data.value)
                $queryInputBoxs.find('input[datestr="'+data.key+'"]').parent().find('.finish').click();
                return;
            }

            if(that.pluginData.data[data.key].options.multiple == true){
                if(typeof data.value == "string"){
                    data.value = data.value.split(',');
                }
                $queryInputBoxs.find('input[queryValue="'+data.key+'"]')[type]('setValues',data.value);
            } else {
                $queryInputBoxs.find('input[queryValue="'+data.key+'"]')[type]('setValue',data.value);
            }
            var key = $queryInputBoxs.find(">div:visible").find(">input").attr("queryvalue");
            if(key != data.key && !!key){
                $queryInputBoxs.find('input[queryValue="'+key+'"]').parent().find('.finish').click();

                if(!xyzIsNull(data.text)){
                    that.pluginData.data[key].options.text = data.text;
                    $searchLabelsWrap.find('a[queryValue="'+key+'"]').next().find('p').html(data.text);
                }
                if(xyzIsNull(data.html)){
                    that.pluginData.data[key].options.html = data.html;
                    $searchLabelsWrap.find('a[queryValue="'+key+'"]').next().find('p').html(data.html);
                }
            }

            $queryInputBoxs.find('input[queryValue="'+data.key+'"]').parent().find('.finish').click();
            if(!xyzIsNull(data.text)){
                that.pluginData.data[data.key].options.text = data.text;
                $searchLabelsWrap.find('a[queryValue="'+data.key+'"]').next().find('p').html(data.text);
            }
            if(!xyzIsNull(data.html)){
                that.pluginData.data[data.key].options.html = data.html;
                $searchLabelsWrap.find('a[queryValue="'+data.key+'"]').next().find('p').html(data.html);
            }

        };

        that.getValue = function (data) {
            return that.pluginData.data[data.key].options.value
        };

        that.getText = function (data) {
            return that.pluginData.data[data.key].options.text
        };

        that.getHtml = function (data) {
            return that.pluginData.data[data.key].optdocument.titleions.html
        };
        that.destroy = function () {
            $searchLabelsWrap.find(".icon-clear").click();
            $("#"+that.pluginData.id).html("");
        };
    }
    var MaytekQ = {};
    var map = {};

    MaytekQ.init = function(data){
        if(xyzIsNull(data)||xyzIsNull(data.id)){
            return
        }
        if($("#"+data.id).length<1){
            return
        }

        if(!map[data.id]){
            map[data.id] = new PlsSearchPlugin(data);
        } else {
            for(var k in data){
                if( k == 'group'){
                    var group = data[k];
                    for(var g in group){
                        map[data.id].pluginData.group[g] = group[g];
                    }

                    continue
                }
                map[data.id].pluginData[k] = data[k];
            }

            map[data.id].init();
            map[data.id].creatGroup();
            map[data.id].render();
        }
    };

    MaytekQ.setValue = function(id, key, value){
        if(!map[id]){
            return '';
        }
        if(typeof key == "string"){
            var data = {key:key,value:value};
            map[id].setValue(data);
            return
        }
        if(typeof key == "object"){
            for( var item in key ){
                map[id].setValue({key:item,value:key[item]});
            }
        }
    };

    MaytekQ.setKeyData = function(id, keyData){
        if(!map[id]){
            return '';
        }
        if(Array.isArray(keyData)){
            keyData.forEach(function (t) {
                map[id].setValue(t);
            });
            return
        } else if( typeof keyData == "object"){
            map[id].setValue(keyData);
        }
    };

    MaytekQ.getValue = function(id, key){
        if(!map[id]){
            return '';
        }
        var data = {key:key};
        return map[id].getValue(data);
    };

    MaytekQ.getText = function(id, key){
        if(!map[id]){
            return '';
        }
        var data = {key:key};
        return map[id].getText(data);
    };

    MaytekQ.getKeyData = function(id, key){
        if(!map[id]){
            return '';
        }
        if(xyzIsNull(key)){
            map[id].createSearchData();
            return map[id].searchAllData
        } else {
            return {key:key,value:map[id].getValue(data),text:map[id].getText(data),html:map[id].getHtml(data)};
        }
    }
    MaytekQ.getHtml = function(id, key){
        if(!map[id]){
            return '';
        }
        var data = {key:key};
        return map[id].getHtml(data);
    };

    MaytekQ.getData = function(id){
        if(!map[id]){
            return {};
        }
        return map[id].getSearchData();
    };

    MaytekQ.getId = function(id,key){
        if(!map[id]){
            return {};
        }
        var inputId ="";

        var type = map[id].pluginData.data[key].type;

        if(type == 'customSearch'){
            inputId = $("#"+id+" .queryInputBoxs").find('input[queryvalue="'+key+'"]').prev().attr('id');
        }
        if(type == 'doubleDateTime'){
            var startId = $("#"+id+" .queryInputBoxs").find('input[datestr="'+key+'"]').eq(0).attr('id');
            var endId = $("#"+id+" .queryInputBoxs").find('input[datestr="'+key+'"]').eq(1).attr('id');
            inputId = [startId,endId];
        }
        if(type == 'doubleDate'){
            var startId = $("#"+id+" .queryInputBoxs").find('input[datestr="'+key+'"]').eq(0).attr('id');
            var endId = $("#"+id+" .queryInputBoxs").find('input[datestr="'+key+'"]').eq(1).attr('id');
            inputId = [startId,endId];
        } else {
            inputId = $("#"+id+" .queryInputBoxs").find('input[queryvalue="'+key+'"]').attr('id');
        }

        return inputId;
    };

    MaytekQ.clear = function(id){
        if(!map[id]){
            return {};
        }
        $('#'+id+' .search-clearLablel').click();
    };

    MaytekQ.hasMaytekQ = function(id){
    	if(!map[id]){
    		return false;
    	} else {
    		return true;
    	}
    }
    MaytekQ.destroy = function(id){
        if(!map[id]){
            return;
        }
        map[id].destroy();
        delete map[id];

    }
    window.MaytekQ = MaytekQ;
};
function mobileMaytekQ() {
    //创建插件对象
    var MaytekQ = {};
    //创建插件对象的集合
    var map = {};

    /*--插件对象内的公共方法-开始--*/
    // 判断为空
    var xyzIsNull = function (obj) {
        if (obj == undefined || obj == null || obj === "" || obj === '') {
            return true;
        } else {
            return false;
        }
    };
    /*--插件对象内的公共方法-结束--*/

    //创建插件的工厂对象
    function MaytekQMobile(plsSearchData) {
        /*--全局变量名-开始--*/
        var that = this;

        //浅拷贝传入值，以及设置默认值
        that.defaultPluginData = Object.assign({}, plsSearchData);//保存配置数据
        that.pluginData = Object.assign({}, plsSearchData);//默认数据

        that.pluginData.data = {};//查询总数据
        that.searchData = {};//查询的数据

        //判断是否可以查询
        var canSearch = true;
        //获取local
        var historyQuery = [];
        var historyQueryText = [];
        //历史查询条件标识符
        var historyName =
            top.window.app.userBaseInfo.securityUser.username + "_" +
            self.frameElement.id + "_"  +
            window.location.host + "_"  +
            window.location.pathname + "_" +
            that.pluginData.id;

        //拖拽排序插件
        var sortable;


        //添加group数据到主数据的方法名
        that.initData;

        //渲染组件的方法名
        that.render;

        //获取数据的方法名
        that.getSearchData;

        /*--全局变量名-结束--*/

        /*--初始化数据--*/

        //添加group数据到主数据的方法
        that.initData = function () {
            if (xyzIsNull(that.pluginData.id)) {
                return
            }
            that.pluginData.data = {};

            if (xyzIsNull(that.pluginData.group)) {
                that.pluginData.group = {
                    "allQuery": {
                        value: "allQuery",
                        text: '更多',
                        data: []
                    }
                }
            }

            //遍历group一级数据
            for (var group in that.pluginData.group) {
                var groupData = that.pluginData.group[group];

                //遍历group二级数据
                for (var i = 0; i < groupData.data.length; i++) {
                    var key = groupData.data[i].key;
                    //把group数据添加进插件组数据
                    if (!xyzIsNull(key)) {
                        that.pluginData.data[key] = groupData.data[i];
                    }
                }
            }

            //给不规范的数据增加属性
            that.pluginData.uniqueId = xyzIsNull(that.pluginData.uniqueId)? that.pluginData.id : that.pluginData.uniqueId;
            for (var data in that.pluginData.data) {
                //给不规范的数据增加属性
                if (that.pluginData.data[data].key == "AIquery") {
                    delete that.pluginData.data[data]
                    continue
                }
                if (xyzIsNull(that.pluginData.data[data].type)) {
                    that.pluginData.data[data].type = "textbox";
                }
                if (xyzIsNull(that.pluginData.data[data].options)) {
                    that.pluginData.data[data].options = {};
                }
                if (xyzIsNull(that.pluginData.data[data].options.data)) {
                    that.pluginData.data[data].options.data = [];
                }
                if (xyzIsNull(that.pluginData.data[data].options.value)) {
                    that.pluginData.data[data].options.value = "";
                }
                if (xyzIsNull(that.pluginData.data[data].options.text)) {
                    that.pluginData.data[data].options.text = "";
                }
                if (xyzIsNull(that.pluginData.data[data].options.html)) {
                    that.pluginData.data[data].options.html = "";
                }
            }
        };

        //初始化数据
        that.init = function () {
            //初始化数据
            that.initData();
            var Query = localStorage.getItem("historyQuery" + historyName);
            var QueryText = localStorage.getItem("historyQueryText" + historyName);

            //是否有默认查询条件
            if (!!Query) {
                historyQuery = JSON.parse(Query);
            }
            if (!!QueryText) {
                historyQueryText = JSON.parse(QueryText);
            }
        };
        that.init();

        /*--创建插件的搜索框的方法--*/
        function creatSearchBox() {
            var mxSearch = document.getElementById(that.pluginData.id);
            //创建查询框
            var mxSearchBox = document.createElement("div");
            var mxSearchBoxDiv = document.createElement("div");
            mxSearchBoxDiv.id = that.pluginData.id + "searchBox";
            mxSearchBox.className = "searchBox";
            var ico = document.createElement("i");
            ico.className = "iconfont icon-search";
            mxSearchBoxDiv.appendChild(ico);
            var searchInput = document.createElement("input");
            searchInput.id = that.pluginData.id + "searchBoxInput";
            searchInput.readOnly = true;
            // searchInput.className = "text-overflow";
            mxSearchBoxDiv.appendChild(searchInput);
            var clear = document.createElement("i");
            clear.className = "iconfont icon-clear";
            mxSearchBoxDiv.appendChild(clear);

            mxSearch.appendChild(mxSearchBox);
            mxSearchBox.appendChild(mxSearchBoxDiv);
        };

        /*--创建插件外框的方法--*/
        function createBox() {
            //创建第一层
            var mask = document.createElement("div");
            var box = document.createElement("div");
            box.id = that.pluginData.id + "MaytekQMobile";
            box.className = "MaytekQMobile";
            mask.id = that.pluginData.id + "mask";
            mask.className = "mask";
            document.getElementsByTagName("body")[0].appendChild(mask);
            document.getElementsByTagName("body")[0].appendChild(box);
            //创建第二层
            var header = document.createElement("header");
            var queryContent = document.createElement("section");
            var history = document.createElement("section");
            var queryInput = document.createElement("section");
            var button = document.createElement("section");

            queryContent.className = "queryContent";
            history.className = "history";
            queryInput.className = "queryInput";
            button.className = "button-mainWrap";
            box.appendChild(header);
            box.appendChild(queryContent);
            queryContent.appendChild(history);
            queryContent.appendChild(queryInput);
            box.appendChild(button);

            //创建第三层
            //header
            var headerIco = document.createElement("i");
            headerIco.className = "iconfont icon-navdown";
            header.appendChild(headerIco);
            var headerSpan = document.createElement("span");
            var headerNode = document.createTextNode("查询");
            header.appendChild(headerSpan);
            headerSpan.appendChild(headerNode);
            //history
            var historyH2 = document.createElement("h2");
            var historyNode = document.createTextNode("历史查询");
            history.appendChild(historyH2);
            historyH2.appendChild(historyNode);

            var historyUl = document.createElement("ul");
            historyUl.className = "historyList";
            history.appendChild(historyUl);

            //queryInput
            var queryH2 = document.createElement("h2");
            var queryNode = document.createTextNode("新建查询");
            queryInput.appendChild(queryH2);
            queryH2.appendChild(queryNode);
            var queryI = document.createElement("i");
            queryI.className = "iconfont icon-suo";
            queryH2.appendChild(queryI);

            var queryUl = document.createElement("ul");
            queryUl.className = "queryInputBoxs";
            queryInput.appendChild(queryUl);

            //button-mainWrap
            var buttonClear = document.createElement("div");
            buttonClear.className = "search-clearLablel";
            var buttonClearNode = document.createTextNode("清空条件");
            button.appendChild(buttonClear);
            buttonClear.appendChild(buttonClearNode);

            var buttonSearch = document.createElement("div");
            buttonSearch.id = 'searchBtn-' + that.pluginData.id;
            buttonSearch.className = "search";
            var buttonSearchNode = document.createTextNode("开始查找");
            button.appendChild(buttonSearch);
            buttonSearch.appendChild(buttonSearchNode);
        };
        /*--创建历史的方法--*/
        function createHistory() {
            //初始没有本地储存返回
            if (xyzIsNull(localStorage.getItem("historyQueryText" + historyName))) {
                return
            }
            var $historyList = document.querySelectorAll("#" + that.pluginData.id + "MaytekQMobile .historyList")[0];
            //每次进入查询页面都会创建一次历史查询，清空重新渲染
            $($historyList).html("");
            //创建html，li
            historyQueryText.forEach(function (value) {
                var li = document.createElement("li");
                var p = document.createElement("p");
                p.className = "text-overflow";
                var i = document.createElement("i");
                i.className = "iconfont icon-clear";
                li.appendChild(p);
                li.appendChild(i);

                var text = JSON.parse(value);
                var showText = "";
                for (var t in text) {
                    showText += text[t] + ",";
                }
                var textNode = document.createTextNode(showText);
                p.appendChild(textNode);

                $historyList.appendChild(li);
            })
        };

        /*--生成搜索选框的方法--*/
        function createInput() {
            for (var input in that.pluginData.data) {//遍历总数据
                var queryInput = that.pluginData.data[input];
                var queryInputBox = document.createElement("li");
                queryInputBox.setAttribute("data-id",queryInput.key+that.pluginData.id);
                var label = document.createElement("div");
                var labelText = document.createTextNode(queryInput.keyLabel);
                label.className = "label text-overflow";
                label.appendChild(labelText);
                queryInputBox.appendChild(label);

                var query = document.createElement("div");
                query.className = "query";
                queryInputBox.appendChild(query);
                var $queryInputBoxs = document.querySelectorAll("#" + that.pluginData.id + "MaytekQMobile" + " .queryInputBoxs")[0];
                $queryInputBoxs.appendChild(queryInputBox);
                //生成自定义
                if (queryInput.type == 'customSearch') {
                    var customSearch = document.createElement("div");
                    customSearch.id = 'custom-' + queryInput.key + that.pluginData.id;
                    customSearch.className = 'customInputBox';
                    customSearch.innerHTML = queryInput.options.customHtml;
                    var customInput = document.createElement("input");
                    customInput.id = 'search-' + queryInput.key + that.pluginData.id;
                    customInput.type = 'hidden';
                    customInput.disabled = true;
                    customInput.setAttribute("queryValue", queryInput.key);
                    customInput.setAttribute("customsearch", "");

                    query.appendChild(customSearch);
                    query.appendChild(customInput);

                    that.pluginData.data[queryInput.key].options.id = 'custom-' + queryInput.key + that.pluginData.id;

                    if (!xyzIsNull(queryInput.options.customOnload)) {
                        queryInput.options.customOnload(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customSetValue)) {
                        queryInput.options.customSetValue(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customSetText)) {
                        queryInput.options.customSetText(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetValue)) {
                        queryInput.options.customGetValue(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetText)) {
                        queryInput.options.customGetText(queryInput.options);
                    }
                    if (!xyzIsNull(queryInput.options.customGetHtml)) {
                        queryInput.options.customGetHtml(queryInput.options);
                    }
                    continue
                }

                //生成doubledate
                if (queryInput.type == "doubleDate") {
                    var dateStart_input = document.createElement("input");
                    dateStart_input.id = 'dateStart-' + queryInput.key + that.pluginData.id;
                    dateStart_input.setAttribute("queryValue", "dateStr");
                    dateStart_input.setAttribute("dateStr", queryInput.key);
                    dateStart_input.setAttribute("dateStart", "");

                    var dateEnd_input = document.createElement("input");
                    dateEnd_input.id = 'dateEnd-' + queryInput.key + that.pluginData.id;
                    dateEnd_input.setAttribute("queryValue", "dateStr");
                    dateEnd_input.setAttribute("dateStr", queryInput.key);
                    dateEnd_input.setAttribute("dateEnd", "");

                    query.appendChild(dateStart_input);
                    query.appendChild(dateEnd_input);

                    var dateValue = queryInput.options.value;
                    var dateStartValue = '';
                    var dateEndValue = '';

                    if (!xyzIsNull(dateValue)) {
                        if (dateValue.lastIndexOf('^') == 0) {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                        } else if (dateValue.indexOf('^') == 0) {
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        } else {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        }
                    }

                    $('#dateStart-' + queryInput.key + that.pluginData.id).datebox({
                        width: 118,
                        value: dateStartValue
                    });
                    $('#dateEnd-' + queryInput.key + that.pluginData.id).datebox({
                        width: 118,
                        value: dateEndValue
                    });
                    continue
                }

                //生成doubledateTime
                if (queryInput.type == "doubleDateTime") {
                    var dateStart_input = document.createElement("input");
                    dateStart_input.id = 'dateStart-' + queryInput.key + that.pluginData.id;
                    dateStart_input.setAttribute("queryValue", "dateStr");
                    dateStart_input.setAttribute("dateStr", queryInput.key);
                    dateStart_input.setAttribute("dateStart", "");
                    dateStart_input.setAttribute("class", "datetimebox");

                    var dateEnd_input = document.createElement("input");
                    dateEnd_input.id = 'dateEnd-' + queryInput.key + that.pluginData.id;
                    dateEnd_input.setAttribute("queryValue", "dateStr");
                    dateEnd_input.setAttribute("dateStr", queryInput.key);
                    dateEnd_input.setAttribute("dateEnd", "");
                    dateEnd_input.setAttribute("class", "datetimebox");

                    query.appendChild(dateStart_input);
                    query.appendChild(dateEnd_input);

                    var dateValue = queryInput.options.value;
                    var dateStartValue = '';
                    var dateEndValue = '';

                    if (!xyzIsNull(dateValue)) {
                        if (dateValue.lastIndexOf('^') == 0) {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                        } else if (dateValue.indexOf('^') == 0) {
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        } else {
                            dateStartValue = dateValue.substring(0, dateValue.indexOf('^'));
                            dateEndValue = dateValue.substring(dateValue.lastIndexOf('^') + 1, dateValue.length);
                        }
                    }
                    $.datetimepicker.setLocale('zh');
                    $('#dateStart-' + queryInput.key + that.pluginData.id).datetimepicker({
                        step:5,
                        todayButton:false,
                        value:dateStartValue,
                        format:'Y-m-d H:i'
                    });
                    $('#dateEnd-' + queryInput.key + that.pluginData.id).datetimepicker({
                        step:5,
                        todayButton:false,
                        value:dateEndValue,
                        format:'Y-m-d H:i'
                    });
                    continue
                }
                //创建输入框
                var id = "search-" + queryInput.key + that.pluginData.id;
                var input = document.createElement("input");
                query.className = "query";
                input.className = "maytekQinput";
                input.type = "text";
                input.id = id;
                input.setAttribute("queryValue", queryInput.key);
                query.appendChild(input);

                // 生成日历
                if (queryInput.type == "datebox") {
                    var dateValue = queryInput.options.value;
                    $('#' + id).datebox({
                        value: dateValue
                    });
                    continue
                }
                // 生成日期时间输入框
                if (queryInput.type == "datetimebox") {
                    input.classList.add("datetimebox");
                    var dateValue = queryInput.options.value;
                    $.datetimepicker.setLocale('zh');
                    $('#' + id).datetimepicker({
                        width: 118,
                        height:28,
                        step:5,
                        todayButton:false,
                        value:dateValue,
                        format:'Y-m-d H:i'
                    });
                    continue
                }

                //生成combobox[id]
                if (queryInput.type == 'combobox') {
                    var xyzComboboxData = Object.assign({}, queryInput.options);
                    xyzComboboxData.width = undefined;
                    xyzComboboxData.groupField = queryInput.options.groupField == undefined ? 'group' : queryInput.options.groupField;
                    xyzComboboxData.valueField = queryInput.options.valueField == undefined ? 'value' : queryInput.options.valueField;
                    xyzComboboxData.textField = queryInput.options.textField == undefined ? 'text' : queryInput.options.textField;
                    xyzComboboxData.loadFilter = function (data) {
                        if (data instanceof Array) {
                            return data;
                        } else {
                            if (data.status == 1) {
                                return data.content;
                            } else {
                                return [];
                            }
                        }
                    };
                    var xyzComboboxLazy = queryInput.options.lazy == undefined ? true : queryInput.options.lazy;
                    if (queryInput.options.url) {
                        xyzComboboxData.url = xyzComboboxLazy ? '' : xyzGetFullUrl(queryInput.options.url);
                    }
                    if (queryInput.options.mode == 'remote') {
                        xyzComboboxData.onShowPanel = function () {
                            var id = $(this)[0].id;
                            var queryvalue = $(this)[0].getAttribute("queryvalue");
                            var queryInput = that.pluginData.data[queryvalue];
                            var url = queryInput.options.url;
                            $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");

                            if (url) {
                                $('#' + id).combobox("reload", xyzGetFullUrl(url));
                            }

                            if (queryInput.options.onShowPanel != undefined) {
                                queryInput.options.onShowPanel();
                            }
                        };
                    } else {
                        xyzComboboxData.onShowPanel = function () {
                            var id = $(this)[0].id;
                            var queryvalue = $(this)[0].getAttribute("queryvalue");
                            var queryInput = that.pluginData.data[queryvalue];
                            var url = queryInput.options.url;

                            $('#' + id).combobox("panel").parent().not(".mxMobilePanel").addClass("mxMobilePanel");
                            if (url) {
                                if ($('#' + id).combobox("getData").length == 0) {
                                    $('#' + id).combobox("reload", xyzGetFullUrl(url));
                                }
                            }

                            if (queryInput.options.onShowPanel != undefined) {
                                queryInput.options.onShowPanel();
                            }
                        };
                    }
                    xyzComboboxData.mode = queryInput.options.mode == undefined ? 'local' : queryInput.options.mode;
                    xyzComboboxData.icons = queryInput.options.icons == undefined ? [{
                        iconCls: 'iconfont icon-clear',
                        handler: function (e) {
                            $(e.data.target).combobox('clear');
                        }
                    }] : queryInput.icons;
                    $('#' + id).combobox(xyzComboboxData);
                }else {
                    //生成textbox
                    $("#" + id).textbox({
                        prompt: queryInput.options.data.prompt,
                        value: queryInput.options.value,
                        icons: [{
                            iconCls: 'iconfont icon-clear',
                            handler: function (e) {
                                $(e.data.target).textbox('setValue', '');
                                $(e.currentTarget.nextElementSibling).focus();
                            }
                        }]
                    });
                }

            }
        };

        /*--sortQueryInput--*/
        function sortQueryInput(){
            var queryUl = $("#" + that.pluginData.id + "MaytekQMobile .queryInputBoxs" )[0];
            //设置排序
            sortable = new Sortable(queryUl, {
                group:"sortable",
                animation: 150,
                disabled:true,
                handle: ".label.text-overflow",
                store:{
                    get: function (sortable) {
                        var order = localStorage.getItem(sortable.options.group.name + historyName);
                        return order ? order.split('|') : [];
                    },
                    set: function (sortable) {
                        var order = sortable.toArray();
                        localStorage.setItem(sortable.options.group.name + historyName, order.join('|'));
                    }
                }
            });
        }
        /*--渲染条件的方法--*/
        that.render = function () {
            creatSearchBox();
            createBox();
            createHistory();
            createInput();
            sortQueryInput();
        };
        that.render();

        /* --执行onLoad方法 --*/
        if (typeof that.pluginData.onLoad == "function") {
            $("#" + that.pluginData.id + "MaytekQMobile").on("ajaxStop", function () {
                plsSearchData.onLoad();
                $("#" + that.pluginData.id+ "MaytekQMobile").off("ajaxStop");
            });
        }

        /*--获取查询数据的方法--*/
        function finish(key) {
            //默认canSearch;
            canSearch = true;
            // var key = $(this).attr('queryKey');
            var value;
            var text = '';
            var html = '';
            var $this = $('input[queryvalue="' + key + '"]');

            if (that.pluginData.data[key].type == 'combobox') {
                var htmlData = $this.combobox("getData");

                if (that.pluginData.data[key].options.multiple == true) {
                    value = $this.combobox("getValues");
                    value = value.join(',');
                } else {
                    value = $this.combobox("getValue");
                }
                text = $this.combobox("getText");

                if (value.substring(0, 1) == ",") {
                    value = value.substring(1, value.length);
                    text = text.substring(1, text.length);
                }
                if (text.indexOf(',') > -1) {
                    text.split(',').forEach(function (v) {
                        var htmlitem = '';
                        htmlData.forEach(function (t) {
                            if (t.text == v) {
                                htmlitem = !xyzIsNull(t.html) ? t.html : '';
                            }
                        });
                        html = xyzIsNull(htmlitem) ? html + v + ',' : html + htmlitem;
                    });
                }
            }

            if (that.pluginData.data[key].type == 'textbox') {
                text = $this.textbox("getText");
                value = text;
            }

            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}$/;
            if (that.pluginData.data[key].type == 'datebox') {
                value = $this.datebox("getValue");

                if (pattern.test(value)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? value = value.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : value;
                    value = value;
                    text = value;
                } else {
                    value = '';
                    text = '';
                }
            }
            var pattern = /^\d{4}(\-|\/|.)\d{1,2}\1\d{1,2}/;
            if (that.pluginData.data[key].type == 'datetimebox') {
                value = $this.val();
                if (pattern.test(value)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? value = value.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : value;
                    text = value;
                    value = !value? value: value + ':00';
                } else {
                    value = '';
                    text = '';
                }
            }

            if (that.pluginData.data[key].type == 'doubleDate') {
                var $dateStart = $('input[datestr="' + key + '"][datestart]');
                var $dateEnd = $('input[datestr="' + key + '"][dateend]');
                var startValue = $dateStart.datebox("getValue");
                var endValue = $dateEnd.datebox("getValue");
                var startText = '';
                var endText = '';
                //解决双日期，鼠标选择删除，没有清空值的清空。
                if ($dateStart.next("span").find("input").eq(0).val() == "") {
                    $dateStart.datebox("clear");
                    startValue = "";
                }

                //解决结束日期>开始日期
                if (new Date(startValue) > new Date(endValue)) {
                    $dateStart.datebox("clear");
                    $dateEnd.datebox("clear");
                    startValue = "";
                    endValue = "";
                    $.messager.alert('警告', '开始日期大于结束日期');
                    canSearch = false;
                }

                if (pattern.test(startValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? startValue = startValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : startValue;
                    startValue = startValue;
                    startText = '起' + startValue;
                } else {
                    startValue = '';
                    startText = '';
                }

                if (pattern.test(endValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? endValue = endValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : endValue;
                    endValue = endValue;
                    endText = '止' + endValue;
                } else {
                    endValue = '';
                    endText = '';
                }

                value = xyzIsNull(startValue) ? xyzIsNull(endValue) ? '' : '^doubleDate^' + endValue : xyzIsNull(endValue) ? startValue + '^doubleDate^' : startValue + '^doubleDate^' + endValue;
                text = xyzIsNull(startText) ? xyzIsNull(endText) ? '' : endText : xyzIsNull(endText) ? startText : startText + endText;
            }
            if (that.pluginData.data[key].type == 'doubleDateTime') {
                var $dateStart = $('input[datestr="' + key + '"][datestart]');
                var $dateEnd = $('input[datestr="' + key + '"][dateend]');
                var startValue = $dateStart.val();
                var endValue = $dateEnd.val();
                var startText = '';
                var endText = '';
                //解决双日期，鼠标选择删除，没有清空值的清空。
                if ($dateStart.next("span").find("input").eq(0).val() == "") {
                    $dateStart.val("");
                    startValue = "";
                }

                //解决结束日期>开始日期
                if (new Date(startValue) > new Date(endValue)) {
                    $dateStart.val("");
                    $dateEnd.val("");
                    startValue = "";
                    endValue = "";
                    $.messager.alert('警告', '开始日期大于结束日期');
                    canSearch = false;
                }

                if (pattern.test(startValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? startValue = startValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : startValue;
                    startValue = startValue;
                    startText = startValue;
                } else {
                    startValue = '';
                    startText = '';
                }

                if (pattern.test(endValue)) {
                    /^\d{4}(\-|\/|.)\d{1}\1\d{1}$/.test(value) ? endValue = endValue.replace(/(\-|\/|.)(\d{1})/g, "$10$2") : endValue;
                    endValue = endValue;
                    endText = endValue;
                } else {
                    endValue = '';
                    endText = '';
                }
                startValue = !startValue ? startValue : startValue + ':00';
                endValue = !endValue ? endValue : endValue + ':00';
                value = xyzIsNull(startValue) ? xyzIsNull(endValue) ? '' : '^doubleDate^' + endValue : xyzIsNull(endValue) ? startValue + '^doubleDate^' : startValue + '^doubleDate^' + endValue;
                text = xyzIsNull(startText) ? xyzIsNull(endText) ? '' : endText : xyzIsNull(endText) ? startText : startText + endText;
            }

            if (that.pluginData.data[key].type == 'customSearch') {
                value = that.pluginData.data[key].options.customGetValue(that.pluginData.data[key].options);
                that.pluginData.data[key].options.value = value;
                text = that.pluginData.data[key].options.customGetText(that.pluginData.data[key].options);
                that.pluginData.data[key].options.text = text;
                if (!xyzIsNull(that.pluginData.data[key].options.customGetHtml)) {
                    html = that.pluginData.data[key].options.customGetHtml(that.pluginData.data[key].options);
                }
            }

            that.pluginData.data[key].options.value = value;
            that.pluginData.data[key].options.text = text;
            that.pluginData.data[key].options.html = html;

            if (!canSearch) {
                return
            }
        };

        that.createSearchData = function () {
            that.searchData = {};//搜索的数据的基本数据
            that.searchDataText = {};//搜索的数据的基本数据
            that.searchAllData = []; //搜索的数据的全部数据
            for (var getData in that.pluginData.data) {
                var key = that.pluginData.data[getData].key;
                finish(key);
            }
            for (var data in that.pluginData.data) {//遍历总数据
                var searchData = that.pluginData.data[data];
                if (typeof searchData.options.value === 'object') {
                    if (!xyzIsNull(searchData.options.value[0]) || searchData.options.value.length > 1) {
                        that.searchData[searchData.key] = searchData.options.value.join(',');
                        that.searchDataText[searchData.key] = searchData.options.text.join(',');
                        that.searchAllData.push({key:searchData.key,value:searchData.options.value.join(','),text:searchData.options.text.join(','),html:searchData.options.html.join(',')});
                    }
                } else {
                    if (!xyzIsNull(searchData.options.value)) {
                        that.searchData[searchData.key] = searchData.options.value;
                        that.searchDataText[searchData.key] = searchData.options.text;
                        that.searchAllData.push({key:searchData.key,value:searchData.options.value,text:searchData.options.text,html:searchData.options.html});
                    }
                }
            }
        }

        var num = 0;
        that.getSearchData = function () {
            that.createSearchData();
            if (num == 0) {
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryYes';
            } else {
                that.searchData.flagDefaultFastForQuery = 'flagDefaultFastForQueryNo';
            }
            num++;
            return JSON.stringify(that.searchData)
        };

        /*--其他设置-点击设置--*/
        /*--点击查询框--*/
        $("#" + that.pluginData.id + "searchBox i.icon-search").click(function () {
            plsSearchData.onQuery(JSON.stringify(that.searchData));
        });
        /*--清除查询框--*/
        $("#" + that.pluginData.id + "searchBox i.icon-clear").click(function () {
            $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click();
            that.searchData = {"flagDefaultFastForQuery":"flagDefaultFastForQueryNo"};
            that.searchDataText = {};
            $("#" + that.pluginData.id + "searchBoxInput").val("");
            //是否显示删除按钮
            $("#" + that.pluginData.id + "searchBox .icon-clear").hide();
        });
        /*--点击弹出查询框--*/
        $("#" + that.pluginData.id + "searchBox input").click(function () {
            //设置document，overflow：hidden 防止外部document超高页面滚动，关闭时再auto
            $("body").css({"overflow": "hidden"});
            //是否显示删除按钮
            $("#" + that.pluginData.id + "searchBox .icon-clear").hide();
            //重新填写历史记录
            createHistory();
            $("#" + that.pluginData.id + "mask").show();
            $("#" + that.pluginData.id + "MaytekQMobile").show();
        });
        /*--点击删除历史查询--*/
        $("#" + that.pluginData.id + "MaytekQMobile .historyList").on("click", "i", function (e) {
            var index = $(this).parent().index();
            $(this).parent().remove();
            historyQueryText.splice(index, 1);
            historyQuery.splice(index, 1);

            if (historyQuery.length < 1) {
                localStorage.removeItem('historyQuery'+ historyName);
                localStorage.removeItem('historyQueryText'+ historyName);
            } else{
                localStorage.setItem("historyQuery" + historyName,JSON.stringify(historyQuery));
                localStorage.setItem("historyQueryText" + historyName,JSON.stringify(historyQueryText));
            }
        });
        /*--点击添加查询条件--*/
        $("#" + that.pluginData.id + "MaytekQMobile .historyList").on("click", "p", function (e) {
            $("body").css({"overflow": "auto"});
            if (!canSearch) {
                canSearch = true;
                return
            }
            $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click();
            var index = $(this).parent().index();
            var data = Object.assign({"flagDefaultFastForQuery":"flagDefaultFastForQueryNo"}, JSON.parse(historyQuery[index]));
            plsSearchData.onQuery(JSON.stringify(data));
            that.searchData = data;
            that.searchDataText =  historyQueryText[index];

            //摧毁
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
            //是否显示删除按钮
            $("#" + that.pluginData.id + "searchBox .icon-clear").show();
            //展示收藏
            var showData = "";
            var text = JSON.parse(historyQueryText[index]);
            for (var i in text) {
                showData += text[i] + ",";
            }

            $("#" + that.pluginData.id + "searchBoxInput").val(showData);
        });
        /*--点击排序--*/
        $("#" + that.pluginData.id + "MaytekQMobile .queryInput h2 i").click(function () {
            if($(this).parents(".queryInput").hasClass("set")){
                $(this).parents(".queryInput").removeClass("set");
                sortable.option("disabled", true);
            } else {
                $(this).parents(".queryInput").addClass("set");
                sortable.option("disabled", false);
            }

        });
        /*--返回--*/
        $("#" + that.pluginData.id + "MaytekQMobile header>i").click(function () {
            //是否显示删除按钮
            if(Object.keys(that.searchData).length > 1){
                $("#" + that.pluginData.id + "searchBox .icon-clear").show();
            }
            $("body").css({"overflow": "auto"});
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
        });
        /*--点击清空选值--*/
        $('#' + that.pluginData.id + 'MaytekQMobile .search-clearLablel').click(function () {
            //清除选择值
            for (var input in that.pluginData.data) {//遍历总数据
                var queryInput = that.pluginData.data[input];

                if (queryInput.defaultQuery == "true") {//判断显示的搜索选项
                    queryInput.options.value = '';
                    queryInput.options.text = '';
                    queryInput.options.html = '';
                }
            }

            //清除input框值
            var $queryInputBoxs = $("#" + that.pluginData.id + 'MaytekQMobile .queryInputBoxs');
            $queryInputBoxs.find("a.icon-clear").click();
            $queryInputBoxs.find(".datebox-f").datebox('clear');
            $queryInputBoxs.find(".datetimebox").val(''); //?
            $queryInputBoxs.find('input[customsearch]').map(function (t) {
                var key = $(this).attr('queryvalue');
                if (!xyzIsNull(that.pluginData.data[key].options.customSetValue)) {
                    that.pluginData.data[key].options.customSetValue(that.pluginData.data[key].options);
                }
                if (!xyzIsNull(that.pluginData.data[key].options.customSetText)) {
                    that.pluginData.data[key].options.customSetText(that.pluginData.data[key].options);
                }
            });
        });
        //点击查询按钮
        $('#searchBtn-' + that.pluginData.id).click(function () {
            $("body").css({"overflow": "auto"});
            if (!canSearch) {
                canSearch = true;
                return
            }
            var data = JSON.parse(that.getSearchData());
            //保存查询
            var searchData = Object.assign({}, data);
            delete searchData.flagDefaultFastForQuery;
            if (Object.keys(searchData).length > 0) {
                //判断是否有重复
                var isRepeat = false;
                historyQuery.forEach(function (value) {
                    if (value == JSON.stringify(searchData)) {
                        isRepeat = true;
                    }
                });
                if (!isRepeat) {
                    historyQuery.unshift(JSON.stringify(searchData));
                    historyQueryText.unshift(JSON.stringify(that.searchDataText));

                    if (historyQuery.length > 3) {
                        historyQuery.pop();
                        historyQueryText.pop();
                    }
                    localStorage.setItem("historyQuery" + historyName,JSON.stringify(historyQuery));
                    localStorage.setItem("historyQueryText" + historyName,JSON.stringify(historyQueryText));
                }
            }
            //摧毁
            $("#" + that.pluginData.id + "mask").hide();
            $("#" + that.pluginData.id + "MaytekQMobile").hide();
            //是否显示删除按钮
            if(Object.keys(that.searchData).length > 1){
                $("#" + that.pluginData.id + "searchBox .icon-clear").show();
            }
            //展示收藏
            var showData = "";
            for (var i in that.searchDataText) {
                showData += that.searchDataText[i] + ",";
            }


            $("#" + that.pluginData.id + "searchBoxInput").val(showData);

            if (typeof that.pluginData.onQuery === 'function') {
                plsSearchData.onQuery(JSON.stringify(data));
            } else {
                return JSON.stringify(data);
            }
        });
        function showQueryTerms(){
            that.createSearchData();
            //展示收藏
            var showData = "";
            that.searchAllData.forEach(function (t) {
                if(xyzIsNull(t.html)){
                    showData += t.text + ",";
                } else {
                    showData += t.html + ",";
                }
            })
            $("#" + that.pluginData.id + "searchBoxInput").val(showData);
        }
        that.setValue = function (data) {
            var $queryInputBoxs = $("#" + that.pluginData.id + 'MaytekQMobile .queryInputBoxs');
            if (!that.pluginData.data[data.key]) {
                return
            }
            var type = that.pluginData.data[data.key].type;

            if (type == 'customSearch') {
                if (typeof data.value == "object") {
                    data.value = data.value.join(',');
                }
                that.pluginData.data[data.key].options.value = data.value;
                if (!xyzIsNull(that.pluginData.data[data.key].options.customSetValue)) {
                    that.pluginData.data[data.key].options.customSetValue(that.pluginData.data[data.key].options);
                }
                showQueryTerms();
                return

            }
            if (type == 'doubleDate') {
                var dateStartValue = '';
                var dateEndValue = '';
                if (!xyzIsNull(data.value)) {
                    if (data.value.lastIndexOf('^') == 0) {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                    } else if (data.value.indexOf('^') == 0) {
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    } else {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    }
                }
                $('#dateStart-' + data.key + that.pluginData.id).datebox({
                    value: dateStartValue
                });
                $('#dateEnd-' + data.key + that.pluginData.id).datebox({
                    value: dateEndValue
                });
                showQueryTerms();
                return
            }
            if (type == 'doubleDateTime') {
                var dateStartValue = '';
                var dateEndValue = '';
                if (!xyzIsNull(data.value)) {
                    if (data.value.lastIndexOf('^') == 0) {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                    } else if (data.value.indexOf('^') == 0) {
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    } else {
                        dateStartValue = data.value.substring(0, data.value.indexOf('^'));
                        dateEndValue = data.value.substring(data.value.lastIndexOf('^') + 1, data.value.length);
                    }
                }
                // 消除秒
                dateStartValue = dateStartValue.indexOf(":") > 1 ? dateStartValue.substring(0,dateStartValue.length-3) : dateStartValue
                dateEndValue =  dateEndValue.indexOf(":") > 1 ? dateEndValue.substring(0,dateEndValue.length-3) : dateEndValue
                $('#dateStart-' + data.key + that.pluginData.id).val(dateStartValue);
                $('#dateEnd-' + data.key + that.pluginData.id).val(dateEndValue);

                showQueryTerms();
                return
            }
            if (type == 'datetimebox') {
                data.value =  data.value.indexOf(":") > 1 ? data.value.substring(0,data.value.length-3) : data.value
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]').val(data.value);
                return;
            }
            if (that.pluginData.data[data.key].options.multiple == true) {
                if (typeof data.value == "string") {
                    data.value = data.value.split(',');
                }
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]')[type]('setValues', data.value);
            } else {
                $queryInputBoxs.find('input[queryValue="' + data.key + '"]')[type]('setValue', data.value);
            }
            showQueryTerms();
        };
        that.getValue = function (data) {
            return that.pluginData.data[data.key].options.value
        };
        that.getText = function (data) {
            return that.pluginData.data[data.key].options.text
        };
        that.getHtml = function (data) {
            return that.pluginData.data[data.key].options.html
        };
        that.destroy = function () {
            for (var key in that.pluginData.data) {
                var $target = $("#"+that.pluginData.id + "MaytekQMobile li[data-id='"+key+that.pluginData.id+"']");
                if(that.pluginData.data[key].type == "combobox"){
                    $target.find('input[queryvalue]').combobox("destroy");
                }

                if(that.pluginData.data[key].type == "datebox"){
                    $target.find('input[queryvalue]').datebox("destroy");
                }

                if(that.pluginData.data[key].type == "datetimebox"){
                  $target.find('input[queryvalue]').datetimepicker("destroy");
                }

                if(that.pluginData.data[key].type == "doubleDateTime"){
                    $target.find('input[queryvalue]').datetimepicker("destroy");
                }

                if(that.pluginData.data[key].type == "doubleDate"){
                    $target.find('input[queryvalue]').datebox("destroy");
                }
            }
            $("#"+that.pluginData.id).html("");
            $("#"+that.pluginData.id + "mask").remove();
            $("#"+that.pluginData.id + "MaytekQMobile").remove();

        };
    }

    //初始化插件
    MaytekQ.init = function (data) {
        if (xyzIsNull(data) || xyzIsNull(data.id)) {
            return
        }
        if ($("#" + data.id).length < 1) {
            return
        }

        if (!map[data.id]) {
            map[data.id] = new MaytekQMobile(data);
        } else {
            for (var k in data) {
                if (k == 'group') {
                    var group = data[k];
                    for (var g in group) {
                        map[data.id].pluginData.group[g] = group[g];
                    }

                    continue
                }
                map[data.id].pluginData[k] = data[k];
            }

            map[data.id].init();
            map[data.id].render();
        }
    };
    //设置插件选中值
    MaytekQ.setValue = function (id, key, value) {
        if (!map[id]) {
            return '';
        }
        if (typeof key == "string") {
            var data = {key: key, value: value};
            map[id].setValue(data);
            return
        }
        if (typeof key == "object") {
            for (var item in key) {
                map[id].setValue({key: item, value: key[item]});
            }
        }
    };

    MaytekQ.setKeyData = function(id, keyData){
        if(!map[id]){
            return '';
        }
        if(Array.isArray(keyData)){
            keyData.forEach(function (t) {
                map[id].setValue(t);
            });
            return
        } else if( typeof keyData == "object"){
            map[id].setValue(keyData);
        }
    };
    //获取插件组内数据的选中值
    MaytekQ.getValue = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getValue(data);
    };
    //获取插件组内数据的文本
    MaytekQ.getText = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getText(data);
    };

    MaytekQ.getKeyData = function(id, key){
        if(!map[id]){
            return '';
        }
        if(xyzIsNull(key)){
            map[id].createSearchData();
            return map[id].searchAllData
        } else {
            return {key:key,value:map[id].getValue(data),text:map[id].getText(data),html:map[id].getHtml(data)};

        }
    }
    //获取插件组内数据的html
    MaytekQ.getHtml = function (id, key) {
        if (!map[id]) {
            return '';
        }
        var data = {key: key};
        return map[id].getHtml(data);
    };
    //获取插件全部选中值
    MaytekQ.getData = function (id) {
        if (!map[id]) {
            return {};
        }
        return map[id].getSearchData();
    };
    //获取插件id
    MaytekQ.getId = function (id, key) {
        if (!map[id]) {
            return {};
        }
        var inputId = "";

        var type = map[id].pluginData.data[key].type;

        if (type == 'customSearch') {
            inputId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[queryvalue="' + key + '"]').prev().attr('id');
        }

        if (type == 'doubleDate') {
            var startId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[datestr="' + key + '"]').eq(0).attr('id');
            var endId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[datestr="' + key + '"]').eq(1).attr('id');
            inputId = [startId, endId];
        } else {
            inputId = $("#" + id + "MaytekQMobile .queryInputBoxs").find('input[queryvalue="' + key + '"]').attr('id');
        }

        return inputId;
    };
    //清除插件的选中值
    MaytekQ.clear = function (id) {
        if (!map[id]) {
            return {};
        }
        $('#' + id + 'MaytekQMobile .search-clearLablel').click();
    };

    MaytekQ.hasMaytekQ = function(id){
        if(!map[id]){
            return false;
        } else {
            return true;
        }
    }
    MaytekQ.destroy = function(id){
        if(!map[id]){
            return;
        }
        map[id].destroy();
        delete map[id];

    }

    //插件外抛
    window.MaytekQ = MaytekQ;
};
/*--监听滚动条jq插件--*/
(function (factory) {
    if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS style for Browserify
        module.exports = factory;
    } else {
        // Browser globals
        factory(jQuery);
    }
}(
    function ($) {

    var toFix  = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'],
        toBind = ( 'onwheel' in document || document.documentMode >= 9 ) ?
            ['wheel'] : ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'],
        slice  = Array.prototype.slice,
        nullLowestDeltaTimeout, lowestDelta;

    if ( $.event.fixHooks ) {
        for ( var i = toFix.length; i; ) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }

    var special = $.event.special.mousewheel = {
        version: '3.1.9',

        setup: function() {
            if ( this.addEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.addEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = handler;
            }
            // Store the line height and page height for this particular element
            $.data(this, 'mousewheel-line-height', special.getLineHeight(this));
            $.data(this, 'mousewheel-page-height', special.getPageHeight(this));
        },

        teardown: function() {
            if ( this.removeEventListener ) {
                for ( var i = toBind.length; i; ) {
                    this.removeEventListener( toBind[--i], handler, false );
                }
            } else {
                this.onmousewheel = null;
            }
        },

        getLineHeight: function(elem) {
            return parseInt($(elem)['offsetParent' in $.fn ? 'offsetParent' : 'parent']().css('fontSize'), 10);
        },

        getPageHeight: function(elem) {
            return $(elem).height();
        },

        settings: {
            adjustOldDeltas: true
        }
    };

    $.fn.extend({
        mousewheel: function(fn) {
            return fn ? this.bind('mousewheel', fn) : this.trigger('mousewheel');
        },

        unmousewheel: function(fn) {
            return this.unbind('mousewheel', fn);
        }
    });


    function handler(event) {
        var orgEvent   = event || window.event,
            args       = slice.call(arguments, 1),
            delta      = 0,
            deltaX     = 0,
            deltaY     = 0,
            absDelta   = 0;
        event = $.event.fix(orgEvent);
        event.type = 'mousewheel';

        // Old school scrollwheel delta
        if ( 'detail'      in orgEvent ) { deltaY = orgEvent.detail * -1;      }
        if ( 'wheelDelta'  in orgEvent ) { deltaY = orgEvent.wheelDelta;       }
        if ( 'wheelDeltaY' in orgEvent ) { deltaY = orgEvent.wheelDeltaY;      }
        if ( 'wheelDeltaX' in orgEvent ) { deltaX = orgEvent.wheelDeltaX * -1; }

        // Firefox < 17 horizontal scrolling related to DOMMouseScroll event
        if ( 'axis' in orgEvent && orgEvent.axis === orgEvent.HORIZONTAL_AXIS ) {
            deltaX = deltaY * -1;
            deltaY = 0;
        }

        // Set delta to be deltaY or deltaX if deltaY is 0 for backwards compatabilitiy
        delta = deltaY === 0 ? deltaX : deltaY;

        // New school wheel delta (wheel event)
        if ( 'deltaY' in orgEvent ) {
            deltaY = orgEvent.deltaY * -1;
            delta  = deltaY;
        }
        if ( 'deltaX' in orgEvent ) {
            deltaX = orgEvent.deltaX;
            if ( deltaY === 0 ) { delta  = deltaX * -1; }
        }

        // No change actually happened, no reason to go any further
        if ( deltaY === 0 && deltaX === 0 ) { return; }

        // Need to convert lines and pages to pixels if we aren't already in pixels
        // There are three delta modes:
        //   * deltaMode 0 is by pixels, nothing to do
        //   * deltaMode 1 is by lines
        //   * deltaMode 2 is by pages
        if ( orgEvent.deltaMode === 1 ) {
            var lineHeight = $.data(this, 'mousewheel-line-height');
            delta  *= lineHeight;
            deltaY *= lineHeight;
            deltaX *= lineHeight;
        } else if ( orgEvent.deltaMode === 2 ) {
            var pageHeight = $.data(this, 'mousewheel-page-height');
            delta  *= pageHeight;
            deltaY *= pageHeight;
            deltaX *= pageHeight;
        }

        // Store lowest absolute delta to normalize the delta values
        absDelta = Math.max( Math.abs(deltaY), Math.abs(deltaX) );

        if ( !lowestDelta || absDelta < lowestDelta ) {
            lowestDelta = absDelta;

            // Adjust older deltas if necessary
            if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
                lowestDelta /= 40;
            }
        }

        // Adjust older deltas if necessary
        if ( shouldAdjustOldDeltas(orgEvent, absDelta) ) {
            // Divide all the things by 40!
            delta  /= 40;
            deltaX /= 40;
            deltaY /= 40;
        }

        // Get a whole, normalized value for the deltas
        delta  = Math[ delta  >= 1 ? 'floor' : 'ceil' ](delta  / lowestDelta);
        deltaX = Math[ deltaX >= 1 ? 'floor' : 'ceil' ](deltaX / lowestDelta);
        deltaY = Math[ deltaY >= 1 ? 'floor' : 'ceil' ](deltaY / lowestDelta);

        // Add information to the event object
        event.deltaX = deltaX;
        event.deltaY = deltaY;
        event.deltaFactor = lowestDelta;
        // Go ahead and set deltaMode to 0 since we converted to pixels
        // Although this is a little odd since we overwrite the deltaX/Y
        // properties with normalized deltas.
        event.deltaMode = 0;

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        // Clearout lowestDelta after sometime to better
        // handle multiple device types that give different
        // a different lowestDelta
        // Ex: trackpad = 3 and mouse wheel = 120
        if (nullLowestDeltaTimeout) { clearTimeout(nullLowestDeltaTimeout); }
        nullLowestDeltaTimeout = setTimeout(nullLowestDelta, 200);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }

    function nullLowestDelta() {
        lowestDelta = null;
    }

    function shouldAdjustOldDeltas(orgEvent, absDelta) {
        // If this is an older event and the delta is divisable by 120,
        // then we are assuming that the browser is treating this as an
        // older mouse wheel event and that we should divide the deltas
        // by 40 to try and get a more usable deltaFactor.
        // Side note, this actually impacts the reported scroll distance
        // in older browsers and can cause scrolling to be slower than native.
        // Turn this off by setting $.event.special.mousewheel.settings.adjustOldDeltas to false.
        return special.settings.adjustOldDeltas && orgEvent.type === 'mousewheel' && absDelta % 120 === 0;
    }
}));

