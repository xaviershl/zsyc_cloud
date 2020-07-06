<template>
    <!--主要容器开始-->
    <div class="box" ref="drag" >
      <div class="drag-box" @mousedown="dragBox"></div>
      <slot></slot>
    </div>
    <!--主要容器结束-->
</template>

<script>
    let vm; //留住this
    let oMx = 0;
    let oMy =0;//鼠标x、y轴坐标（相对于left，top）
    let oDx = 0;
    let oDy = 0;//对话框坐标（同上）
    let isDrag = false;      //不可拖动
    export default {
        name: 'box', //定义模块名称
        data() {
            return {} //定义模块变量
        },
        methods: {
          dragBox:function(evt){
            let e = window.event || evt ;
            let drag = this.$refs.drag;
            let isCommon = drag.className.indexOf('commonBoxBody');
            document.documentElement.classList.add('userUnSel');

            oMx = e.pageX;      //点击时鼠标X坐标
            oMy = e.pageY;      //点击时鼠标Y坐标
            oDx = drag.offsetLeft;
            oDy = drag.offsetTop;
            isDrag = true;      //标记对话框可拖动
            document.onmousemove = function(evt){
              let e = window.event || evt;
              let x = e.pageX;      //移动时鼠标X坐标
              let y = e.pageY;      //移动时鼠标Y坐标
              let moveX = oDx + x - oMx;      //移动后对话框新的left值
              let moveY = oDy + y - oMy;      //移动后对话框新的top值
              let pageW = document.documentElement.clientWidth;
              let pageH = document.documentElement.clientHeight;
              let dialogW = drag.offsetWidth;
              let dialogH = drag.offsetHeight;
              if (isDrag && isCommon > 0) {
                let maxX = pageW - dialogW + dialogW / 2;       //X轴可拖动最大值
                let maxY = pageH - dialogH + dialogH / 2;       //Y轴可拖动最大值
                moveX = Math.min(Math.max(dialogW / 2,moveX),maxX);
                moveY = Math.min(Math.max(dialogH / 2,moveY),maxY);

                drag.style.left = moveX +'px';       //重新设置对话框的left
                drag.style.top =  moveY +'px';        //重新设置对话框的top
              } else if(isDrag){        //判断对话框能否拖动
                let maxX = pageW - dialogW;       //X轴可拖动最大值
                let maxY = pageH - dialogH;       //Y轴可拖动最大值
                moveX = Math.min(Math.max(0,moveX),maxX);
                moveY = Math.min(Math.max(0,moveY),maxY);


                drag.style.left = moveX +'px';       //重新设置对话框的left
                drag.style.top =  moveY +'px';        //重新设置对话框的top

              }
            };
            document.onmouseup = function () {
              isDrag = false;
              document.documentElement.classList.remove('userUnSel');
            }
          },
          autoCenter:function(){
            let el = vm.$refs.drag;
            //获取视窗大小
            let bodyW = document.documentElement.clientWidth;
            let bodyH = document.documentElement.clientHeight;
            el.style.left = bodyW/2 + 'px';
            el.style.top = bodyH/2 + 'px';
          }
        },//方法定义区

        /**
         * 生命周期
         **/
        //完成挂载
        mounted: function () {
          vm = this;  //留住this
          // vm.autoCenter();
        },


    }
</script>
<style scoped lang="less">
  .box{
    display: inline-block;
    position: absolute;
    left: 0;
    top:0;
    .drag-box{
      width: 100%;
      height: 36px;
      position: absolute;
      cursor: move;
    }
  }
</style>
