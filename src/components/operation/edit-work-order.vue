<template>
  <div class="addWorkOrder">
    <div class="breadcrumb">
      <a @click="$router.back(-1)">返回</a>
      <i class="el-icon-arrow-right"></i>
      <span>编辑任务单</span>
    </div>
    <div class="supplierSelect">
      <el-form
        :inline="true"
        :model="formSelect"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item label="供应商">
          <el-input disabled v-model="formSelect.supplierName"></el-input>
        </el-form-item>
        <el-form-item label="合同名称">
          <el-input disabled v-model="formSelect.contractName"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            type="date"
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
          <el-button class="btn" @click="submitForm('ruleForm')">编辑任务单</el-button>
          <el-button class="selectBtn" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data() {
    return {
      formSelect: {
        startTime: "",
        endTime: "",
        supplierName: "",
        contractName: "",
        type: []
      },
      workOrderData: [],
      ContractList: [],
      typeList: [],
      disabledSelect: false,
      typeArr: [],
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
        startTime: [
          {
            required: true,
            message: "请选择开始时间",
            trigger: "change"
          }
        ],
        endTime: [
          {
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
    /* 根据合同ID带出对应的合同 */
    getContractList(id) {
      this.ContractList = this.$store.getters.getContractList.filter(item => {
        return id == item.id;
      });
      this.typeList =this.ContractList[0].content
    },
    /* 获取子任务 */
    getWork(){
      this.workOrderData.items.forEach(item=>{
        this.typeArr.push(item.content)
      })
      this.formSelect.type = this.typeArr
    },
    /* 提交 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios.put('/api/work-order/'+this.$route.query.workOrderId,{
            from: this.formSelect.startTime,
            to: this.formSelect.endTime,
            content: this.formSelect.type
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "任务单编辑完成",
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
    /* 重置 */
    resetForm(formName) {
      this.formSelect.startTime = this.workOrderData.from
      this.formSelect.endTime = this.workOrderData.to
      this.formSelect.type = this.typeArr
    },
  },
  created() {
    let id = this.$route.query.workOrderId
    axios.get('/api/work-order/'+id).then(res=>{
      this.workOrderData = res.data.data
      this.formSelect.supplierName = this.workOrderData.supplier.companyName
      this.formSelect.contractName = this.workOrderData.contract.name
      this.formSelect.startTime = this.workOrderData.from
      this.formSelect.endTime = this.workOrderData.to
      this.getContractList(this.workOrderData.contract.id)
      this.getWork()
    }).catch()
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