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
import { DrawingOptions, DrawingType } from '../drawing/drawings'
import PositionLine from '../drawing/PositionLine'
import IDrawing from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

class ChartLayer extends AbstractLayer implements ILayer {
  private _chart: IGraph | null = null
  private _drawing: IDrawing | null = null
  private _drawings: IDrawing[] = []

  constructor (layerOptions: LayerOptions & { board: Board }) {
    super(layerOptions)

    layerOptions.board
      .on('click', (_, location: Vector) => {
        this._drawing?.use(location)
      })
      .on('focus', (_, x: number, y: number) => {
        R.find(R.invoker(2, 'isContain')(x, y), this._drawings)
      })
  }

  apply (update: UpdatePayload): this {
    this._chart?.apply(update)

    if (this._drawing) this._chart?.save()

    if (update.level !== UpdateLevel.PATCH) {
      this._drawings.map(d => {
        d.draw(
          d.trace().map(([x, y]) => [this.options.xAxis.value(x), this.options.yAxis.value(y)]))
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

  createDrawing <T extends DrawingType>(type: T, options?: DrawingOptions[T]) {
    if (!this._chart) {
      throw new ReferenceError('No context provide to draw!')
    }

    switch (type) {
      case 'position':
        this._drawings.unshift(this._drawing = new PositionLine(this._chart, options))
    }

    if (this._drawing) {
      this._chart?.save()

      return this._drawing
        .on('end done', () => {
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
}

export default ChartLayer
