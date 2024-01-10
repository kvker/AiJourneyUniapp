<template>
  <view class="page">
    {{areaList.length}}
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'
  type GuideArea = { objectId : string, name : string, introduceImageList : string[], introduceVideo : string, } | null

  let attractionName = ''
  let id = ''
  let areaList : Ref<GuideArea[]> = ref([])

  onLoad(query => {
    if (query) {
      attractionName = decodeURIComponent(query.name)
      id = query.id
      doGetAreaList()
    }
  })

  onPullDownRefresh(() => { })

  onShareAppMessage(() => ({
    title: '来游玩' + attractionName + '吧'
  }))

  async function doGetAreaList() {
    loading()
    let ret = await lc.read('Area', q => {
      q.equalTo('attraction', lc.createObject('Attraction', id))
      q.limit(100)
      q.descending('createdAt')
    })
    areaList.value = ret.map(i => i.toJSON())
    unloading()
  }
</script>

<style>

</style>