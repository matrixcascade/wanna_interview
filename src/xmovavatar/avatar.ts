import * as avatarsdk from './sdk-loader.ts'
import { ElMessage } from 'element-plus'
interface AvatarCallbacks {
  onSubtitleOn: (text: string) => void
  onSubtitleOff: () => void
  onStateChange: (state: string) => void
}

class AvatarService
{
  private containerId: string
  private isConnected: boolean = false
  private avatar:any = null;
  constructor() {
    this.containerId = avatarsdk.generateContainerId()
  }

  /**
   * 获取容器ID
   * @returns {string} - 返回随机生成的容器ID
   */
  getContainerId(): string {
    return this.containerId
  }

  /**
   * 连接虚拟人SDK
   * @param config - 虚拟人配置对象
   * @param config.appId - 应用ID
   * @param config.appSecret - 应用密钥
   * @param callbacks - 回调函数集合
   * @param callbacks.onSubtitleOn - 字幕显示回调
   * @param callbacks.onSubtitleOff - 字幕隐藏回调
   * @param callbacks.onStateChange - 状态变化回调
   * @returns {Promise<any>} - 返回虚拟人SDK实例
   * @throws {Error} - 当连接失败时抛出错误
   */
  async connect(appId: string,appSecret: string, callbacks: AvatarCallbacks): Promise<boolean> {
    const { onSubtitleOn, onSubtitleOff, onStateChange } = callbacks

    // 构建网关URL
    const url = new URL('https://nebula-agent.xingyun3d.com/user/v1/ttsa/session')
    url.searchParams.append('data_source', '2')
    url.searchParams.append('custom_id', 'demo')

    // 连接Promise管理
    let resolve: (value: boolean) => void
    let reject: (reason?: any) => void
    const connectPromise = new Promise<boolean>((res, rej) => {
      resolve = res
      reject = rej
    })

    // SDK构造选项
    const constructorOptions = {
      containerId: `#${this.containerId}`,
      appId,
      appSecret,
      enableDebugger: false,
      gatewayServer: url.toString(),
      onWidgetEvent: (event: any) => {
        console.log('SDK事件:', event)
        if (event.type === 'subtitle_on') {
          onSubtitleOn(event.text)
        } else if (event.type === 'subtitle_off') {
          onSubtitleOff()
        }
      },
      onStateChange,
      onMessage: async (error: any) => {
        const state = await avatarsdk.getPromiseState(connectPromise)
        const plainError = new Error(error.message)
        if (state === 'pending') {
          reject(plainError)
        }
      }
    }

    // 创建SDK实例

    if (this.avatar===null)
    {
       this.avatar = new window.XmovAvatar(constructorOptions)
    }

    // 等待初始化
    await new Promise(resolve => {
      setTimeout(resolve, 100)
    })

    // 初始化SDK
    await this.avatar.init({
      onDownloadProgress: (progress: number) => {
        console.log(`初始化进度: ${progress}%`)
        if (progress >= 100) {
          resolve(true)
        }
      },
      onClose: () => {
        onStateChange('')
        console.log('SDK连接关闭')
      }
    })

    // 等待连接完成
    const [result] = await Promise.allSettled([
      connectPromise,
      new Promise(resolve => setTimeout(resolve, 1000))
    ])

    if (result.status === 'rejected') {
      this.isConnected = false
      ElMessage.error('并发数量已经达到上限,迟点再试试吧')
      throw result.reason
    }
    this.isConnected = true
    await new Promise(resolve => {
      setTimeout(resolve, 1000)
    })
    await this.speak('我是你本场面试官,先简单介绍一下你自己的专业背景')
    return this.isConnected
  }

  /**
   * 断开虚拟人连接
   * @param avatar - 虚拟人SDK实例
   * @returns {void}
   */
  disconnect(): void {
    if (!this.avatar) return

    try {
      this.avatar.stop()
      this.avatar.destroy()
    } catch (error) {
      console.error('断开连接时出错:', error)
    }
  }


  async speak(content: string): Promise<string | undefined>
  {

    if (!this.isConnected) {
      return
    }
    try
    {
      this.avatar.speak(content, true, true)
    }
    catch(error)
    {
      console.error('语音出错:', error)
    }
  }
}

export const avatarService = new AvatarService()
