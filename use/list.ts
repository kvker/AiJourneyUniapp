import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'

export function useList() {
  const list : Ref<GuideArea[]> = ref([])
  onLoad(query => {
    if (query) {
      doGetAreaList(query.id)
    } else {
      alert('请准确进入')
    }
  })

  async function doGetAreaList(id : string) {
    loading()
    let ret = await lc.read('Area', q => {
      q.equalTo('attraction', lc.createObject('Attraction', id))
      q.limit(100)
      q.descending('createdAt')
    })
    list.value = ret.map(i => i.toJSON())
    unloading()
  }

  return {
    list,
  }
}