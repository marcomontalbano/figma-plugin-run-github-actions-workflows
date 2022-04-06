import { on, emit, showUI, loadSettingsAsync, saveSettingsAsync } from '@create-figma-plugin/utilities'
import { initialState, UserSettings, Settings } from '../Settings'

import { RequestInfoHandler, InfoResponseHandler, LoadSettingsHandler, SaveSettingsHandler, InitHandler, NotifyHandler } from '../types'

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

  on<SaveSettingsHandler>('SAVE_SETTINGS', function ({ fileKey, actions }) {
    saveSettingsAsync<UserSettings>({ actions }).then(() => {
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
