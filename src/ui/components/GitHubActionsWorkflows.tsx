import { IconCross32, IconPlay32, Inline, Text, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, h, JSX } from 'preact'
import { useCallback } from 'preact/hooks'

import { GitHubActionsWorkflow, useSettings } from '../../Settings'
import { NotifyHandler } from '../../types'
import { ManageWorkflow } from './ManageWorkflow'
import { ButtonIcon } from './ButtonIcon'
import { Title } from './Title'

export function GitHubActionsWorkflows(): JSX.Element {
  const [settings, dispatch] = useSettings()

  const isValidWorkflow = useCallback((workflow: GitHubActionsWorkflow) => {
    // https://docs.github.com/en/rest/reference/actions#get-a-workflow
    return fetch(`https://api.github.com/repos/${workflow.owner}/${workflow.repo}/actions/workflows/${workflow.workflow_id}`, {
      method: 'GET',
      headers: {
        'Authorization': `token ${workflow.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
    })
      .then(async response => {
        const { message: errorMessage, state } = await response.json()

        if (response.status === 200) {
          emit<NotifyHandler>('NOTIFY', `Workflow "${workflow.name}" saved!`)
        } else {
          emit<NotifyHandler>('NOTIFY', `Error when saving workflow with message "${errorMessage}"`, { error: true })
        }

        return state === 'active'
      })
  }, [])

  const handleRunWorkflow = useCallback((workflow: GitHubActionsWorkflow) => {
    console.group('Info')
      console.log('workflow', { ...workflow, access_token: '***' })
      console.group('Inputs')
        console.log('fileKey', settings.fileKey)
        console.log('page', settings.page)
        console.log('selection', settings.selection)
      console.groupEnd()
    console.groupEnd()

    // https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event
    fetch(`https://api.github.com/repos/${workflow.owner}/${workflow.repo}/actions/workflows/${workflow.workflow_id}/dispatches`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${workflow.access_token}`,
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        ref: workflow.ref,
        inputs: {
          fileKey: settings.fileKey,
          page: JSON.stringify(settings.page),
          selection: JSON.stringify(settings.selection)
        }
      })
    })
      .then(async response => {
        if (response.status === 204) {
          emit<NotifyHandler>('NOTIFY', `Workflow "${workflow.name}" triggered!`)
        } else {
          const { message } = await response.json()
          emit<NotifyHandler>('NOTIFY', message, { error: true })
        }
      })
  }, [settings])

  const handleAddWorkflow = useCallback(async (workflow: GitHubActionsWorkflow) => {
    const isValid = await isValidWorkflow(workflow)

    if (isValid) {
      dispatch({ type: 'ADD_WORKFLOW', payload: workflow })
    }

    return isValid;
  }, [])

  const handleEditWorkflow = useCallback(async (index: number, workflow: GitHubActionsWorkflow) => {
    const isValid = await isValidWorkflow(workflow)

    if (isValid) {
      dispatch({ type: 'EDIT_WORKFLOW', index, payload: workflow })
    }

    return isValid;
  }, [])

  const handleRemoveWorkflow = useCallback((index: number, workflow: GitHubActionsWorkflow) => {
    if (confirm(`Do you really want to remove "${workflow.name}" workflow?`)) {
      dispatch({ type: 'REMOVE_WORKFLOW', index })
      emit<NotifyHandler>('NOTIFY', `Workflow "${workflow.name}" removed!`)
    }
  }, [])

  return (
    <Fragment>
      <Title>Workflows</Title>

      {
        settings?.workflows.map((workflow, index) => (
          <Fragment>
            <VerticalSpace space='small' />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Text style={{ flex: '1 1 auto' }}><a target='_blank' href={`https://github.com/${workflow.owner}/${workflow.repo}/actions/workflows/${workflow.workflow_id}`}>{workflow.name}</a></Text>
              <ButtonIcon onClick={() => handleRunWorkflow(workflow)}><IconPlay32 /></ButtonIcon>
              <ManageWorkflow workflow={workflow} onSubmit={(workflow) => handleEditWorkflow(index, workflow)} />
              <ButtonIcon destructive secondary onClick={() => handleRemoveWorkflow(index, workflow)}><IconCross32 /></ButtonIcon>
            </div>
          </Fragment>
        ))
      }

      <VerticalSpace space='large' />
      <Inline space='extraSmall' style={{ textAlign: 'right' }}>
        <ManageWorkflow onSubmit={(workflow) => handleAddWorkflow(workflow)} />
      </Inline>
    </Fragment>
  )
}
