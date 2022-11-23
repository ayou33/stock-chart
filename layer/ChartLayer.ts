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
import Arrow from '../drawing/Arrow'
import { DrawingOptions, DrawingType } from '../drawing/drawings'
import PositionLine from '../drawing/PositionLine'
import IGraph from '../interface/IGraph'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractDrawing from '../super/AbstractDrawing'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

class ChartLayer extends AbstractLayer implements ILayer {
  private _chart: IGraph | null = null
  private _drawing: AbstractDrawing | null = null
  private _drawings: AbstractDrawing[] = []
  private _board: Board

  constructor (layerOptions: LayerOptions & { board: Board }) {
    super(layerOptions)

    this._board = layerOptions.board

    this._board
      .on('click', (_, location: Vector) => {
        if (this._drawing) {
          this._drawing.use(location)
        }
      })
      .on('focus', (_, x: number, y: number) => {
        R.find(R.invoker(2, 'check')(x, y), this._drawings)
      })
  }

  draw () {
    this._drawings.map(d => d.draw(d.trace().map(p => d.locate(p))))
  }

  apply (update: UpdatePayload): this {
    if (this._chart) {
      this._chart.apply(update)

      if (this._drawing) this._chart.save()

      if (update.level !== UpdateLevel.PATCH) {
        this.draw()
      }
    }

    return this
  }

  replay () {
    this._chart?.replay()
    this.draw()
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

  createDrawing<T extends DrawingType> (type: T, options?: DrawingOptions[T]) {
    if (!this._chart) {
      throw new ReferenceError('No context provide to draw!')
    }

    switch (type) {
      case 'position':
        this._drawings.unshift(
          this._drawing = new PositionLine(this._chart, options as DrawingOptions['position']))
        break
      case 'arrow':
        this._drawings.unshift(
          this._drawing = new Arrow(this._chart, options as DrawingOptions['arrow']))
        break
    }

    if (this._drawing) {
      this._chart?.save()

      return this._drawing
        .on('end done', () => {
          this._drawing = null
        })
        .on('fail', () => {
          this._drawings.shift()
          this.replay()
        })
        .on('remove', (_, d) => {
          this._drawings = R.reject(R.equals(d), this._drawings)
          this.replay()
        })
        .on('activate', (_, receive) => {
          this._board.zoom.interrupt(e => {
            receive(e)
            if (e.type === 'zoom') this.replay()
          })
        })
        .on('deactivate blur', () => {
          this._board.zoom.continue()
          this.replay()
        })
        .on('refresh', () => {
          this.replay()
        })
    }

    throw new TypeError(`Drawing type "${type}" is not recognized!`)
  }

  clear () {
    this._drawing = null
    this._drawings = []
  }
}

export default ChartLayer
