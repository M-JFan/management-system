<template>
  <div class="baseInfoContent">
    <div class="itemsInfo">
      <div class="label">用户名</div>
      <div class="info" v-if="!changeUserNameVisible">
        <span class="userName">{{userName}}</span>
        <i class="el-icon-edit edit" @click="changeUserName"></i>
      </div>
      <div class="editInfo" v-else-if="changeUserNameVisible">
        <el-input type="text" v-model="userName"></el-input>
        <div class="active">
          <i
            class="el-icon-check check"
            @click="confirmChange(userName,confirmChangeUserNameVisible(),'用户名不能为空')"
          ></i>
          <i class="el-icon-close close" @click="closeChangeUserName"></i>
        </div>
      </div>
    </div>
    <div class="itemsInfo">
      <div class="label">姓名</div>
      <div class="info" v-if="!changeRealNameVisible">
        <span>{{realName}}</span>
        <i class="el-icon-edit edit" @click="changeRealName"></i>
      </div>
      <div class="editInfo" v-else-if="changeRealNameVisible">
        <el-input type="text" v-model="realName"></el-input>
        <div class="active">
          <i
            class="el-icon-check check"
            @click="confirmChange(realName,confirmChangeRealNameVisible(),'姓名不能为空')"
          ></i>
          <i class="el-icon-close close" @click="closeChangeRealName"></i>
        </div>
      </div>
    </div>
    <div class="itemsInfo">
      <div class="label">联系电话</div>
      <div class="info" v-if="!changePhoneVisible">
        <span>{{phone}}</span>
        <i class="el-icon-edit edit" @click="changePhone"></i>
      </div>
      <div class="editInfo" v-else-if="changePhoneVisible">
        <el-input type="text" v-model="phone"></el-input>
        <div class="active">
          <i
            class="el-icon-check check"
            @click="confirmChange(phone,confirmChangePhoneVisible(),'手机号不能为空')"
          ></i>
          <i class="el-icon-close close" @click="closeChangePhone"></i>
        </div>
      </div>
    </div>
    <div class="itemsInfo">
      <div class="label">密码</div>
      <div class="info">
        <span class="password" v-if="!psdShow">123456</span>
        <span class="password" v-else-if="psdShow">********</span>
        <i :class="[psdShow ? 'viewOn' : 'viewOff', 'view']" @click="clickPsdShow"></i>
        <i class="el-icon-edit edit" @click="clickPassword"></i>
        <em>(仅本人更改)</em>
      </div>
    </div>
    <el-dialog width="500px" title="修改密码" :visible.sync="changepasswordVisible">
      <div class="editForm">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item label="密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" placeholder="请输入确认密码"></el-input>
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
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      psdShow: true, //密码状态
      changeUserNameVisible: false, //修改用户名状态
      changeRealNameVisible: false, //修改姓名状态
      changePhoneVisible: false, //修改手机号状态
      changepasswordVisible: false, //修改密码状态
      userName: "程思宇", //初始用户名
      user_name: "", //备份初始用户名
      realName: "陈思玙", //初始姓名
      real_name: "", //备份姓名
      phone: "13242839219", //初始电话
      back_phone: "", //备份电话
      ruleForm: {
        pass: "",
        checkPass: ""
      },
      rules: {
        pass: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    /* 控制密码的可视 */
    clickPsdShow() {
      this.psdShow = !this.psdShow;
    },
    /* 通用修改方法 */
    confirmChange(name, func, tips) {
      if (name != "") {
        func;
        this.$notify({
          title: "成功",
          message: "修改成功",
          type: "success"
        });
      } else {
        this.$notify.error({
          title: "错误",
          message: tips
        });
      }
    },
    /* 修改用户名 */
    changeUserName() {
      this.changeUserNameVisible = true;
      this.user_name = this.userName;
    },
    /* 取消修改用户名 */
    closeChangeUserName() {
      if (this.user_name != this.userName) {
        this.userName = this.user_name;
      }
      this.changeUserNameVisible = false;
    },
    /* 通用取消方法 */
    // closeChange(oldVal, newVal, func) {
    //   if (newVal != oldVal) {
    //     console.log("新" + newVal);
    //     console.log("旧" + oldVal);
    //   }
    //   func;
    //   console.log(this.userName);
    // },
    /* 确认修改之后，状态的改变 */
    confirmChangeUserNameVisible() {
      this.changeUserNameVisible = false;
    },
    confirmChangeRealNameVisible() {
      this.changeRealNameVisible = false;
    },
    confirmChangePhoneVisible() {
      this.changePhoneVisible = false;
    },

    /* 修改姓名 */
    changeRealName() {
      this.changeRealNameVisible = true;
      this.real_name = this.realName;
    },
    /* 取消修改姓名 */
    closeChangeRealName() {
      if (this.real_name != this.realName) {
        this.realName = this.real_name;
      }
      this.changeRealNameVisible = false;
    },
    /* 修改手机号 */
    changePhone() {
      this.changePhoneVisible = true;
      this.back_phone = this.phone;
    },
    /* 取消修改手机 */
    closeChangePhone() {
      if (this.back_phone != this.phone) {
        this.phone = this.back_phone;
      }
      this.changePhoneVisible = false;
    },

    /* 修改密码 */
    clickPassword() {
      this.changepasswordVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.baseInfoContent {
  width: 520px;
  margin: 80px auto;
}
.itemsInfo /deep/ {
  display: flex;
  margin-bottom: 15px;
  font-size: 20px;
  line-height: 40px;
  color: #666;
  & .label {
    min-width: 100px;
    text-align: right;
    height: 40px;
    &::after {
      content: ":";
      padding-left: 5px;
    }
  }
  & .info {
    width: 100%;
    span {
      width: 200px;
      display: inline-block;
      padding-left: 15px;
      height: 39px;
      border-bottom: 1px solid #fff;
    }
    & .password {
      width: 175px;
    }
  }
  & .userName {
    color: #ffb400;
  }
  i {
    cursor: pointer;
    position: relative;
  }
  & .edit {
    color: #329e82;
  }
  & .view {
    width: 20px;
    height: 20px;
    display: inline-block;
    vertical-align: sub;
  }
  & .viewOn {
    background: url("../../assets/view.svg") no-repeat;
  }
  & .viewOff {
    background: url("../../assets/view_off.svg") no-repeat;
  }
  & .check {
    color: #329e82;
  }
  & .close {
    color: red;
  }
  em {
    color: #999;
    margin: 0 7px;
  }
  & .editInfo {
    display: flex;
  }
  & .active {
    min-width: 80px;
    i {
      display: inline-block;
      padding-left: 10px;
    }
  }
  & .el-input {
    height: 40px;
    width: 215px;
  }
  & .el-input__inner {
    border: none;
    border-radius: 0;
    border-bottom: 1px solid #329e82;
    color: #666;
    font-size: 20px;
    font-family: PGZT;
  }
}
.editForm {
  button {
    &:hover {
      background: #fff;
      border-color: #329e82;
      color: #329e82;
    }
  }
  & .submitBtn {
    background: #329e82;
    border-color: #329e82;
    color: #fff;
  }
}
</style>