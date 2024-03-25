<script lang="ts" setup>
import { computed, ref } from 'vue'

type InnerGuideArea = GuideItem

const props = defineProps<{
  list: InnerGuideArea[]
}>()

const scrollTargetId = ref('')

const areaList = computed(() => {
  return props.list.map((i) => {
    i.state = 'normal'
    return i
  })
})

const emit = defineEmits(['change'])

function onChangeArea(item: InnerGuideArea) {
  emit('change', item)
}

function onTogglePlay(item: InnerGuideArea) {
  item.state = 'playing'
}

function onMoveToArea(item: InnerGuideArea) {
  scrollTargetId.value = 'area-item-' + item._id
}

defineExpose({
  onMoveToArea,
})
</script>

<template>
  <scroll-view :scroll-y="true" class="area-list-component" :scroll-into-view="scrollTargetId"
    :scroll-with-animation="true">
    <view v-for="item in areaList" :key="item._id" :id="'area-item-' + item._id" class="area-item flex aic"
      @tap="onChangeArea(item)">
      <image v-if="item.coverImageList[0]" class="item-image" :src="item.coverImageList[0] + '?imageView2/2/h/200'"
        mode="aspectFill"></image>
      <view class="info">
        <text class="name">{{ item.name }}</text>
      </view>
      <image class="audio-icon"
        :src="item.state !== 'normal' ? '/static/icons/audio.png' : '/static/icons/audio-disabled.png'"
        mode="aspectFill" @tap.stop="onTogglePlay(item)"></image>
    </view>
  </scroll-view>
</template>

<style>
scroll-view {
  height: 32vh;
}

.area-list-component {
  padding: 20rpx;
  background-color: white;
}

.area-item {
  margin-bottom: 40rpx;
  height: 96rpx;
}

.area-item:last-of-type {
  margin-bottom: 0;
}

.item-image {
  width: 96rpx;
  height: 100%;
  border-radius: 16rpx;
  margin-right: 20rpx;
}

.audio-icon {
  width: 48rpx;
  height: 48rpx;
  margin-left: auto;
}
</style>