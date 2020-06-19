<template>
  <el-dialog
    title="新增供应商"
    :visible.sync="addSupplierVisible"
    width="600px"
    :destroy-on-close="true"
    :before-close="close"
  >
    <el-form
      :model="addSupplierForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="addSupplierForm.supplierName" placeholder="供应商名称"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="addSupplierForm.phoneNumber" placeholder="联系电话"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="state">
        <el-switch v-model="addSupplierForm.state"></el-switch>
      </el-form-item> -->
      <el-form-item label="公司地址" prop="address">
        <el-input type="textarea" v-model="addSupplierForm.address" placeholder="公司地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">新增</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { AddSupplierApi } from "../../api/api";
export default {
  props: {
    addSupplierVisible: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      addSupplierForm: {
        supplierName: "",
        phoneNumber: "",
        state: true,
        address: ""
      },
      rules: {
        supplierName: [
          { required: true, message: "请输入供应商名称", trigger: "blur" }
        ],
        phoneNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入公司地址", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    /* 关闭弹窗 */
    close() {
      this.$emit("getAddSupplierVisible", false);
      this.resetForm('ruleForm')
    },
    /* 新增供应商 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          AddSupplierApi({
            name:this.addSupplierForm.supplierName,
            address:this.addSupplierForm.address,
            contact:this.addSupplierForm.phoneNumber
          }).then(res=>{
            if(res.data.code == 200) {
              this.$notify({
                title: '成功',
                message: '供应商新增成功',
                type: 'success'
              });
            this.$emit("getAddSupplierVisible", false);
            this.resetForm('ruleForm')
            }
          }).catch()
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