/*
* @name: mxinfocore移动端插件
* @author: pls
* @update: 2019-11-13
* @descript:
**/

import MxInfoCoreComp from './mx-infoCore.vue'

var MxInfoCore = {
  install (Vue, options) {
    const infoCoreComp = Vue.extend(MxInfoCoreComp)
    let mxInfoCore = {}

    Vue.prototype.$mxInfoCore = function (arg1,arg2) {
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

      // 判断是否已经创建插件
      if (mxInfoCore[params.id]) {
        mxInfoCore[params.id].options = Object.assign({},mxInfoCore[params.id].options,params)
        mxInfoCore[params.id].mxData = Object.assign({},mxInfoCore[params.id].data,params.data)

      } else {
        // 创建插件
        let infoCore = mxInfoCore.methods.create(params)
        // 赋方法
        const {show, hide,getData,setData,setValue,forceUpdate} = infoCore

        return {
          show,
          hide,
          getData,
          setData,
          setValue,
          forceUpdate
        }
      }
    }

    mxInfoCore.methods = {
      isInforeCore (param) {
        const dom =  document.getElementById(param)
        return dom ? true : false
      },
      create (data) {
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
        const infoCore = new infoCoreComp()
        // 获取数据
        infoCore.options = Object.assign(infoCore.options,data)
        // 创建挂载点
        const dom = document.createElement('div')
        infoCore.$mount(dom)

        const box = document.getElementById(data.el)
        box.appendChild(infoCore.$el)

        mxInfoCore[data.id] = infoCore
        return infoCore
      },
      destroy (param) {
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

export default MxInfoCore


