import {
  Container,
  Divider,
  IconCross32,
  IconPlay32,
  Inline,
  LoadingIndicator,
  render,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'
import { ButtonIcon } from '../ButtonIcon'

import { GitHubAction, useSettings } from '../Settings'
import { InitHandler, LoadSettingsHandler, SaveSettingsHandler } from '../types'
import { ManageAction } from './ManageAction'

function Plugin() {
  const [settings, dispatch] = useSettings()

  useEffect(function loadSettings() {
    on<LoadSettingsHandler>('LOAD_SETTINGS', settings => {
      dispatch({ type: 'LOAD', payload: settings })
    })

    emit<InitHandler>('INIT')
  }, [])

  useEffect(function saveSettings() {
    if (settings.loaded) {
      emit<SaveSettingsHandler>('SAVE_SETTINGS', settings)
    }
  }, [settings])

  function isValidAction(action: GitHubAction) {
    // https://docs.github.com/en/rest/reference/actions#get-a-workflow
    return fetch(`https://api.github.com/repos/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${action.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    })
      .then(response => response.json())
      .then(json => json.state === 'active')
  }

  const handleRunGitHubAction = useCallback((action: GitHubAction) => {
    console.log('action', action)
    // emit<InfoHandler>('INFO')
  }, [])

  const handleAddGitHubAction = useCallback(async (action: GitHubAction) => {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'ADD_ACTION', payload: action })
    }

    return isValid;
  }, [])

  const handleEditGitHubAction = useCallback(async(index: number, action: GitHubAction) => {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'EDIT_ACTION', index, payload: action })
    }

    return isValid;
  }, [])

  const handleRemoveGitHubAction = useCallback((index: number) => {
    dispatch({ type: 'REMOVE_ACTION', index })
  }, [])

  if (!settings) {
    return <LoadingIndicator />
  }

  return (
    <Container>
      <VerticalSpace space="extraLarge" />

      <Text muted>File key</Text>
      <VerticalSpace space="small" />
      <Textbox
        required
        onValueInput={(value) => dispatch({ type: 'EDIT_FILE_KEY', fileKey: value }) }
        value={settings.fileKey || ''}
      />
      <VerticalSpace space="extraLarge" />
      <Divider />

      {
        settings?.actions.map((action, index) => (
          <Fragment>
            <VerticalSpace space="extraLarge" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Text style={{ flex: '1 1 auto' }}><a target='_blank' href={`https://github.com/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`}>{action.name}</a></Text>
              <ButtonIcon onClick={() => handleRunGitHubAction(action)}><IconPlay32 /></ButtonIcon>
              <ManageAction action={action} onSubmit={(action) => handleEditGitHubAction(index, action)} />
              <ButtonIcon destructive secondary onClick={() => handleRemoveGitHubAction(index)}><IconCross32 /></ButtonIcon>
            </div>
          </Fragment>
        ))
      }

      {/* <VerticalSpace space="extraLarge" />
      <Divider /> */}
      <VerticalSpace space="extraLarge" />

      <Inline space="extraSmall" style={{ textAlign: 'right' }}>
        <ManageAction onSubmit={(action) => handleAddGitHubAction(action)} />
      </Inline>
      <VerticalSpace space="small" />

    </Container>
  )
}

export default render(Plugin)
