/**
 *  @file         stock-chart/drawing/drawings.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/31 14:07
 *  @description
 */
import { PositionLineOptions } from './PositionLine'

// export type DrawingType = 'position' | 'segment' | 'arrow' | 'text'

export type DrawingOptions = {
  position: PositionLineOptions,
  segment: PositionLineOptions,
  arrow: PositionLineOptions,
  text: PositionLineOptions,
}

export type DrawingType = keyof DrawingOptions
