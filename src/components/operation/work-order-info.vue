<template>
  <el-dialog
    title="任务单明细"
    :visible.sync="infoVisible"
    width="600px"
    :before-close="close"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <el-form label-position="left" class="demo-table-expand">
      <el-row>
        <el-col :span="12">
          <el-form-item label="任务名称:">
            <span>{{orderInfo.content}}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="任务单状态:">
            <p v-if="orderInfo.status == 1">
              <span style="color:#ffb400">发布</span>
            </p>
            <p v-else-if="orderInfo.status == 2">
              <span style="color:#0033cc">进行中</span>
            </p>
            <p v-else-if="orderInfo.status == 3">
              <span style="color:#00cc00">完成</span>
            </p>
            <p v-else-if="orderInfo.status == 4">
              <span style="color:red">拒绝</span>
            </p>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="接受时间:">
            <span v-if="orderInfo.acceptTime">{{orderInfo.acceptTime}}</span>
            <span v-else>暂未接受</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="完成时间:">
            <span v-if="orderInfo.finishTime">{{orderInfo.finishTime}}</span>
            <span v-else>暂未接受</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="工作反馈:">
        <p>{{orderInfo.report}}</p>
      </el-form-item>
      <el-form-item label="工作图片:">
        <div class="img">
          <el-image
            v-show="orderInfo.pic1 != null"
            style="width: 100px; height: 100px"
            :src="orderInfo.pic1"
          ></el-image>
          <el-image
            v-show="orderInfo.pic2 != null"
            style="width: 100px; height: 100px"
            :src="orderInfo.pic2"
          ></el-image>
          <el-image
            v-show="orderInfo.pic3 != null"
            style="width: 100px; height: 100px"
            :src="orderInfo.pic3"
          ></el-image>
          <!-- <el-image
            style="width: 100px; height: 100px"
            :src="item"
            :preview-src-list="item.split()"
          ></el-image>-->
        </div>
      </el-form-item>
      <el-form-item label="完成视频:">
        <video
          v-show="orderInfo.video"
          class="video"
          :src="orderInfo.video"
          controls="controls"
          style="width: 100%;height: 300px;"
        ></video>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    infoVisible: {
      type: Boolean,
      required: true
    },
    orderInfo: {
      type: [Object, Array],
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    /* 关闭弹窗 */
    close() {
      this.$emit("getWorkOrderInfoVisible", false);
    }
  },
  created() {}
};
</script>
<style lang="scss" scoped>
.img {
  display: inline-block;
  margin-right: 10px;
}
.demo-table-expand label {
  color: #99a9bf;
  font-size: 16px;
}
.demo-table-expand {
  color: #333;
}
.video {
  width: 400px;
}
</style>