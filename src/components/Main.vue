<template>
  <div class="MainContent">
    <el-row type="flex" justify="space-around">
      <el-col :span="10">
        <div class="CurrentTaskList">
          <h3>当前任务单:</h3>
          <ul>
            <li v-for="(item,index) in listData" :key="index">
              <span>{{item.name}}:</span>
              <span>{{item.value}}</span>
              <a class="link" @click="linkTo(index+1)">查看</a>
            </li>
          </ul>
        </div>
      </el-col>
      <el-col :span="10">
        <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import axios from "axios";
import { GetUserInfoApi, WorkOderListApi } from "../api/api";
export default {
  data() {
    return {
      listData: [],
      userInfo: {},
      data: [
        { value: 50, name: "已开始任务单" },
        { value: 10, name: "已完成任务单" },
        { value: 40, name: "部分完成任务单" }
      ]
    };
  },
  created() {
    this.$nextTick(function() {
      
    this.getUser();
    setTimeout(() => {
      
    this.drawLine();
    }, 500);
    });
  },
  methods: {
    /* 获取当前用户信息 */
    getUser() {
      GetUserInfoApi()
        .then(res => {
          this.userInfo = res.data.data;
          this.getWorkOrder(res.data.data.id, 1);
          this.getWorkOrder(res.data.data.id, 2);
          this.getWorkOrder(res.data.data.id, 3);
          this.getWorkOrder(res.data.data.id, 4);
        })
        .catch();
    },
    /* 获取任务单 */
    getWorkOrder(id, state) {
      WorkOderListApi({
        publisherId: id,
        status: state
      })
        .then(res => {
          let obj = {
            name: "",
            value: ""
          };
          if (state == 1) {
            obj.name = "已发布";
          } else if (state == 2) {
            obj.name = "进行中";
          } else if (state == 3) {
            obj.name = "已完成";
          } else {
            obj.name = "拒绝";
          }
          obj.value = res.data.data.items.length;
          this.listData.push(obj);
        })
        .catch();
    },
    /* 绘制图表 */
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        color: ["#448aca", "#f9cc88", "#f29c9f", "#329e82"],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["已发布", "进行中", "已完成", "拒绝"]
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ["pie", "funnel"],
              option: {
                funnel: {
                  x: "25%",
                  width: "50%",
                  funnelAlign: "left",
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        calculable: true,
        series: [
          {
            name: "任务单比率",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            data: this.listData
          }
        ]
      });
    },
    /* 跳转 */
    linkTo(state){
      console.log(state)
      this.$router.push({
        name:"workOrder",
        params:{
          state:state
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.MainContent {
  width: 85%;
  margin: 80px auto;
}
.CurrentTaskList {
  h3 {
    font-size: 22px;
    color: #555;
    font-weight: normal;
  }
  li {
    margin-top: 10px;
    span {
      display: inline-block;
      font-size: 16px;
      color: #888;
      width: 100px;
      padding-left: 10px;
      &:first-child {
        text-align: right;
      }
    }
    & .link {
      color: #329e82;
      font-size: 16px;
    }
  }
}
</style>