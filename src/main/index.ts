import { on, once, emit, showUI } from '@create-figma-plugin/utilities'

import { CloseHandler, CreateRectanglesHandler, InfoHandler, InfoUiHandler } from '../types'

export default function () {

  once<CreateRectanglesHandler>('CREATE_RECTANGLES', function (count: number) {
    const nodes: Array<SceneNode> = []
    for (let i = 0; i < count; i++) {
      const rect = figma.createRectangle()
      rect.x = i * 150
      rect.fills = [
        {
          type: 'SOLID',
          color: { r: 1, g: 0.5, b: 0 }
        }
      ]
      figma.currentPage.appendChild(rect)
      nodes.push(rect)
    }
    figma.currentPage.selection = nodes
    figma.viewport.scrollAndZoomIntoView(nodes)
    figma.closePlugin()
  })

  on<InfoHandler>('INFO', function () {
    const pageName = figma.currentPage.name
    const fileKey = figma.fileKey
    const selection = figma.currentPage.selection

    console.log('pageName', pageName)
    console.log('fileKey', fileKey)
    console.log('selection', selection)

    emit<InfoUiHandler>('INFO_UI', pageName, fileKey, selection)
  })

  once<CloseHandler>('CLOSE', function () {
    figma.closePlugin()
  })

  

  showUI({
    width: 240,
    height: 137
  })

}
