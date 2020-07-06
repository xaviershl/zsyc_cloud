/*
* @name: mxinfocore插件
* @author: pls
* @update: 2019-7-10
* @descript:
**/

//创建插件的工厂对象
  function MxInfoCore(option) {
    var vm = this;

    //浅拷贝传入值，以及设置默认值
    vm.$options = Object.assign({
      el: '', // 挂载元素id
      id: 'demo', // 插件id
      scene: '', // 插件场景
      formkey: '', // 表单key
      datakey: '', // 数据key
      groupkey: '', // 数据groupkey
      hasMxExcl: false, // 是否有excel
      canEdit: false, // 是否编辑
      canChangeForm: true, // 是否可以筛选表单
      disabled: false, // 是否可以设值
      showExpand: false, // 是否展示表单折叠
      showAiIdentify: true, // 是否展示证件识别
      dataRowCount: 1, // 表单格子数
      dataRowTitles: [], // 表单title
      btns:[], // 配置按钮
      title: '', // title
      quikSetDataReg: { // 用户快速设值习惯
        rowSign: '回车',
        colSign: '文字|数字',
      },
      userExpand:{  // 用户选项折叠习惯，用户表单折叠习惯
        fields: false,
        forms: true
      },
      width: '100%', // 插件宽
      height: '100%', // 插件高
      colWidth: '100%', // 列宽
      colHeight: '300px', // 列高
      inputWidth: '100%', // input宽
      plugStyle: '', // 插件外框样式
      marskStyle: '', // 插件marsk样式
      headerStyle: '', // 插件header样式
      contentStyle: '', // 插件content样式
      footerStyle: '', // 插件footer样式
      formTitleStyle: '', // 插件formTitle样式
      formColorStyle: '#f4f5f7', // 插件formColor样式
      buttonStyle: '', // 插件button样式
      basePath: '', // 配置请求前缀
      config: function (formkey) {}, // 配置表单
      confirm: function (datakey,value,logMap) {}, // 提交数据
      close: function (datakey,value) {}, // 关闭弹框
      onLoad: function (mxExcl) {}, // 加载完回调
      watch: function (newVal,oldVal,excel,item,index,from) {}, //监听orderList
      exceldblclick: function (e,p,data,target) {}, //监听exceldblclick
      excelclick: function (e,p,data,target) {}, //监听excelclick
      split: function (colSign,rowSign) {}, //分割规则
      onSaveUserExpand: function (info) {}, // 监听用户折叠习惯
    }, option);
    //让子页面找到本次创建的方法
    var mxInfoCoreMap = 'mxInfoCoreMap' + vm.$options.id;
    window[mxInfoCoreMap] = {
        id: vm.$options.id,
        el: vm.$options.el,
        width: vm.$options.width,
        height: vm.$options.height,
        colWidth: vm.$options.colWidth,
        colHeight: vm.$options.colHeight,
        inputWidth: vm.$options.inputWidth,
        title: vm.$options.title,
        headerStyle: vm.$options.headerStyle,
        contentStyle: vm.$options.contentStyle,
        footerStyle: vm.$options.footerStyle,
        formTitleStyle: vm.$options.formTitleStyle,
        formColorStyle: vm.$options.formColorStyle,
        buttonStyle: vm.$options.buttonStyle,
        scene: vm.$options.scene,
        formkey: vm.$options.formkey,
        datakey: vm.$options.datakey,
        groupkey: vm.$options.groupkey,
        hasMxExcl: vm.$options.hasMxExcl,
        canEdit: vm.$options.canEdit,
        disabled: vm.$options.disabled,
        canChangeForm: vm.$options.canChangeForm,
        showExpand: vm.$options.showExpand,
        showAiIdentify: vm.$options.showAiIdentify,
        dataRowCount: vm.$options.dataRowCount,
        dataRowTitles:vm.$options.dataRowTitles,
        btns: vm.$options.btns,
        basePath: vm.$options.basePath, // 配置请求前缀
        quikSetDataReg: vm.$options.quikSetDataReg, // 配置请求前缀
        userExpand: vm.$options.userExpand, // 配置请求前缀
        config: function (formkey) {
            vm.$options.config(formkey)
        },
        confirm: function (datakey,value,logMap) {
            vm.$options.confirm(datakey,value,logMap)
        },
        close: function (datakey,value,to) {
            vm.close()
            if (to === 'cancel') {
                vm.$options.close(datakey,value)
            }
        },
        onLoad: function (mxExcl) {
            vm.$options.onLoad(mxExcl)
        },
        watch: function (newVal,oldVal,excel,item,index,from) {
          vm.$options.watch(newVal,oldVal,excel,item,index,from)
        },
        exceldblclick: function (e,p,data,target) {
          vm.$options.exceldblclick(e,p,data,target)
        },
        excelclick: function (e,p,data,target) {
          vm.$options.excelclick(e,p,data,target)
        },
        split: function (colSign,rowSign,target) {
          vm.$options.split(colSign,rowSign,target)
        },
        onSaveUserExpand: function (info) {
          vm.$options.onSaveUserExpand(info)
        }
      };

      // 创建iframe弹框
    vm.creatIframe = function () {
      var body = document.getElementsByTagName('body')[0];
      var frame = document.createElement("iframe");
      frame.className = "mxInfoCore-iframe";
      frame.id = vm.$options.id;

      let cloudName = "zsyc_cloud";
      //默认规则，在开发环境时需要带以zsyc_cloud项目名字作为跟请求路径的起点
      let isDev = window.location.pathname.indexOf('/' + cloudName + '/') === 0 || window.location.href.indexOf('clouddev') !== -1;
      //根路径，host属性中是带有端口号的
      let basePath = '//' + window.location.host + (isDev ? ('/' + cloudName) : '');

      if (window.location.href.indexOf('clouddev') !== -1) {
          basePath = '//' + window.location.host
      }
      let currentVersion = new Date().getTime();
      if (top.currentVersion) {
        currentVersion = top.currentVersion
      }
/*      var src = basePath + '/xyzCommonFrame/mxplug/mxinfocore/dist/index.html?scene='
        + vm.$options.scene + '&formkey=' + vm.$options.formkey + '&datakey='
        + vm.$options.datakey + '&dataRowCount=' + vm.$options.dataRowCount+ '&dataRowTitles=' + vm.$options.dataRowTitles.join(',')
        + '&colWidth=' + ((vm.$options.colWidth + '').indexOf('%') > -1 ? (vm.$options.colWidth + '25') : vm.$options.colWidth) + '&colHeight=' + ((vm.$options.colHeight + '').indexOf('%') > -1 ? (vm.$options.colHeight + '25'): vm.$options.colHeight)+  '&title=' + vm.$options.title
        + '&id=' + vm.$options.id+  '&canEdit=' + vm.$options.canEdit+  '&hasMxExcl=' + vm.$options.hasMxExcl + '&disabled=' + vm.$options.disabled;*/
      var src = basePath + '/xyzCommonFrame/mxplug/mxinfocore/dist/index.html?id='+ vm.$options.id + '&cctv=' + currentVersion

      frame.setAttribute("src",src);
      frame.setAttribute('style','width:'+vm.$options.width +
        ';height:'+vm.$options.height + ';box-shadow: 0 0 5px rgba(0,0,0,.1);border: none;position:absolute;top:0;bottom:0;left:0;right:0;margin:auto;' +
        'border-radius: 10px;z-index:10;');
      frame.style.cssText += vm.$options.plugStyle
      //创建遮罩层
      var mask = document.createElement("div");
      mask.id =  'mask-'+ vm.$options.id;
      mask.setAttribute('style','position:absolute;top:0;bottom:0;left:0;right:0;z-index:9;background:rgba(0,0,0,0.2);')
      mask.style.cssText += vm.$options.marskStyle
      let target = vm.$options.el !== '' ? document.getElementById(vm.$options.el) : body;
      target.style.cssText += "position:relative;"
      target.appendChild(frame);
      target.appendChild(mask);
    }
    // 初始化
    vm.init = function () {
      //创建插件外框
      vm.creatIframe();
    };
    vm.init();


    /*-- 方法 --*/

    vm.close = function () {
      document.getElementById(vm.$options.id).remove()
      document.getElementById('mask-'+ vm.$options.id).remove()
      delete window[mxInfoCoreMap]
    }

    vm.submit = function () {
      document.getElementById(vm.$options.id).contentWindow.vue.submit('outClick')
    }

    vm.getData = function () {
      let data = document.getElementById(vm.$options.id).contentWindow.vue.orderList
      return data
    }

    vm.setData = function (data) {
        document.getElementById(vm.$options.id).contentWindow.vue.setData(data)
    }

    vm.setValue = function (index,value) {
      document.getElementById(vm.$options.id).contentWindow.vue.setValue(index,value)
    }

    vm.forceUpdate = function () {
      document.getElementById(vm.$options.id).contentWindow.vue.forceUpdate()
    }

  }

