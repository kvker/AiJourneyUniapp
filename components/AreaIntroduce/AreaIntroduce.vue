<template>
  <view class="component">
    <template v-if="area">
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
        <swiper-item v-for="(image, index) of area.coverImageList" :key="image"
          @click.stop="onPreviewImame(image,index)">
          <image class="w-100 h-100" :src="image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
    </template>
  </view>
</template>

<script lang="ts" setup>
  import { ComputedRef, ref } from 'vue'
  import type { Ref } from 'vue'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const props = defineProps({
    area: Object as () => GuideArea
  })

  function onPreviewImame(image, index) {
    if (props.area) {
      console.log(props.area)
      uni.previewImage({
        urls: props.area.coverImageList
      })
    }
  }
</script>

<style scoped>
  swiper {
    width: 100%;
    height: 240px;
  }
</style>