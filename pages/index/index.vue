<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onShareAppMessage, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
  import { loading, unloading, } from '@/services/ui'
  import { db } from '@/services/cloud'

  type IndexAttraction = { _id : string, name : string, introduce : string, introduceImageList : string[] }

  let _page = 0
  const _size = 10
  const list : Ref<IndexAttraction[]> = ref([])

  onLoad(() => {
    getAttractionList()
  })

  async function getAttractionList() {
    loading()
    try {
      const { data } = await db.collection('JAttraction')
        .skip(_page * _size)
        .limit(_size)
        .get()
      list.value = [...list.value, ...data as IndexAttraction[]]
      _page++
    } catch (e) {
      console.error(e)
    } finally {
      unloading()
      uni.stopPullDownRefresh()
    }
  }

  onShareAppMessage(() => ({
    title: '君有迹'
  }))

  onPullDownRefresh(() => {
    list.value = []
    _page = 0
    getAttractionList()
  })

  onReachBottom(() => {
    getAttractionList()
  })
</script>

<template>
  <view class="page">
    <CommonHeader title="君有迹"></CommonHeader>
    <navigator v-for="(item) of list" :key="item._id" class="nav-item flex aic jcsb p-10"
      :url="`/pages/welcome/welcome?attractionId=${item._id}`">
      <image class="nav-image" :src="item.introduceImageList[0] + '?imageView2/2/h/200'" mode="aspectFill"></image>
      <view class="info flex-c jcsa h-100">
        <text class="font-bold">{{item.name}}</text>
        <view class="overflow">
          {{item.introduce}}
        </view>
      </view>
    </navigator>
  </view>
</template>

<style scoped>
  .nav-item {
    height: 100px;
  }

  .nav-image {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .info {
    width: calc(100% - 100px);
  }
</style>