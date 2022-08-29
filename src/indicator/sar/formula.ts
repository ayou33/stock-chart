/**
 *  @file         src/indicator/sar/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/29 15:47
 *  @description
 */
import { SARInputs } from '../../../options.indicator'

export type SARState = {
  af: number;
  ep: number;
  isRise: number;
  sar: number;
}

export type SARValue = {
  sar: number;
  date: number;
}

export function calcSAR (
  bars: Bar[],
  inputs: SARInputs,
  defaults: SARState | null = null,
) {
  const values: SARValue[] = []
  const INIT_VALUE = Math.random()
  // 加速因子
  let af = defaults?.af ?? 0
  // 极值
  let ep = defaults?.ep ?? INIT_VALUE
  // 判断是上涨还是下跌  false：下跌
  let isRise = defaults?.isRise ?? false

  let value = defaults?.sar ?? 0

  for (let i = 0; i < bars.length - 1; i++) {
    // 上一个周期的sar
    const last = value
    const bar = bars[i]

    if (isRise) {
      // 上涨
      if (ep === INIT_VALUE || ep < bar.high) {
        ep = bar.high
        af = Math.min(af + inputs.af, inputs.max)
      }
      value = last + af * (ep - last)
      const lowestPrior2Lows = Math.min(bars[(Math.max(1, i) - 1)].low, bar.low)
      if (value > bars[i + 1].low) {
        value = ep
        // 重新初始化
        af = 0
        ep = INIT_VALUE
        isRise = !isRise
      } else if (value > lowestPrior2Lows) {
        value = lowestPrior2Lows
      }
    } else {
      if (ep === INIT_VALUE || ep > bar.low) {
        ep = bar.low
        af = Math.min(af + inputs.af, inputs.max)
      }
      value = last + af * (ep - last)

      const highestPrior2Highs = Math.max(bars[(Math.max(1, i) - 1)].high, bar.high)

      if (value < bars[i + 1].high) {
        value = ep
        // 重新初始化
        af = 0
        ep = INIT_VALUE
        isRise = !isRise
      } else if (value < highestPrior2Highs) {
        value = highestPrior2Highs
      }
    }

    values.push({
      sar: value,
      date: bars[i + 1].date,
    })
  }

  return {
    value: values,
    state: {
      value,
      af,
      ep,
      isRise,
    },
  }
}
