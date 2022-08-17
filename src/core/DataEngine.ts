/**
 *  DataEngine.ts of project stock-chart
 *  @date 2022/7/28 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { last } from 'ramda'
import Event from '../base/Event'
import createDataGenerator from '../helper/createDataGenerator'
import { duration, durationMinute } from '../helper/timeFormat'
import IDataFeed, { Periodicity, SymbolDescriber } from '../interface/IDataFeed'
import { DataSourceOptions } from '../options'

export type DataEvents = 'load' | 'refresh' | 'append'

class DataEngine extends Event<DataEvents> {
  private readonly _options: DataSourceOptions
  private _dataFeed: IDataFeed | null = null
  private _symbol: SymbolDescriber | null = null
  private _periodicity: Required<Periodicity> = {
    interval: 1,
    period: 1,
    timeUnit: 'minute',
  }

  private _duration = durationMinute

  private generator = createDataGenerator(this.onPush.bind(this))

  constructor (options: DataSourceOptions) {
    super()

    this._options = options
  }

  attach (dataFeed: IDataFeed) {
    this._dataFeed = dataFeed
  }

  private updatePeriodicity (p: Periodicity) {
    const timeUnit = p.timeUnit ?? 'minute'
    const period = p.period ?? 1

    this._periodicity = {
      interval: p.interval,
      period,
      timeUnit,
    }

    this._duration = p.interval * duration[timeUnit] * period
  }

  private rollup () {
  }

  private stop () {
    this.generator.stop()
  }

  private onPush (bar: Bar, isCreate = false) {
    this.emit(isCreate ? 'append' : 'refresh', this._symbol, bar)
  }

  continue (latest?: Bar) {
    if (latest) {
      this.generator.start(latest, this._duration)
    }
  }

  async load (symbolCode: string) {
    if (symbolCode && this._dataFeed !== null) {
      const symbol = await this._dataFeed.resolveSymbol(symbolCode)
      const result = await this._dataFeed.read(symbol)

      if (symbol !== this._symbol) {
        if (this._symbol) this._dataFeed.unSubscribe(this._symbol)

        this._symbol = symbol

        this.updatePeriodicity(this._symbol.periodicity)

        if (this._periodicity.period !== 1) {
          this.rollup()
        }
      }

      this.emit('load', symbol, result.data)

      if (this._options.autoFeed) {
        this.stop()
        this.continue(last(result.data))
      }

      this._dataFeed.subscribe(symbol, patch => {
        if (this._symbol?.symbol === patch.symbol && this._symbol.exchange === patch.exchange) {
          this.generator.insert(patch.time, patch.price)
        }
      })

      return result
    }

    return Promise.reject('No symbol or dataFeed provide!')
  }

  stream (patch: Patch) {
    if (this._symbol?.symbol === patch.symbol && this._symbol.exchange === patch.exchange) {
      this.generator.insert(patch.time, patch.price)
    }
  }

  setPeriodicity (periodicity: Periodicity) {
    console.log(periodicity)
  }
}

export default DataEngine
