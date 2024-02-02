import { computed, shallowRef } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'
import { wgs84togcj02 } from '@/services/map'

// let isDev = false
export function useMap(list : Ref<GuideItem[]>) {
  onLoad(query => {
    if (query) {
      // isDev = query.id === '659e75a84700c26fdeda7874'
      doGetAttraction(query.id)
    } else {
      alert('请准确进入')
    }
  })

  const lnglat : Ref<GuidePointer | null> = shallowRef(null)

  const markers = computed(() => {
    let distance = 0.01
    let angle = -36
    return list.value.map((i, index) => {
      // let longitude = i.lnglat.longitude
      // let latitude = i.lnglat.latitude
      // if (isDev) {
      //   longitude = lnglat.value!.longitude
      //   latitude = lnglat.value!.latitude
      //   if (i === list.value[0]) {
      //     latitude += distance
      //   } else {
      //     angle += 360 / (list.value.length - 1)
      //     longitude += distance * Math.cos(angle)
      //     latitude += distance * Math.sin(angle)
      //   }
      //   i.lnglat.longitude = longitude
      //   i.lnglat.latitude = latitude
      //   // 测试标记要清掉，不然后面变更中心会一直重新算
      //   if (index === list.value.length - 1) {
      //     isDev = false
      //   }
      // }
      let [longitude, latitude] = wgs84togcj02(i.lnglat.longitude, i.lnglat.latitude)
      return {
        id: index,
        iconPath: `/static/images/marker-${i.type}.png`,
        latitude,
        longitude,
        width: 20,
        height: 20,
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

  function doMoveToArea(item : GuideArea) {
    lnglat.value = item.lnglat
  }

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
    doMoveToArea,
  }
}