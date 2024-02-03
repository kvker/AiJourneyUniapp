<script lang="ts" setup>
  import { computed, ref } from 'vue'
  import type { Ref } from 'vue'
  import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage } from '@dcloudio/uni-app'
  import lc from '@/static/libs/lc'
  import { alert, loading, unloading, toast, } from '@/services/ui'

  const id = ref('')
  const areaQueriable = ref<AV.Queriable>()

  const area = computed(() => {
    if (areaQueriable.value) {
      return areaQueriable.value.toJSON()
    }
  })

  onLoad((query) => {
    if (query && query.id) {
      getArea(query.id)
    } else {
      alert('无景点，请勿非法进入')
    }
  })

  onReachBottom(() => { })

  onPullDownRefresh(() => { })

  onShareAppMessage(() => ({
    title: areaQueriable.value!.get('name')
  }))

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
</script>

<template>
  <AreaIntroduce v-if="area" :area="area" :closeShow="false" @init="onInitAreaIntroduce"></AreaIntroduce>
</template>

<style>

</style>