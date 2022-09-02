/**
 *  @file         src/indicator/ema/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:29
 *  @description
 */
import { pluck } from 'ramda'
import { EMAInputs } from '../../../options.indicator'

export const makeEMACalculator = (period: number, fromEMA = 0) => {
  const multiplier = (2 / (period + 1))
  let acc = 0
  let ema = 0
  let emaPreviousDay = fromEMA

  return (val: number, i: number) => {
    // val为不等于0的空值 忽略
    if (!val && val !== 0) {
      return NaN
    }

    let value: number

    if (i >= period) { // 存在指定长度的回溯数组之后按公式计算ema
      ema = ((val - emaPreviousDay) * multiplier) + emaPreviousDay
      value = ema
    } else if (i === period - 1) { // 初始化第一个ema为sma
      acc += val
      ema = acc / period
      value = ema
    } else { // 0 <= i < period [回溯长度不够时] ema = sma
      acc += val
      ema = acc / (i + 1)
      value = NaN
    }

    // 保存ema
    emaPreviousDay = ema

    // 返回ema的值
    return value
  }
}

export type EMAName = `${IndexName}_${number}`

export type EMAValue = Record<EMAName | 'date', number>

export type EMAState = {
  index: EMAValue;
  position: number;
}

export const defaultEMAState: EMAState = {
  index: {
    date: NaN,
  },
  position: 0,
}

export function calcEMA (
  quotes: Bar[],
  inputs: EMAInputs,
  defaults: EMAState = defaultEMAState,
  field: BarValueField = 'close',
) {
  const count = quotes.length

  if (quotes.length < Math.max(...pluck('period', inputs.periods))) {
    return {
      value: [],
      state: defaults,
    }
  }

  const values: EMAValue[] = []

  const computers = inputs.periods.map(i => ({
    period: i.period,
    offset: i.offset ?? 0,
    compute: makeEMACalculator(i.period, defaults.index[`index_${i.period}_${i.offset ?? 0}`]),
  }))

  for (let i = defaults.position; i < count; i++) {
    const quote = quotes[i]

    const value: EMAValue = {
      date: quote.date,
    }

    for (let k = 0; k < inputs.periods.length; k++) {
      const calculator = computers[k]
      value[`index_${calculator.period}_${calculator.offset}`] = calculator.compute(quote[field], i)
    }

    values.push(value)
  }

  return {
    value: values,
    state: {
      index: values.slice(-1)[0],
      position: count,
    },
  }
}
