import { Reducer, useReducer } from 'preact/hooks'
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
  actions: GitHubAction[]
}

type Action = {
  type: 'LOAD',
  payload: Settings
} | {
  type: 'ADD',
  payload: GitHubAction
} | {
  type: 'REMOVE'
  index: number
} | {
  type: 'EDIT'
  index: number
  payload: GitHubAction
}

const initialState: Settings = {
  loaded: false,
  actions: []
}

const settingsReducer: Reducer<Settings, Action> = produce((draft, action) => {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'ADD':
      draft.actions.push(action.payload)
      break
    case 'REMOVE':
      draft.actions.splice(action.index, 1)
      break
    case 'EDIT':
      draft.actions[action.index] = action.payload
      break
  }
})

export const useSettings = () => useReducer(settingsReducer, initialState)