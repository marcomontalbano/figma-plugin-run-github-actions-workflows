import { render } from '@create-figma-plugin/ui'
import { h } from 'preact'

import { SettingsContext } from '../Settings'
import { Plugin } from './Plugin'

export default render(() => (
  <SettingsContext.Provider>
    <Plugin />
  </SettingsContext.Provider>
))
