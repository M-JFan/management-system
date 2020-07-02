<template>
  <div class="supplierContent">
    <!-- 筛选条件 -->
    <div class="supplierSelect">
      <el-form :inline="true" :model="formSelect" class="demo-form-inline">
        <el-form-item label="对应供应商">
          <el-select v-model="formSelect.supplierId" clearable>
            <el-option
              v-for="item in this.$store.getters.getSupplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            type="date"
            clearable
            :picker-options="pickerBeginDateBefore"
            v-model="formSelect.startTime"
            placeholder="开始时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            type="date"
            clearable
            v-model="formSelect.endTime"
            :picker-options="pickerBeginDateAfter"
            placeholder="结束时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="发布人">
          <el-select v-model="formSelect.publisherId" clearable placeholder="发布人">
            <el-option
              v-for="item in adminList"
              :key="item.id"
              :label="item.realname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联合同">
          <el-select v-model="formSelect.contract" clearable placeholder="关联合同">
            <el-option
              v-for="item in this.$store.getters.getContractList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发布状态">
          <el-select v-model="formSelect.state" clearable placeholder="发布状态">
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="selectBtn" @click="onSelect">查询</el-button>
          <el-button class="addSupplierInfo" @click="addWorkOrder" icon="el-icon-plus">新增任务单</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 表格页面 -->
    <div class="tableContent">
      <el-table
        :data="tableData"
        type="index"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="getWorkOrderInfo"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="items" v-for="(item,index) in rowList" :key="index">
              <ul>
                <li>
                  任务名称 :
                  <span>{{item.content}}</span>
                </li>
                <li>
                  任务单状态 :
                  <p v-if="item.status == 1">
                    <span style="color:#ffb400">发布</span>
                  </p>
                  <p v-else-if="item.status == 2">
                    <span style="color:#0033cc">进行中</span>
                  </p>
                  <p v-else-if="item.status == 3">
                    <span style="color:#00cc00">完成</span>
                  </p>
                  <p v-else-if="item.status == 4">
                    <span style="color:red">拒绝</span>
                  </p>
                </li>
                <li>
                  <span class="viewDetails" @click="viewDetail(item)">查看详情</span>
                </li>
              </ul>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="supplier.companyName" label="供应商名称"></el-table-column>
        <el-table-column prop="contract.name" label="合同名称"></el-table-column>
        <el-table-column label="开始时间">
          <template slot-scope="scope">{{scope.row.from | formatDate}}</template>
        </el-table-column>
        <el-table-column label="结束时间">
          <template slot-scope="scope">{{scope.row.to | formatDate}}</template>
        </el-table-column>
        <el-table-column label="状态" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1" style="color:#606266">发布</span>
            <span v-else-if="scope.row.status == 2" style="color:#0033cc">开始</span>
            <span v-else-if="scope.row.status == 3" style="color:#67c23a">部分完成</span>
            <span v-else-if="scope.row.status == 4" style="color:#00cc00">完成</span>
            <span v-else-if="scope.row.status == 5" style="color:#999">取消</span>
            <span v-else style="color:red">关闭</span>
          </template>
        </el-table-column>
        <el-table-column prop="publisher.realname" label="发布人" width="150"></el-table-column>
        <el-table-column prop="operator.name" label="接受人" width="150"></el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class="optionActive" v-if="scope.row.status != 5">
              <i class="el-icon-edit-outline edit" @click="editRow(scope.row)"></i>
              <el-popconfirm title="确定删除此任务单吗？" @onConfirm="deleteRow(scope.row.id)">
                <i class="el-icon-delete delete" slot="reference"></i>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 任务单明细 -->
    <WorkOrderInfo
      :infoVisible="infoVisible"
      :orderInfo="orderInfo"
      @getWorkOrderInfoVisible="getWorkOrderInfoVisible"
    ></WorkOrderInfo>
    <!-- 分页 -->
    <div class="pagination" v-show="total > 10">
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
import axios from "axios";
import WorkOrderInfo from "./work-order-info";
import { WorkOderListApi, AdminListApi } from "../../api/api";
export default {
  data() {
    return {
      expands: [],
      getRowKeys(row) {
        return row.id;
      },
      formSelect: {
        startTime: null,
        endTime: null,
        promulgator: "",
        supplierId: "",
        contract: "",
        state: ""
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
      adminList: [],
      tableData: [],
      rowList: [],
      total: null,
      pageSize: 10,
      pageNo: 1,
      infoVisible: false,
      orderInfo: {},
      stateList: [
        {
          name: "发布",
          value: "1"
        },
        {
          name: "开始",
          value: "2"
        },
        {
          name: "部分完成",
          value: "3"
        },
        {
          name: "完成",
          value: "4"
        },
        {
          name: "取消",
          value: "5"
        }
      ]
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
  components: {
    WorkOrderInfo
  },
  methods: {
    /* 获取任务单列表 */
    getList(params) {
      WorkOderListApi({
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
    /* 获取单个任务单详情 */
    getWorkOrderInfo(row, list) {
      var that = this;
      if (list.length) {
        that.expands = [];
        if (row) {
          that.expands.push(row.id);
        }
        axios
          .get("/api/work-order/" + row.id)
          .then(res => {
            this.rowList = res.data.data.items;
          })
          .catch();
      } else {
        that.expands = [];
      }
    },
    /* 搜索 */
    onSelect() {
      let params = {
        supplierId: this.formSelect.supplierId,
        contractId: this.formSelect.contract,
        publisherId: this.formSelect.publisherId,
        from: this.formSelect.startTime,
        to: this.formSelect.endTime,
        status: this.formSelect.state
      };
      this.getList(params);
    },
    /* 获取管理员列表 */
    getAdminList() {
      AdminListApi()
        .then(res => {
          this.adminList = res.data.data.items;
        })
        .catch();
    },
    /* 分页 */
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getList();
    },
    /* 编辑行 */
    editRow(item) {
      this.$router.push({
        path: "/edit-work-order",
        query: {
          workOrderId: item.id
        }
      });
    },
    /* 查看详情 */
    viewDetail(item) {
      this.infoVisible = true;
      this.orderInfo = item;
    },
    /* 获取子组件传来的visible的值 */
    getWorkOrderInfoVisible(v) {
      this.infoVisible = v;
    },
    /* 跳转到新增任务单页面 */
    addWorkOrder() {
      this.$router.push({
        path: "/add-work-order"
      });
    },
    /* 删除任务单 */
    deleteRow(id){
      axios
          .post("/api/work-order/"+ id +"/cancel")
          .then(res => {
            if (res.data.code == 200) {
            this.$notify({
              title: "成功",
              message: "任务单已删除",
              type: "success"
            });
            this.getList();
          }
          })
          .catch();
    }
  },
  created() {
    if (this.$route.params.state) {
      this.formSelect.state = this.$route.params.state.toString();
      let params = {
        status: this.formSelect.state
      };
      this.getList(params);
    } else {
      this.getList();
    }
    this.getAdminList();
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
.tableContent {
  & .items {
    padding-bottom: 15px;
    &:last-child {
      padding-bottom: 0;
    }
  }
  li {
    display: inline-block;
    margin-right: 30px;
    color: #999;
    font-size: 15px;
    p {
      display: inline-block;
    }
    span {
      color: #333;
    }
  }
  & .viewDetails {
    color: #009cff;
    cursor: pointer;
  }
}
</style>