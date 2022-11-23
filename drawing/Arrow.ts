/**
 *  @file         stock-chart/drawing/Arrow.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/23 15:43
 *  @description
 */
import extend from '../helper/extend'
import { DrawingPoint } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import arrowUpSrc from './arrow_up@2x.png'
import arrowDownSrc from './arrow_down@2x.png'

export enum ArrowDir {
  UP,
  DOWN
}

export type ArrowOptions = Partial<{
  dir: ArrowDir;
}>

export class Arrow extends AbstractDrawing<Required<ArrowOptions>> {
  private readonly $img = new Image()
  private _dir: ArrowDir

  constructor (chart: IGraph, options?: ArrowOptions) {
    super(chart, extend({ dir: ArrowDir.UP }, options ?? {}))

    this.$img.onload = () => this.emit('refresh')

    this.$img.src = this.options.dir === ArrowDir.DOWN ? arrowDownSrc : arrowUpSrc

    this._dir = this.options.dir
  }

  get _isDown () {
    return this._dir === ArrowDir.DOWN
  }

  draw (points: Vector[]): this {
    const [x, y] = points[0]
    const ctx = this.chart.context

    ctx.drawImage(this.$img, x - 12, y - (this._isDown ? 24 : 0), 24, 24)

    return this
  }

  render (points: DrawingPoint[], dir: ArrowDir) {
    this._dir = dir
    const [x, y] = this.locate(points[0])
    this.push({ ...points[0], x, y })
    this.draw([[x, y]])
    this.emit('done')
    this.ready()

    return this
  }
}

export default Arrow
