<template>
  <scroll-view :scroll-y="true" class="area-list-component" :scroll-into-view="scrollTargetId" :scroll-with-animation="true">
    <view v-for="item in areaList" :key="item.objectId" :id="'area-item-' + item.objectId" class="area-item flex aic"
      @tap="onChangeArea(item)">
      <image class="item-image" :src="item.coverImageList[0]" mode="aspectFill"></image>
      <view class="info">
        <text class="name">{{item.name}}</text>
      </view>
      <image class="audio-icon" :src="item.isPlay ? '/static/icons/audio.png' : '/static/icons/audio-disabled.png'"
        mode="aspectFill" @tap.prevent="onTogglePlay(item)"></image>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
  import { onMounted, computed, ref } from 'vue'

  type InnerGuideArea = GuideArea & { isPlay : boolean }

  const props = defineProps({
    list: {
      type: Array,
      required: true,
      default: () => []
    }
  })

  const scrollTargetId = ref('')

  // 这段丑陋的代码（为了TS），有啥好招吗？
  const areaList = computed(() => {
    return props.list.map((i : any) => {
      let item = i as InnerGuideArea
      item.isPlay = false
      return item
    })
  })

  const emit = defineEmits(['change'])

  onMounted(() => {
    console.log(areaList)
  })

  function onChangeArea(item : InnerGuideArea) {
    emit('change', item)
  }

  function onTogglePlay(item : InnerGuideArea) {
    areaList.value.forEach(i => i.isPlay = false)
    item.isPlay = true
  }

  function doMoveToArea(item : InnerGuideArea) {
    scrollTargetId.value = 'area-item-' + item.objectId
  }

  defineExpose({
    doMoveToArea,
  })
</script>

<style>
  .area-list-component {
    height: 38vh;
    padding: 20rpx;
    background-color: white;
  }

  .area-item {
    margin-bottom: 40rpx;
  }

  .area-item:last-of-type {
    margin-bottom: 0;
  }

  .item-image {
    width: 96rpx;
    height: 96rpx;
    border-radius: 16rpx;
    margin-right: 20rpx;
  }

  .audio-icon {
    width: 48rpx;
    height: 48rpx;
    margin-left: auto;
  }
</style>