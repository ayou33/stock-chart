/**
 *  @file         src/indicator/kdj/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:53
 *  @description
 */
import { KDJInputs } from '../../../options.indicator'
import { makeMACalculator } from '../ma/formula'

export type StochasticState = {
  low: number;
  high: number;
  maAddends: number[];
  position: number;
}

export const defaultStochasticState: StochasticState = {
  low: 1000000,
  high: 0,
  maAddends: [],
  position: 0,
}

export type KDJValue = {
  date: number;
  index: number;
  slow: number;
}

function makeStochasticCalculator (
  quotes: Bar[],
  period: number,
  dftHigh = 0,
  dftLow = 1000000,
  field: BarValueField = 'close',
) {
  let high = dftHigh
  let low = dftLow

  return (i: number) => {
    // 计算指定周期内的最大/小值
    for (let k = i - period + 1; k <= i; k++) {
      const quote = quotes[k]
      low = Math.min(low, quote.low ?? quote.close)
      high = Math.max(high, quote.high ?? quote.close)
    }

    return {
      value: (quotes[i][field] - low) / (high - low) * 100,
      high,
      low,
    }
  }
}

export function calcStochastic (
  bars: Bar[],
  inputs: KDJInputs,
  defaults = defaultStochasticState,
  field: BarValueField = 'close',
) {
  const { period, smoothPeriod, slowPeriod } = inputs

  if (bars.length < Math.max(period, smoothPeriod, slowPeriod) + 1) {
    return {
      value: [],
      state: defaults,
    }
  }

  const values: KDJValue[] = []
  const calcSlowMA = makeMACalculator(slowPeriod, defaults.maAddends)
  const calcStochastic = makeStochasticCalculator(bars, period, defaults.high, defaults.low, field)
  const count = bars.length
  const valueFrom = period - 1

  let low = NaN
  let high = NaN

  for (let i = defaults.position; i < count; i++) {
    const quote = bars[i]
    let index = NaN
    let slow = NaN

    if (i >= valueFrom) {
      const { value, high: h, low: l } = calcStochastic(i)
      high = h
      low = l
      index = value
      if (i - valueFrom >= 0) {
        // 从第一个有值的地方开始ma计算
        slow = calcSlowMA(index, i - valueFrom)
      }
    }

    values.push({
      index,
      slow,
      date: quote.date,
    })
  }

  return {
    value: values,
    state: {
      high,
      low,
      maAddends: [],
      position: count,
    },
  }
}
