import { createApp } from 'vue'
import App from './App.vue'
import {initSDKs} from './xmovavatar/sdk-loader'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
const sdkLoaded = await initSDKs()

if (sdkLoaded) {
  console.log('SDK初始化成功')
} else {
  console.error('SDK初始化失败，应用可能无法正常工作')
}
const app=createApp(App)
app.use(ElementPlus)
app.mount('#app')
