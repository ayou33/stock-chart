/**
 *  @file         src/indicator/rsi/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:52
 *  @description
 */
import { RSIInputs } from '../../../options.indicator'

type StateName = `${IndexName}_${'gain' | 'loss'}`

export type RSIState = {
  [p in StateName | 'position']: number;
}

export const defaultRSIState: RSIState = {
  position: 0,
}

export type RSIValue = {
  [p in IndexName | 'date']: number;
}

/**
 *
 * @param period
 * @param gain
 * @param loss
 */
const makeRSICalculator = (period: number, gain = 0, loss = 0) => {
  let avgGain = gain
  let avgLoss = loss

  const calc = (avgGain: number, avgLoss: number) => {
    if (avgLoss === 0) return 100
    const rs = avgGain / avgLoss
    return 100 - (100 / (1 + rs))
  }

  return (change: number, i: number) => {
    let value = NaN

    if (!change && change !== 0) {
      return {
        value,
        gain: avgGain,
        loss: avgLoss,
      }
    }

    if (i >= period) { // 跟新平均加/减
      if (change > 0) {
        avgGain = ((avgGain * (period - 1)) + change) / period
        avgLoss = avgLoss * (period - 1) / period
      } else {
        avgLoss = ((avgLoss * (period - 1)) + (change * -1)) / period
        avgGain = avgGain * (period - 1) / period
      }
      value = calc(avgGain, avgLoss)
    } else { // 回溯数据不够 计算累加/减
      if (change < 0) avgLoss -= change
      else avgGain += change

      if (i === period - 1) { // 回溯数据足够 切换到平均加/减
        avgGain /= period
        avgLoss /= period
      }
    }

    return {
      value,
      gain: avgGain,
      loss: avgLoss,
    }
  }
}

export function calcRSI (
  quotes: Bar[],
  inputs: RSIInputs,
  defaults = defaultRSIState,
  field: BarValueField = 'close',
) {
  const periods = inputs.periods

  if (quotes.length < Math.max(...periods) + 1) {
    return {
      value: [],
      state: defaults,
    }
  }

  const state: RSIState = {
    position: 0,
  }
  const values: RSIValue[] = []
  const count = quotes.length
  const computers = periods.map(p => makeRSICalculator(p, defaults[`index_${p}_gain`], defaults[`index_${p}_loss`]))

  for (let i = defaults.position; i < count; i++) {
    const quote = quotes[i]
    const change = quote[field] - quotes[i - 1]?.[field]
    const value: RSIValue = {
      date: quote.date,
    }

    for (let k = 0, pl = periods.length; k < pl; k++) {
      const p = periods[k]
      const { value: rsi, gain, loss } = computers[k](change, i)

      value[`index_${p}`] = rsi
      state[`index_${p}_gain`] = gain
      state[`index_${p}_loss`] = loss
    }

    values.push(value)
  }

  return {
    value: values,
    state: {
      position: count,
      rsi: state,
    },
  }
}
