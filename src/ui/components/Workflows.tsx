import { IconButton, IconPencil32, IconPlay32, IconPlus32, IconTrash32, Link, VerticalSpace } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, h, type JSX } from 'preact'
import { useCallback } from 'preact/hooks'
import { useSettings, type GitHubActionsWorkflow } from '../../Settings'
import type { NotifyHandler } from '../../types'
import { Title } from './Title'
import { WorkflowFormOverlay } from './WorkflowFormOverlay'

export function Workflows(): JSX.Element {
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
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Title>Workflows</Title>

        <WorkflowFormOverlay
          onSubmit={(workflow) => handleAddWorkflow(workflow)}
          button={
            <IconButton>
              <IconPlus32 />
            </IconButton>
          }
        />
      </div>

      {
        settings?.workflows.map((workflow, index) => (
          <Fragment>
            <VerticalSpace space='small' />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <IconButton onClick={() => handleRunWorkflow(workflow)}>
                <IconPlay32 color='success-pressed' />
              </IconButton>
              <div style={{ flex: '1 1 auto' }}>
                <Link style={{ pointerEvents: 'unset' }} target='_blank' href={`https://github.com/${workflow.owner}/${workflow.repo}/actions/workflows/${workflow.workflow_id}`}>{workflow.name}</Link>
              </div>
              <WorkflowFormOverlay
                workflow={workflow}
                onSubmit={(workflow) => handleEditWorkflow(index, workflow)}
                button={
                  <IconButton><IconPencil32 color='brand' /></IconButton>
                }
              />
              <IconButton onClick={() => handleRemoveWorkflow(index, workflow)}>
                <IconTrash32 color='danger' />
              </IconButton>
            </div>
          </Fragment>
        ))
      }
    </Fragment>
  )
}
