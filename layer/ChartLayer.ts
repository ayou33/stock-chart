/**
 *  @file         stock-chart/core/ChartLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:03
 *  @description
 */
import * as R from 'ramda'
import Candle from '../chart/Candle'
import Mountain from '../chart/Mountain'
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import Arrow from '../drawing/Arrow'
import Segment from '../drawing/Segment'
import Text from '../drawing/Text'
import { DrawingOptions, DrawingType } from '../drawing/drawings'
import PositionLine from '../drawing/PositionLine'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractChart from '../super/AbstractChart'
import AbstractDrawing from '../super/AbstractDrawing'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

class ChartLayer extends AbstractLayer implements ILayer {
  chart: AbstractChart | null = null
  private _drawing: AbstractDrawing | null = null
  private _drawings: AbstractDrawing[] = []
  private _board: Board
  private _busy: boolean = false


  constructor (layerOptions: LayerOptions & { board: Board }) {
    super(layerOptions)

    this._board = layerOptions.board

    this._board
      .on('click', (_, location: Vector) => {
        this._drawing?.use(location)
      })
      .on('focus', (_, x: number, y: number) => {
        if (!this._busy){
          R.find(d => d.onPointerMove(x, y), this._drawings)
        }

        this._board.focusChart(this.chart?.of(layerOptions.xAxis.scale.xToIndex(x)))
      })
      .on('contextmenu', (_, e: MouseEvent) => {
        if (this._drawing?.state.isPending()) {
          e.preventDefault()
          this.remove(this._drawing)
        }
      })

    layerOptions.xAxis
  }

  draw (redraw = false) {
    this._drawings.map(d => (redraw ? d.redraw() : d.draw()))
  }

  apply (update: UpdatePayload): this {
    if (this.chart) {
      this.chart.apply(update)

      // if (this._drawing) this.chart.save()

      if (update.level !== UpdateLevel.PATCH) {
        this.draw(true)
      }
    }

    return this
  }

  replay () {
    this.chart?.replay()
    this.draw()
  }

  resize (): this {
    this.chart?.resize()

    return this
  }

  addChart (options: StockChartOptions) {
    switch (options.type) {
      case 'candle':
        this.chart = new Candle({
          ...this.options,
          ...options,
        })
        break
      case 'mountain':
        this.chart = new Mountain({
          ...this.options,
          ...options,
        })
        break
    }

    this.chart?.prepend()

    return this
  }

  createDrawing<T extends DrawingType> (type: T, options?: DrawingOptions[T]) {
    if (!this.chart) {
      throw new ReferenceError('No context provide to draw!')
    }

    switch (type) {
      case 'position':
        this._drawings.unshift(
          this._drawing = new PositionLine(this.chart, options as DrawingOptions['position']))
        break
      case 'segment':
        this._drawings.unshift(
          this._drawing = new Segment(this.chart, options as DrawingOptions['segment']))
        break
      case 'arrow':
        this._drawings.unshift(
          this._drawing = new Arrow(this.chart, options as DrawingOptions['arrow']))
        break
      case 'text':
        this._drawings.unshift(
          this._drawing = new Text(this.chart, options as DrawingOptions['text']))
        break
    }

    if (this._drawing) {
      this.chart?.save()

      return this._drawing
        .on('end done', () => {
          this._drawing = null
        })
        .on('fail', () => {
          this._drawings.shift()
          this.replay()
        })
        .on('remove', (_, d) => {
          this._board.zoom?.continue()
          this.remove(d)
        })
        .on('activate', (_, receive) => {
          this._board.zoom?.interrupt(e => {
            receive(e)
            if (e.type === 'zoom') this.replay()
          })
        })
        .on('blur', () => {
          this._board.zoom?.continue()
          this.replay()
        })
        .on('refresh', () => {
          this.replay()
        })
        .on('busy', () => {
          this._busy = true
        })
        .on('free', () => {
          this._busy = false
        })
    }

    throw new TypeError(`Drawing type "${type}" is not recognized!`)
  }

  remove (d?: AbstractDrawing) {
    this._drawings = d ? R.reject(R.equals(d), this._drawings) : []
    this._drawing = null
    this.replay()
  }

  destroy () {
    this._drawings = []
    this._drawing = null
    this.chart?.remove()
  }

  clearDrawing () {
    this.remove()
  }
}

export default ChartLayer
