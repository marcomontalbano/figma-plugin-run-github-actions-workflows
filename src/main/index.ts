import { on, emit, showUI, loadSettingsAsync, saveSettingsAsync } from '@create-figma-plugin/utilities'
import { initialState, Settings } from '../Settings'

import { InfoHandler, InfoUiHandler, InitHandler, LoadSettingsHandler, SaveSettingsHandler } from '../types'

export default function () {

  on<InitHandler>('INIT', function () {
    loadSettingsAsync<Settings>({ ...initialState, loaded: true, fileKey: figma.fileKey }).then(settings => {
      emit<LoadSettingsHandler>('LOAD_SETTINGS', settings)
    })
  })

  on<SaveSettingsHandler>('SAVE_SETTINGS', function (settings) {
    saveSettingsAsync<Settings>(settings)
  })

  on<InfoHandler>('INFO', function () {
    const pageName = figma.currentPage.name
    const fileKey = figma.fileKey
    const selection = figma.currentPage.selection

    console.log('pageName', pageName)
    console.log('fileKey', fileKey)
    console.log('selection', selection)

    emit<InfoUiHandler>('INFO_UI', pageName, fileKey, selection)
  })

  showUI({
    width: 400,
    height: 500
  })

}
