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
import { useCallback, useEffect, useState } from 'preact/hooks'

import { Action, InfoHandler, InitHandler, LoadSettingsHandler, Settings } from '../types'
import { ManageAction } from './ManageAction'

function Plugin() {
  const [settings, setSettings] = useState<Settings>()

  useEffect(function loadSettings() {
    on<LoadSettingsHandler>('LOAD_SETTINGS', settings => {
      setSettings(settings)
    })

    emit<InitHandler>('INIT')
  }, [])

  function isValidAction(action: Action) {
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

  return (
    <Container>

      {
        settings?.actions.map(action => (
          <Fragment>
            <VerticalSpace space="extraLarge" />
            <Columns space='extraSmall' style={{ alignItems: 'center' }}>
              <Text><a target='_blank' href={`https://github.com/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`}>{action.name}</a></Text>
              <ManageAction action={action} onSubmit={(action) => (console.log(action), isValidAction(action))} />
              <Button fullWidth>Run</Button>
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
        <ManageAction onSubmit={(action) => (console.log(action), isValidAction(action))} />
      </Columns>
      <VerticalSpace space="small" />

    </Container>
  )
}

export default render(Plugin)
