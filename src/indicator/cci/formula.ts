/**
 *  @file         src/indicator/cci/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:52
 *  @description
 */
import { makeMACalculator } from '../ma/formula'

const calcTP = (bar: Bar, field: BarValueField = 'close') => {
  const close = bar[field]
  return (close + (bar?.high ?? close) + (bar?.low ?? close)) / 3
}

export type CCIValue = {
  index: number;
  date: number;
}

export function calcCCI (
  bars: Bar[],
  period: number,
  field: BarValueField = 'close',
) {
  const calcMa = makeMACalculator(period)

  const values: CCIValue[] = []

  for (let i = 0, l = bars.length; i < l; i++) {
    const quote = bars[i]
    const tp = calcTP(quote, field) // typical price
    const tpMA = calcMa(tp, i)

    let md = 0
    let value = NaN

    if (i >= period - 1) {
      for (let j = 0; j < period; j++) {
        md += Math.abs(calcTP(bars[i - j], field) - tpMA)
      }

      value = (tp - tpMA) / (0.015 * md / period)
    }

    values.push({
      index: value,
      date: quote.date,
    })
  }

  return values
}
