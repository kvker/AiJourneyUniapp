<script lang="ts" setup>
import { computed, ref, watch, onUnmounted } from 'vue'
import type { Ref } from 'vue'
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
import { alert, loading, unloading, } from '@/services/ui'
import { db } from '@/services/cloud'

const areaRef = ref<GuideArea>()
const isAuto = ref(false)

onLoad((query) => {
  if (query) {
    if (query.id) {
      getArea(query.id)
    }
    if (query.isAuto) {
      isAuto.value = true
    }
  } else {
    alert('无景点，请勿非法进入')
  }
})

onShareAppMessage(() => ({
  title: areaRef.value!.name
}))

async function getArea(id: string) {
  loading()
  try {
    const { data } = await db.collection('JArea')
      .doc(id)
      .get()
    areaRef.value = data as GuideArea
  } catch (e) {
    console.error(e)
  } finally {
    unloading()
  }
}

function onPreviewImame(list: string[], index: number) {
  if (areaRef.value) {
    uni.previewImage({
      urls: list,
      current: list[index],
    })
  }
}

const styleIntroduces: Ref<GuideStyleIntroduce[]> = ref([])
const isFetchingRef = ref(true)

const introduce = computed(() => {
  if (isFetchingRef.value) {
    return '加载中...'
  }
  if (styleIntroduces.value[0]) {
    return styleIntroduces.value[0].introduce
  } else {
    return areaRef.value!.introduce
  }
})

const voice = computed(() => {
  const src = styleIntroduces.value[0] ? styleIntroduces.value[0].voice : ''
  return src
})

watch(() => areaRef.value, (val) => {
  if (val) {
    getStyleIntroduce(areaRef.value as GuideArea)
  }
}, {
  immediate: true
})

const isPlayRef = ref(false)
const ac = uni.createInnerAudioContext()
ac.onEnded(() => {
  isPlayRef.value = false
  uni.$emit('arePlayEnded', { area: areaRef.value })
  if (isAuto.value) {
    uni.navigateBack()
  }
})
ac.onError(() => {
  isPlayRef.value = false
  uni.$emit('arePlayEnded', { area: areaRef.value })
  if (isAuto.value) {
    uni.navigateBack()
  }
})

onUnmounted(() => {
  ac.stop()
  uni.$emit('arePlayEnded', { area: areaRef.value })
})

async function getStyleIntroduce(area: GuideArea) {
  try {
    const { data } = await db.collection('JAreaIntroduce')
      .where({
        areaId: area._id,
      })
      .orderBy('updatedAt', 'desc')
      .get()

    styleIntroduces.value = data as GuideStyleIntroduce[]
    isAuto.value && onToggleAudio()
  } catch (e) {
    console.error(e)
  } finally {
    isFetchingRef.value = false
  }
}

function onToggleAudio() {
  if (styleIntroduces.value.length) {
    const voice = styleIntroduces.value[0].voice
    if (voice) {
      ac.src = voice
      isPlayRef.value = !isPlayRef.value
      isPlayRef.value ? ac.play() : ac.pause()
      // console.log(isPlayRef.value)
    } else {
      console.log('无音频')
    }
  } else {
    console.log('无风格语音')
  }
}
</script>

<template>
  <view class="component h-100 flex-c">
    <template v-if="areaRef">
      <swiper :indicator-dots="true" :autoplay="true" :interval="5000" :duration="1000">
        <swiper-item v-for="(image, index) of areaRef.coverImageList" :key="image"
          @click.stop="onPreviewImame(areaRef.coverImageList, index)">
          <image class="w-100 h-100" :src="image + '?imageView2/2/h/800'" mode="aspectFill"></image>
        </swiper-item>
      </swiper>
      <view class="title bold mt-20 mb-10">{{ areaRef.name }}</view>
      <view class="introduce f1 scroll-y pb-40"><text user-select>{{ introduce }}</text></view>
      <view class="controls mb-40">
        <button v-if="voice" class="mt-10" @click="onToggleAudio">{{ isPlayRef ? '暂停' : '播放' }}音频</button>
      </view>
      <!-- 调试用 -->
      <!-- <view class="controls mb-40">
        <button class="mt-10" @click="onToggleAudio">{{isPlayRef ? '暂停': '播放'}}音频</button>
      </view> -->
    </template>
  </view>
</template>

<style>
page {
  background: white;
}

.component {
  padding: 10vw 5vw 0 5vw;
  background-color: white;
}

swiper {
  position: relative;
  left: 9;
  width: 90vw;
  height: 90vw;
  border-radius: 20px;
  overflow: hidden;
}

.title {
  font-size: 24px;
}

.introduce {
  color: #999;
}

.controls button {
  border-radius: 16px;
  width: 100%;
  color: white;
  font-weight: bold;
  background: linear-gradient(135deg, #013EF6, #038EFE);
}

.custom-navgator {
  top: 5vw;
  left: 0;
  width: 100%;
  height: 40px;
}

.custom-back {
  top: calc(5vw + 16px);
  left: calc(5vw + 16px);
  width: 40px;
  height: 40px;
  background-color: #A7BFD1;
  border-radius: 8px;
}

.custom-back image {
  width: 30px;
  height: 30px;
}
</style>