<template>
  <div class="addWorkOrder">
    <div class="breadcrumb">
      <a @click="$router.back(-1)">返回</a>
      <i class="el-icon-arrow-right"></i>
      <span>新增任务单</span>
    </div>
    <div class="supplierSelect">
      <el-form
        :inline="true"
        :model="formSelect"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item label="供应商" v-if="disabledSelect">
          <el-input disabled v-model="supplierName"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier" v-else>
          <el-select v-model="formSelect.supplier" placeholder="供应商" @change="getContractList">
            <el-option
              v-for="item in this.$store.getters.getSupplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同名称" prop="contract">
          <el-select v-model="formSelect.contract" placeholder="合同名称" @change="changeContract">
            <el-option
              v-for="item in this.ContractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            type="date"
            value-format="timestamp"
            :picker-options="pickerBeginDateBefore"
            v-model="formSelect.startTime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            type="date"
            v-model="formSelect.endTime"
            :picker-options="pickerBeginDateAfter"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <div class="checkboxContent">
          <el-form-item label="选择任务" prop="type">
            <el-checkbox-group v-model="formSelect.type">
              <el-checkbox v-for="(item,index) in typeList" :key="index" :label="item" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="btn" @click="submitForm('ruleForm')">生成任务单</el-button>
          <el-button class="selectBtn" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { AddWorkOderApi } from "../../api/api";
export default {
  data() {
    return {
      formSelect: {
        startTime: "",
        endTime: "",
        supplier: "",
        contract: "",
        type: []
      },
      supplierName: "",
      ContractList: [],
      typeList: [],
      disabledSelect: false,
      pickerBeginDateBefore: {
        disabledDate: time => {
          let beginDateVal = this.formSelect.endTime;
          if (beginDateVal) {
            return time.getTime() >= beginDateVal;
          }
        }
      },
      pickerBeginDateAfter: {
        disabledDate: time => {
          let beginDateVal = this.formSelect.startTime;
          if (beginDateVal) {
            return time.getTime() <= beginDateVal;
          }
        }
      },
      rules: {
        supplier: [
          { required: true, message: "请选择对应的供应商", trigger: "change" }
        ],
        contract: [
          { required: true, message: "请选择对应的合同", trigger: "change" }
        ],
        startTime: [
          {
            type: "date",
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
            type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        type: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个任务性质",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    /* 根据供应商带出合同列表 */
    getContractList(id) {
      this.ContractList = this.$store.getters.getContractList.filter(item => {
        return id == item.supplier.id;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          AddWorkOderApi({
            supplierId: this.formSelect.supplier,
            contractId: this.formSelect.contract,
            from: this.formSelect.startTime,
            to: this.formSelect.endTime,
            content: this.formSelect.type
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "任务单新增完成",
                  type: "success"
                });
                this.$router.back(-1);
              }
            })
            .catch();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    /* 修改合同，带出任务 */
    changeContract(id) {
      let obj = {};
      obj = this.$store.getters.getContractList.filter(item => {
        return item.id == id;
      });
      this.typeList = obj[0].content;
    }
  },
  created() {
    let id = this.$route.query.supplierId
    if (id) {
      this.disabledSelect = true;
      setTimeout(() => {
        let arr = this.$store.getters.getSupplierList.filter(item=>{
          return id == item.id
        })
        this.supplierName = arr[0].companyName
        this.formSelect.supplier = id;
        this.getContractList(id);
      }, 500);
    }
  }
};
</script>
<style lang="scss" scoped>
.checkboxContent /deep/ {
  margin: 30px 0;
  & .el-checkbox {
    display: block;
  }
  & .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #329e82;
  }
  & .el-checkbox__input.is-checked .el-checkbox__inner,
  .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #329e82;
    border-color: #329e82;
  }
}
.btn {
  background: #329e82;
  color: #fff;
  &:hover {
    opacity: 0.7;
  }
}
</style>