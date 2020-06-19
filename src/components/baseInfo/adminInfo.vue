<template>
  <div class="supplierContent">
    <!-- 筛选条件 -->
    <div class="supplierSelect">
      <el-form :inline="true" :model="formSelect">
        <el-form-item label="管理员名称">
          <el-input v-model="formSelect.userName" clearable placeholder="管理员名称"></el-input>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input v-model="formSelect.realName" clearable placeholder="姓名"></el-input>
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
          <el-button class="addSupplierInfo" @click="addAdminBtn" icon="el-icon-plus">新增管理员</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 新增管理员弹窗 -->
    <addAdmin
      :addAdminVisible="addAdminVisible"
      @getAddAdminVisible="getAddAdminVisible"
    ></addAdmin>
    <!-- 编辑 -->
    <editAdmin
      :editAdminVisible="editAdminVisible"
      :editData="editData"
      @getAddAdminVisible="getAddAdminVisible"
    ></editAdmin>
    <!-- 表格页面 -->
    <div class="tableContent">
      <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="管理员名称"></el-table-column>
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="联系方式"></el-table-column>
        <!-- <el-table-column label="权限">
          <template slot-scope="scope">
            <span v-for="(item,index) in scope.row.roles" :key="index">{{item.name}}</span>
          </template>
        </el-table-column> -->
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
              <!-- <i class="el-icon-delete delete" @click="changeStatus(scope.row)"></i> -->
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
import addAdmin from "./addAdmin";
import editAdmin from './editAdmin'
import { AdminListApi } from "../../api/api";
export default {
  data() {
    return {
      formSelect: {
        userName: "",
        realName:"",
        phone: "",
        state: ""
      },
      tableData: [],
      total: null,
      pageSize: 10,
      pageNo: 1,
      addAdminVisible: false ,//新增管理员弹窗状态
      editAdminVisible:false,//编辑管理员弹窗状态
      editData:[],//编辑的数据
    };
  },
  components: {
    addAdmin,
    editAdmin
  },
  methods: {
    /* 获取列表 */
    getList(params) {
      AdminListApi({
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
        contact:this.formSelect.phone,
        realname:this.formSelect.realName
      }
      this.getList(params)
    },
    /* 分页 */
    handleCurrentChange(val) {
      this.pageNo = val;
      let params = {
        name:this.formSelect.userName,
        contact:this.formSelect.phone,
        realname:this.formSelect.realName
      }
      this.getList(params)
    },
    /* 新增供应商 */
    addAdminBtn() {
      this.addAdminVisible = true;
    },
    /* 获取子组件传来的值 */
    getAddAdminVisible(v) {
      if(!v){
        this.getList()
      }
      this.addAdminVisible = v;
      this.editAdminVisible = v;
    },
    /* 启用/停用 */
    changeStatus(item) {
      axios.delete('/api/supplier/'+item.id).then(res=>{
        if(res.data.code == 200){
          this.$notify({
          title: '成功',
          message: '供应商'+ item.companyName +'已被停用',
          type: 'success'
        });
        this.getList();
        }
      }).catch()
    },
    /* 编辑 */
    editRow(item){
      this.editData = item
      this.editAdminVisible = true
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