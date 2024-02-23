<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onShareAppMessage, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
  import lc from '@/services/lc'
  import { loading, unloading, } from '@/services/ui'

  type IndexAttraction = { objectId : string, name : string, introduce : string, introduceImageList : string[] }

  let _page = 0
  const _size = 10
  const list : Ref<IndexAttraction[]> = ref([])

  onLoad(() => {
    getAttractionList()
  })

  function getAttractionList() {
    lc.continueWithUser(async () => {
      loading()
      try {
        const ret = await lc.read('Attraction', (q : AV.Query<AV.Object>) => {
          q.descending('createdAt')
          q.limit(_size)
          q.skip(_page * _size)
          q.select(['name', 'introduceImageList', 'introduce'])
        })
        list.value = [...list.value, ...ret.map(i => i.toJSON())]
        _page++
        uni.stopPullDownRefresh()
      } catch (e) {
        console.error(e)
      }
      unloading()
    })
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
    <navigator v-for="(item) of list" :key="item.objectId" class="nav-item flex aic jcsb p-10"
      :url="`/pages/welcome/welcome?attractionId=${item.objectId}`">
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
  
  .info  {
    width: calc(100% - 100px);
  }
</style>