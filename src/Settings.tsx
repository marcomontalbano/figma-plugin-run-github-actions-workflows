import { emit, on } from '@create-figma-plugin/utilities'
import produce from 'immer'
import { createContext, FunctionalComponent, h } from 'preact'
import { useContext, useEffect, useReducer } from 'preact/hooks'

import { InfoResponseHandler, LoadSettingsHandler, Page, RequestInfoHandler, SaveSettingsHandler, Selection } from './types'


export type GitHubActionsWorkflow = {
  name: string

  access_token: string

  owner: string
  repo: string

  /** The ID of the workflow. You can also pass the workflow file name as a string. */
  workflow_id: string

  /** Required. The git reference for the workflow. The reference can be a branch or tag name. */
  ref: string
}

export type Settings = UserSettings & DocumentSettings & {
  loaded: boolean
  page: Page | undefined
  selection: Selection[]
}

export type DocumentSettings = {
  fileKey: string | undefined
}

export type UserSettings = {
  workflows: GitHubActionsWorkflow[]
}

type Action =
  | { type: 'LOAD'; payload: Settings }
  | { type: 'ADD_WORKFLOW'; payload: GitHubActionsWorkflow }
  | { type: 'REMOVE_WORKFLOW'; index: number }
  | { type: 'EDIT_WORKFLOW'; index: number; payload: GitHubActionsWorkflow }
  | { type: 'EDIT_FILE_KEY'; fileKey: string }
  | { type: 'EDIT_SELECTION'; page: Page; selection: Selection[] }

export const initialState: Settings = {
  loaded: false,
  fileKey: undefined,
  page: undefined,
  selection: [],
  workflows: []
}

export const useSettingsReducer = () => useReducer<Settings, Action>(produce((draft, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'ADD_WORKFLOW':
      draft.workflows.push(action.payload)
      break
    case 'REMOVE_WORKFLOW':
      draft.workflows.splice(action.index, 1)
      break
    case 'EDIT_WORKFLOW':
      draft.workflows[action.index] = action.payload
      break
    case 'EDIT_FILE_KEY':
      draft.fileKey = action.fileKey
      break;
    case 'EDIT_SELECTION':
      draft.page = action.page
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
      dispatch({ type: 'LOAD', payload: settings })
    })
  }, []);

  useEffect(function saveSettings() {
    if (settings.loaded) {
      emit<SaveSettingsHandler>('SAVE_SETTINGS', settings)
    }
  }, [settings.workflows, settings.fileKey])

  useEffect(function getInfo() {
    on<InfoResponseHandler>('INFO_RESPONSE', (page, selection) => {
      dispatch({ type: 'EDIT_SELECTION', page, selection: selection })
    })

    const interval = setInterval(() => {
      emit<RequestInfoHandler>('REQUEST_INFO')
    }, 100)

    return () => clearInterval(interval)
  }, [])

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
