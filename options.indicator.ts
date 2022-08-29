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

export type EMAInputs = {
  periods: {
    period: number;
    color: Color;
    offset?: number;
  } []
}

export const emaInputs: EMAInputs = {
  periods: [
    {
      period: 14,
      offset: 0,
      color: themeOptions.primaryColor,
    },
  ],
}

export type BOLLInputs = {
  period: number;
  K: number;
  bandColor: Color;
  channelColor: Color;
}

export const bollInputs: BOLLInputs = {
  period: 20,
  K: 2,
  bandColor: themeOptions.primaryColor,
  channelColor: themeOptions.dottedColor,
}

export type SARInputs = {
  af: number;
  max: number;
}

export const sarInputs: SARInputs = {
  af: 0.02,
  max: 0.2,
}

export type KDJInputs = {
  period: number;
  slowPeriod: number;
  smoothPeriod: number;
}

export const kdjInputs: KDJInputs = {
  period: 14,
  slowPeriod: 3,
  smoothPeriod: 3,
}

export type RSIInputs = {
  periods: number[];
}

export const rsiInputs: RSIInputs = {
  periods: [14],
}

export type TrendInputs = {
  period: number;
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
}

export const trendInputs: TrendInputs = {
  period: 3,
  fastPeriod: 5,
  slowPeriod: 8,
  signalPeriod: 5,
}
