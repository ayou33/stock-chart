/**
 *  DataEngine.ts of project stock-chart
 *  @date 2022/7/28 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { last } from 'ramda'
import Event from '../base/Event'
import createDataGenerator from '../helper/createDataGenerator'
import { duration, parseResolution } from '../helper/timeFormat'
import IDataFeed, { Patch, Periodicity, SymbolDescriber } from '../interface/IDataFeed'
import { DataSourceOptions } from '../options'

export type DataEvents = 'loading' | 'loaded' | 'load' | 'refresh' | 'append'

class DataEngine extends Event<DataEvents> {
  private readonly _options: DataSourceOptions
  private _dataFeed: IDataFeed | null = null
  private _symbol: SymbolDescriber | null = null
  private _periodicity: Required<Periodicity> | null = null

  private generator = createDataGenerator(this.onPush.bind(this))

  constructor (options: DataSourceOptions) {
    super()

    this._options = options
    this._periodicity = options.periodicity as Required<Periodicity>
  }

  attach (dataFeed: IDataFeed) {
    this._dataFeed = dataFeed
  }

  private rollup () {
    throw new Error('NO IMPLEMENT')
  }

  private stopFeed () {
    this.generator.stop()
  }

  private onPush (bar: Bar, isCreate = false) {
    this.emit(isCreate ? 'append' : 'refresh', this._symbol, bar)
  }

  startFeed (latest?: Bar) {
    if (latest && this._periodicity) {
      const { interval, timeUnit, period } = this._periodicity
      this.generator.start(latest, interval * duration[timeUnit] * period)
    }
  }

  async load (symbolCode: string | SymbolDescriber) {
    if (symbolCode && this._dataFeed !== null) {
      const symbol = typeof symbolCode === 'string'
                     ? await this._dataFeed.resolveSymbol(symbolCode)
                     : symbolCode

      this.emit('loading')

      const result = await this._dataFeed
        .read(symbol, this._periodicity)
        .finally(() => {
          this.emit('loaded')
        })

      if (symbol !== this._symbol) {
        if (this._symbol) this._dataFeed.unSubscribe(this._symbol)

        this._symbol = symbol

        /**
         * 根据时间解析数据精度
         */
        if (!this._periodicity) {
          const latest = last(result.data)
          this._periodicity = latest ? parseResolution(latest.DT).periodicity : null
        }

        if (this._periodicity?.period !== 1) {
          this.rollup()
        }

      }

      this.emit('load', symbol, result.data)

      if (this._options.autoFeed) {
        this.stopFeed()
        this.startFeed(last(result.data))
      }

      this._dataFeed.subscribe(symbol, patch => {
        if (this._symbol?.code === patch.code && this._symbol.exchange === patch.exchange) {
          this.generator.insert(patch.time, patch.price)
        }
      })

      return result
    }

    return Promise.reject('No symbol or dataFeed provide!')
  }

  stream (patch: Patch) {
    if (this._symbol?.code === patch.code && this._symbol.exchange === patch.exchange) {
      this.generator.insert(patch.time, patch.price)
    }
  }

  setPeriodicity (periodicity: Periodicity) {
    this._periodicity = {
      interval: periodicity.interval,
      period: periodicity.period ?? 1,
      timeUnit: periodicity.timeUnit ?? 'minute',
    }

    if (this._symbol) {
      return this.load(this._symbol)
    }

    return Promise.reject('No symbol applied!')
  }

  stop () {
    this.stopFeed()
    if (this._symbol) {
      this._dataFeed?.unSubscribe(this._symbol)
      this._dataFeed = null
      this._symbol = null
    }
    this._periodicity = null
  }
}

export default DataEngine
