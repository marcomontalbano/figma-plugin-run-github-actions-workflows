import {
  Button,
  Columns,
  Container,
  Divider,
  LoadingIndicator,
  render,
  Text,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { Fragment, h } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'

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

  if (!settings) {
    return <LoadingIndicator />
  }

  async function addGitHubAction(action: GitHubAction) {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'ADD', payload: action })
    }

    return isValid;
  }

  async function editGitHubAction(index: number, action: GitHubAction) {
    const isValid = await isValidAction(action)

    if (isValid) {
      dispatch({ type: 'EDIT', index, payload: action })
    }

    return isValid;
  }

  function removeGitHubAction(index: number) {
    dispatch({ type: 'REMOVE', index })
  }

  return (
    <Container>

      {
        settings?.actions.map((action, index) => (
          <Fragment>
            <VerticalSpace space="extraLarge" />
            <Columns space='extraSmall' style={{ alignItems: 'center' }}>
              <Text><a target='_blank' href={`https://github.com/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`}>{action.name}</a></Text>
              <ManageAction action={action} onSubmit={(action) => editGitHubAction(index, action)} />
              <Button fullWidth>Run</Button>
              <Button fullWidth destructive onClick={() => removeGitHubAction(index)}>Remove</Button>
            </Columns>
          </Fragment>
        ))
      }

      <VerticalSpace space="extraLarge" />
      <Divider />
      <VerticalSpace space="extraLarge" />

      <Columns space="extraSmall">
        <Button fullWidth onClick={handleInfoButtonClick} secondary>
          Info
        </Button>
        <ManageAction onSubmit={(action) => addGitHubAction(action)} />
      </Columns>
      <VerticalSpace space="small" />

    </Container>
  )
}

export default render(Plugin)
