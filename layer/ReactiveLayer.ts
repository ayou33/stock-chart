/**
 *  @file         stock-chart/core/ReactiveLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:04
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import HorizontalLine from '../drawing/HorizontalLine'
import IDrawing from '../interface/IDrawing'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

export type DrawingTypes = 'position' | 'trendLine' | 'text' | 'dir' | string

class ReactiveLayer extends AbstractLayer implements ILayer {
  private readonly _board: Board
  private drawing: IDrawing | null = null
  private drawings: IDrawing[] = []

  constructor (
    layerOptions: LayerOptions, chartOptions: StockChartOptions, applyTransform: () => void) {
    super(layerOptions)

    this._board = new Board({
      ...layerOptions,
      ...chartOptions,
    })
      .render()
      .on('focus', (_, x: number, y: number, date: number) => {
        layerOptions.xAxis.focus(x, date)
        layerOptions.yAxis.focus(y, NaN)
      })
      .on('blur', () => {
        layerOptions.xAxis.blur()
        layerOptions.yAxis.blur()
      })
      .on('transform', () => {
        applyTransform()
      })
  }

  createDrawing (type: DrawingTypes) {
    switch (type) {
      case 'position':
        this.drawings.push(this.drawing = new HorizontalLine(this._board.context))
        return this.drawing
    }

    throw new TypeError(`Drawing type "${type}" is not recognized!`)
  }

  renderDrawing () {}

  board () {
    return this._board
  }

  apply (update: UpdatePayload): this {
    this._board.apply(update)

    return this
  }

  resize (): this {
    this._board.resize()

    return this
  }
}

export default ReactiveLayer
