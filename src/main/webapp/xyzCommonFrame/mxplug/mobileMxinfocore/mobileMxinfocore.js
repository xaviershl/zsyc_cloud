/*
* @name: mxinfocore移动端插件
* @author: pls
* @update: 2019-11-13
* @descript:
* 1：vue项目中需要安装： "cube-ui"
* 2：vue项目中需要安装： "axios" ，且设置为全局变量
* 3：vue项目中main.js：Vue.use(window.MxInfoCore)
* 4：vue项目中index.html： <script src="./bdOrderH5Build/mobileMxinfocore/mobileMxinfocore.js"></script>  --此地址是开发模式地址
* 5: vue项目中mobileMxinfocore.js : 开发模式中的css地址需要修改
* 6：使用配置
*
 this.$mxInfoCore({
  el: '', // 挂载元素id
  id: '', // 插件id
  scene: 'SuperCustomer', // 插件场景
  formkey: '', // 表单key
  datakey: '', // 数据key
  groupkey: '', // 数据groupkey
  canChangeForm: true, // 是否可以筛选表单
  disabled: false, // 是否可以设值
  showAiIdentify: true, // 是否展示证件识别
  btns: [], // 配置按钮
  dataRowCount: 1, // 表单格子数
  dataRowType: {
  type: 1,
  reg: {
  item1: 'name',
    item2: 'name',
    item3: 'phone',
    item4: 'card',
    item5: 'sex'
     }
   },
  onLoad: function () {
  },
  config: function () {
  },
  confirm: function () {
  },
  close: function () {
  },
  watch: function () {
  }
 })
 7: 方法
 this.$mxInfoCore('getInfoCore','id') //判断是否有这个信息核页面,并返回
 this.$mxInfoCore('destroy','id') //销毁这个信息核页面

 let info = this.$mxInfoCore({})
 info.show()
 info.hide()
 info.getData()
 info.setData(data)
 info.setValue(index,value)
 info.setValue(index,value)
*
*
*
**/
var mxInfoCoreComp = '<div class="e-mxInfoCore" :id="options.id" v-show="showInforeCore">'
mxInfoCoreComp += '<header>'
  + '<div class="searchBox"><div class="searchContent">'
  + '<cube-input class="search-input" v-model="searchText" placeholder="请输入名字"><i class="cubeic-search" slot="prepend"></i></cube-input>'
  + '</div><div class="searchBtn" @click="searchForm">搜索</div></div>'
  + '</header>'
mxInfoCoreComp += '<aside>'
  + '<cube-select class="select" v-model="formkeyValue" :options="formOptions" placeholder="请选择" @change="changeForm" ></cube-select>'
  + '</aside>'
mxInfoCoreComp += '<section>'
  + '<template v-for="(form,formIndex) in titleList">'
  + '<div class="form" v-show="form.show">'
  + ' <div class="title" @click="showItem(form,formIndex)">'
+'<template v-if="options.dataRowType.type===1">'
+'<div class="title-1"><i class="iconfont icon-nv" :class="{\'icon-nan\': form.item5 === \'man\'}"></i><span>{{!form.item1?"客"+(formIndex+1):form.item1}}</span></div>'
+'<div class="title-2"><template v-if="!form.item1"><p style="line-height: 0.4rem;">游客{{formIndex+1}}</p></template>'
+'<template v-if="form.item1"> <p><span>{{form.item2}}</span> | <span>{{form.item3}}</span></p><p>{{form.item4}}</p></template></div></template>'
+'<div class="title-3" :class="{\'down\':form.showList}"><i class="cubeic-select"></i></div>'
+'<div class="title-4" :class="form.percent>80 ? \'green\': form.percent>30 ? \'yellow\': \'red\'">{{form.percent}}%</div>'
+'<div class="title-5" @click.stop="showOrc(formIndex)" v-if="options.showAiIdentify"><i class="iconfont icon-orc"></i></div>'
+'</div>'
+' <div class="itemList" :style="{maxHeight:form.showList?\'30rem\':\'0\'}">'
+'<template v-if="form.showList">'
+'<div class="item" v-for="(item,itemIndex) in mxData[formIndex].dataList" v-if="item.type !==\'blank\'">'
+'<div class="item-label">{{item.nameCn}}</div>'
+'<div class="item-input">'
//  <!--text,number类型-->
+'<div class="form-input" v-if="item.type === \'text\'|| item.type === \'number\'">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<input v-model="item.value" class="mxInput" :type="item.type" placeholder="请输入内容" :disabled="options.disabled" @change="changeValue([formIndex,itemIndex],item)"></input>'
+'</div>'
// <!--textarea类型-->
+'<div class="form-input" v-if="item.type === \'textarea\'">'
+'<cube-textarea v-model="item.value" :placeholder="\'请输入内容\'" :maxlength="1000" @change="changeValue([formIndex,itemIndex],item)" :disabled="options.disabled"></cube-textarea>'
+'</div>'
// <!--date类型-->
+'<div class="form-input" v-if="item.type === \'date\'">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<input v-model="item.value" class="mxInput"'
+'type="text" readonly="true" placeholder="请选择" :disabled="options.disabled" @change="changeValue([formIndex,itemIndex],item)" @click="showDatePicker([formIndex,itemIndex],item)" >'
+'</input></div>'
// <!--time类型-->
+'<div class="form-input" v-if="item.type === \'time\'">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<input v-model="item.value" class="mxInput"'
+' type="text" readonly="true"  placeholder="请选择" :disabled="options.disabled" @change="changeValue([formIndex,itemIndex],item)"   @click="showTimePicker([formIndex,itemIndex],item)" >'
+'</input> </div>'
  // <!--下拉类型-->
+'<div class="form-input" v-if="item.type === \'combobox\'">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<p @click="showPicker([formIndex,itemIndex],item)" :class="{\'hasValue\':item.value}">{{item.value?item.value:\'请选择\'}}</p>' +''
+'<p class="disabled" :class="{\'zindex1\':options.disabled}"></p>'
+'</div>'
  // <!--下拉类型(多选)-->
+'<div class="form-input" v-if="item.type === \'mCombobox\'">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<p @click="showMPicker([formIndex,itemIndex],item)" :class="{\'hasValue\':item.value}">{{item.value?item.value:\'请选择\'}}</p>' +
+'<p class="disabled" :class="{\'zindex1\':options.disabled}"></p>'
+'</div>'
  // <!--上传-->
+'<div class="form-input" v-if="item.type === \'image\'||item.type == \'zip\'">'
+'<cube-upload '
+':ref="\'update\'+item.nameKey+formIndex" v-model="item.files"  :action=uploadAction  @file-error="(value) =>errorFiles(item,value,[formIndex,itemIndex])" @file-removed="(value)=>uploadFiles(item,value,[formIndex,itemIndex])"   @file-success="(value)=>uploadFiles(item,value,[formIndex,itemIndex])"/>'
+'<p class="disabled" :class="{\'zindex1\':options.disabled}"></p>'
+'</div>'
  // <!--默认类型-->
+'<div class="form-input" v-if="!typeList.includes(item.type)">'
+'<i class="cubeic-wrong clear " v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>'
+'<input type="text"'
+'v-model="item.value" placeholder="请输入内容" :disabled="options.disabled"  @change="changeValue([formIndex,itemIndex],item)" >'
+'</div>'
+'</div>'
+'</div>'
+'</template>'
+'</div>'
+'</div>'
+'</template>'
+'</section>'
mxInfoCoreComp += '<cube-popup type="mCombobox" position="bottom" :mask-closable="true" ref="mCombobox">'
+'<div class="mCombobox-choose">'
+'<div class="mCombobox-choose-cancel" @click="cancelMpicker">取消</div>'
+'<h1 class="mCombobox-choose-title">请选择</h1>'
+' <div class="mCombobox-choose-confirm" @click="confirmMpicker">确认</div>'
+'</div>'
+'<div class="mCombobox-content">'
+'<cube-scroll ref="scroll" :data="mCombobox.data"> '
+'<cube-checkbox-group  v-model="mCombobox.value" :options="mCombobox.data"></cube-checkbox-group>'
+'</cube-scroll>'
+'</div>'
+'</cube-popup>'
mxInfoCoreComp += '<div class="ocrcontainer" v-if="orcData.show">'
+'<div class="bg" @click="showOrc"></div>'
+'<div class="main">'
+'<div class="mainheader">证件识别</div>'
+'<div class="example">'
+'<cube-upload ref="ocrUpload" v-model="orcData.imgUrl" :action="uploadAction" :process-file="processFile"  @files-added="aiadded"  @file-error="(value) =>errorFiles(item,value)">'
+'<div class="clear-fix">'
+'<cube-upload-file v-for="(file, i) in orcData.imgUrl" :file="file" :key="i"></cube-upload-file>'
+'<cube-upload-btn :multiple="false">'
+'<img src="" alt="">'
+'</cube-upload-btn>'
+'</div>'
+'</cube-upload>'
+'</div>'
+'<ul class="cardChoose">'
+'<li v-for="(item, index) in orcData.typeList"  class="carChooseCell" :class="{\'active\':item.check}" @click="cardChoose(item)">'
+'<i class="iconfont" :class="item.icon"></i>'
+'<span>{{item.title}}</span>'
+'<i class="iconfont icon-zuoshangjiao-tuijian" v-show="item.check"></i>'
+'</li></ul>'
+'<div class="poupBtn" @click="ocrFn()">开始识别</div>'
+'</div></div>'
mxInfoCoreComp +='<footer>'
+'<div class="btn" v-for="btn in options.btns" @click="btn.handler()" :id="btn.id">'
+'<span>{{btn.text}}</span>'
+'</div>'
+'<div class="btn submit" @click="submit"><span>提交</span></div>'
+'<div class="btn" @click="pageColse"><span>关闭</span></div>'
+'</footer>'
+'</div>'

var mxinfocoreCss = '<style>'
mxinfocoreCss += '.e-mxInfoCore .cube-textarea-wrapper .cube-textarea {\n' +
  '  background: #faf9fe;\n' +
  '  padding: 0;\n' +
  '  border: none;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-textarea-wrapper .cube-textarea::-webkit-input-placeholder {\n' +
  '  line-height: .4rem;\n' +
  '  color: #999;\n' +
  '  font-size: .12rem;\n' +
  '  font-family: Arial;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content {\n' +
  '  height: 273px;\n' +
  '  background: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose {\n' +
  '  position: relative;\n' +
  '  height: 60px;\n' +
  '  background: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose .mCombobox-choose-cancel {\n' +
  '  position: absolute;\n' +
  '  left: 0;\n' +
  '  color: #999;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose .mCombobox-choose-title {\n' +
  '  padding: 0 60px;\n' +
  '  font-size: 18px;\n' +
  '  line-height: 60px;\n' +
  '  font-weight: 400;\n' +
  '  color: #2787ff;\n' +
  '  text-align: center;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose .mCombobox-choose-confirm {\n' +
  '  position: absolute;\n' +
  '  top: 0;\n' +
  '  right: 0;\n' +
  '  color: #2787ff;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose .mCombobox-choose-cancel,\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-choose .mCombobox-choose-confirm {\n' +
  '  line-height: 60px;\n' +
  '  padding: 0 16px;\n' +
  '  box-sizing: content-box;\n' +
  '  font-size: 14px;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-mCombobox .cube-popup-content .mCombobox-content {\n' +
  '  height: 213px;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-upload-file,\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-file_error,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-btn,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-file {\n' +
  '  margin: 4px 4px 4px 0;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-upload-file .cubeic-wrong,\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-file_error .cubeic-wrong,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-btn .cubeic-wrong,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-file .cubeic-wrong {\n' +
  '  line-height: 20px;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-file-def,\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-file_error .cube-upload-file-def,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-btn .cube-upload-file-def,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-file .cube-upload-file-def {\n' +
  '  width: 60px;\n' +
  '  height: 60px;\n' +
  '}\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-btn-def,\n' +
  '.e-mxInfoCore .cube-upload-file .cube-upload-file_error .cube-upload-btn-def,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-btn .cube-upload-btn-def,\n' +
  '.e-mxInfoCore .cube-upload-def .cube-upload-file .cube-upload-btn-def {\n' +
  '  width: 60px;\n' +
  '  height: 60px;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .cube-upload-file,\n' +
  '.e-mxInfoCore .ocrcontainer .cube-upload-btn {\n' +
  '  margin: 0;\n' +
  '  height: 1.2rem;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .cube-upload-file + .cube-upload-btn {\n' +
  '  margin-top: -1.2rem;\n' +
  '  opacity: 0;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .cube-upload-file-def {\n' +
  '  width: 100%;\n' +
  '  height: 100%;\n' +
  '  margin: 0 auto;\n' +
  '  background-size: contain;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .cubeic-wrong {\n' +
  '  display: none;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .cube-upload-btn {\n' +
  '  display: flex;\n' +
  '  align-items: center;\n' +
  '  justify-content: center;\n' +
  '}\n' +
  '.e-mxInfoCore {\n' +
  '  position: absolute;\n' +
  '  top: 0;\n' +
  '  bottom: 0;\n' +
  '  left: 0;\n' +
  '  right: 0;\n' +
  '  width: 100%;\n' +
  '  height: 100%;\n' +
  '  background: #f2f2f2;\n' +
  '  color: black;\n' +
  '  z-index: 2;\n' +
  '  overflow: hidden;\n' +
  '}\n' +
  '.e-mxInfoCore header .searchBox {\n' +
  '  display: flex;\n' +
  '  background-color: #2787ff;\n' +
  '}\n' +
  '.e-mxInfoCore header .searchBox .searchContent {\n' +
  '  display: flex;\n' +
  '  flex: 1;\n' +
  '  margin: .1rem .2rem;\n' +
  '}\n' +
  '.e-mxInfoCore header .searchBox .searchContent .cubeic-search {\n' +
  '  line-height: .3rem;\n' +
  '  margin-left: .1rem;\n' +
  '  font-size: .28rem;\n' +
  '  color: #ccc;\n' +
  '}\n' +
  '.e-mxInfoCore header .searchBox .searchContent .search-input {\n' +
  '  flex: 1;\n' +
  '  /*height: .28rem;*/\n' +
  '\n' +
  '  border-radius: 20px;\n' +
  '  overflow: hidden;\n' +
  '}\n' +
  '.e-mxInfoCore header .searchBox .searchBtn {\n' +
  '  display: flex;\n' +
  '  width: .4rem;\n' +
  '  align-items: center;\n' +
  '  text-align: center;\n' +
  '  color: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore aside {\n' +
  '  display: flex;\n' +
  '  padding: 0.1rem;\n' +
  '  box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.2);\n' +
  '  background: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore aside .select {\n' +
  '  flex: 1;\n' +
  '}\n' +
  '.e-mxInfoCore aside .btn {\n' +
  '  width: .9rem;\n' +
  '  margin-left: .2rem;\n' +
  '  background: #2787ff;\n' +
  '  color: #fff;\n' +
  '  border-radius: 20px;\n' +
  '  font-size: .12px;\n' +
  '  line-height: .4rem;\n' +
  '  text-align: center;\n' +
  '}\n' +
  '.e-mxInfoCore section {\n' +
  '  position: absolute;\n' +
  '  top: 1.3rem;\n' +
  '  bottom: 0.4rem;\n' +
  '  left: 0;\n' +
  '  width: 100%;\n' +
  '  overflow: auto;\n' +
  '  z-index: 1;\n' +
  '}\n' +
  '.e-mxInfoCore section .form {\n' +
  '  padding: .1rem;\n' +
  '  margin: 0 0 0.1rem;\n' +
  '  background: #fff;\n' +
  '  overflow-x: hidden;\n' +
  '}\n' +
  '.e-mxInfoCore section .form .itemList {\n' +
  '  margin-top: .1rem;\n' +
  '  padding: 0 .1rem;\n' +
  '  background: #faf9fe;\n' +
  '  border-radius: 5px;\n' +
  '  overflow: hidden;\n' +
  '  transition: all .3s;\n' +
  '}\n' +
  '.e-mxInfoCore section .form:last-child {\n' +
  '  margin-bottom: 0;\n' +
  '}\n' +
  '.e-mxInfoCore section .title {\n' +
  '  height: .4rem;\n' +
  '  background: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore section .title.arrow {\n' +
  '  padding-bottom: .1rem;\n' +
  '  border-bottom: 1px solid #ccc;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-1 {\n' +
  '  position: relative;\n' +
  '  float: left;\n' +
  '  width: .4rem;\n' +
  '  height: .4rem;\n' +
  '  border-radius: 50%;\n' +
  '  background: #2787ff;\n' +
  '  color: #fff;\n' +
  '  text-align: center;\n' +
  '  line-height: .4rem;\n' +
  '  font-size: 12px;\n' +
  '  margin-right: .1rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-1 span {\n' +
  '  display: block;\n' +
  '  overflow: hidden;\n' +
  '  height: .4rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-1 i {\n' +
  '  position: absolute;\n' +
  '  top: -0.05rem;\n' +
  '  right: 0;\n' +
  '  width: .16rem;\n' +
  '  height: .16rem;\n' +
  '  line-height: .16rem;\n' +
  '  border-radius: 50%;\n' +
  '  font-size: .12rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-1 .icon-nv {\n' +
  '  background: #f87098;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-1 .icon-nan {\n' +
  '  background: #16c6ff;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-2 {\n' +
  '  float: left;\n' +
  '  line-height: .2rem;\n' +
  '  font-size: .12rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-2 p:first-child {\n' +
  '  color: #999;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-2 p:first-child span:first-child {\n' +
  '  color: #333;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-2 p:last-child {\n' +
  '  color: #999;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-3 {\n' +
  '  float: right;\n' +
  '  line-height: .4rem;\n' +
  '  font-size: .2rem;\n' +
  '  transform: rotate(-90deg);\n' +
  '  transition: transform .5s;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-3.down {\n' +
  '  transform: rotate(-180deg);\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-4 {\n' +
  '  float: right;\n' +
  '  width: .4rem;\n' +
  '  line-height: .4rem;\n' +
  '  color: #60e97f;\n' +
  '  margin: 0 .03rem 0 .05rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-4.green {\n' +
  '  color: #60e97f;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-4.yellow {\n' +
  '  color: #edca76;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-4.red {\n' +
  '  color: #c02427;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-5 {\n' +
  '  float: right;\n' +
  '  line-height: .4rem;\n' +
  '  color: #2787ff;\n' +
  '}\n' +
  '.e-mxInfoCore section .title .title-5 i {\n' +
  '  font-size: .2rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .item {\n' +
  '  background: #faf9fe;\n' +
  '  line-height: .4rem;\n' +
  '  border-bottom: 1px solid #ccc;\n' +
  '  display: flex;\n' +
  '}\n' +
  '.e-mxInfoCore section .item:last-child {\n' +
  '  border-bottom: none;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-label {\n' +
  '  width: 1rem;\n' +
  '  overflow: hidden;\n' +
  '  color: #999;\n' +
  '  font-size: .12rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input {\n' +
  '  flex: 1;\n' +
  '  min-height: .3rem;\n' +
  '  background: #faf9fe;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .cube-input:after,\n' +
  '.e-mxInfoCore section .item .item-input .cube-textarea-wrapper:after {\n' +
  '  border: none;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input input {\n' +
  '  background: #faf9fe;\n' +
  '  outline: none;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input input::-webkit-input-placeholder {\n' +
  '  color: #999;\n' +
  '  font-size: .12rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .mxInput {\n' +
  '  width: calc(100% - .36rem);\n' +
  '  height: 100%;\n' +
  '  background: #faf9fe;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .mxInput .cube-input-field {\n' +
  '  padding: 0;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .form-input {\n' +
  '  position: relative;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .form-input .cubeic-wrong.clear {\n' +
  '  float: right;\n' +
  '  color: #999;\n' +
  '  padding: 0 .1rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .cube-textarea {\n' +
  '  color: #000;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input .cubeic-wrong {\n' +
  '  /*line-height: .4rem;*/\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input p {\n' +
  '  width: calc(100% - .36rem);\n' +
  '  display: inline-block;\n' +
  '  line-height: initial;\n' +
  '  color: #999;\n' +
  '  font-size: 0.14rem;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input p :before {\n' +
  '  content: \'\';\n' +
  '  display: inline-block;\n' +
  '  vertical-align: middle;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input p.hasValue {\n' +
  '  color: #000;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input p.disabled {\n' +
  '  position: absolute;\n' +
  '  top: 0;\n' +
  '  bottom: 0;\n' +
  '  left: 0;\n' +
  '  right: 0;\n' +
  '  z-index: -1;\n' +
  '}\n' +
  '.e-mxInfoCore section .item .item-input p.disabled.zindex1 {\n' +
  '  z-index: 2;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer {\n' +
  '  position: fixed;\n' +
  '  z-index: 20;\n' +
  '  width: 100%;\n' +
  '  height: 100%;\n' +
  '  background-color: rgba(0, 0, 0, 0.6);\n' +
  '  top: 0;\n' +
  '  left: 0;\n' +
  '  text-align: center;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer .bg {\n' +
  '  height: 100%;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer > .main {\n' +
  '  width: 3.2rem;\n' +
  '  height: 3.8rem;\n' +
  '  background: #fff;\n' +
  '  position: absolute;\n' +
  '  top: 50%;\n' +
  '  left: 50%;\n' +
  '  transform: translate(-50%, -50%);\n' +
  '  overflow: hidden;\n' +
  '  border-radius: 0.1rem;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer > .main > .mainheader {\n' +
  '  height: 0.45rem;\n' +
  '  line-height: 0.45rem;\n' +
  '  width: 100%;\n' +
  '  text-align: center;\n' +
  '  color: #333;\n' +
  '  font-weight: bolder;\n' +
  '  border-bottom: 1px solid #C9C9C9;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer > .main .example {\n' +
  '  padding: 0.2rem 0 0.15rem;\n' +
  '  text-align: center;\n' +
  '  height: 1.55rem;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer > .main .example img {\n' +
  '  text-align: center;\n' +
  '  width: 80%;\n' +
  '  height: 100%;\n' +
  '  background: url("data:image/png;base64,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");\n' +
  '  background-size: contain;\n' +
  '}\n' +
  '.e-mxInfoCore .ocrcontainer > .main .poupBtn {\n' +
  '  width: 2.8rem;\n' +
  '  height: 0.44rem;\n' +
  '  border-radius: 0.08rem;\n' +
  '  text-align: center;\n' +
  '  margin: 0.15rem auto 0.05rem;\n' +
  '  background-color: #3b72a8;\n' +
  '  line-height: 0.44rem;\n' +
  '  color: #fff;\n' +
  '}\n' +
  '.e-mxInfoCore .cardChoose {\n' +
  '  display: flex;\n' +
  '  justify-content: space-around;\n' +
  '  padding: 0 0.1rem;\n' +
  '}\n' +
  '.e-mxInfoCore .cardChoose .carChooseCell {\n' +
  '  overflow: hidden;\n' +
  '  width: 0.8rem;\n' +
  '  height: 0.8rem;\n' +
  '  border-radius: 0.08rem;\n' +
  '  border: 1px dashed #b7b7b7;\n' +
  '  text-align: center;\n' +
  '  position: relative;\n' +
  '  color: #a8a8a8;\n' +
  '}\n' +
  '.e-mxInfoCore .cardChoose .carChooseCell i:first-child {\n' +
  '  display: block;\n' +
  '  height: 0.5rem;\n' +
  '  line-height: 0.5rem;\n' +
  '  font-size: 0.25rem;\n' +
  '}\n' +
  '.e-mxInfoCore .cardChoose .carChooseCell .icon-zuoshangjiao-tuijian {\n' +
  '  position: absolute;\n' +
  '  top: 0;\n' +
  '  left: 0;\n' +
  '}\n' +
  '.e-mxInfoCore .cardChoose .carChooseCell.active {\n' +
  '  color: #3b72a8;\n' +
  '  border: 1px solid #3b72a8;\n' +
  '}\n' +
  '.e-mxInfoCore footer {\n' +
  '  position: absolute;\n' +
  '  bottom: 0;\n' +
  '  left: 0;\n' +
  '  right: 0;\n' +
  '  width: 100%;\n' +
  '  height: .4rem;\n' +
  '  display: flex;\n' +
  '  justify-content: space-around;\n' +
  '  align-items: center;\n' +
  '  background: #f2f2f2;\n' +
  '  color: #fff;\n' +
  '  overflow: auto;\n' +
  '}\n' +
  '.e-mxInfoCore footer .btn {\n' +
  '  flex: 1;\n' +
  '  max-width: 1.4rem;\n' +
  '  height: .3rem;\n' +
  '  margin: 0 .1rem;\n' +
  '  line-height: .3rem;\n' +
  '  text-align: center;\n' +
  '  background: #ccc;\n' +
  '  border-radius: 5px;\n' +
  '  overflow: hidden;\n' +
  '}\n' +
  '.e-mxInfoCore footer .btn.submit {\n' +
  '  background: #2787ff;\n' +
  '}\n'
mxinfocoreCss += '</style>'

document.write('<link  rel="stylesheet" href="//at.alicdn.com/t/font_1012032_ru1w4v3h6w.css">');
document.write(mxinfocoreCss)

var MxInfoCore = {
  install(Vue, options) {
    var MxInfoCoreComp = {
      template: mxInfoCoreComp,
      data: function() {
        return {
          /** --传入属性-- **/
          mxData: [],
          options: {
            el: '', // 挂载元素id
            id: '', // 插件id
            scene: '', // 插件场景
            formkey: '', // 表单key
            datakey: '', // 数据key
            groupkey: '', // 数据groupkey
            canChangeForm: true, // 是否可以筛选表单
            disabled: false, // 是否可以设值
            showAiIdentify: true, // 是否展示证件识别
            btns: [
              /*    {
                    id: '',
                    text:'按钮1',
                    handler: function(){
                    },
                  }*/
            ], // 配置按钮
            dataRowCount: 1, // 表单格子数
            dataRowType: {
              type: 1,
              reg: {
                item1: 'name',
                item2: 'name',
                item3: 'phone',
                item4: 'card',
                item5: 'sex'
              }/*,
            type: 2,
            reg:{
              item1: '客人',
              item2: 'linkman',
              item3: 'phone',
              item5: 'nan',
              item3: 'phone'
            },*/
            },
            onLoad: function () {
            },
            config: function () {
            },
            confirm: function () {
            },
            close: function () {
            },
            watch: function () {
            },
          },
          /** --ajax请求回数据-- **/
          fieldList: [], // 私域
          formkeyValue: '',
          formOptions: [{text: '111', value: '111'}], // 已创建的表单格式
          formkeyConfig: {}, // 已创建的表单格式
          orderInfo: [], // 获取回的整个表单数据
          /** --ajax请求数据 -- **/
          orderList: [],
          cloneOrderList: [],
          currentConfig: [],
          formkeyNameCn: '',
          /** --编辑页面属性-- **/
          cloneMxData:[],
          showInforeCore: true,
          titleList: [],
          searchText: '',
          typeList: ['text', 'number', 'textarea', 'date',
            'time', 'combobox', 'mCombobox', 'image', 'zip'
          ],
          personData: [
            {name: 'A', items: []},
            {name: 'B', items: []},
            {name: 'C', items: []},
            {name: 'D', items: []},
            {name: 'E', items: []},
            {name: 'F', items: []},
            {name: 'G', items: []},
            {name: 'H', items: []},
            {name: 'I', items: []},
            {name: 'J', items: []},
            {name: 'K', items: []},
            {name: 'L', items: []},
            {name: 'M', items: []},
            {name: 'N', items: []},
            {name: 'O', items: []},
            {name: 'P', items: []},
            {name: 'Q', items: []},
            {name: 'R', items: []},
            {name: 'S', items: []},
            {name: 'T', items: []},
            {name: 'U', items: []},
            {name: 'V', items: []},
            {name: 'W', items: []},
            {name: 'X', items: []},
            {name: 'Y', items: []},
            {name: 'Z', items: []},
          ],
          /** --多选属性-- **/
          mCombobox: {
            index: [],
            data: [],
            value: []
          },
          /** --上传属性-- **/
          qt2: '',
          uploadAction: {
            target: 'https://upload.qiniup.com',
            data: {
              'token': '',
              'x:folder': 'default'
            }
          },
          /** --orc属性-- **/
          orcData: {
            show: false,
            formIndex: null,
            imgUrl: [],
            type: '',
            typeList: [
              {
                title: '身份证',
                type: 'idcard',
                icon: 'iconfont icon-credentials_icon',
                check: false
              },
              {
                title: '护照',
                type: 'passport',
                icon: 'iconfont icon-hu',
                check: false
              }, {
                title: '港澳通行证',
                type: 'HK_Macau',
                icon: 'iconfont icon-chujingrujing-',
                check: false
              }]
          }
        };
      },
      methods: {
        /** --抛出方法-- **/
        show() {
          this.showInforeCore = true
        },
        hide() {
          this.showInforeCore = false
        },
        getData() {
          return JSON.parse(JSON.stringify(this.mxData))
        },
        setData(data) {
          let vm = this
          vm.clearCurrentConfig()
          let mxData = vm.mergeData(data)
          vm.orderInfo = JSON.parse(JSON.stringify(mxData))
          vm.mxData = JSON.parse(JSON.stringify(mxData))
          vm.cloneMxData = JSON.parse(JSON.stringify(mxData))

          if (vm.mxData.length > 0) {
            vm.formkey = vm.mxData[0].formkey
            let datakey = []
            vm.mxData.forEach(function (item1, index1) {
              datakey.push(item1.datakey)
            })
            vm.datakey = datakey.join(',')
          }

          vm.titleList = vm.getTitle(vm.mxData)
        },
        setValue(mobileMxinfocore, value) {
          let vm = this
          this.$set(vm.mxData[mobileMxinfocore.r].dataList[mobileMxinfocore.c], 'value', value)
          this.$forceUpdate()
        },
        forceUpdate() {
          this.$forceUpdate()
        },
        /** --初始化数据方法-- **/
        initData(info) {
          let vm = this
          if (info) {
            // 获取私库list
            vm.fieldList = vm.paseData(info.priFieldList)

            // 获取配置所有版本
            vm.formOptions = info.formList.map(function (d, index) {
              // 清洗数据
              let data = vm.replaceField(d.formFieldList)
              return {
                value: d.formkey,
                text: d.nameCn,
                data: data
              }
            })

            // 获取渲染历史数据,不同datakey，会有数据不同的现象
            vm.orderInfo = vm.mergeData(info.dataList)
          }
          // 配置mxData
          let mxData = []
          if (vm.orderInfo.length === 0) {
            for (var i = 0; i < vm.options.dataRowCount; i++) {
              mxData.push({
                datakey: "",
                formkey: "",
                dataList: []
              })
            }
          } else {
            for (var i = 0; i < vm.orderInfo.length; i++) {
              let data = Object.assign({}, vm.orderInfo[i])
              data.dataList = []
              mxData.push(data)
            }
          }
          vm.mxData = mxData
        },
        renderInfo() {
          let vm = this
          /**
           * 如果有表单列表，
           *情况1：根据formkey创建mxData，
           *情况2：根据表单列表第一个创建mxData
           **/
          if (vm.formOptions.length > 0) {
            let formkeyValue = !vm.options.formkey ?
              vm.formOptions[0].value : vm.options.formkey

            vm.formkeyValue = formkeyValue
            let formkeyIndex = null

            vm.formOptions.forEach((form, index) => {
              if (form.value === vm.formkeyValue) {
                formkeyIndex = index
              }
            })

            vm.changeForm(vm.formkeyValue, formkeyIndex)
          }
          /**
           * 如果有orderInfo，根据orderInfo，与表单创建的vm.mxData合并
           **/
          if (vm.orderInfo.length > 0) {
            vm.orderInfo.forEach(function (item1, index1) {
              item1.dataList.forEach(function (item2, index2) {
                let itemInOrder = false

                vm.mxData[index1] && vm.mxData[index1].dataList && vm.mxData[index1].dataList.forEach(function (item, index3) {
                  if (item.nameKey === item2.nameKey && item2.type !== "blank") {
                    itemInOrder = true
                    item.value = item2.value
                    if (item.type === 'image' || item.type == 'zip') {
                      item.files = item2.files
                    }
                  }
                })

                if (!itemInOrder) {
                  let item = Object.assign({}, item2)
                  vm.mxData[index1].dataList.push(item)
                }
              })
            })
          }

          /**
           * 如果orderInfo为空,orderInfo为空，取fieldList中isDefault为1的创建的vm.mxData
           **/
          if (vm.orderInfo.length === 0 && vm.formOptions.length === 0) {
            let newForm = []
            vm.fieldList.forEach(list => {
              if (list.isDefault === 1) {
                let item = Object.assign({}, list)
                item.value = ''
                item.formkey = vm.options.formkey // 应该是空的
                newForm.push(item)
              }
            })
            //?怕深复制
            vm.mxData.forEach(d => {
              d.dataList = newForm.concat()
            })
          }
          /**
           * 根据mxData获取title
           **/
          vm.titleList = vm.getTitle(vm.mxData)
          vm.cloneMxData = JSON.parse(JSON.stringify(vm.mxData))

        },
        /** --洗数据方法-- **/
        clearCurrentConfig() {
          let vm = this
          vm.formkeyValue = ''
          vm.formkey = ''
          vm.datakey = ''
          vm.mxData = vm.mxData.map(function (d) {
            return {
              datakey: "",
              formkey: "",
              dataList: []
            }
          })
        },
        getTitle(data) {
          let vm = this
          let titleList = []
          data.forEach(function (item1) {
            let titleItem = {
              percent: 0,
              show: true,
              showList: false
            }
            let allNum = 0
            let valueNum = 0
            switch (vm.options.dataRowType.type) {
              case 1 :
                titleItem.item1 = ''
                titleItem.item2 = ''
                titleItem.item3 = ''
                titleItem.item4 = ''
                titleItem.item5 = ''

                for (var title in vm.options.dataRowType.reg) {
                  item1.dataList.forEach(function (item2, index2) {
                    if (vm.options.dataRowType.reg[title] === item2.nameKey) {
                      titleItem[title] = item2.value
                    }
                  })
                }

                break
              case 2 :
                break
              case 3 :
                break
            }
            item1.dataList.forEach(function (item2, index2) {
              if (item2.type !== "blank") {
                allNum++
                valueNum = !item2.value ?
                  valueNum : valueNum + 1
              }
            })
            titleItem.percent = Math.round((valueNum / allNum) * 100)
            titleList.push(titleItem)
          })
          return titleList
        },
        setMxDataValue(data, from) {
          let vm = this
          data.forEach(function (item1, index1) {
            item1.dataList.forEach(function (item2, index2) {
              vm.orderInfo.length > 0 && vm.orderInfo[index1].dataList.forEach(function (item3) {
                if (item3.nameKey === item2.nameKey) {
                  // 解决vue改变二维数组不渲染页面
                  vm.$set(vm.mxData[index1].dataList[index2], 'value', item3.value)
                  if (item3.type === 'image' || item3.type == 'zip') {
                    vm.$set(vm.mxData[index1].dataList[index2], 'files', item3.files)
                  }
                }
              })
            })
          })
        },
        mergeData(data) {
          let vm = this
          let form = []
          data.forEach(function (item1, index1) {
            item1.dataList.forEach(function (item2, index2) {
              let itemInForm = false
              form.forEach(function (formItem, index) {
                if (formItem.nameKey === item2.nameKey) {
                  itemInForm = true
                }
              })
              if (!itemInForm) {
                form.push(Object.assign({}, item2))
              }
            })
          })

          // 合并表单
          data.forEach(function (item1) {
            let newForm = vm.replaceField(form)

            newForm.forEach(function (formItem) {
              item1.dataList.forEach(function (item2) {
                if (formItem.nameKey === item2.nameKey) {
                  formItem.value = item2.value || ''

                  if (formItem.type === 'image' || formItem.type == 'zip') {
                    let files = !item2.value ? [] : item2.value.split(',')
                    let newFiles = []
                    files.forEach((f) => {
                      newFiles.push({
                        status: 'success',
                        url: f
                      })
                    })
                    formItem.files = newFiles
                  }
                }
              })
            })
            item1.dataList = newForm
          })
          return data.concat()
        },
        replaceField(data) {
          let vm = this
          let newData = JSON.parse(JSON.stringify(data))

          newData.forEach(function (d, index) {
            vm.fieldList.forEach(f => {
              if (d.nameKey === f.nameKey) {
                d = Object.assign({}, d, f)

                // 添加value
                d.value = ''
                // 添加files
                if (d.type === 'image' || d.type == 'zip') {
                  d.files = []
                }
                newData.splice(index, 1, d)
              }
            })
          })
          return newData
        },
        sortOrderList(data) {
          let vm = this
          let datakeys = vm.options.datakey.split(',')
          vm.mxData.forEach(function (item1, index1) {
            item1.formkey = vm.options.formkey
            item1.datakey = datakeys[index1]

            item1.dataList.forEach(function (item2, index2) {
              item2.sort = index2
            })
          })
        },
        paseData(data) {
          let vm = this
          data.forEach(function (el) {
            // 解析combobox/mCombobox下拉选择配置的数组
            if (el.typeContent) {
              let arr = JSON.parse(JSON.stringify(el.typeContent)).split(',')
              for (let kl in arr) {

                if (arr[kl].split('$@$').length === 2) {
                  arr[kl] = arr[kl].split('$@$')
                } else if (arr[kl].split('@').length === 2) {
                  arr[kl] = arr[kl].split('@')
                } else if (arr[kl].split('@').length === 1) {
                  arr[kl] = arr[kl].split('@')
                  arr[kl][1] = arr[kl][0]
                }

              }
              el.data = arr
            }

            // 解析options
            if (!el.options) {
              try {
                let option = vm.xyzHtmlDecode(el.options);
                option = eval('(' + option + ')');
                el.options = typeof option === "object" ? option : {}
              } catch (el) {
                el.options = {}
              }
            }
          })
          return data
        },
        xyzHtmlDecode(str) {
          let vm = this
          if (vm.xyzIsNull(str)) {
            return str;
          }
          str = str.replace(/&lt;/g, "<");
          str = str.replace(/&gt;/g, ">");
          str = str.replace(/&acute;/g, "'");
          str = str.replace(/&#45;&#45;/g, "--");
          str = str.replace(/&bksh;/g, "\\");
          str = str.replace(/\\n/g, '\n');
          return str;
        },
        /** --页面操作-- **/
        searchForm() {
          let vm = this
          vm.titleList.forEach(title => {
            if (!vm.searchText) {
              title.show = true
            } else {
              title.show = title.item1.indexOf(vm.searchText) > -1
            }
          })
        },
        changeValue(index, item) {
          let vm = this
          let oldData = JSON.parse(JSON.stringify(vm.cloneMxData))
          vm.cloneMxData = JSON.parse(JSON.stringify(vm.mxData))
          vm.options.watch(vm.mxData,oldData,item,{r:index[0],c:index[1]})
        },
        clearValue(index, item) {
          item.value = ''
          this.changeValue(index, item)
        },
        pageColse() {
          let vm = this
          vm.showInforeCore = false
          vm.options.close(vm.options.datakey, JSON.parse(JSON.stringify(vm.mxData)))
        },
        changeForm(value, index, text) {
          let vm = this
          vm.options.formkey = value
          vm.mxData.forEach(d => {
            // ?groupkey
            d.dataList = []
            vm.formOptions[index].data.forEach(form => {
              if(form.type === 'image'||form.type === 'zip'){
                form.files = new Array()
              }
              d.dataList.push(Object.assign({}, form))
            })
          })
          vm.setMxDataValue(vm.mxData, 'changeForm')
          vm.titleList = vm.getTitle(vm.mxData)
        },
        // 显示列表
        showItem(form, formIndex) {
          let vm = this
          if (form.showList) {
            vm.titleList = vm.getTitle(vm.mxData)
          }
          form.showList = !form.showList
        },
        // 打开日期
        showDatePicker(index, item) {
          let vm = this
          let datePickerRef = item.nameKey + index[0]
          if (!this['datePicker' + datePickerRef]) {
            let value = item.value ? new Date(item.value.split(',')) : new Date()
            this['datePicker' + datePickerRef] = this.$createDatePicker({
              title: '请选择日期',
              // cancelTxt: '清空',
              min: new Date(1970, 1, 1),
              max: new Date(2200, 12, 31),
              format: {year: 'yyyy', month: 'mm', date: 'dd'},
              value: value,
              onSelect: function (date, selectedVal, selectedText) {
                let value = selectedText.join('-')
                vm.$set(vm.mxData[index[0]].dataList[index[1]], 'value', value)
                vm.changeValue(index, item)
              },
              onCancel: function () {
              }
            })
          }
          this['datePicker' + datePickerRef].show()
        },
        // 打开时间
        showTimePicker(index, item) {
          let vm = this
          let timePickerRef = item.nameKey + index[0]
          if (!this['timePicker' + timePickerRef]) {
            let hours = []
            let mins = []
            for (var i = 0; i < 24; i++) {
              let hour = i < 10 ? '0' + i : i
              hour = hour.toString()
              hours.push({
                text: hour,
                value: hour
              })
            }
            for (var j = 0; j < 12; j++) {
              let min = j < 2 ? '0' + j * 5 : j * 5
              min = min.toString()
              mins.push({
                text: min,
                value: min
              })
            }
            let value = item.value ? item.value.split(':') : ['00', '00']
            hours.map((h, index1) => {
              if (h.text === value[0])
                value[0] = index1
            })
            mins.map((m, index2) => {
              if (m.text === value[1])
                value[1] = index2
            })
            this['timePicker' + timePickerRef] = this.$createPicker({
              title: '请选择时间',
              // cancelTxt: '清空',
              selectedIndex: value,
              data: [hours, mins],
              onSelect: function (selectedVal, selectedIndex, selectedText) {
                let value = selectedText.join(':')
                vm.$set(vm.mxData[index[0]].dataList[index[1]], 'value', value)
                vm.changeValue(index, item)
              },
              onCancel: function () {

              }
            })
          }
          this['timePicker' + timePickerRef].show()
        },
        // 打开单选
        showPicker(index, item) {
          let vm = this
          let pickerRef = item.nameKey + index[0]
          if (!this['picker' + pickerRef]) {
            let column = item.data ? item.data.concat() : []
            let value = item.value ?
              (typeof item.value === 'string' ? item.value.split(',') : item.value)
              : [0]
            column.map((c, cIndex) => {
              column[cIndex] = {text: c[0], value: c[1], index: cIndex}

              value.forEach((v, vIndex) => {
                if (v === c[1]) {
                  value[vIndex] = cIndex
                }
              })
            })
            this['picker' + pickerRef] = this.$createPicker({
              title: '请选择',
              // cancelTxt: '清空',
              data: [column],
              selectedIndex: value,
              onSelect: function (selectedVal, selectedIndex, selectedText) {
                let value = selectedText.join(',')
                vm.$set(vm.mxData[index[0]].dataList[index[1]], 'value', value)
                vm.changeValue(index, item)
              },
              onCancel: function () {

              }
            })
          }

          this['picker' + pickerRef].show()
        },
        // 打开多选
        showMPicker(index, item) {
          let vm = this

          this.mCombobox.index = index

          let column = item.data ? item.data.concat() : []
          column.map((c, cIndex) => {
            column[cIndex] = {label: c[0], value: c[1], index: cIndex}
          })
          this.mCombobox.data = column
          this.mCombobox.value = item.value ? item.value.split(',') : []

          this.$refs.mCombobox.show()
        },
        cancelMpicker() {
          let vm = this

          this.mCombobox.index = []
          this.mCombobox.data = []
          this.mCombobox.value = []
          this.$refs.mCombobox.hide()
        },
        confirmMpicker() {
          let vm = this

          let index = this.mCombobox.index
          let value = this.mCombobox.value.join(',')
          vm.$set(vm.mxData[index[0]].dataList[index[1]], 'value', value)
          vm.changeValue(index, vm.mxData[index[0]].dataList[index[1]])

          this.cancelMpicker()
        },
        // 上传文件
        getQt2() {
          let vm = this

          axios({
            url: 'https://toolapi.maytek.cn/qt2',
            method: 'post',
            headers: {
              "accept": "application/json, text/javascript, */*; q=0.01",
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            timeout: 50000,
            maxContentLength: 2000
          }).then(function (response) {
            vm.uploadAction.data.token = response.data
            window.localStorage.setItem("qt2", response.data)
          })
        },
        errorFiles(item, files) {
          this.getQt2()
        },
        uploadFiles(item, files, index) {
          let vm = this

          if (typeof files === 'object') {
            let value = []
            item.files.forEach(function (i, index) {
              if (i.response) {
                value.push(i.response.content.url)
              }
            })

            item.value = value.join(",")
            vm.changeValue(index, item)
          }
        },
        // 身份证件识别
        //显示证件识别选择框
        showOrc(formIndex) {
          let vm = this

          if (vm.orcData.show) {
            vm.orcData.formIndex = null
            vm.orcData.imgUrl = []
            vm.orcData.type = ''
            vm.orcData.typeList = vm.orcData.typeList.map(item => {
              item.check = false
              return item
            })
          } else {
            vm.orcData.formIndex = formIndex
          }
          vm.orcData.show = !vm.orcData.show
        },
        // 选择orc类型
        cardChoose(item) {
          let vm = this

          this.orcData.typeList.forEach(function (item1, index1) {
            item1.check = false
            if (item1.title === item.title) {
              item1.check = true
              vm.orcData.type = item1.type
            }
          })
        },
        // 更换图片
        aiadded() {
          let vm = this

          const file = this.orcData.imgUrl[0]
          file && this.$refs.ocrUpload.removeFile(file)
        },
        // 压缩图片转为base64
        processFile(file, next) {
          let vm = this

          let ready = new FileReader(file);
          ready.readAsDataURL(file);
          ready.onload = function (evt) {
            // 压缩图片
            let img = new Image();
            img.src = evt.target.result;

            let quality = 0.9
            let imgWith = 800
            img.onload = function () {
              //生成canvas
              let canvas = document.createElement('canvas');
              let ctx = canvas.getContext('2d');
              // 默认按比例压缩
              let w = imgWith
              let h = imgWith / (this.width / this.height)
              canvas.width = w
              canvas.height = h
              ctx.drawImage(this, 0, 0, w, h)
              let base64 = canvas.toDataURL('image/jpeg', quality)
              // 返回base64
              file.base64 = base64;
              next(file)
            }
          }
        },
        // ocr识别开始
        ocrFn() {
          let vm = this

          if (!this.orcData.type) {
            this.$createToast({
              txt: '您还没有选择识别类型',
              type: 'txt'
            }).show()
            return
          }

          let img = this.orcData.imgUrl
          if (img.length === 0) {
            this.$createToast({
              txt: '您还未选择上传证件图片',
              type: 'txt'
            }).show()
            return
          }
          const toast = this.$createToast({
            time: 5000,
            mask: true,
            onTimeout: () => {
              toast.hide()
            }
          })
          toast.show()

          this.ajax({
            url: '/InfoCore_InfoCoreWS/baiduOcr.do',
            data: {
              scene: vm.options.scene,
              base64: img[0].base64.split(',')[1],
              type: vm.orcData.type,
            },
            success: function (res) {
              toast.hide()

              if (res.status === 1) {
                let resData = res.content || []
                let url = vm.orcData.imgUrl[0].response.content.url
                resData.forEach(item1 => {
                  vm.mxData[vm.orcData.formIndex].dataList.forEach(item2 => {
                    if (item1.nameKey === item2.nameKey) {
                      item2.value = item2.type === "image" ? url : item1.value
                    }
                  })
                })
                // 关闭orc识别
                vm.showOrc()
                vm.$createToast({
                  txt: '识别成功，请仔细核对识别的各项信息。',
                  type: 'correct'
                }).show()
              }
            }
          })
        },
        /** --ajax提交数据-- **/
        submit() {
          let vm = this

          vm.sortOrderList()
          const toast = this.$createToast({
            time: 5000,
            mask: true,
            onTimeout: () => {
              toast.hide()
            }
          })
          toast.show()

          vm.ajax({
            url: '/InfoCore_InfoCoreWS/inputFormDataOper.do',
            data: {
              scene: vm.options.scene,
              groupkey: vm.options.groupkey,
              dataJson: JSON.stringify(vm.mxData)
            },
            success: function (e) {
              toast.hide()
              // 返回datakey
              if (e.status === 1) {
                vm.options.datakey = e.content

                vm.$createToast({
                  txt: '提交成功',
                  type: 'correct'
                }).show()
                vm.options.confirm(vm.options.datakey, JSON.parse(JSON.stringify(vm.mxData)))

              }
            }
          })
        },
        /** --ajax请求回数据-- **/
        // 获取订单信息
        async getInfo() {
          let vm = this

          let data = await vm.ajax({
            url: '/InfoCore_InfoCoreWS/getDataForInitPlugin.do',
            data: {
              datakeys: vm.options.datakey,
              scene: vm.options.scene
            }
          })

          if (Array.isArray(data.content) || !data.content) {
            vm.$createToast({
              txt: e.msg,
              type: '返回值类型应该为json'
            }).show()

            data.content = {
              dataList: [],
              formList: [],
              priFieldList: []
            }
          }

          return data.content
        }
        ,
        /** --获取数据方法-- **/
        async getRequest() {
          let vm = this

          // 获取qt2
          vm.getQt2()

          // 获取所有数据
          let info = await vm.getInfo()

          // init 所有数据
          vm.initData(info)
          // 渲染页面
          vm.renderInfo()

          vm.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
            vm.options.onLoad()
          });

        }
        ,
        /** --ajax方法-- **/
        ajax(obj) {
          let vm = this

          let data = obj.data || {}

          // 将原型或者本地存储中的apikey放入data
          if (vm.ajax.prototype && vm.ajax.prototype.hasOwnProperty('apikey')) {
            data.apikey = vm.ajax.prototype.apikey ? vm.ajax.prototype.apikey : ''
          } else if (localStorage.apikey) {
            data.apikey = localStorage.apikey
          }
          if (JSON.stringify(data) === '{}') {
            data = null
          } else {
            // data = Qs.stringify(data)
          }

          return axios({
            url: obj.url,
            method: 'post', // 默认是 get
            data: data,
            headers: {
              'X-Requested-With': 'XMLHttpRequest',
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            timeout: 50000,
          }).then(function (e) {
            if (obj.success) {
              obj.success(e.data)
            }
            if (obj.complete) {
              obj.complete()
            }
            if (e.data.status === 0) {
              vm.$createToast({
                txt: e.data.msg,
                type: 'error'
              }).show()
            }
            return e.data
          }).catch(function (e) {
            if (obj.fail) {
              obj.fail(e)
            }
            if (obj.complete) {
              obj.complete()
            }
            return e
          })
        }
        ,
      },
      beforeCreate: function () {
      },
      beforeMount(){
        this.getRequest()
      },
    }
    const inforeCoreComp = Vue.extend(MxInfoCoreComp)
    let mxInfoCore = {}

    Vue.prototype.$mxInfoCore = function (arg1, arg2) {
      if (typeof arg1 == "string") {
        var method = mxInfoCore.methods[arg1];
        if (method) {
          return method(arg2);
        } else {
          console.log("mxInfoCore没有这个方法");
          return;
        }
      }

      let params = arg1 || {};
      let inforeCore = null
      // 判断是否已经创建插件
      if (mxInfoCore[params.id]) {
        mxInfoCore[params.id].options = Object.assign({}, mxInfoCore[params.id].options, params)
        mxInfoCore[params.id].getRequest()
        mxInfoCore[params.id].show()

        inforeCore = mxInfoCore[params.id]
      } else {
        // 创建插件
        inforeCore = mxInfoCore.methods.create(params)
      }

      // 赋方法
      const {show, hide, getData, setData, setValue, forceUpdate} = inforeCore
      return {
        show,
        hide,
        getData,
        setData,
        setValue,
        forceUpdate
      }
    }

    mxInfoCore.methods = {
      getInfoCore(param) {
        const dom = document.getElementById(param)
        return dom ? mxInfoCore[param] : null
      },
      create(data) {
        // 判断是否配置插件id
        if (!data.id) {
          alert("您没有配置插件id")
          return
        }
        // 判断是否配置插件挂载点
        if (!data.el) {
          alert("您没有配置插件挂载点")
          return
        }

        // 创建模板
        const inforeCore = new inforeCoreComp()
        // 获取数据
        inforeCore.options = Object.assign(inforeCore.options, data)
        // 创建挂载点
        const dom = document.createElement('div')
        inforeCore.$mount(dom)

        const box = document.getElementById(data.el)
        box.appendChild(inforeCore.$el)

        mxInfoCore[data.id] = inforeCore
        return inforeCore
      },
      destroy(param) {
        let $el = document.getElementById(param)
        if ($el) {
          $el.remove()
          delete mxInfoCore[param]
        }
      }
    }
  }
}
window.MxInfoCore = MxInfoCore

