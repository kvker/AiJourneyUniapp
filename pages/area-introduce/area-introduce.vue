<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const attractionQueriable = ref<AV.Queriable>()
  const areaQueriable = ref<AV.Queriable>()

  const area = computed(() => {
    if (areaQueriable.value) {
      return areaQueriable.value.toJSON()
    }
  })

  onLoad((query) => {
    if (query && query.id) {
      if (query && query.attractionId) {
        getAttraction(query.attractionId)
      }
      if (query.id) {
        getArea(query.id)
      }
    } else {
      alert('无景点，请勿非法进入')
    }
  })

  onReachBottom(() => { })

  onPullDownRefresh(() => { })

  onShareAppMessage(() => ({
    title: areaQueriable.value!.get('name')
  }))

  function getAttraction(objectId : string) {
    lc.continueWithUser(async () => {
      loading('获取中...')
      try {
        const ret = await lc.one('Attraction', q => {
          q.equalTo('objectId', objectId)
        })
        attractionQueriable.value = ret
      } catch (e) {
        console.error(e)
      }
      unloading()
    })
  }

  function getArea(objectId : string) {
    lc.continueWithUser(async () => {
      loading('获取中...')
      try {
        const ret = await lc.one('Area', q => {
          q.equalTo('objectId', objectId)
        })
        areaQueriable.value = ret
        uni.setNavigationBarTitle({
          title: areaQueriable.value.get('name')
        })
      } catch (e) {
        console.error(e)
      }
      unloading()
    })
  }

  function onInitAreaIntroduce(params : any) {
    console.log(params)
  }

  function onNavigateToAttraction() {
    if (attractionQueriable.value) {
      uni.reLaunch({
        url: '/pages/welcome/welcome?id=' + attractionQueriable.value!.id
      })
    } else {
      uni.reLaunch({
        url: '/pages/index/index'
      })
    }
  }
</script>

<template>
  <AreaIntroduce v-if="area" :area="area" :closeShow="false" @init="onInitAreaIntroduce"></AreaIntroduce>
  <view class="custom-navgator absolute">
    <view class="custom-back absolute flex aic jcc" @click="onNavigateToAttraction">
      <image src="@/static/icons/back.png" mode=""></image>
    </view>
  </view>
</template>

<style>
  page {
    background: white;
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