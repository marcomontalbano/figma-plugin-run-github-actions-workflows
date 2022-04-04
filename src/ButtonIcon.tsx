import { Button, ButtonProps } from '@create-figma-plugin/ui'
import { FunctionComponent, h } from 'preact'

import styles from './ButtonIcon.module.css'

export const ButtonIcon: FunctionComponent<ButtonProps> = ({ children, ...props }) => (
  <Button {...props} class={styles.button} >{children}</Button>
)
