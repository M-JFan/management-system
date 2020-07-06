<template>
  <div class="LoginTitle">
    <!-- <div class="LogoContent">
      <img src="../assets/logo.png" alt="logo" />
      <div class="Logo">
        <p>中国烟草</p>
        <span>CHINA TOBACCO</span>
      </div>
    </div>
    <div class="Title">上海烟草集团天津卷烟厂</div>-->
    <div class="Title_Black">厂内管理系统</div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.LoginTitle {
  display: flex;
  text-align: center;
  & .LogoContent {
    display: flex;
    img {
      width: 60px;
      height: 60px;
    }
  }
  & .Logo {
    color: #fff;
    margin-left: 10px;
    p {
      font-size: 28px;
      line-height: 38px;
      letter-spacing: 4px;
    }
    span {
      font-size: 14px;
      line-height: 1px;
    }
  }
  & .Title {
    padding-left: 20px;
    margin-left: 20px;
    border-left: 1px #fff dashed;
    color: #fff;
    font-size: 28px;
    margin-top: 13px;
    height: 36px;
    line-height: 32px;
    letter-spacing: 4px;
  }
  & .Title_Black {
    width: 100%;
    text-align: center;
    padding-left: 20px;
    margin-left: 20px;
    color: #fff;
    font-size: 28px;
    margin-top: 13px;
    height: 36px;
    line-height: 32px;
    letter-spacing: 4px;
  }
}
</style>