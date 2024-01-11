<template>
  <view class="page">
    <map v-if="lnglat" :markers="markers" :longitude="lnglat.longitude" :latitude="lnglat.latitude" scale="14"></map>
    <area-list></area-list>
  </view>
</template>

<script lang="ts" setup>
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
  import { alert } from '@/services/ui'
  import { useMap } from '@/use/map'
  import { useList } from '@/use/list'

  let attractionName = ''
  onLoad(query => {
    if (query) {
      attractionName = decodeURIComponent(query.name)
    } else {
      alert('请准确进入')
    }
  })

  onShareAppMessage(() => ({
    title: '来游玩' + attractionName + '吧'
  }))
  
  const { list, } = useList()
  const { lnglat, markers } = useMap(list)
</script>

<style>
  map {
    width: 100%;
    height: 62vh;
  }
</style>