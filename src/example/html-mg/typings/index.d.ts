interface PluginAPI {
  on(type: PluginEventType | 'drop', callback: CallableFunction): void
}

interface DropEvent {
  x: number // clientX
  y: number // clientY
  absoluteX: number // 画布x坐标
  absoluteY: number // 画布y坐标
  items: any
}
