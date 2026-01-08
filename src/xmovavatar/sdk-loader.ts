export const APP_CONFIG = {
  CONTAINER_PREFIX: 'CONTAINER_',
  DEFAULT_VAD_SILENCE_TIME: 300,
  AVATAR_INIT_TIMEOUT: 3000,
  SPEAK_INTERRUPT_DELAY: 2000
} as const

// 全局窗口类型扩展
declare global {
  interface Window {
    XmovAvatar: any
  }
}

export function checkSDKStatus() {
  const status = {
    xmovAvatar: !!window.XmovAvatar
  }

  console.log('SDK加载状态:', status)
  return status
}

// 等待SDK加载
export function waitForSDK(sdkName: keyof ReturnType<typeof checkSDKStatus>, timeout = 10000): Promise<boolean> {
  return new Promise((resolve) => {
    const startTime = Date.now()

    const check = () => {
      const status = checkSDKStatus()

      if (status[sdkName]) {
        resolve(true)
        return
      }

      if (Date.now() - startTime > timeout) {
        console.error(`${sdkName} SDK加载超时`)
        resolve(false)
        return
      }

      setTimeout(check, 100)
    }

    check()
  })
}


// 动态加载SDK
export function loadSDK(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // 检查是否已经加载
    const existingScript = document.querySelector(`script[src="${src}"]`)
    if (existingScript) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`))

    document.head.appendChild(script)
  })
}

// 确保所有SDK加载完成
export async function ensureSDKsLoaded(): Promise<boolean> {
  try {
    // 尝试加载本地SDK
    await Promise.all([
      loadSDK('https://media.xingyun3d.com/xingyun3d/general/litesdk/xmovAvatar.0.1.0-alpha.63.js')
    ])

    // 等待SDK初始化
    await Promise.all([
      waitForSDK('xmovAvatar')
    ])

    console.log('所有SDK加载完成')
    return true
  } catch (error) {
    console.error('SDK加载失败:', error)
    return false
  }
}

// 初始化SDK
export async function initSDKs() {
  const loaded = await ensureSDKsLoaded()

  if (!loaded) {
    console.error('SDK初始化失败')
    return false
  }
  return true
}


/**
 * 生成随机容器ID
 * @returns {string} - 返回以CONTAINER_为前缀的随机字符串
 */
export function generateContainerId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8))
  let randomID = ''
  for (let i = 0; i < bytes.length; i++) {
    const byte = bytes[i]
    if (byte !== undefined) {
      randomID += byte.toString(16).padStart(2, '0')
    }
  }
  return `${APP_CONFIG.CONTAINER_PREFIX}${randomID}`
}

/**
 * 延迟函数
 * @param ms - 延迟的毫秒数
 * @returns {Promise<void>} - 返回Promise，在指定时间后解决
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 检查Promise状态
 * @param promise - 要检查的Promise对象
 * @returns {Promise<'pending' | 'fulfilled' | 'rejected'>} - 返回Promise的当前状态
 */
export async function getPromiseState(promise: Promise<any>): Promise<'pending' | 'fulfilled' | 'rejected'> {
  const t = {}
  return await Promise.race([promise, t]).then(
    (v: any) => (v === t ? 'pending' : 'fulfilled'),
    () => 'rejected'
  )
}

/**
 * 生成SSML格式的语音文本
 * @param text - 要转换的文本内容
 * @param options - 语音参数配置
 * @param options.pitch - 音调（默认为1）
 * @param options.speed - 语速（默认为1）
 * @param options.volume - 音量（默认为1）
 * @returns {string} - 返回SSML格式的字符串
 */
export function generateSSML(text: string, options: {
  pitch?: number
  speed?: number
  volume?: number
} = {}): string {
  const { pitch = 1, speed = 1, volume = 1 } = options
  return `<speak pitch="${pitch}" speed="${speed}" volume="${volume}">${text}</speak>`
}

/**
 * 安全的JSON解析
 * @template T - 返回类型
 * @param json - 要解析的JSON字符串
 * @param defaultValue - 解析失败时的默认值
 * @returns {T} - 返回解析结果或默认值
 */
export function safeJsonParse<T>(json: string, defaultValue: T): T {
  try {
    return JSON.parse(json)
  } catch {
    return defaultValue
  }
}

/**
 * 验证配置是否完整
 * @param config - 要验证的配置对象
 * @param requiredFields - 必填字段数组
 * @returns {boolean} - 返回是否所有必填字段都不为空
 */
export function validateConfig(config: Record<string, any>, requiredFields: string[]): boolean {
  return requiredFields.every(field => config[field] && config[field] !== '')
}

