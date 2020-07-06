<template>
  <div class="e-mxInforeCore"
       :id='options.id'
       v-show="showInforeCore">
    <header>
      <div class="searchBox">
        <div class="searchContent">
          <cube-input class="search-input"
                      v-model="searchText"
                      placeholder="请输入名字"
          >
            <i class='cubeic-search' slot="prepend"></i>
          </cube-input>
        </div>
        <div class="searchBtn" @click="searchForm">搜索</div>
      </div>
    </header>
    <aside>
      <cube-select class="select"
                   v-model="formkeyValue"
                   :options="formOptions"
                   placeholder="请选择"
                   @change="changeForm"
      >
      </cube-select>
    </aside>
    <section>
      <template v-for="(form,formIndex) in titleList" v-if="item.type !=='blank'">
        <div class="form" v-show="form.show">
          <div class="title" @click="showItem(form,formIndex)">
            <template v-if="options.dataRowType.type===1">
              <div class="title-1">
                <i class="iconfont icon-nv" :class="{'icon-nan': form.item5 === 'man'}"></i>
                <span>{{!form.item1?'客'+(formIndex+1):form.item1}}</span>
              </div>
              <div class="title-2">
                <template v-if="!form.item1">
                  <p style="line-height: 0.4rem;">游客{{formIndex+1}}</p>
                </template>
                <template v-if="form.item1">
                  <p><span>{{form.item2}}</span> | <span>{{form.item3}}</span></p>
                  <p>{{form.item4}}</p>
                </template>
              </div>
            </template>
            <div class="title-3" :class="{'down':form.showList}"><i class="cubeic-select"></i></div>
            <div class="title-4" :class="form.percent>80 ? 'green': form.percent>30 ? 'yellow': 'red'">
              {{form.percent}}%
            </div>
            <div class="title-5" @click.stop="showOrc(formIndex)" v-if="options.showAiIdentify">
              <i class="iconfont icon-orc"></i>
            </div>

          </div>
          <div class="itemList" :style="{maxHeight:form.showList?'30rem':'0'}">
            <!--<div class="itemList">-->
            <template v-if="form.showList">
              <div class="item" v-for="(item,itemIndex) in mxData[formIndex].dataList">
                <div class="item-label">{{item.nameCn}}</div>
                <div class="item-input">
                  <!--text,number类型-->
                  <div class="form-input" v-if="item.type === 'text'|| item.type === 'number'">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <input v-model="item.value" class="mxInput"
                           :type="item.type"
                           placeholder="请输入内容"
                           :disabled="options.disabled"
                           @change="changeValue([formIndex,itemIndex],item)"
                    ></input>
                  </div>
                  <!--textarea类型-->
                  <div class="form-input" v-if="item.type === 'textarea'">
                    <cube-textarea v-model="item.value"
                                   :placeholder="'请输入内容'"
                                   :maxlength="1000"
                                   :disabled="options.disabled"
                                   @change="changeValue([formIndex,itemIndex],item)"
                    ></cube-textarea>
                  </div>
                  <!--date类型-->
                  <div class="form-input" v-if="item.type === 'date'">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <input v-model="item.value" class="mxInput"
                           type="text"
                           readonly="true"
                           placeholder="请选择"
                           :disabled="options.disabled"
                           @change="changeValue([formIndex,itemIndex],item)"
                           @click="showDatePicker([formIndex,itemIndex],item)"
                    ></input>
                  </div>
                  <!--time类型-->
                  <div class="form-input" v-if="item.type === 'time'">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <input v-model="item.value" class="mxInput"
                           type="text"
                           readonly="true"
                           placeholder="请选择"
                           :disabled="options.disabled"
                           @change="changeValue([formIndex,itemIndex],item)"
                           @click="showTimePicker([formIndex,itemIndex],item)"
                    ></input>
                  </div>
                  <!--下拉类型-->
                  <div class="form-input" v-if="item.type === 'combobox'">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <p @click="showPicker([formIndex,itemIndex],item)" :class="{'hasValue':item.value}">
                      {{item.value?item.value:'请选择'}}</p>
                    <p class="disabled" :class="{'zindex1':options.disabled}"></p>
                  </div>
                  <!--下拉类型(多选)-->
                  <div class="form-input" v-if="item.type === 'mCombobox'">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <p @click="showMPicker([formIndex,itemIndex],item)" :class="{'hasValue':item.value}">
                      {{item.value?item.value:'请选择'}}</p>
                    <p class="disabled" :class="{'zindex1':options.disabled}"></p>
                  </div>
                  <!--上传-->
                  <div class="form-input" v-if="item.type === 'image'||item.type == 'zip'">
                    <cube-upload
                      :ref="'update'+item.nameKey+formIndex"
                      v-model="item.files"
                      :action=uploadAction
                      @file-error="(value) =>errorFiles(item,value,[formIndex,itemIndex])"
                      @file-removed="(value)=>uploadFiles(item,value,[formIndex,itemIndex])"
                      @file-success="(value)=>uploadFiles(item,value,[formIndex,itemIndex])"
                    />
                    <p class="disabled" :class="{'zindex1':options.disabled}"></p>
                  </div>
                  <!--ckeditor-->
                  <!--默认类型-->
                  <div class="form-input" v-if="!typeList.includes(item.type)">
                    <i class="cubeic-wrong clear" v-show="!!item.value" @click="clearValue([formIndex,itemIndex],item)"></i>
                    <input type="text"
                           v-model="item.value"
                           placeholder="请输入内容"
                           :disabled="options.disabled"
                           @blur="changeValue([itemIndex,itemIndex],item)"
                    >
                  </div>

                </div>
              </div>
            </template>
          </div>
        </div>
      </template>
    </section>
    <cube-popup
      type="mCombobox" position="bottom" :mask-closable="true"
      ref="mCombobox">
      <div class="mCombobox-choose">
        <div class="mCombobox-choose-cancel" @click="cancelMpicker">取消</div>
        <h1 class="mCombobox-choose-title">请选择</h1>
        <div class="mCombobox-choose-confirm" @click="confirmMpicker">确认</div>
      </div>
      <div class="mCombobox-content">
        <cube-scroll
          ref="scroll"
          :data="mCombobox.data">
          <cube-checkbox-group
            v-model="mCombobox.value"
            :options="mCombobox.data">
          </cube-checkbox-group>
        </cube-scroll>
      </div>
    </cube-popup>
    <div class="ocrcontainer" v-if="orcData.show">
      <div class="bg" @click="showOrc"></div>
      <div class="main">
        <div class="mainheader">证件识别</div>
        <div class="example">
          <cube-upload
            ref="ocrUpload"
            v-model="orcData.imgUrl"
            :action="uploadAction"
            :process-file="processFile"

            @files-added="aiadded"
            @file-error="(value) =>errorFiles(item,value)"
          >
            <div class="clear-fix">
              <cube-upload-file v-for="(file, i) in orcData.imgUrl" :file="file" :key="i"></cube-upload-file>
              <cube-upload-btn :multiple="false">
                <img src="" alt="">
              </cube-upload-btn>
            </div>
          </cube-upload>
        </div>
        <ul class="cardChoose">
          <li v-for="(item, index) in orcData.typeList"
              class="carChooseCell" :class="{'active':item.check}"
              @click="cardChoose(item)">
            <i class="iconfont" :class="item.icon"></i>
            <span>{{item.title}}</span>
            <i class="iconfont icon-zuoshangjiao-tuijian" v-show="item.check"></i>
          </li>
        </ul>
        <div class="poupBtn" @click="ocrFn()">开始识别</div>
      </div>

    </div>
    <footer>
      <div class="btn"
           v-for="btn in options.btns"
           @click="btn.handler()"
           :id="btn.id"
      >
        <span>{{btn.text}}</span>
      </div>
      <div class="btn submit" @click="submit"><span>提交</span></div>
      <div class="btn" @click="pageColse"><span>关闭</span></div>
    </footer>
  </div>
</template>

<script>
  import axios from 'axios'

  let Qs = require('querystring');

  let vm
  export default {
    name: 'EmxinforeCore',
    data() {
      return {
        /** --传入属性-- **/
        mxData: [],
        options: {
          el: '', // 挂载元素id
          id: '', // 插件id
          scene: 'SuperCustomer', // 插件场景
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
        vm.showInforeCore = true
      },
      hide() {
        vm.showInforeCore = false
      },
      getData() {
        return JSON.parse(JSON.stringify(vm.mxData))
      },
      setData(data) {
        vm.clearCurrentConfig()
        let mxData = vm.mergeData(data)
        vm.orderInfo = JSON.parse(JSON.stringify(mxData))
        vm.mxData = JSON.parse(JSON.stringify(mxData))

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
      setValue(index, value) {
        this.$set(vm.mxData[index.r].dataList[index.c], 'value', value)
        this.$forceUpdate()
      },
      forceUpdate() {
        vm.$forceUpdate()
      },
      /** --初始化数据方法-- **/
      initData(info) {
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

              vm.mxData[index1] && vm.mxData[index1].dataList && vm.mxData[index1].dataList.forEach(function (item, index1) {
                if (vm.options.dataRowType.reg[title] === item2.nameKey && item2.type !== "blank") {
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

      },
      /** --洗数据方法-- **/
      clearCurrentConfig() {
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
                  if (titleItem[title] === item2.nameKey) {
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
        vm.titleList.forEach(title => {
          if (!vm.searchText) {
            title.show = true
          } else {
            title.show = title.item1.indexOf(vm.searchText) > -1
          }
        })
      },
      changeValue(index, item) {
        vm.options.watch(index, item)
        let oldData = JSON.parse(JSON.stringify(vm.cloneMxData))
        vm.cloneMxData = JSON.parse(JSON.stringify(vm.mxData))
        vm.options.watch(vm.mxData,oldData,item,{r:index[0],c:index[1]})
      },
      clearValue(index, item) {
        item.value = ''
        vm.changeValue(index, item)
      },
      pageColse() {
        vm.showInforeCore = false
        vm.options.close(vm.options.datakey, JSON.parse(JSON.stringify(vm.mxData)))
      },
      changeForm(value, index, text) {
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
        if (form.showList) {
          vm.titleList = vm.getTitle(vm.mxData)
        }
        form.showList = !form.showList
      },
      // 打开日期
      showDatePicker(index, item) {
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
        this.mCombobox.index = []
        this.mCombobox.data = []
        this.mCombobox.value = []
        this.$refs.mCombobox.hide()
      },
      confirmMpicker() {
        let index = this.mCombobox.index
        let value = this.mCombobox.value.join(',')
        vm.$set(vm.mxData[index[0]].dataList[index[1]], 'value', value)
        vm.changeValue(index, vm.mxData[index[0]].dataList[index[1]])

        this.cancelMpicker()
      },
      // 上传文件
      getQt2() {
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
        const file = this.orcData.imgUrl[0]
        file && this.$refs.ocrUpload.removeFile(file)
      },
      // 压缩图片转为base64
      processFile(file, next) {
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
        let data = await vm.ajax({
          url: '/InfoCore_InfoCoreWS/getDataForInitPlugin.do',
          data: {
            datakeys: vm.options.datakey,
            // scene: vm.options.scene
            scene: ''
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
    /**
     * 生命周期
     **/
    //el 和 data 并未初始化
    beforeCreate: function () {
      vm = this;
    },
    created() {
      vm.getRequest()
    },
    watch: {
      /* "searchText": {
         handler: function (val, older) {
           this.searchForm()
         },
         deep: true
       }*/
    }
  }
</script>
<style>
  @import url('//at.alicdn.com/t/font_1012032_ru1w4v3h6w.css');
</style>
<style lang="less">
  @theme: #2787ff;
  @background: #faf9fe;
  .e-mxInfoCore {
    .cube-textarea-wrapper {
      .cube-textarea {
        background: @background;
        padding: 0;
        border: none;
        &::-webkit-input-placeholder {
          line-height: .4rem;
          color: #999;
          font-size: .12rem;
          font-family: Arial;
        }
      }
    }
    .cube-mCombobox {
      .cube-popup-content {
        height: 273px;
        background: #fff;
        .mCombobox-choose {
          position: relative;
          height: 60px;
          background: #fff;
          .mCombobox-choose-cancel {
            position: absolute;
            left: 0;
            color: #999;
          }
          .mCombobox-choose-title {
            padding: 0 60px;
            font-size: 18px;
            line-height: 60px;
            font-weight: 400;
            color: #2787ff;
            text-align: center;
          }
          .mCombobox-choose-confirm {
            position: absolute;
            top: 0;
            right: 0;
            color: #2787ff;
          }
          .mCombobox-choose-cancel, .mCombobox-choose-confirm {
            line-height: 60px;
            padding: 0 16px;
            box-sizing: content-box;
            font-size: 14px;
          }
        }
        .mCombobox-content {
          height: 213px;
        }
      }
    }

    .cube-upload-file, .cube-upload-file .cube-upload-file_error,
    .cube-upload-def .cube-upload-btn,
    .cube-upload-def .cube-upload-file {
      margin: 4px 4px 4px 0;
      .cubeic-wrong {
        line-height: 20px;
      }
      .cube-upload-file-def {
        width: 60px;
        height: 60px;
      }
      .cube-upload-btn-def {
        width: 60px;
        height: 60px;
      }
    }
    .ocrcontainer {
      .cube-upload-file, .cube-upload-btn {
        margin: 0;
        height: 1.2rem;
      }
      .cube-upload-file + .cube-upload-btn {
        margin-top: -1.2rem;
        opacity: 0;
      }
      .cube-upload-file-def {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background-size: contain;
      }
      .cubeic-wrong {
        display: none;
      }
      .cube-upload-btn {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  }
</style>
<style lang="less" scoped>
  @theme: #2787ff;
  @background: #faf9fe;
  .e-mxInfoCore {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: #f2f2f2;
    color: black;
    z-index: 2;
    overflow: hidden;
    header {
      .searchBox {
        display: flex;
        background-color: @theme;
        .searchContent {
          display: flex;
          flex: 1;
          margin: .1rem .2rem;
          .cubeic-search {
            line-height: .3rem;
            margin-left: .1rem;
            font-size: .28rem;
            color: #ccc;
          }
          .search-input {
            flex: 1;
            /*height: .28rem;*/
            border-radius: 20px;
            overflow: hidden;
          }
        }

        .searchBtn {
          display: flex;
          width: .4rem;
          align-items: center;
          text-align: center;
          color: #fff;
        }

      }
    }
    aside {
      display: flex;
      padding: 0.1rem;
      box-shadow: 0 5px 10px -5px rgba(0, 0, 0, 0.2);
      background: #fff;
      .select {
        flex: 1;
      }
      .btn {
        width: .9rem;
        margin-left: .2rem;
        background: @theme;
        color: #fff;
        border-radius: 20px;
        font-size: .12px;
        line-height: .4rem;
        text-align: center;
      }
    }
    section {
      position: absolute;
      top: 1.3rem;
      bottom: 0.4rem;
      left: 0;
      width: 100%;
      overflow: auto;
      z-index: 1;
      .form {
        padding: .1rem;
        margin: 0 0 0.1rem;
        background: #fff;
        overflow-x: hidden;
        .itemList {
          margin-top: .1rem;
          padding: 0 .1rem;
          background: @background;
          border-radius: 5px;
          overflow: hidden;
          transition: all .3s;
        }

        &:last-child {
          margin-bottom: 0;
        }
      }
      .title {
        height: .4rem;
        background: #fff;
        &.arrow {
          padding-bottom: .1rem;
          border-bottom: 1px solid #ccc;
        }
        .title-1 {
          position: relative;
          float: left;
          width: .4rem;
          height: .4rem;
          border-radius: 50%;
          background: @theme;
          color: #fff;
          text-align: center;
          line-height: .4rem;
          font-size: 12px;
          margin-right: .1rem;
          span {
            display: block;
            overflow: hidden;
            height: .4rem;
          }
          i {
            position: absolute;
            top: -.05rem;
            right: 0;
            width: .16rem;
            height: .16rem;
            line-height: .16rem;
            border-radius: 50%;
            font-size: .12rem;
          }
          .icon-nv {
            background: #f87098;
          }
          .icon-nan {
            background: #16c6ff;
          }
        }
        .title-2 {
          float: left;
          line-height: .2rem;
          font-size: .12rem;
          p:first-child {
            color: #999;
            span:first-child {
              color: #333;
            }
          }
          p:last-child {
            color: #999;
          }
        }
        .title-3 {
          float: right;
          line-height: .4rem;
          font-size: .2rem;
          transform: rotate(-90deg);
          transition: transform .5s;
          &.down {
            transform: rotate(-180deg);
          }
        }
        .title-4 {
          float: right;
          width: .4rem;
          line-height: .4rem;
          color: #60e97f;
          margin: 0 .03rem 0 .05rem;
          &.green {
            color: #60e97f;
          }
          &.yellow {
            color: #edca76;
          }
          &.red {
            color: #c02427;
          }
        }
        .title-5 {
          i {
            font-size: .2rem;
          }
          float: right;
          line-height: .4rem;
          color: @theme;
        }
      }
      .item {
        background: @background;
        line-height: .4rem;
        border-bottom: 1px solid #ccc;
        display: flex;
        &:last-child {
          border-bottom: none;
        }
        .item-label {
          width: 1rem;
          overflow: hidden;
          color: #999;
          font-size: .12rem;
        }
        .item-input {
          flex: 1;
          min-height: .3rem;
          background: @background;
          .cube-input:after, .cube-textarea-wrapper:after {
            border: none;
          }
          input {
            background: @background;
            outline: none;
          }
          input::-webkit-input-placeholder {
            color: #999;
            font-size: .12rem;
          }
          .mxInput {
            width: e("calc(100% - .36rem)");
            height: 100%;
            background: @background;
            .cube-input-field {
              padding: 0;
            }
          }
          .form-input {
            position: relative;
            .cubeic-wrong.clear {
              float: right;
              color: #999;
              padding: 0 .1rem;
            }
          }
          .cube-textarea {
            color: #000;
          }
          .cubeic-wrong {
            /*line-height: .4rem;*/
          }
          p {
            :before {
              content: '';
              display: inline-block;
              vertical-align: middle;
            }
            width: e("calc(100% - .36rem)");
            display: inline-block;
            line-height: initial;
            color: #999;
            font-size: 0.14rem;
            &.hasValue {
              color: #000;
            }
            &.disabled {
              position: absolute;
              top: 0;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: -1;
            }
            &.disabled.zindex1 {
              z-index: 2;
            }
          }
        }
      }
    }
    .ocrcontainer {
      position: fixed;
      z-index: 20;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      top: 0;
      left: 0;
      text-align: center;
      .bg {
        height: 100%;
      }
      > .main {
        width: 3.2rem;
        height: 3.8rem;
        background: #fff;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        overflow: hidden;
        border-radius: 0.1rem;
        > .mainheader {
          height: 0.45rem;
          line-height: 0.45rem;
          width: 100%;
          text-align: center;
          color: #333;
          font-weight: bolder;
          border-bottom: 1px solid #C9C9C9;
        }
        .example {
          padding: 0.2rem 0 0.15rem;
          text-align: center;
          height: 1.55rem;
          img {
            text-align: center;
            width: 80%;
            height: 100%;
            background: url("./example.png");
            background-size: contain;
          }
        }
        .poupBtn {
          width: 2.8rem;
          height: 0.44rem;
          border-radius: 0.08rem;
          text-align: center;
          margin: 0.15rem auto 0.05rem;
          background-color: #3b72a8;
          line-height: 0.44rem;
          color: #fff;
        }
      }
    }
    .cardChoose {
      display: flex;
      justify-content: space-around;
      padding: 0 0.1rem;

      .carChooseCell {
        overflow: hidden;
        width: 0.8rem;
        height: 0.8rem;
        border-radius: 0.08rem;
        border: 1px dashed #b7b7b7;
        text-align: center;
        position: relative;
        color: #a8a8a8;
        i:first-child {
          display: block;
          height: 0.5rem;
          line-height: 0.5rem;
          font-size: 0.25rem;
        }
        .icon-zuoshangjiao-tuijian {
          position: absolute;
          top: 0;
          left: 0;
        }
        &.active {
          color: #3b72a8;
          border: 1px solid #3b72a8;
        }
      }
    }
    footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: .4rem;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: #f2f2f2;
      color: #fff;
      overflow: auto;
      .btn {
        flex: 1;
        max-width: 1.4rem;
        height: .3rem;
        margin: 0 .1rem;
        line-height: .3rem;
        text-align: center;
        background: #ccc;
        border-radius: 5px;
        overflow: hidden;
        &.submit {
          background: @theme;
        }
      }

    }
  }


</style>
