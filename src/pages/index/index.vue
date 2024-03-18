<script lang="ts" setup>
import { ref } from 'vue'
import type { Ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { loading, unloading, } from '@/services/ui'
import { db } from '@/services/cloud'
const _ = db.command

type IndexAttraction = { _id: string, name: string, introduce: string, introduceImageList: string[], location: string, voiceCount: number }

let _page = 0
const _size = 10
const list: Ref<IndexAttraction[]> = ref([])
let noMore = false

onLoad(() => {
  getAttractionList()
})

async function getAttractionList() {
  if (noMore) return
  loading()
  try {
    const { data } = await db.collection('JAttraction')
      .where({
        disabled: _.neq(true),
      })
      .skip(_page * _size)
      .limit(_size)
      .get()
    list.value = [...list.value, ...data as IndexAttraction[]]
    _page++
    if (data.length < _size) {
      noMore = true
    }
  } catch (e) {
    console.error(e)
  } finally {
    unloading()
    isRefreshing.value = false
  }
}

onShareAppMessage(() => ({
  title: '君有迹'
}))

const isRefreshing = ref(false)

function onRefresh() {
  isRefreshing.value = true
  list.value = []
  _page = 0
  noMore = false
  getAttractionList()
}

function onGetMore() {
  getAttractionList()
}
</script>

<template>
  <view class="page">
    <CommonHeader title="君有迹"></CommonHeader>
    <scroll-view :scroll-y="true" :enable-back-to-top="true" :refresher-enabled="true"
      :refresher-triggered="isRefreshing" @refresherrefresh="onRefresh" @scrolltolower="onGetMore">
      <navigator v-for="(item) of list" :key="item._id" class="relative nav-item flex aic jcsb"
        :url="`/pages/welcome/welcome?attractionId=${item._id}`">
        <image class="nav-image" :src="item.introduceImageList[0]" mode="aspectFill"></image>
        <view class="absolute info flex jcsb h-100">
          <image class="avatar" :src="item.introduceImageList[0]" mode="aspectFill"></image>
          <view class="flex-c jcc f1 mx-10">
            <text class="font-bold">{{ item.name }}</text>
            <view class="flex aic sub-info">
              <view class="flex aic voice-count">
                <image class="icon" src="/static/icons/voice.png" mode="aspectFill"></image>
                <text>{{ item.voiceCount }}个</text>
              </view>
              <view class="flex aic f1">
                <image class="icon" src="/static/icons/location.png" mode="aspectFill"></image>
                <text class="overflow2">{{ item.location }}</text>
              </view>
            </view>
          </view>
          <image class="nav-icon" src="/static/icons/nav.png" mode="aspectFill"></image>
        </view>
      </navigator>
    </scroll-view>
  </view>
</template>

<style scoped>
scroll-view {
  position: relative;
  z-index: 1;
  height: calc(100% - 200rpx);
  background-color: white;
  border-top-left-radius: 48rpx;
  border-top-right-radius: 48rpx;
  padding: 32rpx;
}

.nav-item {
  margin-bottom: 32rpx;
}

.nav-image {
  width: 100%;
  height: 480rpx;
  border-radius: 40rpx;
}

.info {
  left: 32rpx;
  bottom: 32rpx;
  width: calc(100% - 64rpx);
  height: 120rpx;
  background-color: white;
  border-radius: 32rpx;
  padding: 20rpx;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
}

.icon {
  width: 24rpx;
  height: 24rpx;
  margin-right: 8rpx;
}

.nav-icon {
  width: 48rpx;
  height: 48rpx;
}

.sub-info {
  color: #999;
  font-size: 24rpx;
  line-height: 24rpx;
  margin-top: 8rpx;
}

.voice-count {
  width: 100rpx;
}
</style>