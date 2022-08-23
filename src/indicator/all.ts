/**
 *  @date:        2022/8/20 01:13
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/indicator/all.ts
 *  @description:
 **/
import { IIndicatorCtor } from '../interface/IIndicator'
import MA, { MAInputs } from './ma/MA'
import MACD, { MACDInputs } from './macd/MACD'

export type IndicatorInputs = {
  ma: MAInputs;
  macd: MACDInputs;
}

export type IndicatorNames = keyof IndicatorInputs

export const indicators: Record<IndicatorNames, IIndicatorCtor> = {
  ma: MA,
  macd: MACD,
}
