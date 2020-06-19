<template>
  <div class="MenuContent">
    <el-menu
      :default-active="$route.path"
      background-color="#fff"
      text-color="#333"
      active-text-color ='#329e82'
      :default-openeds="['1','2']"
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>基本信息维护</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/adminInfo">管理员信息</el-menu-item>
          <el-menu-item index="/supplierInfo">供应商信息</el-menu-item>
          <el-menu-item index="/supplier-personnel">供应商人员管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-document-copy"></i>
          <span slot="title">业务模块</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/contract-management">合同管理</el-menu-item>
          <el-menu-item index="/work-order">任务单</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  methods: {}
};
</script>
<style lang="scss" scoped>
.MenuContent /deep/ {
  & .el-menu{
    border-right: none;
  }
  & .el-menu-item-group{
    box-shadow:inset 0px 15px 15px -15px #e4e4e4,
             inset 0px -15px 15px -15px #e4e4e4;
    padding-bottom: 15px;
  }
  & .el-submenu .el-menu-item,
  & .el-submenu__title {
    &:hover {
      background-color: #fff !important;
      color: #329e82 !important;
    }
  }
  & .el-submenu__title {
    font-size: 16px;
  }
  & .el-submenu:last-child{
    & .el-menu-item-group{
      box-shadow:inset 0px 15px 15px -15px #e4e4e4
    }
  }
  & .el-menu-item.is-active{
    background: none!important;
  }
}
</style>