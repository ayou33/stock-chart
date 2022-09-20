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
  REPLAY, // 重绘
  PATCH, // 补丁更新
  FULL, // 完全更新
  EXTENT, // y轴范围更新
  APPEND, // x轴数据新增
}

export type UpdatePayload = {
  readonly symbol: SymbolDescriber | null;
  readonly bars: Bar[];
  readonly latest?: Bar;
  readonly domain: number[];
  level: UpdateLevel,
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

    this._lastChange = {
      level,
      bars,
      latest: this._latest ?? last(bars),
      span: [0, bars.length - 1],
      extent: ex.reverse() as Extent,
      domain: pluck('date', bars),
      symbol: this._symbol,
      lastChange: this._lastChange,
    }

    /**
     * 隔离输出
     */
    return { ...this._lastChange }
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

    this.emit('update', this.makeUpdatePayload(UpdateLevel.APPEND))
  }

  attach (dataFeed: IDataFeed) {
    this._dataEngine.attach(dataFeed)
  }

  setPeriodicity (periodicity: Periodicity) {
    this._dataEngine.setPeriodicity(periodicity)
  }

  load (symbol: string) {
    this._dataEngine.load(symbol)
  }

  stream (patch: Patch) {
    this._dataEngine.stream(patch)
  }
}

export default DataSource
