/**
 *  @date:        2022/8/20 01:13
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/indicator/all.ts
 *  @description:
 **/
import { MACDInputs, MAInputs } from '../../options.indicator'
import { IIndicatorCtor } from '../interface/IIndicator'
import MA from './ma/MA'
import MACD from './macd/MACD'

export type IndicatorInputs = {
  ma: MAInputs;
  macd: MACDInputs;
}

export type IndicatorNames = keyof IndicatorInputs

export const indicators: Record<IndicatorNames, IIndicatorCtor> = {
  ma: MA,
  macd: MACD,
}
