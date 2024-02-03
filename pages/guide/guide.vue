<script lang="ts" setup>
  import { ref } from "vue"
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

  const area = ref<GuideArea>()
  const listRef = ref()
  const { list, } = useList()
  const { lnglat, markers, doMoveToArea } = useMap(list)
  const areaIntroduceShow = ref(false)

  function onMarkerTap(e : DetailEvent) {
    // 这个id就是列表的index创建的
    const index = e.detail.markerId
    const item = list.value[index]
    changeArea(item)
  }

  function changeArea(item : GuideArea) {
    listRef.value.doMoveToArea(item)
    doMoveToArea(item)
    doShowAreaPlayer(item)
  }

  function doShowAreaPlayer(item : GuideArea) {
    // console.log(item)
    area.value = item
    areaIntroduceShow.value = true
  }
</script>

<template>
  <view class="page">
    <map v-if="lnglat" :markers="markers" :longitude="lnglat.longitude" :latitude="lnglat.latitude" scale="14"
      @markertap="onMarkerTap"></map>
    <AreaList ref="listRef" :list="list" @change="changeArea"></AreaList>
    <AreaIntroduce v-if="area && areaIntroduceShow" :area="area" @close="areaIntroduceShow = false" class="mask">
    </AreaIntroduce>
  </view>
</template>

<style>
  map {
    width: 100%;
    height: 62vh;
  }
</style>