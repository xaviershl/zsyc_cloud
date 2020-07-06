// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import xyzuploader from './components/xyzUploader.vue'
import imageViewDialog from './components/imageView.vue'
import textEditor from './components/textEditor.vue'
import VmScrollbar from 'vue-multiple-scrollbar'

Vue.use(ElementUI)
Vue.component('xyzuploader', xyzuploader);
Vue.component('textEditor', textEditor);
Vue.component('VmScrollbar', VmScrollbar);

const imageViewConstructor = Vue.extend(imageViewDialog);

//图片查看组件
Vue.prototype.imageDialog = {
  showImageDialog (option, callback, reLogin) {
    let dialog = document.querySelector('.image-container');
    if (reLogin) {
      dialog && dialog.remove();
      dialog = false;
    }
    if (!dialog) {
      this.option = option;
      let node = '#app';
      let dom = document.querySelector(node);
      let imageDialog = new imageViewConstructor({propsData: {option: option, callback: callback}}).$mount();
      dom.appendChild(imageDialog.$el);
    }
  },
  hideDialog() {
    let dialog = document.querySelector('.image-container');
    dialog && dialog.remove();
  }
};

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
