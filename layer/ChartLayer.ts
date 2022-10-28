/**
 *  @file         stock-chart/core/ChartLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:03
 *  @description
 */
import * as R from 'ramda'
import Candle from '../chart/Candle'
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import PositionLine from '../drawing/PositionLine'
import IDrawing from '../interface/IDrawing'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractChart from '../super/AbstractChart'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'
import { DrawingTypes } from './ReactiveLayer'

class ChartLayer extends AbstractLayer implements ILayer {
  private _chart: AbstractChart | null = null
  private _drawing: IDrawing | null = null
  private _drawings: IDrawing[] = []

  constructor (layerOptions: LayerOptions & { board: Board }) {
    super(layerOptions)

    layerOptions.board
      .on('click', (_, point: Vector) => {
        this._drawing?.use(
          point,
          [layerOptions.xAxis.invert(point[0]), layerOptions.yAxis.invert(point[1])],
        )
      })
  }

  apply (update: UpdatePayload): this {
    this._chart?.apply(update)

    if (this._drawing) this._chart?.save()

    if (update.level !== UpdateLevel.PATCH) {
      this._drawings.map(d => {
        d.draw(
          d.positions().map(([x, y]) => [this.options.xAxis.value(x), this.options.yAxis.value(y)]))
      })
    }

    return this
  }

  resize (): this {
    this._chart?.resize()

    return this
  }

  addChart (type: 'candle' | 'mountain', options: StockChartOptions) {
    switch (type) {
      case 'candle':
        this._chart = new Candle({
          ...this.options,
          ...options,
        })
        break
    }

    this._chart?.prepend()

    return this
  }

  createDrawing (type: DrawingTypes) {
    if (!this._chart) {
      throw new ReferenceError('No context provide to draw!')
    }

    switch (type) {
      case 'position':
        this._drawings.push(this._drawing = new PositionLine(this._chart.context))
    }

    if (this._drawing) {

      this._chart.save()

      return this._drawing
        .on('end', () => {
          this._drawing = null
        })
        .on('fail', () => {
          this._drawings.pop()
          this._chart?.restore()
        })
        .on('remove', (_, d) => {
          this._drawings = R.reject(R.equals(d), this._drawings)
          this._chart?.restore()
        })
    }

    throw new TypeError(`Drawing type "${type}" is not recognized!`)
  }

  renderDrawing () {}
}

export default ChartLayer
