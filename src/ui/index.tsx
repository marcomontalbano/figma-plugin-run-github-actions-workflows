import {
  Container,
  Divider,
  IconCross32,
  IconInfo32,
  IconPlay32,
  Inline,
  LoadingIndicator,
  render,
  Text,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'
import { ButtonIcon } from '../ButtonIcon'

import { GitHubAction, useSettings } from '../Settings'
import { InfoHandler, InitHandler, LoadSettingsHandler, SaveSettingsHandler } from '../types'
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

  const handleInfoButtonClick = useCallback(function () {
    emit<InfoHandler>('INFO')
  }, [])

  function handleRunGitHubAction(action: GitHubAction) {
    console.log('action', action)
  }

  async function handleAddGitHubAction(action: GitHubAction) {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'ADD', payload: action })
    }

    return isValid;
  }

  async function handleEditGitHubAction(index: number, action: GitHubAction) {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'EDIT', index, payload: action })
    }

    return isValid;
  }

  function handleRemoveGitHubAction(index: number) {
    dispatch({ type: 'REMOVE', index })
  }

  if (!settings) {
    return <LoadingIndicator />
  }

  return (
    <Container>

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

      <VerticalSpace space="extraLarge" />
      <Divider />
      <VerticalSpace space="extraLarge" />

      <Inline space="extraSmall" style={{ textAlign: 'right' }}>
        <ButtonIcon onClick={handleInfoButtonClick} secondary><IconInfo32/></ButtonIcon>
        <ManageAction onSubmit={(action) => handleAddGitHubAction(action)} />
      </Inline>
      <VerticalSpace space="small" />

    </Container>
  )
}

export default render(Plugin)
