<template>
  <view class="page">
  guide
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  onLoad(() => { })

  onReachBottom(() => { })

  onPullDownRefresh(() => { })

  onShareAppMessage(() => ({
    title: '分享的名字'
  }))
</script>

<style>

</style>