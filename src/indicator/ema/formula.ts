/**
 *  @file         src/indicator/ema/formula.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:29
 *  @description
 */

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
