/**
 *  formula.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { add, reduce, is, map } from 'ramda'

const makeMACalculator = (period: number) => {
  const addends: number[] = []
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

type Output = Record<`ma_${number}` | 'date', number>

/**
 * 指定周期period后，当前点SMA计算如下
 *  前period个点的平均值即为当前点的SMA值
 * @param bars
 * @param periods
 * @param field
 */
export function calcMA (
  bars: Bar[],
  periods: number[],
  field: BarValueField = 'close',
) {
  const ma: Output[] = []

  const calculators = map(p => ({
    period: p,
    compute: makeMACalculator(p),
  }), periods)
  const count = bars.length

  for (let i = 0; i < count; i++) {
    const quote = bars[i]

    const value: Output = {
      date: quote.date,
    }

    for (let k = 0; k < calculators.length; k++) {
      const calculator = calculators[k]
      value[`ma_${calculator.period}`] = calculator.compute(quote[field], i)
    }

    ma.push(value)
  }

  return ma
}

export default calcMA
