import {
  Button,
  IconPencil32,
  IconPlus32,
  Inline,
  Modal,
  Text,
  Textbox,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { Fragment, FunctionComponent, h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { ButtonIcon } from './ButtonIcon'
import { GitHubAction } from '../../Settings'
import { NotifyHandler } from '../../types'

type Props = {
  action?: GitHubAction
  onSubmit: (action: GitHubAction) => Promise<boolean>
}

export const ManageAction: FunctionComponent<Props> = ({ action: originalAction, onSubmit }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [action, setAction] = useState<Partial<GitHubAction> | undefined>(originalAction)

  function handleClose() {
    setIsOpen(false)
    // @ts-ignore
    setAction(null)
  }

  function handleSubmit() {
    if (!action || !action.access_token || !action.name || !action.owner || !action.ref || !action.repo || !action.workflow_id) {
      emit<NotifyHandler>('NOTIFY', 'All fields are required!', { error: true })
      return
    }

    onSubmit(action as GitHubAction).then(ok => {
      setIsOpen(!ok)
    })
  }

  return (
    <Fragment>
      <ButtonIcon secondary={originalAction !== undefined} onClick={() => setIsOpen(true)}>{originalAction ? <IconPencil32 /> : <IconPlus32 />}</ButtonIcon>

      <Modal
        isOpen={isOpen}
        onCloseButtonClick={handleClose}
        title={originalAction ? `Edit action "${originalAction.name}"` : 'Add action'}
      >
        <div style={{ width: 300, height: 400, padding: 15, overflow: 'auto' }}>
          <Field label='Name' initialValue={isOpen && originalAction?.name} onChange={(name) => setAction((action) => ({ ...action, name }))} />
          <Field label='Access Token (with the `repo` scope)' initialValue={isOpen && originalAction?.access_token} password onChange={(access_token) => setAction((action) => ({ ...action, access_token }))} />
          <Field label='Owner' initialValue={isOpen && originalAction?.owner} placeholder='marcomontalbano' onChange={(owner) => setAction((action) => ({ ...action, owner }))} />
          <Field label='Repo' initialValue={isOpen && originalAction?.repo} placeholder='figma-plugin-trigger-github-action' onChange={(repo) => setAction((action) => ({ ...action, repo }))} />
          <Field label='Ref' initialValue={isOpen && originalAction?.ref} placeholder='main' onChange={(ref) => setAction((action) => ({ ...action, ref }))} />
          <Field label='Workflow ID' initialValue={isOpen && originalAction?.workflow_id} placeholder='dispatch.yaml' onChange={(workflow_id) => setAction((action) => ({ ...action, workflow_id }))} />

          <Text muted>Read more</Text>
          <VerticalSpace space="small" />
          <Text>
            <a target='_blank' href="https://docs.github.com/en/rest/reference/actions#create-a-workflow-dispatch-event">GitHub • Create a workflow dispatch event</a>
          </Text>
          <VerticalSpace space="large" />

          <Inline space='large'>
            <Button destructive secondary onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>{originalAction ? 'Save' : 'Add'}</Button>
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