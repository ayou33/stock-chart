/**
 *  formula.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { add, reduce, is, map } from 'ramda'

const makeMACalculator = (period: number, factors: number[] = []) => {
  const addends: number[] = factors.slice(-period)
  let acc = reduce(add, 0, addends)

  return (quote: number, i: number) => {
    let value = NaN

    if (is(Number, quote)) {
      acc += quote
      addends.push(quote)

      if (i >= period) { // 更新加数数组 计算的新的ma
        acc -= addends.shift() ?? 0
        value = acc / period
      } else if (i === period - 1) { // ma起始值
        value = acc / (i + 1)
      }
    }

    return value
  }
}

export type MAState = {
  addends: number[];
  index: number;
}

const dftSMAState: MAState = {
  addends: [],
  index: 0,
}

/**
 * 指定周期period后，当前点SMA计算如下
 *  前period个点的平均值即为当前点的SMA值
 * @param bars
 * @param periods
 * @param defaults
 * @param name
 * @param field
 */
export function calcMA (
  bars: Bar[],
  periods: number[] = [14],
  defaults: MAState = dftSMAState,
  name = 'ma' as const,
  field: BarValueField = 'close',
) {
  const mas: { [p in typeof name | 'date']: number; }[][] = map(() => [], periods)
  const calculators = map(p => makeMACalculator(p, defaults.addends), periods)
  const count = bars.length
  const from = defaults.addends.length < Math.max(...periods) ? defaults.addends.length : defaults.index

  for (let k = 0; k < calculators.length; k++) {
    const calc = calculators[k]

    for (let i = from; i < count; i++) {
      const quote = bars[i]
      const ma = calc(quote[field], i)


      mas[k].push({
        [name]: ma,
        date: quote.date,
      })
    }
  }

  return mas
}

export default calcMA
