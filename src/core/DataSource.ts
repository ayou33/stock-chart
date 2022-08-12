/**
 *  数据中心
 *  DataSource.ts of project stock-chart
 *  @date 2022/7/25 17:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { clone, last, pluck } from 'ramda'
import Event from '../base/Event'
import { extent } from '../helper/extent'
import IDataFeed, { Resolution } from '../interface/IDataFeed'
import { StockChartOptions } from '../options'
import DataEngine from './DataEngine'
import { ReversedArray } from 'lunzi'

export type DataSourceEventTypes =
  'beforeSet' | 'set' |
  'beforeChange' | 'change'

export enum UpdateLevel {
  NONE, // 仅重绘
  STREAM, // 更新最新一条数据
  ALL, // 更新配置并重绘
  EXTENT, // y轴范围更新
  DATA, // x轴数据更新
}

export type UpdatePayload = {
  level: UpdateLevel,
  latest?: Bar;
  bars: Bar[];
  extent: Extent;
  domain: number[];
  lastChange: UpdatePayload | null;
}

class DataSource extends Event<DataSourceEventTypes> {
  private readonly _dataEngine: DataEngine
  private readonly _bars: ReversedArray<Bar> = new ReversedArray()

  private _latest: Bar | null = null
  private _lastChange: UpdatePayload | null = null

  constructor (options: StockChartOptions) {
    super()

    this._dataEngine = new DataEngine(options)

    this._dataEngine.on('load', (_, bars: Bar[]) => {
      this.set(bars)
    })

    this._dataEngine.on('refresh', (_, bar: Bar) => {
      this.refresh(bar)
    })

    this._dataEngine.on('append', (_, bar: Bar) => {
      this.append(bar)
    })
  }

  makeUpdatePayload (level: UpdateLevel): UpdatePayload {
    const bars = clone<Bar[]>(this._bars.value())

    const ex = extent(bars, d => d.low, d => d.high)

    const change = {
      level,
      bars,
      latest: last(bars),
      extent: ex.reverse() as Extent,
      domain: pluck('date', bars),
      lastChange: this._lastChange,
    }

    this._lastChange = change

    return change
  }

  set (data: Bar[]) {
    this.emit('beforeSet', this.makeUpdatePayload(UpdateLevel.NONE))

    this._bars.unshift(data)

    this.emit('set', this.makeUpdatePayload(UpdateLevel.ALL))
  }

  refresh (bar: Bar) {
    this._latest = bar
  }

  append (bar: Bar) {
    this._latest = bar
    this._bars.push(this._latest)
  }

  attach (dataFeed: IDataFeed) {
    this._dataEngine.attach(dataFeed)
  }

  load (symbol: string, resolution: Resolution) {
    this._dataEngine.load(symbol, resolution)
  }
}

export default DataSource
