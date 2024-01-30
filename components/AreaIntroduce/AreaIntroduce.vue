<template>
  <view class="component">
    <template v-if="area">
      <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
        <swiper-item v-for="(image, index) of area.coverImageList" :key="image"
          @click.stop="onPreviewImame(image,index)">
          <image class="w-100 h-100" :src="image" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="h-30 scroll-y px-10 mt-10"><text user-select>{{introduce}}</text></view>
      <view v-if="voice" class="mt-10">
        <button type="default" @click="onToggleAudio">播放音频</button>
      </view>
    </template>
  </view>
</template>

<script lang="ts" setup>
  import { computed, ComputedRef, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const props = defineProps({
    area: {
      type: Object as () => GuideArea,
      required: true,
    }
  })

  const styleIntroduceQueriables = ref<AV.Queriable[]>([])
  const styleIntroduces = computed(() => {
    return styleIntroduceQueriables.value.map((i : AV.Queriable) => i.toJSON())
  })

  const introduce = computed(() => {
    if (styleIntroduces.value[0]) {
      return styleIntroduces.value[0].introduce
    } else {
      return props.area.introduce
    }
  })

  const voice = computed(() => {
    const src = styleIntroduces.value[0] ? styleIntroduces.value[0].voice : ''
    return src
  })

  watch(() => props.area, (val, oldVal) => {
    getStyleIntroduce(props.area as GuideArea)
  }, {
    immediate: true
  })

  let isPlay = false
  const ac = uni.createInnerAudioContext()
  ac.onEnded(() => isPlay = false)
  ac.onWaiting(() => isPlay = false)
  ac.onError(() => isPlay = false)

  function onPreviewImame(image, index) {
    if (props.area) {
      console.log(props.area)
      uni.previewImage({
        urls: props.area.coverImageList
      })
    }
  }

  async function getStyleIntroduce(area : GuideArea) {
    const ret = await lc.read('AreaIntroduce', q => {
      q.equalTo('area', lc.createObject('Area', area.objectId))
      q.descending('updatedAt')
    })
    styleIntroduceQueriables.value = ret
  }

  function onToggleAudio() {
    if (styleIntroduces.value.length) {
      const voice = styleIntroduces.value[0].voice
      if (voice) {
        ac.src = voice
        isPlay = !isPlay
        isPlay ? ac.play() : ac.pause()
      } else {
        console.log('无音频')
      }
    } else {
      console.log('无风格语音')
    }
  }
</script>

<style scoped>
  swiper {
    width: 100%;
    height: 40%;
  }
</style>