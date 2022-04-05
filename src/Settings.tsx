import { emit, on } from '@create-figma-plugin/utilities'
import produce from 'immer'
import { createContext, FunctionalComponent, h } from 'preact'
import { useContext, useEffect, useReducer } from 'preact/hooks'

import { LoadSettingsHandler, SaveSettingsHandler, Selection } from './types'


export type GitHubAction = {
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
  loaded: boolean
  fileKey: string | undefined
  pageName: string | undefined
  selection: Selection[]
  actions: GitHubAction[]
}

type Action =
  | { type: 'LOAD'; payload: Settings }
  | { type: 'ADD_ACTION'; payload: GitHubAction }
  | { type: 'REMOVE_ACTION'; index: number }
  | { type: 'EDIT_ACTION'; index: number; payload: GitHubAction }
  | { type: 'EDIT_FILE_KEY'; fileKey: string }
  | { type: 'EDIT_SELECTION'; pageName: string; selection: Selection[] }

export const initialState: Settings = {
  loaded: false,
  fileKey: undefined,
  pageName: undefined,
  selection: [],
  actions: []
}

export const useSettingsReducer = () => useReducer<Settings, Action>(produce((draft, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'ADD_ACTION':
      draft.actions.push(action.payload)
      break
    case 'REMOVE_ACTION':
      draft.actions.splice(action.index, 1)
      break
    case 'EDIT_ACTION':
      draft.actions[action.index] = action.payload
      break
    case 'EDIT_FILE_KEY':
      draft.fileKey = action.fileKey
      break;
    case 'EDIT_SELECTION':
      draft.pageName = action.pageName
      draft.selection = action.selection
      break;
  }
}), initialState)

// @ts-expect-error
const OriginalSettingsContext = createContext<[Settings, (action: Action) => void]>();

const SettingsProvider: FunctionalComponent = ({ children }) => {
  const [settings, dispatch] = useSettingsReducer()

  useEffect(function loadSettings() {
    on<LoadSettingsHandler>('LOAD_SETTINGS', settings => {
      console.log(settings)
      dispatch({ type: 'LOAD', payload: settings })
    })
  }, []);

  useEffect(function saveSettings() {
    if (settings.loaded) {
      emit<SaveSettingsHandler>('SAVE_SETTINGS', settings)
    }
  }, [settings])

  return (
    <OriginalSettingsContext.Provider value={[settings, dispatch]}>
      {children}
    </OriginalSettingsContext.Provider>
  );
};

export const SettingsContext = {
  Consumer: OriginalSettingsContext.Consumer,
  Provider: SettingsProvider
};

export const useSettings = () => useContext(OriginalSettingsContext);
