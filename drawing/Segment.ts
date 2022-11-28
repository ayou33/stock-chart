/**
 *  @file         stock-chart/drawing/Segment.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/11/28 11:35
 *  @description
 */
import { LineOptions } from '../graphics/Line'
import AbstractDrawing from '../super/AbstractDrawing'

export type SegmentOptions = Partial<LineOptions & {}>

const POINT_COUNT = 2

export class Segment extends AbstractDrawing<LineOptions> {
  use ([x, y]: Vector): this {
    this.record(this.evaluate({ x, y }))

    if (this.trace().length >= POINT_COUNT) {
      this.emit('end', this, (ok: boolean) => {
        this.emit(ok ? 'done' : 'fail')
        if (ok) this.ready()
      })
    }

    return this
  }

  draw () {
    return this
  }

  onPointerMove (x: number, y: number): boolean {
    if (this.state.isPending()) {
      this.record(this.evaluate({ x, y }), true)
      this.emit('refresh')
      return false
    } else {
      return super.onPointerMove(x, y)
    }
  }
}

export default Segment
