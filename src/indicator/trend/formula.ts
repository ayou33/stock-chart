/**
 *  @file         src/indicator/trend/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:50
 *  @description
 */
import { TrendInputs } from '../../../options.indicator'
import { makeEMACalculator } from '../ema/formula'
import { reduce, min, max } from 'ramda'

export type TrendPointState = {
  index: number;
  factors: Bar[]
  k: number;
  d: number;
}

export const defaultTrendPointState: TrendPointState = {
  index: 0,
  factors: [],
  k: NaN,
  d: NaN,
}

const makeTurningPointCalculator = (
  defaults = defaultTrendPointState,
  period = 13,
  kPeriod = 5,
  dPeriod = 5,
  field: BarValueField = 'close',
) => {
  const factors = [...defaults.factors]

  let lowest = Infinity
  let highest = -Infinity

  const updateExtent = () => {
    lowest = reduce((acc, v) => min(acc, v.low), Infinity, factors) ?? Infinity
    highest = reduce((acc, v) => max(acc, v.high), -Infinity, factors) ?? -Infinity
  }

  const calcEMA5K = makeEMACalculator(kPeriod, defaults.k)
  const calcEMA5D = makeEMACalculator(dPeriod, defaults.d)
  const calcFrom = period - 1
  const calcDFrom = calcFrom + dPeriod

  let value = NaN
  let k = NaN
  let d = NaN

  return (quote: Bar, i: number) => {
    const close = quote[field]

    factors.push(quote)

    if (i >= calcFrom) {
      if (i > calcFrom) {
        factors.shift()
      }

      updateExtent()

      const rsv = (close - lowest) / (highest - lowest)
      k = calcEMA5K(rsv, i - calcFrom)

      if (i >= calcDFrom) {
        d = calcEMA5D(k, i - calcDFrom)
        value = d >= 0.78 ? -1 : (d <= 0.22 ? 1 : NaN)
      } else {
        value = NaN
      }
    } else {
      value = NaN
    }

    return {
      value,
      state: {
        index: i,
        factors,
        k,
        d,
      },
    }
  }
}

const calcVP = (bar: Bar, field: BarValueField = 'close') => {
  const close = bar[field]
  return ((bar.open ?? close) + (bar.high ?? close) + (bar.low ?? close) + close) / 4
}

export type TrendValue = {
  high: number;
  low: number;
  date: number;
  trend: number;
  turn: number;
}

export type TrendState = {
  avg: number;
  fast: number;
  slow: number;
  signal: number;
  trend: number;
  position: number;
  point: TrendPointState;
}

export const defaultTrendState: TrendState = {
  avg: 0,
  fast: 0,
  slow: 0,
  signal: 0,
  trend: NaN,
  position: 0,
  point: defaultTrendPointState,
}

/**
 *  Trend指标
 算法：
 Pivot = (Open+Close+High+Low)/4;
 Pivotma = EMA(Pivot,3);
 Dif = EMA(Pivotma,5) - EMA(Pivotma,8);
 Difma = EMA(DIF,5);
 画图及信号：
 Difma≥0时，Bullish绿色背景，Difma<0时，Bearish红
 色背景，红绿分界线在两根K线的中间
 * @param quotes
 * @param inputs
 * @param defaults
 * @param field
 */
export function calcTrend (
  quotes: Bar[],
  inputs: TrendInputs,
  defaults = defaultTrendState,
  field: BarValueField = 'close',
) {
  const { period, fastPeriod, slowPeriod, signalPeriod } = inputs

  const requiredCount = period + Math.max(fastPeriod, slowPeriod)

  if (quotes.length < (requiredCount + signalPeriod)) {
    return {
      value: [],
      state: defaults,
    }
  }

  const count = quotes.length
  const calcAVGEMA = makeEMACalculator(period, defaults.avg)
  const calcFastEMA = makeEMACalculator(fastPeriod, defaults.fast)
  const calcSlowEMA = makeEMACalculator(slowPeriod, defaults.slow)
  const calcSignalEMA = makeEMACalculator(signalPeriod, defaults.signal)
  const calcTurningPoint = makeTurningPointCalculator(defaults.point)

  const values: TrendValue[] = []

  let vpEMA3 = 0
  let fast = 0
  let slow = 0
  let signal = 0
  let trend = NaN
  let turn = NaN
  let pointState = defaults.point

  for (let i = defaults.position; i < count; i++) {
    const quote = quotes[i]

    if (i >= period) {
      const j = i - period
      const avg = calcVP(quote, field)
      vpEMA3 = calcAVGEMA(avg, i)
      calcFastEMA(vpEMA3, j)
      calcSlowEMA(vpEMA3, j)

      if (i >= requiredCount) {
        fast = calcFastEMA(vpEMA3, j)
        slow = calcSlowEMA(vpEMA3, j)
        signal = calcSignalEMA(fast - slow, i - requiredCount)
        trend = signal >= 0 ? 1 : -1
      }
    }

    const { value, state } = calcTurningPoint(quote, i)

    turn = value

    if (i === count) {
      pointState = state
    }

    values.push({
      high: quote.high ?? quote[field],
      low: quote.low ?? quote[field],
      date: quote.date,
      trend,
      turn,
    })
  }

  return {
    value: values,
    state: {
      avg: vpEMA3,
      fast,
      slow,
      signal,
      trend,
      position: count,
      point: pointState,
    },
  }
}
