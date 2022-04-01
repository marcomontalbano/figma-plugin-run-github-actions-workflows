import {
  Button,
  Inline,
  Modal,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { Fragment, FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { Action } from '../types'

type Props = {
  action?: Action
  onSubmit: (action: Action) => Promise<boolean>
}

export const ManageAction: FunctionComponent<Props> = ({ action: originalAction, onSubmit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [action, setAction] = useState<Partial<Action> | undefined>(originalAction)

  function handleSubmit() {
    if (!action || !action.access_token || !action.name || !action.owner || !action.ref || !action.repo || !action.workflow_id) {
      throw new Error('All fields are required!')
    }

    onSubmit(action as Action).then(ok => {
      setIsOpen(!ok)
    })
  }

  return (
    <Fragment>
      <Button fullWidth secondary={originalAction !== undefined} onClick={() => setIsOpen(true)}>{originalAction ? 'Edit' : 'Add action'}</Button>

      <Modal
        isOpen={isOpen}
        onCloseButtonClick={() => setIsOpen(false)}
        title={originalAction ? `Edit action "${originalAction.name}"` : 'Add action'}
      >
        <div style={{ width: 300, height: 400, padding: 15, overflow: 'auto' }}>
          <Field label='Name' initialValue={action?.name} onChange={(name) => setAction((action) => ({ ...action, name }))} />
          <Field label='Access Token (with the `repo` scope)' initialValue={action?.access_token} password onChange={(access_token) => setAction((action) => ({ ...action, access_token }))} />
          <Field label='Owner' initialValue={action?.owner} placeholder='marcomontalbano' onChange={(owner) => setAction((action) => ({ ...action, owner }))} />
          <Field label='Repo' initialValue={action?.repo} placeholder='figma-export-pdfs-action' onChange={(repo) => setAction((action) => ({ ...action, repo }))} />
          <Field label='Ref' initialValue={action?.ref} placeholder='main' onChange={(ref) => setAction((action) => ({ ...action, ref }))} />
          <Field label='Workflow ID' initialValue={action?.workflow_id} placeholder='dispatch.yaml' onChange={(workflow_id) => setAction((action) => ({ ...action, workflow_id }))} />

          <Text muted>Read more</Text>
          <VerticalSpace space="small" />
          <Text>
            <a target='_blank' href="https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event">GitHub • Create a workflow dispatch event</a>
          </Text>
          <VerticalSpace space="large" />

          <Inline space='large'>
            <Button destructive onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>{originalAction ? 'Save' : 'Add'}</Button>
          </Inline>
        </div>
      </Modal>
    </Fragment>
  )
}


type FieldProps = {
  label: string
  initialValue?: string
  password?: boolean
  placeholder?: string
  onChange: (value: string) => void
}

const Field: FunctionComponent<FieldProps> = ({ label, initialValue, password = false, placeholder, onChange }) => {
  const [value, setValue] = useState<string>(initialValue || '')

  useEffect(() => {
    onChange(value)
  }, [value])

  return (
    <div>
      <Text muted>{label}</Text>
      <VerticalSpace space="small" />
      <Textbox
        onValueInput={setValue}
        value={value}
        password={password}
        placeholder={placeholder}
      />
      <VerticalSpace space="large" />
    </div>
  )
}