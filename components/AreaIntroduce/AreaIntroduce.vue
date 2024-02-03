<script lang="ts" setup>
  import { computed, ComputedRef, ref, watch } from 'vue'
  import type { Ref } from 'vue'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const props = defineProps({
    area: {
      type: Object as () => GuideArea,
      required: true,
    },
    closeShow: {
      type: Boolean,
      default: true,
    }
  })

  const emit = defineEmits(['close'])

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

  const isPlay = ref(false)
  const ac = uni.createInnerAudioContext()
  ac.onEnded(() => isPlay.value = false)
  ac.onError(() => isPlay.value = false)

  function onPreviewImame(image, index) {
    if (props.area) {
      // console.log(props.area)
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
        isPlay.value = !isPlay.value
        isPlay.value ? ac.play() : ac.pause()
        // console.log(isPlay.value)
      } else {
        console.log('无音频')
      }
    } else {
      console.log('无风格语音')
    }
  }

  function onClose() {
    ac.pause()
    emit('close')
  }
</script>

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
      <view class="mt-10">
        <button v-if="voice" type="default" @click="onToggleAudio">{{isPlay ? '暂停': '播放'}}音频</button>
        <button v-if="closeShow" type="default" @click="onClose">关闭</button>
      </view>
    </template>
  </view>
</template>

<style scoped>
  .component {
    background-color: white;
  }

  swiper {
    width: 100%;
    height: 40%;
  }
</style>