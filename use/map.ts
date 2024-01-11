import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'

import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'

export function useMap(list : Ref<GuideArea[]>) {
  onLoad(query => {
    if (query) {
      isDev.value = query.id === '659e75a84700c26fdeda7874'
      doGetAttraction(query.id)
    } else {
      alert('请准确进入')
    }
  })

  const lnglat : Ref<GuidePointer | null> = ref(null)
  const isDev = ref(false)

  const markers = computed(() => {
    let distance = 0.01
    let angle = -36
    console.log(list)
    return list.value.map((i, index) => {
      let longitude = i.lnglat.longitude
      let latitude = i.lnglat.latitude
      if (isDev.value) {
        longitude = lnglat.value!.longitude
        latitude = lnglat.value!.latitude
        if (i === list.value[0]) {
          latitude += distance
        } else {
          angle += 360 / (list.value.length - 1)
          longitude += distance * Math.cos(angle)
          latitude += distance * Math.sin(angle)
        }
      }

      return {
        id: index,
        path: '/static/images/marker.png',
        latitude,
        longitude,
        width: 20,
        height: 30,
        callout: {
          content: i.name,
          anchorY: 0,
          anchorX: 0,
          display: 'ALWAYS',
          borderRadius: 2,
          padding: 2,
        }
      }
    })
  })

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
    markers,
  }
}