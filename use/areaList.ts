import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'
import type { GuidePointer } from '@/use/map'

type GuideArea = { objectId : string, name : string, lnglat : GuidePointer }

export function useAreaList(center : Ref<GuidePointer>) {
  let areaList : Ref<GuideArea[]> = ref([])
  const isDev = ref(false)
  onLoad(query => {
    if (query) {
      isDev.value = query.id === '659e75a84700c26fdeda7874'
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
    areaList.value = ret.map(i => i.toJSON())
    unloading()
  }

  const markers = computed(() => {
    let distance = 0.01
    let angle = -36
    return areaList.value.map((i, index) => {
      let longitude = i.lnglat.longitude
      let latitude = i.lnglat.latitude
      if (isDev.value) {
        longitude = center.value!.longitude
        latitude = center.value!.latitude
        if (i === areaList.value[0]) {
          latitude += distance
        } else {
          angle += 360 / (areaList.value.length - 1)
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

  return {
    areaList,
    markers,
  }
}