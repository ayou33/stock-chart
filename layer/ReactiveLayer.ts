/**
 *  @file         stock-chart/core/ReactiveLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:04
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

class ReactiveLayer extends AbstractLayer implements ILayer {
  readonly board: Board

  constructor (
    layerOptions: LayerOptions, chartOptions: StockChartOptions, applyTransform: () => void) {
    super(layerOptions)

    this.board = new Board({
      ...layerOptions,
      ...chartOptions,
    })
      .render()
      .on('focus', (_, x: number, y: number, date: number) => {
        layerOptions.xAxis.focus(x, date)
        layerOptions.yAxis.focus(y)
      })
      .on('blur', () => {
        layerOptions.xAxis.blur()
        layerOptions.yAxis.blur()
      })
      .on('transform', () => {
        applyTransform()
      })
      .on('focused', (_, a, b) => {
        console.log('ayo', a, b)
      })
  }

  apply (update: UpdatePayload): this {
    this.board.apply(update)

    return this
  }

  resize (): this {
    this.board.resize()

    return this
  }

  destroy () {
    this.board
      .off('*')
      .remove()
  }
}

export default ReactiveLayer
