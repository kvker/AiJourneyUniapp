<script lang="ts" setup>
import { ref, watch } from "vue"
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useMap } from '@/composables/map'
import { useList } from '@/composables/list'
import { useAttraction } from '@/composables/attraction'
import { distance } from '@/services/map'
import AreaList from '@/components/AreaList/AreaList.vue'

onShareAppMessage(() => ({
  title: '来游玩' + attraction.value?.name + '吧'
}))

const { attraction } = useAttraction()

const listRef = ref()
const { list, } = useList()
const { lnglat, markers, onMoveToArea, onMoveToCenter, enabled } = useMap(list)

function onMarkerTap(e: DetailEvent) {
  // 这个id就是列表的index创建的
  const index = e.detail.markerId
  const item = list.value[index]
  onChangeArea(item)
}

function onChangeArea(item: GuideItem) {
  listRef.value.onMoveToArea(item)
  onMoveToArea(item)
  if (item.type === 'area') {
    uni.navigateTo({
      url: `/pages/area-introduce/area-introduce?id=${item._id}&attractionId=${attraction.value?._id}${isAuto ? '&isAuto=true' : ''}`
    })
  }
}

const isAuto = ref(false)
function onChangeAutoState() {
  isAuto.value = !isAuto.value
  enabled.value = !isAuto.value
  if (isAuto.value) {
    uni.showModal({
      title: '提示',
      content: '自动播放讲解、关闭地图交互。',
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          onStartAutoPlay()
        }
      }
    })
  } else {
    onStopAutoPlay()
  }
}

let getLocationInterval: number = 0

function onStartAutoPlay() {
  const onPlay = () => {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      highAccuracyExpireTime: 4000,
      success: (res) => {
        onMoveToCenter(res)
        onHandlerMapCenterWithAreaList()
      },
      fail(error: Error) {
        console.error(error)
      },
    })
  }
  // 开始定位监听
  onPlay()
  getLocationInterval = setInterval(() => {
    onPlay()
  }, 5000)
}

function onStopAutoPlay() {
  getLocationInterval && clearInterval(getLocationInterval)
}

function onHandlerMapCenterWithAreaList() {
  let minIndex = 0
  let minDistance = Infinity
  list.value.forEach((item, index) => {
    if (item.type === 'area') {
      const dis = distance(lnglat.value as GuidePointer, item.lnglat)
      if (dis < minDistance) {
        minDistance = dis
        minIndex = index
      }
    }
  })
  if (minDistance > 0 && minDistance < 100) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage.route === 'pages/area-introduce/area-introduce') {
      console.log(1)
      uni.navigateBack()
      onChangeArea(list.value[minIndex])
    } else if (currentPage.route === 'pages/guide/guide') {
      console.log(2)
      onChangeArea(list.value[minIndex])
    }

  }
}
</script>

<template>
  <view class="page">
    <view class="map-container">
      <map v-if="lnglat" id="map" class="w-100 h-100" :markers="markers" :longitude="lnglat.longitude"
        :latitude="lnglat.latitude" scale="16" @markertap="onMarkerTap" :enable-zoom="enabled" :enable-scroll="enabled"
        :enable-rotate="enabled"></map>
    </view>
    <AreaList ref="listRef" :list="list" @change="onChangeArea"></AreaList>
  </view>
  <view class="auto-box flex aic jcsb">
    <text class="bold mr-10">自动讲解</text>
    <switch class="auto-switch" :checked="isAuto" @change="onChangeAutoState" />
  </view>
</template>

<style>
.map-container {
  position: relative;
  width: 100%;
  height: 68vh;
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

.auto-box {
  position: fixed;
  right: 40rpx;
  top: 62vh;
}
</style>