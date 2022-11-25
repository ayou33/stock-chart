/**
 *  @file         stock-chart/drawing/drawings.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/31 14:07
 *  @description
 */
import { ArrowOptions } from './Arrow'
import { PositionLineOptions } from './PositionLine'
import { TextOptions } from './Text'

// export type DrawingType = 'position' | 'segment' | 'arrow' | 'text'

export type DrawingOptions = {
  position: PositionLineOptions,
  segment: PositionLineOptions,
  arrow: ArrowOptions,
  text: TextOptions,
}

export type DrawingType = keyof DrawingOptions

export type DrawingOption = DrawingOptions[DrawingType]
