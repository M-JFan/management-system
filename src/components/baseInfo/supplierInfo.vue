<template>
  <div class="supplierContent">
    <!-- 筛选条件 -->
    <div class="supplierSelect">
      <el-form :inline="true" :model="formSelect">
        <el-form-item label="供应商">
          <el-input v-model="formSelect.userName" clearable placeholder="供应商"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="formSelect.phone" clearable placeholder="联系方式"></el-input>
        </el-form-item>
        <!-- <el-form-item label="状态">
          <el-select v-model="formSelect.state">
            <el-option label="已启用" value="1"></el-option>
            <el-option label="已停用" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item>
          <el-button class="selectBtn" @click="onSubmit">查询</el-button>
          <el-button class="addSupplierInfo" @click="addSupplier" icon="el-icon-plus">新增供应商</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增供应商弹窗 -->
    <addSupplierComponent
      :addSupplierVisible="addSupplierVisible"
      @getAddSupplierVisible="getAddSupplierVisible"
    ></addSupplierComponent>
    <!-- 编辑 -->
    <editSupplierComponent
      :editSupplierVisible="editSupplierVisible"
      :editData="editData"
      @getAddSupplierVisible="getAddSupplierVisible"
    ></editSupplierComponent>
    <!-- 表格页面 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="companyName" label="供应商"></el-table-column>
        <el-table-column prop="contact" label="联系方式"></el-table-column>
        <el-table-column prop="companyAddress" label="地址"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 1">已启用</span>
            <span v-else>已停用</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class="optionActive">
              <i class="el-icon-edit-outline edit" @click="editRow(scope.row)"></i>
              <el-popconfirm title="确定删除此供应商吗？" @onConfirm="deleteRow(scope.row)">
                <i class="el-icon-delete delete" slot="reference"></i>
              </el-popconfirm>
              <!-- <el-switch
                :active-value="1"
                :inactive-value="2"
                v-model="scope.row.status"
                @change="changeStatus(scope.row)"
                active-color="#329e82"
              ></el-switch> -->
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
        layout="total,prev, pager, next"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import addSupplierComponent from "./addSupplier";
import editSupplierComponent from './editSupplier'
import { SupplierListApi } from "../../api/api";
export default {
  data() {
    return {
      formSelect: {
        userName: "",
        phone: "",
        state: ""
      },
      tableData: [],
      total: null,
      pageSize: 10,
      pageNo: 1,
      addSupplierVisible: false ,//新增供应商弹窗状态
      editSupplierVisible:false,//编辑供应商弹窗状态
      editData:[],//编辑的数据
    };
  },
  components: {
    addSupplierComponent,
    editSupplierComponent
  },
  methods: {
    /* 获取供应商列表 */
    getSupplierList(params) {
      SupplierListApi({
        ...params,
        limit: this.pageSize,
        page:this.pageNo
      })
        .then(res => {
          this.tableData = res.data.data.items;
          this.total = res.data.data.meta.totalItems
        })
        .catch();
    },
    /* 查询 */
    onSubmit() {
      this.pageNo = 1
      let params = {
        name:this.formSelect.userName,
        contact:this.formSelect.phone
      }
      this.getSupplierList(params)
    },
    /* 分页 */
    handleCurrentChange(val) {
      this.pageNo = val;
      let params = {
        name:this.formSelect.userName,
        contact:this.formSelect.phone
      }
      this.getSupplierList(params)
    },
    /* 新增供应商 */
    addSupplier() {
      this.addSupplierVisible = true;
    },
    /* 获取子组件传来的值 */
    getAddSupplierVisible(v) {
      if(!v){
        this.getSupplierList()
      }
      this.addSupplierVisible = v;
      this.editSupplierVisible = v;
    },
    /* 启用/停用 */
    deleteRow(item) {
      axios.delete('/api/supplier/'+item.id).then(res=>{
        if(res.data.code == 200){
          this.$notify({
          title: '成功',
          message: '供应商'+ item.companyName +'已被停用',
          type: 'success'
        });
        this.getSupplierList();
        }
      }).catch()
    },
    /* 编辑 */
    editRow(item){
      this.editData = item
      this.editSupplierVisible = true
    }
  },
  created() {
    this.getSupplierList();
  }
};
</script>
<style lang="scss">
.supplierContent {
  padding: 30px 40px;
}
</style>