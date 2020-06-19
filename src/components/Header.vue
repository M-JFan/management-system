<template>
  <div class="LayoutHeader">
    <router-link to="/main">
      <Title></Title>
    </router-link>
    <div class="NavUserInfo">
      <div class="TimeInfo">
        <span>{{ nowDate }}</span>
        <span>{{ nowWeek }}</span>
        <span>{{ nowTime }}</span>
      </div>
      <div class="UserInfo">
        <div>
          欢迎管理员
          <div class="info">
            <span v-if="userName">{{userName}}</span>
            <span v-else>管理员</span>
            <div class="toggle">
              <ul>
                <li>
                  <a @click="changePasswordVisible = true">修改密码</a>
                </li>
                <li>
                  <a @click="logout">退出</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 修改密码 -->
    <el-dialog
      width="500px"
      title="修改密码"
      :visible.sync="changePasswordVisible"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="close"
    >
      <div class="editForm">
        <el-form :model="changePsdForm" :rules="rules" ref="ruleForm">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="changePsdForm.pass" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="changePsdForm.checkPass" placeholder="请输入确认密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="submitBtn" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Title from "../components/Title";
import { LogoutApi, GetUserInfoApi, ChangePasswordApi, SupplierListApi, ContractListApi } from "../api/api";
export default {
  name: "layoutHeader",
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.changePsdForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.changePsdForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      nowDate: "", // 当前日期
      nowTime: "", // 当前时间
      nowWeek: "", // 当前星期
      changePasswordVisible: false,
      userName: "",
      changePsdForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  components: {
    Title
  },
  methods: {
    currentTime() {
      setInterval(this.getDate, 500);
    },
    getDate: function() {
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let week = new Date().getDay();
      let hh = new Date().getHours();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      if (week == 1) {
        this.nowWeek = "星期一";
      } else if (week == 2) {
        this.nowWeek = "星期二";
      } else if (week == 3) {
        this.nowWeek = "星期三";
      } else if (week == 4) {
        this.nowWeek = "星期四";
      } else if (week == 5) {
        this.nowWeek = "星期五";
      } else if (week == 6) {
        this.nowWeek = "星期六";
      } else {
        this.nowWeek = "星期日";
      }
      _this.nowTime = hh + ":" + mf + ":" + ss;
      _this.nowDate = yy + "-" + mm + "-" + dd;
    },
    /* 获取当前用户信息 */
    getUserInfo() {
      GetUserInfoApi()
        .then(res => {
          this.userName = res.data.data.realname;
        })
        .catch();
    },
    /* 退出 */
    logout() {
      LogoutApi()
        .then(res => {
          if (res.data.code == 200) {
            this.$store.commit("delTokent");
            this.$notify({
              title: "成功",
              message: "已退出登录",
              type: "success"
            });
            this.$router.push({
              path: "/"
            });
          }
        })
        .catch();
    },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          ChangePasswordApi({ password: this.changePsdForm.pass })
            .then(res => {
              if (res.data.code == 200) {
                this.$store.commit("delTokent");
                this.$notify({
                  title: "成功",
                  message: "密码修改成功，请重新登录",
                  type: "success"
                });
                this.$router.push({
                  path: "/"
                });
              }
            })
            .catch();
        } else {
          return false;
        }
      });
    },
    close() {
      this.changePasswordVisible = false
      this.resetForm("ruleForm");
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* 获取供应商列表 */
    getSupplierList(){
      SupplierListApi().then(res=>{
        this.$store.commit('setSupplierList',res.data.data.items)
      }).catch()
      this.getContractList()
    },
    /* 获取合同列表，并且进行去重 */
    getContractList() {
      ContractListApi()
        .then(res => {
          this.$store.commit('setContractList',res.data.data.items)
        })
        .catch();
    },
  },
  mounted() {
    this.currentTime();
    this.getUserInfo();
    this.getSupplierList()
  },
  // 销毁定时器
  beforeDestroy() {
    if (this.getDate) {
      clearInterval(this.getDate); // 在Vue实例销毁前，清除时间定时器
    }
  }
};
</script>
<style lang="scss" scoped>
.LayoutHeader {
  display: flex;
  background: #329e82;
  padding: 20px 30px;
  justify-content: space-between;
}
.NavUserInfo {
  & .TimeInfo {
    span {
      display: inline-block;
      color: #fff;
      font-size: 16px;
      margin-left: 7px;
      font-weight: 100;
    }
  }
  & .UserInfo {
    font-size: 18px;
    color: #fff;
    height: 35px;
    text-align: right;
    line-height: 45px;
    span {
      color: #ffb400;
      margin: 0 7px;
    }
    button {
      color: #fff;
      font-size: 18px;
      &:hover {
        color: red;
      }
    }
  }
}
.info {
  cursor: pointer;
  display: inline-block;
  position: relative;
  z-index: 10;
  & .toggle {
    display: none;
    position: absolute;
    top: 37px;
    right: 0;
    background: #fff;
    border-radius: 3px;
    width: 100px;
    padding: 8px 15px;
    box-shadow: 0 0 20px 0 rgba(28, 36, 44, 0.12);
    li {
      display: block;
      line-height: 24px;
    }
    a {
      font-size: 14px;
      color: #666;
      &:hover {
        color: #329e82;
      }
    }
  }
}
.info:hover .toggle {
  display: block;
}
</style>