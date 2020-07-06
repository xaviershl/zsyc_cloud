<template>
  <div class="quill-editor-example">
    <!-- quill-editor -->
    <quill-editor ref="myTextEditor"
                  v-model="option.value"
                  :options="editorOption"
                  @blur="onEditorBlur($event)"
                  @ready="onEditorReady($event)">
    </quill-editor>
    <div class="quill-code">
    </div>
    <xyzuploader v-show="false"
      :urls="fileList"
      :accept="imgAccept"
      @complete="upScuccess"
      ref="fileUpload"
    ></xyzuploader>
  </div>
</template>

<script>
  // require styles
  import 'quill/dist/quill.core.css'
  import 'quill/dist/quill.snow.css'
  import 'quill/dist/quill.bubble.css'
  import { quillEditor } from 'vue-quill-editor'
  import * as Quill from 'quill'
  import xyzuploader from './xyzUploader.vue'

  export default {
    data() {
      return {
        name: '01-example',
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': [] }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
              // ['link', 'image', 'video']
            ],
          },
          placeholder: '',
        },
        fileList: [],
        addRange: [],
        imgAccept: [
          'image/jpg',
          'image/jpeg',
          'image/png',
          'image/bmp',
          'image/gif',
        ],
      }
    },
    props: ['option','disabled'],
    components: {
      quillEditor,
      xyzuploader
    },
    methods: {
      onEditorBlur(editor) {
        // this.removePaste();
      },
      onEditorFocus(editor) {
        // this.addPaste();
      },
      onEditorReady(editor) {
        this.$nextTick(() => {
        })
      },
      imgHandler(state) {
        this.addRange = this.editor.getSelection();
        if (state) {
          this.fileUpload.fileClick() // 加一个触发事件
        }
      },

      // 图片上传成功回调   插入到编辑器中
      upScuccess(file) {
        let vm = this;
        let url = file;
        if (url != null) {  // 将文件上传后的URL地址插入到编辑器文本中
          let value = url
          vm.addRange = vm.editor.getSelection()
          value = value[0]
          // value = value.indexOf('http') !== -1 ? value : 'http:' + value
          vm.editor.insertEmbed(vm.addRange !== null ? vm.addRange.index : 0, 'image', value, Quill.sources.USER)   // 调用编辑器的 insertEmbed 方法，插入URL
        } else {
          this.$message.error('图片插入失败')
        }
        this.fileUpload.removeItemAll();
      },
      addPaste() {
        document.addEventListener('paste',this.pasteImg);
      },

      removePaste() {
        document.removeEventListener('paste',this.pasteImg);
      },

      pasteImg(event) {
        let _this = this;
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
              }
            }
            if ( blob !== null ) {
              _this.fileUpload.fileList.push(blob);
            }
          }
        }
      },
    },
    computed: {
      editor() {
        return this.$refs.myTextEditor.quill
      },
      fileUpload() {
        return this.$refs.fileUpload
      },
    },
    mounted() {
      // 为图片ICON绑定事件  getModule 为编辑器的内部属性
      this.editor.getModule('toolbar').addHandler('image', this.imgHandler);
      this.editor.container.style.height = '400' + 'px'
      this.editor.enable(!this.disabled)

    },
    watch: {
      option: function (data1,data2) {
        let typeContent = data1.options !== '' && data1.options !== undefined ? JSON.parse(data1.options) : {height: 400}
        let height = typeContent.height
        this.editor.container.style.height = height + 'px'
      }
    }
  }
</script>

<style lang="less">
  .quill-editor-example {
    position: relative;
    width: 100%;
    height: 100%;
    margin: 0 auto;
    .quill-editor {
      position: relative;
      height: 100%;
      width: 100%;
      box-sizing: border-box;
      .ql-toolbar {
        width: 100%;
        background-color: #fff;
        z-index: 1;
      }
      .ql-container {
        position: relative;
        height: 100%;
        .ql-editor {
          .ql-video {
            width: 100%;
          }
        }
      }
    }
  }
</style>
