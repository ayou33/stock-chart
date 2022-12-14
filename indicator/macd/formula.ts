/**
 *  @file         src/indicator/macd/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:27
 *  @description
 */
import { MACDInputs } from '../../options.indicator'
import { makeEMACalculator } from '../ema/formula'

export type MACDState = {
  fast: number;
  slow: number;
  signal: number;
  hist: number;
  position: number;
}

export type MACDValue = Record<'macd' | 'signal' | 'hist' | 'date', number>

const defaultMACD: MACDState = {
  fast: 0,
  slow: 0,
  signal: 0,
  hist: 0,
  position: 0,
}

export function calcMACD (
  bars: Bar[],
  inputs: MACDInputs,
  defaults             = defaultMACD,
  field: BarValueField = 'close',
) {
  const { fastPeriod = 12, slowPeriod = 26, signalPeriod = 9 } = inputs
  const period = Math.max(fastPeriod, slowPeriod, signalPeriod)
  const calcFastEMA = makeEMACalculator(fastPeriod, defaults.fast)
  const calcSlowEMA = makeEMACalculator(slowPeriod, defaults.slow)
  const calcSignalEMA = makeEMACalculator(signalPeriod, defaults.signal)

  const values: MACDValue[] = []

  let fast = NaN
  let slow = NaN
  let macd = NaN
  let signal = NaN
  let hist = NaN

  const count = bars.length

  for (let i = defaults.position; i < count; i++) {
    const bar = bars[i]

    const value = bar[field]

    fast = calcFastEMA(value, i)
    slow = calcSlowEMA(value, i)

    if (i >= period - 1) {
      macd = fast - slow
      signal = calcSignalEMA(macd, i - period + 1)

      if (signal) {
        hist = macd - signal
      }
    }

    values.push({
      macd,
      signal,
      hist,
      date: bar.date,
    })
  }

  return {
    value: values,
    state: {
      fast,
      slow,
      signal,
      hist,
      position: count, // 记录下一个计算的位置，而不是已经计算过的当前位置
    },
  }
}

export default calcMACD
