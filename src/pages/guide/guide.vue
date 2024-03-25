<script lang="ts" setup>
import { ref, watch } from "vue"
import { onShareAppMessage } from '@dcloudio/uni-app'
import { useMap } from '@/composables/map'
import { useList } from '@/composables/list'
import { useAttraction } from '@/composables/attraction'
import { distance } from '@/services/map'
import AreaList from '@/components/AreaList/AreaList.vue'
import { gcj02towgs84 } from '@/services/map'

onShareAppMessage(() => ({
  title: '来游玩' + attraction.value?.name + '吧'
}))

// 设置屏幕常亮
uni.setKeepScreenOn({
  keepScreenOn: true,
  fail: error => {
    console.error(error)
  }
})

const { attraction } = useAttraction()

const listRef = ref()
const { list, } = useList()
const { lnglat, markers, onMoveToArea, onMoveToCenter, enabled, mapScaleRef } = useMap(list)

function onMarkerTap(e: DetailEvent) {
  if (isAuto.value) return

  // 这个id就是列表的index创建的
  const index = e.detail.markerId
  const item = list.value[index]
  onChangeArea(item)
}

function onChangeArea(item: GuideItem) {
  if (item.type === 'area') {
    uni.navigateTo({
      url: `/pages/area-introduce/area-introduce?id=${item._id}&attractionId=${attraction.value?._id}${isAuto.value ? '&isAuto=true' : ''}`
    })
  }
  if (!isAuto.value) {
    listRef.value.onMoveToArea(item)
    onMoveToArea(item)
  }
}

const isAuto = ref(false)
function onChangeAutoState() {
  isAuto.value = !isAuto.value
  enabled.value = !isAuto.value
  if (isAuto.value) {
    uni.showModal({
      title: '提示',
      content: '请保持小程序前台运行。',
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
  mapScaleRef.value = 20
  const onPlay = () => {
    if (list.value.find(i => i.state === 'playing')) return // 播放中则不获取位置了
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
  }, 10000)
}

function onStopAutoPlay() {
  getLocationInterval && clearInterval(getLocationInterval)
}

uni.$on('arePlayEnded', e => {
  // console.log(e.area)
  list.value.forEach(area => {
    if (area._id === e.area._id) {
      area.state = 'ended'
    }
  })
})

function onHandlerMapCenterWithAreaList() {
  let minIndex = 0
  let minDistance = Infinity
  list.value.forEach((item, index) => {
    if (item.type === 'area' && item.state !== 'ended') {
      const dis = distance(lnglat.value as GuidePointer, item.lnglat)
      if (dis < minDistance) {
        minDistance = dis
        minIndex = index
      }
    }
  })
  // console.log(minDistance)
  const currentArea = list.value[minIndex]
  if (currentArea.state !== 'normal') {
    console.log(currentArea.name + '播放中')
    return
  }

  currentArea.state = 'playing'

  if (minDistance > 0 && minDistance < 50) {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    if (currentPage.route === 'pages/area-introduce/area-introduce') {
      console.log('当前页面是area-introduce')
      uni.navigateBack()
      onChangeArea(currentArea)
    } else if (currentPage.route === 'pages/guide/guide') {
      console.log('当前页面是guide')
      onChangeArea(currentArea)
    }
  }
}

// 测试用
import { useConfig } from '@/composables/config'
const { isDevRef } = useConfig()
function onTestGetCurrentPosition() {
  uni.showLoading({
    title: '获取中...'
  })
  uni.getLocation({
    type: 'gcj02',
    isHighAccuracy: true,
    highAccuracyExpireTime: 4000,
    success: (res) => {
      console.log(res)
      const [longitude, latitude] = gcj02towgs84(res.longitude, res.latitude)
      console.log({ longitude, latitude })
      uni.setClipboardData({
        data: `经度: ${longitude.toFixed(6)}, 纬度: ${latitude.toFixed(6)}`,
        success() {
          uni.showToast({
            title: '已复制到剪贴板',
            icon: 'none'
          })
        }
      })
    },
    fail(error: Error) {
      console.error(error)
    },
    complete() {
      uni.hideLoading()
    }
  })
}
</script>

<template>
  <view class="page">
    <view class="map-container">
      <map v-if="lnglat" id="map" class="w-100 h-100" :show-location="true" :markers="markers"
        :longitude="lnglat.longitude" :latitude="lnglat.latitude" :scale="mapScaleRef" @markertap="onMarkerTap"
        :enable-zoom="enabled" :enable-scroll="enabled" :enable-rotate="enabled"></map>
    </view>
    <AreaList ref="listRef" :list="list" @change="onChangeArea"></AreaList>
  </view>
  <view class="auto-box flex aic jcsb">
    <text class="bold mr-10">自动讲解</text>
    <switch class="auto-switch" :checked="isAuto" @change="onChangeAutoState" />
  </view>
  <view v-if="isDevRef" class="local-box flex aic jcsb">
    <button class="bold mr-10" @click="onTestGetCurrentPosition">获取当前坐标</button>
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

.local-box {
  position: fixed;
  right: 40rpx;
  top: 40vh;
}
</style>