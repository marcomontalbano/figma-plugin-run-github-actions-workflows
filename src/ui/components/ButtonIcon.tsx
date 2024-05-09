import { Button, type ButtonProps } from '@create-figma-plugin/ui'
import { type FunctionComponent, h } from 'preact'

import styles from './ButtonIcon.module.css'

export const ButtonIcon: FunctionComponent<ButtonProps> = ({ children, ...props }) => (
  <Button {...props} class={styles.button} >{children}</Button>
)
