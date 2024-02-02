<template>
  <view class="page">
    <CommonHeader title="AI导游大师"></CommonHeader>
    <navigator v-for="(item) of list" :key="item.objectId" class="nav-item flex aic jcsb p-10"
      :url="`/pages/welcome/welcome?id=${item.objectId}`">
      <image class="nav-image" :src="item.introduceImageList[0]" mode="aspectFill"></image>
      <text>{{item.name}}</text>
    </navigator>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onShareAppMessage, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { loading, unloading, } from '@/services/ui'

  type IndexAttraction = { objectId : string, name : string, introduceImageList : string[] }

  let _page = 0
  const _size = 10
  const list : Ref<IndexAttraction[]> = ref([])

  onLoad(() => {
    getAttractionList()
  })

  async function getAttractionList() {
    loading()
    const ret = await lc.read('Attraction', (q : AV.Query<AV.Object>) => {
      q.descending('createdAt')
      q.limit(_size)
      q.skip(_page * _size)
      q.select(['name', 'introduceImageList'])
    })
    list.value = [...list.value, ...ret.map(i => i.toJSON())]
    _page++
    uni.stopPullDownRefresh()
    unloading()
  }

  onShareAppMessage(() => ({
    title: 'AI导游大师'
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

<style scoped>
  .nav-item {}

  .nav-image {
    width: 80px;
    height: 80px;
  }
</style>