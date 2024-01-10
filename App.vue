<script lang="ts" setup>
  import {
    inject
  } from 'vue'
  import {
    onLaunch,
    onShow,
    onHide
  } from "@dcloudio/uni-app"
  import lc from './static/libs/lc'

  let global = inject('global')
  onLaunch(() => {
    // console.log('App Launch')
    lc.loginWithWeChat()
      .then(user => {
        // console.log(user)
        // console.log('auto login success')
      })
      .catch(console.error)
    console.log({ global })
  })
  onShow(() => {
    // console.log('App Show')
  })
  onHide(() => {
    // console.log('App Hide')
  })
</script>

<style>
  /*每个页面公共css */
  @import url(./static/libs/variable.css);
  @import url(./static/libs/main.css);

  page,
  .page {
    background: linear-gradient(180deg, #D4E3FF 0%, #FFF 100%);
  }
</style>