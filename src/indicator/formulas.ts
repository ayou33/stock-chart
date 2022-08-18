/**
 * @author zjc[beica1@outook.com]
 * @date 2021/10/18 11:19
 * @description
 *   formulas.ts of WeTrade
 */
import * as d3 from 'd3'
import * as R from 'ramda'
import { isNumeric } from '../helper'
import { Bar, Candle } from '../types'

export type BOLLState = {
  sum: number;
  sqrSum: number;
  index: number;
}

export const defaultBOLLState: BOLLState = {
  sum: 0,
  sqrSum: 0,
  index: 0,
}

/**
 * 算法描述
 * 在指定period-N, 方差系数K值后，方差值的计算如下
 *  1.计算前N个点的close(或（close + high + low）/ 3)和
 *  2.计算前N个点的close ** 2和
 *  3.利用1，2计算的结果的均值计算标准方差
 *  4.利用3的结果配合方差系数计算up线以及down线
 * @param quotes
 * @param defaults
 * @param period
 * @param K
 * @param field
 * @param name
 * @see https://www.investopedia.com/terms/b/bollingerbands.asp
 */
export function calcBOLL (
  quotes: Bar[],
  period = 20,
  K = 2,
  defaults = defaultBOLLState,
  field = 'c',
  name = 'boll',
) {
  const channels = [-K, 0, K]
  const bands: Bar[][] = [[], [], []]

  let sum = defaults.sum
  let sqrSum = defaults.sqrSum

  const fromIndex = period - 1
  const count = quotes.length
  for (let i = defaults.index; i < count; i++) {
    const quote = quotes[i][field]
    let value = NaN

    sum += quote
    sqrSum += quote ** 2

    if (i >= fromIndex) {
      for (let k = 0; k < channels.length; k++) {
        const span = channels[k]
        const mean = sum / period
        const deviation = Math.sqrt((sqrSum - sum ** 2 / period) / (period - 1))
        value = mean + deviation * span

        bands[k].push({
          t: quotes[i].t,
          c: value,
        })
      }

      const value0 = quotes[i - fromIndex][field]
      sum -= value0
      sqrSum -= value0 ** 2
    } else {
      for (let k = 0; k < channels.length; k++) {
        bands[k].push({
          t: quotes[i].t,
          c: value,
        })
      }
    }
  }

  return {
    value: bands,
    state: {
      sum,
      sqrSum,
      index: count,
    },
  }
}

const makeMACalculator = (period: number, factors: number[] = []) => {
  const addends: number[] = [...factors]
  let acc = R.reduce(R.add, 0, addends)

  return (quote: number, i: number) => {
    let value = NaN

    if (isNumeric(quote)) {
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

/**
 * 指定周期period后，当前点SMA计算如下
 *  前period个点的平均值即为当前点的SMA值
 * @param quotes
 * @param mix
 * @param name
 * @param field
 */
export function calcMA (
  quotes: Bar[],
  mix: number[] | number = 14,
  name = 'ma',
  field = 'c',
) {
  const periods = typeof mix === 'number' ? [mix] : mix
  const mas: Bar[][] = R.map(() => [], periods)

  const calculators = R.map(makeMACalculator, periods)
  const count = quotes.length

  for (let k = 0; k < calculators.length; k++) {
    const calc = calculators[k]
    const key = `${name}_${periods[k]}`

    for (let i = 0; i < count; i++) {
      const quote = quotes[i]
      const ma = calc(quote[field], i)
      quote[key] = ma
      mas[k].push({
        t: quote.t,
        c: ma,
      })
    }
  }

  return mas
}

const makeEMACalculator = (period: number, fromEMA = 0) => {
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

export type EMAInput = {
  period: number;
  offset?: number;
}

export type EMAState = {
  ema: number[];
  index: number;
}

export const defaultEMAState = {
  ema: [],
  index: 0,
}

const _inputTransform = R.ifElse(R.is(Number), R.objOf('period'), R.identity)

export function calcEMA (
  quotes: Bar[],
  inputs: EMAInput[] | EMAInput | number | number[] = 9,
  defaults: EMAState = defaultEMAState,
  name = 'ema',
  field = 'c',
) {
  const _inputs: EMAInput[] = R.map(_inputTransform, Array.isArray(inputs) ? inputs : [inputs])
  const count = quotes.length

  if (quotes.length < Math.max(...R.pluck('period', _inputs))) {
    return {
      value: [],
      state: defaults,
    }
  }

  const emas: Bar[][] = R.map(() => [], _inputs)

  for (let k = 0; k < _inputs.length; k++) {
    const { period, offset = 0 } = _inputs[k]
    const key = `${name}_${period}_${offset}`
    const calc = makeEMACalculator(period, defaults.ema[k] ?? 0)

    for (let i = defaults.index; i < count; i++) {
      const quote = quotes[i]
      const val = quote[field]
      const ema = calc(val, i)
      if (i + offset >= 0 && i + offset < count) {
        quotes[i + offset][key] = ema
        emas[k].push({
          t: quote.t,
          c: ema,
        })
      }
    }
  }

  return {
    value: emas,
    state: {
      ema: R.map(a => R.last(a)?.c ?? 0, emas),
      index: count,
    },
  }
}

export type MACDStudyInputs = {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  fastColor: string;
  slowColor: string;
}

export type MACDState = {
  fast: number;
  slow: number;
  signal: number;
  hist: number;
  index: number;
}

const defaultMACD: MACDState = {
  fast: 0,
  slow: 0,
  signal: 0,
  hist: 0,
  index: 0,
}

export function calcMACD (
  quotes: Bar[],
  options?: MACDStudyInputs,
  defaults = defaultMACD,
  name = 'macd',
  field = 'c',
) {
  const {
    fastPeriod = 12,
    slowPeriod = 26,
    signalPeriod = 9,
  } = options ?? {}
  const period = Math.max(fastPeriod, slowPeriod, signalPeriod)

  if (quotes.length < period + 1) {
    return {
      value: [],
      state: defaults,
    }
  }

  const calcFastEMA = makeEMACalculator(fastPeriod, defaults.fast)
  const calcSlowEMA = makeEMACalculator(slowPeriod, defaults.slow)
  const calcSignalEMA = makeEMACalculator(signalPeriod, defaults.signal)

  const macd: Bar[][] = [[], [], []]

  let fast = NaN
  let slow = NaN
  let macdValue = NaN
  let signal = NaN
  let hist = NaN

  const count = quotes.length
  for (let i = defaults.index; i < count; i++) {
    const quote = quotes[i]

    const value = quote[field]

    fast = calcFastEMA(value, i)
    slow = calcSlowEMA(value, i)

    if (i >= period - 1) {
      macdValue = fast - slow
      signal = calcSignalEMA(macdValue, i - period + 1)

      if (signal) {
        hist = macdValue - signal
      }
    }

    quote[name] = macdValue

    macd[0].push({
      t: quote.t,
      c: macdValue,
    })

    macd[1].push({
      t: quote.t,
      c: signal,
    })

    macd[2].push({
      t: quote.t,
      c: hist,
    })
  }

  return {
    value: macd,
    state: {
      fast,
      slow,
      signal,
      hist,
      index: count, // 记录下一个计算的位置，而不是已经计算过的当前位置
    },
  }
}

function makeStochasticCalculator (
  quotes: Bar[], period: number, field: string,
  dftHigh = 0,
  dftLow = 1000000,
) {
  let high = dftHigh
  let low = dftLow

  return (i: number) => {
    // 计算指定周期内的最大/小值
    for (let k = i - period + 1; k <= i; k++) {
      const quote = quotes[k]
      low = Math.min(low, quote.l ?? quote.c)
      high = Math.max(high, quote.h ?? quote.c)
    }

    return {
      value: (quotes[i][field] - low) / (high - low) * 100,
      high,
      low,
    }
  }
}

export type StochasticStudyInputs = {
  period: number;
  slowPeriod: number;
  smoothPeriod: number;
}
export type StochasticState = {
  low: number;
  high: number;
  maAddends: number[];
  index: number;
}

export const defaultStochasticState: StochasticState = {
  low: 1000000,
  high: 0,
  maAddends: [],
  index: 0,
}

export function calcStochastic (
  quotes: Bar[],
  options: StochasticStudyInputs,
  defaults = defaultStochasticState,
  name = 'kdj',
  field = 'c',
) {
  const {
    period = 14,
    smoothPeriod = 3,
  } = options ?? {}

  if (quotes.length < Math.max(period, smoothPeriod) + 1) {
    return {
      value: [],
      state: defaults,
    }
  }

  const calcSlowMA = makeMACalculator(3, defaults.maAddends)
  const calcStochastic = makeStochasticCalculator(
    quotes, period, field, defaults.high, defaults.low)
  const count = quotes.length

  const values: Bar[][] = [[], []]

  let low = NaN
  let high = NaN
  const valueFrom = period - 1

  for (let i = defaults.index; i < count; i++) {
    const quote = quotes[i]
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

    quote[name] = index
    quote[`${name}_slow_3`] = slow

    values[0].push({
      t: quote.t,
      c: index,
    })

    values[1].push({
      t: quote.t,
      c: slow,
    })
  }

  return {
    value: values,
    state: {
      high,
      low,
      maAddends: [],
      index: count,
    },
  }
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

export type RSIState = {
  rsi: { gain: number; loss: number }[];
  index: number;
}

export const defaultRSIState: RSIState = {
  rsi: [],
  index: 0,
}

export function calcRSI (
  quotes: Bar[],
  mix: number | number[] = 14,
  defaults = defaultRSIState,
  name = 'rsi',
  field = 'c',
) {
  const periods = typeof mix === 'number' ? [mix] : mix

  if (quotes.length < Math.max(...periods) + 1) {
    return {
      value: [],
      state: defaults,
    }
  }

  const rsiState: RSIState['rsi'] = []
  const rsiValues: Bar[][] = R.map(() => [], periods)

  const count = quotes.length

  let gain = 0
  let loss = 0

  for (let k = 0; k < periods.length; k++) {
    const calc = makeRSICalculator(periods[k], defaults.rsi[k]?.gain, defaults.rsi[k]?.loss)

    for (let i = defaults.index; i < count; i++) {
      const quote = quotes[i]
      const change = quote[field] - quotes[i - 1]?.[field]
      const { value: rsi, gain: g, loss: l } = calc(change, i)
      gain = g
      loss = l
      rsiValues[k].push({
        t: quote.t,
        c: rsi,
      })
      quote[`${name}_${periods[k]}`] = rsi
    }

    rsiState[k] = {
      gain,
      loss,
    }
  }

  return {
    value: rsiValues,
    state: {
      index: count,
      rsi: rsiState,
    },
  }
}

const calcTP = (bar: Bar, field = 'c') => {
  const close = bar[field]
  return (close + (bar?.h ?? close) + (bar?.l ?? close)) / 3
}

export function calcCCI (
  quotes: Bar[],
  period = 20,
  name = 'cci',
  field = 'c',
) {
  const count = quotes.length

  const calcMa = makeMACalculator(period)

  const cci: Bar[] = []
  for (let i = 0; i < count; i++) {
    const quote = quotes[i]
    const tp = calcTP(quote, field) // typical price
    const tpMA = calcMa(tp, i)

    let md = 0
    let cciValue = NaN

    if (i >= period - 1) {
      for (let j = 0; j < period; j++) {
        md += Math.abs(calcTP(quotes[i - j], field) - tpMA)
      }

      cciValue = (tp - tpMA) / (0.015 * md / period)
    }

    quote[name] = cciValue

    cci.push({
      t: quote.t,
      c: cciValue,
    })
  }

  return cci
}

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
  field = 'c',
  period = 13,
  kPeriod = 5,
  dPeriod = 5,
) => {
  const factors = [...defaults.factors]

  let lLow = Infinity
  let hHigh = -Infinity

  const updateExtent = () => {
    lLow = d3.min(factors, d => d.l) ?? Infinity
    hHigh = d3.max(factors, d => d.h) ?? -Infinity
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

      const rsv = (close - lLow) / (hHigh - lLow)
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

const calcVP = (bar: Bar, field = 'c') => {
  const close = bar[field]
  return ((bar.o ?? close) + (bar.h ?? close) + (bar.l ?? close) + close) / 4
}

export type TrendStudyInputs = {
  period: number;
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
}

export type TrendDescriber = {
  h: number;
  l: number;
  t: number;
  trend: number;
  turn: number;
}

export type TrendState = {
  avg: number;
  fast: number;
  slow: number;
  signal: number;
  trend: number;
  index: number;
  point: TrendPointState;
}

export const defaultTrendState: TrendState = {
  avg: 0,
  fast: 0,
  slow: 0,
  signal: 0,
  trend: NaN,
  index: 0,
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
 * @param options
 * @param defaults
 * @param name
 * @param field
 */
export function calcTrend (
  quotes: Bar[],
  options?: TrendStudyInputs,
  defaults = defaultTrendState,
  name = 'trend',
  field = 'c',
) {
  const { period = 3, fastPeriod = 5, slowPeriod = 8, signalPeriod = 5 } = options ?? {}

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

  const trendSet: TrendDescriber[] = []

  let vpEMA3 = 0
  let fast = 0
  let slow = 0
  let signal = 0
  let trend = NaN
  let turn = NaN
  let pointState = defaults.point

  for (let i = defaults.index; i < count; i++) {
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

        quote[name] = trend
      }
    }

    const { value, state } = calcTurningPoint(quote, i)

    turn = value

    if (i === count) {
      pointState = state
    }

    trendSet.push({
      h: quote.h ?? quote[field],
      l: quote.l ?? quote[field],
      t: quote.t,
      trend,
      turn,
    })
  }

  return {
    value: trendSet,
    state: {
      avg: vpEMA3,
      fast,
      slow,
      signal,
      trend,
      index: count,
      point: pointState,
    },
  }
}

export type SARBar = Candle & {
  af: number;
  ep: number;
  isRise: number;
}

export function calcSAR (
  list: Candle[],
  defaults: SARBar | null = null,
  AF = 0.02,
  AFMax = 0.2,
) {
  const points: SARBar[] = []
  const INIT_VALUE = Math.random()
  // 加速因子
  let af = defaults?.af ?? 0
  // 极值
  let ep = defaults?.ep ?? INIT_VALUE
  // 判断是上涨还是下跌  false：下跌
  let isRise = defaults?.isRise ?? false

  let SAR = defaults?.c ?? 0

  for (let i = 0; i < list.length - 1; i++) {
    // 上一个周期的sar
    const priorSAR = SAR
    const bar = list[i]

    if (isRise) {
      // 上涨
      if (ep === INIT_VALUE || ep < bar.h) {
        ep = bar.h
        af = Math.min(af + AF, AFMax)
      }
      SAR = priorSAR + af * (ep - priorSAR)
      const lowestPrior2Lows = Math.min(list[(Math.max(1, i) - 1)].l, bar.l)
      if (SAR > list[i + 1].l) {
        SAR = ep
        // 重新初始化
        af = 0
        ep = INIT_VALUE
        isRise = !isRise
      } else if (SAR > lowestPrior2Lows) {
        SAR = lowestPrior2Lows
      }
    } else {
      if (ep === INIT_VALUE || ep > bar.l) {
        ep = bar.l
        af = Math.min(af + AF, AFMax)
      }
      SAR = priorSAR + af * (ep - priorSAR)
      const highestPrior2Highs = Math.max(list[(Math.max(1, i) - 1)].h, bar.h)
      if (SAR < list[i + 1].h) {
        SAR = ep
        // 重新初始化
        af = 0
        ep = INIT_VALUE
        isRise = !isRise
      } else if (SAR < highestPrior2Highs) {
        SAR = highestPrior2Highs
      }
    }

    points.push({
      ...bar,
      af,
      ep,
      isRise: Number(isRise),
      c: SAR,
      t: list[i + 1].t,
    })
  }
  return points
}
