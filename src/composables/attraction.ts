import { ref } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import { alert, loading, unloading } from '@/services/ui'
import { db } from '@/services/cloud'

export function useAttraction() {
  onLoad(query => {
    if (query?.attractionId) {
      getAttraction(query?.attractionId)
    } else {
      alert('请准确进入')
    }
  })

  const attraction: Ref<GuideAttraction | undefined> = ref()

  async function getAttraction(id: string) {
    loading()
    try {
      const { data } = await db.collection('JAttraction')
        .doc(id)
        .get()
      attraction.value = data as GuideAttraction
    } catch (e) {
      //TODO handle the exception
    }
    unloading()
  }

  return { attraction }
}