import {
  Container,
  Divider,
  IconCross32,
  IconPlay32,
  Inline,
  LoadingIndicator,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, FunctionalComponent, h } from 'preact'
import { useCallback, useEffect } from 'preact/hooks'

import { ButtonIcon } from '../ButtonIcon'
import { GitHubAction, useSettings } from '../Settings'
import { InitHandler, NotifyHandler } from '../types'
import { ManageAction } from './ManageAction'


export function Plugin() {
  const [ settings, dispatch ] = useSettings()

  useEffect(function init() {
    emit<InitHandler>('INIT')
  }, [])

  function isValidAction(action: GitHubAction) {
    // https://docs.github.com/en/rest/reference/actions#get-a-workflow
    return fetch(`https://api.github.com/repos/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${action.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    })
      .then(async response => {
        const { message: errorMessage, state } = await response.json()

        if (response.status === 200) {
          emit<NotifyHandler>('NOTIFY', `Action "${action.name}" saved!`)
        } else {
          emit<NotifyHandler>('NOTIFY', `Error when saving action with message "${errorMessage}"`, { error: true })
        }

        return state === 'active'
      })
  }

  const handleRunGitHubAction = useCallback((action: GitHubAction) => {
    console.group('Info')
      console.log('action', { ...action, access_token: '***' })
      console.group('Inputs')
        console.log('fileKey', settings.fileKey)
        console.log('pageName', settings.pageName)
        console.log('selection', settings.selection)
      console.groupEnd()
    console.groupEnd()

    // https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event
    fetch(`https://api.github.com/repos/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${action.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        ref: action.ref,
        inputs: {
          fileKey: settings.fileKey,
          pageName: settings.pageName,
          selection: JSON.stringify(settings.selection)
        }
      })
    })
    .then(async response => {
      if (response.status === 204) {
        emit<NotifyHandler>('NOTIFY', `Action "${action.name}" triggered!`)
      } else {
        const { message } = await response.json()
        emit<NotifyHandler>('NOTIFY', message, { error: true })
      }
    })
  }, [settings])

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

  const handleRemoveGitHubAction = useCallback((index: number, action: GitHubAction) => {
    if (confirm(`Do you really want to remove "${action.name}" action?`)) {
      dispatch({ type: 'REMOVE_ACTION', index })
      emit<NotifyHandler>('NOTIFY', `Action "${action.name}" removed!`)
    }
  }, [])

  if (!settings) {
    return <LoadingIndicator />
  }

  return (
    <Container>
      <VerticalSpace space="extraLarge" />

      <FileKey />
      <Info />

      <Divider />

      {
        settings?.actions.map((action, index) => (
          <Fragment>
            <VerticalSpace space="extraLarge" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Text style={{ flex: '1 1 auto' }}><a target='_blank' href={`https://github.com/${action.owner}/${action.repo}/actions/workflows/${action.workflow_id}`}>{action.name}</a></Text>
              <ButtonIcon onClick={() => handleRunGitHubAction(action)}><IconPlay32 /></ButtonIcon>
              <ManageAction action={action} onSubmit={(action) => handleEditGitHubAction(index, action)} />
              <ButtonIcon destructive secondary onClick={() => handleRemoveGitHubAction(index, action)}><IconCross32 /></ButtonIcon>
            </div>
          </Fragment>
        ))
      }

      <VerticalSpace space="extraLarge" />
      <Inline space="extraSmall" style={{ textAlign: 'right' }}>
        <ManageAction onSubmit={(action) => handleAddGitHubAction(action)} />
      </Inline>
      <VerticalSpace space="small" />

    </Container>
  )
}

const FileKey: FunctionalComponent = () => {
  const [settings, dispatch] = useSettings()

  return (
    <Fragment>
      <Text muted>File key</Text>
      <VerticalSpace space="small" />
      <Textbox
        required
        onValueInput={(value) => dispatch({ type: 'EDIT_FILE_KEY', fileKey: value })}
        value={settings.fileKey || ''}
      />
      <VerticalSpace space="extraLarge" />
    </Fragment>
  )
}

const Info: FunctionalComponent = () => {
  const [settings] = useSettings()

  return (
    <Fragment>
      <div>
        <Text muted>Page name</Text>
        <VerticalSpace space="small" />
        <Textbox required value={settings.pageName || ''} disabled />
        <VerticalSpace space="extraLarge" />
      </div>
      <div>
        <Text muted>Selection</Text>
        <VerticalSpace space="small" />
        <Textbox required value={JSON.stringify(settings.selection)} disabled />
        <VerticalSpace space="extraLarge" />
      </div>
    </Fragment>
  )
}
