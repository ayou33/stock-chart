/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { Margin, Padding } from './core/Chart'
import DataSource from './core/DataSource'
import MainAxis, { MainAxisOptions } from './core/MainAxis'
import Series, { SeriesOptions } from './core/Series'
import Drawing from './extend/Drawing'
import Indicator from './extend/Indicator'
import extend from './helper/extend'

export type StockChartOptions = {
  container: string;
  display: {
    theme: 'light';
    crosshair: boolean;
  },
  layout: {
    margin: Margin;
    padding: Padding;
    defaultSeries: SeriesOptions;
    mainAxis: MainAxisOptions;
  },
  format: {},
  event: {},
}

const defaultOptions: StockChartOptions = {
  container: 'jo',
  display: {
    theme: 'light',
    crosshair: true,
  },
  layout: {
    margin: {},
    padding: {},
    defaultSeries: {
      position: 'right',
    },
    mainAxis: {
      height: 100,
    },
  },
  format: {},
  event: {},
}

class StockChart {
  private readonly container: string
  private readonly options: StockChartOptions
  private readonly canvas: HTMLCanvasElement
  private readonly offlineCanvas: HTMLCanvasElement
  private readonly series: Series
  private readonly mainAxis: MainAxis
  private readonly dataSource: DataSource

  private drawing: Drawing
  private indicator: Indicator

  constructor (mixed: string | StockChartOptions) {
    if (typeof mixed === 'string') {
      this.options = defaultOptions
      this.container = mixed
    } else {
      this.options = extend(defaultOptions, mixed)
      this.container = this.options.container
    }

    console.log(this.options)
  }

  setData () {
  }
}

export default StockChart
