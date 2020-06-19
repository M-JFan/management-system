<template>
  <div class="supplierContent">
    <!-- 筛选条件 -->
    <div class="supplierSelect">
      <el-form
        :inline="true"
        :rules="rules"
        :model="formSelect"
        ref="ruleForm"
        class="demo-form-inline"
      >
        <el-form-item label="关联合同">
          <el-select v-model="formSelect.contract" clearable filterable placeholder="关联合同">
            <el-option
              v-for="item in selectContractList"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="对应供应商">
          <el-select v-model="formSelect.supplier" clearable filterable placeholder="对应供应商">
            <el-option
              v-for="item in this.$store.getters.getSupplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item.companyName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            type="date"
            clearable
            :picker-options="pickerBeginDateBefore"
            v-model="formSelect.startTime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            type="date"
            clearable
            v-model="formSelect.endTime"
            :picker-options="pickerBeginDateAfter"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="selectBtn" @click="onSelect('ruleForm')">查询</el-button>
          <el-button class="addSupplierInfo" @click="addContract" icon="el-icon-plus">新增合同</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格页面 -->
    <div class="tableContent">
      <el-table :data="tableData">
        <el-table-column prop="name" label="合同名称"></el-table-column>
        <el-table-column prop="supplier.companyName" label="供应商名称"></el-table-column>
        <el-table-column prop="serviceCount" label="服务次数"></el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">{{scope.row.from | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">{{scope.row.to | formatDate}}</template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.isExpired" style="color:#329e82">进行中</span>
            <span v-else style="color:#f14f4f">已逾期</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <div class="optionActive">
              <a @click="linkTo(scope.row)">添加任务单</a>
              <i class="el-icon-edit-outline edit" @click="editRow(scope.row.id)"></i>
              <el-popconfirm title="确定删除此合同吗？" @onConfirm="deleteRow(scope.row.id)">
                <i class="el-icon-delete delete" slot="reference"></i>
              </el-popconfirm>

              <!-- <el-switch
                v-model="scope.row.initiate"
                @change="initiateSwitch"
                active-color="#329e82"
              ></el-switch>-->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="pagination" v-show="total>10">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :page-size="pageSize"
        layout="prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { ContractListApi } from "../../api/api";
import axios from "axios";
export default {
  data() {
    return {
      formSelect: {
        startTime: "",
        endTime: "",
        supplier: "",
        contract: ""
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
      tableData: [], //数据列表
      selectContractList: [], //合同列表
      total: null,
      pageSize: 10,
      pageNo: 1,
      infoVisible: false,
      rules: {
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
        ]
      }
    };
  },
  /* 时间转换 */
  filters: {
    formatDate: function(value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d;
    }
  },
  methods: {
    /* 获取列表 */
    getList(params) {
      ContractListApi({
        ...params,
        limit: this.pageSize,
        page: this.pageNo
      })
        .then(res => {
          this.tableData = res.data.data.items;
          this.total = res.data.data.meta.totalItems;
        })
        .catch();
    },
    /* 获取合同列表，并且进行去重 */
    getContractListSplice() {
      ContractListApi()
        .then(res => {
          this.selectContractList = res.data.data.items;
        })
        .catch();
    },
    /* 筛选 */
    onSelect(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            page: 1,
            contractName: this.formSelect.contract,
            supplierName: this.formSelect.supplier,
            from: this.formSelect.startTime,
            to: this.formSelect.endTime
          };
          this.getList(params);
        } else {
          return false;
        }
      });
    },
    /* 分页 */
    handleCurrentChange(val) {
      this.pageNo = val;
      let params = {
        page: 1,
        contractName: this.formSelect.contract,
        supplierName: this.formSelect.supplier,
        from: this.formSelect.startTime,
        to: this.formSelect.endTime
      };
      this.getList(params);
    },
    /* 删除合同 */
    deleteRow(id) {
      axios
        .delete("/api/supplier-contract/" + id)
        .then(res => {
          if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "合同已删除",
              type: "success"
            });
            this.getList();
          }
        })
        .catch();
    },
    /* 编辑行 */
    editRow(id) {
      this.$router.push({
        path: "/edit-contract",
        query: {
          id: id
        }
      });
    },
    /* 跳转到新增任务单页面 */
    linkTo(item) {
      this.$router.push({
        path: "/add-work-order",
        query: {
          supplierId: item.supplier.id
        }
      });
    },
    /* 跳转新增合同页面 */
    addContract() {
      this.$router.push({
        path: "/add-contract"
      });
    }
  },
  created() {
    this.getList();
    this.getContractListSplice();
  }
};
</script>
<style lang="scss" scoped>
.supplierSelect {
  & .el-date-editor.el-input,
  &.el-date-editor.el-input__inner,
  & .el-select {
    width: 182px;
  }
}
.optionActive {
  a {
    color: #409eff;
    margin-right: 20px;
  }
}
</style>