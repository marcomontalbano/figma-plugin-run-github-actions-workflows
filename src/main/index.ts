import { emit, loadSettingsAsync, on, saveSettingsAsync, showUI } from '@create-figma-plugin/utilities'
import { initialState, type Settings, type UserSettings } from '../Settings'

import type {
  InfoResponseHandler,
  InitHandler,
  LoadSettingsHandler,
  NotifyHandler,
  RequestInfoHandler,
  SaveSettingsHandler
} from '../types'

export default function () {

  on<InitHandler>('INIT', function() {
    loadSettingsAsync<Settings>(initialState).then(settings => {
      emit<LoadSettingsHandler>('LOAD_SETTINGS', {
        ...settings,
        loaded: true,
        fileKey: figma.root.getPluginData('fileKey')
      })

      console.log('Settings LOADED')
    })
  })

  on<SaveSettingsHandler>('SAVE_SETTINGS', function ({ fileKey, workflows }) {
    saveSettingsAsync<UserSettings>({ workflows }).then(() => {
      figma.root.setPluginData('fileKey', fileKey || '')
      console.log('Settings SAVED')
    })
  })

  on<RequestInfoHandler>('REQUEST_INFO', function () {
    emit<InfoResponseHandler>(
      'INFO_RESPONSE',
      { id: figma.currentPage.id, name: figma.currentPage.name },
      figma.currentPage.selection.map(({ id, name }) => ({ id, name }))
    )
  })

  on<NotifyHandler>('NOTIFY', function (message, options) {
    figma.notify(message, options)
  })

  showUI({
    width: 400,
    height: 500
  })
}
