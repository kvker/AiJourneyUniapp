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
  const { lnglat, markers, doMoveToArea, onMoveToCenter } = useMap(list)

  function onMarkerTap(e : DetailEvent) {
    // 这个id就是列表的index创建的
    const index = e.detail.markerId
    const item = list.value[index]
    onChangeArea(item)
  }

  function onChangeArea(item : GuideItem) {
    listRef.value.doMoveToArea(item)
    doMoveToArea(item)
    if (item.type === 'area') {
      uni.navigateTo({
        url: `/pages/area-introduce/area-introduce?id=${item.objectId}&attractionId=${attraction.value?.objectId}`
      })
    }
  }
</script>

<template>
  <view class="page">
    <view class="map-container">
      <map v-if="lnglat" id="map" class="w-100 h-100" :markers="markers" :longitude="lnglat.longitude"
        :latitude="lnglat.latitude" scale="16" @markertap="onMarkerTap"></map>
      <cover-image class="center-icon" src="@/static/icons/center-focus.png" @click="onMoveToCenter"></cover-image>
    </view>
    <AreaList ref="listRef" :list="list" @change="onChangeArea"></AreaList>
  </view>
</template>

<style>
  .map-container {
    position: relative;
    width: 100%;
    height: 50vh;
  }

  .center-icon {
    position: absolute;
    right: 20rpx;
    bottom: 20rpx;
    z-index: 2;
    width: 80rpx;
    height: 80rpx;
    filter: drop-shadow(0px 0px 20rpx #FF3D00);
  }

  AreaList {
    height: 50vh;
  }
</style>