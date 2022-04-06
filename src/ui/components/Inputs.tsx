import { Props, Text, Textbox, TextboxProps, VerticalSpace } from '@create-figma-plugin/ui'
import { h, Fragment, JSX } from 'preact'

import { useSettings } from '../../Settings'
import { Title } from './Title'

export function Inputs(): JSX.Element {
  const [settings, dispatch] = useSettings()

  return (
    <Fragment>
      <Title>Inputs</Title>

      <VerticalSpace space='large' />

      <Input
        label='fileKey'
        required
        onValueInput={fileKey => dispatch({ type: 'EDIT_FILE_KEY', fileKey })}
        value={settings.fileKey || ''} />

      <Input
        label='pageName'
        required
        value={settings.pageName || ''}
        disabled />

      <Input
        label='selection'
        required
        value={JSON.stringify(settings.selection)}
        disabled />
    </Fragment>
  )
}

function Input<Name extends string>({ label, ...textboxProps }: Props<HTMLInputElement, TextboxProps<Name>>): JSX.Element {
  return (
    <Fragment>
      <div>
        {
          label && (
            <Fragment>
              <Text muted>{label}</Text>
              <VerticalSpace space='small' />
            </Fragment>
          )
        }
        <Textbox {...textboxProps} />
        <VerticalSpace space='medium' />
      </div>
    </Fragment>
  )
}
