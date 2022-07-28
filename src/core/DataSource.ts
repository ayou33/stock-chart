/**
 *  数据中心
 *  DataSource.ts of project stock-chart
 *  @date 2022/7/25 17:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { clone, last } from 'ramda'
import Event from '../base/Event'
import IDataFeed from '../interface/IDataFeed'
import { StockChartOptions } from '../options'
import DataEngine from './DataEngine'

export type DataSourceEventTypes =
  'beforeSet' | 'set' |
  'beforeChange' | 'change'

export enum ChangeLevel {
  NONE,
  TICK,
  EXTENT,
  SPAN,
  UPDATE,
}

export type ChangeDescribe = {
  level: ChangeLevel,
  bars: Bar[];
  latest: Bar;
  extent: Extent;
  span: Extent;
  domain: number[];
  lastChange: ChangeDescribe | null;
}

class DataSource extends Event<DataSourceEventTypes> {
  private readonly _dataEngine: DataEngine
  private readonly _bars: Bar[] = []
  private readonly _extent: Extent = [-1, 1]
  private readonly _span: Extent = [0, 1]
  private readonly _domain: number[] = []
  private _lastest: Bar | null = null
  private _lastChange: ChangeDescribe | null = null

  constructor (options: StockChartOptions) {
    super()

    this._dataEngine = new DataEngine(options)

    this._dataEngine.on('load', (_, bars: Bar[]) => {
      this.set(bars)
    })
  }

  makeChangePayload (level: ChangeLevel): ChangeDescribe {
    const bars = clone(this._bars)

    const change = {
      level,
      bars,
      latest: last(bars) as Bar,
      extent: [0, 1] as Extent,
      span: [0, 1] as Extent,
      domain: [1],
      lastChange: this._lastChange,
    }

    this._lastChange = change

    return change
  }

  set (data: Bar[]) {
    this.emit('beforeSet', this.makeChangePayload(ChangeLevel.NONE))

    this._bars.splice(0, this._bars.length, ...data)

    this.emit('set', this.makeChangePayload(ChangeLevel.UPDATE))
  }

  bind (dataFeed: IDataFeed) {
    this._dataEngine.bind(dataFeed)
  }

  load (symbol: string) {
    this._dataEngine.load(symbol)
  }
}

export default DataSource
