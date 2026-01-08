<template>
  <div ref="containerRef" class="avatar-render">
    <!-- SDK 渲染容器 -->
    <div :id="containerId" class="sdk-container"/>

    <!-- 字幕显示 -->
    <div v-show="display_subtitle" class="subtitle">
      {{ subtitle_content }}
    </div>

    <!-- 加载状态 -->
    <div v-if="avatarState==='connecting'" class="loading-placeholder">
      <div class="loading-text">-- 正在连接 --</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue'
import {avatarService} from './avatar'
import key from '@/config/key';

const display_subtitle = ref(true)
const subtitle_content = ref('')
const avatarState = ref('')
const containerId = computed(() => avatarService.getContainerId())
onMounted(async () => {
  try {
    try {
      const bcreate = await avatarService.connect(
          key.XMOV_APP_ID,
          key.XMOV_APP_KEY,
          {
            onSubtitleOn: (text: string) => {
              subtitle_content.value = text
            },
            onSubtitleOff: () => {
              subtitle_content.value = ''
            },
            onStateChange: (state: string) => {
              avatarState.value = state
            }
          })
        if(!bcreate){
          throw new Error('Avatar SDK 连接失败')
        }
    } catch (error) {
      throw error
    }
  } catch (error) {
    console.error('Avatar 初始化失败:', error)
  }
})


</script>

<style scoped>
.avatar-render {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;
  border-right: 1px solid #e0e0e0;
  background: #f5f5f5;
  overflow: hidden;
}

.sdk-container {
  width: 70%;
  max-width: 100vw;
  aspect-ratio: 9 / 16;
  height: auto;
}

.subtitle {
  position: absolute;
  z-index: 100;
  top: 20px;
  left: 50%;
  width: 600px;
  max-width: 90%;
  word-break: break-word;
  text-align: center;
  transform: translateX(-50%);
  font-size: 20px;
  color: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.2);
  padding: 16px 32px;
  border-radius: 16px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
}

.voice-animation {
  position: absolute;
  left: 50%;
  top: 75%;
  transform: translateX(-50%);
  width: 360px;
  max-width: 90%;
  z-index: 101;
}

.voice-animation > img {
  width: 100%;
  height: auto;
}

.loading-placeholder {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(5px);
}

.loading-text {
  font-size: 18px;
  color: #666;
  font-weight: 500;
}
</style>
