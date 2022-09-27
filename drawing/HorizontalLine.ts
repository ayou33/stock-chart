/**
 *  @file         stock-chart/drawing/HorizontalLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:45
 *  @description
 */
import Line from './Line'

class HorizontalLine extends Line {
  private readonly _horizontalAngle = 0

  applyAngle () {
    return super.applyAngle(this._horizontalAngle)
  }

  protected deriveStart (location: Vector): Vector {
    return [0, location[1]]
  }

  transform (location: Vector): this {
    return super.transform(location, this._horizontalAngle)
  }
}

export default HorizontalLine
