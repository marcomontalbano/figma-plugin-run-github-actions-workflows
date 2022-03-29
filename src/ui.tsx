import {
  Button,
  Columns,
  Container,
  render,
  Text,
  TextboxNumeric,
  VerticalSpace
} from '@create-figma-plugin/ui'
import { emit } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'

import { CloseHandler, CreateRectanglesHandler, InfoHandler } from './types'

function Plugin() {
  const [count, setCount] = useState<number | null>(5)
  const [countString, setCountString] = useState('5')
  const handleCreateRectanglesButtonClick = useCallback(
    function () {
      if (count !== null) {
        emit<CreateRectanglesHandler>('CREATE_RECTANGLES', count)
      }
    },
    [count]
  )

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>('CLOSE')
  }, [])

  const handleInfoButtonClick = useCallback(function () {
    emit<InfoHandler>('INFO')
  }, [])

  return (
    <Container>
      <VerticalSpace space="large" />
      <Text muted>Count</Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setCount}
        onValueInput={setCountString}
        value={countString}
      />
      <VerticalSpace space="extraLarge" />
      <Columns space="extraSmall">
        <Button fullWidth onClick={handleCreateRectanglesButtonClick}>
          Create
        </Button>
        <Button fullWidth onClick={handleCloseButtonClick} secondary>
          Close
        </Button>
        <Button fullWidth onClick={handleInfoButtonClick} secondary>
          Info
        </Button>
      </Columns>
      <VerticalSpace space="small" />
    </Container>
  )
}

export default render(Plugin)
