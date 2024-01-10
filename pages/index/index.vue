<template>
  <view class="page">
    <CommonHeader title="AI导游大师"></CommonHeader>
    <navigator v-for="item in list" :key="item.id" class="nav-item" :url="`/pages/welcome/welcome?id=${item.id}`">
      {{item.get('name')}}
    </navigator>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const _page = 0
  const list : Ref<AV.Object[]> = ref([])

  onLoad(() => {
    lc.read('Attraction', (q : AV.Query<AV.Object>) => {
      q.descending('createdAt')
      q.limit(10)
      q.skip(_page * 10)
    })
      .then(ret => {
        list.value = ret
      })
  })

  onReachBottom(() => { })

  onPullDownRefresh(() => { })

  onShareAppMessage(() => ({
    title: 'AI导游大师'
  }))
</script>

<style>

</style>