import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import { alert, loading, unloading } from '@/services/ui'
import lc from '@/services/lc'


export function useAttraction() {
  onLoad(query => {
    if (query?.attractionId) {
      getAttraction(query?.attractionId)
    } else {
      alert('请准确进入')
    }
  })

  const attractionQueriable : Ref<AV.Object | null> = ref(null)
  const attraction = computed<GuideAttraction>(() => {
    if (attractionQueriable.value) {
      return attractionQueriable.value.toJSON()
    }
  })

  async function getAttraction(id : string) {
    loading()
    attractionQueriable.value = await lc.one('Attraction', q => {
      q.equalTo('objectId', id)
    })
    unloading()
  }

  return { attractionQueriable, attraction }
}