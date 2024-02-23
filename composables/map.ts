import { computed, shallowRef, getCurrentInstance } from 'vue'
import type { Ref } from 'vue'
import { onLoad, } from '@dcloudio/uni-app'
import lc from '@/services/lc'
import { alert, loading, unloading, } from '@/services/ui'
import { wgs84togcj02 } from '@/services/map'

// let isDev = false
export function useMap(list : Ref<GuideItem[]>) {
  const ctx = getCurrentInstance()
  const mapContext = uni.createMapContext("map", ctx)
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
    // let distance = 0.01
    // let angle = -36
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
    let [longitude, latitude] = wgs84togcj02(ret.lnglat.longitude, ret.lnglat.latitude)
    lnglat.value = { longitude, latitude }
  }

  const onMoveToCenter = () => {
    // 获取当前位置
    uni.getLocation({
      type: 'wgs84',
      highAccuracyExpireTime: 3000,
      success: ret => {
        console.log(ret)
        let [longitude, latitude] = wgs84togcj02(ret.longitude, ret.latitude)
        mapContext.moveToLocation({
          latitude,
          longitude,
          complete: res => {
            console.log('移动完成:', res)
          }
        })
      },
      fail: error => {
        console.error(error)
      }
    })
    // 设置到当前位置为中心点
  }

  return {
    lnglat,
    markers,
    doMoveToArea,
    onMoveToCenter,
  }
}