import { EventHandler } from '@create-figma-plugin/utilities'
import { Settings } from './Settings'

export interface InitHandler extends EventHandler {
  name: 'INIT'
  handler: () => void
}

export interface LoadSettingsHandler extends EventHandler {
  name: 'LOAD_SETTINGS'
  handler: (settings: Settings) => void
}

export interface SaveSettingsHandler extends EventHandler {
  name: 'SAVE_SETTINGS'
  handler: (settings: Settings) => void
}




export interface InfoHandler extends EventHandler {
  name: 'INFO'
  handler: () => void
}

export interface InfoUiHandler extends EventHandler {
  name: 'INFO_UI'
  handler: (pageName: string, fileKey: string | undefined, selection: readonly SceneNode[]) => void
}
