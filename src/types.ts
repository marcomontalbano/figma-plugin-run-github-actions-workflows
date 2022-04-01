import { EventHandler } from '@create-figma-plugin/utilities'

export type Action = {
  name: string

  access_token: string

  owner: string
  repo: string

  /** The ID of the workflow. You can also pass the workflow file name as a string. */
  workflow_id: string

  /** Required. The git reference for the workflow. The reference can be a branch or tag name. */
  ref: string
}

export type Settings = {
  actions: Action[]
}

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
