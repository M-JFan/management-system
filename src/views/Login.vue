<template>
  <div class="LoginContent">
    <div class="LoginFormContent">
      <Title></Title>
      <div class="LoginForm">
        <el-form ref="loginForm" :model="loginForm" :rules="loginFormRules" label-width="80px">
          <el-form-item prop="userName" label="用户名">
            <el-input type="text" v-model="loginForm.userName" placeholder="用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password" label="密码">
            <el-input type="password" v-model="loginForm.password" placeholder="密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleSubmit('loginForm')">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../components/Title";
import { LoginApi } from "../api/api";
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        userName: "",
        password: ""
      },
      loginFormRules: {
        userName: [
          { required: true, message: "请输入正确的用户名", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      }
    };
  },
  methods: {
    /* 登录 */
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          LoginApi({
            username: this.loginForm.userName,
            password: this.loginForm.password
          })
            .then(res => {
              this.$store.commit("setToken", res.data.data.token);
              if (res.data.code === 200) {
                this.$notify({
                  title: "成功",
                  message: "登录成功",
                  type: "success"
                });
                this.$router.push({
                  path: "/home"
                });
              }
            })
            .catch(error => {
                this.$message.error("请输入正确的用户名和密码");
            });
        }
      });
    }
  },
  components: {
    Title
  }
};
</script>
<style lang="scss" scoped>
.LoginContent {
  background: url("../assets/bg.jpg");
  background-size: 100% 100%;
  background-position: center center;
  overflow: auto;
  width: 100%;
  height: 100vh;
  position: relative;
}
.LoginFormContent {
  width: 600px;
  height: 400px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  padding: 50px 100px;
}
.LoginFormContent /deep/ {
  .el-form-item__label {
    color: #fff;
    line-height: 50px;
    font-size: 16px;
  }
  .el-form-item {
    margin-bottom: 40px;
  }
  .el-form-item__label::before {
    content: "" !important;
  }
  .el-input__inner {
    height: 50px;
    line-height: 50px;
  }
}
.LoginForm {
  margin: 30px 0;
  button {
    width: 100%;
    cursor: pointer;
    padding: 14px 0;
    font-size: 20px;
    background: #329e82;
    border: #329e82;
    &:hover {
      background: #53bda2;
    }
  }
}
</style>