import { EventHandler } from '@create-figma-plugin/utilities'
import { Settings } from './Settings'

export interface InitHandler extends EventHandler {
  name: 'INIT'
  handler: () => void
}

export interface NotifyHandler extends EventHandler {
  name: 'NOTIFY'
  handler: (message: string, options?: NotificationOptions) => void
}

export interface LoadSettingsHandler extends EventHandler {
  name: 'LOAD_SETTINGS'
  handler: (settings: Settings) => void
}

export interface SaveSettingsHandler extends EventHandler {
  name: 'SAVE_SETTINGS'
  handler: (settings: Settings) => void
}

export interface RequestInfoHandler extends EventHandler {
  name: 'REQUEST_INFO'
  handler: () => void
}

export interface InfoResponseHandler extends EventHandler {
  name: 'INFO_RESPONSE'
  handler: (page: Page, selection: Selection[]) => void
}

export type Selection = {
  id: SceneNode['id']
  name: SceneNode['name']
}

export type Page = {
  id: PageNode['id']
  name: PageNode['name']
}