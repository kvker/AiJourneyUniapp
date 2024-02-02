import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/static/libs/lc'
import { alert, loading, unloading, } from '@/services/ui'

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
      getToiletList(query.id)
    } else {
      alert('请准确进入')
    }
  })

  async function getAreaList(id : string) {
    loading()
    let ret = await lc.read('Area', q => {
      q.equalTo('attraction', lc.createObject('Attraction', id))
      q.limit(100)
      q.descending('createdAt')
    })
    areaList.value = ret.map(i => i.toJSON())
    unloading()
  }

  async function getToiletList(id : string) {
    loading()
    let ret = await lc.read('Toilet', q => {
      q.equalTo('attraction', lc.createObject('Attraction', id))
      q.limit(100)
      q.descending('createdAt')
    })
    toiletList.value = ret.map(i => i.toJSON())
    unloading()
  }

  return {
    list,
  }
}