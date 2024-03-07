export const toast = (text : string, options : { status ?: 'success' | 'error' | 'none' } = {}) => {
  uni.showToast({
    title: text,
    icon: options.status || 'none',
  })
}


export const loading = (text : string = '加载中...', options : {} = {}) => {
  uni.showLoading({
    title: text,
    mask: true
  })
}

export const unloading = () => {
  uni.hideLoading()
}

export const alert = (text : string, options : {} = {}) => {
  uni.showModal({
    content: text,
    showCancel: false,
  })
}

export const confirm = (text : string, options : {} = {}) => {
  return new Promise((s, j) => {
    uni.showModal({
      content: text,
      success: (ret) => {
        if (ret.confirm) {
          s(true)
        } else {
          j(false)
        }
      }
    })
  })
}

export const autoLoaing = async (text : string, cb : () => Promise<any>, options : {} = {}) => {
  loading(text)
  await cb()
  unloading()
}