import { useReducer } from 'preact/hooks'
import produce from 'immer'

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
  actions: GitHubAction[]
}

type Action = {
  type: 'LOAD',
  payload: Settings
} | {
  type: 'ADD_ACTION',
  payload: GitHubAction
} | {
  type: 'REMOVE_ACTION'
  index: number
} | {
  type: 'EDIT_ACTION'
  index: number
  payload: GitHubAction
} | {
  type: 'EDIT_FILE_KEY',
  fileKey: string
}

export const initialState: Settings = {
  loaded: false,
  fileKey: undefined,
  actions: []
}

export const useSettings = () => useReducer<Settings, Action>(produce((draft, action) => {
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
  }
}), initialState)