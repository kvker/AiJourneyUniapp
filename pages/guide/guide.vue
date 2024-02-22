<script lang="ts" setup>
  import { ref } from "vue"
  import { onShareAppMessage } from '@dcloudio/uni-app'
  import { useMap } from '@/composables/map'
  import { useList } from '@/composables/list'
  import { useAttraction } from '@/composables/attraction'

  onShareAppMessage(() => ({
    title: '来游玩' + attraction.value?.name + '吧'
  }))

  const { attraction } = useAttraction()

  const listRef = ref()
  const { list, } = useList()
  const { lnglat, markers, doMoveToArea } = useMap(list)

  function onMarkerTap(e : DetailEvent) {
    // 这个id就是列表的index创建的
    const index = e.detail.markerId
    const item = list.value[index]
    onChangeArea(item)
  }

  function onChangeArea(item : GuideArea) {
    listRef.value.doMoveToArea(item)
    doMoveToArea(item)
    uni.navigateTo({
      url: `/pages/area-introduce/area-introduce?id=${item.objectId}&attractionId=${attraction.value?.objectId}`
    })
  }
</script>

<template>
  <view class="page">
    <view class="map-container">
      <map v-if="lnglat" class="w-100 h-100" :markers="markers" :longitude="lnglat.longitude"
        :latitude="lnglat.latitude" scale="14" @markertap="onMarkerTap"></map>
    </view>
    <AreaList ref="listRef" :list="list" @change="onChangeArea"></AreaList>
  </view>
</template>

<style>
  .map-container {
    width: 100%;
    height: 62vh;
  }
</style>