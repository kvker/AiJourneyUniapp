<template>
  <view class="page">
    <template v-if="detail">
      <swiper :indicator-dots="false" :autoplay="false" :interval="3000" :duration="1000">
        <swiper-item v-if="detail.introduceVideo">
          <video :src="detail.introduceVideo" :muted="muted" :autoplay="true" :controls="false" object-fit="cover"
            @tap="muted = !muted" :loop="true"></video>
        </swiper-item>
        <swiper-item v-for="item in detail.introduceImageList" :key="item">
          <image :src="item" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <navigator :url="`/pages/guide/guide?id=${detail.objectId}`">
        <cover-image src="../../static/images/guide-main.png"></cover-image>
      </navigator>
    </template>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  type WelcomeAttraction = { objectId : string, name : string, introduceImageList : string[], introduceVideo : string, } | null

  let id = ''
  const detail : Ref<WelcomeAttraction> = ref(null)
  const muted = ref(true)

  onLoad((query) => {
    if (query) {
      id = query.id
      doGetDetail()
    } else {
      alert('请准确扫码进入')
    }
  })

  onShareAppMessage(() => ({
    title: 'AI带你游' + detail.value!.name
  }))

  async function doGetDetail() {
    loading()
    detail.value = await lc.one('Attraction', q => {
      q.equalTo('objectId', id)
    }).then(ret => ret.toJSON())
    unloading()
  }
</script>

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