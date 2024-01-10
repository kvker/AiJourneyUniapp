<template>
  <view class="header-box flex jcc">
    <text class="title">{{title}}</text>
  </view>
</template>

<script lang="ts">
  export default {
    name: "CommonHeader",
    props: {
      title: {
        type: String,
        required: true,
      }
    },
    setup() {
      return {

      }
    }
  }
</script>

<style scoped>
  .header-box {
    height: 200rpx;
    padding-top: 96rpx;
    box-sizing: border-box;
  }

  .title {
    font-size: 32rpx;
    font-weight: 800;
  }
</style>