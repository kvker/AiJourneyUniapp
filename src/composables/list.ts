import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import { alert, loading, unloading, } from '@/services/ui'
import { wgs84togcj02 } from '@/services/map'
import { db } from '@/services/cloud'

export function useList() {
  const areaList: Ref<GuideArea[]> = ref([])
  const toiletList: Ref<GuideToilet[]> = ref([])
  const attentionList: Ref<GuideAttention[]> = ref([])
  const list = computed(() => {
    return [...areaList.value.map(i => {
      let item = i as GuideItem
      item.type = 'area'
      return item
    }), ...toiletList.value.map(i => {
      let item = i as GuideItem
      item.type = 'toilet'
      return item
    }), ...attentionList.value.map(i => {
      let item = i as GuideItem
      item.type = 'attention'
      return item
    })]
  })

  onLoad(query => {
    if (query) {
      getAreaList(query.id)
        .then(() => {
          getToiletList(query.id)
        })
        .then(() => {
          getAttentionList(query.id)
        })
    } else {
      alert('请准确进入')
    }
  })

  async function getAreaList(id: string) {
    loading()
    try {
      const { data } = await db.collection('JArea')
        .where({
          attractionId: id,
        })
        .orderBy('createdAt', 'asc')
        .get()
      areaList.value = data.map((item: GuideArea) => {
        // 前端是展示用，数据库储存的都是标准 GPS 即 wgs84 坐标，故而获取数据后统一转为 GCJ 坐标
        // console.log(item.lnglat.longitude, item.lnglat.latitude)
        const [longitude, latitude] = wgs84togcj02(item.lnglat.longitude, item.lnglat.latitude)
        // console.log({ longitude, latitude })
        return {
          ...item,
          lnglat: { longitude, latitude }
        }
      }) as GuideArea[]
    } catch (e) {
      console.error(e)
    }
  }

  async function getToiletList(id: string) {
    try {
      const { data } = await db.collection('JToilet')
        .where({
          attractionId: id,
        })
        .orderBy('createdAt', 'asc')
        .get()
      toiletList.value = data.map((item: GuideToilet) => {
        // 前端是展示用，故而获取数据后统一转为 GCJ 坐标
        const [longitude, latitude] = wgs84togcj02(item.lnglat.longitude, item.lnglat.latitude)
        return {
          ...item,
          lnglat: { longitude, latitude }
        }
      }) as GuideToilet[]
    } catch (e) {
      console.error(e)
    } finally {
      unloading()
    }
  }

  async function getAttentionList(id: string) {
    try {
      const { data } = await db.collection('JAttention')
        .where({
          attractionId: id,
        })
        .orderBy('createdAt', 'asc')
        .get()
      attentionList.value = data.map((item: GuideAttention) => {
        // 前端是展示用，故而获取数据后统一转为 GCJ 坐标
        const [longitude, latitude] = wgs84togcj02(item.lnglat.longitude, item.lnglat.latitude)
        return {
          ...item,
          lnglat: { longitude, latitude }
        }
      }) as GuideAttention[]
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