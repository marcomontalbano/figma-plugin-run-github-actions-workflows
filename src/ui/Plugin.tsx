import { Container, LoadingIndicator, MiddleAlign } from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useEffect } from 'preact/hooks'
import { useSettings } from '../Settings'
import type { InitHandler } from '../types'
import { Inputs } from './components/Inputs'
import { Workflows } from './components/Workflows'

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
    <Container space='small'>
      <Inputs />
      <Workflows />
    </Container>
  )
}
