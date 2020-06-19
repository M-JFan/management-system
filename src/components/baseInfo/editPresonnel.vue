<template>
  <el-dialog
    title="新增供应商人员"
    :visible.sync="editPresonnelVisible"
    width="600px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <el-form :model="editPresonnelForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="人员姓名" prop="name">
        <el-input v-model="editPresonnelForm.name" placeholder="人员姓名"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="editPresonnelForm.phoneNumber" placeholder="联系电话"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="所属供应商" prop="supplier">
            <el-select v-model="editPresonnelForm.supplier" placeholder="所属供应商">
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
            <el-select v-model="editPresonnelForm.grade" placeholder="职位等级">
              <el-option label="高" :value="1"></el-option>
              <el-option label="中" :value="2"></el-option>
              <el-option label="低" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作年限" prop="years">
        <el-input v-model="editPresonnelForm.years" placeholder="工作年限"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">编辑</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { AddSupplierOperatorApi } from "../../api/api";
import axios from 'axios'
export default {
  props: {
    editPresonnelVisible: {
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
      editPresonnelForm: {
        name: "",
        phoneNumber: "",
        address: "",
        supplier: "",
        grade: "",
        pass: "",
        years: "",
        checkPass: ""
      },
      rules: {
        name: [{ required: true, message: "请输入人员姓名", trigger: "blur" }],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        supplier: [
          { required: true, message: "请选择所属供应商", trigger: "change" }
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
      this.$emit("getAddPresonnelVisible", false);
      this.resetForm("ruleForm");
    },
    /* 提交表单 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.put("/api/supplier-operator/"+this.info.id,{
            name: this.editPresonnelForm.name,
            mobile: this.editPresonnelForm.phoneNumber,
            supplierId: this.editPresonnelForm.supplier,
            workExperience: parseInt(this.editPresonnelForm.years),
            level: parseInt(this.editPresonnelForm.grade)
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "供应商人员编辑成功",
                  type: "success"
                });
                this.$emit("getAddPresonnelVisible", false);
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
    },
    getInfo() {
      this.editPresonnelForm.name = this.info.name;
      this.editPresonnelForm.phoneNumber = this.info.mobile;
      this.editPresonnelForm.supplier = this.info.supplier.id;
      this.editPresonnelForm.years = this.info.workExperience;
      this.editPresonnelForm.grade = this.info.level;
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
</style>