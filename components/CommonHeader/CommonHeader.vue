<script lang="ts" setup>
defineProps({
  title: {
    type: String,
    required: true,
  }
})
</script>

<template>
  <view class="header-box flex jcc">
    <text class="title">{{ title }}</text>
  </view>
</template>

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