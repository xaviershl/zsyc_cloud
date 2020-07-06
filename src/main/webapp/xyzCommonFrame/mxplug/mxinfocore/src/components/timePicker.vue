<template>
  <!--主要容器开始-->
  <div class="item-time-val">
    <el-select
      filterable
      clearable
      :disabled="disabled"
      default-first-option
      v-model="time.hour"
      placeholder="小时">
      <el-option
        v-for="item in timeService.hour"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
    <i class="time-i"> :</i>
    <el-select
      filterable
      clearable
      :disabled="disabled"
      default-first-option
      v-model="time.minute" placeholder="分">
      <el-option
        v-for="item in timeService.minute"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
  </div>
  <!--主要容器结束-->
</template>
<script>
  let vm; //留住this
  export default {
    name: 'tab', //定义模块名称
    data() {//定义模块变量
      return {
        time: {
          hour: '',
          minute: ''
        },
        timeService: {
          hour: [],
          minute: []
        }
      }
    },
    props: {
      disabled: {
        type: Boolean,
        default: false
      },
      value: {
        type: String,
      }
    },
    //方法定义区
    watch: {
      time: {
        handler: function(value) {
          let newValue = value.hour + ':' + value.minute;
          this.$emit('input', newValue);
          this.$emit('change', newValue);
        },
        deep: true
      },
      value: function(value) {
        if (value) {
          value = value.replace('：', ':');
          let timeList = value.split(':');
          let time = {
            hour: timeList[0] || '',
            minute: timeList[1] || '',
          }
          this.time = JSON.parse(JSON.stringify(time));
        }
      }
    },
    /**
     * 生命周期
     **/
    //完成了 data 数据的初始化，el没有
    created: function () {
      if (this.value) {
        this.value = this.value.replace('：', ':');
        let timeList = this.value.split(':');
        this.time = {
          hour: timeList[0] || '',
          minute: timeList[1] || '',
        }
      }
      for (let i = 0; i < 24; i++) {
        i < 10 ? this.timeService.hour.push('0' + i)
          : this.timeService.hour.push(i.toString());
      }
      let j = 0;
      while (j < 60) {
        j < 10 ? this.timeService.minute.push('0' + j)
          : this.timeService.minute.push(j.toString());
        j += 5;
      }
    },
  }
</script>
<style scoped lang="less">
  .item-time-val {
    .el-select {
      width: calc(~'50% - 20px');
      float: left;
      &:last-child {
        float: right;
      }
    }
    .time-i {
      display: inline-block;
      width: 10px;
      text-align: center;
      margin-left: 5px;
      margin-top: 6px;
      color: rgb(85, 85, 85);
    }
  }
</style>
