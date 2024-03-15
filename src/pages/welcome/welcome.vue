<script lang="ts" setup>
import { ref } from 'vue'
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useAttraction } from '@/composables/attraction'

const { attraction } = useAttraction()
const muted = ref(true)

onShareAppMessage(() => ({
  title: 'AI带你游' + attraction.value!.name
}))
</script>

<template>
  <view class="page">
    <template v-if="attraction">
      <swiper :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000">
        <swiper-item v-if="attraction.introduceVideo">
          <video :src="attraction.introduceVideo" :muted="muted" :autoplay="true" :controls="false" object-fit="cover"
            @tap="muted = !muted" :loop="true" :custom-cache="false"></video>
        </swiper-item>
        <swiper-item v-for="item in attraction.introduceImageList" :key="item">
          <image :src="item" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <navigator :url="`/pages/guide/guide?id=${attraction._id}&attractionId=${attraction._id}`">
        <cover-image
          src="https://6169-ai-tools-6guwawtsb724a7e7-1254288091.tcb.qcloud.la/images/guide-main.png?sign=e3591ce0c45a58b6226011bd03801a72&t=1710475272"></cover-image>
      </navigator>
    </template>
  </view>
</template>

<style>
swiper,
swiper-item,
swiper-item video,
swiper-item image {
  width: 100%;
  height: 100%;
}

cover-image {
  position: absolute;
  left: calc(50% - 148rpx);
  bottom: 200rpx;
  width: 296rpx;
  height: 416rpx;
}
</style>