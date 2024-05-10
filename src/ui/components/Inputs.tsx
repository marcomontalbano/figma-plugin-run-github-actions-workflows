import { VerticalSpace } from '@create-figma-plugin/ui'
import { Fragment, h, type JSX } from 'preact'
import { useSettings } from '../../Settings'
import { FormInput } from './FormInput'
import { Title } from './Title'

export function Inputs(): JSX.Element {
  const [settings, dispatch] = useSettings()

  return (
    <Fragment>
      <Title>Inputs</Title>

      <VerticalSpace space='large' />

      <FormInput
        label='fileKey'
        onValueInput={fileKey => dispatch({ type: 'EDIT_FILE_KEY', fileKey })}
        value={settings.fileKey || ''} />

      <FormInput
        label='page'
        value={JSON.stringify(settings.page) || ''}
        disabled />

      <FormInput
        label='selection'
        value={JSON.stringify(settings.selection)}
        disabled />
    </Fragment>
  )
}
