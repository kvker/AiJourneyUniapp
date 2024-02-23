import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/services/lc'
import { alert, loading, unloading, } from '@/services/ui'
import { wgs84togcj02 } from '@/services/map'

export function useList() {
  const areaList : Ref<GuideArea[]> = ref([])
  const toiletList : Ref<GuideToilet[]> = ref([])
  const list = computed(() => {
    return [...areaList.value.map(i => {
      let item = i as GuideItem
      item.type = 'area'
      return item
    }), ...toiletList.value.map(i => {
      let item = i as GuideItem
      item.type = 'toilet'
      return item
    })]
  })
  onLoad(query => {
    if (query) {
      getAreaList(query.id)
        .then(() => {
          getToiletList(query.id)
        })
    } else {
      alert('请准确进入')
    }
  })

  async function getAreaList(id : string) {
    loading()
    try {
      let ret = await lc.read('Area', q => {
        q.equalTo('attraction', lc.createObject('Attraction', id))
        q.limit(100)
        q.descending('createdAt')
      })
      areaList.value = ret.map(i => {
        const item = i.toJSON()
        // 前端是展示用，故而获取数据后统一转为 GCJ 坐标
        const [longitude, latitude] = wgs84togcj02(item.lnglat.longitude, item.lnglat.latitude)
        return {
          ...item,
          lnglat: { longitude, latitude }
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      unloading()
    }
  }

  async function getToiletList(id : string) {
    loading()
    try {
      let ret = await lc.read('Toilet', q => {
        q.equalTo('attraction', lc.createObject('Attraction', id))
        q.limit(100)
        q.descending('createdAt')
      })
      toiletList.value = ret.map(i => {
        const item = i.toJSON()
        // 前端是展示用，故而获取数据后统一转为 GCJ 坐标
        const [longitude, latitude] = wgs84togcj02(item.lnglat.longitude, item.lnglat.latitude)
        return {
          ...item,
          lnglat: { longitude, latitude }
        }
      })
    } catch (e) {
      console.error(e)
    } finally {
      unloading()
    }
  }

  return {
    list,
  }
}