export const toast = (text : string, status : 'success' | 'error' | 'none' = 'none') => {
  uni.showToast({
    icon: status,
    title: text,
  })
}


export const loading = (text : string = '加载中...') => {
  uni.showLoading({
    title: text
  })
}

export const unloading = () => {
  uni.hideLoading()
}

export const alert = (text : string) => {
  uni.showModal({
    content: text,
    showCancel: false,
  })
}

export const confirm = (text : string) => {
  uni.showModal({
    content: text,
    success: (ret) => {
      console.log(ret)
    }
  })
}