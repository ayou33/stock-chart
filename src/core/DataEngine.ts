/**
 *  DataEngine.ts of project stock-chart
 *  @date 2022/7/28 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import { duration, durationMinute } from '../helper/timeFormat'
import IDataFeed, { Periodicity, SymbolDescriber } from '../interface/IDataFeed'

export type DataEvents = 'load' | 'refresh' | 'append'

class DataEngine extends Event<DataEvents> {
  private _dataFeed: IDataFeed | null = null
  private _symbol: SymbolDescriber | null = null
  private _periodicity: Required<Periodicity> = {
    interval: 1,
    period: 1,
    timeUnit: 'minute',
  }

  private _duration = durationMinute

  private _phaseEnd = 0

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

      this.emit('load', symbol, result)

      this._dataFeed.subscribe(symbol, subscription => {
        if (this._symbol) {
          this.stream({
            symbol: this._symbol.symbol,
            exchange: this._symbol.exchange,
            ...subscription,
          })
        }
      })

      return result
    }

    return Promise.reject('No symbol or dataFeed provide!')
  }

  private stream (patch: Patch) {
    if (patch.time > this._phaseEnd) {
      this.emit('append', this._symbol, {})
    } else {
      this.emit('refresh', this._symbol, {})
    }
  }
}

export default DataEngine
