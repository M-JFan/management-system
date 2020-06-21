<template>
  <el-dialog
    title="编辑供应商"
    :visible.sync="editSupplierVisible"
    width="600px"
    :destroy-on-close="true"
    :before-close="close"
  >
    <el-form
      :model="editSupplierForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="供应商名称" prop="supplierName">
        <el-input v-model="editSupplierForm.supplierName"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phoneNumber">
        <el-input v-model="editSupplierForm.phoneNumber"></el-input>
      </el-form-item>
      <!-- <el-form-item label="状态" prop="state">
        <el-switch v-model="editSupplierForm.state"></el-switch>
      </el-form-item>-->
      <el-form-item label="公司地址" prop="address">
        <el-input type="textarea" v-model="editSupplierForm.address"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">编辑</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import axios from 'axios';
import {SupplierListApi} from '../../api/api'
export default {
  props: {
    editSupplierVisible: {
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
      spplierId:'',
      editSupplierForm: {
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
  watch: {
    editData: function(newVal) {
      this.info = newVal;
      newVal && this.getInfo();
    }
  },
  methods: {
    /* 关闭弹窗 */
    close() {
      this.$emit("getAddSupplierVisible", false);
      this.resetForm("ruleForm");
    },
    /* 新增供应商 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.put('/api/supplier/'+this.spplierId,{
            name:this.editSupplierForm.supplierName,
            address:this.editSupplierForm.address,
            contact:this.editSupplierForm.phoneNumber
          }).then(res=>{
            if(res.data.code == 200) {
              this.$notify({
                title: '成功',
                message: '供应商:'+this.editSupplierForm.supplierName+'编辑成功',
                type: 'success'
              });
            SupplierListApi().then(res=>{
              this.$store.commit('setSupplierList',res.data.data.items)
            }).catch()
            this.$emit("getAddSupplierVisible", false);
            this.resetForm('ruleForm')
            }
          })
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
      this.editSupplierForm.supplierName = this.info.companyName;
      this.editSupplierForm.phoneNumber = this.info.contact;
      this.editSupplierForm.address = this.info.companyAddress;
      this.spplierId = this.info.id
    }
  }
};
</script>
<style lang="scss" scoped>
</style>