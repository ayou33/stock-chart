/**
 *  @date:        2022/8/20 01:13
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/indicator/all.ts
 *  @description:
 **/
import { BOLLInputs, EMAInputs, MACDInputs, MAInputs } from '../../options.indicator'
import { IIndicatorCtor } from '../interface/IIndicator'
import BOLL from './boll/BOLL'
import EMA from './ema/EMA'
import MA from './ma/MA'
import MACD from './macd/MACD'

export type IndicatorInputs = {
  ma: MAInputs;
  ema: EMAInputs;
  macd: MACDInputs;
  boll: BOLLInputs;
}

export type IndicatorNames = keyof IndicatorInputs

export const indicators: Record<IndicatorNames, IIndicatorCtor> = {
  ma: MA,
  ema: EMA,
  macd: MACD,
  boll: BOLL,
}
