import { EventHandler } from '@create-figma-plugin/utilities'

export interface CreateRectanglesHandler extends EventHandler {
  name: 'CREATE_RECTANGLES'
  handler: (count: number) => void
}

export interface InfoHandler extends EventHandler {
  name: 'INFO'
  handler: () => void
}

export interface InfoUiHandler extends EventHandler {
  name: 'INFO_UI'
  handler: (pageName: string, fileKey: string | undefined, selection: readonly SceneNode[]) => void
}

export interface CloseHandler extends EventHandler {
  name: 'CLOSE'
  handler: () => void
}
