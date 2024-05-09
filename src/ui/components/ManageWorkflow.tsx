import {
  Button,
  IconPencil32,
  IconPlus32,
  Inline,
  Link,
  Modal,
  Text,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, h, type FunctionComponent } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import type { GitHubActionsWorkflow } from '../../Settings'
import type { NotifyHandler } from '../../types'
import { ButtonIcon } from './ButtonIcon'
import { FormInput } from './FormInput'

type Props = {
  workflow?: GitHubActionsWorkflow
  onSubmit: (workflow: GitHubActionsWorkflow) => Promise<boolean>
}

export const ManageWorkflow: FunctionComponent<Props> = ({ workflow: originalWorkflow, onSubmit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [workflow, setWorkflow] = useState<Partial<GitHubActionsWorkflow> | undefined>(originalWorkflow)

  function handleClose() {
    setIsOpen(false)
    // @ts-ignore
    setWorkflow(null)
  }

  function handleSubmit() {
    if (!workflow || !workflow.access_token || !workflow.name || !workflow.owner || !workflow.ref || !workflow.repo || !workflow.workflow_id) {
      emit<NotifyHandler>('NOTIFY', 'All fields are required!', { error: true })
      return
    }

    onSubmit(workflow as GitHubActionsWorkflow).then(ok => {
      setIsOpen(!ok)
    })
  }

  return (
    <Fragment>
      <ButtonIcon secondary={originalWorkflow !== undefined} onClick={() => setIsOpen(true)}>{originalWorkflow ? <IconPencil32 /> : <IconPlus32 />}</ButtonIcon>

      <Modal
        open={isOpen}
        onCloseButtonClick={handleClose}
        title={originalWorkflow ? `Edit workflow "${originalWorkflow.name}"` : 'Add workflow'}
      >
        <div style={{ width: 300, height: 400, padding: 15, overflow: 'auto' }}>
          <Field label='Name' initialValue={isOpen && originalWorkflow?.name} onChange={(name) => setWorkflow((workflow) => ({ ...workflow, name }))} />
          <Field label='Access Token (with the `repo` scope)' initialValue={isOpen && originalWorkflow?.access_token} password onChange={(access_token) => setWorkflow((workflow) => ({ ...workflow, access_token }))} />
          <Field label='Owner' initialValue={isOpen && originalWorkflow?.owner} placeholder='marcomontalbano' onChange={(owner) => setWorkflow((workflow) => ({ ...workflow, owner }))} />
          <Field label='Repo' initialValue={isOpen && originalWorkflow?.repo} placeholder='figma-plugin-run-github-actions-workflows' onChange={(repo) => setWorkflow((workflow) => ({ ...workflow, repo }))} />
          <Field label='Ref' initialValue={isOpen && originalWorkflow?.ref} placeholder='main' onChange={(ref) => setWorkflow((workflow) => ({ ...workflow, ref }))} />
          <Field label='Workflow ID' initialValue={isOpen && originalWorkflow?.workflow_id} placeholder='from-figma.yaml' onChange={(workflow_id) => setWorkflow((workflow) => ({ ...workflow, workflow_id }))} />

          <Text muted>Read more</Text>
          <VerticalSpace space='small' />
          <Link target='_blank' href="https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event">GitHub • Create a workflow dispatch event</Link>
          <VerticalSpace space="large" />

          <Inline space='large'>
            <Button secondary onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>{originalWorkflow ? 'Save' : 'Add'}</Button>
          </Inline>
        </div>
      </Modal>
    </Fragment>
  )
}


type FieldProps = {
  label: string
  initialValue?: string | false
  password?: boolean
  placeholder?: string
  onChange: (value: string) => void
}

const Field: FunctionComponent<FieldProps> = ({ label, initialValue, password = false, placeholder, onChange }) => {
  const [value, setValue] = useState<string>(initialValue || '')

  useEffect(function () {
    setValue(initialValue || '')
  }, [initialValue])

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <FormInput
      label={label}
      onValueInput={setValue}
      value={value}
      password={password}
      placeholder={placeholder}
    />
  )
}
