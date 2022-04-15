import { Container, LoadingIndicator, MiddleAlign } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useEffect } from 'preact/hooks'

import { useSettings } from '../Settings'
import { InitHandler } from '../types'
import { GitHubActionsWorkflows } from './components/GitHubActionsWorkflows'
import { Inputs } from './components/Inputs'



export function Plugin() {
  const [ settings ] = useSettings()

  useEffect(() => {
    emit<InitHandler>('INIT')
  }, [])

  if (!settings.loaded) {
    return (
      <MiddleAlign>
        <LoadingIndicator />
      </MiddleAlign>
    )
  }

  return (
    <Container>
      <Inputs />
      <GitHubActionsWorkflows />
    </Container>
  )
}
