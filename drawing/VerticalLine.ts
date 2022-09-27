/**
 *  @file         stock-chart/drawing/VerticalLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:53
 *  @description
 */
import Line from './Line'

class VerticalLine extends Line {
  private readonly _verticalAngle = Math.PI / 2

  applyAngle () {
    return super.applyAngle(this._verticalAngle)
  }

  protected deriveStart (location: Vector): Vector {
    return [0, location[1]]
  }

  transform (location: Vector): this {
    return super.transform(location, this._verticalAngle)
  }
}

export default VerticalLine
