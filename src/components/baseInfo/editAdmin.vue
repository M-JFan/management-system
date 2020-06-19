<template>
  <el-dialog
    title="编辑管理员"
    :visible.sync="editAdminVisible"
    width="600px"
    :destroy-on-close="true"
    :before-close="close"
  >
    <el-form
      :model="editAdminForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="管理员名称" prop="adminName">
        <el-input v-model="editAdminForm.adminName" placeholder="请输入管理员名称"></el-input>
      </el-form-item>
      <el-form-item label="姓名" prop="realName">
        <el-input v-model="editAdminForm.realName" placeholder="请输入真实姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="editAdminForm.phoneNumber" placeholder="请输入联系电话"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="state">
        <el-switch v-model="editAdminForm.state"></el-switch>
      </el-form-item>-->
      <p>他人登录密码此账号没有权限修改！</p>
      <p style="margin-bottom:22px">如需修改自身密码，请在网页头部的右边，将鼠标移入名称，点击‘修改密码’即可</p>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">编辑</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from "axios";
export default {
  props: {
    editAdminVisible: {
      type: Boolean,
      required: true
    },
    editData: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {
      info: null,
      id: "",
      editAdminForm: {
        adminName: "",
        realName: "",
        phoneNumber: "",
        state: true,
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
        ]
      }
    };
  },
  watch: {
    editData: function(newVal) {
      this.info = newVal;
      newVal && this.getInfo();
    }
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
          let params = {
            name: this.editAdminForm.adminName,
            realname: this.editAdminForm.realName,
            mobile: this.editAdminForm.phoneNumber
          };
          axios
            .put("/api/sys-admin/" + this.id, params)
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "管理员编辑成功",
                  type: "success"
                });
                this.resetForm("ruleForm");
                this.$emit("getAddAdminVisible", false);
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
    },
    /* 重新赋值 */
    getInfo() {
      this.editAdminForm.adminName = this.info.name;
      this.editAdminForm.realName = this.info.realname;
      this.editAdminForm.phoneNumber = this.info.mobile;
      this.id = this.info.id;
    }
  }
};
</script>
<style lang="scss" scoped>
.demo-ruleForm {
  p{
    color: salmon;
    text-align: right;
  }
}
</style>