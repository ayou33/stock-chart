/**
 *  数据中心
 *  DataSource.ts of project stock-chart
 *  @date 2022/7/25 17:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { ReversedArray } from 'lunzi'
import { last, pluck } from 'ramda'
import Event from '../base/Event'
import { extent } from '../helper/extent'
import IDataFeed, { Patch, Periodicity, SymbolDescriber } from '../interface/IDataFeed'
import { DataSourceOptions } from '../options'
import DataEngine from './DataEngine'

export type DataSourceEventTypes = 'beforeUpdate' | 'update' | 'loading' | 'loaded'

export enum UpdateLevel {
  FULL, // 完全更新
  PATCH, // 补丁更新
  EXTENT,
  REPLAY, // 重绘
}

export type UpdatePayload = {
  readonly symbol: SymbolDescriber | null;
  readonly bars: Bar[];
  readonly latest?: Bar;
  readonly domain: number[];
  level: UpdateLevel,
  /**
   * [from, to) 左闭右开 翻遍传入 slice
   */
  span: Extent;
  extent: Extent;
  lastChange: UpdatePayload | null;
}

class DataSource extends Event<DataSourceEventTypes> {
  private readonly _dataEngine: DataEngine
  private readonly _intuitiveBars: ReversedArray<Bar> = new ReversedArray()

  private _symbol: SymbolDescriber | null = null
  private _latest: Bar | null = null
  private _lastChange: UpdatePayload | null = null

  constructor (options: DataSourceOptions) {
    super()

    this._dataEngine = new DataEngine(options)
      .on('loading', () => this.emit('loading'))
      .on('loaded', () => this.emit('loaded'))

    this._dataEngine.on('load', (_, symbol: SymbolDescriber, bars: Bar[]) => {
      this._symbol = symbol
      this.set(bars)
    })

    this._dataEngine.on('refresh', (_, symbol: SymbolDescriber, bar: Bar) => {
      if (symbol === this._symbol) this.refresh(bar)
    })

    this._dataEngine.on('append', (_, symbol: SymbolDescriber, bar: Bar) => {
      if (symbol === this._symbol) this.append(bar)
    })
  }

  /**
   * todo 高效处理append操作
   * @param level
   * @private
   */
  private makeUpdatePayload (level: UpdateLevel): UpdatePayload {
    const bars = [...this._intuitiveBars.value()]

    const ex = extent(bars, d => d.low, d => d.high)

    const payload = {
      level,
      bars,
      latest: this._latest ?? last(bars),
      span: [0, bars.length] as Extent,
      extent: ex.reverse() as Extent,
      domain: pluck('date', bars),
      symbol: this._symbol,
      lastChange: this._lastChange,
    }

    this._lastChange = payload

    return payload
  }

  private set (data: Bar[], symbol?: SymbolDescriber) {
    this._intuitiveBars.empty()
    this._intuitiveBars.unshift(data)

    if (symbol) {
      this._symbol = symbol
    }

    this.emit('update', this.makeUpdatePayload(UpdateLevel.FULL))
  }

  private refresh (bar: Bar) {
    this._latest = bar
    this._intuitiveBars.update(0, this._latest)

    this.emit('update', this.makeUpdatePayload(UpdateLevel.PATCH))
  }

  private append (bar: Bar) {
    this._latest = bar
    this._intuitiveBars.push(this._latest)

    this.emit('update', this.makeUpdatePayload(UpdateLevel.FULL))
  }

  attach (dataFeed: IDataFeed) {
    this._dataEngine.attach(dataFeed)
  }

  setPeriodicity (periodicity: Periodicity) {
    this._dataEngine.setPeriodicity(periodicity)
  }

  load (symbol: string) {
    return this._dataEngine.load(symbol)
  }

  stream (patch: Patch) {
    this._dataEngine.stream(patch)
  }

  destroy () {
    this._dataEngine.stop()
    this._intuitiveBars.empty()
    this._symbol = null
    this._latest = null
    this._lastChange = null
  }
}

export default DataSource
