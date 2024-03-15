<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <view class="header-box relative">
    <image src="https://6169-ai-tools-6guwawtsb724a7e7-1254288091.tcb.qcloud.la/images/header-bg.png?sign=39897050b99dd37e0a7341e4b5674872&t=1710475253" mode="aspectFill"></image>
    <text class="absolute title">{{ title }}</text>
  </view>
</template>

<style scoped>
.header-box {
  height: 200rpx;
  box-sizing: border-box;
}

image {
  width: 100%;
}

.title {
  left:50%;
  top: 100rpx;
  transform: translateX(-50%);
  font-size: 32rpx;
  font-weight: 800;
}
</style>