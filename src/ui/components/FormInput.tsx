import { Text, Textbox, VerticalSpace, type TextboxProps } from '@create-figma-plugin/ui'
import { Fragment, h, type JSX } from 'preact'

export function FormInput({ label, ...textboxProps }: TextboxProps & { label: string }): JSX.Element {
  return (
    <Fragment>
      <Text muted>{label}</Text>
      <VerticalSpace space='small' />
      <Textbox label={label} variant='underline' {...textboxProps} />
      <VerticalSpace space='extraLarge' />
    </Fragment>
  )
}
