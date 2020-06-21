<template>
  <el-dialog
    title="新增管理员"
    :visible.sync="addAdminVisible"
    width="600px"
    :destroy-on-close="true"
    :before-close="close"
  >
    <el-form
      :model="addAdminForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="管理员名称" prop="adminName">
        <el-input v-model="addAdminForm.adminName" placeholder="请输入管理员名称"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="addAdminForm.realName" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="addAdminForm.phoneNumber" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="addAdminForm.pass" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="addAdminForm.checkPass" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="state">
        <el-switch v-model="addAdminForm.state"></el-switch>
      </el-form-item>-->
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { AddSysAdminApi } from "../../api/api";
export default {
  props: {
    addAdminVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addAdminForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addAdminForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      addAdminForm: {
        adminName: "",
        realName: "",
        phoneNumber: "",
        state: true,
        pass: "",
        checkPass: ""
      },
      rules: {
        adminName: [
          { required: true, message: "请输入管理员名称", trigger: "blur" }
        ],
        realName: [
          { required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        pass: [{ required: true,validator: validatePass, trigger: "blur" }],
        checkPass: [{ required: true,validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  methods: {
    /* 关闭弹窗 */
    close() {
      this.$emit("getAddAdminVisible", false);
      this.resetForm("ruleForm");
    },
    /* 新增管理员 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          AddSysAdminApi({
            name: this.addAdminForm.adminName,
            realname: this.addAdminForm.realName,
            password: this.addAdminForm.pass,
            mobile: this.addAdminForm.phoneNumber,
            roles: [1]
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "管理员新增成功",
                  type: "success"
                });
                this.$emit("getAddAdminVisible", false);
                this.resetForm("ruleForm");
              }
            })
            .catch();
        } else {
          return false;
        }
      });
    },
    /* 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
</style>