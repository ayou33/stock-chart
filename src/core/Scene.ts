/**
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Chart from './Chart'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly mainAxis = new MainAxis()
  private readonly series: Series[] = []
  private readonly charts: Chart[] = []

  build () {
    this.mainAxis.draw()
    this.series.forEach(s => s.draw())
    this.charts.forEach(c => c.draw())
  }
}

export default Scene
