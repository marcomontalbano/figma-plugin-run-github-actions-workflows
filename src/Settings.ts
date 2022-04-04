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
  actions: GitHubAction[]
}

type LoadAction = {
  type: 'LOAD',
  payload: Settings
}

type AddAction = {
  type: 'ADD',
  payload: GitHubAction
}

type RemoveAction = {
  type: 'REMOVE'
  index: number
}

type EditAction = {
  type: 'EDIT'
  index: number
  payload: GitHubAction
}

type Action = LoadAction | AddAction | RemoveAction | EditAction

export const initialState: Settings = {
  loaded: false,
  actions: []
}

export const useSettings = () => useReducer<Settings, Action>(produce((draft, action) => {
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
}), initialState)