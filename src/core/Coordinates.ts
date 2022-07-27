/**
 *  二维坐标系统
 *  Coordinates.ts of project stock-chart
 *  @date 2022/7/27 18:02
 *  @author 阿佑[ayooooo@petalmail.com]
 */
class Coordinates {
  private readonly origin: Vector
  xScale = 1
  yScale = 1
  // transform: Transform

  constructor (origin: Vector = [0, 0]) {
    this.origin = origin
  }
}

export default Coordinates
