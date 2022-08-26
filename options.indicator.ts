/**
 *  @file         /options.indicator.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/26 16:19
 *  @description
 */
import { Color, themeOptions } from './src/theme'

export type MAInputs = {
  periods: {
    period: number,
    color: Color,
  } [];
}

export const maInputs: MAInputs = {
  periods: [
    {
      period: 14,
      color: themeOptions.primaryColor,
    },
  ],
}

export type MACDInputs = {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
  resultColor: Color;
  signalColor: Color;
  histRaiseColor: Color;
  histFallColor: Color;
}

export const macdInputs: MACDInputs = {
  fastPeriod: 12,
  slowPeriod: 26,
  signalPeriod: 9,
  resultColor: themeOptions.primaryColor,
  signalColor: themeOptions.dottedColor,
  histRaiseColor: themeOptions.bullishColor,
  histFallColor: themeOptions.bearishColor,
}
