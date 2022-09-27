/**
 *  @file         stock-chart/super/AbstractDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 18:43
 *  @description
 */
import Event from '../base/Event'

type DrawingEvents = 'move' | 'click' | 'cancel' | 'done' | 'transform' | 'focus' | 'blur'

class AbstractDrawing<E extends string = never> extends Event<DrawingEvents | E> {}

export default AbstractDrawing
