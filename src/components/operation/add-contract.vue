<template>
  <div class="addContract">
    <div class="breadcrumb">
      <a @click="$router.back(-1)">返回</a>
      <i class="el-icon-arrow-right"></i>
      <span>新增合同</span>
    </div>
    <div class="supplierSelect">
      <el-form
        :inline="true"
        :model="formSelect"
        :rules="rules"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <!-- <el-form-item label="合同名称" prop="contract">
          <el-select v-model="formSelect.contract" placeholder="合同名称">
            <el-option label="第一合同" value="1"></el-option>
            <el-option label="第二合同" value="2"></el-option>
            <el-option label="第三合同" value="3"></el-option>
            <el-option label="第四合同" value="4"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="合同名称" prop="contract">
          <el-input v-model="formSelect.contract" placeholder="合同名称"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supplier">
          <el-select v-model="formSelect.supplier" placeholder="供应商">
            <el-option
              v-for="item in this.$store.getters.getSupplierList"
              :key="item.id"
              :label="item.companyName"
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
            placeholder="合同开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            type="date"
            value-format="timestamp"
            v-model="formSelect.endTime"
            :picker-options="pickerBeginDateAfter"
            placeholder="合同结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="服务次数" prop="number">
          <el-input v-model="formSelect.number" type="number" placeholder="服务次数"></el-input>
        </el-form-item>
        <!-- <div class="contractDesc">
          <el-form-item label="合同简介" prop="desc">
            <el-input type="textarea" rows="4" v-model="formSelect.desc" placeholder="合同简介"></el-input>
          </el-form-item>
        </div>-->
        <div>
          <el-form-item label="合同附件" prop="fileList">
            <el-upload
              class="upload-demo"
              action
              :headers="headers"
              :on-remove="handleRemove"
              :http-request="upload"
              :file-list="formSelect.fileList"
              :limit="1"
              :before-remove="beforeRemove"
              accept=".doc, .docx, .xlsx, .xls, .pdf"
            >
              <el-button class="btn" size="small">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传.doc,.docx,.xlsx,.xls,.pdf文件</div>
            </el-upload>
          </el-form-item>
        </div>
        <div class="typeContent">
          <el-form-item label="服务内容">
            <span @click="addType" class="addType">
              <i class="el-icon-plus"></i> 新增任务
            </span>
            <div class="itemType">
              <el-form-item
                v-for="(item, index) in formSelect.type"
                :label="'任务' + parseInt(index+1)"
                :key="index"
                :prop="'type.' + index + '.value'"
                :rules="{
                required: true, message: '任务不能为空', trigger: 'blur'
              }"
              >
                <el-input v-model="item.value"></el-input>
                <i class="el-icon-close delete" @click.prevent="removeType(item)"></i>
              </el-form-item>
            </div>
          </el-form-item>
        </div>
        <el-form-item>
          <el-button class="btn" @click="submitForm('ruleForm')">保存</el-button>
          <el-button class="selectBtn" @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import { AddContractApi } from "../../api/api";
export default {
  data() {
    return {
      formSelect: {
        startTime: "",
        endTime: "",
        supplier: "",
        contract: "",
        number: null,
        desc: "",
        fileList: [],
        type: [
          {
            value: ""
          }
        ]
      },
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
        number: [
          { required: true, message: "请选择合同次数", trigger: "blur" }
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
        fileList: [
          {
            type: "array",
            required: true,
            message: "请上传合同附件",
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
  computed: {
    headers() {
      return {
        "Content-Type": "multipart/form-data"
      };
    }
  },
  methods: {
    handleRemove(file, fileList) {
      this.formSelect.fileList = fileList;
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    upload(res) {
      let params = new FormData();
      let files = [],
        obj = {};
      params.append("file", res.file);
      axios
        .post("/api/attachment/upload", params, {
          header: { "Content-Type": "multipart/form-data" }
        })
        .then(response => {
          this.formSelect.fileList.push({
            name: res.file.name,
            url: response.data.data.url
          });
        })
        .catch();
    },
    /* 新增行 */
    addType() {
      this.formSelect.type.push({
        value: ""
      });
    },
    /* 删除行 */
    removeType(item) {
      var index = this.formSelect.type.indexOf(item);
      if (index !== -1) {
        this.formSelect.type.splice(index, 1);
      }
    },
    /* 提交表单 */
    submitForm(formName) {
      let arr = [];
      this.formSelect.type.forEach(item => {
        item.value = item.value.replace(/[,]/g, "，");
        arr.push(item.value);
      });
      this.$refs[formName].validate(valid => {
        if (valid) {
          AddContractApi({
            name: this.formSelect.contract,
            from: this.formSelect.startTime,
            to: this.formSelect.endTime,
            supplierId: this.formSelect.supplier,
            attachment: JSON.stringify(this.formSelect.fileList),
            content: arr,
            serviceCount: parseInt(this.formSelect.number)
          })
            .then(res => {
              if (res.data.code == 200) {
                this.$notify({
                  title: "成功",
                  message: "合同新增完成",
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
    /* 重置表单 */
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  created() {
    // console.log(this.$route.query.id);
  }
};
</script>
<style lang="scss" scoped>
.btn {
  background: #329e82;
  color: #fff;
  &:hover {
    opacity: 0.7;
  }
}
.contractDesc /deep/ {
  & .el-form-item {
    width: 90%;
  }
  & .el-form-item__content {
    width: 80%;
  }
}
.typeContent {
  & .addType {
    cursor: pointer;
    color: #329e82;
    padding: 5px 12px;
    border: 1px solid #329e82;
    text-align: center;
  }
}
.itemType /deep/ {
  margin-top: 20px;
  & .el-form-item__content {
    width: 580px;
    & .el-input {
      width: 400px;
    }
  }
  & .el-form-item {
    display: block;
    margin-bottom: 22px;
  }
  & .delete {
    font-size: 20px;
    color: #ef7373;
    cursor: pointer;
    margin-left: 10px;
  }
}
.el-upload__tip {
  display: inline-block;
  margin-left: 20px;
  color: #e65959;
}
</style>