<template>
  <div class="supplierContent">
    <!-- 筛选条件 -->
    <div class="supplierSelect">
      <el-form :inline="true" :model="formSelect">
        <el-form-item label="姓名">
          <el-input v-model="formSelect.personnelName" clearable placeholder="姓名"></el-input>
        </el-form-item>
        <el-form-item label="所属供应商">
          <el-select v-model="formSelect.supplierId" clearable>
            <el-option
              v-for="item in this.$store.getters.getSupplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工作年限">
          <el-input v-model="formSelect.workExperience" clearable placeholder="工作年限"></el-input>
        </el-form-item>
        <el-form-item label="职位级别">
          <el-select v-model="formSelect.level" clearable placeholder="职位等级">
              <el-option label="高" value="1"></el-option>
              <el-option label="中" value="2"></el-option>
              <el-option label="低" value="3"></el-option>
            </el-select>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="formSelect.state">
            <el-option label="启用" value="1"></el-option>
            <el-option label="停用" value="2"></el-option>  
          </el-select>
        </el-form-item>-->
        <el-form-item>
          <el-button class="selectBtn" @click="onSelect">查询</el-button>
          <el-button class="addSupplierInfo" @click="addPresonnel" icon="el-icon-plus">新增人员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增供应商人员弹窗 -->
    <addSupplierPresonnelComponent
      :addPresonnelVisible="addPresonnelVisible"
      @getAddPresonnelVisible="getAddPresonnelVisible"
    ></addSupplierPresonnelComponent>
     <!-- 编辑 -->
    <editSupplierPresonnelComponent
      :editPresonnelVisible="editPresonnelVisible"
      :editData="editData"
      @getAddPresonnelVisible="getAddPresonnelVisible"
    ></editSupplierPresonnelComponent>
    <!-- 表格页面 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="150"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <el-table-column prop="supplier.companyName" label="所属供应商"></el-table-column>
        <el-table-column prop="workExperience" label="工作年限(年)"></el-table-column>
        <el-table-column prop="grade" label="职位等级">
          <template slot-scope="scope">
            <span v-if="scope.row.level == 1">高</span>
            <span v-else-if="scope.row.level == 2">中</span>
            <span v-else>低</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="状态">
          <template slot-scope="scope">
            <div :style="[scope.row.state ? {color:'#ffb400'}:{color:'#999'}]">
              <span v-if="scope.row.state">启用</span>
              <span v-else>停用</span>
            </div>
          </template>
        </el-table-column>-->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class="optionActive">
              <i class="el-icon-edit-outline edit" @click="editRow(scope.row)"></i>
              <el-popconfirm title="确定删除此供应商人员吗？" @onConfirm="deleteRow(scope.row)">
                <i class="el-icon-delete delete" slot="reference"></i>
              </el-popconfirm>
              <!-- <el-switch v-model="scope.row.state" active-color="#329e82"></el-switch> -->
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import axios from 'axios';
import addSupplierPresonnelComponent from "./addPresonnel";
import editSupplierPresonnelComponent from './editPresonnel';
import { SupplierOperatorListApi } from "../../api/api";
export default {
  data() {
    return {
      formSelect: {
        personnelName: "",
        level: "",
        supplierId: "",
        workExperience: ""
      },
      editData:[],
      tableData: [
        {
          userName: "李四",
          phone: "110110110110",
          password: "**********",
          state: true,
          supplier: "第一供应商",
          years: 15,
          grade: "高"
        },
        {
          userName: "李四",
          phone: "110110110110",
          password: "**********",
          state: false,
          supplier: "第一供应商",
          years: 2,
          grade: "低"
        },
        {
          userName: "李四",
          phone: "110110110110",
          password: "**********",
          state: true,
          supplier: "第一供应商",
          years: 5,
          grade: "低"
        },
        {
          userName: "李四",
          phone: "110110110110",
          password: "**********",
          state: false,
          supplier: "第一供应商",
          years: 1,
          grade: "中"
        }
      ],
      total: null,
      pageSize: 10,
      pageNo: 1,
      addPresonnelVisible: false, //新增供应商人员弹窗状态
      editPresonnelVisible: false //编辑供应商人员弹窗状态
    };
  },
  components: {
    addSupplierPresonnelComponent,
    editSupplierPresonnelComponent
  },
  methods: {
    /* 获取供应商人员列表 */
    getList(params) {
      SupplierOperatorListApi({
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
    onSelect() {
      this.pageNo = 1
      let params = {
        supplierId:this.formSelect.supplierId,
        workExperience:this.formSelect.years,
        name:this.formSelect.personnelName,
        level:this.formSelect.level
      }
      this.getList(params)
    },
    /* 分页 */
    handleCurrentChange(val) {
      this.pageNo = val;
      let params = {
        supplierId:this.formSelect.supplierId,
        workExperience:this.formSelect.years,
        name:this.formSelect.personnelName,
        level:this.formSelect.level
      }
      this.getList(params)
    },
    /* 新增供应商人员 */
    addPresonnel() {
      this.addPresonnelVisible = true;
    },
    /* 获取子组件传来的值 */
    getAddPresonnelVisible(v) {
      this.addPresonnelVisible = v;
      this.editPresonnelVisible = v
      this.getList();
    },
    /* 编辑行 */
    editRow(item) {
      this.editPresonnelVisible = true
      this.editData = item
    },
    /* 删除 */
    deleteRow(item){
      axios.delete('/api/supplier-operator/'+item.id).then(res=>{
        if(res.data.code == 200){
          this.$notify({
          title: '成功',
          message: '供应商人员'+ item.name +'已被停用',
          type: 'success'
        });
        this.getList();
        }
      }).catch()
    }
  },
  created() {
    this.getList();
  }
};
</script>
<style lang="scss">
.supplierContent {
  padding: 30px 40px;
}
</style>