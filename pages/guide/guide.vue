<template>
  <view class="page">
    <map v-if="center" :markers="markers" :longitude="center.longitude" :latitude="center.latitude" scale="14">
    </map>
  </view>
</template>

<script lang="ts" setup>
  import type { Ref } from 'vue'
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
  import { alert } from '@/services/ui'
  import { useMap } from '@/use/map'
  import type { GuidePointer } from '@/use/map'
  import { useAreaList } from '@/use/areaList'

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

  const { lnglat: center, } = useMap()
  const { markers, } = useAreaList(center as Ref<GuidePointer>)
</script>

<style>
  map {
    width: 100%;
    height: 100%;
  }
</style>