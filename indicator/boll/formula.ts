/**
 *  @file         src/indicator/boll/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 14:50
 *  @description
 */
import { BOLLInputs } from '../../options.indicator'

export type BOLLState = {
  sum: number;
  sqrSum: number;
  position: number;
}

export const defaultBOLLState: BOLLState = {
  sum: 0,
  sqrSum: 0,
  position: 0,
}

const keys = ['low', 'index', 'high'] as const

export type BOLLValue = Record<typeof keys[number] | 'date', number>

/**
 * 算法描述
 * 在指定period-N, 方差系数K值后，方差值的计算如下
 *  1.计算前N个点的close(或（close + high + low）/ 3)和
 *  2.计算前N个点的close ** 2和
 *  3.利用1，2计算的结果的均值计算标准方差
 *  4.利用3的结果配合方差系数计算up线以及down线
 * @param quotes
 * @param inputs
 * @param defaults
 * @param field
 * @see https://www.investopedia.com/terms/b/bollingerbands.asp
 */
export function calcBOLL (
  quotes: Bar[],
  inputs: BOLLInputs,
  defaults = defaultBOLLState,
  field: BarValueField = 'close',
) {
  const channels = [-inputs.K, 0, inputs.K]
  const values: BOLLValue[] = []

  let sum = defaults.sum
  let sqrSum = defaults.sqrSum

  const fromIndex = inputs.period - 1
  const count = quotes.length

  for (let i = defaults.position; i < count; i++) {
    const quote = quotes[i]
    let value = NaN

    sum += quote[field]
    sqrSum += quote[field] ** 2

    const itemValue: BOLLValue = {
      date: quote.date,
      low: NaN,
      high: NaN,
      index: NaN,
    }

    if (i >= fromIndex) {
      for (let k = 0; k < channels.length; k++) {
        const span = channels[k]
        const mean = sum / inputs.period
        const deviation = Math.sqrt((sqrSum - sum ** 2 / inputs.period) / (inputs.period - 1))
        value = mean + deviation * span

        itemValue[keys[k]] = value
      }

      const value0 = quotes[i - fromIndex][field]
      sum -= value0
      sqrSum -= value0 ** 2
    } else {
      for (let k = 0; k < channels.length; k++) {
        itemValue[keys[k]] = value
      }
    }

    values.push(itemValue)
  }

  return {
    value: values,
    state: {
      sum,
      sqrSum,
      position: count,
    },
  }
}
