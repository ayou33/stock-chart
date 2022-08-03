/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IMainAxis from '../interface/IMainAxis'

class MainAxis implements IMainAxis {
  bandWidth (width?: number): number {
    return 0
  }

  domain (domain?: number[]): number[] {
    return []
  }

  fx (date: number): number | undefined {
    return undefined
  }

  invertX (x: number): number | undefined {
    return undefined
  }

  padding (padding?: number): number {
    return 0
  }

  range (range?: Extent): Extent {
    return [0, 1]
  }

  step (): number {
    return 0
  }
}

export default MainAxis
