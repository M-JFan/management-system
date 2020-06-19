<template>
  <el-dialog
    title="新增供应商人员"
    :visible.sync="addPresonnelVisible"
    width="600px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <el-form
      :model="addPresonnelForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="人员姓名" prop="name">
        <el-input v-model="addPresonnelForm.name" placeholder="人员姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="addPresonnelForm.phoneNumber" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属供应商" prop="supplier">
            <el-select v-model="addPresonnelForm.supplier" placeholder="所属供应商">
              <el-option
                v-for="item in this.$store.getters.getSupplierList"
                :key="item.id"
                :label="item.companyName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="职位等级" prop="grade">
            <el-select v-model="addPresonnelForm.grade" placeholder="职位等级">
              <el-option label="高" value="1"></el-option>
              <el-option label="中" value="2"></el-option>
              <el-option label="低" value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作年限" prop="years">
        <el-input v-model="addPresonnelForm.years" placeholder="工作年限"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input type="password" v-model="addPresonnelForm.pass" placeholder="请输入密码"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="addPresonnelForm.checkPass" placeholder="请输入确认密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { AddSupplierOperatorApi } from "../../api/api";
export default {
  props: {
    addPresonnelVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.addPresonnelForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.addPresonnelForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      addPresonnelForm: {
        name: "",
        phoneNumber: "",
        state: true,
        address: "",
        supplier: "",
        grade: "",
        pass: "",
        years: "",
        checkPass: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入人员姓名", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        supplier: [
          { required: true, message: "请选择所属供应商", trigger: "change" }
        ],
        pass: [
          { required: true, validator: validatePass, trigger: "blur" }
        ],
        checkPass: [
          { required: true, validator: validatePass2, trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /* 关闭弹窗 */
    close() {
      this.$emit("getAddPresonnelVisible", false);
      this.resetForm("ruleForm");
    },
    /* 提交表单 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          AddSupplierOperatorApi({
            name: this.addPresonnelForm.name,
            password: this.addPresonnelForm.pass,
            mobile: this.addPresonnelForm.phoneNumber,
            supplierId: this.addPresonnelForm.supplier,
            workExperience: parseInt(this.addPresonnelForm.years),
            level: parseInt(this.addPresonnelForm.grade)
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "供应商人员新增成功",
                  type: "success"
                });
                this.$emit("getAddPresonnelVisible", false);
                this.resetForm("ruleForm");
              }
            })
            .catch();
          this.$emit("getAddPresonnelVisible", false);
        } else {
          return false;
        }
      });
    },
    /* 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
</style>