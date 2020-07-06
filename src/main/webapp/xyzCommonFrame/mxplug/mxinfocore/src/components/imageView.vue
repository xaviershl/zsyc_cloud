<template>
  <!--主要容器开始-->
  <div class="image-container">
    <dragBox class="image-wrapper">
      <i class="iconfont icon-shanchu"
         @click="close"></i>
      <i v-if="option.imgUrlList.length > 0"
         :class="{disabled: thisIndex===0}"
         @click="changeImage('prev')"
         class="iconfont icon-shangyibu"></i>
      <i v-if="option.imgUrlList.length > 0"
         @click="changeImage('next')"
         :class="{disabled: thisIndex === option.imgUrlList.length-1}"
         class="iconfont icon-xiayibu"></i>
      <div class="image-item"
           v-for="(imgItem, index) in option.imgUrlList"
           v-show="thisIndex == index">
        <img  :src="imgItem" alt="" ondragstart="return false;">
      </div>
    </dragBox>
  </div>
  <!--主要容器结束-->
</template>

<script>
  let vm; //留住this
  import dragBox from '@/components/dragBox.vue';
  export default {
    name: '', //定义模块名称
    props: ['option','callback'],
    data() {
      return {
        showImage:[],
        thisIndex: 0
      } //定义模块变量
    },
    components: {
      dragBox
    },
    methods: {
      close() {
        this.imageDialog.hideDialog();
      },
      changeImage(type) {
        if (type === 'prev') {
          if (this.thisIndex > 0) {
            this.thisIndex <= 0 ? 0: this.thisIndex--;
          }
        } else {
          if (this.thisIndex < this.option.imgUrlList.length) {
            this.thisIndex >= this.option.imgUrlList.length-1 ? this.option.imgUrlList.length-1: this.thisIndex++;
          }
        }
      }
    },//方法定义区
    /**
     * 生命周期
     **/
    //el 和 data 并未初始化
    beforeCreate: function () {
      vm = this//留住this
    },
    //完成了 data 数据的初始化，el没有
    created: function () {

    },
    //完成了 el 和 data 初始化
    beforeMount: function () {

    },
    //完成挂载
    mounted: function () {
      this.thisIndex = this.option.index;
      for (let i in this.option.imgUrlList) {
        i === this.thisIndex?this.showImage.push(true)
          :this.showImage.push(false);
      }
    },
    //更新前,
    beforeUpdate: function () {

    },
//更新后,
    updated: function () {

    },
//销毁前,
    beforeDestroy: function () {

    },
//销毁后
    destroyed: function () {

    },
    //组件激活时,此生命周期只在<keep-alive>标签内生效
    activated: function () {

    },
    //组件停用时,此生命周期只在<keep-alive>标签内生效
    deactivated: function () {

    }
  }
</script>
<style scoped lang="less">
  @import "../assets/css/common";

  .image-container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
    z-index: 101;
  }
  .image-wrapper{
    position: fixed;
    top: 50% !important;
    left: 50% !important;
    transform: translate(-50%,-50%);
    max-width: 100%;
    max-height: 100%;
    height: 80%;
    width: 80%;
    z-index: 10;
    background: rgba(0,0,0,0.5);
    .icon-shanchu,
    .icon-shangyibu,
    .icon-xiayibu{
      color: #fff;
      position: absolute;
      font-size: 26px;
      cursor: pointer;
      z-index: 10;
      display: none;
      &.disabled{
        color: #ccc;
      }
    }
    .icon-shanchu{
      right: 5px;
      top: 5px;
    }
    .icon-shangyibu{
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
    }
    .icon-xiayibu{
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
    }

    .image-item{
      position: absolute;
      width: 95%;
      height: 95%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      img{
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }
  }
  .image-wrapper:hover{
    .icon-shanchu,
    .icon-shangyibu,
    .icon-xiayibu{
      display: block;
    }
  }
</style>
