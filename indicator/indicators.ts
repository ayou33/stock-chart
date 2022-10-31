/**
 *  @date:        2022/8/20 01:13
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/indicator/all.ts
 *  @description:
 **/
import {
  BOLLInputs, CCIInputs, EMAInputs,
  KDJInputs, MACDInputs, MAInputs,
  RSIInputs, SARInputs, TrendInputs,
} from '../options.indicator'
import { IIndicatorCtor } from '../interface/IIndicator'
import BOLL from './boll/BOLL'
import CCI from './cci/CCI'
import EMA from './ema/EMA'
import KDJ from './kdj/KDJ'
import MA from './ma/MA'
import MACD from './macd/MACD'
import RSI from './rsi/RSI'
import SAR from './sar/SAR'
import Trend from './trend/Trend'

export type IndicatorInputs = {
  ma: MAInputs;
  ema: EMAInputs;
  macd: MACDInputs;
  boll: BOLLInputs;
  sar: SARInputs;
  kdj: KDJInputs;
  rsi: RSIInputs;
  cci: CCIInputs;
  trend: TrendInputs;
}

export type IndicatorNames = keyof IndicatorInputs

export const indicators: Record<IndicatorNames, IIndicatorCtor> = {
  ma: MA,
  ema: EMA,
  macd: MACD,
  boll: BOLL,
  sar: SAR,
  kdj: KDJ,
  rsi: RSI,
  cci: CCI,
  trend: Trend,
}
