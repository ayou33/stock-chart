/**
 *  @file         src/indicator/macd/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:27
 *  @description
 */
import { makeEMACalculator } from '../ema/formula'

export type MACDStudyInputs = {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  fastColor: string;
  slowColor: string;
}

export type MACDState = {
  fast: number;
  slow: number;
  signal: number;
  hist: number;
  index: number;
}

const defaultMACD: MACDState = {
  fast: 0,
  slow: 0,
  signal: 0,
  hist: 0,
  index: 0,
}

export function calcMACD (
  bars: Bar[],
  inputs?: MACDStudyInputs,
  defaults = defaultMACD,
  field: BarValueField = 'close',
) {
  const {
    fastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9,
  } = inputs ?? {}
  const period = Math.max(fastPeriod, slowPeriod, signalPeriod)
  const calcFastEMA = makeEMACalculator(fastPeriod, defaults.fast)
  const calcSlowEMA = makeEMACalculator(slowPeriod, defaults.slow)
  const calcSignalEMA = makeEMACalculator(signalPeriod, defaults.signal)

  const data: Record<'macd' | 'signal' | 'hist' | 'date', number>[] = []

  let fast = NaN
  let slow = NaN
  let macd = NaN
  let signal = NaN
  let hist = NaN

  const count = defaults.index + bars.length

  for (let i = defaults.index; i < count; i++) {
    const bar = bars[i - defaults.index]

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

    data.push({
      macd,
      signal,
      hist,
      date: bar.date,
    })
  }

  return {
    value: data,
    state: {
      fast,
      slow,
      signal,
      hist,
      index: count, // 记录下一个计算的位置，而不是已经计算过的当前位置
    },
  }
}

export default calcMACD
