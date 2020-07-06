// xyzUploader 文件上传组件

<template>
  <div class="uploader">
    <div class="xyzDropzone-uploader-main " @mouseover="canUpload = true" @mouseout="canUpload = false">
      <div class="uploader-bd">
        <div class="form_wrapper">
          <div :class="['xyzDropzone-uploader-form',{'disabled':disabled}]"
               ref="xyzDropzone-uploader-form"
               :style="getStyle(uploadBtnStyle)">
            <span class="text" :title="uploadBtnText">{{uploadBtnText}}</span>
            <input class="upload-input" :style="{cursor: disabled && 'not-allowed'}" :id="id && id.btnId"
                   ref="fileInput"
                   type="file"
                   :accept="getAccept(accept)"
                   :disabled="disabled"
                   :multiple="multiple"
                   @change="fileChange($event)"/>
          </div>
          <div class="xyzDropzone-uploader-showbox">
            <div class="xyzDropzone-ImgBox"
                 ref="xyzDropzone_uploader_listBox"
                 @mouseenter="addPaste" @mouseleave="removePaste">
              <ul class="xyzDropzone-uploader-list"
                  ref="xyzDropzone_uploader_list"
                  v-if="showItem">
                <li v-for="(url,idx) in urls"
                    class="xyzDropzone-uploader-item xyzDropzone-uploader-struts"
                    :key="idx">
                  <img :src="getUrl(getImg(url, 'small'))"
                       v-if="checkImg(url)"
                       class="imgItem"
                       @click="viewFile(idx)"/>
                  <span :class="getIcon(url)" @click="viewFile(idx)" v-else></span>
                  <i class="delImgBtn iconfont icon-close-b"
                     v-if="!disabled"
                     @click="removeItem(url,idx)"></i>
                </li>


              </ul>

            </div>
            <div class="swiper-listBtn" v-if="showTurnBtn">
              <i class="iconfont icon-xiangzuo11" @click="nextItemImg"></i>
              <i class="iconfont icon-xiangyou" @click="preItemImg"></i>
            </div>
          </div>
          <a class="delAllBtn"
             v-if="showItem && delSHow"
             href="javascript:void(0);"
             :style="getStyle(delAllBtnStyle)"
             @click="removeItemAll(urls)">{{delAllBtnText}}
          </a>
        </div>

      </div>
    </div>
    <!--图片浏览-->
    <div class="imgView"
         v-show="showImgItem">
      <div class="delBtn"
           @click.self="closeView"></div>
      <div class="preBtn"
           @click.slef="preItem"></div>
      <div class="nextBtn"
           @click="nextItem"></div>
      <div class="imgItem_wrapper">
        <span class="img_warpper">
          <img :src="getUrl(urls[currentItem])" :alt="getUrl(urls[currentItem])"
               class="imgItem">
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  let vm;
  const qiniuUrl = 'https://upload.qiniup.com';
  const errCodeMsg = {
    'code400' : '报文构造不正确或者没有完整发送。',
    'code401' : '上传凭证无效。',
    'code403' : '上传文件格式不正确。',
    'code413' : '上传文件过大。',
    'code579' : '回调业务服务器失败。',
    'code599' : '服务端操作失败。',
    'code614' : '目标资源已存在。'
  }
  const accept = [
    'image/jpg',
    'image/jpeg',
    'image/png',
    'image/bmp',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/zip',
    'application/rar',
    'application/x-zip-compressed',
    'application/x-rar-compressed',
    'application/pdf',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'application/vnd.ms-powerpoint',
    'text/plain',
  ]

  const ICON = {
    doc: 'iconfont icon-wenjianleixingtubiao-4',
    ppt: 'iconfont icon-wenjianleixingtubiao-5',
    txt: 'iconfont icon-wenjianleixingtubiao-6',
    pdf: 'iconfont icon-wenjianleixingtubiao-3',
    zip: 'iconfont icon-wenjianleixingtubiao-2',
    rar: 'iconfont icon-wenjianleixingtubiao-1',
    xls: 'iconfont icon-wenjianleixingtubiao-',
    other: 'iconfont icon-wenjianleixingtubiao-7',
  }

  // 自定义一个让人MIME类型，以上传RAR格式
  const RAR_MIMETYPE = 'application/rar'

  export default {
    props: {
      id:{}, // 父组件传入的识别标致，每次自定义事件触发，id都是第一个参数
      accept:{ // 允许用户上传的文件mimeType
        type: Array,
        default: function(){
          return accept
        }
      },
      value: { // 赋初始值
        default: function(){
          return new Array()
        }
      },
      count: { // 组件允许上传的最大文件数量限制
        type: Number,
      },
      size: { // 组件允许上传的单个文件最大文件尺寸限制
        type: Number,
        default: 100 * 1024 * 1024
      },
      directory: { // 文件分组目录（根据情况，可以是项目名，模块名[仅允许英文大小写字母]）
        type: String,
        default: 'default'
      },
      filename: {}, // 自定义上传后的文件名（1、若传入字符串[fileName]将自动匹配文件本身文件名。 2、传入任意字符串[请带上文件后缀名]）
      multiple: { // 是否允许一次选择多个文件
        type: Boolean,
        default: false
      },
      repeat: { // 是否允许出现重复的url
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      showItem: {  // 是否显示上传成功的项
        type: Boolean,
        default: true
      },
      uploadBtnText: {  // 上传按钮文字
        type: String,
        default: '上传图片'
      },
      delAllBtnText: { // 一键删除按钮文字
        type: String,
        default: '一键删除'
      },
      uploadBtnStyle: { // 上传按钮按时
        type: Object,
        default: function () {
          return {}
        }
      },
      delAllBtnStyle: { // 一键删除按钮按钮样式
        type: Object,
        default: function () {
          return {}
        }
      }
    },
    data: function(){
      return {
        urls: [],
        token: '',
        fileList: [],
        showImgItem: false,
        currentItem: -1,
        Ispeed:66,//图片的切换距离
        currentIndex:0,
        canUpload: false,
        showTurnBtn: false,
      }
    },
    computed: {
      delSHow() {
        return this.urls.length >= 3
      }
    },
    methods : {
      showTurnBtnFun() {
        let ImgBox=this.$refs.xyzDropzone_uploader_list;
        let initImgBox=this.$refs.xyzDropzone_uploader_listBox;
        ImgBox.style.width=66*this.urls.length+'px'
        let ImgBoxWidth=ImgBox.offsetWidth;
        let initImgBoxWidth=initImgBox.offsetWidth;
        this.showTurnBtn = ImgBoxWidth > initImgBoxWidth
      },
      // 可接受的MIME格式
      getAccept(accept, separator) {
        if (Array.isArray(accept) && accept.length > 0) {
          if (this._inArr(RAR_MIMETYPE, accept)) {
            return ''
          } else {
            return accept.join(separator || ',')
          }
        } else {
          return ''
        }
      },
      _inArr(item, arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i] === item) { return true }
        }
        return false
      },
      getStyle(style) {
        return {...style}
      },
      checkImg(item) {
        let reg = /png|jpg|jpeg|bmp/;
        if (reg.test(this._getFileSuffix(item))) {
          return true;
        }
        return false;
      },
      fileClick() {
        this.$refs.fileInput.click();
      },
      getIcon(item) {
        let fileFix = this._getFileSuffix(item);
        switch(fileFix) {
          case 'pdf': return ICON.pdf;
          case 'ppt': return ICON.ppt;
          case 'pptx': return ICON.ppt;
          case 'doc': return ICON.doc;
          case 'docx': return ICON.doc;
          case 'xls': return ICON.xls;
          case 'xlsx': return ICON.xls;
          case 'zip': return ICON.zip;
          case 'rar': return ICON.rar;
          case 'txt': return ICON.txt;
          default : return ICON.other;
        }
        // if (fileFix === 'pdf') {
        //   return ICON.pdf
        // } else if (fileFix === 'doc' || fileFix === 'docx') {
        //   return ICON.doc
        // } else if (fileFix === 'xls'|| fileFix === 'xlsx') {
        //   return ICON.xsl
        // } else {
        //   return ICON.other
        // }
      },
      viewFile(index) {
        let reg = /png|jpeg|jpg|bmp/;
        if (reg.test(this._getFileSuffix(this.urls[index]))) {
          this.imageDialog.showImageDialog({
            imgUrlList: this.urls,
            index: index
          });
        } else {
          window.open(this.urls[index])
        }

      },
      closeView() {
        this.showImgItem = false
      },
      preItem() {
        if (this.currentItem > 0) { this.currentItem -= 1 }
      },
      nextItem() {
        if (this.currentItem < this.urls.length - 1) { this.currentItem += 1 }
      },

      /**
       * 上传图片左右切换
       *
       */

      addPaste() {
        document.addEventListener('paste',this.pasteImg);
      },

      removePaste() {
        document.removeEventListener('paste',this.pasteImg);
      },

      pasteImg(event) {
        let _this = this;
        if (_this.canUpload && !_this.disabled) {
          if ( event.clipboardData || event.originalEvent ) {
            var clipboardData = (event.clipboardData || event.originalEvent.clipboardData);
            if ( clipboardData.items ) {
              var items = clipboardData.items,
                len = items.length,
                blob = null;
              event.preventDefault();
              for (var i = 0; i < len; i++) {
                if (items[i].type.indexOf("image") !== -1) {
                  blob = items[i].getAsFile();
                } else {
                  _this.$message.warning('抱歉，只支持图片类型');
                  return;
                }
              }
              if ( blob !== null ) {
                _this.fileList.push(blob);
              } else {
                _this.$message.warning('抱歉，只支持图片类型');
                return;
              }
            } else {
              _this.$message.warning('抱歉，该浏览器不支持截图上传');
              return;
            }
          } else {
            _this.$message.warning('抱歉，该浏览器不支持截图上传');
            return
          }
        }
      },
      preItemImg(){
        let ImgBox=this.$refs.xyzDropzone_uploader_list;
        let initImgBox=this.$refs.xyzDropzone_uploader_listBox;
        let ImgLength=this.urls.length;
        // if (ImgLength>3) {
          ImgBox.style.width=66*ImgLength+'px'
        // }
        let ImgBoxWidth=ImgBox.offsetWidth;
        let initImgBoxWidth=initImgBox.offsetWidth;

        if (ImgBoxWidth-Math.abs(ImgBox.offsetLeft)>initImgBoxWidth) {
          ImgBox.style.left=-this.Ispeed+'px';
          this.Ispeed+=66;
        }
      },
      nextItemImg(){
        let ImgBox=this.$refs.xyzDropzone_uploader_list;

        let ImgLength=this.urls.length;
        // if (ImgLength>3) {
          ImgBox.style.width=66*ImgLength+'px'
        // }
        let ImgBoxWidth=ImgBox.offsetWidth;
        if(ImgBox.offsetLeft<0){
          this.Ispeed-=66;
          ImgBox.style.left=-this.Ispeed+66+'px';
        }
      },

      _getFileSuffix(item) {  // 获取文件类型
        if(!item) return '';
        let els = item.split('.');
        return (els[els.length - 1].split('-'))[0]
      },
      getUrl(url) {  // 获取资料项的路径，非图片返回相应文件图片
        let fileFix = this._getFileSuffix(url);
        if (fileFix === 'pdf') {
          return ICON.pdf
        } else if (fileFix === 'doc' || fileFix === 'docx') {
          return ICON.doc
        } else if (fileFix === 'xls'|| fileFix === 'xlsx') {
          return ICON.xsl
        } else {
          return url
        }
      },
      getImg: function(url, suf) {
        if ('mid'==suf && url.indexOf('file.duanyi.com.cn')>=0) {
          let urlStart = url.substring(0, url.lastIndexOf('/'))
          let urlEnd = url.substring(url.lastIndexOf('/') + 1, url.length)
          return (urlStart + "/mid_" + urlEnd)
        } else if ('small'==suf && url.indexOf('file.duanyi.com.cn')>=0) {
          let urlStart = url.substring(0, url.lastIndexOf('/'))
          let urlEnd = url.substring(url.lastIndexOf('/') + 1, url.length)
          return (urlStart + "/small_" + urlEnd)
        } else if ('mid'==suf) {
          return url+'-mid'
        } else if('small'==suf) {
          return url+'-small'
        }
        return url
      },
      complete: function(resultData){ // 上传完成通知
        if (this.repeat && resultData.status===1) { // 检查重复url
          let url = resultData.content.url;
          for(let u in this.urls){
            if(this.urls[u] === url){
              this.fail('不能添加重复的文件');
              return
            }
          }
        }

        if (resultData.status===1) {
          if (resultData.content.url) {
            // 存入图片地址
            this.urls.push(resultData.content.url);
            resultData.content.url = this.urls
            this.$forceUpdate()
          } else if (typeof resultData.content === 'string' && resultData.content.length > 0)
          {
            let urls = resultData.content.split(',')
            urls.forEach((ele) => {
              if (ele && ele.indexOf('http') > -1) {
                this.urls.push(ele)
              }
            }, this)
          }
        } else {
          if (this._events['fail']) {
            this.$emit('fail', resultData.msg, resultData)
            return
          } else {
            alert(resultData.msg)
          }
        }
        this.showTurnBtnFun()
        this.preItemImg()
        if (this._events['complete']) {
          this.$emit('complete', this.urls ,resultData)
        }
        this.$forceUpdate()
      },
      fail: function(msg, fileItem) { // 各种失败消息通知
        if (this._events['fail']) {
          this.$emit('fail', msg, fileItem)
          this.$emit('fail', this.id, msg, fileItem)
        } else {
          alert(msg)
        }
      },
      removeItem: function(url, idx) { // 移除通知
        if (this._events['remove-item']) {  // 删除前事件（自己控制删除）

          this.$emit('remove-item',idx, url)
//          this.$emit('remove-item', this.id, url)
        } else {
          this.urls.splice(idx, 1);
          this.$emit('romoveItem', this.urls)  // 删除后事件
        }
        this.nextItemImg()
        this.showTurnBtnFun()

      },
      removeItemAll: function(urls) { // 移除全部
//        if (this._events['remove-item']) {
//          for (var i = 0, len = this.urls.length; i < len; i ++) {
//            this.$emit('remove-item', this.id, this.urls[i])
//          }
//        }
        if (this._events['remove-all']) {
          this.$emit('remove-all', urls) // 删除全部前事件（自己控制删除）
        } else {
          this.urls.splice(0, this.urls.length)
          this.$emit('removeItemAll', urls) // 删除全部后事件
        }
      },
      validFile: function(fileItem){ //文件验证
        let reg = /exe/;
        if(fileItem.size > this.size){ //文件大小检查
          //大于 1024 kb 把单位显示为 mb
          if (this.size / 1000 > 1024) {
            return ('单文件最大允许 ' + Math.floor(this.size / 1000 / 1000) + ' MB')
          } else {
            return ('单文件最大允许 ' + (this.size / 1000) + ' KB')
          }
        }
        let acceptFlag = false;
        for (let a = 0; a < this.accept.length; a++) { //检查文件格式
          if (this.accept[a] == fileItem.type ||
            this.accept[a] == RAR_MIMETYPE) {
            acceptFlag = true;
            break
          }
        }
        if (reg.test(this._getFileSuffix(fileItem.name))) {
          acceptFlag = false;
        }
        if(!acceptFlag){
          return '不支持的文件格式'
        }
      },
      fileChange: function(event){

        if (!event.target || !event.target.files) {
          return
        }
        let files = event.target.files
        for (let i = 0; i < files.length; i++) {
          let fileItem = files[i]
          if ((this.urls.length + this.fileList.length) >= this.count) {
            event.target.value = ''
            this.fail('最多允许上传'+this.count+'个文件', fileItem)
            return
          }
          let validMsg = this.validFile(fileItem)
          if (validMsg) {
            event.target.value = ''
            this.fail(validMsg, fileItem)
            return
          }
          this.fileList.push(fileItem)
        }
        event.target.value = ''
      },
      _ajax(method, url, data ,callback, option) {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        option && Object.keys(option).forEach((key) => {
          xhr.setRequestHeader(key, option[key])
        })
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              let resultData = xhr.responseText
              try {
                if(typeof resultData == 'string'){
                  resultData = JSON.parse(resultData)
                }
                //resultData = eval('(' + xhr.responseText + ')')
              } catch (e) {
                resultData = {
                  status: 0,
                  msg: '上传失败，返回数据异常\n'+e+';\n'+xhr.responseText
                }
              }
              callback && callback.succ && callback.succ(resultData)
            } else {
              callback && callback.fail && callback.fail(xhr)
            }
          }
        }
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
        xhr.send(data)
      },
      uploadFile: function(){
        let file = this.fileList[0]
        let vueComp = this
        let reader = new FileReader();
        let base64 = '';
        reader.onload=function() {
          base64 = reader.result;
        }
        reader.readAsDataURL(file);
        //构建xhr上传表单参数
        let qt2 = window.localStorage.getItem("qt2")

        if(qt2){
          vueComp.token=qt2
        }
        let form = new FormData()
        form.append('file', file)
        form.append('token', vueComp.token)
        form.append('x:folder', vueComp.directory)
        //优化自定义文件名模式
        if(vueComp.filename){
          let date = new Date()
          let month = date.getMonth()+1
          let day = date.getDate()
          let dd = date.getFullYear()+(month>=10?(month):('0'+month))+(day>=10?(day):('0'+day))
          form.append('key', vueComp.directory +'/'+dd+'/'+(vueComp.filename==='fileName'? file.name : vueComp.filename))
        }
        let fileName = file.name
        let fileType = vueComp._getFileSuffix(fileName)
        let isCompressedFile = fileType === 'rar' || fileType === 'zip'
        let xlsFiles = ['xls', 'xlsx', 'et']
        let isXlsFile = vueComp._inArr(fileType, xlsFiles)
        // 压缩文件上传地址
        let compressedFileUrl = window.rurl + 'PcOrderWS/unZip.rtz'
        let xlsFileUrl = window.rurl + 'PcOrderWS/getExcelContent.rtz'
        //构建xhr对象
        let xhr = new XMLHttpRequest()
        xhr.open('POST', qiniuUrl, true)
        xhr.setRequestHeader('Accept', 'application/json, text/javascript, */*; q=0.01')
        //上传进度回调
        xhr.upload.onprogress = function (event) {
          vueComp.$emit('progress', parseInt(event.loaded / event.total * 100))
        }
        if (xhr.ontimeout) {//暂时不用
          xhr.ontimeout = function (event) {
          }
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              let resultData = xhr.responseText
              try {
                if(typeof resultData == 'string'){
                  resultData = JSON.parse(resultData)
                  resultData.base64 = base64;
                  vueComp.$forceUpdate();
                }
              } catch (e) {
                resultData = {
                  status: 0,
                  msg: '上传失败，返回数据异常\n'+e+';\n'+xhr.responseText
                }
              }
              if (resultData.content && resultData.content.suffix) { //qiniu处理
                resultData.content.suffix = resultData.content.suffix.replace('.', '')
              }
              vueComp.complete(resultData)
              vueComp.fileList.shift() //去掉第一个队列元素
            } else {
              let resultData = {
                status: 0,
                msg: errCodeMsg['code'+xhr.status] ?  errCodeMsg['code'+xhr.status] : xhr.statusText
              }
              vueComp.complete(resultData)
            }
          }
        }
        xhr.send(form) //发射
      },
      refreshToken: function(update){ //刷新token
        let thisComp = this
        let xhr = new XMLHttpRequest()
        if (!xhr) {
          return
        }
        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status == 200) {
              thisComp.token = xhr.responseText
              window.localStorage.setItem("qt2",xhr.responseText)
            } else {
              thisComp.token = 'get token fail'
            }
          }
        }

        let paramArray = new Array()
        if (this.bucket) {
          paramArray[paramArray.length] = (encodeURIComponent('bucket') + '=' + encodeURIComponent(this.bucket))
        }
        if(this.size){
          paramArray[paramArray.length] = (encodeURIComponent('fsizeLimit') + '=' + encodeURIComponent(this.size))
        }
        if(this.accept){
          // let accept = this.accept.join(';')
          let accept = this.getAccept(this.accept, ';')
          paramArray[paramArray.length] = (encodeURIComponent('mimeLimit') + '=' + encodeURIComponent(accept))
        }
        let param = paramArray.join('&').replace('%20', '+')
        xhr.open("POST", 'https://toolapi.maytek.cn/qt2', true)
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=UTF-8")
        xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01")
        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")

        let qt2 = window.localStorage.getItem("qt2")
        if(!qt2){
          xhr.send(param)
        }
      }
    },
    watch: {
      fileList: function(newValue){
        if (!newValue || newValue.length<1) {
          return
        }
        this.uploadFile()
      },
      value:function (val, oldVal) {
        if (typeof val === 'string') {
          if (val !== '') {
            let urls = val.split(',')
            this.urls = urls
          } else {
            this.urls = new Array()
          }
        } else {
          this.urls = val
        }
      },
      deep: true
    },
    beforeCreate(){
      vm=this

    },
    mounted: function(){
      // this.refreshToken(); 插件使用后狂请求
      let _this = this;
      if (Array.isArray(_this.value)){
        _this.urls = _this.value
      }else if (_this.value !== ''){
        _this.urls = _this.value.split(",")
      }
      document.addEventListener('dragover', function(ev) {
        ev.preventDefault();
      })
      document.addEventListener('dragdrop', function(ev) {
        ev.preventDefault();
        if (_this.canUpload && !_this.disabled) {
          if (ev.clipboardData || ev.originalEvent ) {
            let files=ev.dataTransfer.files;
            if(files[0].type){
              _this.fileList.push(files[0]);
            } else {
              _this.$message.warning("不支持的类型");
              return
            }
          } else {
            _this.$message.warning('抱歉，该浏览器不支持拖拽上传');
            return
          }
        }
      })
      this.$nextTick(() => {
        _this.showTurnBtnFun()
      });

    }
  }
</script>

<style scoped lang="less">

  // 向左浮动
  .fl() {
    float: left;
  }

  // 向右浮动
  .fr() {
    float: right;
  }

  // 清除浮动
  .clear() {
    &:after{
      content:'';
      display:block;
      clear:both;
      height:0;
      overflow:hidden;
      visibility:hidden;
    }
    zoom:1;
  }

  .btn(@c: rgb(255, 198, 24);@w: 94px;@h: 30px) {
    box-sizing: border-box;
    background-color: @c;
    color: #fff;
    width: @w;
    height: @h;
    line-height: @h;
    text-align: center;
    border-radius: @h / 2;
  }

  .xyzDropzone-uploader-main {
    width: 100%;
    /* background-color: #fff; */
    margin: 0;
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }

  .xyzDropzone-uploader-main:after {
    clear: both;
    content: '';
    visibility: hidden;
    display: block;
    width: 0;
    height: 0;
  }

  .xyzDropzone-uploader-main .uploader-bd {
    padding: 0;
  }

  .form_wrapper {
    position: relative;
    left: 0;
    right: 0;
    height: 80px;
    border-radius: 4px;
    border: 1px dashed #3b72a8;
    &>div:last-child{
      flex: 1
    }
    .clear();
  }

  .xyzDropzone-uploader-main .delAllBtn {
    .fl;
    display: block;
    margin-left: 20px;
    text-decoration: none;
    display: none;
    .btn();
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-form {
    position: absolute;
    left: 0;
    top: 0;
    width: 80px;
    height: 80px;
    line-height: 80px;
    background-color: #f4f5f7;
    /* border-radius: 4px; */
    font-size: 14px;
    color: #3b72a8;
    text-align: center;
    position: relative;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-right: 1px dashed #3b72a8;
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-showbox {
    position: absolute;
    left: 80px;
    right: 0;
    top: 0;
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-form.disabled{
    background-color: #f5f7fa;
    border-color: #E4E7ED;
    color: #C0C4CC;
    cursor: not-allowed;
  }
  .xyzDropzone-uploader-main .xyzDropzone-uploader-form .upload-input {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 80px;
    height: 100%;
    opacity: 0;
    border-radius: 5px;
    cursor: pointer;
  }
  .xyzDropzone-uploader-form .text{
/*    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    max-width: 100%;*/
  }
  .xyzDropzone-ImgBox{
    height: 80px;
    margin-left: 14px;
    margin-right: 14px;
    position: relative;
    overflow: hidden;

  }
  .swiper-listBtn{
    position: relative;
    i:hover{
      opacity: 1;
    }
    .icon-xiangzuo11,.icon-xiangyou{
      position: absolute;
      color: #369ef6;
      width: 16px;
      height: 16px;
      display: inline-block;
      z-index: 2;
      opacity: 0.8;
      top: -44px;
      font-weight: bold;
      cursor: pointer;
    }
    .icon-xiangzuo11{
      left: 0px;
    }
    .icon-xiangyou{
      right: 0px;
    }
  }
  .xyzDropzone-uploader-main .xyzDropzone-uploader-list {
    list-style: none;
    text-align: center;
    zoom: 1;
    margin: 0;
    padding: 0;
    height: 80px;
    position: relative;
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-item {
    float: left;
    width: 60px;
    height: 60px;
    position: relative;
    box-sizing: border-box;
    border: 1px solid #3b72a8;
    border-radius: 5px;
    margin-right: 6px;
    margin-top : 10px;
    transition: 1s;
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-item .imgItem {
    width: 100%;
    height: 100%;
    border-radius: 5px;
  }

  .xyzDropzone-uploader-main .xyzDropzone-uploader-item span.iconfont  {
    font-size: 56px;
    cursor: pointer;
  }
  .delImgBtn{
    position: absolute;
    right: 0;
    top: 1px;
    width: 14px;
    height: 14px;
    font-size: 14px;
    overflow: hidden;
    color: #ff5252;
    line-height: 14px;
    text-align: center;
    border-radius: 50%;
    background: #fff;

  }
  .xyzDropzone-uploader-main .xyzDropzone-uploader-struts {
    position: relative;
  }

  .xyzDropzone-uploader-main .icon-wram {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 0;
    right: 0;
    box-sizing: border-box;
    border-radius: 10px;
    background-color: rgba(13, 13, 13, 0.1);
    /*background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAMAAADXqc3KAAAANlBMVEUAAAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/AAD/FRX/1NT/////g4P/gYH/09Ofbm6+AAAAC3RSTlMA9h65p3fkWHBO10SL1SkAAACKSURBVCjPdZJZDsQgDEOTsLQzhi73v2zV1VGr+AueBYHEcslKqqr/VEy8LCtuZWf9FE463HzES+PJB2BppG0BjjOmmKfeHr5OM3Svk4HWL+dZZhHj1i9MCgjIUSSBDjmSVNAhRxUFHXJoaIRXhcXD54YfDFvybWI/mhi1PRpUPFqGAd8w+PhUxmcDC4UTqx/vOj0AAAAASUVORK5CYII=");*/
    background-image: url(@imgDel);
    background-size: cover;
    display: inline-block;
    cursor: pointer;
    &:hover {
      background-color: rgba(244, 13, 13, 0.9);
    }
  }
  @imgPre:'data:image/png;base64,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';
  @imgNext: 'data:image/png;base64,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';
  @imgDel: 'data:image/png;base64,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';

  .itemBtn() {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 25px;
    background-color: rgba(13, 13, 13, 0.1);
    cursor: pointer;
    background-size: cover;
    &:hover{
      background-color: rgba(13, 13, 13, 0.9);
    }
  }
  .imgView {
    position: fixed;
    z-index: 99999;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(1, 1, 1, 0.9);
    .preBtn {
      .itemBtn();
      left: 6%;
      top: 50%;
      transform: translateY(-50%);
      background-image: url(@imgPre);
    }
    .nextBtn {
      .itemBtn();
      right: 6%;
      top: 50%;
      transform: translateY(-50%);
      background-image: url(@imgNext);
    }
    .delBtn {
      .itemBtn();
      right: 7%;
      top: 6%;
      cursor: pointer;
      background-image: url(@imgDel);
    }
    .imgItem_wrapper {
      width: 100%;
      height: 100%;
      display: table;
      .img_warpper {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        .imgItem {
          max-width: 80%;
        }
      }
    }
  }
</style>
