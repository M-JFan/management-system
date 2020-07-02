<template>
  <div class="HomeContent">
    <!-- 布局 -->
    <el-container>
      <!-- 顶部 -->
      <el-header style="height:100px;padding:0">
        <LayoutHeader></LayoutHeader>
      </el-header>
      <el-container :style="{height:mainHeight}">
        <!-- 左侧 -->
        <el-aside class="Aside">
          <Menu></Menu>
        </el-aside>
        <!-- 主体容器 -->
        <el-main class="Main">
          <div class="Contanct">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
      <!-- 底部 -->
      <el-footer class="Footer" style="height:40px">
        <!-- <div class="TipsContent">{{dateTime}},超级用户.所属组织:{{organization}}</div> -->
        <div class="TipsContent">{{dateTime}},管理员</div>
        <div>沪ICP备20019760号</div>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import LayoutHeader from "../components/Header";
import Menu from "../components/Menu";
export default {
  data() {
    return {
      dateTime: "",
      organization: "中国工商银行",
      mainHeight: ""
    };
  },
  components: {
    LayoutHeader,
    Menu
  },
  methods: {
    /* 判断是上午还是下午 */
    judgeTime() {
      let hh = new Date().getHours();
      if (hh >= 12) {
        this.dateTime = "下午好";
      } else {
        this.dateTime = "上午好";
      }
    }
  },
  created() {
    this.judgeTime();
    this.mainHeight = document.body.clientHeight - 140 + "px";
  }
};
</script>
<style lang="scss" scoped>
.Aside {
  box-shadow: 3px 0 8px -4px #999;
  margin-right: 4px;
}
.Main {
  background: #f4f4f4;
  display: flex;
  padding: 10px;
}
.Contanct {
  background: url("../assets/main-bg.png") no-repeat right bottom #fff;
  display: block;
  flex: 1;
  flex-basis: auto;
  overflow: auto;
  box-sizing: border-box;
  padding: 20px;
  position: relative;
}
.Footer {
  position: fixed;
  bottom: 0;
  background: #329e82;
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  line-height: 40px;
  color: #fff;
  font-size: 16px;
}
</style>