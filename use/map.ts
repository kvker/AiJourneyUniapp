import { ref, } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'

import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'

export type GuidePointer = { longitude : number, latitude : number }

export function useMap() {
  onLoad(query => {
    if (query) {
      doGetAttraction(query.id)
    } else {
      alert('请准确进入')
    }
  })

  const lnglat : Ref<GuidePointer | null> = ref(null)

  async function doGetAttraction(id : string) {
    loading()
    const ret = await lc.one('Attraction', q => {
      q.equalTo('objectId', id)
      q.select(['lnglat'])
    }).then(ret => ret.toJSON())
    unloading()
    lnglat.value = ret.lnglat
  }

  return {
    lnglat,
  }
}