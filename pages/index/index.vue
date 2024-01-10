<template>
  <view class="page">
    <CommonHeader title="AI导游大师"></CommonHeader>
    <navigator v-for="item in list" :key="item.objectId" class="nav-item"
      :url="`/pages/welcome/welcome?id=${item.objectId}`">
      {{ item.name }}
    </navigator>
  </view>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { loading, unloading, } from '@/services/ui'

  type IndexAttraction = { objectId : string, name : string, }

  const _page = 0
  const list : Ref<IndexAttraction[]> = ref([])

  onLoad(() => {
    doGetAttraction()
  })

  async function doGetAttraction() {
    loading()
    const ret = await lc.read('Attraction', (q : AV.Query<AV.Object>) => {
      q.descending('createdAt')
      q.limit(10)
      q.skip(_page * 10)
      q.select(['name'])
    })
    list.value = ret.map(i => i.toJSON())
    unloading()
  }

  onShareAppMessage(() => ({
    title: 'AI导游大师'
  }))
</script>

<style></style>