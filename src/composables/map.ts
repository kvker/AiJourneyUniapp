import { computed, shallowRef, getCurrentInstance, ref } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import { alert, loading, unloading, } from '@/services/ui'
import { wgs84togcj02 } from '@/services/map'
import { db } from '@/services/cloud'

/**
 * 此 composable 需要注意，下发的数据是 GPS 定位，而小程序使用的是 GCJ 定位，每次使用记得转换。
 */

// let isDev = false
export function useMap(list: Ref<GuideItem[]>) {
  onLoad(query => {
    if (query) {
      // isDev = query.id === '659e75a84700c26fdeda7874'
      getAttraction(query.id)
    } else {
      alert('请准确进入')
    }
  })

  const getAttraction = async (id: string) => {
    loading()
    try {
      const { data: attraction } = await db.collection('JAttraction')
        .doc(id)
        .get()
      const [longitude, latitude] = wgs84togcj02(attraction.lnglat.longitude, attraction.lnglat.latitude)
      lnglat.value = { longitude, latitude }
    } catch (e) {
      console.error(e)
    } finally {
      unloading()
    }
  }

  const lnglat: Ref<GuidePointer | null> = shallowRef(null)

  const markers = computed(() => {
    return list.value.map((i, index) => {
      return {
        id: index,
        iconPath: `/static/icons/marker-${i.type}.png`,
        latitude: i.lnglat.latitude,
        longitude: i.lnglat.longitude,
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

  // 自动定位相关功能
  const enabled = ref(true)
  function onMoveToCenter(center: GuidePointer) {
    lnglat.value = { longitude: 0, latitude: 0 }
    lnglat.value = center
  }

  function onMoveToArea(item: GuideArea) {
    lnglat.value = item.lnglat
  }

  return {
    enabled,
    lnglat,
    markers,
    onMoveToArea,
    onMoveToCenter,
  }
}