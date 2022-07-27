/**
 *  管理所有需要绘制的要素
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Drawing from '../extend/Drawing'
import Indicator from '../extend/Indicator'
import Marker from '../extend/Marker'
import Chart from './Chart'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly mainAxis = new MainAxis()
  private readonly series: Series[] = []
  private readonly charts: Chart[] = []
  private drawing: Drawing | null = null
  private indicator: Indicator | null = null
  private marker: Marker | null = null


  build () {
    this.mainAxis.draw()
    this.series.forEach(s => s.draw())
    this.charts.forEach(c => c.draw())
  }
}

export default Scene
