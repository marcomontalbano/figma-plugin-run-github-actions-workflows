import { on, emit, showUI, loadSettingsAsync, saveSettingsAsync } from '@create-figma-plugin/utilities'
import { initialState, Settings } from '../Settings'

import { RequestInfoHandler, InfoResponseHandler, LoadSettingsHandler, SaveSettingsHandler } from '../types'

export default function () {

  on<SaveSettingsHandler>('SAVE_SETTINGS', function (settings) {
    saveSettingsAsync<Settings>(settings)
  })

  on<RequestInfoHandler>('REQUEST_INFO', function () {
    emit<InfoResponseHandler>(
      'INFO_RESPONSE',
      figma.currentPage.name,
      figma.currentPage.selection.map(({ id, name }) => ({ id, name }))
    )
  })

  showUI({
    width: 400,
    height: 500
  })

  loadSettingsAsync<Settings>({ ...initialState, fileKey: figma.fileKey }).then(settings => {
    emit<LoadSettingsHandler>('LOAD_SETTINGS', { ...settings, loaded: true })
  })

}
