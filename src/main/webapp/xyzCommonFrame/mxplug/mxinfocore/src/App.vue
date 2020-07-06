<template>
  <div id="app">
    <!--header-->
    <header class="header" :style="headerStyle">
      <p class="mxWidth">{{title}}</p>
      <i @click="close('close')"></i>
    </header>
    <!--content-->
    <div class="content"
         v-loading="loading"
         :style="contentStyle"
    >
      <!--编辑-->
      <div class="editBox">

        <!--btnBox-->
        <div v-show="canChangeForm">
          <!--formList-->
          <div class="formListBox">
            <el-select
              :class="['select',{'edite':canEdit}]"
              v-model="configValue"
              clearable
              placeholder="选择已保存表单"
              @change="changeCurrentConfig(configList[configValue],'change')"
              @clear="clearCurrentConfig"
            >
              <i v-show="canEdit" slot="prefix" class="iconfont icon-bianji" @click.stop="saveConfig"></i>
              <i v-show="canEdit" slot="prefix" class="iconfont icon-shanchu1" @click.stop="removeConfig"></i>
              <el-option
                v-for="(i,index) in configList"
                :key="index"
                :label="i.label"
                :value="index">
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <!--<vm-scrollbar class="mxScrollbar" :wrapStyle="{'height': '100%'}" id="scrollBox">-->
      <div class="mxScrollbar" style="overflow: auto" id="scrollBox">
        <!--可用项页面-->

        <div v-show="canEdit"
             :class="['showCheckContent',{'hasHeight':!showFields&&showForms},{'noHeight':!showFields&&!showForms},{'fullWidth':!canEdit&&!showExpand}]">
          <div class="showCheckBox" v-show="showFields">
            <!--scene-->
            <div class="configList">
              <el-input placeholder="搜索" v-model="searchValue" class="input-with-select"
                        @change="searchField()"
              >
                <el-button slot="append" icon="el-icon-search" @click="searchField()"></el-button>
              </el-input>
              <div class="addBlank">
                <el-button plain
                           @click="selectField({'type':'blank','checked':true,'remove':false,'nameCn':'','options':'','nameKey':'blank'+blankNum,'formkey':formkey}),blankNum++">
                  添加空白
                </el-button>
              </div>
            </div>

            <div class="center">
              <div class="checkBox">
                <template v-for="(item, index) in fieldList">
                  <!--<vm-scrollbar style="height: 100%" :wrapStyle="{'height': '100%'}">-->
                  <div :class="['check-item',{'common': item.isDefault === 1}]"

                       v-show="item.show"
                  >
                    <el-checkbox
                      v-model="item.checked"
                      @change="selectField(item,'click')">{{item.nameCn}}
                    </el-checkbox>
                  </div>
                  <!--</vm-scrollbar>-->
                </template>
              </div>
            </div>
          </div>

          <div :class="['collapse checkBoxs',{'hasHeight':!showFields&&showForms},{'noHeight':!showFields&&!showForms}]"
               @click="showFields = !showFields,saveUserExpand()">
            {{showFields?'选项折叠':'选项展开'}}
            <span :class="showFields?'iconfont icon-arrow-up':'iconfont icon-arrow-down'"></span>
          </div>
        </div>


        <!--formBox-->
        <div
          v-if="!loading"
          :class="['formContent',{'hasHeight':!showForms&&showFields},{'noHeight':!showForms&&!showFields},{'fullWidth':!canEdit&&!showExpand}]">
          <div class="formBox" v-if="showForms">
            <!--遍历几个订单-->
            <div
              class="form-items"
              :key="index1"
              v-for="(arr,index1) in orderList"
              :style="{'width':colWidth === '100%' && orderList.length !== 1 ? 0 : colWidth,'min-height':colHeight,'flex': (colWidth === '100%' && orderList.length !== 1) ? '' :  'initial'}"
            >
              <!--title -->
              <div class="form-title" :style="formTitleStyle">
                <div class="title"><i :class="'iconfont '+arr.ico" v-if="arr.ico" style="float: left;margin-left: 10px;"></i> <span :style="arr.ico?'margin-left: 10px;':'margin-left: 20px;'">{{arr.dataTitle ? arr.dataTitle : ''}}</span></div>
                <span v-show="!disabled && showAiIdentify"
                      class="iconfont icon-shibieduixiang"
                      @click="aiIdentify = !aiIdentify,aiData.formIndex = index1"></span>
              </div>

              <vuedraggable
                v-model="orderList[index1].dataList"
                @change="sortFormItem($event,index1)"
                v-bind="{
                  group:{name:'orderList',pull:true,put:false},
                  animation: 150,
                  handle: '.canMove',  // 在列表项中拖动句柄选择器。
                }"
              >
                <transition-group tag="div" class="form-box" :style="{'min-height': !!index1 && formItemHeight}">
                  <template v-if="!showList[index1] || !index1">
                    <template v-for="(item, index2) in arr.dataList">
                      <!--遍历几个输入框-->
                      <div class="form-item"
                           :key="'key'+index2"
                           :style="{
                     'width':(item.type==='editor'||item.type==='ckeditor')? '100%': inputWidth,
                     'clear':((item.type==='image'||item.type==='zip'||item.type==='editor'||item.type==='ckeditor')&&
                     (arr.dataList[index2-1]&&(arr.dataList[index2-1].type!=='image'&&arr.dataList[index2-1].type!=='zip'&&arr.dataList[index2-1].type!=='editor'&&arr.dataList[index2-1].type!=='ckeditor')))||
                     ((item.type!=='image'&&item.type!=='zip'&&item.type!=='editor'&&item.type!=='ckeditor')&&
                     (arr.dataList[index2-1]&&(arr.dataList[index2-1].type==='image'||arr.dataList[index2-1].type==='zip'||arr.dataList[index2-1].type==='editor'&&arr.dataList[index2-1].type!=='ckeditor')))
                     ?'both':''}"
                           v-show="!xyzIsNull(item.options) && item.options.disabled ? !item.options.disabled:true"
                           @mouseenter="canEdit&&item.type == 'blank'?item.remove=true:''"
                           @mouseleave="canEdit&&item.type == 'blank'?item.remove=false:''"
                      >
                        <!--匹配新增的可删除-->
                        <i v-if="item.type == 'blank'&&item.remove" class="iconfont icon-close-b removeFormItem"
                           @mousedown.stop @click.stop="removeOldItem(item,index1,index2)"></i>

                        <!--label-->
                        <div :class="['form-label',{'canMove': (canEdit||item.delete)&&(xyzIsNull(item.options)?true:!item.options.uneditable)}]">
                          <span style="color:#ff5252">{{item.delete?"(":""}}</span>
                          <span
                            :style="{'color': !xyzIsNull(item.options) && item.options.warningMark ? '#ff5252':'#555'}">{{item.type == 'blank'&&canEdit?'空白':item.nameCn}}</span>
                          <span style="color:#ff5252">{{item.delete?")未在表单中":""}}</span>
                          <i class="iconfont icon-icon"
                             v-show=" !xyzIsNull(item.options) && item.options.warningMark"></i>
                        </div>
                        <!--input-->
                        <!--空白类型-->
                        <div :class="[{'removeFormItem':item.remove},'form-input']" v-if="item.type == 'blank'">
                          <div class="blank"></div>
                        </div>
                        <!--text类型-->
                        <div class="form-input" v-if="item.type == 'text'">
                          <el-input v-model="item.value"
                                    :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请输入内容'"
                                    clearable
                                    :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                    @change="changeValue('form',[index1,index2],item)"
                          ></el-input>
                        </div>
                        <!--number类型-->
                        <div class="form-input" v-if="item.type == 'number'">
                          <el-input v-model="item.value"
                                    :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请输入数字内容'"
                                    clearable
                                    :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                    type="number"
                                    @change="changeValue('form',[index1,index2],item)"
                          ></el-input>
                        </div>
                        <!--textarea类型-->
                        <div class="form-input" v-if="item.type == 'textarea'">
                          <textarea class="el-textarea__inner" readonly="readonly"
                                    @click="item.showTextarea=true,inputTextarea=item.value"
                                    v-model="item.value"
                                    :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                    rows="1"
                                    :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请输入内容'"
                          ></textarea>

                          <!--文本设值-->
                          <div class="textInputBox" v-show="item.showTextarea">
                            <div class="textInput">
                              <header>{{item.nameCn}}</header>
                              <el-input v-model="inputTextarea" placeholder="请输入内容" clearable
                                        type="textarea"
                              ></el-input>
                              <div class="tbnBox">
                                <div class="sure"
                                     :style="buttonStyle"
                                     @click="item.value = inputTextarea,item.showTextarea = false,inputTextarea='',changeValue('form',[index1,index2],item)"
                                >确定
                                </div>
                                <div class="cancel"
                                     :style="buttonStyle"
                                     @click="item.showTextarea = false,inputTextarea=''">取消
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!--date类型-->
                        <div class="form-input" v-if="item.type == 'date'">
                          <el-date-picker
                            v-model="item.value"
                            type="date"
                            :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                            :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'选择日期'"
                            value-format="yyyy-MM-dd"
                            @change="changeValue('form',[index1,index2],item)"
                          >
                          </el-date-picker>
                        </div>
                        <!--time类型-->
                        <div class="form-input  item-time-val" v-if="item.type == 'time'">
                          <!--      <el-time-picker
                                  v-model="item.value"
                                  @change="changeTime(item)"
                                  :picker-options="{}"
                                  placeholder="选择时间"
                                  format="HH:mm"
                                  value-format="HH:mm"
                                >
                                </el-time-picker>-->
                          <timePicker v-model="item.value"
                                      :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                      @change="changeValue('form',[index1,index2],item)"></timePicker>
                        </div>
                        <!--下拉类型-->
                        <div class="form-input" v-if="item.type == 'combobox'">
                          <el-select v-model="item.value" clearable
                                     :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                     :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请选择'"
                                     @change="changeValue('form',[index1,index2],item)"
                          >
                            <el-option
                              v-for="i in item.data"
                              :key="i[0]"
                              :label="i[1]"
                              :value="i[0]">
                            </el-option>
                          </el-select>
                        </div>

                        <!--下拉类型(多选)-->
                        <div class="form-input" v-if="item.type == 'mCombobox'">
                          <el-select v-model="item.value" clearable
                                     :multiple='true'
                                     :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                                     :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请选择'"
                                     @change="changeValue('form',[index1,index2],item)"
                          >
                            <el-option
                              v-for="i in item.data"
                              :key="i[0]"
                              :label="i[1]"
                              :value="i[0]">
                            </el-option>
                          </el-select>
                        </div>
                        <!--上传照片-->
                        <div class="form-input" v-if="item.type == 'image'">
                          <xyzuploader
                            :value='item.value'
                            :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                            :uploadBtnText="'上传'"
                            @complete="customerUploadImg($event,item)"
                            @romoveItem="deleteImg($event,item)"
                          >
                          </xyzuploader>
                        </div>

                        <!--上传文件-->
                        <div class="form-input" v-if="item.type == 'zip'">
                          <xyzuploader
                            :value='item.value'
                            :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                            :uploadBtnText="'上传'"
                            @complete="customerUploadImg($event,item)"
                            @romoveItem="deleteImg($event,item)"
                          >
                          </xyzuploader>
                        </div>

                        <!--ckeditor-->
                        <div class="form-input" v-if="item.type == 'editor'||item.type == 'ckeditor'">
                          <textEditor :option="item" :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"></textEditor>
                        </div>

                        <!--默认类型-->
                        <div class="form-input" v-if="(
                  item.type !== 'editor'&&item.type !== 'ckeditor'&&item.type !== 'zip'&&item.type !== 'image'
                  &&item.type !== 'mCombobox'&&item.type !== 'combobox'&&
                  item.type !== 'time'&&item.type !== 'date' &&
                  item.type !== 'textarea' && item.type !== 'number'&&item.type !== 'text'&&item.type !== 'blank')">
                          <el-input v-model="item.value"
                                    :placeholder="!xyzIsNull(item.options) && !xyzIsNull(item.options.placeholder) ? item.options.placeholder :'请输入内容'"
                                    clearable
                                    :disabled="disabled||(!xyzIsNull(item.options)&&item.options.readonly)"
                          ></el-input>
                        </div>
                      </div>
                    </template>
                  </template>
                </transition-group>
              </vuedraggable>
            </div>
          </div>

          <div
            :class="['collapse forms',{'hasHeight':!showFields&&showForms},{'noHeight':!showFields&&!showForms&&canEdit}]"
            v-show="showExpand"
            @click="showForms = !showForms,saveUserExpand()">
            {{showForms?'表单折叠':'表单展开'}}
            <span :class="showForms?'iconfont icon-arrow-up':'iconfont icon-arrow-down'"></span>
          </div>

        </div>
        <!--excel-->
        <div :class="['excelContent',{'fullWidth':!canEdit&&!showExpand}]" v-show="hasMxExcl" id="excelContent">
          <div class="excelBox">
            <div id="mxInfoExcel"></div>
          </div>
        </div>
        <!--</vm-scrollbar>-->
      </div>

    </div>
    <!--footer-->
    <div class="btnBox" :style="footerStyle">
      <div class="sure"
           :id="item.id"
           @click="item.handler"
           v-for="item in btns"
           :style="buttonStyle"
      >{{item.text}}
      </div>
      <div :class="['sure',{'noSubmit':noSubmit}]" @click="disabled?saveConfig():submit()" :style="buttonStyle">
        {{noSubmit?'提交中...':'提交'}}
      </div>
      <div class="cancel" @click="close('cancel')" :style="buttonStyle">关闭</div>
    </div>
    <!--文本设值-->
    <div class="textInputBox" v-show="isSplit">
      <div class="textInput">
        <header>文本录入</header>
        <el-autocomplete
          class="textCol"
          v-model="colSign"
          :fetch-suggestions="querySearch1"
          placeholder="请输入列分隔符"
          @select="handleSelect1"
        ></el-autocomplete>
        <el-autocomplete
          class="textRow"
          v-model="rowSign"
          :fetch-suggestions="querySearch2"
          placeholder="请输入行分隔符"
          @select="handleSelect2"
        ></el-autocomplete>
        <div v-if=" orderList.length > 0 && orderList[0].dataList.length > 0"
             style="margin: 10px 14px 0px;color: #606266;">
          <template v-for="item in orderList[0].dataList">
            <span
              v-show="item.type !== 'editor' && item.type !== 'ckeditor' && item.type !== 'zip'
              && item.type !== 'image' && item.type !== 'blank' && (xyzIsNull(item.options)?true:!item.options.uneditable)
"
              style="float:left;font-size: 14px;">{{'【'+item.nameCn+'】'}}</span>
          </template>
        </div>
        <el-input v-model="splitTextarea" placeholder="请输入内容" clearable
                  type="textarea"
                  :disabled="disabled"
        ></el-input>
        <div class="tbnBox">
          <div class="sure" @click="split" :style="buttonStyle">确定</div>
          <div class="cancel" @click="isSplit = false" :style="buttonStyle">取消</div>

        </div>
      </div>
    </div>
    <!--识别-->
    <div class="textInputBox ai" v-show="aiIdentify">
      <div class="textInput">
        <header>证件识别</header>

        <div class="title-box">
          <div class="image-box" @click="uploadImage">
            <xyzuploader
              v-show="false"
              :id="{btnId: 'ai'}"
              style="opacity: 1"
              @complete="uploadImgFN"
            >
            </xyzuploader>
            <img v-if="aiData.imgUrl" :src="aiData.imgUrl" alt="" width="200" height="100">
            <i v-else class="iconfont icon-shangchuantupian"></i>
          </div>
          请确保证件文字清晰可见
        </div>
        <ul>
          <li v-for="(item, index) in aiData.typeList"
              :class="{checkCls: item.check}"
              @click="chooseItem(aiData.typeList, item)">
            <i :class="item.icon"></i>
            <span>{{item.title}}</span>
          </li>
        </ul>

        <div class="tbnBox">
          <div class="sure" @click="opticalCharacterRecognitionForPc(aiData,aiData.imgUrl,)" :style="buttonStyle">开始识别
          </div>
          <div class="cancel" @click="aiIdentify = false" :style="buttonStyle">取消</div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import vuedraggable from 'vuedraggable'
  import timePicker from './components/timePicker'
  import Qs from 'qs'
  import './assets/js/mxExcl.js'
  import './assets/js/jQuery-1.7.2.js'

  let cloudName = "zsyc_cloud";
  //根路径，host属性中是带有端口号的
  let basePath = window.location.href.indexOf('zsyc_cloud') > -1 ? ('/' + cloudName) : '';
  let vm
  window.backgroundColor = '#f4f5f7'
  export default {
    name: 'App',
    components: {vuedraggable, timePicker},
    data() {
      return {
        parentWindow: undefined,
        /** --传入属性-- **/
        id: '', // 插件id
        scene: '', // 插件场景
        formkey: '', // 表单key
        datakey: '', // 数据key
        groupkey: '', // 数据groupkey
        hasMxExcl: false, // 是否有excel
        canEdit: false, // 是否编辑
        disabled: false, // 是否可以设值
        canChangeForm: true,  // 是否可以筛选表单
        showExpand: false,  // 是否展示表单折叠
        showAiIdentify: true, //
        btns: [], // 配置按钮
        dataRowCount:1, // 表单格子数
        dataRowTitles: [], // 表单title
        title: '',// title
        colSign: '',
        rowSign: '',
        showFields: false,
        showForms: true,

        colWidth: '100%', // 列宽
        colHeight: '300px', // 列高
        inputWidth: '100%', // input宽
        headerStyle: '', // 插件header样式
        contentStyle: '', // 插件content样式
        footerStyle: '', // 插件footer样式
        formTitleStyle: '', // 插件formTitle样式
        formColorStyle: '#f4f5f7', // 插件formColor样式
        buttonStyle: '', // 插件button样式
        /** --ajax请求回数据-- **/
        fieldList: [],
        configList: [],
        formkeyConfig: {},
        orderInfo: [],
        /** --ajax请求数据 -- **/
        orderList: [],
        cloneOrderList: [],
        currentConfig: [],
        formkeyNameCn: '',
        /** --插件属性-- **/
        loading: true,
        basePath: '',
        /** --编辑页面属性-- **/
        parentWindow: null,
        configValue: null,
        searchValue: '',
        blankNum: 0,
        showDeleteBox: false,
        aiIdentify: false,
        aiData: {
          formIndex: null,
          imgUrl: null,
          url: '',
          type: '',
          typeList: [{
            title: '身份证',
            type: 'idcard',
            icon: 'iconfont icon-idCard',
            check: false
          }, {
            title: '护照',
            type: 'passport',
            icon: 'iconfont icon-passport',
            check: false
          }, {
            title: '港澳通行证',
            type: 'HK_Macau',
            icon: 'iconfont icon-HK_MC',
            check: false
          }]
        },
        noSubmit: false,
        /** --excel属性-- **/
        mxExcl: null,
        isSplit: false,
        splitTextarea: '',
        scrollTop: '',
        /** --表单属性-- **/
        inputTextarea: '',
        showList: [],
        renderTimer: null,
        formItemHeight: '',
      }
    },
    methods: {
      scroll1() {
        vm.scrollTop = document.getElementById("scrollBox").scrollTop
        let marginTop = document.getElementById("excelContent").offsetTop
        let target1 = document.querySelectorAll("#mxInfoExcel tbody tr")[0]
        let target2 = document.querySelectorAll("#mxInfoExcel .data-tbody tr")

        if (vm.scrollTop > marginTop) {
          if (vm.xyzIsNull(target1.getAttribute("class"))) {
            let className = ''
            className = vm.contentStyle.indexOf("0") > -1 ? "fixedTop" : "fixed"
            if (vm.showExpand || vm.canEdit) {
              target1.classList.add(className, "hasCollapse")
            } else {
              target1.classList.add(className)
            }
            target2.forEach(function (item) {
              item.classList.add("fixed")
            })
            document.getElementById("excelContent").style.paddingTop = '36px';
          }
        } else {
          if (!vm.xyzIsNull(target1.getAttribute("class"))) {
            let className = ''
            className = vm.contentStyle.indexOf("0") > -1 ? "fixedTop" : "fixed"
            if (vm.showExpand || vm.canEdit) {
              target1.classList.remove(className, "hasCollapse")
            } else {
              target1.classList.remove(className)
            }
            target2.forEach(function (item) {
              item.classList.remove("fixed")
            })
            document.getElementById("excelContent").style.paddingTop = '0';
          }
        }
        clearTimeout(vm.renderTimer)
        vm.renderTimer = setTimeout(() => {
          vm.setFormBoxStatus('scroll')
        }, 500)
      },
      setFormBoxStatus(type) {
        let formBoxList = document.querySelectorAll('.form-box') || []
        let screenHeight = window.screen.availHeight
        let elStyle
        type !== 'scroll' && formBoxList[0] && (vm.formItemHeight = formBoxList[0].getBoundingClientRect().height + 'px')
        vm.$nextTick(() => {
          formBoxList.forEach((item, index) => {
            elStyle = item.getBoundingClientRect()
            let top = elStyle.top, bottom = elStyle.bottom
            vm.showList[index] = top > screenHeight || bottom < -50
          })
          vm.$forceUpdate();
        })
      },
      async getRequest() {
        vm.id = vm.getQueryString('id')
        vm.parentWindow = parent.window['mxInfoCoreMap' + vm.id]
        vm.scene = vm.parentWindow && vm.parentWindow.scene || vm.scene
        vm.formkey = vm.parentWindow && vm.parentWindow.formkey || vm.formkey
        vm.datakey = vm.parentWindow && vm.parentWindow.datakey || vm.datakey
        vm.groupkey = vm.parentWindow && vm.parentWindow.groupkey || vm.groupkey
        vm.hasMxExcl = vm.parentWindow && vm.parentWindow.hasMxExcl || vm.hasMxExcl
        vm.canEdit = vm.parentWindow && vm.parentWindow.canEdit || vm.canEdit
        vm.disabled = vm.parentWindow && vm.parentWindow.disabled || vm.disabled
        vm.canChangeForm = vm.parentWindow ? vm.parentWindow.canChangeForm : vm.canChangeForm
        vm.showExpand = vm.parentWindow ? vm.parentWindow.showExpand : vm.showExpand
        vm.showAiIdentify = vm.parentWindow ? vm.parentWindow.showAiIdentify : vm.showAiIdentify
        vm.btns = vm.parentWindow && vm.parentWindow.btns || vm.btns
        vm.colSign = vm.parentWindow ? vm.parentWindow.quikSetDataReg.colSign : vm.colSign
        vm.rowSign = vm.parentWindow ? vm.parentWindow.quikSetDataReg.rowSign : vm.rowSign
        vm.showFields = vm.parentWindow ? (vm.canEdit ? vm.parentWindow.userExpand.fields : vm.showFields) : vm.showFields
        vm.showForms = vm.parentWindow ? (vm.showExpand ? vm.parentWindow.userExpand.forms : vm.showForms) : (vm.showExpand ? false : vm.showForms)
        let dataRowCount = vm.parentWindow && vm.parentWindow.dataRowCount || vm.dataRowCount
        vm.dataRowTitles = vm.parentWindow && vm.parentWindow.dataRowTitles || vm.dataRowTitles
        vm.title = vm.parentWindow && vm.parentWindow.title || vm.title

        vm.colWidth = vm.parentWindow && vm.parentWindow.colWidth || vm.colWidth
        vm.colHeight = vm.parentWindow && vm.parentWindow.colHeight || vm.colHeight
        vm.inputWidth = vm.parentWindow && vm.parentWindow.inputWidth || vm.inputWidth
        vm.headerStyle = vm.parentWindow && vm.parentWindow.headerStyle || vm.headerStyle
        vm.contentStyle = vm.parentWindow && vm.parentWindow.contentStyle || vm.contentStyle
        vm.footerStyle = vm.parentWindow && vm.parentWindow.footerStyle || vm.footerStyle
        vm.formTitleStyle = vm.parentWindow && vm.parentWindow.formTitleStyle || vm.formTitleStyle
        vm.formColorStyle = vm.parentWindow && vm.parentWindow.formColorStyle || vm.formColorStyle
        vm.buttonStyle = vm.parentWindow && vm.parentWindow.buttonStyle || vm.buttonStyle

        vm.basePath = (vm.parentWindow && vm.parentWindow.basePath && vm.parentWindow.basePath !== '') || basePath

        let orderList = []
        for (var i = 0; i < dataRowCount; i++) {
          orderList.push({
            datakey: '',
            formkey: '',
            dataTitle: vm.dataRowTitles[i] || "",
            dataList: []
          })
        }
        vm.orderList = orderList

        vm.showDeleteBox = vm.canEdit
        await vm.getInfo()
        vm.renderInfo()

        vm.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭// 创建excel 会依据当前变更数据
          if (vm.hasMxExcl) {
            document.getElementById("scrollBox").addEventListener('scroll', vm.scroll1, true)
          }

          vm.loading = false
          vm.parentWindow && vm.parentWindow.onLoad(vm.mxExcl)
        });
        return ""
      },
      renderInfo() {
        // 渲染formkey的表单
        if (Object.keys(vm.formkeyConfig).length > 0) {
          vm.changeCurrentConfig(vm.formkeyConfig, 'change')
        }
        // 渲染orderInfo
        if (vm.orderInfo.length > 0) {
          // 表单模板有变动，请您确认是否删除数据
          vm.orderInfo[0].dataList.length > 0 && vm.orderInfo[0].dataList.forEach(function (info, index1) {
            let configHasInfo = false

            vm.formkeyConfig.data && vm.formkeyConfig.data.forEach(function (config, index2) {
              if (config.nameKey === info.nameKey) {
                configHasInfo = true
              }
            })

            if (!configHasInfo) {
              let item = Object.assign({checked: true, delete: true}, info)

              // checkbox选中状态
              vm.fieldList.forEach(function (d) {
                // 原vm.fieldList没有blank类型，谨防后台新增
                if (d.nameKey === item.nameKey && d.type !== "blank") {
                  info.type = d.type
                  info.data = d.data

                  item.type = d.type
                  item.data = d.data
                  d.checked = true
                }
              })

              vm.selectField(item)
            }

          })
        }

        // 所有为空，formList不为空的情况,formList取isDefault为1的列表
        if (vm.orderInfo.length === 0 && Object.keys(vm.formkeyConfig).length === 0) {
          let hasisDefault = false
          vm.configList.length > 0 && vm.configList.forEach(function (list, index) {
            if (list.isDefault === 1) {
              hasisDefault = true
              vm.configValue = index
            }
          })
          if (hasisDefault) {
            vm.changeCurrentConfig(vm.configList[vm.configValue], 'change')
          } else {
            vm.configValue = null
            vm.fieldList.forEach(function (d) {
              // 原vm.fieldList没有blank类型，谨防后台新增
              if (d.isDefault === 1) {
                d.checked = true
                let item = Object.assign({}, d)
                vm.selectField(item)
              }
            })
          }
        }
      },
      /** --ajax请求回数据-- **/
      // 获取订单信息
      getInfo () {
        return new Promise ((resolve, reject) => {
          vm.ajax({
            url:vm.basePath +  '/InfoCore_InfoCoreWS/getDataForInitPlugin.do',
            data: {
              datakeys: vm.datakey,
              scene: vm.scene
            },
            success: function (e) {
              if (e.status === 1) {
                // 判断json
                if (Array.isArray(e.content)) {
                  vm.$message({
                    showClose: true,
                    type: 'info',
                    message: '返回值类型为数组,正确类型应该为json'
                  })
                  resolve()
                  return
                }
                // 获取私库list
                let priFieldList = e.content.priFieldList && vm.paseData(e.content.priFieldList)
                vm.fieldList = priFieldList.map(function (d) {
                  // checkbox选中，默认不选
                  d.checked = d.checked || false
                  // 搜索时用
                  d.show = true
                  //
                  if (d.type == 'textarea') {
                    d.showTextarea = false
                  }
                  if (!vm.xyzIsNull(d.options)) {
                    try {
                      let option = vm.xyzHtmlDecode(d.options);
                      option = eval('(' + option + ')');
                      d.options = typeof option === "object" ? option : ''
                    } catch (e) {
                      d.options = ''
                    }

                  }
                  return d
                })
                // 获取配置所有版本
                vm.configList = e.content.formList && e.content.formList.map(function (d) {
                  // 清洗数据
                  return {
                    value: d.formkey,
                    label: d.nameCn,
                    data: d.formFieldList
                  }
                })
                // 获取订单信息
                if (e.content.dataList && e.content.dataList.length > 0) {
                  // 不同datakey，会有数据不同的想象，需要合并
                  let currentConfig = []

                  e.content.dataList.forEach(function (item1, index1) {
                    item1.dataList.forEach(function (item2, index2) {
                      let itemNotInCurrentConfig = true
                      currentConfig.forEach(function (item, index) {
                        if (item.nameKey === item2.nameKey) {
                          itemNotInCurrentConfig = false
                        }
                      })

                      if (itemNotInCurrentConfig) {
                        let newItem = Object.assign({}, item2)
                        newItem.value = ''
                        currentConfig.push(newItem)
                      }
                    })
                  })

                  e.content.dataList.forEach(function (item1, index1) {
                    let newItem1 = []
                    currentConfig.forEach(function (item) {
                      let itemNotInCurrentConfig = false
                      item1.dataList.forEach(function (item2, index2) {
                        if (item.nameKey === item2.nameKey) {
                          itemNotInCurrentConfig = true
                          newItem1.push(item2)
                        }
                      })
                      if (!itemNotInCurrentConfig) {
                        let newItem = Object.assign({}, item)
                        newItem1.push(newItem)
                      }
                    })
                    item1.dataList = newItem1
                  })

                  e.content.dataList.forEach(function (item1, index1) {
                    item1.dataList.length > 0 && item1.dataList.forEach(function (item2, index2) {
                      // 覆盖typeContent
                      vm.fieldList.forEach(function (f) {
                        if (f.nameKey === item2.nameKey) {
                          item2.data = f.data
                        }
                      })
                      // 解析数组
                      if (item2.type === 'mCombobox') {
                        if (typeof item2.value === "string") {
                          item2.value = vm.xyzIsNull(item2.value) ? [] : item2.value.indexOf("[") > -1 ? eval("(" + item2.value + ")") : item2.value.split(",")
                        }
                      }
                      //
                      if (item2.type == 'textarea') {
                        item2.showTextarea = false
                      }
                      if (item2.type == 'blank') {
                        item2.remove = false
                      }

                      if (!vm.xyzIsNull(item2.options)) {
                        try {
                          let option = vm.xyzHtmlDecode(item2.options);
                          option = eval('(' + option + ')');
                          item2.options = typeof option === "object" ? option : ''
                        } catch (e) {
                          item2.options = ''
                        }
                      }
                    })
                  })
                  vm.orderInfo = e.content.dataList

                  if (vm.xyzIsNull(vm.formkey)) {
                    vm.formkey = vm.orderInfo[0].formkey
                  }
                }

                // 获取表单配置信息,vm.configValue
                vm.configList.forEach(function (c, index) {
                  c.data.forEach(function (d) {
                    if (d.formkey === vm.formkey) {
                      vm.configValue = index
                    }
                  })
                })
                vm.formkeyConfig = vm.configValue !== null ? JSON.parse(JSON.stringify(vm.configList[vm.configValue])) : vm.formkeyConfig
              } else {
                vm.$message({
                  showClose: true,
                  message: e.msg
                })
              }
              resolve()
            }
          })
        })
      },
      /** --ajax提交数据 -- **/
      // 保存版本配置
      saveConfig() {
        this.$prompt('此操作将保存该表单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: vm.formkeyNameCn,
          inputValidator: function (value) {
            let pattern = true
            if (value === '') {
              pattern = false
              return pattern
            }
            let repeatNameCn = false
            vm.configList.forEach(function (config, index) {
              if (config.label === value) {
                repeatNameCn = index === vm.configValue ? false : true
                if (vm.formkeyConfig.data && vm.formkey === vm.formkeyConfig.data[0].formkey) {
                  repeatNameCn = false
                }
              }
            })
            if (repeatNameCn) {
              pattern = '您输入的表单名称重复，请重新输入'
            }
            return pattern
          },
          inputErrorMessage: '请输入表单名称'
        }).then(({value}) => {
          vm.formkeyNameCn = value
          //有
          vm.saveConfigAjax(vm.formkeyNameCn, vm.formkey)
        }).catch(() => {
        });
      },
      saveConfigAjax(value, formkey) {
        let currentConfig = vm.sortOrderList().currentConfig
        // 发起请求
        vm.ajax({
          url: vm.basePath + '/InfoCore_InfoCoreWS/createForm.do',
          data: {
            formkey: formkey,
            scene: vm.scene,
            nameCn: value,
            remark: '',
            formJson: JSON.stringify(currentConfig)
          },
          success: function (e) {
            if (e.status === 1) {
              vm.formkey = e.content
              let addNewConfig = true
              let Newindex = null
              vm.configList.forEach(function (config, index) {
                if (config.value === vm.formkey) {
                  addNewConfig = false
                  Newindex = index
                }
              })
              let currentConfig = vm.currentConfig.map(function (d) {
                d.formkey = vm.formkey
                return d
              })

              let newConfig = Object.assign({}, {
                value: e.content,
                label: value,
                data: currentConfig
              })
              if (addNewConfig) {
                vm.configList.push(newConfig)
                vm.configValue = vm.configList.length - 1
                vm.changeCurrentConfig(vm.configList[vm.configValue], 'change')
              } else {
                vm.configValue = Newindex
                vm.configList[Newindex].label = value
                vm.configList[Newindex].data = vm.currentConfig
              }

              vm.$message({
                showClose: true,
                type: 'success',
                message: '保存成功'
              })

              parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].config(vm.formkey)
            } else {
              vm.$message({
                showClose: true,
                type: 'info',
                message: e.msg
              })
            }
          }
        })
      },
      //删除当前版本
      removeConfig() {
        this.$confirm('此操作将删除该表单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发起请求
          vm.ajax({
            url: vm.basePath + '/InfoCore_InfoCoreWS/deleteForm.do',
            data: {
              formkey: vm.formkey,
            },
            success: function (e) {
              if (e.status === 1) {
                vm.configList.forEach(function (config, index) {
                  if (config.value === vm.formkey) {
                    vm.configList.splice(index, 1)
                  }
                })
                vm.clearCurrentConfig()
                vm.$message({
                  showClose: true,
                  type: 'success',
                  message: '删除成功!'
                });
              } else {
                vm.$message({
                  showClose: true,
                  type: 'info',
                  message: e.msg
                })
              }
            }
          })
        }).catch(() => {
        });

      },
      sortOrderList() {
        let orderList = JSON.parse(JSON.stringify(vm.orderList))
        let currentConfig = JSON.parse(JSON.stringify(vm.currentConfig))
        let datakeys = vm.datakey.split(',')
        orderList.forEach(function (item1, index1) {
          item1.formkey = vm.formkey
          item1.datakey = datakeys[index1]
          item1.dataTitle = item1.dataTitle

          item1.dataList.forEach(function (item2, index2) {
            item2.sort = index2

            if (item2.type === 'mCombobox') {
              item2.value = item2.value.toString()
            }
            if (item2.type === 'image' || item2.type === 'zip') {
              if (Array.isArray(item2.value)) {
                item2.value = item2.value.join(",")
              }
            }
          })
        })


        currentConfig.forEach(function (item, index) {
          item.sort = index
        })
        return {
          orderList: orderList,
          currentConfig: currentConfig
        }
      },
      submit(form) {
        if (vm.noSubmit) {
          return
        } else {
          vm.noSubmit = form !== 'outClick' ? true : false
        }
        let orderList = vm.sortOrderList().orderList

        vm.ajax({
          scene: vm.scene,
          url: vm.basePath + '/InfoCore_InfoCoreWS/inputFormDataOper.do',
          data: {
            scene: vm.scene,
            groupkey: vm.groupkey,
            dataJson: JSON.stringify(orderList)
          },
          success: function (e) {
            vm.noSubmit = false
            // 返回datakey
            if (e.status === 1) {
              if (typeof e.content === 'string') {
                vm.datakey = e.content
              } else {
                vm.datakey = e.content.datakey
              }

              let message = !vm.formkey ? '提交成功！您还没有点击保存表单' : '提交成功'

              vm.$message({
                showClose: true,
                type: 'success',
                message: message
              })

              if (typeof e.content === 'string') {
                parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].confirm(vm.datakey, orderList)
              } else {
                parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].confirm(vm.datakey, orderList ,  e.content.logMap)
              }
            } else {
              vm.noSubmit = false
              vm.$message({
                showClose: true,
                type: 'info',
                message: e.msg
              })
            }
          }
        })
      },
      /** --编辑页面方法-- **/
      // 改变当前配置版本
      changeCurrentConfig(d, from) {
        if ((vm.configValue === '' || vm.configValue === null)) {
          return
        }
        vm.clearCurrentConfig('change')
        let data = d.data
        vm.formkey = d.value
        vm.formkeyNameCn = d.label
        // 私库被选中,添加表单列表

        data.length > 0 && data.forEach(function (c) {
          let listInFields = false
          let item = {}

          vm.fieldList.forEach(function (f) {
            if (f.nameKey === c.nameKey) {
              listInFields = true
              f.checked = true
              item = Object.assign({}, f)
            }
          })

          if (listInFields || c.type === 'blank') {
            item.formkey = vm.formkey
            if (c.type === 'blank') {
              item.checked = true
              item.nameCn = ''
              item.type = 'blank'
              item.nameKey = c.nameKey
              item.options = ''
              item.remove = false
            }
            // 改变订单信息
            vm.selectField(item, "init")
          }
        })

        if (vm.hasMxExcl) {
          vm.$nextTick(() => {
            vm.creatExcel()
          })
        }
      },
      // 配置添加表单列表
      selectField(d, from ,) {
        if (d.checked) {
          vm.addField(d, from)
        } else {
          vm.removeField(d, from)
        }
        // 2020-1-13 会删除
        if (from === 'click') {
          let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
          vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
          // 抛出插件外watch
          if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
            vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, {}, {}, 'excelPaste')
          }
        }
      },
      addField(d, from) {
        // 判断是否有空白重复
        let hasRepeatBlank = false
        let imageNumber = 0
        let editorNumber = 0
        vm.currentConfig.forEach(function (item, index) {
          // 原vm.currentConfig中blank类型的nameKey不能相同
          if (item.nameKey === d.nameKey && d.type === "blank") {
            hasRepeatBlank = true
          }
          if (item.type === 'editor' || item.type === 'ckeditor') {
            editorNumber++
          }
          if (item.type === 'image' || item.type === 'zip' || item.type === 'editor' || item.type === 'ckeditor') {
            imageNumber++
          }
        })
        if (hasRepeatBlank) {
          vm.blankNum++
          vm.removeField(d)
          vm.addField(d)
          return
        }
        if ((imageNumber === 0 && editorNumber === 0) || d.type === 'editor' || d.type === 'ckeditor') {
          vm.currentConfig.push(d)
        } else {
          if (d.type === 'image' || d.type === 'zip') {
            vm.currentConfig.splice(vm.currentConfig.length - editorNumber, 0, d)
          } else {
            vm.currentConfig.splice(vm.currentConfig.length - imageNumber, 0, d)
          }
        }

        vm.orderList.forEach(function (item1, index1) {
          let item = Object.assign({}, d)
          item.value = d.type === 'mCombobox' ? [] : ''

          item1.dataTitle = vm.xyzIsNull(vm.orderInfo[index1]) ? vm.dataRowTitles[index1] : vm.orderInfo[index1].dataTitle
          if ((imageNumber === 0 && editorNumber === 0) || d.type === 'editor' || d.type === 'ckeditor') {
            item1.dataList.push(item)
          } else {
            if (d.type === 'image' || d.type === 'zip') {
              item1.dataList.splice(item1.dataList.length - editorNumber, 0, item)
            } else {
              item1.dataList.splice(item1.dataList.length - imageNumber, 0, item)
            }
          }
        })

        vm.$nextTick(() => {
          vm.setOrderInfo(vm.orderInfo, d)

          if (from !== 'init') {
            // excel 表增加
            if (vm.hasMxExcl) {
              vm.creatExcel()
            }
          }
        });
      },
      removeField(d, from) {
        let removeIndex;
        vm.currentConfig.forEach(function (item, index) {
          // 原vm.currentConfig中blank类型的nameKey不能相同
          if (item.nameKey === d.nameKey) {
            vm.currentConfig.splice(index, 1)
            if (item.type === "blank") {
              vm.blankNum--
            }
          }
        })
        // 不能使用orderListIndex，在checkbox选中删除会报错
        vm.orderList.forEach(function (item1, index1) {
          if (!index1) {
            item1.dataList.forEach(function (item2, index2) {
              // blank类型的nameKey不能相同
              if (item2.nameKey === d.nameKey) {
                removeIndex = index2
              }
            })
          }

          if (removeIndex || removeIndex === 0) {
            item1.dataList.splice(removeIndex, 1)
          } else {
            item1.dataList.splice(item1.dataList.length - 1, 1)
          }

        })
        // excel 表减少
        if (vm.hasMxExcl) {
          if (from !== 'init') {
            vm.creatExcel()
            // vm.setOrderInfo(vm.orderInfo, d)
          }
        }
      },
      // 清空重建配置
      clearCurrentConfig(from) {
        // 清空配置下拉选中，index
        if (from !== 'change') {
          vm.configValue = null
        }
        // 空白计数
        vm.blankNum = 0
        // 清空formkey
        if (vm.formkeyConfig.data !== undefined) {
          vm.formkey = vm.formkeyConfig.value
          vm.formkeyNameCn = vm.formkeyConfig.label
        } else {
          vm.formkey = ''
          // 清空formkeyNameCn
          vm.formkeyNameCn = ''
        }
        // 清空配置
        vm.currentConfig = []
        // 清空当前form
        vm.orderList = vm.orderList.map(function (d) {
          return {
            datakey: "",
            formkey: "",
            dataTitle: "",
            dataList: []
          }
        })
        // 清空checkbox选中状态
        vm.fieldList.forEach(function (d) {
          d.checked = false
        })
        // excel 表减少
        if (vm.hasMxExcl) {
          vm.creatExcel()
        }
      },
      // 查询
      searchField() {
        vm.fieldList.forEach(function (d) {
          d.show = false
          if (d.nameCn.indexOf(vm.searchValue) > -1) {
            d.show = true
          }
        })
      },
      // set订单值
      setOrderInfo(data, setOne) {
        if (setOne === 'formTextarea') {
          data.forEach(function (c, index1) {
            let colIndex = 0
            for (let index2 = 0; index2 < c.length; index2++) {
              let item = vm.orderList[index1].dataList[index2 + colIndex]
              if (!item) {
                return
              }
              if (item.type === 'image' || item.type === 'zip' || item.type === 'editor' ||
                item.type === 'ckeditor' || item.type === 'blank' || (!vm.xyzIsNull(item.options)&&item.options.uneditable)) {
                colIndex++
                index2--
                continue
              }

              // 解决vue改变二维数组不渲染页面
              vm.$set(vm.orderList[index1].dataList[index2 + colIndex], 'value', c[index2].value)
            }
          })
          vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
          // 抛出插件外watch
          if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
            vm.parentWindow.watch(vm.orderList, [], vm.mxExcl, {}, {}, 'excelPaste')
          }
          if (vm.hasMxExcl) {
            vm.creatExcel();
          }
          return
        }

        let obj = {};

        Object.keys(data).length > 0 && data.forEach(function (c, index1) {
          c.dataList.forEach(function (d1) {
            vm.$set(obj, d1.nameKey + '_' + index1, d1.value);
          })
        })

        vm.orderList.forEach(function (o, index2) {
          o.dataList.forEach(function (d2, index3) {
            if (obj[d2.nameKey + '_' + index2]) {
              vm.$set(vm.orderList[index2].dataList[index3], 'value', obj[d2.nameKey + '_' + index2]);
            }
          })
        })
      },
      removeOldItem(item, index1, index2) {
        vm.sortFormItem({
          removed: {
            element: item,
            oldIndex: index2
          }
        })
      },
      // 排序方法
      sortFormItem(evt, index) {
        let parentIndex = index

        if (evt.removed === undefined) {
          // 表单内调整数据
          let newIndex = evt.moved.newIndex
          let oldIndex = evt.moved.oldIndex
          let element = evt.moved.element

          vm.orderList.forEach(function (arr, index1) {
            if (index1 !== parentIndex) {
              let item = Object.assign({}, arr.dataList[oldIndex])
              arr.dataList.splice(oldIndex, 1)
              arr.dataList.splice(newIndex, 0, item)
            }
          })
          vm.currentConfig.splice(oldIndex, 1)
          vm.currentConfig.splice(newIndex, 0, element)
          vm.orderList.push()
        } else {
          // 取消checkbox选中状态
          vm.fieldList.forEach(function (d) {
            // 原vm.fieldList没有blank类型，谨防后台新增
            if (d.nameKey === evt.removed.element.nameKey && d.type !== "blank") {
              d.checked = false
            }
          })

          // 删除表单数据
          let oldIndex = evt.removed.oldIndex

          vm.orderList.forEach(function (arr, index1) {
            // if (index1 !== parentIndex) {
            arr.dataList.splice(oldIndex, 1)
            // }
          })
          vm.currentConfig.splice(oldIndex, 1)
          if (evt.removed.element.type === "blank") {
            vm.blankNum--
            vm.blankNum = vm.blankNum < 0 ? 0 : vm.blankNum
          }
        }

        // excel 表增加
        if (vm.hasMxExcl) {
          vm.creatExcel()
        }

      },
      saveUserExpand() {
        let num = vm.orderList.length - 1;
        while (num >= 0) {
          vm.showList[num] = true;
          num--;
        }
        vm.$nextTick(() => {
          vm.setFormBoxStatus();
        })
        parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].onSaveUserExpand({
          fields: vm.showFields,
          forms: vm.showForms
        })
      },
      changeValue(from, index, item) {
        if (from === 'form') {
          if (item.type === 'date' && item.value == null) {
            item.value = ''
          }
          // excel和表单互动
          if (!vm.hasMxExcl) {
            return
          }
          vm.mxExcl.setText({r: index[0], c: index[1]}, vm.orderList[index[0]].dataList[index[1]].value)
        }

        let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
        vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
        // 抛出插件外watch
        if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
          vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, item, {r: index[0], c: index[1]}, 'form')
        }
      },
      /**--ai识别--**/
      uploadImage() {
        document.getElementById('ai').click()
      },
      uploadImgFN(url, resultData) {
        let _this = this;
        _this.canvasDataURL(resultData.base64, {width: 800}, (res) => {
          _this.aiData.imgUrl = res;
        })

        _this.aiData.url = resultData.content.url
      },
      chooseItem(list, item) {
        list.forEach(function (item1, index1) {
          item1.check = false
          if (item1.title === item.title) {
            item1.check = true
            vm.aiData.type = item1.type
          }
        })
      },
      /** 证件识别 */
      canvasDataURL(path, obj, callback) {
        let img = new Image();
        img.src = path;
        img.onload = function () {
          let that = this;
          // 默认按比例压缩
          let w = that.width,
            h = that.height,
            scale = w / h;
          w = obj.width || w;
          h = obj.height || (w / scale);
          let quality = 0.9;  // 默认图片质量为0.7
          //生成canvas
          let canvas = document.createElement('canvas');
          let ctx = canvas.getContext('2d');
          // 创建属性节点
          let anw = document.createAttribute("width");
          anw.nodeValue = w;
          let anh = document.createAttribute("height");
          anh.nodeValue = h;
          canvas.setAttributeNode(anw);
          canvas.setAttributeNode(anh);
          ctx.drawImage(that, 0, 0, w, h);
          // 图像质量
          if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
          }
          // quality值越小，所绘制出的图像越模糊
          let base64 = canvas.toDataURL('image/jpeg', quality);
          // 回调函数返回base64的值
          callback(base64);
        }
      },
      opticalCharacterRecognitionForPc(item, imgUrl, url, person) {
        let _this = this;
        if (vm.xyzIsNull(item.type)) {
          this.$confirm('您还没有选择识别类型', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
          }).catch(() => {
          });
        } else if (imgUrl) {
          let base64 = imgUrl.split(',')[1];
          vm.ajax({
            url: '/InfoCore_InfoCoreWS/baiduOcr.do',
            data: {
              scene: vm.scene,
              base64: base64,
              type: item.type,
            },
            success: function (res) {
              if (res.status === 1) {
                res.content.forEach((item1, index1) => {
                  vm.orderList[vm.aiData.formIndex].dataList.forEach((item2, index2) => {
                    if (item1.nameKey === item2.nameKey) {
                      item2.value = item2.type === "image" ? vm.aiData.url : item1.value
                      if (vm.hasMxExcl) {
                        vm.mxExcl.setText({r: vm.aiData.formIndex, c: index2}, item2.value)
                      }
                    }
                  })
                })
                vm.aiData.formIndex = null
                vm.aiData.imgUrl = null
                vm.aiData.url = ''
                vm.aiData.type = ''
                vm.aiData.typeList = vm.aiData.typeList.map(function (item) {
                  item.check = false
                  return item
                })
                vm.aiIdentify = false

                let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
                vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
                // 抛出插件外watch
                if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
                  vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, {}, {}, 'excelPaste')
                }
                vm.$message.success('识别成功，请仔细核对识别的各项信息。');
              } else {
                vm.$message({
                  showClose: true,
                  type: 'info', message: '对不起，识别失败，请上传完整且清晰度较高的图片再试。'
                });
              }
            },
            fail: function (error) {
              console.warn(error);
            }
          })
        } else {
          _this.$message.warning('请先上传证件图片');
        }

      },
      /** --excel方法-- **/
      // 创建excel
      creatExcel(from) {
        let thText = []
        let tdData = []
        vm.orderList.length > 0 && vm.orderList[0].dataList.forEach(function (d) {
          thText.push(d.nameCn)
        })

        vm.orderList.length > 0 && vm.orderList.forEach(function (item1, index1) {
          let data = []
          item1.dataList.forEach(function (item2, index2) {
            data.push({text: item2.value, value: item2.value})
          })
          tdData.push(data)
        })

        // 清理已存在对象事件等 （xzy 20/01/14）
        if (vm.mxExcl && vm.mxExcl.destroy) vm.mxExcl.destroy()

        vm.mxExcl = MxExcel('mxInfoExcel', {
          with: '100%',
          height: '100%',
          blur: function (p, text) {
            if (vm.orderList[0].dataList[p.c].type === 'editor' || vm.orderList[0].dataList[p.c].type === 'ckeditor') {
              return
            }
            vm.$set(vm.orderList[p.r].dataList[p.c], 'value', text)
            // 抛出插件外watch
            let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
            vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
            if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
              let item = Object.assign({}, vm.orderList[p.r].dataList[p.c])
              vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, item, {r: p.r, c: p.c}, 'excel')
            }

          },
          deleteAfter: function (p, text) {
            if (vm.orderList[0].dataList[p.c].type === 'editor' || vm.orderList[0].dataList[p.c].type === 'ckeditor') {
              return
            }
            vm.$set(vm.orderList[p.r].dataList[p.c], 'value', text)
          },
          beforePaste: function (data, startPosition) {
            // excel数据 兼容 mxinfocore插件
            let pasteData = data
            let start = Number(startPosition.getAttribute("data-col"))

            for (let row in pasteData) {
              let addNum = 0
              pasteData[row].forEach(function (col, index) {
                if (vm.orderList[col.row] && (start + col.col <= vm.orderList[col.row].dataList.length)) {
                  let item = vm.orderList[col.row].dataList[start + col.col]
                  if (item.type === 'image' || item.type === 'zip' || item.type === 'editor' || item.type === 'ckeditor' || item.type === 'blank') {
                    addNum++
                  }
                  col.col = col.col + addNum
                }
              })
            }
            return pasteData
          },
          paste: function () {
            let text = vm.mxExcl.getAllTextAndValue();
            text.forEach(function (d1, index1) {
              d1.forEach(function (d2, index2) {
                vm.$set(vm.orderList[index1].dataList[index2], 'value', d2.text)
              })
            })

            // 抛出插件外watch
            let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
            vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
            if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
              vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, {}, {}, 'excelPaste')
            }
          },
          dblclick: function (e, p) {
            parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].exceldblclick(e, p, vm.orderList, vm.mxExcl)
          },
          click: function (e, p) {
            parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].excelclick(e, p, vm.orderList, vm.mxExcl)
          },
          cellHight: '34px',
          // cellWidth: ['20%', '30%', '30%', '20%'],
          thOption: {
            thText: thText,
            thStyle: 'background: #DFF0FE; color:#555;',
          },
          tdData: tdData,
          setCellOption: [{
            position: {}
          }],
          row: Object.keys(vm.orderList).length,
          col: vm.currentConfig.length,
        });
        vm.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
          //清除上传图等
          vm.orderList.forEach(function (arr, index1) {
            if (arr.ico) {
              let icoTarget = document.querySelectorAll("#mxInfoExcel .no")[index1+1]
              if (icoTarget) {
                icoTarget.firstChild.innerHTML = '<i class="iconfont '+arr.ico+'" style="position: absolute;left: 16px;"></i>' +  icoTarget.firstChild.innerHTML
              }
            }
            arr.dataList.forEach(function (item, index2) {
              if (item.type === 'image' || item.type === 'zip' || item.type === 'editor' || item.type === 'ckeditor' || item.type === 'blank') {
                let thTarget = document.querySelectorAll("#mxInfoExcel th")[index2 + 1]
                let tdTarget = document.querySelectorAll("#mxInfoExcel tbody")[1]
                if (thTarget) {
                  tdTarget = tdTarget.querySelectorAll("tr")[index1]
                  tdTarget = tdTarget.querySelectorAll("td")[index2 + 1]
                  setTimeout(function () {
                    thTarget.style.display = 'none'
                    tdTarget.style.display = 'none'
                  }, 1000)
                }
              }
            })
          })
          let splitTarget = document.querySelectorAll("#mxInfoExcel .no")[0]
          splitTarget.innerHTML = '<span class="iconfont icon-bianji"></span> 文本录入'
          splitTarget.setAttribute('style', 'cursor:pointer;background:#3b72a8;color:#fff;font-size:12px;width:80px;');
          splitTarget.onclick = function () {
            vm.isSplit = true
          }
        });

      },
      // 分割文本
      split() {
        let colSign = vm.colSign || null
        let rowSign = vm.rowSign || null

        let text = vm.splitTextarea
        if (rowSign === '回车') {
          rowSign = '<br/>'
          text = text.replace(/\r\n|\r|\n/g, '<br/>')
        }
        if (colSign === '空格') {
          colSign = '_space'
          text = text.replace(/(\s)+/g, '_space')
        }

        let rowArr = text.split(rowSign)

        let data = rowArr.map(function (r) {

          if (colSign === '文字|数字') {
            let list = [];
            let idx;
            for (let k in r) {
              if (/[0-9]/.test(r[k])) {
                idx = k;
                break;
              }
            }

            if (idx) {
              list.push({value: r.substring(0, idx)});
              list.push({value: r.substring(idx)});
              return list
            }
          } else {
            let colText = r.split(colSign)
            colText = colText.map(function (c) {
              return {
                value: c.replace(/\r\n|\r|\n/g, '')
              }
            })
            return colText
          }
        })
        if (vm.orderList[0].dataList && vm.orderList[0].dataList[0].options && vm.orderList[0].dataList[0].options && vm.orderList[0].dataList[0].options.disabled) {
          data.forEach(function (item, index) {
            item.unshift({
              value: vm.orderList[0].dataList[0].value
            })
          })
        }


        if (data.length > Object.keys(vm.orderList).length) {
          data = data.slice(0, Object.keys(vm.orderList).length)
        }

        vm.setOrderInfo(data, 'formTextarea')
        vm.isSplit = false
        parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].split(vm.colSign, vm.rowSign, vm.mxExcl)
      },
      querySearch1(queryString, cb) {
        var restaurants = [{'value': '空格'}, {'value': '，'}, {'value': '&'}, {'value': '文字|数字'}];
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      querySearch2(queryString, cb) {
        var restaurants = [{'value': '回车'}, {'value': '；'}];
        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb(results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        };
      },
      handleSelect1(item) {
        vm.colSign = item.value
      },
      handleSelect2(item) {
        vm.rowSign = item.value
      },

      /** --页面方法-- **/
      close(to) {
        parent.window['mxInfoCoreMap' + vm.id] && parent.window['mxInfoCoreMap' + vm.id].close(vm.datakey, vm.orderList, to)
      },
      /** --抛出方法-- **/
      getData() {
        return vm.orderList
      },
      setData(data) {
        vm.clearCurrentConfig()
        let orderList = vm.paseData(data)
        // 不同datakey，会有数据不同的想象，需要合并
        let currentConfig = []
        orderList.forEach(function (item1, index1) {
          item1.dataList.forEach(function (item2, index2) {
            let itemNotInCurrentConfig = true
            currentConfig.forEach(function (item, index) {
              if (item.nameKey === item2.nameKey) {
                itemNotInCurrentConfig = false
              }
            })
            if (itemNotInCurrentConfig) {
              let newItem = Object.assign({}, item2)
              newItem.value = ''
              currentConfig.push(newItem)
            }
          })
        })
        orderList.forEach(function (item1, index1) {
          let newItem1 = []
          currentConfig.forEach(function (item) {
            let itemNotInCurrentConfig = false
            item1.dataList.forEach(function (item2, index2) {
              if (item.nameKey === item2.nameKey) {
                itemNotInCurrentConfig = true
                newItem1.push(item2)
              }
            })
            if (!itemNotInCurrentConfig) {
              let newItem = Object.assign({}, item)
              newItem1.push(newItem)
            }
          })
          item1.dataList = newItem1
        })
        orderList.forEach(function (item1, index1) {
          item1.dataList.forEach(function (item2, index2) {
            if (index1 === 0) {
              // 判断是否有空白重复
              if (item2.nameKey === 'blank') {
                vm.blankNum++
                item2.remove = false
              }
              vm.currentConfig.push(item2)
            }
            // 覆盖typeContent
            vm.fieldList.forEach(function (f) {
              if (f.nameKey === item2.nameKey && item2.type !== "blank") {
                item2.type = f.type
                item2.data = f.data
                item2.typeContent = f.typeContent
                f.checked = true
              }
            })
            item2.value = vm.xyzIsNull(item2.value) ? '' : item2.value

            // 解析数组
            if (item2.type === 'mCombobox') {
              if (typeof item2.value === "string") {
                item2.value = vm.xyzIsNull(item2.value) ? [] : item2.value.indexOf("[") > -1 ? eval("(" + item2.value + ")") : item2.value.split(",")

              }
            }
            if (item2.type === 'image' || item2.type === 'zip') {
              if (typeof item2.value === "string" && !vm.xyzIsNull(item2.value)) {
                item2.value = item2.value.split(",")
              }
            }
            //
            if (item2.type == 'textarea') {
              item2.showTextarea = false
            }
            if (!vm.xyzIsNull(item2.options)) {
              try {
                let option = vm.xyzHtmlDecode(item2.options);
                option = eval('(' + option + ')');
                item2.options = typeof option === "object" ? option : ''
              } catch (e) {
                item2.options = ''
              }
            }
          })

        })

        vm.orderList = JSON.parse(JSON.stringify(orderList))
        vm.orderInfo = JSON.parse(JSON.stringify(orderList))
        vm.cloneOrderList = JSON.parse(JSON.stringify(orderList))

        if (vm.orderList.length > 0) {
          vm.formkey = vm.orderList[0].formkey
          vm.orderList.forEach(function (item1, index1) {
            vm.datakey = index1 === 0 ? item1.datakey : vm.datakey + ',' + item1.datakey
          })
        }

        if (vm.hasMxExcl) {
          vm.creatExcel()
          let oldData = JSON.parse(JSON.stringify(vm.cloneOrderList))
          vm.cloneOrderList = JSON.parse(JSON.stringify(vm.orderList))
          if (vm.parentWindow && typeof vm.parentWindow.watch === 'function') {
            vm.parentWindow.watch(vm.orderList, oldData, vm.mxExcl, {}, {r: '', c: ''}, 'setData')
          }
        }
      },
      forceUpdate() {
        this.$forceUpdate()
      },
      setValue(index, value) {
        this.$set(vm.orderList[index.r].dataList[index.c], 'value', value)
        this.$forceUpdate()
      },
      /** --插件方法-- **/
      customerUploadImg(resultData, data) {
        data.value = resultData.join(',')
        this.$forceUpdate()
      },
      deleteImg(resultData, data) {
        data.value = resultData.join(',')
        this.$forceUpdate()
      },
      /** --获取开发环境,分为本地环境,测试服环境和正式服环境-- **/
      getEnvironment() {
        return process.env.NODE_ENV === 'development' ? 'development' : location.port ? 'testServer' : 'formalServer'
      },
      /** --ajax方法-- **/
      ajax(obj) {
        // 检测传入数据类型
        if (typeof obj !== 'object') {
          console.warn('参数必须是对象')
          return
        }
        let data = {}
        data = obj.data ? obj.data : {}
        // 将原型或者本地存储中的apikey放入data
        if (this.ajax.prototype && this.ajax.prototype.hasOwnProperty('apikey')) {
          data.apikey = this.ajax.prototype.apikey ? this.ajax.prototype.apikey : ''
        } else if (localStorage.apikey) {
          data.apikey = localStorage.apikey
        }
        if (JSON.stringify(data) !== '{}') {
          data = Qs.stringify(data)
        } else {
          data = null
        }
        let base = ''
        let environment = this.getEnvironment()
        if (environment === 'testServer') {
          base = ''
        }
        axios({
          // `url` 是用于请求的服务器 URL
          url: base + obj.url,

          // `method` 是创建请求时使用的方法
          method: 'post', // 默认是 get

          // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
          // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL

          // `transformRequest` 允许在向服务器发送前，修改请求数据
          // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
          // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stre34am
          transformRequest: [function (data) {
            // 对 data 进行任意转换处理
            return data
          }],

          // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
          transformResponse: [function (data) {
            // 对 data 进行任意转换处理
            return data
          }],

          // `headers` 是即将被发送的自定义请求头
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
          },

          // `params` 是即将与请求一起发送的 URL 参数
          // 必须是一个无格式对象(plain object)或 URLSearchParams 对象
          params: {},
          // `paramsSerializer` 是一个负责 `params` 序列化的函数
          // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
          paramsSerializer: function (params) {
            return Qs.stringify(params, {arrayFormat: 'brackets'})
          },
          // `data` 是作为请求主体被发送的数据
          // 只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
          // 在没有设置 `transformRequest` 时，必须是以下类型之一：
          // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
          // - 浏览器专属：FormData, File, Blob
          // - Node 专属： Stream
          data: data,
          // `timeout` 指定请求超时的毫秒数(0 表示无超时时间)
          // 如果请求话费了超过 `timeout` 的时间，请求将被中断
          timeout: 50000,
          // `responseType` 表示服务器响应的数据类型，可以是 'arraybuffer', 'blob', 'document', 'json', 'text', 'stream'
          responseType: 'json', // 默认的
          // `maxContentLength` 定义允许的响应内容的最大尺寸
          maxContentLength: 2000,
          // `validateStatus` 定义对于给定的HTTP 响应状态码是 resolve 或 reject  promise 。如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，promise 将被 resolve; 否则，promise 将被 rejecte
          validateStatus: function (status) {
            return status >= 200 && status < 300 // 默认的
          }
        }).then(function (e) {
          if (obj.success) {
            obj.success(e.data)
          }
          if (obj.complete) {
            obj.complete()
          }
        }).catch(function (e) {
          if (obj.fail) {
            obj.fail(e)
          }
          if (obj.complete) {
            obj.complete()
          }
        })
      },
      paseData(data) {
        data.forEach(function (el) {
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
        })
        return data
      },
      getQueryString(name) {
        let reg = new RegExp(name + '=([^&]*)')
        let r = location.href.match(reg)
        if (r != null) {
          return decodeURI(r[1])
        } else {
          return ''
        }
      },
      xyzIsNull(obj) {
        if (obj == undefined || obj == null || obj === "" || obj === '') {
          return true;
        } else {
          return false;
        }
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
      refreshToken: function () { //刷新token
        let thisComp = this
        let xhr = new XMLHttpRequest()
        if (!xhr) {
          return
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              thisComp.token = xhr.responseText
              window.localStorage.setItem("qt2", xhr.responseText)
            } else {
              thisComp.token = 'get token fail'
            }
          }
        }

        let paramArray = new Array()
        if (this.bucket) {
          paramArray[paramArray.length] = (encodeURIComponent('bucket') + '=' + encodeURIComponent(this.bucket))
        }
        if (this.size) {
          paramArray[paramArray.length] = (encodeURIComponent('fsizeLimit') + '=' + encodeURIComponent(this.size))
        }
        if (this.accept) {
          // let accept = this.accept.join(';')
          let accept = this.getAccept(this.accept, ';')
          paramArray[paramArray.length] = (encodeURIComponent('mimeLimit') + '=' + encodeURIComponent(accept))
        }
        let param = paramArray.join('&').replace('%20', '+')
        xhr.open("POST", 'https://toolapi.maytek.cn/qt2', true)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

        xhr.send(param)
      }
    },
    beforeCreate() {
      vm = this
      window.vue = this
    },
    created() {
      let t = setTimeout(function () {
        clearTimeout(t)
        vm.loading = false
      }, 15000)
      vm.refreshToken();
      vm.getRequest()
      window.onresize = vm.setFormBoxStatus('scroll');
    },
    mounted() {},
    watch: {
      "orderList": {
        handler: function (val, oldVal) {

          // 判断是否显示删除箱
          if (!vm.canEdit) {
            let showDeleteBox = false
            val.forEach(function (d1, r) {
              d1.dataList.forEach(function (d2, c) {
                if (d2.delete === true) {
                  showDeleteBox = true
                }
              })
            })
            vm.showDeleteBox = showDeleteBox
          }
          clearTimeout(vm.renderTimer)
          vm.renderTimer = setTimeout(() => {
            let num = val.length - 1;
            while (num >= 0) {
              vm.showList[num] = true;
              num--;
            }
            vm.$nextTick(() => {
              vm.setFormBoxStatus();
            })
          }, 500)
        },
        deep: true
      },
      "searchValue": {
        handler: function (val, older) {
          this.searchField()
        },
        deep: true
      }
    }
  }
</script>
<style lang="less">
  html, body {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  * {
    margin: 0;
    padding: 0;

    ul {
      list-style: none;
    }

    i {
      font-style: normal;
    }

    button, input {
      outline: none;
    }

    h1, h2, h3, h4, h5, h6 {
      font-weight: normal;
    }
  }

  @theme: #3b72a8;
  @backgroundColor: #f4f5f7;
  .el-message {
    top: 2px;
    left: 54%;
    min-width: 300px;
  }

  .el-select-dropdown {
    max-width: 300px !important;
  }

  .el-select-dropdown__item {
    white-space: normal !important;
    height: auto !important;
  }

  #app {
    font-family: Helvetica, Tahoma, Arial, "PingFang SC", "Hiragino Sans GB", "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #app {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;

    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
      -webkit-appearance: none !important;
      margin: 0;
    }

    .vm-scrollbar__wrap {
      overflow-x: hidden !important;
    }

    .vm-scrollbar__view:after {
      content: " ";
      height: 0;
      clear: both;
      display: block;
    }

    .vm-scrollbar__thumb {
      background-color: #3b72a8 !important;

      &:active {
        background-color: #3b72a8 !important;
      }
    }

    .el-loading-mask {
      background-color: #fff;
      opacity: 1;
    }

    .el-input__inner {
      height: 30px;
      line-height: 30px;
      font-size: 12px;
    }

    .el-select .el-input .el-select__caret {
      line-height: 30px;
    }

    .el-input__icon {
      line-height: 30px;
    }

    .el-input .el-input__clear {
      font-size: 15px;
    }

    .el-input .el-input__clear:hover {
      color: #ff5252;
    }

    .el-textarea__inner {
      resize: none;
      min-height: 100px;
      line-height: 28px;
      box-sizing: border-box;
      padding: 10px;
      color: #606266;
      font: 400 12px Arial;
      background-color: #f4f5f7;
      font-size: 12px;
      border: 1px solid #ccc;
      cursor: default;
    }

    .el-textarea__inner::-webkit-input-placeholder {
      line-height: 10px;
    }

    .el-textarea__inner::-moz-placeholder {
      line-height: 10px;
    }

    .el-textarea__inner::-ms-input-placeholder {
      line-height: 10px;
    }

    .header {
      position: relative;
      height: 46px;
      line-height: 46px;
      color: @theme;
      text-align: left;
      text-indent: 18px;
      background: #fff;
      box-sizing: border-box;
      margin: 0 14px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border-bottom: 2px solid @theme;

      p {
        width: e("calc(100% - 30px)");
        height: 46px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      i {
        position: absolute;
        top: 7px;
        right: 0;
        vertical-align: middle;
        width: 30px;
        height: 30px;
        cursor: pointer;
        background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAYAAABWdVznAAAAsElEQVQokX2RsQ2DMBBFnz0BBaLJDFmBgs7zECpa0hD2oaPIAGmYgcZKwQZOwQUZfIklS5bvvfPp29Rd/wIKwA1tM6Os2/1xBUbAW4EvwCQFDZ6EKSzggDeQn6UIzoVxJoSgFSpxDndD28wmhKB1W0XIYhhgFyLpKSAilnEYVkvl39qFaKRMOq9yPgRhf6RRyk7SM3XXJwl9Z9bSs2w/mMAAcq6il0YLeGA5w4q0AP4DKbRcQEaRQxsAAAAASUVORK5CYII=") no-repeat center;
      }
    }

    .content {
      position: absolute;
      top: 46px;
      bottom: 68px;
      left: 0;
      right: 0;
      box-sizing: border-box;
      overflow: hidden;

      .editBox {
        height: 30px;
        margin: 10px 14px;

        .formkeyNameCn {
          width: 20%;
          display: inline-block;

          .nameCnInput {
          }

          .el-input__inner {
            border: none;
            background-color: @backgroundColor;
            padding-left: 10px;
            text-align: center;
            color: #3b72a8;
          }
        }

        .formListBox {
          float: left;
          position: relative;
          width: 30%;
          height: 30px;

          .select {
            width: 100%;

            &.edite .el-input__prefix {
              top: 1px;
              bottom: 1px;
              left: 1px;
              height: 28px;
              background: #e1e8ef;
              border-top-left-radius: 5px;
              border-bottom-left-radius: 5px;
              padding-right: 10px;
              z-index: 5;

              .icon-bianji, .icon-shanchu1 {
                float: left;
                color: #3b72a8;
                text-align: center;
                margin-top: 5px;
                margin-left: 6px;
                cursor: pointer;
                font-size: 20px;
              }

              .icon-shanchu1 {
                font-size: 19px;
                margin-left: 10px;
              }
            }

            &.edite .el-input__inner {
              padding-left: 80px;
            }
          }
        }
      }

      .mxScrollbar {
        height: e("calc(100% - 52px)");

        .collapse {
          position: absolute;
          top: 0;
          right: -44px;
          width: 30px;
          height: 56px;
          padding-top: 4px;
          background: #d0dce8;
          color: @theme;
          font-size: 12px;
          text-align: center;
          border-bottom-left-radius: 15px;
          border-bottom-right-radius: 15px;
          cursor: pointer;
          -webkit-touch-callout: none; /* iOS Safari */
          -webkit-user-select: none; /* Chrome/Safari/Opera */
          -khtml-user-select: none; /* Konqueror */
          -moz-user-select: none; /* Firefox */
          -ms-user-select: none; /* Internet Explorer/Edge */
          user-select: none; /* Non-prefixed version, currently */
        }

        .forms {
          right: -30px;
        }

        .noHeight.forms {
          top: 70px;
        }

        .showCheckContent {
          position: relative;
          width: e("calc(100% - 82px)");
          margin: 0 auto 6px;
          margin-left: 14px;
          margin-right: 14px;

          &.hasHeight {
            height: 60px;
          }

          &.fullWidth {
            width: e("calc(100% - 28px)");
          }
        }

        .formContent {
          position: relative;
          width: e("calc(100% - 54px)");

          &.hasHeight {
            height: 60px;
          }

          &.fullWidth {
            width: 100%;
          }
        }

        .excelContent {
          position: relative;
          max-width: e("calc(98% - 54px)");;
          margin-left: 14px;
          margin-right: 14px;

          &.fullWidth {
            max-width: 98%;
          }
        }

        .showCheckBox {
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 4px;
          background: @backgroundColor;
          z-index: 2002;
          min-height: 60px;

          .configList {
            height: 30px;
            padding: 3px;
            background: #d0dce8;

            .input-with-select {
              float: left;
              width: 29.8%;
              min-width: 194px;

              input {
                border-right: 1px solid #fff;

                &:focus {
                  border-right: 1px solid #409EFF;
                }
              }

              .el-input-group__append {
                background: #fff;
              }

              .el-button {
                width: 20px;

                .el-icon-search {
                  color: @theme;
                  font-size: 20px;
                  text-indent: 10px;
                  line-height: 30px;
                }
              }

            }

            .addBlank {
              float: left;
              width: 194px;
              height: 30px;
              text-align: left;
              margin-left: 1px;

              .el-button {
                color: #3b72a8;
              }
            }

            .el-button {
              display: block;
              width: 100px;
              height: 30px;
              line-height: 30px;
              padding: 0;
            }
          }

          .center {
            /*position: absolute;*/
            /*left: 14px;*/
            /*right: 14px;*/
            /*top: 54px;*/
            /*bottom: 14px;*/
            background: @backgroundColor;
          }

          .checkBox {
            /*position: absolute;*/
            /*top: 0;*/
            /*bottom: 0;*/
            /*left: 0;*/
            width: 100%;
            /*overflow: hidden;*/
            background: @backgroundColor;
            border-radius: 5px;
            -webkit-border-radius: 5px;
            padding: 2px 6px;
            box-sizing: border-box;

            .check-item {
              width: 194px;
              height: 26px;
              text-align: left;
              /*float: left;*/
              display: inline-block;

              &.common {
                .el-checkbox__label {
                  color: #409eff;
                }
              }

              .el-checkbox__label {
                width: 180px;
                line-height: 26px;
                font-size: 14px;
                color: #555;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                vertical-align: middle;
              }
            }
          }
        }

        .formBox {
          display: flex;
          flex-flow: row wrap;
          margin-top: 10px;

          .form-items {
            flex: auto;
            min-width: 260px;
            min-height: 300px;
            border-radius: 5px;
            margin-bottom: 10px;
            margin-right: 14px;
            background: @backgroundColor;
            margin-left: 14px;
            margin-right: 14px;

            .form-title {
              position: relative;
              height: 36px;
              line-height: 36px;
              background: @theme;
              border-radius: 5px 5px 0 0;
              font-size: 14px;
              color: #fff;

              .title {
                height: 36px;
                position: absolute;
                top: 0;
                left: 0;
                right: 60px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .icon-shibieduixiang {
                float: right;
                margin-right: 12px;
                cursor: pointer;
              }
            }

            .form-box:after {
              content: '';
              display: block;
              clear: both;
            }

            .form-item {
              position: relative;
              min-height: 40px;
              padding: 6px 10px;
              width: 100%;
              float: left;
              box-sizing: border-box;

              .form-label {
                font-size: 12px;
                line-height: 20px;
                color: #555;
                text-indent: 2px;
                min-height: 20px;

                .icon-icon {
                  color: #ff5252;
                }
              }

              .form-label.canMove {
                cursor: move;
              }

              i.removeFormItem {
                position: absolute;
                right: 3px;
                bottom: 12px;
                display: block;
                width: 20px;
                /*height: 8px;*/
                height: 18px;
                vertical-align: middle;
                cursor: pointer;
                color: #ff5252;
                font-size: 15px;
                line-height: 8px;
                background: @backgroundColor;

                &:hover {
                  color: rgba(255, 82, 82, 0.5);
                }
              }

              .form-input {
                position: relative;

                &.removeFormItem {
                  width: e("calc(100% - 22px)");
                  float: left;
                }

                .blank {
                  width: 100%;
                  height: 30px;
                }

                .el-input__inner {
                  background-color: @backgroundColor;
                  border: 1px solid #ccc;
                  padding-left: 10px;
                }

                .el-date-editor--time .el-input__inner {
                  padding-left: 30px;
                }

                .el-input.is-disabled .el-input__inner {
                  background-color: #e0e0e0;
                  border-color: #e0e0e0;
                }

                .el-date-editor.el-input, .el-date-editor.el-input__inner {
                  width: 100%;
                }

                .el-date-editor--date {
                  .el-input__inner {
                    padding-left: 15px;
                    padding-right: 60px;
                  }

                  .el-input__prefix {
                    left: unset;
                    right: 5px;
                  }

                  .el-input__suffix {
                    right: 30px;
                  }
                }

                .el-select {
                  width: 100%;

                  .el-tag--small, .el-tag {
                    height: auto;
                  }

                  .el-tag {
                    white-space: pre-wrap;
                  }
                }

                .el-textarea__inner {
                  background: @backgroundColor;
                }

                .textInputBox .el-textarea__inner {
                  padding: 10px;
                  text-indent: 0;
                }

                .textInputBox .el-textarea__inner::-webkit-input-placeholder {
                  line-height: 10px;
                }

                .textInputBox .el-textarea__inner::-moz-placeholder {
                  line-height: 10px;
                }

                .textInputBox .el-textarea__inner::-ms-input-placeholder {
                  line-height: 10px;
                }

                &.item-time-val {
                  .el-select {
                    width: calc(~'50% - 10px') !important;
                    display: inline-block;

                    &:first-child {
                      float: left;
                    }

                    &:last-child {
                      float: right;
                    }
                  }

                  .time-i {
                    display: inline-block;
                    width: 10px;
                    text-align: center;
                  }
                }
              }
            }
          }
        }

        .excelBox {
          min-height: 38px;
          overflow: hidden;

          #mxInfoExcel {
            min-height: 38px;

            tbody:first-child {
              tr.fixedTop {
                position: fixed;
                top: 44px;
                left: 14px;
                right: 30px;
                display: flex;
                z-index: 1;
                line-height: 33px;

                &.hasCollapse {
                  right: 71px;
                  max-width: calc(98% - 71px);
                }

                th:first-child {
                  flex: 0 0 80px;
                }

                th {
                  flex: 1;
                }
              }

              tr.fixed {
                position: fixed;
                top: 96px;
                left: 14px;
                right: 30px;
                display: flex;
                z-index: 1;

                &.hasCollapse {
                  right: 80px;
                }

                th:first-child {
                  flex: 0 0 80px;
                }

                th {
                  flex: 1;
                }
              }
            }

            tbody.data-tbody {
              tr.fixed {
                display: flex;

                td:first-child {
                  flex: 0 0 80px;
                }

                td {
                  flex: 1;
                  height: initial;
                }
              }

            }
          }

          .cel-item {
            font-size: 12px;
            color: #555;
            font-weight: initial;
          }

          .no {
            text-align: center;
            line-height: 33px;
            text-indent: 0;
          }

          .addbtn, .delbtn {
            display: none;
          }

          .e-table tbody:first-child {
            tr {
              th {
                position: relative;
                background: #e2ebf4;
                border: 1px solid #B3C7CD;
                border-left: none;
                border-right: none;
                font-size: 12px;
                color: #555;
                font-weight: initial;
              }

              th:after {
                content: '';
                position: absolute;
                top: 6px;
                bottom: 6px;
                right: -1px;
                width: 1px;
                border-left: 1px solid #B3C7CD;
              }

              th:first-child:after {
                content: '';
                display: none;
              }

              th:last-child:after {
                content: '';
                display: none;
              }

              th:last-child {
                border-right: 1px solid #B3C7CD;
                border-top-right-radius: 5px;
              }
            }
          }

          .e-table-1 {

          }
        }
      }
    }

    .delete, .edit, .sure, .cancel {
      width: 72px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      color: #fff;
      background: @theme;
      border-radius: 5px;
      margin-right: 20px;
      margin-top: 22px;
      cursor: pointer;
      font-size: 12px;
    }

    .cancel, .noSubmit {
      background: #e5e5e5 !important;
      color: #999 !important;
    }

    .btnBox {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 70px;
      width: e("calc(100% - 32px)");
      margin: auto;
      display: flex;
      justify-content: center;
      text-align: center;

      .cancel {

      }
    }

    .textInputBox.ai {
      .textInput {
        height: 440px;
      }
    }

    .textInputBox {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 2002;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;

      .textInput {
        position: relative;
        width: 70%;
        height: e("calc(100% - 32px)");
        background: #fff;
        border-radius: 5px;

        header {
          height: 46px;
          line-height: 46px;
          color: #3b72a8;
          text-align: left;
          text-indent: 18px;
          background: #fff;
          -webkit-box-sizing: border-box;
          box-sizing: border-box;
          margin: 0 14px;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          border-bottom: 2px solid #3b72a8;
        }

        .textCol, .textRow {
          width: 140px;
          margin: 10px 14px 0;
        }

        .el-textarea {
          height: e("calc(100% - 176px)");
        }

        .el-textarea__inner {
          width: e("calc(100% - 28px)");
          height: 90%;
          margin: 10px 14px 0;
        }

        .tbnBox {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 70px;
          display: flex;
          justify-content: center;
          text-align: center;
        }
      }
    }

    .title-box {
      font-weight: bold;
      font-size: 18px;
      text-align: center;

      .image-box {
        position: relative;
        width: 200px;
        height: 100px;
        margin: 25px auto 10px;
        border: 1px dashed #ccc;
        cursor: pointer;

        .iconfont {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 40px;
          color: #ccc;
        }
      }
    }

    .ai {
      ul {
        margin: 20px auto;
        text-align: center;

        li {
          display: inline-block;
          width: 100px;
          height: 80px;
          margin: 10px 20px;
          text-align: center;
          border: 1px dashed #ccc;
          color: #bbb;
          user-select: none;
          cursor: pointer;

          .iconfont {
            display: block;
            margin: 10px;
            font-size: 30px;
          }

          &.checkCls {
            color: #369ef6;
            border: 1px solid #369ef6;
          }
        }
      }
    }
  }
</style>
